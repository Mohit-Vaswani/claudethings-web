import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import SiteShell from "../components/SiteShell";
import { MARKETPLACE } from "./marketplaceData";
import { SITE_URL } from "@/app/lib/site";

const PATH = "/marketplace";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Free Marketplace for Claude Skills & Plugins (Open Source)";
const DESC =
  "A hand-picked, free marketplace of open-source Claude Code skills and plugins. Each one is reviewed in plain English, with what it does, who it's for, and the GitHub link.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "free claude skills",
    "claude code plugins",
    "free skills marketplace",
    "claude plugin marketplace",
    "open source claude skills",
    "agent skills directory",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    url: URL,
    images: [{ url: ogImage("Free Marketplace for Skills and Plugins"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [ogImage("Free Marketplace for Skills and Plugins")],
  },
};

const FAQ = [
  {
    q: "Are these skills and plugins really free?",
    a: "Yes. Everything listed here is open source on GitHub, mostly under the MIT license. Some of them call paid services if you choose to (a paid data source, a hosted version), but the skill or plugin itself costs nothing.",
  },
  {
    q: "Do they only work with Claude Code?",
    a: "Most are built for Claude Code first. Several also run in Codex, Cursor, opencode or Gemini CLI. Each page lists what it works with.",
  },
  {
    q: "How do you pick what gets listed?",
    a: "We read the repo, check that it's maintained, and only list things we'd actually point a friend to. We don't take payment for listings.",
  },
  {
    q: "Is it safe to install a skill from GitHub?",
    a: "A skill can run commands on your machine, so treat it like any other code. Read the SKILL.md and any install script first. Our guide to installing Claude skills from GitHub walks through what to check.",
  },
];

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Marketplace for Skills and Plugins",
    description: DESC,
    url: URL,
    isPartOf: { "@type": "WebSite", name: "AgentsKit", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: MARKETPLACE.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/marketplace/${m.slug}`,
        name: m.name,
        description: m.description,
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function MarketplaceIndex() {
  return (
    <SiteShell>
      {ld.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}

      <header>
        <div className="wrap">
          <span className="eyebrow">
            <span className="pulse" /> Marketplace
          </span>
          <h1>
            Free marketplace for <span className="grad">skills and plugins</span>
          </h1>
          <p className="sub">
            Open-source Claude Code skills and plugins we think are worth your time.{" "}
            <b>Every one is free, every one has a real write-up</b>, and every page links
            straight to the GitHub repo.
          </p>
        </div>
      </header>

      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="tools-grid">
            {MARKETPLACE.map((m) => (
              <a className="tool-card" href={`/marketplace/${m.slug}`} key={m.slug}>
                <div className="tool-top">
                  <span className="tool-ic">{m.icon}</span>
                  <span className="tool-badge">Free {m.kind}</span>
                </div>
                <h2>{m.name}</h2>
                <p className="tool-desc">
                  <b>{m.tagline}.</b> {m.description}
                </p>
                <span className="tool-arrow">Read the review →</span>
              </a>
            ))}
            <div className="tool-card ghost">
              <div className="tool-top">
                <span className="tool-ic">+</span>
              </div>
              <h2>More coming</h2>
              <p className="tool-desc">
                We add new skills and plugins as we find good ones. Built something people
                should know about? Email{" "}
                <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <div className="tag">New to skills?</div>
          <h2>What you're looking at</h2>
          <p className="lead" style={{ maxWidth: "none" }}>
            A skill is a folder of instructions that teaches your coding agent to do one job
            well. A plugin bundles skills, commands and agents so you can install them in one
            go. If the difference is fuzzy, our{" "}
            <a href="/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp" className="accent">
              skills vs subagents vs slash commands
            </a>{" "}
            explainer clears it up. For a wider list, see the{" "}
            <a href="/blog/best-claude-code-skills" className="accent">best Claude Code skills</a>{" "}
            and{" "}
            <a href="/blog/best-claude-code-plugins" className="accent">best Claude Code plugins</a>{" "}
            roundups, and our guide to{" "}
            <a href="/blog/claude-skills-marketplace" className="accent">
              finding and vetting skills
            </a>
            . Want to write your own? Run it through the free{" "}
            <a href="/claude-skill-md-validator" className="accent">SKILL.md validator</a>{" "}
            first.
          </p>

          <h2 style={{ marginTop: 48 }}>Questions</h2>
          {FAQ.map((f) => (
            <div key={f.q} style={{ marginTop: 22 }}>
              <h3 style={{ fontSize: "1.05rem", marginBottom: 6 }}>{f.q}</h3>
              <p className="lead" style={{ marginTop: 0, maxWidth: "none" }}>
                {f.q.startsWith("Is it safe") ? (
                  <>
                    A skill can run commands on your machine, so treat it like any other code.
                    Read the SKILL.md and any install script first. Our guide to{" "}
                    <a href="/blog/claude-skills-github" className="accent">
                      installing Claude skills from GitHub
                    </a>{" "}
                    walks through what to check.
                  </>
                ) : (
                  f.a
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="wrap center">
          <div className="tag">Go further</div>
          <h2>Want a whole team, not one skill?</h2>
          <p className="lead">
            The free picks above each do one thing. AgentsKit installs 89 agents, 122 skills
            and 181 commands for engineering and marketing in one command.
          </p>
          <p style={{ marginTop: 26 }}>
            <a href="/tools" className="btn btn-ghost btn-lg">
              More free tools
            </a>{" "}
            <a href="/#pricing" className="btn btn-primary btn-lg">
              See AgentsKit
            </a>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
