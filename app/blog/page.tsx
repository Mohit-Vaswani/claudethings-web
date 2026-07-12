import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";
import { POSTS } from "./blogData";

export const metadata: Metadata = {
  title: "Blog — Claude Code Guides, Agents & Prompting — ClaudeThings",
  description:
    "Practical guides for getting real work out of Claude: Claude Code walkthroughs, building AI agents, prompting techniques, and applied workflows. Written by builders, not content farms.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "ClaudeThings Blog — Claude Code Guides, Agents & Prompting",
    description:
      "Practical guides for getting real work out of Claude — Claude Code, agents, prompting technique, applied workflows.",
    type: "website",
    url: "https://claudethings.com/blog",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "The ClaudeThings blog." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaudeThings Blog — Claude Code Guides, Agents & Prompting",
    description:
      "Practical guides for getting real work out of Claude — Claude Code, agents, prompting technique, applied workflows.",
    images: ["/og.jpg"],
  },
};

export default function BlogIndex() {
  return (
    <SiteShell>
      <header>
        <div className="wrap">
          <span className="eyebrow">
            <span className="pulse" /> The blog
          </span>
          <h1>
            Guides for people who <span className="grad">build with Claude</span>
          </h1>
          <p className="sub">
            Long-form, practical, and specific: <b>Claude Code workflows, agent architecture, and
            prompting technique</b> — the write-ups we wished existed while building ClaudeThings.
          </p>
        </div>
      </header>

      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="tools-grid">
            {POSTS.map((p) => (
              <a className="tool-card" href={`/blog/${p.slug}`} key={p.slug}>
                <div className="tool-top">
                  <span className="tool-ic">{p.icon}</span>
                  <span className="tool-badge">{p.tag}</span>
                </div>
                <h3>{p.title}</h3>
                <p className="tool-desc">{p.description}</p>
                <span className="tool-arrow">
                  {p.readingTime} · Read →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <div className="tag">Skip ahead</div>
          <h2>Prefer copy-paste over theory?</h2>
          <p className="lead">
            The <a href="/prompts" className="accent">prompt library</a> has 50 field-tested Claude
            prompts across coding, writing, data, business, and marketing — each with the reasoning
            behind it.
          </p>
          <p style={{ marginTop: 26 }}>
            <a href="/prompts" className="btn btn-primary btn-lg">
              Browse the prompt library <span className="ar">→</span>
            </a>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
