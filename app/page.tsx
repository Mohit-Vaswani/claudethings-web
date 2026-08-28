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
  // India-only 50% offer. False everywhere else, and on the first paint.
  const indiaOffer = useGeoDiscount();
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

      {/* PROBLEM */}
      <section id="problem" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-sec-split nx-fade">
            <div>
              <div className="nx-label">The solo-builder tax</div>
              <h2 className="nx-h2">You&apos;re doing the job of an entire team, alone.</h2>
            </div>
            <div className="nx-sec-side">
              Claude Code is incredible. But by default it&apos;s one generalist taking orders from
              you, one prompt at a time, so the whole product lands on your shoulders.
            </div>
          </div>
          <div className="nx-prob-grid">
            <div className="nx-prob nx-fade">
              <h3>
                <span className="x">✕</span> You repeat yourself all day
              </h3>
              <p>
                Every session you re-explain your stack, your conventions, your voice. Claude
                forgets, you retype.
              </p>
            </div>
            <div className="nx-prob nx-fade">
              <h3>
                <span className="x">✕</span> One generalist, not specialists
              </h3>
              <p>
                One assistant guessing at backend, frontend, infra, security and copy. Jack of all
                trades, master of the average.
              </p>
            </div>
            <div className="nx-prob nx-fade">
              <h3>
                <span className="x">✕</span> Building isn&apos;t shipping
              </h3>
              <p>
                You can generate code all day, but positioning, launch copy, SEO and emails still
                pile up on you.
              </p>
            </div>
            <div className="nx-prob nx-fade">
              <h3>
                <span className="x">✕</span> Nobody&apos;s checking your work
              </h3>
              <p>
                No reviewer, no tester, no second pair of eyes. Bugs and security holes ship
                because no one caught them.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* HOW IT WORKS */}
      <section id="how" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-hiw">
            <div className="nx-hiw-left nx-fade">
              <div className="nx-label">How it works</div>
              <h2 className="nx-h2">One command. No setup. No copy-pasting.</h2>
              <p className="nx-lead">Live in under 2 minutes, from checkout to a working AI team.</p>
              <div style={{ marginTop: 28 }}>
                <a
                  className="nx-btn nx-btn-primary"
                  href="#pricing"
                  data-fast-goal="cta_get_claudethings"
                  data-fast-goal-location="how_it_works"
                >
                  Get AgentsKit <span className="ar">↗</span>
                </a>
              </div>
            </div>
            <div className="nx-steps">
              <div className="nx-step nx-fade">
                <div className="n">01</div>
                <div>
                  <h3>Install</h3>
                  <p>
                    Paste the <code>npx github:getagentskit/…</code> one-liner from your private
                    repo&apos;s README. Pick engineer, marketing, or both. No global install,
                    nothing to configure.
                  </p>
                </div>
              </div>
              <div className="nx-step nx-fade">
                <div className="n">02</div>
                <div>
                  <h3>Teach it your project once</h3>
                  <p>
                    Fill in the generated <code>CLAUDE.md</code>: stack, conventions, brand voice.
                    Every agent reads it first, so you never re-explain your project again.
                  </p>
                </div>
              </div>
              <div className="nx-step nx-fade">
                <div className="n">03</div>
                <div>
                  <h3>Delegate and ship</h3>
                  <p>
                    In Claude Code, just ask: <code>&quot;use tech-lead to build auth&quot;</code>{" "}
                    or <code>/blog-post our launch</code>. The right specialist takes it from there.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* BENEFITS */}
      <section className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-fade">
            <div className="nx-label">Benefits</div>
            <h2 className="nx-h2">Why builders keep it installed.</h2>
          </div>
          <div className="nx-feat-grid">
            <div className="nx-feat nx-fade">
              <div className="fi">⌥</div>
              <h3>Take only what you need</h3>
              <p>
                Just want the debugger? <code>agentskit add agent debugger</code>. Pull in one agent
                or all 89. Never all-or-nothing.
              </p>
            </div>
            <div className="nx-feat nx-fade">
              <div className="fi">▣</div>
              <h3>Can&apos;t break your project</h3>
              <p>
                Installs are non-destructive by design. Your <code>CLAUDE.md</code> and custom
                configs are never touched or overwritten.
              </p>
            </div>
            <div className="nx-feat nx-fade">
              <div className="fi">∞</div>
              <h3>Pay once, own it forever</h3>
              <p>
                One payment, no subscription. Run <code>agentskit update</code> any time to pull
                the newest agents. Free, for life.
              </p>
            </div>
            <div className="nx-feat nx-fade">
              <div className="fi">≈</div>
              <h3>Sounds like you, not a template</h3>
              <p>
                Agents learn your codebase and voice from CLAUDE.md, so the output ships as if you
                wrote it.
              </p>
            </div>
            <div className="nx-feat nx-fade">
              <div className="fi">⇄</div>
              <h3>Agents that team up</h3>
              <p>
                They chain, fan out in parallel, and delegate to each other. An orchestrator picks
                the right play so you don&apos;t have to.
              </p>
            </div>
            <div className="nx-feat nx-fade">
              <div className="fi">§</div>
              <h3>Clean and above-board</h3>
              <p>
                Curated from MIT/Apache projects with full attribution and license files. No murky
                IP, nothing to worry about.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* COMPARISON */}
      <section className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-center nx-fade">
            <div className="nx-label">Comparison</div>
            <h2 className="nx-h2">Why builders choose AgentsKit</h2>
          </div>
          <div className="nx-cmp nx-fade">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Other kits</th>
                  <th>AgentsKit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What you get</td>
                  <td>Agents or boilerplate</td>
                  <td>89 agents · 122 skills · 181 commands</td>
                </tr>
                <tr>
                  <td>
                    Engineering <em>and</em> marketing
                  </td>
                  <td>
                    <span className="no">✕</span>
                  </td>
                  <td>
                    <span className="yes">✓</span>both kits, one repo
                  </td>
                </tr>
                <tr>
                  <td>Installer</td>
                  <td>Copy/paste or bun-only CLI</td>
                  <td>
                    <span className="yes">✓</span>npx · Node 18+
                  </td>
                </tr>
                <tr>
                  <td>Cherry-pick one component</td>
                  <td>
                    <span className="no">✕</span>
                  </td>
                  <td>
                    <span className="yes">✓</span>add agent / skill / command
                  </td>
                </tr>
                <tr>
                  <td>Tech stack</td>
                  <td>Often locked</td>
                  <td>
                    <span className="yes">✓</span>any (adapts via CLAUDE.md)
                  </td>
                </tr>
                <tr>
                  <td>Updates over time</td>
                  <td>Sometimes</td>
                  <td>
                    <span className="yes">✓</span>lifetime, included
                  </td>
                </tr>
                <tr>
                  <td>Open-source attribution</td>
                  <td>Rarely</td>
                  <td>
                    <span className="yes">✓</span>full CREDITS + licenses
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="nx-cmp-foot">
              <p>
                <b>Questions before you buy?</b>
                We&apos;ll help you figure out if it fits your workflow.
              </p>
              <a
                className="nx-btn nx-btn-ghost"
                href="mailto:epictools.io@gmail.com"
                data-fast-goal="contact_email"
                data-fast-goal-location="comparison"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </section>

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

          {/* INDIA OFFER, rendered only for visitors geolocated to IN */}
          {indiaOffer && (
            <div className="nx-geo" role="note">
              <span className="flag" aria-hidden="true">
                🇮🇳
              </span>
              <div className="copy">
                <b>{GEO_DISCOUNT.percent}% off for India.</b> Purchasing-power pricing. Your code{" "}
                <code>{GEO_DISCOUNT.code}</code> is waiting in the discount box at checkout. Hit{" "}
                <b>Apply</b> to take {GEO_DISCOUNT.percent}% off.
              </div>
            </div>
          )}

          <div className="nx-proof-center nx-fade">
            <ProofPill />
          </div>

          {/* PRICE LADDER, bundle price rises as spots fill */}
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
                  <span className="was">${PLAN_BY_ID.engineer.was}</span>
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: Engineer product checkout link */}
                <a
                  className="nx-btn nx-btn-ghost"
                  href={withDiscount(PLAN_BY_ID.engineer.checkoutUrl, indiaOffer)}
                  data-polar-checkout=""
                  data-polar-checkout-theme="dark"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="engineer"
                  data-fast-goal-price={String(PLAN_BY_ID.engineer.price)}
                  data-fast-goal-geo-offer={indiaOffer ? GEO_DISCOUNT.code : undefined}
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
                  <span className="was">${PLAN_BY_ID.bundle.was}</span>
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: Bundle product checkout link */}
                <a
                  className="nx-btn nx-btn-primary"
                  href={withDiscount(PLAN_BY_ID.bundle.checkoutUrl, indiaOffer)}
                  data-polar-checkout=""
                  data-polar-checkout-theme="dark"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="bundle"
                  data-fast-goal-price={String(PLAN_BY_ID.bundle.price)}
                  data-fast-goal-geo-offer={indiaOffer ? GEO_DISCOUNT.code : undefined}
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
                  <span className="was">${PLAN_BY_ID.marketing.was}</span>
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: Marketing product checkout link */}
                <a
                  className="nx-btn nx-btn-ghost"
                  href={withDiscount(PLAN_BY_ID.marketing.checkoutUrl, indiaOffer)}
                  data-polar-checkout=""
                  data-polar-checkout-theme="dark"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="marketing"
                  data-fast-goal-price={String(PLAN_BY_ID.marketing.price)}
                  data-fast-goal-geo-offer={indiaOffer ? GEO_DISCOUNT.code : undefined}
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
