import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("best-mcp-servers-for-claude-code")!;
const URL = `https://agentskit.co/blog/${post.slug}`;

export const metadata: Metadata = {
  title: `${post.title} — AgentsKit`,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: post.title,
    description: post.description,
    type: "article",
    url: URL,
    images: [{ url: ogImage(post.title, post.tag), width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [ogImage(post.title, post.tag)] },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  url: URL,
  author: { "@type": "Organization", name: "AgentsKit" },
  publisher: { "@type": "Organization", name: "AgentsKit", url: "https://agentskit.co" },
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "MCP" }]}
      eyebrow="Ranked list"
      title={post.title}
      meta={[post.date, post.readingTime, "For Claude Code users choosing what to connect"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/mcp-config-validator",
          title: "Free MCP Config Validator",
          desc: "Paste your config and catch the JSON mistakes that stop servers loading.",
        },
        {
          href: "/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
          title: "Skills vs Subagents vs Commands vs MCP",
          desc: "When a problem needs an MCP server — and when it very much doesn't.",
        },
        {
          href: "/blog/best-claude-code-skills",
          title: "The Best Claude Code Skills to Install",
          desc: "The other half of a good setup: capability, not just connectivity.",
        },
      ]}
    >
      <p className="intro">
        MCP servers are how Claude Code reaches things that aren&apos;t files on your disk — your
        database, your issue tracker, a live browser, real library documentation. There are
        thousands of them now, and directory sites will happily list all of them. That&apos;s not
        useful. Every server you connect spends part of a finite tool budget and widens the set of
        credentials you&apos;re trusting, so the right number to run is four to six, not forty.
        Here are the twelve worth choosing from, ranked, with a clear first pick.
      </p>

      <h2>Our #1: Context7</h2>
      <p>
        <strong>Install this one first.</strong> Context7 pulls real, version-pinned documentation
        for the libraries you actually have installed and puts it in context at the moment
        Claude needs it.
      </p>
      <p>
        The reason it wins isn&apos;t that it&apos;s the flashiest server — it&apos;s that it fixes
        the single most expensive failure mode in agentic coding. A model&apos;s knowledge of a
        fast-moving package is frozen at training time, so it writes a call signature that was
        correct eighteen months ago, the code fails in a way that looks like your mistake, and you
        lose twenty minutes. Docs-in-context removes an entire category of debugging rather than
        adding a new capability.
      </p>
      <p>
        Note what it beats. GitHub, filesystem access, and shell commands are the obvious first
        instincts — but Claude Code already reads and writes files natively and already runs{" "}
        {code("git")} and {code("gh")} in your terminal. Servers that duplicate built-in
        capability cost you tools and give you little. Context7 covers something the agent
        genuinely cannot get on its own.
      </p>

      <h2>2. Playwright</h2>
      <p>
        Browser automation: navigate, click, fill forms, read the DOM, screenshot. This is what
        turns &quot;I changed the checkout page&quot; into &quot;I changed the checkout page,
        loaded it, clicked through it, and read the console.&quot; If you build anything with a
        UI, this is the server that lets Claude verify its own work instead of asking you to.
      </p>

      <h2>3. GitHub</h2>
      <p>
        Issues, pull requests, reviews, workflow runs, and cross-repo search through the API.
        Worth adding when your work is genuinely repo-management shaped — triaging issues,
        reviewing PRs across several repos, reading CI failures. If you mostly commit and push in
        one project, the {code("gh")} CLI Claude already has covers it and the server is
        redundant.
      </p>

      <h2>4. Postgres (or your database)</h2>
      <p>
        Exposing your schema changes the quality of everything downstream: Claude writes queries
        against real column names, spots the missing index, and stops inventing tables. Connect
        with a read-only role on a development database. Not production, not with write
        credentials, not the first time.
      </p>

      <h2>5. A web search server (Exa, Brave, or similar)</h2>
      <p>
        Live search inside the agent loop, for the questions Context7 doesn&apos;t answer — a
        cryptic error string, a changelog, a comparison of two approaches. One search server is
        plenty. Two is a tool-budget tax you pay on every request for no gain.
      </p>

      <h2>6–8. Where your team actually works: Linear, Notion, Slack</h2>
      <p>
        These earn their slot when the boring part of your job is transcription — turning a ticket
        into a branch, a decision into a doc, a thread into a summary. Add the one where your
        work lands and skip the others. Marketing and product teams typically get more out of this
        group than engineers do.
      </p>

      <h2>9–12. Situational, high-value</h2>
      <ul>
        <li>
          <strong>Figma</strong> — reads design files so implementation starts from real spacing
          and tokens instead of a screenshot and a guess.
        </li>
        <li>
          <strong>Sentry</strong> — pulls a live stack trace and its context so debugging starts
          from the actual error, not your paraphrase of it.
        </li>
        <li>
          <strong>Stripe</strong> — inspects real objects and test-mode state while you build
          billing, which is exactly where invented field names hurt most.
        </li>
        <li>
          <strong>Sequential Thinking</strong> — structured multi-step reasoning for genuinely
          hard planning problems. Useful occasionally; not a permanent resident.
        </li>
      </ul>

      <h2>The short version</h2>
      <div className="cmp">
        <table>
          <thead>
            <tr>
              <th>If you are</th>
              <th>Connect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A solo dev shipping web apps</td>
              <td>Context7 + Playwright + Postgres</td>
            </tr>
            <tr>
              <td>On a team with heavy PR flow</td>
              <td>Context7 + GitHub + Sentry</td>
            </tr>
            <tr>
              <td>Building against a design system</td>
              <td>Context7 + Figma + Playwright</td>
            </tr>
            <tr>
              <td>A marketer or PM, not an engineer</td>
              <td>Notion or Linear + a search server</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>How to add one</h2>
      <p>
        Servers are registered per-project or globally with {code("claude mcp add")}, or by editing
        the JSON config directly. Two rules that save most of the pain: give each server the
        narrowest credential that still works, and add servers one at a time so you can tell which
        one broke your setup. Config that silently fails to load is almost always a JSON or
        transport-shape problem rather than a real connection failure — our free{" "}
        <a href="/mcp-config-validator">MCP config validator</a> catches those in a paste. If
        you&apos;re earlier than that — still working out what MCP is and whether you need it —{" "}
        <a href="/tools/claude-mcp-servers">start with the primer</a>.
      </p>

      <h2>The mistake almost everyone makes</h2>
      <p>
        Connecting servers is not the same as making Claude better at your work. An MCP server
        grants access; it does not teach judgment. Connecting Postgres doesn&apos;t make Claude
        write migrations the way your team writes migrations, and connecting GitHub doesn&apos;t
        make its PR descriptions match your conventions. That part is{" "}
        <a href="/blog/best-claude-code-skills">skills</a> and{" "}
        <a href="/blog/best-claude-code-subagents">subagents</a>. People who feel let down after
        wiring up eight servers have usually solved access and left capability untouched — the{" "}
        <a href="/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp">
          side-by-side breakdown
        </a>{" "}
        is worth five minutes before you install anything.
      </p>

      <div className="callout">
        <p>
          <strong>Access is the easy half.</strong> AgentsKit ships the other half as one
          install: 103 skills, 89 agents, and 181 commands that encode how the work should be
          done — review, testing, security, migrations, SEO, campaigns — tuned to trigger and kept
          current. <a href="/#pricing">See what&apos;s inside →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            How many MCP servers is too many? <span className="plus">+</span>
          </summary>
          <div className="a">
            Past roughly six, quality usually drops. Every server&apos;s tool definitions sit in
            context on every request, and near-duplicate tools across servers make selection
            noticeably worse. If a server hasn&apos;t been used in two weeks, remove it — you can
            add it back in a command.
          </div>
        </details>
        <details className="q">
          <summary>
            Are MCP servers safe to install? <span className="plus">+</span>
          </summary>
          <div className="a">
            Treat them like dependencies with credentials attached. Prefer official servers from
            the vendor whose API they wrap, read the source of community ones, scope tokens to the
            minimum, and never point a server at production data on day one. A server can only be
            as careful as the permissions you hand it.
          </div>
        </details>
        <details className="q">
          <summary>
            Do I need an MCP server to read my own files? <span className="plus">+</span>
          </summary>
          <div className="a">
            No. Claude Code reads, writes, and searches your project natively and runs shell
            commands. A filesystem server is only worth it for reaching directories well outside
            your working tree — otherwise it duplicates built-in behavior at a cost.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
