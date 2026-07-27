"use client";

import { useEffect } from "react";
import { GEO_DISCOUNT, useGeoDiscount, withDiscount } from "./lib/geoDiscount";
import { SITE_URL } from "@/app/lib/site";

/**
 * Agentary landing page (Next.js App Router).
 * Styling lives in app/globals.css. Buy buttons use Polar's embed (loaded in layout.tsx).
 * Replace the REPLACE_* checkout links below with your real Polar product links.
 */
export default function Home() {
  // India-only 30% offer. False everywhere else, and on the first paint.
  const indiaOffer = useGeoDiscount();

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
    document.querySelectorAll(".fade").forEach((el) => io.observe(el));
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

    // terminal typing
    const cmd = "npx github:agentary-dev/kit init --kit both";
    const typedEl = document.getElementById("typed");
    const curEl = document.getElementById("cur");
    const outEl = document.getElementById("term-out");
    const term = document.getElementById("term");
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    if (typedEl && outEl) {
      typedEl.textContent = "";
      outEl.innerHTML = "";
      if (curEl) curEl.style.display = "inline-block";
    }
    const lines: [string, string][] = [
      ["ok", "✔ Installing into your-project"],
      ["ok", "✔ engineer kit → 58 agents, 61 skills, 159 commands"],
      ["ok", "✔ marketing kit → 31 agents, 42 skills, 22 commands (10 shared, already in)"],
      ["ok", "✔ wrote CLAUDE.md — fill it in so agents learn your project"],
      ["dim", "› Done. Open Claude Code — your AI team is ready."],
    ];
    let i = 0;
    const type = () => {
      if (!typedEl) return;
      if (i <= cmd.length) {
        typedEl.textContent = cmd.slice(0, i);
        i++;
        timeouts.push(setTimeout(type, 55));
        return;
      }
      if (curEl) curEl.style.display = "none";
      let j = 0;
      const out = () => {
        if (j >= lines.length || !outEl) return;
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
    let startIO: IntersectionObserver | null = null;
    if (term) {
      startIO = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            type();
            startIO?.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      startIO.observe(term);
    }
    cleanups.push(() => {
      startIO?.disconnect();
      timeouts.forEach(clearTimeout);
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const year = new Date().getFullYear();

  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <div className="nav-inner">
          <a className="logo" href="#top">
            Agentary
          </a>
          <div className="nav-links">
            <a href="#whats-inside">What&apos;s inside</a>
            <a href="#kits">Kits</a>
            <a href="/tools">Free tools</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a
              className="btn btn-primary nav-cta hover:text-white"
              href="#pricing"
              data-fast-goal="cta_get_claudethings"
              data-fast-goal-location="nav"
            >
              Get Agentary <span className="ar">↗</span>
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="top">
        <div className="wrap">
          <div className="eyebrow reveal-h d1">
            <span className="ticks"></span> The Claude Code upgrade for solo builders · Any stack · One command{" "}
            <span className="ticks g"></span>
          </div>
          <h1 className="reveal-h d2">
            Give Claude Code a <span className="grad">full engineering &amp; marketing team</span>
          </h1>
          <p className="sub reveal-h d3">
            Out of the box, Claude Code is one brilliant generalist — and you&apos;re the bottleneck.
            Agentary drops in <b>89 specialist agents</b>, <b>103 ready-to-use skills</b>, and{" "}
            <b>181 slash commands</b> with a single command, so one person can plan, build, test,
            ship <em>and</em> market a real product — without hiring, without context-switching.
          </p>
          <div className="cta-row reveal-h d4">
            <a
              className="btn btn-primary btn-lg"
              href="#pricing"
              data-fast-goal="cta_get_claudethings"
              data-fast-goal-location="hero"
            >
              Get Agentary <span className="ar">↗</span>
            </a>
            <a className="btn btn-ghost btn-lg" href="#whats-inside">
              See what&apos;s inside <span className="ar">↗</span>
            </a>
          </div>
          <div className="micro reveal-h d4">
            Requires Claude Code · One-time payment · Lifetime updates · Instant access
          </div>

          {/* vista panel: terminal + proof card */}
          <div className="hero-panel reveal-h d5">
            <div className="vista hero-vista">
              <div className="terminal">
                <div className="term-bar">
                  <span className="dot r"></span>
                  <span className="dot y"></span>
                  <span className="dot g"></span>
                  <span className="term-title">your-project — bash</span>
                </div>
                <div className="term-body" id="term">
                  <div>
                    <span className="pr">$</span> <span className="cmd" id="typed"></span>
                    <span className="cursor" id="cur"></span>
                  </div>
                  <div id="term-out"></div>
                </div>
              </div>
            </div>
            <aside className="hero-side">
              <div className="side-label">Inside the kit</div>
              <ul>
                <li>
                  <b>89</b> agents
                </li>
                <li>
                  <b>103</b> skills
                </li>
                <li>
                  <b>181</b> slash commands
                </li>
                <li>
                  <b>2</b> kits ( engineer + marketing )
                </li>
                <li>
                  <b>npx</b> · no install needed
                </li>
                <li>
                  Runs inside <b>Claude Code</b>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </header>

      {/* PROBLEM */}
      <section id="problem">
        <div className="wrap">
          <div className="center fade">
            <div className="tag">The solo-builder tax</div>
            <h2>You&apos;re doing the job of an entire team — alone.</h2>
            <p className="lead">
              Claude Code is incredible. But by default it&apos;s one generalist taking orders from
              you, one prompt at a time. So the whole product lands on your shoulders:
            </p>
          </div>
          <div className="prob-grid">
            <div className="prob fade">
              <h3>
                <span className="x">✕</span> You repeat yourself all day
              </h3>
              <p>Every session you re-explain your stack, your conventions, your voice. Claude forgets — you retype.</p>
            </div>
            <div className="prob fade">
              <h3>
                <span className="x">✕</span> One generalist, not specialists
              </h3>
              <p>One assistant guessing at backend, frontend, infra, security and copy. Jack of all trades, master of the average.</p>
            </div>
            <div className="prob fade">
              <h3>
                <span className="x">✕</span> Building isn&apos;t shipping
              </h3>
              <p>You can generate code all day — but positioning, launch copy, SEO and emails still pile up on you.</p>
            </div>
            <div className="prob fade">
              <h3>
                <span className="x">✕</span> Nobody&apos;s checking your work
              </h3>
              <p>No reviewer, no tester, no second pair of eyes. Bugs and security holes ship because no one caught them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION — showcase rows */}
      <section id="whats-inside">
        <div className="wrap">
          <div className="center fade">
            <div className="tag">A team, not a tool</div>
            <h2>Stop prompting a generalist. Start delegating to specialists.</h2>
            <p className="lead">
              Everything installs into your project&apos;s{" "}
              <code style={{ fontFamily: "var(--font-mono)", fontSize: ".85em" }}>.claude/</code>{" "}
              folder, so Claude Code picks it up automatically. Each agent reads a{" "}
              <code style={{ fontFamily: "var(--font-mono)", fontSize: ".85em" }}>CLAUDE.md</code>{" "}
              you fill in <em>once</em>, then works in your stack, your conventions and your voice —
              and gets sharper every time Claude does. No new tool to learn. It&apos;s the Claude
              Code you already use, with a team behind it.
            </p>
          </div>
          <div className="sol-grid">
            <div className="show fade">
              <div className="show-text">
                <div className="ic">01</div>
                <h3>Drops into the project you already have</h3>
                <p>
                  Next.js, Django, Rails, Go, Rust — no forced framework, no rewrite. Agents learn
                  your actual codebase and match your patterns, instead of dumping someone
                  else&apos;s architecture on top of yours.
                </p>
              </div>
              <div className="show-vista vista">
                <div className="ui-card">
                  <div className="u-label">Your stack</div>
                  <div className="chip-row">
                    <span className="chip hot">Next.js</span>
                    <span className="chip">Django</span>
                    <span className="chip">Rails</span>
                    <span className="chip">Go</span>
                    <span className="chip">Rust</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="show fade">
              <div className="show-text">
                <div className="ic">02</div>
                <h3>Gets better while you sleep</h3>
                <p>
                  A template is frozen the day you buy it. Agentary isn&apos;t. When Anthropic ships
                  a smarter Claude, your whole team levels up automatically — and every update we
                  add is yours free, forever.
                </p>
              </div>
              <div className="show-vista vista v2">
                <div className="ui-card">
                  <div className="u-label">Lifetime updates</div>
                  <div className="ui-line">$ agentary update</div>
                  <div className="ui-line">
                    <span className="ck">✓</span> up to date — no upgrade fees
                  </div>
                </div>
              </div>
            </div>
            <div className="show fade">
              <div className="show-text">
                <div className="ic">03</div>
                <h3>
                  From first commit <em>to</em> launch day
                </h3>
                <p>
                  Two teams in one. Engineers who build and ship the feature, marketers who write
                  the launch, the emails and the SEO. Most kits stop at the code — yours takes the
                  product all the way to customers.
                </p>
              </div>
              <div className="show-vista vista v3">
                <div className="ui-card">
                  <div className="u-label">Two kits</div>
                  <div className="ui-line">🛠 Engineer — 58 agents · 61 skills · 159 commands</div>
                  <div className="ui-line">📣 Marketing — 31 agents · 42 skills · 32 commands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KITS */}
      <section id="kits">
        <div className="wrap">
          <div className="center fade">
            <div className="tag">Two kits · take one or both</div>
            <h2>A full software team. A full growth team.</h2>
            <p className="lead">
              Both are native Claude Code kits: agents you call by name, skills Claude loads on its
              own exactly when they&apos;re needed, and slash commands you fire straight from the
              prompt. Buy the one you need today — add the other whenever you&apos;re ready.
            </p>
          </div>
          <div className="kits">
            {/* ENGINEER */}
            <div className="kit eng fade">
              <div className="kit-head">
                <span className="kit-emoji">🛠</span>
                <div>
                  <h3>Engineer Kit</h3>
                  <div className="role">the software team</div>
                </div>
              </div>
              <div className="kit-stats">
                <div className="s">
                  <b>58</b>
                  <span>agents</span>
                </div>
                <div className="s">
                  <b>61</b>
                  <span>skills</span>
                </div>
                <div className="s">
                  <b>159</b>
                  <span>commands</span>
                </div>
              </div>
              <ul>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    <b style={{ color: "var(--bone)" }}>tech-lead</b> plans &amp; delegates;{" "}
                    <b style={{ color: "var(--bone)" }}>shipper</b> gates every release.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    Build across the stack: <code>backend-architect</code>, <code>react-specialist</code>,{" "}
                    <code>typescript-pro</code>, <code>python-pro</code>, <code>golang-pro</code>,{" "}
                    <code>rust-pro</code>.
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
                    61 skills — Next.js, Tailwind, Drizzle, Docker, Stripe, MCP, TDD, Playwright… plus{" "}
                    <code>/api-scaffold</code>, <code>/test-coverage</code>, <code>/deploy-checklist</code>.
                  </span>
                </li>
              </ul>
            </div>
            {/* MARKETING */}
            <div className="kit mkt fade">
              <div className="kit-head">
                <span className="kit-emoji">📣</span>
                <div>
                  <h3>Marketing Kit</h3>
                  <div className="role">the growth team</div>
                </div>
              </div>
              <div className="kit-stats">
                <div className="s">
                  <b>31</b>
                  <span>agents</span>
                </div>
                <div className="s">
                  <b>42</b>
                  <span>skills</span>
                </div>
                <div className="s">
                  <b>32</b>
                  <span>commands</span>
                </div>
              </div>
              <ul>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    <b style={{ color: "var(--bone)" }}>growth-strategist</b> finds your funnel&apos;s
                    constraint; <b style={{ color: "var(--bone)" }}>brand-voice</b> keeps copy
                    on-brand &amp; legally clean.
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
                    <code>/email-sequence</code>, <code>/landing-page</code>, <code>/launch-plan</code>.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>
                    42 skills — SEO audits, programmatic SEO, full CRO set, pricing, paid ads,
                    marketing psychology, analytics.
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span>
                  <span>From positioning to launch day, the same context as your code.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section>
        <div className="wrap">
          <div className="numbers" style={{ marginTop: 0 }}>
            <div className="num fade">
              <b data-count="89">89</b>
              <span>specialized agents</span>
            </div>
            <div className="num fade">
              <b data-count="103">103</b>
              <span>pre-built skills</span>
            </div>
            <div className="num fade">
              <b data-count="181">181</b>
              <span>slash commands</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="wrap">
          <div className="hiw">
            <div className="hiw-left fade">
              <div className="tag">Live in under 2 minutes</div>
              <h2>One command. No setup. No copy-pasting.</h2>
              <div style={{ marginTop: 28 }}>
                <a
                  className="btn btn-primary"
                  href="#pricing"
                  data-fast-goal="cta_get_claudethings"
                  data-fast-goal-location="how_it_works"
                >
                  Get Agentary <span className="ar">↗</span>
                </a>
              </div>
            </div>
            <div className="steps">
              <div className="step fade">
                <div className="n">01</div>
                <h3>Install</h3>
                <p>
                  Paste the <code>npx github:agentary-dev/…</code> one-liner from your private
                  repo&apos;s README. Pick engineer, marketing, or both. No global install, nothing
                  to configure.
                </p>
              </div>
              <div className="step fade">
                <div className="n">02</div>
                <h3>Teach it your project once</h3>
                <p>
                  Fill in the generated <code>CLAUDE.md</code> — stack, conventions, brand voice.
                  Every agent reads it first, so you never re-explain your project again.
                </p>
              </div>
              <div className="step fade">
                <div className="n">03</div>
                <h3>Delegate and ship</h3>
                <p>
                  In Claude Code, just ask: <code>&quot;use tech-lead to build auth&quot;</code> or{" "}
                  <code>/blog-post our launch</code>. The right specialist takes it from there.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section>
        <div className="wrap">
          <div className="center fade">
            <div className="tag">Built different</div>
            <h2>Why builders keep it installed.</h2>
          </div>
          <div className="feat-grid">
            <div className="feat fade">
              <div className="fi">🧩</div>
              <h3>Take only what you need</h3>
              <p>
                Just want the debugger?{" "}
                <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                  agentary add agent debugger
                </code>
                . Pull in one agent or all 89 — never all-or-nothing.
              </p>
            </div>
            <div className="feat fade">
              <div className="fi">🛡️</div>
              <h3>Can&apos;t break your project</h3>
              <p>
                Installs are non-destructive by design. Your{" "}
                <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>CLAUDE.md</code>{" "}
                and custom configs are never touched or overwritten.
              </p>
            </div>
            <div className="feat fade">
              <div className="fi">🔄</div>
              <h3>Pay once, own it forever</h3>
              <p>
                One payment, no subscription. Run{" "}
                <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                  agentary update
                </code>{" "}
                any time to pull the newest agents — free, for life.
              </p>
            </div>
            <div className="feat fade">
              <div className="fi">🧠</div>
              <h3>Sounds like you, not a template</h3>
              <p>Agents learn your codebase and voice from CLAUDE.md, so the output ships as if you wrote it.</p>
            </div>
            <div className="feat fade">
              <div className="fi">🤝</div>
              <h3>Agents that team up</h3>
              <p>They chain, fan out in parallel, and delegate to each other — an orchestrator picks the right play so you don&apos;t have to.</p>
            </div>
            <div className="feat fade">
              <div className="fi">⚖️</div>
              <h3>Clean and above-board</h3>
              <p>Curated from MIT/Apache projects with full attribution and license files — no murky IP, nothing you have to worry about.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section>
        <div className="wrap">
          <div className="center fade">
            <div className="tag">The honest comparison</div>
            <h2>Not a template. Not another single-purpose CLI.</h2>
          </div>
          <div className="cmp fade">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Boilerplate</th>
                  <th>Other AI kits</th>
                  <th>Agentary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What you get</td>
                  <td className="no">Dead code</td>
                  <td>Agents + skills</td>
                  <td className="us">89 agents · 103 skills · 181 commands</td>
                </tr>
                <tr>
                  <td>
                    Engineering <em>and</em> marketing
                  </td>
                  <td className="no">✕</td>
                  <td className="no">Sold separately</td>
                  <td className="us">
                    <span className="yes">✓</span> both kits, one repo
                  </td>
                </tr>
                <tr>
                  <td>Installer</td>
                  <td className="no">Copy/paste</td>
                  <td>bun-only CLI</td>
                  <td className="us">
                    <span className="yes">✓</span> npx · no install · Node 18+
                  </td>
                </tr>
                <tr>
                  <td>Cherry-pick one component</td>
                  <td className="no">✕</td>
                  <td className="no">✕</td>
                  <td className="us">
                    <span className="yes">✓</span> add agent/skill/command
                  </td>
                </tr>
                <tr>
                  <td>Tech stack</td>
                  <td className="no">Locked</td>
                  <td>Any</td>
                  <td className="us">
                    <span className="yes">✓</span> any — adapts via CLAUDE.md
                  </td>
                </tr>
                <tr>
                  <td>Updates over time</td>
                  <td className="no">Never</td>
                  <td>Sometimes</td>
                  <td className="us">
                    <span className="yes">✓</span> lifetime, included
                  </td>
                </tr>
                <tr>
                  <td>Open-source attribution</td>
                  <td className="no">—</td>
                  <td className="no">—</td>
                  <td className="us">
                    <span className="yes">✓</span> full CREDITS + licenses
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="wrap">
          <div className="center fade">
            <div className="tag">Simple, one-time pricing</div>
            <h2>Less than an hour of a freelancer. Yours for good.</h2>
            <p className="lead">
              One payment, lifetime access, and every future update included. Delivered instantly
              as private-repo access the moment you check out — no subscription, no seats. Works
              with any Claude Code plan: Pro, Max, Team, or API.
            </p>
          </div>

          {/* INDIA OFFER — rendered only for visitors geolocated to IN */}
          {indiaOffer && (
            <div className="geo-offer" role="note">
              <span className="geo-flag" aria-hidden="true">
                🇮🇳
              </span>
              <div className="geo-copy">
                <b>{GEO_DISCOUNT.percent}% off for India.</b> Purchasing-power pricing — your code{" "}
                <code>{GEO_DISCOUNT.code}</code> is waiting in the discount box at checkout. Hit{" "}
                <b>Apply</b> to take {GEO_DISCOUNT.percent}% off.
              </div>
            </div>
          )}

          {/* PRICE LADDER — bundle price rises as spots fill */}
          <div className="ladder fade" aria-label="Bundle pricing steps">
            <div className="ladder-track" aria-hidden="true" />
            <div className="ladder-step">
              <span className="node" />
              <div className="step-price">$89</div>
              <div className="step-note">
                <b>1</b> spots left
              </div>
            </div>
            <div className="ladder-step is-next">
              <span className="node" />
              <div className="step-price">$129</div>
              <div className="step-note">next 50 users</div>
            </div>
            <div className="ladder-step is-next">
              <span className="node" />
              <div className="step-price">$199</div>
              <div className="step-note">next 50 users</div>
            </div>
          </div>

          <div className="price-grid">
            {/* ENGINEER */}
            <div className="plan fade">
              <div className="plan-head">
                <div>
                  <h3>Engineer Kit</h3>
                  <div className="who">the software team</div>
                </div>
              </div>
              <div className="plan-buy">
                <div className="amt">
                  <span className="cur">$</span>
                  <span className="big">49</span>
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: replace href with your Engineer product checkout link */}
                <a
                  className="btn btn-ghost"
                  href={withDiscount(
                    "https://buy.polar.sh/polar_cl_Er908aZqr0UbRXHvU6aN6ZAHkSK3JHGOpjSxc1fh4fa",
                    indiaOffer
                  )}
                  data-polar-checkout=""
                  data-polar-checkout-theme="light"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="engineer"
                  data-fast-goal-price="49"
                  data-fast-goal-geo-offer={indiaOffer ? GEO_DISCOUNT.code : undefined}
                >
                  Get Engineer Kit <span className="ar">↗</span>
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
            <div className="plan feat-plan fade">
              <div className="plan-head">
                <div>
                  <h3>Complete Bundle</h3>
                  <div className="who">engineer + marketing</div>
                </div>
                <div className="pill">Launch Price</div>
              </div>
              <div className="plan-buy">
                <div className="amt">
                  <span className="cur">$</span>
                  <span className="big">89</span>
                  <span className="was">$129</span>
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: replace href with your Bundle product checkout link */}
                <a
                  className="btn btn-primary"
                  href={withDiscount(
                    "https://buy.polar.sh/polar_cl_2ud2OuwNAiIs8g45iC9MIjT9WJo1vyxSSrkNM2GKHpC",
                    indiaOffer
                  )}
                  data-polar-checkout=""
                  data-polar-checkout-theme="light"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="bundle"
                  data-fast-goal-price="89"
                  data-fast-goal-geo-offer={indiaOffer ? GEO_DISCOUNT.code : undefined}
                >
                  Get the Bundle <span className="ar">↗</span>
                </a>
              </div>
              <ul>
                <li>
                  <span className="ck">✓</span>{" "}
                  <span>
                    <b style={{ color: "var(--bone)" }}>Everything</b> in both kits
                  </span>
                </li>
                <li>
                  <span className="ck">✓</span> 89 agents · 103 skills · 181 commands
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
            <div className="plan fade">
              <div className="plan-head">
                <div>
                  <h3>Marketing Kit</h3>
                  <div className="who">the growth team</div>
                </div>
              </div>
              <div className="plan-buy">
                <div className="amt">
                  <span className="cur">$</span>
                  <span className="big">49</span>
                </div>
                <div className="once">one-time · lifetime updates</div>
                {/* POLAR: replace href with your Marketing product checkout link */}
                <a
                  className="btn btn-ghost"
                  href={withDiscount(
                    "https://buy.polar.sh/polar_cl_vOplSsz5PWStSTwZZREndYhyvd2JL8fMaOv1c1wt3pL",
                    indiaOffer
                  )}
                  data-polar-checkout=""
                  data-polar-checkout-theme="light"
                  data-fast-goal="initiate_checkout"
                  data-fast-goal-plan="marketing"
                  data-fast-goal-price="49"
                  data-fast-goal-geo-offer={indiaOffer ? GEO_DISCOUNT.code : undefined}
                >
                  Get Marketing Kit <span className="ar">↗</span>
                </a>
              </div>
              <ul>
                <li>
                  <span className="ck">✓</span> 31 marketing agents
                </li>
                <li>
                  <span className="ck">✓</span> 42 pre-built skills
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
          <div className="plan-foot">
            Secure checkout via Polar · instant private-repo access after purchase
          </div>
          <p
            style={{
              color: "var(--ember)",
              textAlign: "center",
              marginTop: "14px",
              fontSize: "14px",
            }}
          >
            This is the launch price, prices will increase soon.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="wrap">
          <div className="faq-split">
            <div className="faq-side fade">
              <div className="tag">Questions</div>
              <h2>Everything you need before you buy.</h2>
              <div className="faq-contact">
                <div className="fc-ic">✉</div>
                <p>More questions?</p>
                <span>Reach out anytime</span>
                <a
                  className="btn btn-primary"
                  href="mailto:epictools.io@gmail.com"
                  data-fast-goal="contact_email"
                  data-fast-goal-location="faq"
                >
                  Email us <span className="ar">↗</span>
                </a>
              </div>
            </div>
            <div className="faq">
              <details className="q fade">
                <summary data-fast-goal="faq_need_claude_code">
                  Do I need Claude Code? Does it work with Cursor or ChatGPT?{" "}
                  <span className="plus">+</span>
                </summary>
                <div className="a">
                  Yes — Agentary is built specifically for{" "}
                  <a href="https://claude.com/claude-code" style={{ color: "var(--ember)" }}>
                    Claude Code
                  </a>
                  , Anthropic&apos;s AI coding tool for the terminal, desktop app, and IDE. The kits
                  are agents, skills, and slash commands that live in your project&apos;s{" "}
                  <code>.claude/</code> folder, which is a Claude Code format. It does not run inside
                  Cursor, Copilot, or the ChatGPT app. Any Claude Code plan works — Pro, Max, Team,
                  or API billing.
                </div>
              </details>
              <details className="q fade">
                <summary data-fast-goal="faq_what_do_i_get">
                  What exactly do I get? <span className="plus">+</span>
                </summary>
                <div className="a">
                  Access to a private GitHub repo containing the kit(s) you bought: a{" "}
                  <code>.claude/</code> directory of agents, skills, and slash commands, CLAUDE.md
                  templates, the <code>agentary</code> installer CLI, and full docs. You drop it
                  into any project with a one-line <code>npx github:agentary-dev/…</code> command
                  that pulls straight from your private repo — the exact command is in your
                  repo&apos;s README.
                </div>
              </details>
              <details className="q fade">
                <summary data-fast-goal="faq_need_to_code">
                  Do I need to know how to code? <span className="plus">+</span>
                </summary>
                <div className="a">
                  You need{" "}
                  <a href="https://claude.com/claude-code" style={{ color: "var(--ember)" }}>
                    Claude Code
                  </a>{" "}
                  and a project to work in. The agents do the heavy lifting — you direct them in
                  plain English. Installation is a single command.
                </div>
              </details>
              <details className="q fade">
                <summary data-fast-goal="faq_framework_lock_in">
                  Does it lock me into a framework? <span className="plus">+</span>
                </summary>
                <div className="a">
                  No. Agents adapt to your stack — Next.js, Django, Rails, Go, Rust, anything — by
                  reading your CLAUDE.md. Zero forced architecture.
                </div>
              </details>
              <details className="q fade">
                <summary data-fast-goal="faq_how_updates_work">
                  How do updates work? <span className="plus">+</span>
                </summary>
                <div className="a">
                  Buy once, get every future update. Run <code>agentary update</code> (or{" "}
                  <code>git pull</code>) to refresh. Your custom files and CLAUDE.md are never
                  touched.
                </div>
              </details>
              <details className="q fade">
                <summary data-fast-goal="faq_anthropic_affiliation">
                  Is this affiliated with Anthropic? <span className="plus">+</span>
                </summary>
                <div className="a">
                  No. Agentary is an independent, unofficial product and is not affiliated
                  with, endorsed by, or sponsored by Anthropic. &quot;Claude&quot; and &quot;Claude
                  Code&quot; are trademarks of Anthropic.
                </div>
              </details>
              <details className="q fade">
                <summary data-fast-goal="faq_refund_policy">
                  What&apos;s the refund policy? <span className="plus">+</span>
                </summary>
                <div className="a">
                  Agentary is a digital product delivered instantly and in full at checkout,
                  so all sales are final and purchases are non-refundable. Have questions before
                  buying? Email us and we&apos;ll help you decide.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-sec">
        <div className="final fade">
          <h2>Stop being the bottleneck. Ship like a team.</h2>
          <p className="lead" style={{ margin: "0 auto" }}>
            89 specialists for code and growth, installed into Claude Code with one command. One
            payment, yours for life.
          </p>
          <div className="cta-row" style={{ marginTop: 30 }}>
            <a
              className="btn btn-primary btn-lg"
              href="#pricing"
              data-fast-goal="cta_get_claudethings"
              data-fast-goal-location="final_cta"
            >
              Get Agentary <span className="ar">↗</span>
            </a>
          </div>
          <div className="guarantee">🔒 Secure checkout · Pay once, use forever</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div>
              <a className="logo" href="#top">
                Agentary
              </a>
              <p
                style={{
                  color: "var(--bone-faint)",
                  fontSize: 14,
                  marginTop: 12,
                  maxWidth: "34ch",
                }}
              >
                Your AI engineering &amp; marketing team for Claude Code.
              </p>
            </div>
            <div className="foot-links">
              <div className="foot-col">
                <h2>Product</h2>
                <a href="#whats-inside">What&apos;s inside</a>
                <a href="#kits">Kits</a>
                <a href="#pricing">Pricing</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="foot-col">
                <h2>Free Tools</h2>
                <a href="/tools">All free tools</a>
                <a href="/claude-skill-md-validator">SKILL.md Validator</a>
                <a href="/claude-skill-for-website-security-audit">Website Security Audit</a>
              </div>
              <div className="foot-col">
                <h2>Resources</h2>
                <a href="/prompts">Claude prompts</a>
                <a href="/blog">Blog</a>
                <a href="/use-cases">Use cases</a>
                <a href="/comparisons">Comparisons</a>
              </div>
              <div className="foot-col">
                <h2>Legal</h2>
                <a href="/legal">Legal</a>
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
                <a href="/refund">Refunds</a>
                <a href="/disclaimer">Disclaimer</a>
              </div>
              <div className="foot-col">
                <h2>Connect</h2>
                <a
                  href="mailto:epictools.io@gmail.com"
                  data-fast-goal="contact_email"
                  data-fast-goal-location="footer"
                >
                  epictools.io@gmail.com
                </a>
                <a href={SITE_URL}>agentary.dev</a>
                <a href="https://x.com/hii_mohit" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
              </div>
            </div>
          </div>
          <div className="disclaimer">
            <b>Unofficial &amp; independent.</b> Agentary is not affiliated with, endorsed by, or
            sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
            &quot;Anthropic&quot; are trademarks of Anthropic. Agentary is a curated
            distribution; many bundled components are sourced from open-source projects under
            MIT/Apache-2.0 licenses, with full attribution preserved in the product&apos;s CREDITS
            file.
            <br />
            <br />© {year} Agentary. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
