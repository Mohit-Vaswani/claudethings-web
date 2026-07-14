import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("best-claude-code-subagents")!;
const URL = `https://claudethings.com/blog/${post.slug}`;

export const metadata: Metadata = {
  title: `${post.title} — ClaudeThings`,
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
  author: { "@type": "Organization", name: "ClaudeThings" },
  publisher: { "@type": "Organization", name: "ClaudeThings", url: "https://claudethings.com" },
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Subagents" }]}
      eyebrow="Curated list"
      title={post.title}
      meta={[post.date, post.readingTime, "For developers building their setup"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/claude-code-subagents-not-working",
          title: "Why Your Claude Code Subagents Aren't Working",
          desc: "Fixing context bleed, bad delegation, and agents that never get used.",
        },
        {
          href: "/blog/best-claude-code-skills",
          title: "The Best Claude Code Skills to Install in 2026",
          desc: "The matching shortlist for skills — and how to add them in one command.",
        },
        {
          href: "/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
          title: "Skills vs Subagents vs Slash Commands vs MCP",
          desc: "What each primitive does and when to reach for which.",
        },
      ]}
    >
      <p className="intro">
        Search for Claude Code subagents and you&apos;ll land on GitHub repos with 100+ agents and
        no opinion about which ones matter. That&apos;s a parts catalog, not advice. Here is the
        opposite: the twelve subagents that earn their place in a real workflow, what each one
        does, and why it made the cut.
      </p>
      <p>
        Quick refresher: a subagent is a markdown file in {code(".claude/agents/")} with a
        description (which tells the main session when to delegate), a system prompt, and
        optionally a restricted tool list. It runs in its own context window and reports back only
        results. That means better focus, cleaner main-session context, and scoped permissions.
      </p>

      <h2>The four that pay for themselves in week one</h2>
      <h3>1. Code reviewer</h3>
      <p>
        The single highest-value subagent. Give it read-only tools and a prompt that reviews for
        correctness first, style second — checking the diff against how the change could actually
        fail, not against a linter&apos;s taste. Because it runs in a fresh context, it reviews
        your changes without the bias of having written them.
      </p>
      <h3>2. Debugger</h3>
      <p>
        A root-cause specialist: reproduce first, hypothesize, instrument, confirm, then fix.
        Delegating debugging keeps twenty files of stack-trace spelunking out of your main
        session&apos;s context — the subagent burns its own window on the search and returns just
        the diagnosis.
      </p>
      <h3>3. Test writer</h3>
      <p>
        Writes tests that assert behavior rather than implementation, and knows your framework
        conventions. Pair it with the reviewer: one agent writes the change, another writes the
        tests, and neither inherits the other&apos;s assumptions.
      </p>
      <h3>4. Codebase explorer</h3>
      <p>
        A read-only researcher for &quot;where does X happen?&quot; and &quot;how do these modules
        fit together?&quot; questions. This is the purest use of context isolation — exploration is
        exactly the work that bloats a main session fastest.
      </p>

      <h2>The four for shipping safely</h2>
      <h3>5. Security auditor</h3>
      <p>
        Reviews changes for injection, authz gaps, secrets in code, and unsafe input handling.
        Restrict it to read-only tools and run it on anything touching auth, payments, or user
        data. A dedicated agent applies a checklist consistently; an ad-hoc prompt applies it when
        you remember.
      </p>
      <h3>6. Refactoring specialist</h3>
      <p>
        Constrained to behavior-preserving changes: it must keep tests green and is explicitly
        forbidden from &quot;improving&quot; functionality along the way. That constraint is the
        whole point — refactors go wrong when scope creeps.
      </p>
      <h3>7. Performance profiler</h3>
      <p>
        Measures before it optimizes. Its prompt requires evidence — a benchmark, a flame graph, a
        query plan — before any change, which kills the guess-driven optimization Claude will
        otherwise happily do.
      </p>
      <h3>8. Database/migrations agent</h3>
      <p>
        Knows your schema conventions, writes reversible migrations, and flags destructive
        operations instead of running them. Databases are where &quot;move fast&quot; goes to die;
        a specialist with guardrails is worth the file.
      </p>

      <h2>The four for everything around the code</h2>
      <h3>9. Docs writer</h3>
      <p>
        Keeps READMEs, API docs, and changelogs in sync with reality. Prompt it to document what
        the code does now — not what the commit messages claim.
      </p>
      <h3>10. PR/release manager</h3>
      <p>
        Drafts PR descriptions from the actual diff, writes release notes, and checks that the
        branch state matches your team&apos;s conventions before anything ships.
      </p>
      <h3>11. Dependency auditor</h3>
      <p>
        Reviews new dependencies (size, maintenance, license, CVEs) and handles upgrade PRs with
        changelogs read, not skimmed. Cheap insurance against supply-chain surprises.
      </p>
      <h3>12. Orchestrator</h3>
      <p>
        The meta-agent: takes a large task, splits it into independent pieces, and fans them out to
        the specialists above — sequentially when steps depend on each other, in parallel when they
        don&apos;t. This is the one that turns eleven individual agents into a team. (If
        you&apos;re running agents in parallel, read{" "}
        <a href="/blog/run-claude-code-agents-in-parallel">the token-cost guide</a> first.)
      </p>

      <h2>What makes a subagent actually good</h2>
      <p>Four things separate agents that get used from agents that rot in a folder:</p>
      <ul>
        <li>
          <strong>A description written for the delegator.</strong> The main session decides
          delegation by reading descriptions. &quot;Use this agent after writing or modifying code
          to review the changes&quot; gets used; &quot;An expert code reviewer&quot; does not.
        </li>
        <li>
          <strong>Minimal tools.</strong> Reviewers and explorers should be read-only. Fewer tools
          means fewer permission prompts, fewer surprises, and more focus.
        </li>
        <li>
          <strong>One job.</strong> A &quot;full-stack expert&quot; agent is just the main session
          with extra steps. Narrow agents delegate cleanly.
        </li>
        <li>
          <strong>An output contract.</strong> Tell the agent exactly what to return — a verdict, a
          diff, a ranked list — so the main session gets a result, not a transcript.
        </li>
      </ul>

      <div className="callout">
        <p>
          <strong>Or skip the setup entirely:</strong> all twelve of these — and 77 more, tuned
          with correct tool scoping and delegation descriptions — ship in the ClaudeThings kits. 89
          agents, one install command. <a href="/#pricing">See the full roster →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            How many subagents is too many? <span className="plus">+</span>
          </summary>
          <div className="a">
            There&apos;s no hard limit, and well-written descriptions mean unused agents cost
            almost nothing. The real constraint is quality: ten sharp agents beat a hundred vague
            ones, because vague descriptions cause wrong delegation.
          </div>
        </details>
        <details className="q">
          <summary>
            Should subagents live in the repo or in ~/.claude? <span className="plus">+</span>
          </summary>
          <div className="a">
            Team-relevant agents (reviewer, migrations, security) belong in the repo&apos;s{" "}
            {code(".claude/agents/")} so everyone shares them. Personal workflow agents can stay at
            user level.
          </div>
        </details>
        <details className="q">
          <summary>
            Can I make Claude always use a specific subagent? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — mention it explicitly (&quot;use the code-reviewer agent&quot;), or add a rule to
            CLAUDE.md like &quot;always run the code-reviewer agent before committing.&quot; For
            on-demand invocation, wrap it in a slash command.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
