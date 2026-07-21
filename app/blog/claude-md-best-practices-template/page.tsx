import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-md-best-practices-template")!;
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
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "CLAUDE.md" }]}
      eyebrow="Template"
      title={post.title}
      meta={[post.date, post.readingTime, "Copy-paste template included"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "Install to first shipped feature — where CLAUDE.md fits in the bigger picture.",
        },
        {
          href: "/blog/how-to-write-a-claude-code-skill-that-triggers",
          title: "How to Write a SKILL.md That Actually Triggers",
          desc: "When an instruction belongs in a skill instead of CLAUDE.md.",
        },
        {
          href: "/blog/claude-code-custom-slash-commands-examples",
          title: "15 Copy-Paste Slash Command Examples",
          desc: "Ready-to-use commands for real engineering work.",
        },
      ]}
    >
      <p className="intro">
        CLAUDE.md is the file Claude Code reads at the start of every session — the onboarding
        document for an engineer who joins your project fresh each morning with no memory of
        yesterday. Everyone knows it matters. Almost nobody knows what to actually put in it, which
        is why most CLAUDE.md files are either three unhelpful lines or 800 lines of wishful
        thinking that Claude skims and forgets. This guide gives you the principles and the exact
        template.
      </p>

      <h2>The one rule that governs everything: this file costs context</h2>
      <p>
        Every line of CLAUDE.md is loaded into every session, whether relevant or not. That means
        two failure modes:
      </p>
      <ul>
        <li>
          <strong>Too short</strong>, and Claude re-derives your stack, guesses your conventions,
          and repeats mistakes you&apos;ve already corrected ten times.
        </li>
        <li>
          <strong>Too long</strong>, and the instructions compete with each other for attention.
          A 900-line CLAUDE.md doesn&apos;t give you 900 lines of obedience — it gives you a model
          that weighs your genuinely critical rule the same as your note about import ordering.
        </li>
      </ul>
      <p>
        The sweet spot for most projects is <strong>under ~200 lines</strong>. The test for every
        line: <em>would a competent new hire need to be told this, and does it apply to most
        sessions?</em> If it only applies to some tasks, it belongs in a skill that loads on
        demand. If it&apos;s discoverable from the code in seconds, delete it.
      </p>

      <h2>The template</h2>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">CLAUDE.md — copy, then fill in</span>
        </div>
        <pre className="prompt-body">{`# <Project name>

<One sentence: what this project is and who uses it.>
Stack: <framework + language + DB + anything unusual>.

## Commands
- <dev server command> — <port / notes>
- <test command> — run before claiming any change works
- <lint / typecheck command>
- <build or deploy command, if Claude may run it>

## Architecture
- <2–6 bullets: the main directories and what owns what>
- <where the "front door" is: entry points, routing>
- <the one data-flow fact that isn't obvious from the tree>

## Conventions
- <how code is organized: e.g. "all DB access via src/db/queries/">
- <error handling rule>
- <naming or style rule that lint doesn't enforce>
- <what to do about types: e.g. "no any — fix the type">

## Workflow
- <branching / commit rules, e.g. "commit as you go, small diffs">
- <verification rule: "run tests + typecheck before done">
- <what Claude must NOT do without asking: migrations,
  deleting data, touching payments code>

## Gotchas
- <the 2–5 landmines every new engineer steps on>`}</pre>
      </div>
      <p>
        That&apos;s the whole structure: identity, commands, architecture, conventions, workflow,
        gotchas. Run {code("/init")} to draft the mechanical parts from your codebase, then spend
        your effort on the last three sections — they&apos;re the parts Claude can&apos;t figure
        out by reading the code.
      </p>

      <h2>What earns a line (and what doesn&apos;t)</h2>
      <h3>Put in: things Claude gets wrong without being told</h3>
      <ul>
        <li>
          <strong>Commands with their quirks.</strong> Not just {code("npm test")} but &quot;tests
          need the DB container running: {code("docker compose up -d db")} first.&quot;
        </li>
        <li>
          <strong>Non-obvious boundaries.</strong> &quot;The {code("legacy/")} folder is frozen —
          bugfix only, never refactor.&quot;
        </li>
        <li>
          <strong>Verification expectations.</strong> &quot;A change isn&apos;t done until
          typecheck and tests pass&quot; changes Claude&apos;s behavior more than any style rule.
        </li>
        <li>
          <strong>Corrections you&apos;ve made twice.</strong> This is the highest-signal source.
          The second time you correct the same mistake in chat, move the correction into the file.
        </li>
      </ul>
      <h3>Leave out: everything Claude can see or doesn&apos;t need</h3>
      <ul>
        <li>
          Directory listings and file inventories — Claude can list files. Explain{" "}
          <em>meaning</em>, not contents.
        </li>
        <li>
          Anything your linter or formatter already enforces. Tools beat instructions; if prettier
          fixes it, don&apos;t spend attention on it.
        </li>
        <li>
          Long task-specific procedures (release process, migration recipes). Those belong in{" "}
          <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">skills</a>, loaded only
          when relevant.
        </li>
        <li>
          Aspirational essays about code quality. &quot;Write clean, maintainable code&quot; has
          never changed a model&apos;s behavior. Specific, checkable rules do.
        </li>
      </ul>

      <h2>Three habits that keep it working</h2>
      <ol>
        <li>
          <strong>Treat it as a living file.</strong> The best CLAUDE.md files are grown, not
          written — every corrected mistake is a candidate line. In-session, the {code("#")}{" "}
          shortcut appends a memory to the file without breaking flow.
        </li>
        <li>
          <strong>Prune on a schedule.</strong> Rules outlive their reasons. When you touch the
          file, delete lines about code that no longer exists — every dead line dilutes attention
          paid to live ones.
        </li>
        <li>
          <strong>Review it in PRs like code.</strong> Project-level CLAUDE.md is shared team
          configuration checked into git. A bad instruction misleads every teammate&apos;s
          sessions, which makes it exactly as review-worthy as a bad function.
        </li>
      </ol>

      <h2>Layering: project, subdirectory, user</h2>
      <p>
        Claude Code merges CLAUDE.md files from several levels: {code("~/.claude/CLAUDE.md")} for
        your personal preferences across all projects, the repo root for team-shared rules, and
        subdirectory CLAUDE.md files for area-specific guidance (a {code("frontend/CLAUDE.md")}{" "}
        with component conventions, an {code("infra/CLAUDE.md")} with deployment cautions).
        Subdirectory files are pulled in when Claude works in those directories — a clean way to
        keep the root file lean on a large codebase.
      </p>

      <div className="callout">
        <p>
          <strong>This file is also how kits adapt:</strong> AgentsKit agents and skills read
          your CLAUDE.md to match your stack and conventions — the same 89 agents behave like they
          were written for your repo. <a href="/#pricing">See how the kits work →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            CLAUDE.md vs .claude/settings.json — what goes where? <span className="plus">+</span>
          </summary>
          <div className="a">
            CLAUDE.md is prose instructions for the model; settings.json is machine configuration
            (permissions, hooks, environment). &quot;Never run destructive migrations&quot; is a
            CLAUDE.md rule; actually denying the command is a permissions rule. Use both for
            anything critical.
          </div>
        </details>
        <details className="q">
          <summary>
            Does a longer CLAUDE.md make Claude smarter about my project? <span className="plus">+</span>
          </summary>
          <div className="a">
            Up to a point, then it inverts. Instructions compete for attention, and bloat weakens
            compliance with the rules you care about most. Under ~200 focused lines beats 800
            thorough ones in practice.
          </div>
        </details>
        <details className="q">
          <summary>
            Should CLAUDE.md be committed to git? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — the project-root file is team infrastructure and belongs in version control. For
            personal, machine-local notes, use CLAUDE.local.md (gitignored) or your user-level
            file.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
