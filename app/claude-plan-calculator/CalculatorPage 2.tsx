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
import { fmtUsd, PRICES_AS_OF } from "@/app/lib/claudePricing";

/**
 * Claude Plan Calculator — Pro vs Max 5x vs Max 20x vs pay-as-you-go API.
 * Pure client-side arithmetic over published prices and Anthropic's published
 * expected-usage ranges. All figures are estimates; limits are dynamic.
 */

/* --------------------------------- model --------------------------------- */

type ModelMix = "sonnet" | "mix" | "opus";
type Intensity = "light" | "moderate" | "heavy";

/** Estimated API-equivalent $/hour of active Claude Code use (Sonnet baseline). */
const HOURLY_RATE: Record<Intensity, number> = { light: 3, moderate: 8, heavy: 18 };
/** Opus tokens cost 5× Sonnet; a mix splits time between the two. */
const OPUS_MULT = 5;
const MIX_OPUS_SHARE: Record<ModelMix, number> = { sonnet: 0, mix: 0.3, opus: 0.8 };

/** Anthropic's published expected weekly ranges (hours), per plan. */
interface PlanSpec {
  id: string;
  name: string;
  monthly: number;
  sonnetWeekly: [number, number]; // expected hours range / week
  opusWeekly: [number, number];
  blurb: string;
}

const PLAN_SPECS: PlanSpec[] = [
  {
    id: "pro",
    name: "Pro — $20/mo",
    monthly: 20,
    sonnetWeekly: [40, 80],
    opusWeekly: [0, 0],
    blurb: "Sonnet in Claude Code. No meaningful Opus access.",
  },
  {
    id: "max5",
    name: "Max 5x — $100/mo",
    monthly: 100,
    sonnetWeekly: [140, 280],
    opusWeekly: [15, 35],
    blurb: "≈5× Pro limits, real Opus access.",
  },
  {
    id: "max20",
    name: "Max 20x — $200/mo",
    monthly: 200,
    sonnetWeekly: [240, 480],
    opusWeekly: [24, 40],
    blurb: "≈20× Pro limits — built for all-day agents.",
  },
];

interface PlanVerdict {
  spec: PlanSpec;
  fits: "comfort" | "tight" | "over" | "no-opus";
  detail: string;
  /** Day of the week you'd hit the cap, if over. */
  capDay?: string;
}

interface CalcResult {
  weeklyHours: number;
  sonnetHours: number;
  opusHours: number;
  apiMonthly: number;
  verdicts: PlanVerdict[];
  recommended: string; // plan id or "api" or "free"
  recommendedLine: string;
}

function calc(daysPerMonth: number, hoursPerDay: number, mix: ModelMix, intensity: Intensity): CalcResult {
  const weeklyHours = (daysPerMonth * hoursPerDay * 12) / 52;
  const opusShare = MIX_OPUS_SHARE[mix];
  const opusHours = weeklyHours * opusShare;
  const sonnetHours = weeklyHours - opusHours;

  const monthlyHours = daysPerMonth * hoursPerDay;
  const rate = HOURLY_RATE[intensity];
  const apiMonthly = monthlyHours * rate * (1 - opusShare) + monthlyHours * rate * OPUS_MULT * opusShare;

  const dayName = (fractionOfWeek: number) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days[Math.min(6, Math.max(0, Math.floor(fractionOfWeek * 7)))];
  };

  const verdicts: PlanVerdict[] = PLAN_SPECS.map((spec) => {
    if (opusHours > 0.5 && spec.opusWeekly[1] === 0) {
      return {
        spec,
        fits: "no-opus" as const,
        detail: `You want ${opusHours.toFixed(1)}h of Opus per week — Pro doesn't include meaningful Opus access. You'd be working Sonnet-only.`,
      };
    }
    const sonnetOk = sonnetHours <= spec.sonnetWeekly[0];
    const sonnetTight = sonnetHours <= spec.sonnetWeekly[1];
    const opusOk = opusHours <= spec.opusWeekly[0] || spec.opusWeekly[1] === 0;
    const opusTight = opusHours <= spec.opusWeekly[1] || spec.opusWeekly[1] === 0;

    if (sonnetOk && opusOk) {
      return {
        spec,
        fits: "comfort" as const,
        detail: `Your ~${sonnetHours.toFixed(0)}h Sonnet${opusHours > 0.5 ? ` + ${opusHours.toFixed(1)}h Opus` : ""}/week sits under the expected floor (${spec.sonnetWeekly[0]}h${spec.opusWeekly[1] ? ` + ${spec.opusWeekly[0]}h Opus` : ""}). Comfortable headroom.`,
      };
    }
    if (sonnetTight && opusTight) {
      return {
        spec,
        fits: "tight" as const,
        detail: `You're inside the expected range (${spec.sonnetWeekly[0]}–${spec.sonnetWeekly[1]}h Sonnet${spec.opusWeekly[1] ? `, ${spec.opusWeekly[0]}–${spec.opusWeekly[1]}h Opus` : ""}/week) but above the floor — expect to feel the cap on heavy weeks.`,
      };
    }
    const worstRatio = Math.max(
      sonnetHours / Math.max(1, spec.sonnetWeekly[1]),
      spec.opusWeekly[1] ? opusHours / spec.opusWeekly[1] : 0
    );
    return {
      spec,
      fits: "over" as const,
      capDay: dayName(1 / worstRatio),
      detail: `Your usage is ~${worstRatio.toFixed(1)}× this plan's expected weekly ceiling — at a steady pace you'd hit the cap around ${dayName(1 / worstRatio)} and wait for the reset.`,
    };
  });

  // Recommendation: cheapest plan that at least "tight"-fits; compare against API.
  let recommended = "api";
  let recommendedLine = "";
  const fitting = verdicts.filter((v) => v.fits === "comfort" || v.fits === "tight");
  if (apiMonthly < 20 && monthlyHours < 20) {
    recommended = "api";
    recommendedLine = `At ~${fmtUsd(apiMonthly, 0)}/month of API-equivalent usage, pay-as-you-go (or the free tier) beats every subscription. Grab a Pro plan only if you want the apps and priority access.`;
  } else if (fitting.length) {
    const best = fitting[0];
    recommended = best.spec.id;
    const saving = apiMonthly - best.spec.monthly;
    recommendedLine =
      saving > 0
        ? `${best.spec.name.split(" — ")[0]} fits your usage and costs ${fmtUsd(best.spec.monthly, 0)}/mo vs ~${fmtUsd(apiMonthly, 0)}/mo at API prices — you'd be getting ~${(apiMonthly / best.spec.monthly).toFixed(1)}× the value.`
        : `${best.spec.name.split(" — ")[0]} fits your usage. At ~${fmtUsd(apiMonthly, 0)}/mo API-equivalent you're paying for headroom and the apps rather than raw savings.`;
  } else {
    recommended = "max20";
    recommendedLine = `Your usage exceeds even Max 20x's expected ceiling. Take Max 20x and expect to top up via the API (or spread work across the weekly reset) — pure API would run ~${fmtUsd(apiMonthly, 0)}/mo.`;
  }

  return { weeklyHours, sonnetHours, opusHours, apiMonthly, verdicts, recommended, recommendedLine };
}

/* ----------------------------------- UI ----------------------------------- */

const FIT_META = {
  comfort: { label: "Fits comfortably", cls: "pass", icon: "✓" },
  tight: { label: "Fits — expect throttling on heavy weeks", cls: "warn", icon: "!" },
  over: { label: "You'll hit the cap", cls: "err", icon: "✕" },
  "no-opus": { label: "No Opus on this plan", cls: "err", icon: "✕" },
} as const;

export default function CalculatorPage() {
  useToolPageFx();
  const [days, setDays] = useState(20);
  const [hours, setHours] = useState(3);
  const [mix, setMix] = useState<ModelMix>("sonnet");
  const [intensity, setIntensity] = useState<Intensity>("moderate");

  const r = useMemo(() => calc(days, hours, mix, intensity), [days, hours, mix, intensity]);

  const seg = (
    active: boolean
  ): React.CSSProperties => ({
    padding: "8px 14px",
    borderRadius: 10,
    border: `1px solid ${active ? "var(--ember)" : "var(--line)"}`,
    background: active ? "rgba(224,78,27,.1)" : "transparent",
    color: active ? "var(--bone)" : "var(--bone-dim)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  });

  return (
    <>
      <ToolNav
        links={[
          { href: "#plans", label: "The plans" },
          { href: "#limits", label: "How limits work" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#calculator"
        ctaLabel="Find my plan"
      />

      {/* HERO + TOOL */}
      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free Claude plan calculator · No signup
          </span>
          <h1 className="reveal-h d2">
            Pro, Max, or <span className="grad">API</span> — which pays off?
          </h1>
          <p className="sub reveal-h d3">
            Tell it how you actually use <b>Claude Code</b> and get a straight answer: the cheapest
            plan that fits, what your usage is worth at <b>API prices</b>, and when you&apos;d hit
            each plan&apos;s limits.
          </p>

          <div id="calculator" className="val-tool reveal-h d4">
            {/* inputs */}
            <div className="val-panel" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 8 }}>
                    Coding days per month: <span className="accent">{days}</span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={30}
                    value={days}
                    onChange={(e) => setDays(+e.target.value)}
                    style={{ width: "100%", accentColor: "var(--ember)" }}
                    aria-label="Coding days per month"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 8 }}>
                    Hours of Claude Code per active day: <span className="accent">{hours}</span>
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={12}
                    step={0.5}
                    value={hours}
                    onChange={(e) => setHours(+e.target.value)}
                    style={{ width: "100%", accentColor: "var(--ember)" }}
                    aria-label="Hours per active day"
                  />
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 8 }}>
                    Model mix
                  </span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(
                      [
                        ["sonnet", "Mostly Sonnet"],
                        ["mix", "Sonnet + some Opus"],
                        ["opus", "Mostly Opus"],
                      ] as Array<[ModelMix, string]>
                    ).map(([v, label]) => (
                      <button key={v} style={seg(mix === v)} onClick={() => setMix(v)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "block", marginBottom: 8 }}>
                    How you use it
                  </span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(
                      [
                        ["light", "Q&A / small edits"],
                        ["moderate", "Real feature work"],
                        ["heavy", "Agents & subagents"],
                      ] as Array<[Intensity, string]>
                    ).map(([v, label]) => (
                      <button key={v} style={seg(intensity === v)} onClick={() => setIntensity(v)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <p style={{ color: "var(--bone-faint)", fontSize: 13 }}>
                  ≈ {r.weeklyHours.toFixed(0)}h/week ({r.sonnetHours.toFixed(0)}h Sonnet
                  {r.opusHours > 0.5 ? ` + ${r.opusHours.toFixed(1)}h Opus` : ""}) · API-equivalent
                  ~{fmtUsd(r.apiMonthly, 0)}/month
                </p>
              </div>
            </div>

            {/* results */}
            <div className="val-panel val-results" aria-live="polite">
              <div className="val-verdict good">
                <span className="v-ic">◆</span>
                <span>{r.recommendedLine}</span>
              </div>
              <ul className="val-findings">
                <li className={`val-finding ${r.apiMonthly < 20 ? "pass" : "warn"}`}>
                  <span className="f-chip">$</span>
                  <span className="f-body">
                    <b className="f-rule">Pay-as-you-go API — ~{fmtUsd(r.apiMonthly, 0)}/mo</b>
                    <span className="f-msg">
                      {r.apiMonthly < 20
                        ? "At your volume the API is the cheapest option — no subscription needed."
                        : `Your usage priced at API rates. Every subscription below that number is a discount.`}
                    </span>
                  </span>
                </li>
                {r.verdicts.map((v) => {
                  const meta = FIT_META[v.fits];
                  const isRec = r.recommended === v.spec.id;
                  return (
                    <li key={v.spec.id} className={`val-finding ${meta.cls}`}>
                      <span className="f-chip">{meta.icon}</span>
                      <span className="f-body">
                        <b className="f-rule">
                          {v.spec.name} {isRec ? "· RECOMMENDED" : ""}
                        </b>
                        <span className="f-msg">
                          {meta.label}. {v.detail} {v.spec.blurb}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p style={{ padding: "12px 16px", color: "var(--bone-faint)", fontSize: 13 }}>
                Estimates only — limits are dynamic and vary with codebase size, caching, and
                demand. Prices as of {PRICES_AS_OF}.
              </p>
            </div>
          </div>

          <p className="micro reveal-h d5">
            Free · instant · based on published prices and Anthropic&apos;s expected-usage ranges
          </p>
        </div>
      </header>

      {/* PLANS EXPLAINED */}
      <section id="plans">
        <div className="wrap center">
          <div className="tag fade">The plans</div>
          <h2 className="fade">Claude Pro vs Max 5x vs Max 20x vs API</h2>
          <p className="lead fade">
            All four buy the same models — what changes is how much usage is bundled, and whether
            Opus is realistically available.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["🟢", "Pro — $20/mo", "Everyday tier: Claude apps + Claude Code with ~40–80 Sonnet hours/week expected. The default for most developers; no meaningful Opus."],
              ["🔵", "Max 5x — $100/mo", "≈5× Pro's limits plus real Opus access (~15–35 h/week). The sweet spot for daily multi-hour Claude Code work."],
              ["🟣", "Max 20x — $200/mo", "≈20× Pro. For people running Claude Code (and subagents) most of the day, every day. Heavy users extract thousands of $ in API-equivalent value."],
              ["⚙️", "API — pay-as-you-go", "No caps, no monthly fee — you pay per token. Cheapest for light/bursty use, most expensive for daily grinding. Also what teams use for CI and automation."],
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

      {/* HOW LIMITS WORK */}
      <section id="limits">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">How limits work</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              5-hour windows, weekly caps, dynamic ceilings
            </h2>
          </div>
          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["The 5-hour session window", "Usage is tracked in rolling 5-hour windows that start with your first message. Hit the window cap and you wait for it to reset — this is the limit casual users feel."],
              ["The weekly cap", "On top of session windows there's an overall weekly ceiling (resets every 7 days). This is the one heavy Claude Code users hit — it's why the calculator reports usage per week."],
              ["Why 'expected ranges', not numbers", "Anthropic publishes ranges (like 40–80 Sonnet hours/week on Pro) because actual consumption depends on codebase size, conversation length, caching, and current demand. Big monorepo + long sessions = the low end."],
              ["Opus burns ~5× faster", "Opus tokens cost about five times Sonnet's, and plans meter them accordingly. If you default to Opus, expect your effective hours to shrink dramatically — the mix selector above models exactly this."],
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
        heading="Claude plan questions"
        items={[
          [
            "Is Claude Max worth it?",
            "If you use Claude Code more than ~2 hours a day, almost certainly. At moderate intensity that's ~$300+/month of API-equivalent usage — 3× the price of Max 5x. Run your numbers above; the multiple is usually the convincing part.",
          ],
          [
            "Can I use Claude Code on the Pro plan?",
            "Yes — Pro includes Claude Code with Sonnet. What Pro doesn't give you is meaningful Opus access or the headroom for long agentic sessions; that's what the Max tiers add.",
          ],
          [
            "What happens when I hit my limit?",
            "Claude tells you which window you've exhausted and when it resets (session windows reset within 5 hours; the weekly cap on a 7-day cycle). On Max plans you can also fall back to API billing for the gap if you've connected a key.",
          ],
          [
            "Should I just use an API key instead?",
            "Only if your usage is light, bursty, or automated (CI pipelines, scripts). For steady interactive coding, subscriptions bundle tokens at a steep effective discount — the calculator shows the exact multiple for your pattern.",
          ],
          [
            "Do these numbers include Claude.ai chat usage?",
            "The plan limits are shared across Claude.ai, the apps, and Claude Code. The calculator models Claude Code hours since that's what dominates most developers' usage; add a bit of headroom if you also chat heavily.",
          ],
          [
            "How do I see my real usage?",
            "Run `npx ccusage@latest` for API-equivalent spend from Claude Code's local logs, or `/usage` inside Claude Code for your live plan meters. Then feed the reality back into this calculator — and turn it into a shareable card with our Claude Code Wrapped tool.",
          ],
        ]}
      />

      <KitsUpsell
        heading="Whatever plan you pick, ship faster on it"
        lead={
          <>
            The AgentsKit kits squeeze more out of every session window: production-grade
            agents, skills, and slash commands for engineering and marketing work.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>This calculator produces estimates, not quotes.</b> Plan prices are Anthropic&apos;s
            published prices as of {PRICES_AS_OF}; usage-limit ranges combine Anthropic&apos;s
            published expectations with community measurements and change over time. Verify
            current pricing and limits at anthropic.com before purchasing.
          </>
        }
      />
    </>
  );
}
