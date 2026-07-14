import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import SiteShell from "../components/SiteShell";
import { COLLECTIONS } from "./promptsData";

export const metadata: Metadata = {
  title: "Claude Prompts Library — 50 Copy-Paste Prompts That Work — ClaudeThings",
  description:
    "A free library of 50 field-tested Claude prompts for coding, writing, data analysis, business, and marketing. Every prompt explains why it works. Copy, paste, adapt.",
  alternates: { canonical: "/prompts" },
  openGraph: {
    title: "Claude Prompts Library — 50 Copy-Paste Prompts That Work",
    description:
      "Field-tested Claude prompts for coding, writing, data analysis, business, and marketing — with the reasoning behind each one.",
    type: "website",
    url: "https://claudethings.com/prompts",
    images: [{ url: ogImage("Claude Prompts Library — 50 Copy-Paste Prompts That Work"), width: 1200, height: 630, alt: "Claude prompts library by ClaudeThings." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Prompts Library — 50 Copy-Paste Prompts That Work",
    description:
      "Field-tested Claude prompts for coding, writing, data analysis, business, and marketing.",
    images: [ogImage("Claude Prompts Library — 50 Copy-Paste Prompts That Work")],
  },
};

export default function PromptsIndex() {
  const total = COLLECTIONS.reduce((n, c) => n + c.prompts.length, 0);

  return (
    <SiteShell>
      {/* HERO */}
      <header>
        <div className="wrap">
          <span className="eyebrow">
            <span className="pulse" /> Free prompt library
          </span>
          <h1>
            Claude prompts that <span className="grad">actually work</span>
          </h1>
          <p className="sub">
            {total} field-tested prompts across five disciplines — each with the{" "}
            <b>reasoning for why it works</b>, so you can adapt it instead of cargo-culting it.
            No signup. Copy and go.
          </p>
          <p className="hub-count">
            [ <b>{COLLECTIONS.length} collections</b> · <b>{total} prompts</b> · updated July 2026 ]
          </p>
        </div>
      </header>

      {/* COLLECTIONS GRID */}
      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="tools-grid">
            {COLLECTIONS.map((c) => (
              <a className="tool-card" href={`/prompts/${c.slug}`} key={c.slug}>
                <div className="tool-top">
                  <span className="tool-ic">{c.icon}</span>
                  <span className="tool-badge">{c.prompts.length} prompts</span>
                </div>
                <h3>{c.label}</h3>
                <p className="tool-tag">{c.title}</p>
                <p className="tool-desc">{c.description}</p>
                <span className="tool-arrow">Browse prompts →</span>
              </a>
            ))}
            <a className="tool-card ghost" href="/blog/10-prompting-techniques-for-claude">
              <div className="tool-top">
                <span className="tool-ic">🧠</span>
              </div>
              <h3>Learn the technique</h3>
              <p className="tool-desc">
                Prompts are fish; technique is fishing. Read{" "}
                <span className="accent">10 prompting techniques for Claude</span> to write your
                own.
              </p>
              <span className="tool-arrow">Read the guide →</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="wrap center">
          <div className="tag">Beyond prompts</div>
          <h2>Prompts are the manual way. Kits are the installed way.</h2>
          <p className="lead">
            The ClaudeThings kits package this kind of expertise as 89 agents, 103 skills, and 181
            slash commands that live inside Claude Code — so instead of pasting a code-review
            prompt, you type <code style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>/review</code>.
          </p>
          <p style={{ marginTop: 26 }}>
            <a href="/#pricing" className="btn btn-primary btn-lg">
              Explore the kits <span className="ar">→</span>
            </a>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
