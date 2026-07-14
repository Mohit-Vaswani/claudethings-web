import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp")!;
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
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Claude Code" }]}
      eyebrow="Explainer"
      title={post.title}
      meta={[post.date, post.readingTime, "For anyone setting up Claude Code"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/best-claude-code-subagents",
          title: "The 12 Claude Code Subagents Worth Setting Up First",
          desc: "A curated starter set of agents, with the reasoning behind each pick.",
        },
        {
          href: "/blog/how-to-write-a-claude-code-skill-that-triggers",
          title: "How to Write a SKILL.md That Actually Triggers",
          desc: "Why most skills never fire, and how to fix the description field.",
        },
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "From install to first shipped feature — setup, CLAUDE.md, and workflow habits.",
        },
      ]}
    >
      <p className="intro">
        Claude Code gives you four ways to extend it: skills, subagents, slash commands, and MCP
        servers. They overlap just enough to be confusing — all four &quot;add capabilities&quot;,
        all four live in config files, and every tutorial explains one of them in isolation. This
        guide explains all four side by side, so you know exactly which one to reach for.
      </p>

      <h2>The one-paragraph version</h2>
      <p>
        <strong>Slash commands</strong> are prompts you trigger manually. <strong>Skills</strong>{" "}
        are instructions Claude pulls in automatically when a task matches. <strong>Subagents</strong>{" "}
        are separate Claude instances with their own context window that the main session delegates
        work to. <strong>MCP servers</strong> connect Claude to external systems — databases, APIs,
        browsers, SaaS tools. Everything else is detail.
      </p>

      <h2>Slash commands: reusable prompts you invoke by name</h2>
      <p>
        A custom slash command is a markdown file in {code(".claude/commands/")}. The filename
        becomes the command: {code("review.md")} gives you {code("/review")}. The file body is the
        prompt that runs when you type it, and {code("$ARGUMENTS")} interpolates whatever you type
        after the command name.
      </p>
      <p>
        The defining property is that <em>you</em> decide when it runs. Claude never triggers a
        slash command on its own. That makes commands the right tool for workflows you repeat
        deliberately: kicking off a code review, drafting a changelog, generating a commit message,
        scaffolding a component. If you find yourself typing the same three-paragraph prompt every
        week, that prompt should be a slash command.
      </p>

      <h2>Skills: knowledge Claude loads when it decides it needs it</h2>
      <p>
        A skill is a folder containing a {code("SKILL.md")} file (plus optional scripts and
        reference docs) in {code(".claude/skills/")}. The frontmatter has a{" "}
        {code("description")} field, and that field is the trigger: Claude scans skill
        descriptions at the start of a task, and when your request matches one, it loads the full
        skill into context and follows it.
      </p>
      <p>
        The defining property is <em>automatic, model-decided activation</em>. You never type a
        skill name. You say &quot;audit this site for SEO problems&quot; and the SEO-audit skill
        fires because its description matched. Skills are the right tool for expertise you want
        applied consistently without remembering to ask: how your team writes migrations, how to
        process PDFs, what a proper security review covers. They also support progressive
        disclosure — Claude reads only the description until the skill is needed, so a large skill
        library costs almost nothing in context.
      </p>
      <p>
        The catch: badly written descriptions mean skills that never fire. That problem is common
        enough that we wrote a{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">whole guide on it</a> and a
        free <a href="/claude-skill-md-validator">SKILL.md validator</a>.
      </p>

      <h2>Subagents: delegation with a fresh context window</h2>
      <p>
        A subagent is a markdown file in {code(".claude/agents/")} defining a name, a description,
        a system prompt, and optionally a restricted tool list and model. When the main Claude
        session hits a task matching a subagent&apos;s description — or when you ask it to
        delegate — it spins up that subagent as a <em>separate Claude instance</em> with its own
        clean context window, waits for it to finish, and gets back only the result.
      </p>
      <p>Two properties make subagents different from everything else on this list:</p>
      <ul>
        <li>
          <strong>Context isolation.</strong> A subagent can read forty files while researching a
          question, and none of those forty files land in your main conversation — just the answer.
          This is how long sessions stay coherent.
        </li>
        <li>
          <strong>Scoped permissions.</strong> A code-reviewer subagent can be given read-only
          tools. A test-runner can run commands but not edit files. The main session keeps full
          access while delegated work runs with less.
        </li>
      </ul>
      <p>
        Use subagents for work that is voluminous (research, codebase exploration), specialized
        (security review, database migrations), or parallelizable (several independent tasks at
        once). Don&apos;t use them for small edits — the handoff overhead beats the benefit.
      </p>

      <h2>MCP: the plug for external systems</h2>
      <p>
        The Model Context Protocol is an open standard for connecting AI tools to outside systems.
        An MCP server exposes tools — &quot;query Postgres&quot;, &quot;search Slack&quot;,
        &quot;create a Linear issue&quot; — and Claude Code can call them like built-in tools.
        Skills, commands, and subagents change how Claude <em>thinks</em>; MCP changes what Claude
        can <em>touch</em>. If the capability you want requires data or actions outside your repo,
        it&apos;s MCP. If it requires knowledge or process, it&apos;s one of the other three.
      </p>

      <h2>The decision table</h2>
      <ul>
        <li>
          <strong>&quot;I run this workflow on demand&quot;</strong> → slash command
        </li>
        <li>
          <strong>&quot;Claude should just know how we do X&quot;</strong> → skill
        </li>
        <li>
          <strong>&quot;This deserves a specialist with its own context (or restricted
          permissions)&quot;</strong> → subagent
        </li>
        <li>
          <strong>&quot;Claude needs to reach a system outside this repo&quot;</strong> → MCP
          server
        </li>
        <li>
          <strong>&quot;Always, for everything in this project&quot;</strong> → that&apos;s not an
          extension at all; put it in CLAUDE.md
        </li>
      </ul>

      <h2>How they combine</h2>
      <p>
        The primitives are designed to stack. A {code("/deploy-check")} slash command can invoke a
        subagent; that subagent can have a skill loaded that documents your deployment process; the
        skill can instruct it to check your monitoring dashboard through an MCP server. Mature
        Claude Code setups aren&apos;t &quot;skills people&quot; or &quot;agents people&quot; —
        they use commands as entry points, skills as knowledge, subagents as workers, and MCP as
        wiring.
      </p>
      <p>
        And plugins, if you&apos;ve seen that term: a plugin is simply a distributable bundle that
        can contain all four, installed as a unit.
      </p>

      <div className="callout">
        <p>
          <strong>Skip the assembly:</strong> ClaudeThings kits ship 89 subagents, 103 skills, and
          181 slash commands — pre-built, pre-tuned, and installed into Claude Code with one
          command. <a href="/#pricing">See what&apos;s inside →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Can a skill and a slash command do the same thing? <span className="plus">+</span>
          </summary>
          <div className="a">
            Often, yes — the same instructions work in either. The difference is invocation: a
            command runs when you type it, a skill runs when Claude matches the task. If forgetting
            to invoke it would be a problem, make it a skill.
          </div>
        </details>
        <details className="q">
          <summary>
            Do subagents cost more tokens? <span className="plus">+</span>
          </summary>
          <div className="a">
            Each subagent has its own context, so parallel agents multiply token use. But for
            research-heavy tasks they often save tokens overall by keeping the main session lean.
            We cover this trade-off in{" "}
            <a href="/blog/run-claude-code-agents-in-parallel">the parallel-agents guide</a>.
          </div>
        </details>
        <details className="q">
          <summary>
            Where do these files live — project or user level? <span className="plus">+</span>
          </summary>
          <div className="a">
            Both. Project-level ({code(".claude/")} in the repo) is shared with your team via git;
            user-level ({code("~/.claude/")}) follows you across projects. Project-level wins when
            both define the same name.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
