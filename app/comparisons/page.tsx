import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import SiteShell from "../components/SiteShell";
import { COMPARISONS } from "./comparisonsData";

export const metadata: Metadata = {
  title: "AI Comparisons — Claude vs ChatGPT, Copilot & More — ClaudeThings",
  description:
    "Honest, hype-free comparisons for choosing AI tools: Claude vs ChatGPT, Claude Sonnet vs Opus, Claude Code vs GitHub Copilot — written by people who use all of them daily.",
  alternates: { canonical: "/comparisons" },
  openGraph: {
    title: "AI Comparisons — Claude vs ChatGPT, Copilot & More",
    description:
      "Honest, hype-free comparisons: Claude vs ChatGPT, Sonnet vs Opus, Claude Code vs GitHub Copilot.",
    type: "website",
    url: "https://claudethings.com/comparisons",
    images: [{ url: ogImage("AI Comparisons — Claude vs ChatGPT, Copilot & More"), width: 1200, height: 630, alt: "AI tool comparisons." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Comparisons — Claude vs ChatGPT, Copilot & More",
    description:
      "Honest, hype-free comparisons: Claude vs ChatGPT, Sonnet vs Opus, Claude Code vs GitHub Copilot.",
    images: [ogImage("AI Comparisons — Claude vs ChatGPT, Copilot & More")],
  },
};

export default function ComparisonsIndex() {
  return (
    <SiteShell>
      <header>
        <div className="wrap">
          <span className="eyebrow">
            <span className="pulse" /> Comparisons
          </span>
          <h1>
            Honest answers to <span className="grad">&quot;which one?&quot;</span>
          </h1>
          <p className="sub">
            We use these tools daily and sell products for one of them — so each comparison states
            its bias up front, then <b>argues from workloads, not fandom</b>.
          </p>
        </div>
      </header>

      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="tools-grid">
            {COMPARISONS.map((c) => (
              <a className="tool-card" href={`/comparisons/${c.slug}`} key={c.slug}>
                <div className="tool-top">
                  <span className="tool-ic">{c.icon}</span>
                  <span className="tool-badge">{c.vs}</span>
                </div>
                <h3>{c.title}</h3>
                <p className="tool-desc">{c.description}</p>
                <span className="tool-arrow">Read the comparison →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <div className="tag">Already chose Claude?</div>
          <h2>Then make it earn its keep</h2>
          <p className="lead">
            Start with the <a href="/prompts" className="accent">free prompt library</a>, graduate
            to <a href="/blog/getting-started-with-claude-code" className="accent">Claude Code</a>,
            and install the <a href="/#pricing" className="accent">ClaudeThings kits</a> when
            you&apos;re ready to move faster than prompts allow.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
