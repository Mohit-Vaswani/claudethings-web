import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import { SITE_URL } from "@/app/lib/site";
import { SiteFooter, SiteNav } from "@/app/components/HomeChrome";
import "../home.css";

/**
 * /demo — the "how it works" product video, moved off the homepage hero so the
 * landing page stays light. Shares the homepage nav, footer and styles.
 */

const TITLE = "AgentsKit Demo · Watch Claude Code Work as a Team";
const DESCRIPTION =
  "See AgentsKit install into a project with one command, then watch tech-lead plan the work and hand it to specialist agents inside Claude Code.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/demo" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "video.other",
    url: `${SITE_URL}/demo`,
    images: [{ url: ogImage("Watch AgentsKit work"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImage("Watch AgentsKit work")],
  },
};

export default function DemoPage() {
  return (
    <div className="nx-page">
      <SiteNav />

      <main className="nx-demo">
        <div className="nx-wrap">
          <div className="nx-label">
            <span className="ic" aria-hidden="true">
              ▶
            </span>
            Demo
          </div>
          <h1 className="nx-h1">
            Watch it work.
            <br />
            <em>Start to finish.</em>
          </h1>
          <p className="nx-sub">
            One command installs the team. Then a single prompt goes to tech-lead, gets split into
            tasks, and lands with the specialists who own them.
          </p>
        </div>

        <div className="nx-demo-video">
          <div className="nx-demo-frame">
            <video
              src="/video/agentskit-how-it-works.mp4"
              poster="/video/agentskit-how-it-works.jpg"
              width={1920}
              height={1080}
              controls
              playsInline
              preload="metadata"
              aria-label="AgentsKit demo: how it works"
            />
          </div>
        </div>

        <div className="nx-wrap">
          <div className="nx-demo-notes">
            <div className="nx-tile">
              <h3>Install</h3>
              <p>One npx command drops agents, skills and commands into .claude/.</p>
            </div>
            <div className="nx-tile">
              <h3>Prompt</h3>
              <p>Ask in plain English. tech-lead plans it and delegates.</p>
            </div>
            <div className="nx-tile">
              <h3>Ship</h3>
              <p>Specialists build and test, shipper gates the release.</p>
            </div>
          </div>
        </div>

        <section className="nx-final">
          <div className="nx-wrap">
            <h2 className="nx-h2">
              Seen enough? <em>Get the team.</em>
            </h2>
            <div className="nx-cta-row">
              <a
                className="nx-btn nx-btn-primary nx-btn-lg"
                href="/#pricing"
                data-fast-goal="cta_get_claudethings"
                data-fast-goal-location="demo"
              >
                Get AgentsKit
              </a>
              <a className="nx-btn nx-btn-soft nx-btn-lg" href="/">
                Back to home
              </a>
            </div>
            <span className="nx-micro">One-time payment · Lifetime updates · 14-day money-back guarantee</span>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
