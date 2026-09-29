"use client";

import { useEffect, useState, type ReactNode } from "react";
import { trackSignup } from "./lib/clicks";
import { GEO_DISCOUNT, useGeoDiscount, withDiscount } from "./lib/geoDiscount";
import { PLAN_BY_ID } from "./lib/plans";
import { PriceLadder, ProofPill, TrustMrrBadge, ladderState } from "./components/pricing";
import { BrandMark, SiteFooter, SiteNav } from "./components/HomeChrome";
import "./home.css";

/**
 * AgentsKit landing page (Next.js App Router) — quiet light layout modelled on
 * typevoice.ai: one narrow column, big serif display, small icon labels,
 * white rounded cards. Styling lives in app/home.css (nx- prefixed, scoped to
 * this page and /demo; globals.css keeps serving /tools, /blog, legal…).
 * Buy buttons use Polar's embed (loaded in layout.tsx); the checkout URLs
 * live in app/lib/plans.ts. The product video lives on /demo.
 */

/** Small icon + uppercase word that opens every section, TypeVoice-style. */
function Label({ ic, children }: { ic: string; children: ReactNode }) {
  return (
    <div className="nx-label">
      <span className="ic" aria-hidden="true">
        {ic}
      </span>
      {children}
    </div>
  );
}

/** Agent roster for the marquee ticker. Duplicated in JSX for the seamless loop. */
const MARQUEE_AGENTS: [string, string][] = [
  ["agent", "tech-lead"],
  ["agent", "backend-architect"],
  ["agent", "react-specialist"],
  ["agent", "security-auditor"],
  ["agent", "seo-specialist"],
  ["cmd", "/api-scaffold"],
  ["agent", "postgres-pro"],
  ["agent", "growth-strategist"],
  ["agent", "test-automator"],
  ["cmd", "/blog-post"],
  ["agent", "kubernetes-specialist"],
  ["agent", "content-marketer"],
  ["agent", "debugger"],
  ["cmd", "/launch-plan"],
  ["agent", "rust-pro"],
  ["agent", "brand-voice"],
  ["agent", "code-reviewer"],
  ["cmd", "/email-sequence"],
];

/* =====================================================================
   KIT EXPLORER — the "everything you get" browser.
   Two axes, because that is genuinely how the product is shaped: which
   kit you installed (engineer / marketing) and which kind of component
   you are looking at (agents / skills / commands). Every card below is a
   real file in the kit, so the grid can never drift from what ships.
   ===================================================================== */

type ExplorerCard = { ic: string; tag: string; name: string; body: string };
type ExplorerKit = "engineer" | "marketing";
type ExplorerTab = "agents" | "skills" | "commands";

const EXPLORER: Record<ExplorerKit, Record<ExplorerTab, ExplorerCard[]>> = {
  engineer: {
    agents: [
      { ic: "◈", tag: "Orchestrator", name: "tech-lead", body: "Takes the messy ask, breaks it into a plan, and hands each piece to the specialist that should own it. Your entry point for anything non-trivial." },
      { ic: "⊞", tag: "Release gate", name: "shipper", body: "The last pair of eyes before anything goes out. Runs the checks, catches the half-finished work, and refuses the release when it isn't ready." },
      { ic: "⌸", tag: "Backend", name: "backend-architect", body: "Designs the data model and the service boundaries before a line of it gets written, so you aren't unpicking the schema three sprints later." },
      { ic: "◫", tag: "Frontend", name: "react-specialist", body: "Components, state and rendering paths that survive a real app. Pairs with nextjs-developer and ui-ux-designer for full-surface work." },
      { ic: "⌖", tag: "Firefight", name: "debugger", body: "Reproduces first, theorises second. Works the stack trace down to the actual line instead of rewriting code until the symptom moves." },
      { ic: "⊘", tag: "Quality", name: "code-reviewer", body: "Reads the diff the way a senior would: correctness, then the shortcut you took at 1am, then the thing that will page you later." },
      { ic: "⚿", tag: "Security", name: "security-auditor", body: "Threat-models the change and hunts the boring vulnerabilities — authz holes, injection, leaked secrets — with penetration-tester on call." },
      { ic: "⌗", tag: "Data", name: "postgres-pro", body: "Indexes, query plans and migrations. Works alongside database-optimizer and sql-pro when the slow page turns out to be the database." },
      { ic: "⛁", tag: "Infra", name: "sre-engineer", body: "Deploys, rollbacks, alerting and the incident path. terraform-specialist and kubernetes-specialist handle the substrate underneath." },
    ],
    skills: [
      { ic: "▤", tag: "Auto-loads", name: "test-driven-development", body: "Claude writes the failing test first and lets it drive the implementation — the discipline you keep meaning to hold, enforced by default." },
      { ic: "◇", tag: "Next.js", name: "nextjs-app-router-patterns", body: "Server components, route handlers, caching and the streaming boundaries, applied the way the App Router actually wants them." },
      { ic: "◎", tag: "Design", name: "tailwind-design-system", body: "Tokens, scale and component variants instead of a thousand one-off class strings. Ships with shadcn and ui-design-system." },
      { ic: "⊛", tag: "Payments", name: "stripe-integration", body: "Checkout, webhooks, idempotency and the failure cases everyone discovers in production. Written once, correctly." },
      { ic: "⊙", tag: "Data layer", name: "drizzle-orm-expert", body: "Type-safe schema and queries, plus database-migration for the part that is genuinely scary to get wrong." },
      { ic: "◐", tag: "Debugging", name: "systematic-debugging", body: "A method, not a vibe: narrow the surface, bisect the change, prove the fix. Pairs with error-resolver on live incidents." },
      { ic: "⊡", tag: "Containers", name: "docker-expert", body: "Layer caching, multi-stage builds and images that aren't 1.2GB. kubernetes-architect takes it from there." },
      { ic: "◉", tag: "Browser", name: "playwright", body: "End-to-end tests that hold up in CI, with e2e-testing-patterns for the flake-free selectors and waiting strategy." },
      { ic: "⊕", tag: "Extend it", name: "mcp-builder", body: "Build your own MCP servers and, with skill-creator, your own skills — the kit teaches Claude to grow the kit." },
    ],
    commands: [
      { ic: "⌁", tag: "Scaffold", name: "/api-scaffold", body: "Routes, validation, types and tests for a new endpoint, matched to the conventions already in your repo." },
      { ic: "⌂", tag: "Feature", name: "/create-feature", body: "Takes a feature from description to branch, plan and implementation, with /create-prd first when the spec is still fuzzy." },
      { ic: "⊿", tag: "Red-green", name: "/tdd-red", body: "The TDD loop as three commands — /tdd-red, /tdd-green, /tdd-refactor — so the cycle is one keystroke each." },
      { ic: "▦", tag: "Coverage", name: "/test-coverage", body: "Finds what is genuinely untested rather than what merely lowers the percentage, then writes the missing cases." },
      { ic: "⌾", tag: "Review", name: "/multi-agent-review", body: "Fans the diff out to reviewer, security and architecture agents in parallel and reconciles what they each found." },
      { ic: "⟐", tag: "Ship", name: "/deploy-checklist", body: "The pre-flight you keep in your head, written down and actually run: migrations, env, rollback path, monitoring." },
      { ic: "⌬", tag: "CI", name: "/setup-ci-cd-pipeline", body: "A working pipeline for your stack — build, test, deploy — instead of a week of YAML archaeology." },
      { ic: "⊚", tag: "Perf", name: "/optimize-bundle-size", body: "Measures before it cuts, then goes after the imports actually costing you, with /performance-audit for the runtime side." },
      { ic: "⊗", tag: "Security", name: "/secrets-scanner", body: "Sweeps history and working tree for keys that shouldn't be there, alongside /dependency-audit and /security-hardening." },
    ],
  },
  marketing: {
    agents: [
      { ic: "◈", tag: "Orchestrator", name: "growth-strategist", body: "Finds the one constraint actually holding your funnel back, then sequences the work against it instead of shipping busywork." },
      { ic: "✎", tag: "Voice", name: "brand-voice", body: "Keeps every asset sounding like you wrote it, and quietly flags the claims that would get you in trouble." },
      { ic: "⌕", tag: "Search", name: "seo-specialist", body: "Intent, structure and internal linking — with seo-analyzer auditing what you already have and where it leaks." },
      { ic: "◫", tag: "Content", name: "content-marketer", body: "Briefs and drafts that argue a real position, not 1,200 words of throat-clearing around a keyword." },
      { ic: "⊙", tag: "AI search", name: "search-ai-optimization-expert", body: "Getting cited by ChatGPT, Perplexity and AI Overviews — GEO and AEO, treated as its own channel rather than an SEO footnote." },
      { ic: "⌗", tag: "Attribution", name: "marketing-attribution-analyst", body: "Connects spend to revenue and tells you which channel is quietly carrying the others' credit." },
      { ic: "⊞", tag: "Research", name: "market-researcher", body: "Sizes the market and reads the demand honestly, with competitive-analyst on what everyone else is already claiming." },
      { ic: "◇", tag: "Product", name: "product-strategist", body: "Positioning and roadmap pressure-tested against the market, so the launch has something to say." },
      { ic: "⚑", tag: "Retention", name: "customer-success-manager", body: "Onboarding, expansion and the churn signals worth acting on before the cancellation email arrives." },
    ],
    skills: [
      { ic: "◎", tag: "Advisory", name: "marketing-council", body: "Runs your plan past a panel of marketing perspectives and surfaces where they disagree — the argument is the value." },
      { ic: "⊛", tag: "Conversion", name: "offers", body: "Structures the offer, the guarantee and the risk reversal. Pairs with pricing-strategy for what you actually charge." },
      { ic: "▤", tag: "CRO", name: "page-cro", body: "The full CRO set — page, form, popup, signup-flow, onboarding and paywall — each with its own teardown method." },
      { ic: "⌁", tag: "SEO", name: "programmatic-seo", body: "Templates hundreds of genuinely useful pages from structured data, with site-architecture and schema-markup behind it." },
      { ic: "◐", tag: "Psychology", name: "marketing-psychology", body: "Why people actually buy, applied to copy — and where the same lever tips over into something you shouldn't ship." },
      { ic: "✉", tag: "Lifecycle", name: "email-sequence", body: "Onboarding, nurture and win-back flows with timing and exit conditions, plus cold-email and sms for the outbound side." },
      { ic: "⟐", tag: "Launch", name: "launch-strategy", body: "The week around launch day sequenced properly, with public-relations and co-marketing for the reach you don't own." },
      { ic: "⊚", tag: "Acquisition", name: "free-tool-strategy", body: "Free tools as a channel — what to build, how it feeds the funnel — with lead-magnets and directory-submissions alongside." },
      { ic: "⊘", tag: "Retention", name: "churn-prevention", body: "Finds where accounts go quiet and what to do about it, with revops and attribution closing the loop on revenue." },
    ],
    commands: [
      { ic: "⌂", tag: "Plan", name: "/campaign-brief", body: "Objective, audience, message, channels and a week-by-week calendar — the brief you'd otherwise spend a morning writing." },
      { ic: "✎", tag: "Content", name: "/blog-post", body: "A researched, structured post in your voice, with /content-calendar deciding what gets written in the first place." },
      { ic: "◫", tag: "Page", name: "/landing-page", body: "Full page copy built on a real offer and a real objection list, not a hero headline with nothing underneath." },
      { ic: "✉", tag: "Email", name: "/email-sequence", body: "Complete copy for the whole flow, timing included, with /newsletter for the recurring send." },
      { ic: "⌕", tag: "Audit", name: "/seo-audit", body: "Technical, on-page and content-gap findings split into quick wins and the work that actually needs a quarter." },
      { ic: "⊿", tag: "Positioning", name: "/value-prop", body: "Sharpens what you're claiming until it says something a competitor couldn't paste onto their own site." },
      { ic: "⌾", tag: "Competitive", name: "/competitor-brief", body: "What they claim, where they're weak and the angle nobody has taken yet — battlecard included." },
      { ic: "⟐", tag: "Launch", name: "/launch-plan", body: "The whole launch sequenced across channels, with /press-release and /social-pack for the assets it needs." },
      { ic: "⇗", tag: "Distribution", name: "/publisher-all", body: "One draft, adapted and posted to dev.to, Medium, LinkedIn and X — /publisher-x and friends for one at a time." },
    ],
  },
};

const EXPLORER_TABS: { id: ExplorerTab; label: string; count: Record<ExplorerKit, string> }[] = [
  { id: "agents", label: "Agents", count: { engineer: "58", marketing: "31" } },
  { id: "skills", label: "Skills", count: { engineer: "61", marketing: "61" } },
  { id: "commands", label: "Commands", count: { engineer: "159", marketing: "32" } },
];

const EXPLORER_LEAD: Record<ExplorerKit, Record<ExplorerTab, string>> = {
  engineer: {
    agents: "Named specialists you delegate to — or let tech-lead pick for you.",
    skills: "Claude loads these on its own, exactly when the task calls for them.",
    commands: "Slash commands you fire straight from the prompt, no setup.",
  },
  marketing: {
    agents: "The growth team, reading the same codebase and CLAUDE.md as your engineers.",
    skills: "Playbooks that load themselves the moment the work needs them.",
    commands: "From brief to published, one slash command at a time.",
  },
};

/**
 * The tabbed kit browser. Kit swaps on the headline chip, component type on
 * the segmented control — 54 real components, nine on screen at a time.
 */
function KitExplorer() {
  const [kit, setKit] = useState<ExplorerKit>("engineer");
  const [tab, setTab] = useState<ExplorerTab>("agents");
  const cards = EXPLORER[kit][tab];
  const other: ExplorerKit = kit === "engineer" ? "marketing" : "engineer";

  return (
    <section id="explore" className="nx-sec">
      <div className="nx-wrap">
        <div className="nx-fade">
          <Label ic="✳">Features</Label>
          <h2 className="nx-h2">
            Load your{" "}
            <button
              type="button"
              className="nx-swap"
              onClick={() => setKit(other)}
              aria-label={`Showing the ${kit} kit. Switch to the ${other} kit.`}
            >
              {kit === "engineer" ? "Engineer Kit" : "Marketing Kit"}
              <span className="sw" aria-hidden="true">
                ⇄
              </span>
            </button>
            {" "}
            and just prompt it.
          </h2>
          <div className="nx-tabs" role="tablist" aria-label="Component type">
            {EXPLORER_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`nx-tab${tab === t.id ? " on" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                <span className="n">{t.count[kit]}</span>
              </button>
            ))}
          </div>
          <p className="nx-lead">{EXPLORER_LEAD[kit][tab]}</p>
        </div>
        <div className="nx-cards" key={`${kit}-${tab}`}>
          {cards.map((c) => (
            <article className="nx-card" key={c.name}>
              <div className="nx-card-top">
                <span className="ic" aria-hidden="true">
                  {c.ic}
                </span>
                <span className="tg">{c.tag}</span>
              </div>
              <h3>{c.name}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
        <p className="nx-cards-foot nx-fade">
          Nine of {EXPLORER_TABS.find((t) => t.id === tab)?.count[kit]}{" "}
          {tab} in the {kit} kit. Cherry-pick one with{" "}
          <code>agentskit add {tab.slice(0, -1)} {cards[0].name.replace("/", "")}</code>, or install
          the lot in one command.
        </p>
      </div>
    </section>
  );
}

/**
 * Terminal mockup for the one-command install animation (the "One-command install"
 * row). Element ids are namespaced by `id` and the typing effect below is wired up
 * per instance, so it can be rendered more than once.
 */
function InstallTerminal({ id }: { id: string }) {
  return (
    <div className="nx-term" id={id}>
      <div className="nx-term-bar">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="nx-term-title">your-project · bash</span>
      </div>
      <div className="nx-term-body">
        <div>
          <span className="pr">$</span> <span className="cmd" id={`${id}-typed`}></span>
          <span className="nx-cursor" id={`${id}-cur`}></span>
        </div>
        <div id={`${id}-out`}></div>
      </div>
    </div>
  );
}

/** Terminal instances on the page, in DOM order. */
const TERMINAL_IDS = ["term"];

/**
 * Real buyer reviews. One shows at a time and the band auto-advances every
 * SAY_MS; each entry links out to the live tweet so the quote stays checkable.
 */
const TESTIMONIALS = [
  {
    quote:
      "buying it last week was probably one of my best investments. genuinely love what he\u2019s building here \uD83D\uDD25",
    name: "abhi",
    role: "Founder of craftpad \u00b7 @letcontactabhi",
    avatar: "/founder.jpg",
    alt: "abhi, founder of craftpad",
    url: "https://x.com/letcontactabhi/status/2086174287346782343",
  },
  {
    quote:
      "Mohit\u2026 thank you! I\u2019m using your kit in my new project and it\u2019s actually really helpful.",
    name: "Ioannis Antypas",
    role: "@ioannis_antypas",
    avatar: "/founder2.jpg",
    alt: "Ioannis Antypas",
    url: "https://x.com/ioannis_antypas/status/2090063015060132179",
  },
];

/** Dwell time per review, in ms. The progress bar animation is tied to it. */
const SAY_MS = 5000;

/**
 * Auto-rotating testimonial band. All slides are stacked in one grid cell so the
 * card keeps the height of the tallest quote and nothing jumps on advance; the
 * bar underneath shows how long until the next one. Hover/focus pauses it.
 */
function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped every time a fresh countdown starts; keys the progress fill so it
  // restarts in lockstep with the timer instead of drifting out of sync.
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (paused) return;
    setRun((n) => n + 1);
    const t = window.setTimeout(
      () => setActive((n) => (n + 1) % TESTIMONIALS.length),
      SAY_MS
    );
    return () => window.clearTimeout(t);
  }, [active, paused]);

  return (
    <div
      className="nx-say-rot nx-fade"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="nx-say-stack">
        {TESTIMONIALS.map((t, i) => {
          const on = i === active;
          return (
            <figure
              key={t.url}
              className={`nx-say-card${on ? " is-on" : ""}`}
              aria-hidden={!on}
              inert={!on}
            >
              <blockquote className="nx-say-q">
                <span aria-hidden="true" className="nx-say-mark">
                  &ldquo;
                </span>
                {t.quote}
              </blockquote>
              <figcaption className="nx-say-by">
                <img
                  src={t.avatar}
                  alt={t.alt}
                  className="nx-say-av"
                  width={112}
                  height={112}
                  loading="lazy"
                />
                <div className="nx-say-who">
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                </div>
                <a
                  className="nx-say-link"
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See it on X <span className="ar">↗</span>
                </a>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="nx-say-nav">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.url}
            type="button"
            className={`nx-say-dot${i === active ? " is-on" : ""}`}
            aria-label={`Show review from ${t.name}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
          >
            <span className="nx-say-dot-fill">
              {i === active ? (
                <i
                  key={run}
                  style={{
                    animationDuration: `${SAY_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** What the team hands back in the hero ticker, right of the icon. */
const TICKER_OUT =
  "tech-lead split it into 4 tasks · backend-architect wrote the schema · test-automator: 12 passing · security-auditor: 0 critical · shipper: ready to merge · content-marketer drafted the launch post ·";

/**
 * AgentsKit vs building the setup yourself. Same nine jobs the old cost ledger
 * priced; the DIY hours add up to the 56+ in the last row, so the claim stays
 * checkable. `kitWins: false` marks the honest row where DIY comes out ahead.
 */
const COMPARE: { job: string; kit: string; diy: string; kitWins?: boolean }[] = [
  { job: "A system prompt Claude keeps to", kit: "One CLAUDE.md, read by all 89 agents", diy: "6+ hrs of trial and error" },
  { job: "Agents that hand work to each other", kit: "tech-lead → specialist → shipper, wired", diy: "2 days of wiring" },
  { job: "Your stack and conventions", kit: "Taught once, matched on every task", diy: "Re-explained every session, 4+ hrs" },
  { job: "Review and test workflow", kit: "/multi-agent-review, test-automator", diy: "8+ hrs hand-rolling one" },
  { job: "Release checklist", kit: "/deploy-checklist, shipper", diy: "5+ hrs, rewritten per launch" },
  { job: "CI, containers and infra", kit: "/setup-ci-cd-pipeline, docker-expert", diy: "10+ hrs the hard way" },
  { job: "Marketing and SEO frameworks", kit: "marketing-council, /seo-audit", diy: "7+ hrs of hunting" },
  { job: "Knowing the setup is any good", kit: "agentskit doctor, free updates", diy: "Never quite sure" },
  { job: "Shaped exactly to your taste", kit: "Close, then edit any file", diy: "Fully, eventually", kitWins: false },
];

export default function Home() {
  // Purchasing-power 50% offer. Ineligible everywhere off the country list,
  // and on the first paint.
  const geoOffer = useGeoDiscount();
  // Which launch tier the bundle is selling at right now, and how much of it
  // is left. Drives the ladder, the card pill and the closing note so the
  // whole pricing block tells one consistent story.
  const bundleTier = ladderState();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // scroll reveal
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".nx-fade").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // terminal typing — each InstallTerminal types itself once it scrolls into view
    const cmd = "npx github:getagentskit/kit init --kit both";
    const lines: [string, string][] = [
      ["ok", "✔ Installing into your-project"],
      ["ok", "✔ engineer kit → 58 agents, 61 skills, 159 commands"],
      ["ok", "✔ marketing kit → 31 agents, 61 skills, 22 commands (10 shared, already in)"],
      ["ok", "✔ wrote CLAUDE.md, fill it in so agents learn your project"],
      ["dim", "› Done. Open Claude Code, your AI team is ready."],
    ];
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const termIOs: IntersectionObserver[] = [];

    TERMINAL_IDS.forEach((id) => {
      const term = document.getElementById(id);
      const typedEl = document.getElementById(`${id}-typed`);
      const curEl = document.getElementById(`${id}-cur`);
      const outEl = document.getElementById(`${id}-out`);
      if (!term || !typedEl || !outEl) return;

      typedEl.textContent = "";
      outEl.innerHTML = "";
      if (curEl) curEl.style.display = "inline-block";

      let i = 0;
      const type = () => {
        if (i <= cmd.length) {
          typedEl.textContent = cmd.slice(0, i);
          i++;
          timeouts.push(setTimeout(type, 55));
          return;
        }
        if (curEl) curEl.style.display = "none";
        let j = 0;
        const out = () => {
          if (j >= lines.length) return;
          const d = document.createElement("div");
          d.className = lines[j][0];
          d.style.opacity = "0";
          d.style.transition = "opacity .3s";
          d.textContent = lines[j][1];
          outEl.appendChild(d);
          requestAnimationFrame(() => (d.style.opacity = "1"));
          j++;
          timeouts.push(setTimeout(out, 420));
        };
        out();
      };

      const startIO = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            type();
            startIO.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      startIO.observe(term);
      termIOs.push(startIO);
    });

    cleanups.push(() => {
      termIOs.forEach((io) => io.disconnect());
      timeouts.forEach(clearTimeout);
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const bundle = PLAN_BY_ID.bundle;
  const singles = [PLAN_BY_ID.engineer, PLAN_BY_ID.marketing];

  return (
    <div className="nx-page">
      <SiteNav />

      {/* HERO */}
      <header id="top" className="nx-hero">
        {/* ticker: agents stream into the kit, finished work streams out */}
        <div className="nx-ticker nx-rise nx-d1" aria-hidden="true">
          <div className="nx-ticker-in">
            <div className="nx-ticker-track">
              {[0, 1].map((dup) =>
                MARQUEE_AGENTS.map(([kind, name], idx) => (
                  <span className="nx-mq-chip" key={`${dup}-${idx}`}>
                    <b>{kind === "agent" ? "◆" : "$"}</b>
                    {name}
                  </span>
                ))
              )}
            </div>
          </div>
          <span className="nx-ticker-icon">
            <BrandMark size={44} />
          </span>
          <div className="nx-ticker-out">
            <div className="nx-ticker-track">
              <span>{TICKER_OUT}</span>
              <span>{TICKER_OUT}</span>
            </div>
          </div>
        </div>

        <div className="nx-wrap nx-hero-center">
          <h1 className="nx-h1 nx-rise nx-d2">
            Your AI <em>engineering &amp; marketing</em> team{" "}
            <span className="nb">in one command</span>
          </h1>
          <p className="nx-sub nx-rise nx-d3">
            89 specialist agents, 122 skills and 181 slash commands for Claude Code. Plan, build,
            ship and market a real product on your own.
          </p>
          <div className="nx-cta-row nx-rise nx-d4">
            <a
              className="nx-btn nx-btn-primary nx-btn-lg"
              href="#pricing"
              data-fast-goal="cta_get_claudethings"
              data-fast-goal-location="hero"
            >
              Get AgentsKit
            </a>
            <a
              className="nx-btn nx-btn-soft nx-btn-lg"
              href="/demo"
              data-fast-goal="cta_see_demo"
              data-fast-goal-location="hero"
            >
              <span className="play" aria-hidden="true">
                ▶
              </span>
              See demo
            </a>
          </div>
          <div className="nx-micro nx-rise nx-d4">
            Requires Claude Code · One-time payment · Lifetime updates
          </div>
          <div className="nx-hero-proof nx-rise nx-d5">
            <ProofPill />
          </div>
          <a className="nx-down nx-rise nx-d5" href="#explore" aria-label="Scroll to features">
            ↓
          </a>
        </div>
      </header>

      {/* STATS STRIP */}
      <div className="nx-wrap">
        <ul className="nx-strip nx-fade">
          <li>
            <b className="g">89 agents</b> engineer + marketing
          </li>
          <li>
            <b>122</b> skills
          </li>
          <li>
            <b>181</b> commands
          </li>
          <li>
            <b>~2 min</b> to install
          </li>
          <li>
            <b>No subscription</b> pay once
          </li>
        </ul>
      </div>

      {/* KIT EXPLORER — everything the kits ship, browsable by kit and type */}
      <KitExplorer />

      {/* HOW IT FITS — nothing new to learn */}
      <section id="whats-inside" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <Label ic="◇">A team, not a tool</Label>
            <h2 className="nx-h2">Nothing new to learn.</h2>
            <div className="nx-prose">
              <p>
                Picture briefing a tech lead, a backend architect, a security auditor and a
                copywriter on your project every single morning, from zero.
              </p>
              <p>
                That is what prompting one generalist feels like. Every session starts cold, and
                the result depends on how well you remembered to ask.
              </p>
              <p className="strong">
                AgentsKit installs the team into your project&apos;s <code>.claude/</code> folder.
                Claude Code picks it up on its own, reads your <code>CLAUDE.md</code> once, and
                hands each job to the specialist that should own it.{" "}
                <a href="/demo">Watch it happen</a>.
              </p>
            </div>
          </div>

          {/* flow diagram */}
          <div className="nx-flow nx-fade">
            <div className="nx-flow-box">
              <div className="nx-flow-tag">Your project</div>
              <div className="nx-flow-row">
                <div className="nx-flow-node">
                  <span className="nx-flow-you">›_</span>
                  <small>Your prompt</small>
                </div>
                <i className="nx-flow-ln" />
                <div className="nx-flow-node">
                  <span className="nx-flow-pill">tech-lead</span>
                  <small>plans</small>
                </div>
                <i className="nx-flow-ln" />
                <div className="nx-flow-node">
                  <span className="nx-flow-pill hot">specialists</span>
                  <small>build</small>
                </div>
                <i className="nx-flow-ln" />
                <div className="nx-flow-node">
                  <span className="nx-flow-pill">shipper</span>
                  <small>gates</small>
                </div>
                <i className="nx-flow-ln" />
                <div className="nx-flow-node">
                  <span className="nx-flow-out">
                    feat: stripe checkout <span className="ok">✓</span>
                  </span>
                  <small>Your repo</small>
                </div>
              </div>
            </div>
            <div className="nx-flow-side">
              <span className="nx-flow-chip">agentskit update</span>
              <span className="nx-flow-cloud" aria-hidden="true">
                ↻
              </span>
              <b>Updates</b>
              <small>free, for life</small>
            </div>
          </div>

          <div className="nx-grid2">
            <div className="nx-tile nx-fade">
              <h3>Lives in .claude/</h3>
              <p>Native Claude Code format. No new app, no daemon, no account.</p>
            </div>
            <div className="nx-tile nx-fade">
              <h3>Reads your CLAUDE.md</h3>
              <p>Teach it your project once. Never re-explain it again.</p>
            </div>
            <div className="nx-tile nx-fade">
              <h3>Any stack</h3>
              <p>Next.js, Django, Rails, Go, Rust. Zero forced architecture.</p>
            </div>
            <div className="nx-tile nx-fade">
              <h3>Plain files you own</h3>
              <p>
                Markdown agents and skills. Updates never touch your custom files. <a href="#faq">How updates work</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <Label ic="▭">How it works</Label>
            <h2 className="nx-h2">Two minutes, start to finish.</h2>
          </div>
          <ol className="nx-steps">
            <li className="nx-tile nx-fade">
              <span className="n">1</span>
              <h3>Buy</h3>
              <p>Pay once. Private-repo access lands the moment you check out.</p>
            </li>
            <li className="nx-tile nx-fade">
              <span className="n">2</span>
              <h3>Install</h3>
              <p>
                One <code>npx</code> command. Pick engineer, marketing, or both. Nothing global.
              </p>
            </li>
            <li className="nx-tile nx-fade">
              <span className="n">3</span>
              <h3>Prompt</h3>
              <p>Ask in plain English. tech-lead plans it, specialists build it, shipper gates it.</p>
            </li>
          </ol>
          <div className="nx-fade nx-term-wrap">
            <InstallTerminal id="term" />
          </div>
        </div>
      </section>

      {/* KITS */}
      <section id="kits" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <Label ic="◫">Two kits</Label>
            <h2 className="nx-h2">A software team. A growth team.</h2>
            <p className="nx-lead">
              Take one or both. They read the same codebase and the same <code>CLAUDE.md</code>,
              so the launch post knows what the feature actually does.
            </p>
          </div>
          <div className="nx-grid2">
            <div className="nx-tile nx-kit nx-fade">
              <div className="nx-kit-hd">
                <h3>Engineer Kit</h3>
                <span className="nx-kit-tag">the software team</span>
              </div>
              <div className="nx-kit-stats">
                <div>
                  <b>58</b>
                  <span>agents</span>
                </div>
                <div>
                  <b>61</b>
                  <span>skills</span>
                </div>
                <div>
                  <b>159</b>
                  <span>commands</span>
                </div>
              </div>
              <ul className="nx-checks">
                <li>
                  <b>tech-lead</b> plans and delegates, <b>shipper</b> gates every release
                </li>
                <li>backend-architect, react-specialist, typescript-pro, rust-pro, golang-pro</li>
                <li>postgres-pro, kubernetes-specialist, terraform-specialist, sre-engineer</li>
                <li>code-reviewer, test-automator, debugger, security-auditor</li>
                <li>Next.js, Tailwind, Drizzle, Docker, Stripe, MCP, TDD, Playwright skills</li>
              </ul>
            </div>
            <div className="nx-tile nx-kit nx-fade">
              <div className="nx-kit-hd">
                <h3>Marketing Kit</h3>
                <span className="nx-kit-tag">the growth team</span>
              </div>
              <div className="nx-kit-stats">
                <div>
                  <b>31</b>
                  <span>agents</span>
                </div>
                <div>
                  <b>61</b>
                  <span>skills</span>
                </div>
                <div>
                  <b>32</b>
                  <span>commands</span>
                </div>
              </div>
              <ul className="nx-checks">
                <li>
                  <b>growth-strategist</b> finds the funnel constraint, <b>brand-voice</b> keeps
                  copy on-brand
                </li>
                <li>seo-specialist, content-marketer, competitive-analyst, market-researcher</li>
                <li>/campaign-brief, /blog-post, /email-sequence, /landing-page, /launch-plan</li>
                <li>SEO audits, programmatic SEO, the full CRO set, pricing, attribution, PR</li>
                <li>
                  <span className="nx-new">New</span> 19 skills added recently, incl. GEO/AEO and
                  marketing-council
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* IN PRACTICE — you type / you get */}
      <section id="example" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <Label ic="✎">In practice</Label>
            <h2 className="nx-h2">You type it once. It ships like a team built it.</h2>
          </div>
          <div className="nx-say-get nx-fade">
            <div className="nx-tile nx-you">
              <div className="nx-mini">You type</div>
              <p>
                /create-feature add stripe checkout with webhooks, tests, and a launch post for the
                blog
              </p>
            </div>
            <span className="nx-arrow" aria-hidden="true">
              →
            </span>
            <div className="nx-tile nx-get">
              <div className="nx-mini">You get</div>
              <ul>
                <li>
                  <b>tech-lead</b> splits it into 4 tasks
                </li>
                <li>
                  <b>backend-architect</b> schema, route, webhook handler
                </li>
                <li>
                  <b>test-automator</b> 12 tests, all passing
                </li>
                <li>
                  <b>security-auditor</b> 0 critical findings
                </li>
                <li>
                  <b>shipper</b> ready to merge
                </li>
                <li>
                  <b>content-marketer</b> launch post drafted in your voice
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARED */}
      <section id="compare" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <Label ic="⇄">Compared</Label>
            <h2 className="nx-h2">AgentsKit vs building it yourself.</h2>
            <p className="nx-lead">
              Both end with a tuned Claude Code setup. One takes about two minutes. One takes a
              year of evenings.
            </p>
          </div>
          <div className="nx-table-wrap nx-fade">
            <table className="nx-table">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr">Job</span>
                  </th>
                  <th scope="col">AgentsKit</th>
                  <th scope="col">Building it yourself</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.job}>
                    <th scope="row">{r.job}</th>
                    <td className={r.kitWins === false ? "" : "win"}>{r.kit}</td>
                    <td className={r.kitWins === false ? "win" : ""}>{r.diy}</td>
                  </tr>
                ))}
                <tr className="total">
                  <th scope="row">Time to a working team</th>
                  <td className="win">~2 minutes</td>
                  <td>56+ hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="nx-more nx-fade">
            <a href="/comparisons">See more comparisons →</a>
          </p>
        </div>
      </section>

      {/* REVIEWS — real buyers, each links out to the live tweet */}
      <section id="reviews" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <Label ic="❝">Reviews</Label>
            <h2 className="nx-h2">From people who bought it.</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <Label ic="$">Pricing</Label>
          </div>

          {/* GEO OFFER, rendered only for visitors in an eligible country */}
          {geoOffer.eligible && (
            <div className="nx-geo" role="note">
              <span className="flag" aria-hidden="true">
                {geoOffer.flag ?? "🌍"}
              </span>
              <div className="copy">
                <b>
                  {GEO_DISCOUNT.percent}% off
                  {geoOffer.countryName ? ` in ${geoOffer.countryName}` : " where you are"}.
                </b>{" "}
                Purchasing-power pricing — your country is eligible. Your code{" "}
                <code>{GEO_DISCOUNT.code}</code> is waiting in the discount box at checkout. Hit{" "}
                <b>Apply</b> to take {GEO_DISCOUNT.percent}% off.
              </div>
            </div>
          )}

          <div className="nx-price nx-fade">
            <div className="nx-price-l">
              <h2 className="nx-h2">No subscription.</h2>
              <p>
                Pay once, get private-repo access the moment you check out, and every future update
                after that. No seats, no renewal, nothing to cancel. Works with any Claude Code
                plan: Pro, Max, Team or API.
              </p>
              <ul className="nx-checks">
                <li>Both kits: 89 agents, 122 skills, 181 commands</li>
                <li>Both CLAUDE.md templates + the agentskit CLI</li>
                <li>Private repo, lifetime updates</li>
                <li>14-day money-back guarantee, no questions asked</li>
              </ul>
              <p className="nx-price-foot">
                Bought apart, the two kits are $
                {PLAN_BY_ID.engineer.price + PLAN_BY_ID.marketing.price}. Just need one team? See
                the single kits below.
              </p>
            </div>
            <div className="nx-price-r">
              <div className="nx-price-name">Complete Bundle</div>
              <div className="nx-price-amt">
                <span className="big">${bundle.price}</span>
                {bundle.was && <span className="was">${bundle.was}</span>}
              </div>
              <div className={`nx-price-pill${bundleTier.left !== null ? " hot" : ""}`}>
                {bundleTier.left !== null ? `${bundleTier.left} launch seats left` : "List price"}
              </div>
              <div className="nx-price-once">once, lifetime updates</div>
              {/* POLAR: Bundle product checkout link */}
              <a
                className="nx-btn nx-btn-primary nx-btn-lg"
                href={withDiscount(bundle.checkoutUrl, geoOffer.eligible)}
                data-polar-checkout=""
                data-polar-checkout-theme="dark"
                onClick={trackSignup}
                data-fast-goal="initiate_checkout"
                data-fast-goal-plan="bundle"
                data-fast-goal-price={String(bundle.price)}
                data-fast-goal-geo-offer={geoOffer.eligible ? GEO_DISCOUNT.code : undefined}
              >
                {bundle.cta}
              </a>
              {bundleTier.left !== null && bundleTier.nextPrice !== null && (
                <div className="nx-price-urgency">
                  Goes to <b>${bundleTier.nextPrice}</b> after {bundleTier.left} more{" "}
                  {bundleTier.left === 1 ? "sale" : "sales"}
                </div>
              )}
              <p className="nx-price-fine">
                Secure checkout via Polar · instant private-repo access · 14-day money-back
                guarantee
              </p>
            </div>
          </div>

          <div className="nx-singles">
            {singles.map((p) => (
              <div className="nx-tile nx-single nx-fade" key={p.id}>
                <div>
                  <h3>{p.name}</h3>
                  <p>
                    {p.who} ·{" "}
                    {p.id === "engineer"
                      ? "58 agents, 61 skills, 159 commands"
                      : "31 agents, 61 skills, 32 commands"}
                  </p>
                </div>
                <div className="nx-single-buy">
                  <span className="amt">
                    ${p.price}
                    {p.was && <s>${p.was}</s>}
                  </span>
                  {/* POLAR: single-kit product checkout link */}
                  <a
                    className="nx-btn nx-btn-line"
                    href={withDiscount(p.checkoutUrl, geoOffer.eligible)}
                    data-polar-checkout=""
                    data-polar-checkout-theme="dark"
                    onClick={trackSignup}
                    data-fast-goal="initiate_checkout"
                    data-fast-goal-plan={p.id}
                    data-fast-goal-price={String(p.price)}
                    data-fast-goal-geo-offer={geoOffer.eligible ? GEO_DISCOUNT.code : undefined}
                  >
                    {p.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* PRICE LADDER, states the live bundle price (and, during a launch,
              how many seats are left before it rises) */}
          <PriceLadder fade />

          <p className="nx-plan-note">
            {bundleTier.left !== null && bundleTier.nextPrice !== null ? (
              <>
                Launch pricing. {bundleTier.left} seats remain at ${bundleTier.price}, the next
                buyer after that pays ${bundleTier.nextPrice}.
              </>
            ) : (
              <>Launch pricing has ended. This is the list price.</>
            )}
          </p>
          <div className="nx-plan-proof">
            <TrustMrrBadge />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <Label ic="?">FAQ</Label>
            <h2 className="nx-h2">Questions people ask.</h2>
          </div>
          <div className="nx-faq">
            <details className="nx-q">
              <summary data-fast-goal="faq_need_claude_code">
                Do I need Claude Code? Does it work with Cursor or ChatGPT?
                <span className="plus">+</span>
              </summary>
              <div className="a">
                Yes. AgentsKit is built specifically for{" "}
                <a href="https://claude.com/claude-code">Claude Code</a>, Anthropic&apos;s AI coding
                tool for the terminal, desktop app, and IDE. The kits are agents, skills, and slash
                commands that live in your project&apos;s <code>.claude/</code> folder, which is a
                Claude Code format. It does not run inside Cursor, Copilot, or the ChatGPT app. Any
                Claude Code plan works: Pro, Max, Team, or API billing.
              </div>
            </details>
            <details className="nx-q">
              <summary data-fast-goal="faq_what_do_i_get">
                What exactly do I get?
                <span className="plus">+</span>
              </summary>
              <div className="a">
                Access to a private GitHub repo containing the kit(s) you bought: a{" "}
                <code>.claude/</code> directory of agents, skills, and slash commands, CLAUDE.md
                templates, the <code>agentskit</code> installer CLI, and full docs. You drop it into
                any project with a one-line <code>npx github:getagentskit/…</code> command that
                pulls straight from your private repo. The exact command is in your repo&apos;s
                README.
              </div>
            </details>
            <details className="nx-q">
              <summary data-fast-goal="faq_need_to_code">
                Do I need to know how to code?
                <span className="plus">+</span>
              </summary>
              <div className="a">
                You need <a href="https://claude.com/claude-code">Claude Code</a> and a project to
                work in. The agents do the heavy lifting. You direct them in plain English.
                Installation is a single command.
              </div>
            </details>
            <details className="nx-q">
              <summary data-fast-goal="faq_framework_lock_in">
                Does it lock me into a framework?
                <span className="plus">+</span>
              </summary>
              <div className="a">
                No. Agents adapt to your stack (Next.js, Django, Rails, Go, Rust, anything) by
                reading your CLAUDE.md. Zero forced architecture.
              </div>
            </details>
            <details className="nx-q">
              <summary data-fast-goal="faq_how_updates_work">
                How do updates work?
                <span className="plus">+</span>
              </summary>
              <div className="a">
                Buy once, get every future update. Run <code>agentskit update</code> (or{" "}
                <code>git pull</code>) to refresh. Your custom files and CLAUDE.md are never
                touched.
              </div>
            </details>
            <details className="nx-q">
              <summary data-fast-goal="faq_anthropic_affiliation">
                Is this affiliated with Anthropic?
                <span className="plus">+</span>
              </summary>
              <div className="a">
                No. AgentsKit is an independent, unofficial product and is not affiliated with,
                endorsed by, or sponsored by Anthropic. &quot;Claude&quot; and &quot;Claude
                Code&quot; are trademarks of Anthropic.
              </div>
            </details>
            <details className="nx-q">
              <summary data-fast-goal="faq_refund_policy">
                Is there a money-back guarantee?
                <span className="plus">+</span>
              </summary>
              <div className="a">
                <p>Yes. 14 days, full refund, no questions asked.</p>
                <p>
                  Put AgentsKit on a real feature. If it doesn&apos;t save you hours on that first
                  ship, email us within 14 days and we&apos;ll send the money back.
                </p>
                <p>
                  We can offer that because the kit isn&apos;t theory. Every agent, skill, and
                  command in it earned its place in real production work before it shipped to you.
                </p>
              </div>
            </details>
          </div>
          <p className="nx-more">
            Still stuck?{" "}
            <a
              href="mailto:epictools.io@gmail.com"
              data-fast-goal="contact_email"
              data-fast-goal-location="faq"
            >
              Email us
            </a>
            . Want to see it first? <a href="/demo">Watch the demo</a>.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="nx-final">
        <div className="nx-wrap nx-fade">
          <h2 className="nx-h2">
            Just prompt. <em>It ships.</em>
          </h2>
          <div className="nx-cta-row">
            <a
              className="nx-btn nx-btn-primary"
              href="#pricing"
              data-fast-goal="cta_get_claudethings"
              data-fast-goal-location="final_cta"
            >
              Get AgentsKit
            </a>
            <a className="nx-btn nx-btn-soft" href="/demo" data-fast-goal="cta_see_demo" data-fast-goal-location="final_cta">
              <span className="play" aria-hidden="true">
                ▶
              </span>
              See demo
            </a>
          </div>
          <span className="nx-micro">
            ${bundle.price} once · Lifetime updates · Works with any Claude Code plan
          </span>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
