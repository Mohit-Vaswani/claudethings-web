import type { Metadata } from "next";

const CONTACT_EMAIL = "epictools.io@gmail.com";

export const metadata: Metadata = {
  title: "Purchase complete · ClaudeThings",
  description: "Thanks for purchasing ClaudeThings. Here's what happens next.",
  // Post-checkout landing page — not for search engines.
  robots: { index: false, follow: false },
};

/**
 * Polar checkout success page. Each Checkout Link in the Polar Dashboard
 * redirects here with ?checkout_id={CHECKOUT_ID}; the DataFast script in
 * layout.tsx reads that param to attribute revenue to the visitor's
 * marketing channel. Keep the query string intact — no redirects here.
 */
export default function SuccessPage() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* NAV */}
      <nav id="nav" className="scrolled">
        <div className="nav-inner">
          <a className="logo" href="/">
            <span className="dia">◆</span> ClaudeThings
          </a>
          <div className="nav-links">
            <a href="/#whats-inside">What&apos;s inside</a>
            <a href="/#kits">Kits</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#faq">FAQ</a>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="legal-main">
        <div className="wrap">
          <article className="legal-doc">
            <div className="eyebrow">
              <span className="pulse"></span> Payment confirmed
            </div>
            <h1>You&apos;re in. 🎉</h1>
            <p className="intro">
              Thanks for purchasing ClaudeThings. Your payment went through and your access is on
              its way.
            </p>

            <h2>What happens next</h2>
            <ul>
              <li>
                <strong>Check your email.</strong> Polar has sent your receipt and your private-repo
                access invite to the address you used at checkout.
              </li>
              <li>
                <strong>Accept the GitHub invite.</strong> That unlocks the private repo with your
                agents, skills, and slash commands — plus lifetime updates.
              </li>
              <li>
                <strong>Install with one command.</strong> Setup instructions are in the repo
                README; you&apos;ll be running your new team in minutes.
              </li>
            </ul>

            <h2>Didn&apos;t get the email?</h2>
            <p>
              Give it a couple of minutes and check spam. Still nothing? Email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we&apos;ll sort it out
              fast.
            </p>

            <p>
              <a className="btn btn-primary" href="/">
                Back to ClaudeThings →
              </a>
            </p>
          </article>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="disclaimer">
            <b>Unofficial &amp; independent.</b> ClaudeThings is not affiliated with, endorsed by,
            or sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
            &quot;Anthropic&quot; are trademarks of Anthropic.
            <br />
            <br />© {year} ClaudeThings. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
