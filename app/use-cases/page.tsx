import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import SiteShell from "../components/SiteShell";
import { USE_CASES } from "./useCasesData";

export const metadata: Metadata = {
  title: "Claude Use Cases — Real Workflows by Role — Agentary",
  description:
    "How developers, data scientists, product managers, and students actually use Claude — honest assessments of where it excels, realistic workflows, and starter prompts for each role.",
  alternates: { canonical: "/use-cases" },
  openGraph: {
    title: "Claude Use Cases — Real Workflows by Role",
    description:
      "How developers, data scientists, PMs, and students actually use Claude — with workflows and starter prompts.",
    type: "website",
    url: "https://www.agentary.dev/use-cases",
    images: [{ url: ogImage("Claude Use Cases — Real Workflows by Role"), width: 1200, height: 630, alt: "Claude use cases by role." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Use Cases — Real Workflows by Role",
    description:
      "How developers, data scientists, PMs, and students actually use Claude — with workflows and starter prompts.",
    images: [ogImage("Claude Use Cases — Real Workflows by Role")],
  },
};

export default function UseCasesIndex() {
  return (
    <SiteShell>
      <header>
        <div className="wrap">
          <span className="eyebrow">
            <span className="pulse" /> Use cases
          </span>
          <h1>
            What Claude is <span className="grad">actually good for</span>
          </h1>
          <p className="sub">
            No demos, no hype — <b>honest maps of where Claude changes real work</b>, role by
            role: the workflows, the starter prompts, and the limits worth knowing about.
          </p>
        </div>
      </header>

      <section style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="tools-grid">
            {USE_CASES.map((u) => (
              <a className="tool-card" href={`/use-cases/${u.slug}`} key={u.slug}>
                <div className="tool-top">
                  <span className="tool-ic">{u.icon}</span>
                  <span className="tool-badge">Guide</span>
                </div>
                <h3>Claude for {u.label}</h3>
                <p className="tool-desc">{u.description}</p>
                <span className="tool-arrow">Read the guide →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <div className="tag">Go deeper</div>
          <h2>Every role, one upgrade path</h2>
          <p className="lead">
            Whatever your role, the pattern repeats: prompts get you started,{" "}
            <a href="/blog/getting-started-with-claude-code" className="accent">Claude Code</a>{" "}
            closes the loop, and the{" "}
            <a href="/#pricing" className="accent">Agentary kits</a> install the expertise —
            89 agents, 103 skills, 181 commands.
          </p>
          <p style={{ marginTop: 26 }}>
            <a href="/prompts" className="btn btn-ghost btn-lg">
              Start with free prompts
            </a>{" "}
            <a href="/#pricing" className="btn btn-primary btn-lg">
              Get the kits <span className="ar">→</span>
            </a>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
