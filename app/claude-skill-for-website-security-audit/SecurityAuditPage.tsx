"use client";

import { useEffect } from "react";

/**
 * Landing page for the free Website Security Audit Claude skill.
 * Reuses the global design system in app/globals.css so it matches the main site.
 *
 * Free, no-gate download — the button links straight to the skill zip.
 */
const ZIP_URL = "/downloads/website-security-audit.zip";

export default function SecurityAuditPage() {
  const year = new Date().getFullYear();

  // nav scrolled state + scroll reveal (mirrors the home page)
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

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

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const sev = {
    crit: { color: "var(--coral)" },
    high: { color: "var(--ember)" },
    med: { color: "#ffd27a" },
    low: { color: "var(--teal)" },
  };

  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <div className="nav-inner">
          <a className="logo" href="https://claudethings.com">
            <span className="dia">◆</span> ClaudeThings
          </a>
          <div className="nav-links">
            <a href="https://claudethings.com/#whats-inside">What&apos;s inside</a>
            <a href="https://claudethings.com/#kits">Kits</a>
            <a href="https://claudethings.com/#pricing">Pricing</a>
            <a href="#download" className="btn btn-primary nav-cta">
              Get the free skill
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free Claude Skill · No cost
          </span>
          <h1 className="reveal-h d2">
            Scan your website for <span className="grad">security holes</span> in minutes
          </h1>
          <p className="sub reveal-h d3">
            A free Claude skill that audits <b>your own</b> website or codebase for the issues
            that actually get sites breached — then hands you a plain-English report with exact
            fixes. <b>No security expertise needed.</b>
          </p>
          <div className="cta-row reveal-h d4">
            <a href="#download" className="btn btn-primary btn-lg">
              ⬇ Download the free skill
            </a>
            <a href="#how" className="btn btn-ghost btn-lg">
              See how it works
            </a>
          </div>
          <p className="micro reveal-h d5">
            <b>2-minute</b> install · runs <b>100% local</b> · works in <b>Claude Code</b>
          </p>

          {/* terminal demo */}
          <div className="terminal reveal-h d5">
            <div className="term-bar">
              <span className="dot r" />
              <span className="dot y" />
              <span className="dot g" />
              <span className="term-title">claude — security audit</span>
            </div>
            <div className="term-body">
              <div>
                <span className="pr">you ›</span>{" "}
                <span className="cmd">Audit my website https://mysite.com for security issues</span>
              </div>
              <div className="dim" style={{ margin: "10px 0" }}>
                › Confirming ownership… ✓ Running passive checks…
              </div>
              <div style={sev.crit}>🔴 CRITICAL  /.env is publicly accessible → rotate all keys now</div>
              <div style={sev.crit}>
                🔴 CRITICAL  Stripe live key hardcoded in <span className="dim">checkout.js:42</span>
              </div>
              <div style={sev.high}>🟠 HIGH      No HTTPS redirect — http:// stays plain</div>
              <div style={sev.med}>🟡 MEDIUM    Missing Content-Security-Policy header</div>
              <div style={sev.low}>🔵 LOW       Server banner leaks &quot;nginx/1.18.0&quot;</div>
              <div className="dim" style={{ marginTop: 10 }}>
                › Top 3 fixes written. Report saved to security-audit-report.md ✓
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* WHAT IT CATCHES */}
      <section id="how">
        <div className="wrap center">
          <div className="tag fade">What it catches</div>
          <h2 className="fade">The 7 things small sites get wrong</h2>
          <p className="lead fade">
            Most breaches don&apos;t come from elite hackers — they come from boring, fixable
            mistakes. This skill checks for all of them.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["🔓", "Missing / broken HTTPS", "No SSL, expired certs, no HTTP→HTTPS redirect, outdated TLS, and missing HSTS."],
              ["📋", "Weak security headers", "Missing CSP, X-Frame-Options, nosniff and more — the easy wins that block XSS and clickjacking."],
              ["📂", "Exposed files", "Publicly reachable .env, .git, backups, and config files leaking your secrets."],
              ["🔑", "Hardcoded secrets", "API keys, tokens and passwords sitting in your code — and in your git history."],
              ["📦", "Vulnerable dependencies", "Known CVEs in your npm / pip / composer packages, mapped to severity."],
              ["💉", "Risky code patterns", "SQL injection, XSS, weak cookies, wide-open CORS, and debug mode left on in production."],
              ["🚪", "Open admin & access control", "Unprotected admin panels, default credentials, and publicly exposed cloud storage."],
            ].map(([ic, h, p]) => (
              <div className="card fade" key={h}>
                <div className="ic">{ic}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD + EMAIL CAPTURE */}
      <section id="download">
        <div className="wrap">
          <div className="final">
            <div className="tag t-teal" style={{ position: "relative" }}>
              Free download
            </div>
            <h2 style={{ position: "relative" }}>Download the skill — it&apos;s free</h2>
            <p className="lead" style={{ position: "relative", margin: "16px auto 0" }}>
              No signup, no email. Click below, unzip, and run your first audit in two minutes.
            </p>

            <div style={{ position: "relative", marginTop: 28, marginBottom: 10 }}>
              <a href={ZIP_URL} download className="btn btn-primary btn-lg">
                ⬇ Download the free skill (.zip)
              </a>
            </div>
            <p className="micro" style={{ position: "relative" }}>
              Free forever · runs 100% local · works in Claude Code
            </p>

            {/* 2-step install */}
            <div className="steps" style={{ position: "relative", textAlign: "left", maxWidth: 720, margin: "40px auto 0" }}>
              <div className="step">
                <div className="n">STEP 1</div>
                <h4>Unzip &amp; move the folder</h4>
                <p>Put the skill into your Claude skills directory:</p>
                <p style={{ marginTop: 10 }}>
                  <code>mv website-security-audit ~/.claude/skills/</code>
                </p>
              </div>
              <div className="step">
                <div className="n">STEP 2</div>
                <h4>Ask Claude to audit</h4>
                <p>Open Claude Code and just say:</p>
                <p style={{ marginTop: 10 }}>
                  <code>Audit my website https://mysite.com</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAID OFFER */}
      <section id="kits">
        <div className="wrap center">
          <div className="tag fade">Go further</div>
          <h2 className="fade">Loved the skill? Get the full kits.</h2>
          <p className="lead fade">
            The security audit is one skill. The kits give you dozens — everything you need to ship
            faster and market smarter with Claude.
          </p>
          <div className="kits" style={{ textAlign: "left" }}>
            <div className="kit eng fade">
              <div className="kit-head">
                <span className="kit-emoji">🛠️</span>
                <div>
                  <div className="role">Most popular</div>
                  <h3>Engineering Kit</h3>
                </div>
              </div>
              <p style={{ color: "var(--bone-dim)", fontSize: 15 }}>
                Battle-tested Claude skills &amp; workflows for builders.
              </p>
              <ul style={{ marginTop: 18 }}>
                <li><span className="ck">✓</span> Full security, testing &amp; code-review skills</li>
                <li><span className="ck">✓</span> CI/CD, refactor &amp; debugging workflows</li>
                <li><span className="ck">✓</span> Project scaffolds and prompt templates</li>
                <li><span className="ck">✓</span> Lifetime updates</li>
              </ul>
              <a
                href="https://claudethings.com/#pricing"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 22 }}
              >
                Get the Engineering Kit
              </a>
            </div>

            <div className="kit mkt fade">
              <div className="kit-head">
                <span className="kit-emoji">📣</span>
                <div>
                  <div className="role">For founders</div>
                  <h3>Marketing Kit</h3>
                </div>
              </div>
              <p style={{ color: "var(--bone-dim)", fontSize: 15 }}>
                Turn Claude into your growth team.
              </p>
              <ul style={{ marginTop: 18 }}>
                <li><span className="ck">✓</span> Content, SEO &amp; email-sequence skills</li>
                <li><span className="ck">✓</span> Reel &amp; hook scripts that convert</li>
                <li><span className="ck">✓</span> Landing-page &amp; funnel templates</li>
                <li><span className="ck">✓</span> Lifetime updates</li>
              </ul>
              <a
                href="https://claudethings.com/#pricing"
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center", marginTop: 22 }}
              >
                Get the Marketing Kit
              </a>
            </div>
          </div>
          <p className="fade" style={{ marginTop: 26 }}>
            <a href="https://claudethings.com/#pricing" className="accent" style={{ fontWeight: 600 }}>
              Or grab both in the Complete Bundle →
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div>
              <a className="logo" href="https://claudethings.com">
                <span className="dia">◆</span> ClaudeThings
              </a>
              <p style={{ color: "var(--bone-faint)", fontSize: 14, marginTop: 12, maxWidth: "34ch" }}>
                Your AI engineering &amp; marketing team for Claude Code.
              </p>
            </div>
            <div className="foot-links">
              <div className="foot-col">
                <h5>Product</h5>
                <a href="https://claudethings.com/#whats-inside">What&apos;s inside</a>
                <a href="https://claudethings.com/#kits">Kits</a>
                <a href="https://claudethings.com/#pricing">Pricing</a>
                <a href="https://claudethings.com/#faq">FAQ</a>
              </div>
              <div className="foot-col">
                <h5>Free Skills</h5>
                <a href="/claude-skill-for-website-security-audit">Website Security Audit</a>
                <a href="https://claudethings.com">More skills</a>
              </div>
              <div className="foot-col">
                <h5>Connect</h5>
                <a href="mailto:hello@claudethings.com">Email</a>
                <a href="https://claudethings.com">claudethings.com</a>
              </div>
            </div>
          </div>
          <div className="disclaimer">
            <b>This skill checks for common, high-impact security issues</b> and is intended only for
            sites you own or are authorized to test. It is not a full penetration test and does not
            guarantee your site is secure.
            <br />
            <br />
            <b>Unofficial &amp; independent.</b> ClaudeThings is not affiliated with, endorsed by, or
            sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
            &quot;Anthropic&quot; are trademarks of Anthropic.
            <br />
            <br />© {year} ClaudeThings. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
