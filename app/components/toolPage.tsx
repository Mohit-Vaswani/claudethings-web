"use client";

import { useEffect, type ReactNode } from "react";
import { TOOLS } from "@/app/tools/toolsData";

/**
 * Shared building blocks for the free-tool pages (/claude-skill-md-validator,
 * /claude-code-wrapped, /claude-md-grader, …). Each tool page composes these so
 * the nav, footer, kit upsell, and scroll effects stay identical site-wide and
 * a new tool only has to ship its own hero + tool UI + SEO sections.
 */

/* ------------------------------- effects hook ------------------------------- */

/** Nav "scrolled" state + .fade scroll-reveal (mirrors the home page). */
export function useToolPageFx() {
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
}

/* ------------------------------ inline renderer ------------------------------ */

/** Turn `code` spans in a message into <code> without dangerouslySetInnerHTML. */
export function renderInline(msg: string): ReactNode {
  const parts = msg.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ----------------------------------- nav ----------------------------------- */

export interface NavLink {
  href: string;
  label: string;
}

export function ToolNav({
  links,
  ctaHref,
  ctaLabel,
}: {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <nav id="nav">
      <div className="nav-inner">
        <a className="logo" href="https://agentskit.co">
          AgentsKit
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={ctaHref} className="btn btn-primary nav-cta">
            {ctaLabel}
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------- kits upsell ------------------------------- */

export function KitsUpsell({
  tag = "Go further",
  heading,
  lead,
}: {
  tag?: string;
  heading: string;
  lead: ReactNode;
}) {
  return (
    <section id="kits">
      <div className="wrap center">
        <div className="tag fade">{tag}</div>
        <h2 className="fade">{heading}</h2>
        <p className="lead fade">{lead}</p>
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
              <li><span className="ck">✓</span> Every skill formatted to spec</li>
              <li><span className="ck">✓</span> Lifetime updates</li>
            </ul>
            <a
              href="https://agentskit.co/#pricing"
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
              <li><span className="ck">✓</span> Landing-page &amp; funnel templates</li>
              <li><span className="ck">✓</span> Lifetime updates</li>
            </ul>
            <a
              href="https://agentskit.co/#pricing"
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "center", marginTop: 22 }}
            >
              Get the Marketing Kit
            </a>
          </div>
        </div>
        <p className="fade" style={{ marginTop: 26 }}>
          <a href="https://agentskit.co/#pricing" className="accent" style={{ fontWeight: 600 }}>
            Or grab all 89 agents, 103 skills &amp; 181 commands in the Complete Bundle →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- FAQ section ------------------------------- */

export function FaqSection({
  heading,
  items,
}: {
  heading: string;
  items: Array<[string, string]>;
}) {
  return (
    <section id="faq">
      <div className="wrap center">
        <div className="tag fade">FAQ</div>
        <h2 className="fade">{heading}</h2>
        <div className="faq" style={{ textAlign: "left" }}>
          {items.map(([q, a]) => (
            <details className="q fade" key={q}>
              <summary>
                {q}
                <span className="plus">+</span>
              </summary>
              <div className="a">{renderInline(a)}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- footer ---------------------------------- */

export function ToolFooter({ disclaimer }: { disclaimer: ReactNode }) {
  const year = new Date().getFullYear();
  const liveTools = TOOLS.filter((t) => t.status === "live").slice(0, 6);

  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <a className="logo" href="https://agentskit.co">
              AgentsKit
            </a>
            <p style={{ color: "var(--bone-faint)", fontSize: 14, marginTop: 12, maxWidth: "34ch" }}>
              Your AI engineering &amp; marketing team for Claude Code.
            </p>
          </div>
          <div className="foot-links">
            <div className="foot-col">
              <h5>Product</h5>
              <a href="https://agentskit.co/#whats-inside">What&apos;s inside</a>
              <a href="https://agentskit.co/#kits">Kits</a>
              <a href="https://agentskit.co/#pricing">Pricing</a>
              <a href="https://agentskit.co/#faq">FAQ</a>
            </div>
            <div className="foot-col">
              <h5>Free Tools</h5>
              <a href="/tools">All free tools</a>
              {liveTools.map((t) => (
                <a key={t.slug} href={t.slug}>
                  {t.name}
                </a>
              ))}
            </div>
            <div className="foot-col">
              <h5>Legal</h5>
              <a href="/legal">Legal</a>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/refund">Refunds</a>
            </div>
            <div className="foot-col">
              <h5>Connect</h5>
              <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a>
              <a href="https://agentskit.co">agentskit.co</a>
            </div>
          </div>
        </div>
        <div className="disclaimer">
          {disclaimer}
          <br />
          <br />
          <b>Unofficial &amp; independent.</b> AgentsKit is not affiliated with, endorsed by, or
          sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
          &quot;Anthropic&quot; are trademarks of Anthropic.
          <br />
          <br />© {year} AgentsKit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
