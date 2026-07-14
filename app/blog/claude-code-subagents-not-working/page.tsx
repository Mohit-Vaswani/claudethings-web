import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-code-subagents-not-working")!;
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
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Troubleshooting" }]}
      eyebrow="Troubleshooting"
      title={post.title}
      meta={[post.date, post.readingTime, "For anyone mid-debugging"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/best-claude-code-subagents",
          title: "The 12 Subagents Worth Setting Up First",
          desc: "A curated starter set, with the tool scoping already right.",
        },
        {
          href: "/blog/run-claude-code-agents-in-parallel",
          title: "Run a Team of Agents Without Burning Tokens",
          desc: "Orchestration patterns and the token economics of parallel agents.",
        },
        {
          href: "/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
          title: "Skills vs Subagents vs Slash Commands vs MCP",
          desc: "Make sure a subagent was the right primitive in the first place.",
        },
      ]}
    >
      <p className="intro">
        You set up subagents, gave them careful prompts — and now either Claude never delegates to
        them, or it does and the results come back worse than doing it yourself. Both failure
        modes have specific, fixable causes. This guide walks through them in the order you should
        check.
      </p>

      <h2>First, verify the agent is even loaded</h2>
      <p>Before debugging behavior, rule out the boring stuff:</p>
      <ul>
        <li>
          The file is in {code(".claude/agents/")} (project) or {code("~/.claude/agents/")} (user)
          with a {code(".md")} extension.
        </li>
        <li>
          The YAML frontmatter parses: opening and closing {code("---")} fences, a valid{" "}
          {code("name")} (lowercase, hyphens), a {code("description")}, no tab characters. One bad
          line and the agent silently doesn&apos;t exist.
        </li>
        <li>
          You&apos;ve started a fresh session since adding it, and no same-named agent at another
          level is shadowing it (project beats user).
        </li>
      </ul>
      <p>
        The quickest check: ask Claude &quot;what subagents do you have available?&quot; If yours
        isn&apos;t listed, the problem is loading, not delegation.
      </p>

      <h2>Problem 1: Claude never uses the agent</h2>
      <p>
        Delegation is a decision the main session makes by reading agent <em>descriptions</em> —
        not your system prompts. If your description says &quot;An expert code reviewer with deep
        knowledge of best practices,&quot; Claude has no idea <em>when</em> to use it. Descriptions
        need trigger conditions, written like instructions to the delegator:
      </p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">description — before → after</span>
        </div>
        <pre className="prompt-body">{`# ❌ A résumé
description: Expert code reviewer with 10+ years of experience
  in software quality.

# ✅ A delegation rule
description: Reviews code changes for bugs and design problems.
  Use PROACTIVELY after writing or modifying code, before
  committing. MUST BE USED for changes touching auth, payments,
  or data deletion.`}</pre>
      </div>
      <p>
        Phrases like &quot;use proactively&quot; and &quot;must be used when…&quot; measurably
        increase delegation, because they speak to the exact moment the main session is deciding.
        If Claude still under-delegates, add a standing rule to CLAUDE.md (&quot;always run the
        code-reviewer agent before committing&quot;) — or invoke the agent explicitly by name,
        which always works and confirms the agent itself is fine.
      </p>

      <h2>Problem 2: the agent runs but produces garbage</h2>
      <p>
        This is almost always a context problem, in one of two directions.
      </p>
      <h3>The agent knows too little</h3>
      <p>
        A subagent starts with a <em>clean context window</em>. It has not read your conversation.
        It doesn&apos;t know what you and the main session decided twenty minutes ago, which files
        matter, or what &quot;the bug&quot; refers to. When the main session hands over a vague
        task — &quot;fix the validation issue&quot; — the subagent rediscovers everything from
        scratch, sometimes wrongly. Fixes:
      </p>
      <ul>
        <li>
          In the agent&apos;s system prompt, require a briefing: &quot;Expect the task description
          to include the files involved and acceptance criteria; if missing, state what you need
          instead of guessing.&quot;
        </li>
        <li>
          When you delegate manually, pass context explicitly: file paths, the decision already
          made, the constraint that matters.
        </li>
        <li>
          Put durable project facts in CLAUDE.md — subagents working in the project can read it,
          and it&apos;s the one context channel that doesn&apos;t depend on the handoff.
        </li>
      </ul>
      <h3>The agent returns too much — context bleed in reverse</h3>
      <p>
        The opposite failure: the subagent dumps its entire investigation — every file read, every
        dead end — back into your main session, defeating the isolation that justified the agent.
        The fix is an <strong>output contract</strong> in the system prompt: &quot;Return only: a
        verdict, the evidence for it, and recommended next steps. Do not include file contents or
        a narration of your process.&quot; The difference between an agent that protects your
        context and one that floods it is usually that one sentence.
      </p>

      <h2>Problem 3: the agent can&apos;t do its job (tool scoping)</h2>
      <p>
        If the frontmatter&apos;s {code("tools")} field is set, the agent gets only those tools.
        Two ways this goes wrong: the reviewer that can&apos;t read files because someone
        over-restricted it, and the &quot;read-only&quot; auditor that was never restricted at all
        and edits files mid-review. Match tools to the job — searchers and reviewers get
        read/grep, implementers add edit and bash — and remember that MCP tools need to be granted
        too if the agent depends on them. When an agent errors mysteriously, read the transcript:
        tool-permission failures are usually stated plainly there.
      </p>

      <h2>Problem 4: it works, but slower and more expensively than no agent</h2>
      <p>
        Subagents have a real overhead: each one boots a fresh context, re-reads whatever it needs,
        and reports back. For a two-line fix, that overhead exceeds the work. Delegation pays when
        the task is <em>research-heavy</em> (the agent absorbs forty files so your session
        doesn&apos;t), <em>specialized</em> (the checklist matters), or <em>parallel</em>{" "}
        (independent tasks at once). If your agents feel slow, check you aren&apos;t delegating
        work the main session would finish in one step — and if costs surprise you, read our{" "}
        <a href="/blog/run-claude-code-agents-in-parallel">token-economics guide</a>.
      </p>

      <h2>A 5-minute diagnostic, in order</h2>
      <ol>
        <li>Ask Claude to list available subagents. Missing → fix file location/frontmatter.</li>
        <li>Invoke the agent by name. Works → the description is your problem; sharpen triggers.</li>
        <li>Read the returned result. Vague → tighten the output contract; wrong → improve the briefing it receives.</li>
        <li>Check the {code("tools")} list against what the job requires.</li>
        <li>Ask whether this task needed an agent at all.</li>
      </ol>

      <div className="callout">
        <p>
          <strong>Or start from agents that already work:</strong> the 89 subagents in the
          ClaudeThings kits ship with delegation-tuned descriptions, correct tool scoping, and
          output contracts — the fixes in this article, pre-applied.{" "}
          <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Why does my subagent ask for permissions the main session already has? <span className="plus">+</span>
          </summary>
          <div className="a">
            Permissions are evaluated per tool call, and an agent&apos;s restricted tool list is
            separate from your session-level grants. Check both the agent&apos;s {code("tools")}{" "}
            frontmatter and your permission settings.
          </div>
        </details>
        <details className="q">
          <summary>
            Can subagents talk to each other? <span className="plus">+</span>
          </summary>
          <div className="a">
            Not directly — results flow back through the main session (or an orchestrator agent),
            which decides what the next agent sees. That&apos;s a feature: the handoff point is
            where you control context quality.
          </div>
        </details>
        <details className="q">
          <summary>
            Do subagents share my session&apos;s conversation history? <span className="plus">+</span>
          </summary>
          <div className="a">
            No — each starts clean. They receive the task description the main session writes for
            them, plus whatever they read themselves (including CLAUDE.md). Design your agents
            assuming exactly that and the quality problems mostly disappear.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
