import type { ReactNode } from "react";
import { SITE_URL } from "@/app/lib/site";

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
            AgentsKit
          </a>
          <div className="nav-links">
            <a href="/prompts">Prompts</a>
            <a href="/blog">Blog</a>
            <a href="/use-cases">Use cases</a>
            <a href="/tools">Free tools</a>
            <a className="btn btn-primary nav-cta" href="/#pricing">
              Get AgentsKit
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
                AgentsKit
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 14,
                  marginTop: 18,
                }}
              >
                {/* tinyshelf directory badge — see the note in app/page.tsx: the link
                    must stay dofollow and point at www.tinyshelf.co itself. */}
                <a
                  href="https://www.tinyshelf.co/?ref=agentskit.co"
                  title="Featured on tinyshelf"
                  target="_blank"
                  rel="noopener"
                  style={{ display: "inline-block" }}
                >
                  <img
                    src="https://www.tinyshelf.co/badge/tinyshelf-badge-dark-f4d1216a.svg"
                    alt="Featured on tinyshelf"
                    width={216}
                    height={64}
                  />
                </a>
                <a
                  href="https://founder.page/hii_mohit"
                  title="Find me on founder.page"
                  target="_blank"
                  rel="noopener"
                  style={{ display: "inline-block" }}
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
            <div className="foot-links">
              <div className="foot-col">
                <h2>Product</h2>
                <a href="/#whats-inside">What&apos;s inside</a>
                <a href="/#kits">Kits</a>
                <a href="/#pricing">Pricing</a>
                <a href="/#faq">FAQ</a>
              </div>
              <div className="foot-col">
                <h2>Resources</h2>
                <a href="/prompts">Claude prompts</a>
                <a href="/blog">Blog</a>
                <a href="/use-cases">Use cases</a>
                <a href="/comparisons">Comparisons</a>
                <a href="/tools">Free tools</a>
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
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                <a href={SITE_URL}>agentskit.co</a>
                <a href="https://x.com/hii_mohit" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
              </div>
            </div>
          </div>
          <div className="disclaimer">
            <b>Unofficial &amp; independent.</b> AgentsKit is not affiliated with, endorsed by,
            or sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
            &quot;Anthropic&quot; are trademarks of Anthropic. Content on this site is for
            educational purposes, see our <a href="/disclaimer" style={{ color: "var(--bone-dim)" }}>disclaimer</a>.
            <br />
            <br />© {year} AgentsKit. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
