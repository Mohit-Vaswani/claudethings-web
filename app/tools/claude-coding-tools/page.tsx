import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";

const TITLE = "The Claude Coding Tools Stack: What to Install in 2026";
const DESC =
  "A curated guide to coding with Claude: Claude Code, IDE extensions, AI editors, GitHub integration, MCP servers for development, and the skills layer — what each piece does and what to install first.";
const URL = "https://www.agentary.dev/tools/claude-coding-tools";

export const metadata: Metadata = {
  title: `${TITLE} — Agentary`,
  description: DESC,
  alternates: { canonical: "/tools/claude-coding-tools" },
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
  author: { "@type": "Organization", name: "Agentary" },
  publisher: { "@type": "Organization", name: "Agentary", url: "https://www.agentary.dev" },
};

export default function Page() {
  return (
    <ArticlePage
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Coding tools" },
      ]}
      eyebrow="Curated guide"
      title={TITLE}
      meta={["Updated July 2026", "The stack, layer by layer"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "The full walkthrough for layer one of this stack.",
        },
        {
          href: "/tools/claude-mcp-servers",
          title: "The Best MCP Servers for Claude",
          desc: "Layer three, expanded: the connectors worth installing.",
        },
        {
          href: "/prompts/claude-prompts-for-coding",
          title: "10 Claude Prompts for Coding",
          desc: "The technique layer — free and copy-paste.",
        },
      ]}
    >
      <p className="intro">
        &quot;Coding with Claude&quot; in 2026 isn&apos;t one tool — it&apos;s a stack with four
        layers: the agent, the editor surface, the connectors, and the expertise layer on top.
        Most developers install layer one, skim layer two, and never discover that layers three
        and four are where the compounding happens. Here&apos;s the whole map.
      </p>

      <h2>Layer 1: The agent — Claude Code</h2>
      <p>
        The foundation. Claude Code is Anthropic&apos;s agentic coding tool: it reads your repo,
        edits files, runs commands and tests, and iterates until the task is done — under a
        permission system you control. It runs in the terminal, inside VS Code and JetBrains
        IDEs, on the web, and headlessly in CI.
      </p>
      <ul>
        <li>
          <strong>Install:</strong> <code>npm install -g @anthropic-ai/claude-code</code>, then{" "}
          <code>claude</code> in any project.
        </li>
        <li>
          <strong>Best for:</strong> everything with a definition of done — features, bugs,
          refactors, migrations, code review, test coverage.
        </li>
        <li>
          <strong>First move:</strong> run <code>/init</code> to generate a CLAUDE.md. Our{" "}
          <a href="/blog/getting-started-with-claude-code">getting-started guide</a> covers the
          rest.
        </li>
      </ul>

      <h2>Layer 2: The editor surfaces</h2>
      <h3>IDE extensions (VS Code, JetBrains)</h3>
      <p>
        Claude Code&apos;s IDE integrations put the agent next to your editor: inline diff review,
        file context awareness, and the same sessions you&apos;d have in the terminal. If you live
        in an IDE, start here rather than the raw terminal.
      </p>
      <h3>AI-native editors (Cursor and friends)</h3>
      <p>
        Editors like Cursor blend completion with an agent and let you choose Claude as the model.
        A reasonable choice if you want one app — but note the division of labor: editor agents
        are strongest at editor-scoped work, while Claude Code&apos;s loop (run, verify, iterate)
        and extensibility go deeper for repo-scale tasks.
      </p>
      <h3>GitHub Copilot with Claude models</h3>
      <p>
        Copilot can run Claude models as its backend — Claude-quality completions inside the tool
        your company may already license. For how completion and delegation actually divide the
        work, see <a href="/comparisons/claude-vs-copilot">Claude vs Copilot</a>.
      </p>
      <h3>Claude on the web and GitHub app</h3>
      <p>
        Claude Code&apos;s web/cloud sessions handle work when you&apos;re away from your machine,
        and the GitHub integration reviews PRs and responds to issues — useful as the team-wide
        surface that doesn&apos;t require every member to change tools.
      </p>

      <h2>Layer 3: The connectors — MCP servers</h2>
      <p>
        The Model Context Protocol gives Claude tools beyond your filesystem: query the database,
        drive a browser for end-to-end verification, read Sentry errors, search your issue
        tracker. For development work, the highest-value connectors are browser automation
        (Playwright-based servers), database access (Postgres et al.), and your error tracker.
        Full breakdown with setup notes: <a href="/tools/claude-mcp-servers">our MCP server guide</a>.
      </p>

      <h2>Layer 4: The expertise — skills and commands</h2>
      <p>
        The layer most developers never install. Claude Code is extensible with{" "}
        <strong>skills</strong> (folders that teach it repeatable capabilities) and{" "}
        <strong>slash commands</strong> (reusable prompts invoked by name). This is how a generic
        agent becomes <em>your</em> agent — one that reviews code against your standards, writes
        tests your way, and audits security like a specialist.
      </p>
      <ul>
        <li>
          <strong>Free, from us:</strong> the{" "}
          <a href="/claude-skill-md-validator">SKILL.md validator</a> (lint the skills you write)
          and the{" "}
          <a href="/claude-skill-for-website-security-audit">website security audit skill</a>.
        </li>
        <li>
          <strong>The full library:</strong> the Agentary Engineering Kit — 58 agents, 61
          skills, and 159 commands covering review, testing, security, refactoring, and shipping.{" "}
          <a href="/#pricing">One command to install</a>.
        </li>
      </ul>

      <h2>What to install first: the minimal path</h2>
      <ol>
        <li>Claude Code (terminal or IDE extension) + a CLAUDE.md in your main repo.</li>
        <li>One MCP server you&apos;ll actually use — browser automation or your database.</li>
        <li>
          One skills library — write your own starting from our validator, or install a kit.
        </li>
        <li>
          Stop. Add more only when a real task demands it; tool-collecting is procrastination
          with better branding.
        </li>
      </ol>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Do I need an API key or a subscription? <span className="plus">+</span>
          </summary>
          <div className="a">
            Either works for Claude Code: Claude Pro/Max subscriptions include it with usage
            limits, or pay per token with an API key. Daily users generally do better on a
            subscription; check anthropic.com for current terms.
          </div>
        </details>
        <details className="q">
          <summary>
            Terminal or IDE extension? <span className="plus">+</span>
          </summary>
          <div className="a">
            Same agent, different ergonomics. IDE extensions add inline diff review; the terminal
            is leaner and scripts better. Most people settle where they already live — there&apos;s
            no wrong answer, and sessions are compatible.
          </div>
        </details>
        <details className="q">
          <summary>
            Are third-party &quot;Claude tools&quot; safe to install? <span className="plus">+</span>
          </summary>
          <div className="a">
            Treat skills, MCP servers, and commands like any dependency: they run with real
            permissions on your machine. Prefer sources you can read (open code), review what a
            skill actually does, and be stingy with credentials handed to MCP servers.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
