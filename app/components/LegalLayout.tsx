import type { ReactNode } from "react";

const CONTACT_EMAIL = "epictools.io@gmail.com";

/**
 * Shared shell for the static legal pages (Legal, Terms, Privacy, Refunds).
 * Mirrors the nav/footer of the landing page but links back to it via /#anchors,
 * since these live on their own routes.
 */
export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
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
            <a href="/#whats-inside">What&apos;s inside</a>
            <a href="/#kits">Kits</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#faq">FAQ</a>
            <a className="btn btn-primary nav-cta" href="/#pricing">
              Get Agentary
            </a>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="legal-main">
        <div className="wrap">
          <article className="legal-doc">
            <div className="eyebrow">
              <span className="pulse"></span> Legal
            </div>
            <h1>{title}</h1>
            <div className="updated">Last updated: {updated}</div>
            {children}
          </article>
        </div>
      </main>

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
