"use client";

import { useEffect, useState } from "react";
import { GEO_DISCOUNT, useGeoDiscount, withDiscount } from "./lib/geoDiscount";
import { PLAN_BY_ID } from "./lib/plans";
import { PriceLadder, ProofPill, TrustMrrBadge, ladderState } from "./components/pricing";
import { SITE_URL } from "@/app/lib/site";
import "./home.css";

/**
 * AgentsKit landing page (Next.js App Router) — dark, nexflow-inspired.
 * Styling lives in app/home.css (nx- prefixed, scoped to this page only;
 * globals.css keeps serving /tools, /blog, legal and the validator pages).
 * Buy buttons use Polar's embed (loaded in layout.tsx); the checkout
 * URLs live in app/lib/plans.ts.
 */

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
        <div className="nx-center nx-fade">
          <div className="nx-label">Everything you get</div>
          <h2 className="nx-h2 nx-xh">
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
            <br />
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
          <p className="nx-lead nx-xlead">{EXPLORER_LEAD[kit][tab]}</p>
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

/* =====================================================================
   THE LEDGER — what assembling this yourself actually costs.
   Both columns are the same nine jobs: on the left the hours they take
   when you build the setup from scratch, on the right the component in
   the kit that already does it. The total at the bottom is just the sum
   of the left column, so the claim stays checkable.
   ===================================================================== */

type LedgerRow = { cost: string; job: string; fix: string; via: string };

const LEDGER: LedgerRow[] = [
  { cost: "6+ hrs", job: "Writing a system prompt that Claude actually keeps to", fix: "One CLAUDE.md", via: "read first by all 89 agents" },
  { cost: "2 days", job: "Wiring agents that hand work to each other cleanly", fix: "tech-lead → specialist → shipper", via: "delegation already wired" },
  { cost: "4+ hrs", job: "Re-explaining your stack and conventions every session", fix: "Taught once", via: "matched on every task after" },
  { cost: "8+ hrs", job: "Hand-rolling a review and test workflow you trust", fix: "/multi-agent-review", via: "code-reviewer · test-automator" },
  { cost: "5+ hrs", job: "Rewriting the release checklist before every launch", fix: "/deploy-checklist", via: "sre-engineer · shipper" },
  { cost: "10+ hrs", job: "Learning container, CI and infra patterns the hard way", fix: "/setup-ci-cd-pipeline", via: "docker-expert · terraform-specialist" },
  { cost: "3+ hrs", job: "Hunting for a marketing framework to structure the copy", fix: "marketing-council", via: "offers · marketing-psychology" },
  { cost: "4+ hrs", job: "Guessing at SEO structure and hoping it indexes", fix: "/seo-audit", via: "programmatic-seo · schema-markup" },
  { cost: "∞", job: "Never being sure the setup you built is any good", fix: "agentskit doctor", via: "plus free updates, for life" },
];

/**
 * The cost ledger. One dataset, two readings — flip the switch and every
 * row swaps its price tag for the thing in the kit that removes it.
 */
function CostLedger() {
  const [withKit, setWithKit] = useState(false);

  return (
    <section id="cost" className="nx-sec">
      <div className="nx-wrap">
        <div className="nx-center nx-fade">
          <div className="nx-label">The honest math</div>
          <h2 className="nx-h2 nx-xh">
            Stop assembling the team.
            <br />
            <em>Start shipping the product.</em>
          </h2>
          <p className="nx-lead nx-xlead">
            A year of tuning agents, skills and prompts, already done. Here is the bill you skip.
          </p>
          <div className="nx-switch" role="group" aria-label="Cost view">
            <button
              type="button"
              className={!withKit ? "on" : ""}
              aria-pressed={!withKit}
              onClick={() => setWithKit(false)}
            >
              Building it yourself
            </button>
            <button
              type="button"
              className={withKit ? "on" : ""}
              aria-pressed={withKit}
              onClick={() => setWithKit(true)}
            >
              With AgentsKit
            </button>
          </div>
        </div>

        <div className={`nx-ledger${withKit ? " nx-on" : ""}`}>
          <ol className="nx-ledger-rows" key={withKit ? "kit" : "diy"}>
            {LEDGER.map((r) => (
              <li className="nx-lrow" key={r.job}>
                <span className="mk" aria-hidden="true">
                  {withKit ? "✓" : "+"}
                </span>
                <span className="cost">{withKit ? r.fix : r.cost}</span>
                <span className="job">{withKit ? r.via : r.job}</span>
              </li>
            ))}
          </ol>

          <aside className="nx-seal-wrap nx-fade">
            <div className="nx-seal" aria-hidden="true">
              <div className="ring"></div>
              <div className="core">
                <b>{withKit ? "~2" : "56+"}</b>
                <span>{withKit ? "minutes" : "hours"}</span>
              </div>
            </div>
            <p className="nx-seal-note">
              {withKit
                ? "One npx command, one CLAUDE.md, and the whole team is on your project. Everything above ships in the box."
                : "That is the left column added up — before you have written a single line of the product you actually wanted to build."}
            </p>
            <a
              className="nx-btn nx-btn-primary nx-btn-lg"
              href="#pricing"
              data-fast-goal="cta_get_claudethings"
              data-fast-goal-location="cost_ledger"
            >
              Skip the 56 hours <span className="ar">↗</span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

/**
 * Terminal mockup for the one-command install animation. Rendered twice (hero and
 * the "One-command install" row), so every element id is namespaced by `id` and the
 * typing effect below is wired up per instance.
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
const TERMINAL_IDS = ["hero-term", "term"];

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

export default function Home() {
  // Purchasing-power 50% offer. Ineligible everywhere off the country list,
  // and on the first paint.
  const geoOffer = useGeoDiscount();
  // Which launch tier the bundle is selling at right now, and how much of it
  // is left. Drives the ladder, the card ribbon and the closing note so the
  // whole pricing block tells one consistent story.
  const bundleTier = ladderState();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // nav scrolled state
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    // scroll reveal
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.14 }
    );
    document.querySelectorAll(".nx-fade").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // count up
    const cio = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const end = Number(el.dataset.count);
          let t0: number | null = null;
          const step = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / 1100, 1);
            el.textContent = String(Math.floor((1 - Math.pow(1 - p, 3)) * end));
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = String(end);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        }),
      { threshold: 0.6 }
    );
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => cio.observe(el));
    cleanups.push(() => cio.disconnect());

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

  const year = new Date().getFullYear();

  const dashboard = (
    <div className="nx-dash">
      <div className="nx-dash-crumb">
        <span>
          AgentsKit <span className="sep">/</span> your-project <span className="sep">/</span>{" "}
          agents
        </span>
        <span className="nx-dash-alert">⚡ 2 agents running</span>
      </div>
      <div className="nx-dash-tabs">
        <span className="nx-dash-tab on">
          Agents<span className="n">89</span>
        </span>
        <span className="nx-dash-tab">
          Skills<span className="n">122</span>
        </span>
        <span className="nx-dash-tab">
          Commands<span className="n">181</span>
        </span>
        <span className="nx-dash-tab">Activity</span>
      </div>
      <div className="nx-dash-head">
        <span>Status</span>
        <span>Agent</span>
        <span className="col-prog">Progress</span>
      </div>
      <div className="nx-dash-row">
        <span className="nx-badge done">Completed</span>
        <div>
          <div className="task">tech-lead · plan auth feature</div>
          <div className="meta">
            <span>Delegated 3 tasks</span>
            <span>Plan approved</span>
          </div>
        </div>
        <div className="nx-prog">
          <span className="pd ok">✓</span>
          <span className="pl"></span>
          <span className="pd ok">✓</span>
          <span className="pl"></span>
          <span className="pd ok">✓</span>
        </div>
      </div>
      <div className="nx-dash-row">
        <span className="nx-badge run">Running</span>
        <div>
          <div className="task">react-specialist · build login UI</div>
          <div className="meta">
            <span>Auto-delegated</span>
            <span>In progress</span>
          </div>
        </div>
        <div className="nx-prog">
          <span className="pd ok">✓</span>
          <span className="pl"></span>
          <span className="pd spin">●</span>
          <span className="pl"></span>
          <span className="pd"></span>
        </div>
      </div>
      <div className="nx-dash-row">
        <span className="nx-badge done">Completed</span>
        <div>
          <div className="task">security-auditor · pre-ship audit</div>
          <div className="meta">
            <span>0 critical</span>
            <span>Report ready</span>
          </div>
        </div>
        <div className="nx-prog">
          <span className="pd ok">✓</span>
          <span className="pl"></span>
          <span className="pd ok">✓</span>
          <span className="pl"></span>
          <span className="pd ok">✓</span>
        </div>
      </div>
      <div className="nx-dash-row">
        <span className="nx-badge queue">Queued</span>
        <div>
          <div className="task">seo-specialist · launch blog post</div>
          <div className="meta">
            <span>Waiting on ship</span>
          </div>
        </div>
        <div className="nx-prog">
          <span className="pd"></span>
          <span className="pl"></span>
          <span className="pd"></span>
          <span className="pl"></span>
          <span className="pd"></span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="nx-page">
      <div className="nx-frame" aria-hidden="true"></div>

      {/* NAV */}
      <nav id="nav" className="nx-nav">
        <div className="nx-nav-inner">
          <a className="nx-logo" href="#top">
            AgentsKit
          </a>
          <div className="nx-nav-links">
            <a href="#whats-inside">What&apos;s inside</a>
            <a href="#kits">Kits</a>
            <a href="/tools">Free tools</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a
              className="nx-btn nx-btn-primary"
              href="#pricing"
              data-fast-goal="cta_get_claudethings"
              data-fast-goal-location="nav"
            >
              Get AgentsKit <span className="ar">↗</span>
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="nx-hero">
        <div className="nx-wrap">
          {/* centered editorial stack: eyebrow → display headline → sub → CTAs → fine print */}
          <div className="nx-hero-center">
            <div className="nx-chip nx-hero-chip nx-rise nx-d1">
              <b>New</b> Meet your AI workforce for Claude Code
            </div>
            <h1 className="nx-h1 nx-rise nx-d2">
              Your AI <em>engineering &amp; marketing</em> team{" "}
              <span className="nb">in one command</span>
            </h1>
            <p className="nx-sub nx-rise nx-d3">
              AgentsKit drops in <b>89 specialist agents</b>, <b>122 skills</b> and{" "}
              <b>181 slash commands</b> with one command, so one person can plan, build, test, ship{" "}
              <b>and</b> market a real product.
            </p>
            <div className="nx-cta-row nx-rise nx-d4">
              <a
                className="nx-btn nx-btn-primary nx-btn-lg"
                href="#pricing"
                data-fast-goal="cta_get_claudethings"
                data-fast-goal-location="hero"
              >
                Get AgentsKit <span className="ar">↗</span>
              </a>
              <a className="nx-btn nx-btn-ghost nx-btn-lg" href="#whats-inside">
                ▷ See what&apos;s inside
              </a>
            </div>
            <div className="nx-micro nx-hero-fine nx-rise nx-d4">
              Requires Claude Code · One-time payment · Lifetime updates
            </div>
            <div className="nx-hero-proof nx-rise nx-d4">
              <ProofPill />
            </div>
          </div>

          {/* showcase: install terminal on the warm vista + the kit ledger */}
          <div className="nx-hero-showcase">
            <div className="nx-hero-term nx-rise nx-d5">
              <InstallTerminal id="hero-term" />
            </div>
            <aside className="nx-hero-ledger nx-rise nx-d5">
              <div className="nx-hero-ledger-label">Inside the kit</div>
              <ul>
                <li>
                  <b data-count="89">89</b>
                  <span>agents</span>
                </li>
                <li>
                  <b data-count="122">122</b>
                  <span>skills</span>
                </li>
                <li>
                  <b data-count="181">181</b>
                  <span>slash commands</span>
                </li>
                <li>
                  <b>2</b>
                  <span>kits ( engineer + marketing )</span>
                </li>
                <li>
                  <b className="word">npx</b>
                  <span>· no install needed</span>
                </li>
              </ul>
            </aside>
          </div>
        </div>

        {/* agent roster ticker */}
        <div className="nx-marquee" aria-hidden="true">
          <div className="nx-marquee-track">
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
      </header>

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* TESTIMONIAL — real buyer, links out to the live tweet */}
      <section id="reviews" className="nx-sec nx-say">
        <div className="nx-wrap">
          <div className="nx-center nx-fade">
            <div className="nx-label">What people say</div>
          </div>
          <Testimonials />
        </div>
      </section>

      <div className="nx-hatch" aria-hidden="true"></div>

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* WHAT'S INSIDE — feature rows */}
      <section id="whats-inside" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-center nx-fade">
            <div className="nx-label">A team, not a tool</div>
            <h2 className="nx-h2">Stop prompting a generalist. Start delegating to specialists.</h2>
            <p className="nx-lead">
              Everything installs into your project&apos;s <code>.claude/</code> folder, so
              Claude Code picks it up automatically. No new tool to learn. It&apos;s the Claude
              Code you already use, with a team behind it.
            </p>
          </div>
          <div className="nx-rows">
            {/* row 1: terminal */}
            <div className="nx-row nx-fade">
              <div className="nx-row-media">
                <InstallTerminal id="term" />
              </div>
              <div className="nx-row-text">
                <div className="nx-kicker">One-command install</div>
                <h3>Live in your project in under 2 minutes</h3>
                <p>
                  Paste one <code>npx</code> command. Pick engineer, marketing, or both. No global
                  install, nothing to configure. Agents, skills and commands land in{" "}
                  <code>.claude/</code> and Claude Code picks them up automatically.
                </p>
                <a
                  className="nx-btn nx-btn-ghost"
                  href="#pricing"
                  data-fast-goal="cta_get_claudethings"
                  data-fast-goal-location="row_install"
                >
                  Get AgentsKit <span className="ar">↗</span>
                </a>
              </div>
            </div>
            {/* row 2: your stack */}
            <div className="nx-row nx-fade">
              <div className="nx-row-media">
                <div className="nx-ui">
                  <div className="u-label">Adapts to your stack</div>
                  <div className="nx-ui-line">
                    <span className="ck">✓</span> Next.js · Django · Rails · Go · Rust
                  </div>
                  <div className="nx-ui-line">
                    <span className="ck">✓</span> Reads your CLAUDE.md once
                  </div>
                  <div className="nx-ui-line">
                    <span className="ck">✓</span> Matches your patterns &amp; conventions
                  </div>
                  <div className="nx-ui-line">
                    <span className="ck">✓</span> Zero forced architecture
                  </div>
                </div>
              </div>
              <div className="nx-row-text">
                <div className="nx-kicker">No forced framework</div>
                <h3>Drops into the project you already have</h3>
                <p>
                  Agents learn your actual codebase and match your patterns, instead of dumping
                  someone else&apos;s architecture on top of yours. Teach it your project once in{" "}
                  <code>CLAUDE.md</code>, and never re-explain it again.
                </p>
                <a className="nx-btn nx-btn-ghost" href="#kits">
                  Explore the kits <span className="ar">↗</span>
                </a>
              </div>
            </div>
            {/* row 3: code → launch */}
            <div className="nx-row nx-fade">
              <div className="nx-row-media">
                <div className="nx-ui">
                  <div className="u-label">From first commit to launch day</div>
                  <div className="nx-ui-line">
                    <span className="ck">🛠</span> Engineer: 58 agents · 61 skills · 159 commands
                  </div>
                  <div className="nx-ui-line">
                    <span className="ck">📣</span> Marketing: 31 agents · 61 skills · 32 commands
                  </div>
                  <div className="nx-ui-line">
                    <span className="ck">✓</span> agentskit update → free, forever
                  </div>
                </div>
              </div>
              <div className="nx-row-text">
                <div className="nx-kicker">Two teams in one</div>
                <h3>
                  From first commit <em>to</em> launch day
                </h3>
                <p>
                  Engineers who build and ship the feature, marketers who write the launch, the
                  emails and the SEO. Most kits stop at the code. Yours takes the product all the
                  way to customers. And when Anthropic ships a smarter Claude, your whole team
                  levels up automatically.
                </p>
                <a
                  className="nx-btn nx-btn-ghost"
                  href="#pricing"
                  data-fast-goal="cta_get_claudethings"
                  data-fast-goal-location="row_launch"
                >
                  Get both kits <span className="ar">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* KITS */}
      <section id="kits" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-center nx-fade">
            <div className="nx-label">Two kits · take one or both</div>
            <h2 className="nx-h2">A full software team. A full growth team.</h2>
            <p className="nx-lead">
              Both are native Claude Code kits: agents you call by name, skills Claude loads on its
              own exactly when they&apos;re needed, and slash commands you fire straight from the
              prompt.
            </p>
          </div>
          <div className="nx-kits">
            {/* ENGINEER */}
            <div className="nx-kit nx-fade">
              <span className="nx-kit-tag">Engineer</span>
              <h3>Engineer Kit</h3>
              <div className="role">the software team</div>
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
              <ul>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    <b>tech-lead</b> plans &amp; delegates; <b>shipper</b> gates every release.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    Build across the stack: <code>backend-architect</code>,{" "}
                    <code>react-specialist</code>, <code>typescript-pro</code>,{" "}
                    <code>python-pro</code>, <code>golang-pro</code>, <code>rust-pro</code>.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    Data &amp; infra: <code>postgres-pro</code>, <code>kubernetes-specialist</code>,{" "}
                    <code>terraform-specialist</code>, <code>sre-engineer</code>.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    Quality: <code>code-reviewer</code>, <code>test-automator</code>,{" "}
                    <code>debugger</code>, <code>security-auditor</code>.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    61 skills covering Next.js, Tailwind, Drizzle, Docker, Stripe, MCP, TDD,
                    Playwright… plus <code>/api-scaffold</code>, <code>/test-coverage</code>,{" "}
                    <code>/deploy-checklist</code>.
                  </span>
                </li>
              </ul>
            </div>
            {/* MARKETING */}
            <div className="nx-kit mkt nx-fade">
              <span className="nx-kit-tag">Marketing</span>
              <h3>Marketing Kit</h3>
              <div className="role">the growth team</div>
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
              <div className="nx-whatsnew">
                <span className="nx-badge fresh">NEW</span>
                <p>
                  <b>19 new skills added recently</b> — offers &amp; guarantees, an advisory{" "}
                  <code>marketing-council</code>, AI-search optimization (GEO/AEO), attribution,
                  churn prevention, RevOps, PR, cold email, SMS, video, lead magnets, directory
                  submissions, and more.
                </p>
              </div>
              <ul>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    <b>growth-strategist</b> finds your funnel&apos;s constraint;{" "}
                    <b>brand-voice</b> keeps copy on-brand &amp; legally clean.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    Specialists: <code>seo-specialist</code>, <code>content-marketer</code>,{" "}
                    <code>competitive-analyst</code>, <code>market-researcher</code>.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    Commands that ship: <code>/campaign-brief</code>, <code>/blog-post</code>,{" "}
                    <code>/email-sequence</code>, <code>/landing-page</code>,{" "}
                    <code>/launch-plan</code>.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    61 skills covering SEO audits, programmatic SEO, the full CRO set, offers,
                    pricing, paid ads, attribution, retention, RevOps, PR, and marketing
                    psychology.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>From positioning to launch day, the same context as your code.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* NUMBERS */}
          <div className="nx-numbers nx-fade" style={{ marginTop: 16 }}>
            <div className="nx-num">
              <b data-count="89">89</b>
              <span>specialized agents</span>
            </div>
            <div className="nx-num">
              <b data-count="122">122</b>
              <span>pre-built skills</span>
            </div>
            <div className="nx-num">
              <b data-count="181">181</b>
              <span>slash commands</span>
            </div>
          </div>
        </div>
      </section>

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* KIT EXPLORER — everything the kits ship, browsable by kit and type */}
      <KitExplorer />

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* COST LEDGER — what building this setup yourself actually costs */}
      <CostLedger />

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* PRICING */}
      <section id="pricing" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-center nx-fade">
            <div className="nx-label">Pricing</div>
            <h2 className="nx-h2">Less than an hour of a freelancer. Yours for good.</h2>
            <p className="nx-lead">
              One payment, lifetime access, and every future update included. Delivered instantly
              as private-repo access the moment you check out. No subscription, no seats. Works
              with any Claude Code plan: Pro, Max, Team, or API. The bundle is $
              {PLAN_BY_ID.bundle.price} for both kits — $
              {PLAN_BY_ID.engineer.price + PLAN_BY_ID.marketing.price} if you buy them apart.
            </p>
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

          <div className="nx-proof-center nx-fade">
            <ProofPill />
          </div>

          {/* PRICE LADDER, states the live bundle price (and, during a launch,
              how many seats are left before it rises) */}
          <PriceLadder fade />

          <div className="nx-price-grid">
            {/* ENGINEER */}
            <div className="nx-plan nx-fade">
              <div className="nx-plan-head">
                <div>
                  <h3>Engineer Kit</h3>
                  <div className="who">the software team</div>
                </div>
              </div>
              <div className="nx-plan-buy">
                <div className="amt">
                  <span className="cur">$</span>
                  <span className="big">{PLAN_BY_ID.engineer.price}</span>
                  {PLAN_BY_ID.engineer.was && (
                    <span className="was">${PLAN_BY_ID.engineer.was}</span>
                  )}
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: Engineer product checkout link */}
                <a
                  className="nx-btn nx-btn-ghost"
                  href={withDiscount(PLAN_BY_ID.engineer.checkoutUrl, geoOffer.eligible)}
                  data-polar-checkout=""
                  data-polar-checkout-theme="dark"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="engineer"
                  data-fast-goal-price={String(PLAN_BY_ID.engineer.price)}
                  data-fast-goal-geo-offer={geoOffer.eligible ? GEO_DISCOUNT.code : undefined}
                >
                  {PLAN_BY_ID.engineer.cta} <span className="ar">↗</span>
                </a>
              </div>
              <ul>
                <li>
                  <span className="ck">✓</span> 58 engineering agents
                </li>
                <li>
                  <span className="ck">✓</span> 61 pre-built skills
                </li>
                <li>
                  <span className="ck">✓</span> 159 slash commands
                </li>
                <li>
                  <span className="ck">✓</span> CLAUDE.md template + CLI
                </li>
                <li>
                  <span className="ck">✓</span> Private repo + lifetime updates
                </li>
              </ul>
            </div>
            {/* BUNDLE */}
            <div className="nx-plan featured nx-fade">
              <div className="nx-plan-head">
                <div>
                  <h3>Complete Bundle</h3>
                  <div className="who">engineer + marketing</div>
                </div>
                <div className={`pill${bundleTier.left !== null ? " hot" : ""}`}>
                  {bundleTier.left !== null ? `${bundleTier.left} seats left` : "List price"}
                </div>
              </div>
              <div className="nx-plan-buy">
                <div className="amt">
                  <span className="cur">$</span>
                  <span className="big">{PLAN_BY_ID.bundle.price}</span>
                  {PLAN_BY_ID.bundle.was && (
                    <span className="was">${PLAN_BY_ID.bundle.was}</span>
                  )}
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: Bundle product checkout link */}
                <a
                  className="nx-btn nx-btn-primary"
                  href={withDiscount(PLAN_BY_ID.bundle.checkoutUrl, geoOffer.eligible)}
                  data-polar-checkout=""
                  data-polar-checkout-theme="dark"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="bundle"
                  data-fast-goal-price={String(PLAN_BY_ID.bundle.price)}
                  data-fast-goal-geo-offer={geoOffer.eligible ? GEO_DISCOUNT.code : undefined}
                >
                  {PLAN_BY_ID.bundle.cta} <span className="ar">↗</span>
                </a>
                {bundleTier.left !== null && bundleTier.nextPrice !== null && (
                  <div className="nx-plan-urgency">
                    <span className="ico" aria-hidden="true">
                      ↑
                    </span>
                    <span>
                      Goes to <b>${bundleTier.nextPrice}</b> after {bundleTier.left} more{" "}
                      {bundleTier.left === 1 ? "sale" : "sales"}
                    </span>
                  </div>
                )}
              </div>
              <ul>
                <li>
                  <span className="ck">✓</span>{" "}
                  <span>
                    <b>Everything</b> in both kits
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span> 89 agents · 122 skills · 181 commands
                </li>
                <li>
                  <span className="ck">✓</span>{" "}
                  <span>
                    Ship code <em>and</em> growth
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span> Both CLAUDE.md templates
                </li>
                <li>
                  <span className="ck">✓</span> Private repo + lifetime updates
                </li>
              </ul>
            </div>
            {/* MARKETING */}
            <div className="nx-plan nx-fade">
              <div className="nx-plan-head">
                <div>
                  <h3>Marketing Kit</h3>
                  <div className="who">the growth team</div>
                </div>
              </div>
              <div className="nx-plan-buy">
                <div className="amt">
                  <span className="cur">$</span>
                  <span className="big">{PLAN_BY_ID.marketing.price}</span>
                  {PLAN_BY_ID.marketing.was && (
                    <span className="was">${PLAN_BY_ID.marketing.was}</span>
                  )}
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: Marketing product checkout link */}
                <a
                  className="nx-btn nx-btn-ghost"
                  href={withDiscount(PLAN_BY_ID.marketing.checkoutUrl, geoOffer.eligible)}
                  data-polar-checkout=""
                  data-polar-checkout-theme="dark"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="marketing"
                  data-fast-goal-price={String(PLAN_BY_ID.marketing.price)}
                  data-fast-goal-geo-offer={geoOffer.eligible ? GEO_DISCOUNT.code : undefined}
                >
                  {PLAN_BY_ID.marketing.cta} <span className="ar">↗</span>
                </a>
              </div>
              <ul>
                <li>
                  <span className="ck">✓</span> 31 marketing agents
                </li>
                <li>
                  <span className="ck">✓</span> 61 pre-built skills
                </li>
                <li>
                  <span className="ck">✓</span> 32 slash commands
                </li>
                <li>
                  <span className="ck">✓</span> Brand CLAUDE.md template + CLI
                </li>
                <li>
                  <span className="ck">✓</span> Private repo + lifetime updates
                </li>
              </ul>
            </div>
          </div>
          {/* GUARANTEE, sits directly under the plans so it reads with the price */}
          <div className="nx-guarantee nx-fade" role="note">
            <span className="seal" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path
                  d="M12 2.6 4.2 5.6v6c0 4.4 3.1 8.3 7.8 9.8 4.7-1.5 7.8-5.4 7.8-9.8v-6L12 2.6Z"
                  strokeLinejoin="round"
                />
                <path d="m8.6 11.9 2.4 2.4 4.4-4.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="copy">
              <b>14-Day Money-Back Guarantee</b>
              <span>No questions asked</span>
            </div>
          </div>
          <div className="nx-plan-foot">
            [ Secure checkout via Polar · instant private-repo access after purchase ]
          </div>
          <p className="nx-plan-note">
            {bundleTier.left !== null && bundleTier.nextPrice !== null ? (
              <>
                Launch pricing. {bundleTier.left} seats remain at ${bundleTier.price} — the next
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

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* FAQ */}
      <section id="faq" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-faq-split">
            <div className="nx-faq-side nx-fade">
              <div className="nx-label">FAQs</div>
              <h2 className="nx-h2">Got questions? We&apos;ve got answers.</h2>
              <div className="nx-faq-contact">
                <p>Still have questions?</p>
                <span>Reach out anytime</span>
                <a
                  className="nx-btn nx-btn-primary"
                  href="mailto:epictools.io@gmail.com"
                  data-fast-goal="contact_email"
                  data-fast-goal-location="faq"
                >
                  Email us <span className="ar">↗</span>
                </a>
              </div>
            </div>
            <div className="nx-faq">
              <details className="nx-q nx-fade">
                <summary data-fast-goal="faq_need_claude_code">
                  <span className="qn">01</span> Do I need Claude Code? Does it work with Cursor or
                  ChatGPT? <span className="plus">+</span>
                </summary>
                <div className="a">
                  Yes. AgentsKit is built specifically for{" "}
                  <a href="https://claude.com/claude-code">Claude Code</a>, Anthropic&apos;s AI
                  coding tool for the terminal, desktop app, and IDE. The kits are agents, skills,
                  and slash commands that live in your project&apos;s <code>.claude/</code> folder,
                  which is a Claude Code format. It does not run inside Cursor, Copilot, or the
                  ChatGPT app. Any Claude Code plan works: Pro, Max, Team, or API billing.
                </div>
              </details>
              <details className="nx-q nx-fade">
                <summary data-fast-goal="faq_what_do_i_get">
                  <span className="qn">02</span> What exactly do I get?{" "}
                  <span className="plus">+</span>
                </summary>
                <div className="a">
                  Access to a private GitHub repo containing the kit(s) you bought: a{" "}
                  <code>.claude/</code> directory of agents, skills, and slash commands, CLAUDE.md
                  templates, the <code>agentskit</code> installer CLI, and full docs. You drop it
                  into any project with a one-line <code>npx github:getagentskit/…</code> command
                  that pulls straight from your private repo. The exact command is in your
                  repo&apos;s README.
                </div>
              </details>
              <details className="nx-q nx-fade">
                <summary data-fast-goal="faq_need_to_code">
                  <span className="qn">03</span> Do I need to know how to code?{" "}
                  <span className="plus">+</span>
                </summary>
                <div className="a">
                  You need <a href="https://claude.com/claude-code">Claude Code</a> and a project to
                  work in. The agents do the heavy lifting. You direct them in plain English.
                  Installation is a single command.
                </div>
              </details>
              <details className="nx-q nx-fade">
                <summary data-fast-goal="faq_framework_lock_in">
                  <span className="qn">04</span> Does it lock me into a framework?{" "}
                  <span className="plus">+</span>
                </summary>
                <div className="a">
                  No. Agents adapt to your stack (Next.js, Django, Rails, Go, Rust, anything) by
                  reading your CLAUDE.md. Zero forced architecture.
                </div>
              </details>
              <details className="nx-q nx-fade">
                <summary data-fast-goal="faq_how_updates_work">
                  <span className="qn">05</span> How do updates work?{" "}
                  <span className="plus">+</span>
                </summary>
                <div className="a">
                  Buy once, get every future update. Run <code>agentskit update</code> (or{" "}
                  <code>git pull</code>) to refresh. Your custom files and CLAUDE.md are never
                  touched.
                </div>
              </details>
              <details className="nx-q nx-fade">
                <summary data-fast-goal="faq_anthropic_affiliation">
                  <span className="qn">06</span> Is this affiliated with Anthropic?{" "}
                  <span className="plus">+</span>
                </summary>
                <div className="a">
                  No. AgentsKit is an independent, unofficial product and is not affiliated with,
                  endorsed by, or sponsored by Anthropic. &quot;Claude&quot; and &quot;Claude
                  Code&quot; are trademarks of Anthropic.
                </div>
              </details>
              <details className="nx-q nx-fade">
                <summary data-fast-goal="faq_refund_policy">
                  <span className="qn">07</span> Is there a money-back guarantee?{" "}
                  <span className="plus">+</span>
                </summary>
                <div className="a">
                  <p>Yes. 14 days, full refund, no questions asked.</p>
                  <p>
                    Put AgentsKit on a real feature. If it doesn&apos;t save you hours on that
                    first ship, email us within 14 days and we&apos;ll send the money back.
                  </p>
                  <p>
                    We can offer that because the kit isn&apos;t theory. Every agent, skill, and
                    command in it earned its place in real production work before it shipped to
                    you.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="nx-final">
        <div className="nx-wrap nx-fade">
          <h2 className="nx-h2">Stop being the bottleneck. Ship like a team.</h2>
          <p className="nx-lead">
            89 specialists for code and growth, installed into Claude Code with one command. One
            payment, yours for life.
          </p>
          <div className="nx-final-cta">
            <a
              className="nx-btn nx-btn-primary nx-btn-lg"
              href="#pricing"
              data-fast-goal="cta_get_claudethings"
              data-fast-goal-location="final_cta"
            >
              Get AgentsKit <span className="ar">↗</span>
            </a>
          </div>
          <span className="nx-micro">🔒 Secure checkout · Pay once, use forever</span>
          <div className="nx-final-dash" aria-hidden="true">
            {dashboard}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nx-footer">
        <div className="nx-wrap">
          <div className="nx-foot-top">
            <div>
              <a className="nx-logo" href="#top">
                AgentsKit
              </a>
              <p className="desc">Your AI engineering &amp; marketing team for Claude Code.</p>
              <div className="nx-foot-badges">
                {/* tinyshelf directory badge — must stay a dofollow link straight to
                    www.tinyshelf.co and live in the server-rendered HTML, or their
                    weekly re-check drops our listing's link to nofollow. */}
                <a
                  className="nx-foot-badge"
                  href="https://www.tinyshelf.co/?ref=agentskit.co"
                  title="Featured on tinyshelf"
                  target="_blank"
                  rel="noopener"
                >
                  <img
                    src="https://www.tinyshelf.co/badge/tinyshelf-badge-light-5ca4026a.svg"
                    alt="Featured on tinyshelf"
                    width={216}
                    height={64}
                  />
                </a>
                <a
                  className="nx-foot-badge"
                  href="https://founder.page/hii_mohit"
                  title="Find me on founder.page"
                  target="_blank"
                  rel="noopener"
                >
                  <img
                    src="https://founder.page/badge/hii_mohit.svg?style=solid"
                    alt="Find me on founder.page"
                    width={204}
                    height={38}
                  />
                </a>
              </div>
            </div>
            <div className="nx-foot-links">
              <div className="nx-foot-col">
                <h2>Product</h2>
                <a href="#whats-inside">What&apos;s inside</a>
                <a href="#kits">Kits</a>
                <a href="#pricing">Pricing</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="nx-foot-col">
                <h2>Free Tools</h2>
                <a href="/tools">All free tools</a>
                <a href="/claude-skill-md-validator">SKILL.md Validator</a>
                <a href="/claude-skill-for-website-security-audit">Website Security Audit</a>
              </div>
              <div className="nx-foot-col">
                <h2>Resources</h2>
                <a href="/prompts">Claude prompts</a>
                <a href="/blog">Blog</a>
                <a href="/use-cases">Use cases</a>
                <a href="/comparisons">Comparisons</a>
              </div>
              <div className="nx-foot-col">
                <h2>Legal</h2>
                <a href="/legal">Legal</a>
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
                <a href="/refund">Refunds</a>
                <a href="/disclaimer">Disclaimer</a>
              </div>
              <div className="nx-foot-col">
                <h2>More Products</h2>
                <a href="https://notchbuddy.com" target="_blank" rel="noopener">
                  NotchBuddy
                </a>
                <a href="https://trymacapps.com" target="_blank" rel="noopener">
                  TryMacApps
                </a>
              </div>
              <div className="nx-foot-col">
                <h2>Connect</h2>
                <a
                  href="mailto:epictools.io@gmail.com"
                  data-fast-goal="contact_email"
                  data-fast-goal-location="footer"
                >
                  epictools.io@gmail.com
                </a>
                <a href={SITE_URL}>agentskit.co</a>
                <a href="https://x.com/hii_mohit" target="_blank" rel="noopener noreferrer">
                  X (Twitter)
                </a>
              </div>
            </div>
          </div>
          <div className="nx-disclaimer">
            <b>Unofficial &amp; independent.</b> AgentsKit is not affiliated with, endorsed by, or
            sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
            &quot;Anthropic&quot; are trademarks of Anthropic. AgentsKit is a curated distribution;
            many bundled components are sourced from open-source projects under MIT/Apache-2.0
            licenses, with full attribution preserved in the product&apos;s CREDITS file.
            <br />
            <br />© {year} AgentsKit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
