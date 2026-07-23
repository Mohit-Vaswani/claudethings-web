import type { ReactNode } from "react";

const CONTACT_EMAIL = "epictools.io@gmail.com";

/**
 * Shared shell for the resource/content pages (/prompts, /blog, /use-cases,
 * /comparisons, /tools guides). Server-rendered, zero client JS: the nav is
 * pinned in its "scrolled" state like the legal pages. Footer carries the
 * Resources column so every content page cross-links the others.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <>
      {/* NAV */}
      <nav id="nav" className="scrolled">
        <div className="nav-inner">
          <a className="logo" href="/">
            Agentary
          </a>
          <div className="nav-links">
            <a href="/prompts">Prompts</a>
            <a href="/blog">Blog</a>
            <a href="/use-cases">Use cases</a>
            <a href="/tools">Free tools</a>
            <a className="btn btn-primary nav-cta" href="/#pricing">
              Get Agentary
            </a>
          </div>
        </div>
      </nav>

      {children}

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div>
              <a className="logo" href="/">
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
                <h5>Product</h5>
                <a href="/#whats-inside">What&apos;s inside</a>
                <a href="/#kits">Kits</a>
                <a href="/#pricing">Pricing</a>
                <a href="/#faq">FAQ</a>
              </div>
              <div className="foot-col">
                <h5>Resources</h5>
                <a href="/prompts">Claude prompts</a>
                <a href="/blog">Blog</a>
                <a href="/use-cases">Use cases</a>
                <a href="/comparisons">Comparisons</a>
                <a href="/tools">Free tools</a>
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
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                <a href="https://www.agentary.dev">agentary.dev</a>
              </div>
            </div>
          </div>
          <div className="disclaimer">
            <b>Unofficial &amp; independent.</b> Agentary is not affiliated with, endorsed by,
            or sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
            &quot;Anthropic&quot; are trademarks of Anthropic. Content on this site is for
            educational purposes — see our <a href="/disclaimer" style={{ color: "var(--bone-dim)" }}>disclaimer</a>.
            <br />
            <br />© {year} Agentary. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
