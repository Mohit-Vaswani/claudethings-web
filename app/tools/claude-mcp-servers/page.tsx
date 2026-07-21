import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";

const TITLE = "The Best MCP Servers for Claude: A Curated Guide";
const DESC =
  "What MCP actually is, the server categories that earn a permanent spot in your setup — GitHub, databases, browser automation, search, project tools — and how to install them without wrecking your security posture.";
const URL = "https://agentskit.co/tools/claude-mcp-servers";

export const metadata: Metadata = {
  title: `${TITLE} — AgentsKit`,
  description: DESC,
  alternates: { canonical: "/tools/claude-mcp-servers" },
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
  author: { "@type": "Organization", name: "AgentsKit" },
  publisher: { "@type": "Organization", name: "AgentsKit", url: "https://agentskit.co" },
};

export default function Page() {
  return (
    <ArticlePage
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "MCP servers" },
      ]}
      eyebrow="Curated guide"
      title={TITLE}
      meta={["Updated July 2026", "Categories over hype"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/how-to-build-ai-agents-with-claude",
          title: "How to Build AI Agents with Claude",
          desc: "Where MCP fits in the agent architecture.",
        },
        {
          href: "/tools/claude-coding-tools",
          title: "The Claude Coding Tools Stack",
          desc: "MCP is layer three — here's the whole map.",
        },
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "The host you'll be plugging these servers into.",
        },
      ]}
    >
      <p className="intro">
        The Model Context Protocol (MCP) is the USB standard of the Claude ecosystem: an open
        protocol that lets any tool expose capabilities — query this database, drive this browser,
        search these docs — to any AI client that speaks it. Claude Code, the Claude apps, and
        most AI-native editors all do. Anthropic open-sourced it; the ecosystem now spans
        thousands of servers.
      </p>
      <p className="intro">
        Which creates the actual problem: thousands of servers, most of them abandoned weekend
        projects. This guide organizes by <em>category of capability</em> — install one good
        server per category you need, and skip the rest. Server names churn; the categories are
        stable.
      </p>

      <h2>How installation works</h2>
      <p>In Claude Code, adding a server is one command:</p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">terminal</span>
        </div>
        <pre className="prompt-body">{`# example: add a server (local stdio process)
claude mcp add <name> -- <command to run the server>

# example: add a remote server
claude mcp add --transport http <name> <url>

# see what's installed
claude mcp list`}</pre>
      </div>
      <p>
        In the Claude desktop and web apps, servers are added as &quot;connectors&quot; from
        settings — same protocol, friendlier packaging.
      </p>

      <h2>The categories that earn their keep</h2>

      <h3>1. Version control: GitHub / GitLab</h3>
      <p>
        The official GitHub MCP server gives Claude real access to issues, PRs, reviews, and CI
        status — so &quot;look at the failing checks on my PR and fix them&quot; becomes one
        request instead of five copy-pastes. If your work lives in GitHub, this is the first
        install.
      </p>

      <h3>2. Browser automation: Playwright-based servers</h3>
      <p>
        A browser server lets Claude open pages, click, fill forms, and read the DOM — which means
        it can <em>verify its own frontend work</em> end-to-end instead of declaring victory from
        the code. Microsoft&apos;s Playwright MCP server is the reference choice. For web
        developers this is arguably the highest-value connector on the page.
      </p>

      <h3>3. Databases: Postgres and friends</h3>
      <p>
        Database servers let Claude inspect schemas and run queries — real ones, against your dev
        or read-replica instance. Debugging &quot;why is this query slow&quot; or &quot;what does
        this data actually look like&quot; stops being a copy-paste relay.{" "}
        <strong>Safety rule:</strong> point it at development or read-only credentials, never
        production write access.
      </p>

      <h3>4. Documentation and search</h3>
      <p>
        Two flavors: web search servers (current information from the live web) and documentation
        servers like Context7 that feed Claude version-accurate library docs — which noticeably
        cuts &quot;that API doesn&apos;t exist anymore&quot; errors in generated code.
      </p>

      <h3>5. Errors and observability: Sentry et al.</h3>
      <p>
        Connect your error tracker and &quot;investigate this Sentry issue&quot; becomes a
        complete workflow: Claude reads the stack trace and breadcrumbs, finds the offending code,
        and proposes the fix with the context of how often and for whom it breaks.
      </p>

      <h3>6. Project and knowledge tools: Linear, Jira, Notion, Slack</h3>
      <p>
        Ticket context without tab-switching: &quot;implement LIN-482&quot; pulls the issue,
        acceptance criteria, and discussion. Valuable for teams whose specs actually live in these
        tools; skippable for solo work.
      </p>

      <h3>7. Design: Figma</h3>
      <p>
        Design-context servers let Claude read component structure and styles from Figma files —
        the difference between &quot;build something like this screenshot&quot; and &quot;build
        this design, with its actual spacing and tokens.&quot;
      </p>

      <h2>The security section (read this one)</h2>
      <p>
        An MCP server is code running with real credentials. Three rules keep the power without
        the incident report:
      </p>
      <ul>
        <li>
          <strong>Least privilege:</strong> read-only tokens where possible, dev databases over
          prod, scoped API keys over account-wide ones.
        </li>
        <li>
          <strong>Provenance:</strong> prefer official vendor servers and widely-used open-source
          ones you can read. A random server from a listing site gets your GitHub token — act
          accordingly.
        </li>
        <li>
          <strong>Prompt injection awareness:</strong> anything Claude reads through a connector
          (web pages, tickets, docs) can contain text designed to manipulate it. Keep
          confirmation prompts on for consequential actions; don&apos;t run auto-approve against
          untrusted content.
        </li>
      </ul>

      <h2>A sane starter set</h2>
      <ol>
        <li><strong>GitHub</strong> — if your code lives there.</li>
        <li><strong>Playwright</strong> — if you build anything with a UI.</li>
        <li><strong>Your database</strong> — read-only, dev instance.</li>
        <li>
          <strong>One docs/search server</strong> — if you work across many libraries.
        </li>
      </ol>
      <p>
        Then stop until a real task wants more. Every server adds tools to Claude&apos;s context —
        a lean set it uses well beats an arsenal it fumbles.
      </p>

      <div className="callout">
        <p>
          <strong>MCP gives Claude hands; skills give it expertise.</strong> The AgentsKit kits
          ship 103 skills and 181 commands that put both to work — code review, security audits,
          SEO, email sequences — installed in one command.{" "}
          <a href="/#pricing">See what&apos;s inside →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            MCP servers vs. skills — what&apos;s the difference? <span className="plus">+</span>
          </summary>
          <div className="a">
            Servers are <em>capabilities</em> (query the DB, drive the browser); skills are{" "}
            <em>knowledge</em> (how to do a security audit, how your team writes tests). Skills
            frequently use servers — an audit skill might drive the Playwright server. You want
            both layers.
          </div>
        </details>
        <details className="q">
          <summary>
            Where do I find servers? <span className="plus">+</span>
          </summary>
          <div className="a">
            Start with official sources: Anthropic&apos;s MCP registry and vendors&apos; own
            servers (GitHub&apos;s, Microsoft&apos;s Playwright, Sentry&apos;s). Community
            directories are useful for discovery but curate nothing — apply the provenance rule
            above.
          </div>
        </details>
        <details className="q">
          <summary>
            Do MCP servers work outside Claude? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — that&apos;s the point of an open protocol. The same server plugs into any
            MCP-capable client, which is why building on MCP beats building one-off integrations.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
