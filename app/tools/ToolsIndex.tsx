"use client";

import { useEffect } from "react";
import { TOOLS } from "./toolsData";
import { TOOL_GUIDES } from "./guidesData";

/**
 * /tools — index of free ClaudeThings tools. Data-driven from toolsData.ts so
 * launching a new tool is a one-line addition. Reuses the global design system.
 */
export default function ToolsIndex() {
  const year = new Date().getFullYear();

  // nav scrolled state + scroll reveal (mirrors the other pages)
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

  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <div className="nav-inner">
          <a className="logo" href="https://claudethings.com">
            ClaudeThings
          </a>
          <div className="nav-links">
            <a href="https://claudethings.com/#whats-inside">What&apos;s inside</a>
            <a href="/tools">Tools</a>
            <a href="https://claudethings.com/#pricing">Pricing</a>
            <a href="https://claudethings.com/#pricing" className="btn btn-primary nav-cta">
              Get the kits
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free tools for Claude Code
          </span>
          <h1 className="reveal-h d2">
            Free <span className="grad">Claude Code</span> tools
          </h1>
          <p className="sub reveal-h d3">
            A growing collection of <b>free tools and skills</b> for people building with Claude
            Code — validators, auditors, and generators. No signup, no cost. Made by the team behind
            the ClaudeThings kits.
          </p>
        </div>
      </header>

      {/* TOOLS GRID */}
      <section id="tools" style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="tools-grid">
            {TOOLS.map((t) =>
              t.status === "live" ? (
                <a className="tool-card fade" href={t.slug} key={t.slug}>
                  <div className="tool-top">
                    <span className="tool-ic">{t.icon}</span>
                    {t.badge && <span className="tool-badge">{t.badge}</span>}
                  </div>
                  <h3>{t.name}</h3>
                  <p className="tool-tag">{t.tagline}</p>
                  <p className="tool-desc">{t.description}</p>
                  <span className="tool-arrow">Open tool →</span>
                </a>
              ) : (
                <div className="tool-card soon fade" key={t.slug}>
                  <div className="tool-top">
                    <span className="tool-ic">{t.icon}</span>
                    <span className="tool-badge soon">Soon</span>
                  </div>
                  <h3>{t.name}</h3>
                  <p className="tool-tag">{t.tagline}</p>
                  <p className="tool-desc">{t.description}</p>
                </div>
              )
            )}

            {/* extensibility teaser */}
            <div className="tool-card ghost fade">
              <div className="tool-top">
                <span className="tool-ic">✦</span>
              </div>
              <h3>More tools on the way</h3>
              <p className="tool-desc">
                We ship new free tools regularly. Have one you&apos;d love to see?{" "}
                <a href="mailto:epictools.io@gmail.com" className="accent">
                  Tell us
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED GUIDES */}
      <section id="guides">
        <div className="wrap">
          <div className="tag fade">Curated guides</div>
          <h2 className="fade">Know what to install before you install it</h2>
          <p className="lead fade">
            Editorial roundups of the Claude ecosystem — the tools, connectors, and setups that
            earn their place, and the ones to skip.
          </p>
          <div className="tools-grid" style={{ marginTop: 46 }}>
            {TOOL_GUIDES.map((g) => (
              <a className="tool-card fade" href={`/tools/${g.slug}`} key={g.slug}>
                <div className="tool-top">
                  <span className="tool-ic">{g.icon}</span>
                  <span className="tool-badge">Guide</span>
                </div>
                <h3>{g.name}</h3>
                <p className="tool-tag">{g.tagline}</p>
                <p className="tool-desc">{g.description}</p>
                <span className="tool-arrow">Read the guide →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PAID OFFER */}
      <section id="kits">
        <div className="wrap center">
          <div className="tag fade">Go further</div>
          <h2 className="fade">Loved the free tools? Get the full kits.</h2>
          <p className="lead fade">
            The tools above are free forever. The ClaudeThings kits give you a whole library —
            89 agents, 103 skills, and 181 slash commands you drop into any project with one
            command.
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
                <li><span className="ck">✓</span> 58 agents · 61 skills · 159 commands</li>
                <li><span className="ck">✓</span> Security, testing &amp; code-review skills</li>
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
                <li><span className="ck">✓</span> 31 agents · 42 skills · 32 commands</li>
                <li><span className="ck">✓</span> Content, SEO &amp; email-sequence skills</li>
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
                ClaudeThings
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
                <h5>Free Tools</h5>
                <a href="/tools">All free tools</a>
                {TOOLS.filter((t) => t.status === "live").map((t) => (
                  <a href={t.slug} key={t.slug}>
                    {t.name}
                  </a>
                ))}
              </div>
              <div className="foot-col">
                <h5>Resources</h5>
                <a href="/prompts">Claude prompts</a>
                <a href="/blog">Blog</a>
                <a href="/use-cases">Use cases</a>
                <a href="/comparisons">Comparisons</a>
              </div>
              <div className="foot-col">
                <h5>Legal</h5>
                <a href="/legal">Legal</a>
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
                <a href="/refund">Refunds</a>
                <a href="/disclaimer">Disclaimer</a>
              </div>
              <div className="foot-col">
                <h5>Connect</h5>
                <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a>
                <a href="https://claudethings.com">claudethings.com</a>
              </div>
            </div>
          </div>
          <div className="disclaimer">
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
