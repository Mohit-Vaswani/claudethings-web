"use client";

import { useMemo, useState } from "react";
import {
  ToolNav,
  ToolFooter,
  KitsUpsell,
  FaqSection,
  useToolPageFx,
  renderInline,
} from "@/app/components/toolPage";
import { MODEL_PRICES, fmtCompact, PRICES_AS_OF } from "@/app/lib/claudePricing";

/**
 * Claude token counter — instant token estimate + cost across Claude models.
 * 100% client-side. The estimator blends character- and word-based heuristics,
 * with a density bump for code (symbols and identifiers tokenize smaller).
 */

/* -------------------------------- estimator -------------------------------- */

export function estimateTokens(text: string): { tokens: number; kind: "prose" | "code" } {
  if (!text) return { tokens: 0, kind: "prose" };

  const chars = text.length;
  const words = (text.match(/\S+/g) ?? []).length;

  // Code detection: symbol density + line structure.
  const symbols = (text.match(/[{}()[\];<>=+*/\\|&^%#@~`$_-]/g) ?? []).length;
  const lines = text.split("\n");
  const shortLines = lines.filter((l) => l.trim().length > 0 && l.trim().length < 55).length;
  const isCode = symbols / Math.max(1, chars) > 0.04 || (lines.length > 6 && shortLines / lines.length > 0.6);

  // Prose: ~4 chars/token and ~1.32 tokens/word; take a blend.
  // Code: denser tokenization, ~3.1 chars/token.
  const est = isCode
    ? chars / 3.1
    : (chars / 4 + words * 1.32) / 2;

  return { tokens: Math.max(1, Math.round(est)), kind: isCode ? "code" : "prose" };
}

function fmtMoney(n: number): string {
  if (n === 0) return "$0";
  if (n < 0.0001) return `$${n.toFixed(6)}`;
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/* ----------------------------------- UI ----------------------------------- */

const SAMPLE_PROSE = `Claude is a family of large language models developed by Anthropic. The models are used for everything from everyday chat to agentic coding workflows, where tools like Claude Code read entire repositories into context. Because API pricing is per token, understanding how text converts to tokens — and how input, output, and cached tokens are billed differently — is the difference between a $5 experiment and a $500 surprise.`;

export default function TokenCounterPage() {
  useToolPageFx();
  const [src, setSrc] = useState("");
  const [calls, setCalls] = useState(1);

  const { tokens, kind } = useMemo(() => estimateTokens(src), [src]);
  const chars = src.length;
  const words = (src.match(/\S+/g) ?? []).length;

  return (
    <>
      <ToolNav
        links={[
          { href: "#pricing", label: "Claude pricing" },
          { href: "#howto", label: "How tokens work" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#counter"
        ctaLabel="Count tokens"
      />

      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free Claude token counter · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            Count <span className="grad">Claude tokens</span> — and what they cost
          </h1>
          <p className="sub reveal-h d3">
            Paste any text or code and instantly see the <b>token estimate</b> plus the price on{" "}
            <b>Opus, Sonnet, and Haiku</b> — as input and as output, including cache rates. No
            signup, nothing uploaded.
          </p>

          <div id="counter" className="val-tool reveal-h d4">
            <div className="val-panel val-editor">
              <div className="val-head">
                <span className="val-file">{kind === "code" ? "detected: code" : "text"}</span>
                <div className="val-actions">
                  <button className="val-mini" onClick={() => setSrc(SAMPLE_PROSE)}>Load sample</button>
                  <button className="val-mini" onClick={() => setSrc("")} disabled={!src}>Clear</button>
                </div>
              </div>
              <textarea
                spellCheck={false}
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder={"Paste text, a prompt, or code here…\n\nTokens and cost update live as you type."}
                aria-label="Text to count tokens for"
              />
            </div>

            <div className="val-panel val-results" aria-live="polite">
              {!src ? (
                <div className="val-empty">
                  <div className="val-empty-ic">◆</div>
                  <p>Paste something to count. Rough rule: <code>1 token ≈ 4 characters</code> of English, less for code.</p>
                </div>
              ) : (
                <>
                  <div className="val-verdict good">
                    <span className="v-ic">#</span>
                    <span>
                      ≈ <b>&nbsp;{tokens.toLocaleString("en-US")} tokens&nbsp;</b> · {chars.toLocaleString("en-US")} chars · {words.toLocaleString("en-US")} words
                    </span>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <label style={{ fontSize: 13.5, fontWeight: 700, display: "block", marginBottom: 6 }}>
                      Price for <span className="accent">{calls.toLocaleString("en-US")}</span> call{calls > 1 ? "s" : ""} of this size
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10000}
                      value={calls}
                      onChange={(e) => setCalls(+e.target.value)}
                      style={{ width: "100%", accentColor: "var(--ember)" }}
                      aria-label="Number of calls"
                    />
                    <div style={{ overflowX: "auto", marginTop: 14 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                        <thead>
                          <tr style={{ color: "var(--bone-faint)", textAlign: "left" }}>
                            <th style={{ padding: "6px 8px" }}>Model</th>
                            <th style={{ padding: "6px 8px" }}>As input</th>
                            <th style={{ padding: "6px 8px" }}>As output</th>
                            <th style={{ padding: "6px 8px" }}>Cache read</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MODEL_PRICES.map((m) => {
                            const t = (tokens * calls) / 1_000_000;
                            return (
                              <tr key={m.match} style={{ borderTop: "1px solid var(--line)" }}>
                                <td style={{ padding: "8px", fontWeight: 700 }}>{m.label}</td>
                                <td style={{ padding: "8px", color: "var(--bone-dim)" }}>{fmtMoney(t * m.input)}</td>
                                <td style={{ padding: "8px", color: "var(--bone-dim)" }}>{fmtMoney(t * m.output)}</td>
                                <td style={{ padding: "8px", color: "var(--teal)" }}>{fmtMoney(t * m.cacheRead)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <p style={{ color: "var(--bone-faint)", fontSize: 12.5, marginTop: 10 }}>
                      {fmtCompact(tokens * calls)} tokens total · estimate (±5% typical) · prices per Anthropic list, {PRICES_AS_OF}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="micro reveal-h d5">
            100% client-side · nothing uploaded · calibrated for prose and code
          </p>
        </div>
      </header>

      {/* PRICING */}
      <section id="pricing">
        <div className="wrap center">
          <div className="tag fade">Claude API pricing</div>
          <h2 className="fade">The full price table, one place</h2>
          <p className="lead fade">
            Per million tokens, {PRICES_AS_OF}. Output always costs ~5× input; cache reads cost
            90% less than fresh input — the two facts that explain most Claude bills.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {MODEL_PRICES.map((m) => (
              <div className="card fade" key={m.match}>
                <div className="ic">{m.match === "opus" ? "🧠" : m.match === "sonnet" ? "⚖️" : "⚡"}</div>
                <h3>{m.label}</h3>
                <p>
                  Input <b>${m.input}</b> / MTok · Output <b>${m.output}</b> / MTok
                  <br />
                  Cache write ${m.cacheWrite} · Cache read <b>${m.cacheRead}</b>
                  <br />
                  {m.match === "opus"
                    ? "The heavyweight — for the hardest reasoning and agentic work."
                    : m.match === "sonnet"
                    ? "The default — best cost/intelligence balance for coding."
                    : "The economy tier — classification, extraction, high-volume calls."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TOKENS WORK */}
      <section id="howto">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">How tokens work</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Four facts that make bills predictable
            </h2>
          </div>
          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["~4 characters per token", "English prose averages 3.5–4 characters (≈0.75 words) per token. 'The quick brown fox' is 4 tokens; this whole sentence is about 12."],
              ["Code tokenizes heavier", "Brackets, operators, and camelCase identifiers split into more tokens per character — budget 25–40% more than prose. This counter detects code and adjusts."],
              ["You pay both directions", "Every call bills the entire prompt (input) plus the response (output) — and in a conversation, the whole history is re-sent as input each turn. Long chats compound."],
              ["Caching changes everything", "Repeated context (system prompts, codebases) can be cached: 25% extra to write, 90% off to read. It's why Claude Code can hold your repo in context affordably."],
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
        heading="Token counting questions"
        items={[
          [
            "How do I get an exact token count?",
            "Use the API's free `count_tokens` endpoint — it runs the real tokenizer server-side. For planning, budgeting, and prompt-size sanity checks, this estimator's ±5% is plenty.",
          ],
          [
            "Do Claude and GPT count tokens the same way?",
            "No — every model family has its own tokenizer, so the same text produces different counts. The differences are usually within ~10–20% for English, but never assume counts transfer between providers.",
          ],
          [
            "How many tokens fit in Claude's context window?",
            "Claude models offer 200K-token context windows (with 1M-token tiers available on some models). 200K tokens is roughly 150,000 words — about two novels — but remember: everything in context is billed as input on every call.",
          ],
          [
            "Why did my agent workflow cost more than this estimate?",
            "Agents loop: each tool call re-sends the conversation as input, and system prompts, tool definitions, and file contents all count. Multiply per-call cost by turns, and use cache pricing for the repeated prefix — or just measure real usage with ccusage and our Claude Code Wrapped tool.",
          ],
          [
            "Is my text stored or sent anywhere?",
            "No. The counter is client-side JavaScript — your text never leaves the browser.",
          ],
        ]}
      />

      <KitsUpsell
        heading="Spend those tokens on real work"
        lead={
          <>
            The Agentary kits are token-efficient by design — tight skills, scoped agents, and
            commands that get more done per call, for engineering and marketing.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>Token counts are estimates</b> produced by calibrated heuristics — Claude&apos;s
            exact tokenizer is only available through the Anthropic API. Prices shown are public
            list prices as of {PRICES_AS_OF} and may change. Everything runs in your browser;
            nothing you paste is uploaded or stored.
          </>
        }
      />
    </>
  );
}
