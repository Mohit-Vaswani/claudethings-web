"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ToolNav,
  ToolFooter,
  KitsUpsell,
  FaqSection,
  useToolPageFx,
  renderInline,
} from "@/app/components/toolPage";
import { apiCost, fmtUsd, fmtCompact, priceForModel, PRICES_AS_OF } from "@/app/lib/claudePricing";

/**
 * Claude Code Wrapped — paste `npx ccusage@latest --json` output, get a
 * shareable Wrapped card. 100% client-side: parsing, stats, and the PNG are
 * all done in the browser.
 */

/* ----------------------------- ccusage parsing ----------------------------- */

interface PeriodEntry {
  label: string; // date / month / session id
  isoDate?: string; // for streak math (daily only)
  tokens: { input: number; output: number; cacheWrite: number; cacheRead: number };
  totalTokens: number;
  cost: number;
  models: Record<string, { tokens: number; cost: number }>;
}

interface WrappedStats {
  granularity: "daily" | "monthly" | "session";
  entries: PeriodEntry[];
  totalTokens: number;
  input: number;
  output: number;
  cacheWrite: number;
  cacheRead: number;
  totalCost: number;
  favoriteModel: string;
  favoriteModelShare: number; // 0..1 of cost
  busiest: { label: string; cost: number; tokens: number } | null;
  streak: number; // longest consecutive-day run (daily only)
  activePeriods: number;
  avgCostPerActive: number;
  persona: { name: string; emoji: string; line: string };
}

const num = (v: unknown): number => (typeof v === "number" && isFinite(v) ? v : 0);

function entryFromRaw(raw: Record<string, unknown>, label: string, isoDate?: string): PeriodEntry {
  const tokens = {
    input: num(raw.inputTokens),
    output: num(raw.outputTokens),
    cacheWrite: num(raw.cacheCreationTokens),
    cacheRead: num(raw.cacheReadTokens),
  };
  const totalTokens =
    num(raw.totalTokens) || tokens.input + tokens.output + tokens.cacheWrite + tokens.cacheRead;

  const models: PeriodEntry["models"] = {};
  const breakdowns = raw.modelBreakdowns;
  if (Array.isArray(breakdowns)) {
    for (const b of breakdowns as Array<Record<string, unknown>>) {
      const name = String(b.modelName ?? b.model ?? "unknown");
      const t =
        num(b.inputTokens) + num(b.outputTokens) + num(b.cacheCreationTokens) + num(b.cacheReadTokens);
      const c =
        num(b.cost) ||
        apiCost(name, {
          input: num(b.inputTokens),
          output: num(b.outputTokens),
          cacheWrite: num(b.cacheCreationTokens),
          cacheRead: num(b.cacheReadTokens),
        });
      const cur = models[name] ?? { tokens: 0, cost: 0 };
      models[name] = { tokens: cur.tokens + t, cost: cur.cost + c };
    }
  } else if (Array.isArray(raw.modelsUsed)) {
    for (const m of raw.modelsUsed as unknown[]) {
      const name = String(m);
      models[name] = models[name] ?? { tokens: 0, cost: 0 };
    }
  }

  const cost = num(raw.totalCost) || num(raw.cost) || apiCost(Object.keys(models)[0] ?? "sonnet", tokens);

  return { label, isoDate, tokens, totalTokens, cost, models };
}

/** Accepts the JSON printed by `ccusage --json`, `ccusage monthly --json`, or `ccusage session --json`. */
function parseCcusage(src: string): { stats: WrappedStats | null; error: string | null } {
  const trimmed = src.trim();
  if (!trimmed) return { stats: null, error: null };

  // Pull the outermost JSON object even if the paste has extra terminal noise around it.
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return {
      stats: null,
      error:
        "That doesn't look like JSON. Run `npx ccusage@latest --json` and paste the whole output (the table view isn't parseable — add the `--json` flag).",
    };
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    return {
      stats: null,
      error:
        "Couldn't parse that JSON — it may be truncated. Re-run `npx ccusage@latest --json` and copy the complete output.",
    };
  }

  let granularity: WrappedStats["granularity"] = "daily";
  let entries: PeriodEntry[] = [];

  if (Array.isArray(data.daily)) {
    granularity = "daily";
    entries = (data.daily as Array<Record<string, unknown>>).map((d) =>
      entryFromRaw(d, String(d.date ?? ""), String(d.date ??  ""))
    );
  } else if (Array.isArray(data.monthly)) {
    granularity = "monthly";
    entries = (data.monthly as Array<Record<string, unknown>>).map((d) =>
      entryFromRaw(d, String(d.month ?? ""))
    );
  } else if (Array.isArray(data.sessions)) {
    granularity = "session";
    entries = (data.sessions as Array<Record<string, unknown>>).map((d) =>
      entryFromRaw(d, String(d.sessionId ?? d.session ?? ""), String(d.lastActivity ?? "") || undefined)
    );
  } else {
    return {
      stats: null,
      error:
        "JSON parsed, but no `daily`, `monthly`, or `sessions` array found. Paste the output of `npx ccusage@latest --json`.",
    };
  }

  if (entries.length === 0) {
    return { stats: null, error: "ccusage returned no usage entries — nothing to wrap yet. Go burn some tokens!" };
  }

  // Totals: prefer ccusage's own totals block, fall back to summing entries.
  const totalsRaw = (data.totals ?? {}) as Record<string, unknown>;
  const sum = (f: (e: PeriodEntry) => number) => entries.reduce((a, e) => a + f(e), 0);
  const input = num(totalsRaw.inputTokens) || sum((e) => e.tokens.input);
  const output = num(totalsRaw.outputTokens) || sum((e) => e.tokens.output);
  const cacheWrite = num(totalsRaw.cacheCreationTokens) || sum((e) => e.tokens.cacheWrite);
  const cacheRead = num(totalsRaw.cacheReadTokens) || sum((e) => e.tokens.cacheRead);
  const totalTokens = num(totalsRaw.totalTokens) || input + output + cacheWrite + cacheRead;
  const totalCost = num(totalsRaw.totalCost) || sum((e) => e.cost);

  // Favorite model by cost across all entries.
  const modelAgg: Record<string, { tokens: number; cost: number }> = {};
  for (const e of entries) {
    for (const [name, v] of Object.entries(e.models)) {
      const cur = modelAgg[name] ?? { tokens: 0, cost: 0 };
      modelAgg[name] = { tokens: cur.tokens + v.tokens, cost: cur.cost + v.cost };
    }
  }
  let favoriteModel = "Claude";
  let favShare = 0;
  const ranked = Object.entries(modelAgg)
    .filter(([n]) => !n.includes("<synthetic>"))
    .sort((a, b) => b[1].cost - a[1].cost || b[1].tokens - a[1].tokens);
  if (ranked.length) {
    favoriteModel = ranked[0][0];
    const costBase = ranked.reduce((a, [, v]) => a + v.cost, 0);
    favShare = costBase > 0 ? ranked[0][1].cost / costBase : 0;
  }

  // Busiest period by cost.
  const busiestEntry = [...entries].sort((a, b) => b.cost - a.cost)[0];

  // Longest streak of consecutive days (daily granularity only).
  let streak = 0;
  if (granularity === "daily") {
    const days = [...new Set(entries.map((e) => e.isoDate).filter(Boolean))].sort() as string[];
    let run = 0;
    let prev: number | null = null;
    for (const d of days) {
      const t = Date.parse(`${d}T00:00:00Z`);
      run = prev !== null && t - prev === 86_400_000 ? run + 1 : 1;
      streak = Math.max(streak, run);
      prev = t;
    }
  }

  const activePeriods = entries.length;
  const avgCostPerActive = activePeriods ? totalCost / activePeriods : 0;

  const persona =
    totalCost >= 5000
      ? { name: "Datacenter Menace", emoji: "☄️", line: "Anthropic's capacity planning team knows you by name." }
      : totalCost >= 1000
      ? { name: "Token Furnace", emoji: "🔥", line: "You don't write code anymore. You review it." }
      : totalCost >= 250
      ? { name: "Power User", emoji: "⚡", line: "Claude Code is officially your co-founder." }
      : totalCost >= 50
      ? { name: "Daily Driver", emoji: "🚗", line: "A healthy habit. Your commits agree." }
      : { name: "Casual Committer", emoji: "🌱", line: "Just getting started — the tokens will come." };

  return {
    stats: {
      granularity,
      entries,
      totalTokens,
      input,
      output,
      cacheWrite,
      cacheRead,
      totalCost,
      favoriteModel,
      favoriteModelShare: favShare,
      busiest: busiestEntry
        ? { label: busiestEntry.label, cost: busiestEntry.cost, tokens: busiestEntry.totalTokens }
        : null,
      streak,
      activePeriods,
      avgCostPerActive,
      persona,
    },
    error: null,
  };
}

/* ------------------------------- card drawing ------------------------------- */

function shortModel(id: string): string {
  return priceForModel(id).label.replace("Claude ", "");
}

function drawCard(canvas: HTMLCanvasElement, s: WrappedStats) {
  const W = 1200;
  const H = 675;
  const dpr = 2;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  // background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#171310");
  bg.addColorStop(1, "#0e0b09");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ember glow top-right
  const glow = ctx.createRadialGradient(W - 140, 60, 0, W - 140, 60, 520);
  glow.addColorStop(0, "rgba(224,78,27,0.28)");
  glow.addColorStop(1, "rgba(224,78,27,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // teal glow bottom-left
  const glow2 = ctx.createRadialGradient(120, H - 80, 0, 120, H - 80, 460);
  glow2.addColorStop(0, "rgba(42,157,143,0.16)");
  glow2.addColorStop(1, "rgba(42,157,143,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // border
  ctx.strokeStyle = "rgba(244,237,227,0.14)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  const bone = "#F4EDE3";
  const boneDim = "rgba(244,237,227,0.62)";
  const boneFaint = "rgba(244,237,227,0.38)";
  const ember = "#FF6B35";
  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
  const sans = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

  // header
  ctx.fillStyle = ember;
  ctx.font = `600 22px ${mono}`;
  ctx.fillText("◆ CLAUDE CODE WRAPPED", 64, 88);
  const year = new Date().getFullYear();
  ctx.fillStyle = boneFaint;
  ctx.textAlign = "right";
  ctx.fillText(String(year), W - 64, 88);
  ctx.textAlign = "left";

  // persona
  ctx.fillStyle = boneDim;
  ctx.font = `500 20px ${sans}`;
  ctx.fillText(`${s.persona.emoji}  ${s.persona.name} — ${s.persona.line}`, 64, 136);

  // hero number: total tokens
  ctx.fillStyle = bone;
  ctx.font = `800 128px ${sans}`;
  ctx.fillText(fmtCompact(s.totalTokens), 60, 268);
  ctx.fillStyle = boneDim;
  ctx.font = `500 26px ${sans}`;
  ctx.fillText("tokens burned", 66, 308);

  // dollar value
  ctx.fillStyle = ember;
  ctx.font = `800 64px ${sans}`;
  const usd = s.totalCost >= 100 ? fmtUsd(s.totalCost, 0) : fmtUsd(s.totalCost);
  ctx.fillText(usd, 64, 398);
  ctx.fillStyle = boneDim;
  ctx.font = `500 22px ${sans}`;
  ctx.fillText("worth of usage at Claude API prices", 64, 432);

  // stat grid (right column)
  const stats: Array<[string, string]> = [
    ["Favorite model", `${shortModel(s.favoriteModel)}${s.favoriteModelShare > 0 ? ` · ${Math.round(s.favoriteModelShare * 100)}%` : ""}`],
    [
      s.granularity === "session" ? "Sessions" : s.granularity === "monthly" ? "Active months" : "Active days",
      String(s.activePeriods),
    ],
    ...(s.streak > 1 ? ([["Longest streak", `${s.streak} days straight`]] as Array<[string, string]>) : []),
    ...(s.busiest
      ? ([[
          s.granularity === "session" ? "Biggest session" : "Biggest day",
          `${s.busiest.label.slice(0, 18)} · ${fmtUsd(s.busiest.cost, 0)}`,
        ]] as Array<[string, string]>)
      : []),
    ["Cache reads", `${fmtCompact(s.cacheRead)} tokens`],
  ].slice(0, 5);

  let y = 130;
  const x = 760;
  for (const [label, value] of stats) {
    ctx.fillStyle = boneFaint;
    ctx.font = `600 17px ${mono}`;
    ctx.fillText(label.toUpperCase(), x, y);
    ctx.fillStyle = bone;
    ctx.font = `700 30px ${sans}`;
    ctx.fillText(value, x, y + 36);
    y += 88;
  }

  // footer bar
  ctx.fillStyle = "rgba(244,237,227,0.08)";
  ctx.fillRect(24, H - 92, W - 48, 68);
  ctx.fillStyle = boneDim;
  ctx.font = `500 20px ${sans}`;
  ctx.fillText("Get yours free →", 64, H - 50);
  ctx.fillStyle = ember;
  ctx.font = `700 20px ${mono}`;
  ctx.fillText("claudethings.com/claude-code-wrapped", 236, H - 50);
  ctx.fillStyle = boneFaint;
  ctx.textAlign = "right";
  ctx.font = `500 17px ${sans}`;
  ctx.fillText("100% client-side · nothing uploaded", W - 64, H - 50);
  ctx.textAlign = "left";
}

/* ----------------------------------- page ----------------------------------- */

const SAMPLE_HINT = `Run this in your terminal, then paste the output:

  npx ccusage@latest --json

(reads Claude Code's local logs — nothing is installed permanently)`;

export default function WrappedPage() {
  useToolPageFx();
  const [src, setSrc] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { stats, error } = useMemo(() => parseCcusage(src), [src]);

  // Draw whenever stats change (after the canvas is in the DOM).
  useEffect(() => {
    if (canvasRef.current && stats) drawCard(canvasRef.current, stats);
  }, [stats]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `claude-code-wrapped-${new Date().getFullYear()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const shareText = stats
    ? `I burned ${fmtCompact(stats.totalTokens)} tokens in Claude Code — ${
        stats.totalCost >= 100 ? fmtUsd(stats.totalCost, 0) : fmtUsd(stats.totalCost)
      } at API prices ${stats.persona.emoji}\n\nGet your Claude Code Wrapped (free):\nhttps://claudethings.com/claude-code-wrapped`
    : "";

  return (
    <>
      <ToolNav
        links={[
          { href: "#how", label: "How it works" },
          { href: "#stats", label: "What it measures" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#wrapped"
        ctaLabel="Get your Wrapped"
      />

      {/* HERO + TOOL */}
      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free Claude Code Wrapped · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            How many tokens did <span className="grad">you</span> burn?
          </h1>
          <p className="sub reveal-h d3">
            Paste your <b>ccusage</b> output and get a shareable <b>Claude Code Wrapped</b> card:
            total tokens, the <b>$ value at API prices</b>, your favorite model, longest streak,
            and biggest day. Nothing leaves your browser.
          </p>

          <div id="wrapped" className="val-tool reveal-h d4">
            <div className="val-panel val-editor">
              <div className="val-head">
                <span className="val-file">ccusage --json</span>
                <div className="val-actions">
                  <button className="val-mini" onClick={() => setSrc("")} disabled={!src}>
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                spellCheck={false}
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder={SAMPLE_HINT}
                aria-label="Paste your ccusage --json output"
              />
            </div>

            <div className="val-panel val-results" aria-live="polite">
              {!src.trim() ? (
                <div className="val-empty">
                  <div className="val-empty-ic">◆</div>
                  <p>
                    Run <code>npx ccusage@latest --json</code> in your terminal, paste the output
                    here, and your Wrapped card appears instantly.
                  </p>
                </div>
              ) : error ? (
                <div className="val-empty">
                  <div className="val-empty-ic">✕</div>
                  <p>{renderInline(error)}</p>
                </div>
              ) : stats ? (
                <>
                  <div className="val-verdict good">
                    <span className="v-ic">{stats.persona.emoji}</span>
                    <span>
                      {stats.persona.name} — {fmtCompact(stats.totalTokens)} tokens ·{" "}
                      {stats.totalCost >= 100 ? fmtUsd(stats.totalCost, 0) : fmtUsd(stats.totalCost)} at
                      API prices
                    </span>
                  </div>
                  <div className="val-counts">
                    <span className="c pass">{stats.activePeriods} {stats.granularity === "session" ? "sessions" : stats.granularity === "monthly" ? "months" : "days"} active</span>
                    {stats.streak > 1 && <span className="c warn">{stats.streak}-day streak</span>}
                    <span className="c">{shortModel(stats.favoriteModel)} fan</span>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <canvas
                      ref={canvasRef}
                      style={{ width: "100%", borderRadius: 12, border: "1px solid var(--line)" }}
                      aria-label="Your Claude Code Wrapped card"
                    />
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                      <button className="btn btn-primary" onClick={download}>
                        Download card (PNG)
                      </button>
                      <a
                        className="btn btn-ghost"
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Share on X →
                      </a>
                    </div>
                    <p style={{ color: "var(--bone-faint)", fontSize: 13, marginTop: 10 }}>
                      Tip: download the PNG and attach it to the post — flex responsibly.
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <p className="micro reveal-h d5">
            100% client-side · nothing uploaded · works with daily, monthly &amp; session ccusage
            reports
          </p>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="wrap center">
          <div className="tag fade">How it works</div>
          <h2 className="fade">Terminal → Wrapped card in 20 seconds</h2>
          <p className="lead fade">
            ccusage reads the local JSONL logs Claude Code already keeps on your machine and totals
            your tokens per model at API list prices. This page turns that JSON into a card.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["⌨️", "1. Run ccusage", "In any terminal: `npx ccusage@latest --json`. No install, no login — it reads `~/.claude` logs locally and prints a JSON summary."],
              ["📋", "2. Paste the output", "Copy the whole JSON blob into the box above. Parsing happens in your browser — your usage data never touches a server."],
              ["🖼️", "3. Share the card", "Download the PNG and post it. Tokens burned, $ at API prices, favorite model, streak — the full flex."],
            ].map(([ic, h, pt]) => (
              <div className="card fade" key={h}>
                <div className="ic">{ic}</div>
                <h3>{h}</h3>
                <p>{renderInline(pt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IT MEASURES */}
      <section id="stats">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">What it measures</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Every stat on the card, explained
            </h2>
          </div>
          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["Tokens burned", "Input + output + cache-write + cache-read tokens across every session ccusage found. Cache reads are usually 90%+ of the total — that's normal, it's how Claude Code keeps your codebase in context cheaply."],
              ["$ at API prices", `What your usage would cost pay-as-you-go (prices as of ${PRICES_AS_OF}). On Pro or Max you didn't actually pay this — which is exactly the point of sharing it.`],
              ["Favorite model", "The model that accounts for the biggest share of your usage cost — Opus, Sonnet, or Haiku — with its share of total spend."],
              ["Streak & biggest day", "Longest run of consecutive active days, plus the single day (or session) where you burned the most — your personal token record."],
            ].map(([h, pt]) => (
              <div className="feat fade" key={h}>
                <div className="fi">▹</div>
                <h4>{h}</h4>
                <p>{renderInline(pt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        heading="Claude Code Wrapped questions"
        items={[
          [
            "What is ccusage?",
            "ccusage is a popular open-source CLI that analyzes the local JSONL logs Claude Code writes to your machine and reports token usage and estimated cost per day, month, or session. Run it with `npx ccusage@latest --json` — nothing is installed permanently.",
          ],
          [
            "Which ccusage commands does this accept?",
            "Any of the JSON reports: `ccusage --json` (daily), `ccusage monthly --json`, or `ccusage session --json`. The card adapts — daily data unlocks the streak stat, session data shows your biggest single session.",
          ],
          [
            "Is my usage data uploaded?",
            "No. Everything — parsing, stats, and drawing the PNG — happens client-side in your browser. You can disconnect from the internet after the page loads and it still works.",
          ],
          [
            "Why is the dollar number so high when I pay $20/month?",
            "Because subscriptions bundle usage at a flat rate while the card prices your tokens at pay-as-you-go API rates. Heavy Claude Code users routinely 'burn' 10–50× their subscription price in API-equivalent value — that gap is the whole meme.",
          ],
          [
            "Why are cache reads most of my tokens?",
            "Claude Code aggressively uses prompt caching: your codebase and conversation history are written to cache once, then re-read cheaply on every turn. Cache reads cost ~10% of normal input tokens, so a huge cache-read count with a modest bill is the system working as designed.",
          ],
          [
            "Does this work for Cursor, Codex, or other tools?",
            "This page parses ccusage output, which covers Claude Code (and Claude Desktop logs where present). Other tools have their own usage logs and formats.",
          ],
        ]}
      />

      <KitsUpsell
        heading="Burning that many tokens? Make them count."
        lead={
          <>
            The ClaudeThings kits are a library of production-grade agents, skills, and slash
            commands that make every one of those tokens do more work — reviews, tests, security
            audits, marketing.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>This tool estimates API-equivalent value from your ccusage output</b> at public
            Anthropic list prices (as of {PRICES_AS_OF}). It does not measure what you actually
            paid, and it is not affiliated with the ccusage project. Everything runs in your
            browser; nothing you paste is uploaded or stored.
          </>
        }
      />
    </>
  );
}
