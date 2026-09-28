"use client";

import { useEffect } from "react";
import { SITE_URL } from "@/app/lib/site";

/**
 * Nav and footer shared by the homepage and /demo. Both render inside
 * `.nx-page`, so they pick up the scoped styles in app/home.css. Section links
 * are written as "/#id" so they work from /demo too; on the homepage the
 * browser treats them as plain same-page fragment jumps.
 */

/** The app-icon tile used as the brand mark (nav, hero ticker, footer). */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <img
      className="nx-mark"
      src="/web-app-manifest-192x192.png"
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
    />
  );
}

export function SiteNav() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="nav" className="nx-nav">
      <div className="nx-nav-inner">
        <a className="nx-logo" href="/">
          <BrandMark />
          AgentsKit
        </a>
        <div className="nx-nav-links">
          <a href="/#explore">Features</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQ</a>
          <a href="/demo">Demo</a>
          <a href="/tools">Free tools</a>
          <a
            className="nx-btn nx-btn-line"
            href="/#pricing"
            data-fast-goal="cta_get_claudethings"
            data-fast-goal-location="nav"
          >
            Get AgentsKit
          </a>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="nx-footer">
      <div className="nx-wrap">
        <div className="nx-foot-top">
          <div className="nx-foot-brand">
            <a className="nx-logo" href="/">
              <BrandMark />
              AgentsKit
            </a>
            <p className="desc">AI engineering &amp; marketing team for Claude Code</p>
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
              <a href="/#explore">Features</a>
              <a href="/#kits">Kits</a>
              <a href="/#pricing">Pricing</a>
              <a href="/demo">Demo</a>
              <a href="/#faq">FAQ</a>
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
  );
}
