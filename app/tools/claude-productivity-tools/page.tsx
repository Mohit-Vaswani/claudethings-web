import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";

const TITLE = "Claude Productivity Tools: The Features Most People Never Find";
const DESC =
  "A guided tour of Claude's productivity layer: Projects, Artifacts, connectors, skills, file analysis, and the workflow setups that turn a chat window into a working system — plus the free tools we build.";
const URL = "https://claudethings.com/tools/claude-productivity-tools";

export const metadata: Metadata = {
  title: `${TITLE} — ClaudeThings`,
  description: DESC,
  alternates: { canonical: "/tools/claude-productivity-tools" },
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "article",
    url: URL,
    images: [{ url: ogImage(TITLE), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [ogImage(TITLE)] },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: URL,
  author: { "@type": "Organization", name: "ClaudeThings" },
  publisher: { "@type": "Organization", name: "ClaudeThings", url: "https://claudethings.com" },
};

export default function Page() {
  return (
    <ArticlePage
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Productivity" },
      ]}
      eyebrow="Curated guide"
      title={TITLE}
      meta={["Updated July 2026", "For daily Claude users"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/prompts",
          title: "The Claude Prompt Library",
          desc: "50 free prompts to run through this setup.",
        },
        {
          href: "/use-cases",
          title: "Claude Use Cases by Role",
          desc: "Developers, data scientists, PMs, students — the honest maps.",
        },
        {
          href: "/tools/claude-coding-tools",
          title: "The Claude Coding Tools Stack",
          desc: "The developer-specific version of this page.",
        },
      ]}
    >
      <p className="intro">
        Most people use maybe 30% of Claude: they open a chat, type a question, copy the answer.
        The productivity gains everyone talks about live in the other 70% — the features that turn
        one-off conversations into systems that remember your context, produce real artifacts, and
        connect to where your work actually lives. Here&apos;s the tour, roughly in the order the
        upgrades pay off.
      </p>

      <h2>1. Projects: stop re-explaining yourself</h2>
      <p>
        A Project is a workspace with persistent context: upload your docs, define custom
        instructions, and every conversation inside it starts already knowing your company, your
        style guide, your codebase conventions. One Project per ongoing concern — your product,
        your course, your client — is the single biggest quality-of-life upgrade in the Claude
        apps. The pattern: the first ten minutes you spend loading a Project with context repay
        themselves in every conversation after.
      </p>

      <h2>2. Artifacts: outputs you can actually use</h2>
      <p>
        Ask for a document, a diagram, an interactive calculator, or a working mini-app, and
        Claude builds it as an artifact — a live, editable thing beside the chat rather than a
        wall of text to copy. Underrated uses: interactive mockups for stakeholder feedback,
        one-off internal tools (rota generators, calculators), and formatted documents that
        survive contact with a real audience.
      </p>

      <h2>3. File analysis: the drag-and-drop analyst</h2>
      <p>
        PDFs, spreadsheets, images, exports — drop them in and interrogate them. Claude&apos;s
        analysis tooling can run code over data files, which upgrades &quot;summarize this
        CSV&quot; to &quot;compute the actual cohort retention in this CSV.&quot; For the
        technique layer, our <a href="/prompts/claude-prompts-for-data-analysis">data analysis
        prompts</a> are built for exactly this.
      </p>

      <h2>4. Connectors: Claude where your work lives</h2>
      <p>
        Through MCP connectors, the Claude apps reach your other tools — Drive and calendars,
        Slack, Notion, project trackers — so &quot;summarize this week&apos;s activity in the
        project channel and draft Monday&apos;s update&quot; is one request, not an
        export-paste-prompt relay. Start with one connector you&apos;d use daily;{" "}
        <a href="/tools/claude-mcp-servers">our MCP guide</a> covers choosing safely.
      </p>

      <h2>5. Skills: teach it your way of working</h2>
      <p>
        Skills — folders of instructions Claude loads on demand — began in Claude Code but now
        power specialized behavior across Claude surfaces: document formats, review checklists,
        domain workflows. The practical effect: instead of writing a 400-word prompt every time,
        you invoke a capability that already knows the standard. Write your own (lint it with our
        free <a href="/claude-skill-md-validator">SKILL.md validator</a>) or install a library.
      </p>

      <h2>6. Claude Code — not just for engineers</h2>
      <p>
        The secret spreading through non-engineering teams: Claude Code is a general{" "}
        <em>file agent</em>. Marketers run content pipelines with it, analysts batch-process
        spreadsheets, founders automate reporting — anything that reads and writes files. If your
        work produces artifacts in folders, the{" "}
        <a href="/blog/getting-started-with-claude-code">terminal is worth the fear</a>.
      </p>

      <h2>7. The habit layer: what power users do differently</h2>
      <ul>
        <li>
          <strong>They maintain context once</strong> — Projects and CLAUDE.md files instead of
          re-pasting background every session.
        </li>
        <li>
          <strong>They save winning prompts</strong> — a personal library (or ours:{" "}
          <a href="/prompts">50 free prompts</a>) beats re-improvising.
        </li>
        <li>
          <strong>They chain instead of cram</strong> — research → outline → draft → edit as
          separate steps with review between.
        </li>
        <li>
          <strong>They verify at the boundary</strong> — anything leaving the building (numbers,
          claims, citations) gets checked. Speed without this habit is just faster mistakes.
        </li>
      </ul>

      <div className="callout">
        <p>
          <strong>The productized version:</strong> the ClaudeThings kits install 89 agents, 103
          skills, and 181 slash commands — engineering and marketing workflows that turn this
          whole page into a one-command setup. <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Do I need the paid plan for these features? <span className="plus">+</span>
          </summary>
          <div className="a">
            The free tier includes core chat with limits; Projects, higher usage, and the newest
            models generally sit in Pro and above. If Claude is part of your daily work, the paid
            tier pays for itself in the first saved hour — check anthropic.com for current plans.
          </div>
        </details>
        <details className="q">
          <summary>
            What&apos;s the difference between Projects and just long chats? <span className="plus">+</span>
          </summary>
          <div className="a">
            Long chats degrade — old context competes with new work. Projects separate the stable
            context (docs, instructions) from conversations, so every new chat starts fresh but
            informed. Rule of thumb: context you&apos;d paste twice belongs in a Project.
          </div>
        </details>
        <details className="q">
          <summary>
            Where should a non-technical person start? <span className="plus">+</span>
          </summary>
          <div className="a">
            One Project for your main responsibility, loaded with your key docs; one connector to
            where your work lives; and the prompt library for technique. That trio covers 80% of
            the gains with zero terminal required.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
