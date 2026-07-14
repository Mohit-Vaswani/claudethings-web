import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-code-custom-slash-commands-examples")!;
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
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Slash commands" }]}
      eyebrow="Copy-paste examples"
      title={post.title}
      meta={[post.date, post.readingTime, "15 working commands included"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
          title: "Skills vs Subagents vs Slash Commands vs MCP",
          desc: "When a slash command is the right primitive — and when it isn't.",
        },
        {
          href: "/blog/claude-md-best-practices-template",
          title: "CLAUDE.md Best Practices",
          desc: "The exact template to give every new project.",
        },
        {
          href: "/blog/best-claude-code-subagents",
          title: "The 12 Subagents Worth Setting Up First",
          desc: "Commands trigger workflows; these agents do the heavy lifting inside them.",
        },
      ]}
    >
      <p className="intro">
        A custom slash command is the simplest extension Claude Code has: a markdown file in{" "}
        {code(".claude/commands/")} whose filename becomes the command and whose body becomes the
        prompt. No registration, no build step — save the file, type {code("/")} and it&apos;s
        there. What most people are missing isn&apos;t syntax, it&apos;s a starting library. Here
        are fifteen commands you can paste today, organized by the work they do.
      </p>

      <h2>The 60-second syntax primer</h2>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">.claude/commands/fix-issue.md</span>
        </div>
        <pre className="prompt-body">{`---
description: Find and fix a GitHub issue by number
argument-hint: <issue number>
---

Fix GitHub issue #$ARGUMENTS.
1. Read the issue with \`gh issue view $ARGUMENTS\`
2. Locate the relevant code and reproduce the problem
3. Implement a fix, add a regression test, run the suite
4. Commit with message "fix: <summary> (#$ARGUMENTS)"`}</pre>
      </div>
      <p>
        {code("$ARGUMENTS")} captures everything typed after the command ({code("/fix-issue 421")});
        {code("$1")}, {code("$2")} grab positional arguments individually. Lines starting with{" "}
        {code("!")} run shell commands and inject their output into the prompt, and{" "}
        {code("@path/to/file")} pulls a file in as context. The frontmatter is optional but the{" "}
        {code("description")} shows up in the command menu, so write it.
      </p>

      <h2>Code quality (1–4)</h2>
      <p>
        <strong>1. /review</strong> — &quot;Review the current diff ({code("!git diff HEAD")})
        for correctness bugs first, style second. For each finding: file, line, what breaks, and a
        concrete fix. Rank by severity. If nothing is wrong, say so — do not invent findings.&quot;
      </p>
      <p>
        <strong>2. /refactor</strong> — &quot;Refactor {code("$ARGUMENTS")} without changing
        behavior. Tests must stay green — run them before and after. List each change and why it
        improves the code. If a change would alter behavior, stop and report instead.&quot;
      </p>
      <p>
        <strong>3. /test</strong> — &quot;Write tests for {code("$ARGUMENTS")} following this
        repo&apos;s existing test patterns. Cover the happy path, edge cases, and one failure mode.
        Run them and fix failures before finishing.&quot;
      </p>
      <p>
        <strong>4. /explain</strong> — &quot;Explain how {code("$ARGUMENTS")} works: entry points,
        data flow, key invariants, and anything surprising. Audience: a developer new to this
        codebase. No code changes.&quot;
      </p>

      <h2>Git and shipping (5–8)</h2>
      <p>
        <strong>5. /commit</strong> — &quot;Stage and commit the current changes. Group unrelated
        changes into separate commits. Messages follow conventional commits; the subject line
        explains <em>why</em>, not just what.&quot;
      </p>
      <p>
        <strong>6. /pr</strong> — &quot;Create a pull request for this branch: summarize the diff
        against main, list notable decisions and trade-offs, add a test plan, and open it with{" "}
        {code("gh pr create")}.&quot;
      </p>
      <p>
        <strong>7. /changelog</strong> — &quot;Update CHANGELOG.md from commits since the last
        release tag ({code("!git log $(git describe --tags --abbrev=0)..HEAD --oneline")}). Group
        by Added/Changed/Fixed. Write for users, not committers.&quot;
      </p>
      <p>
        <strong>8. /release-check</strong> — &quot;Pre-release audit: run tests, typecheck, and
        build; check for TODOs and console.logs in the diff; verify version bumps are consistent.
        Output a go/no-go verdict with a checklist.&quot;
      </p>

      <h2>Debugging and maintenance (9–12)</h2>
      <p>
        <strong>9. /debug</strong> — &quot;Debug this: {code("$ARGUMENTS")}. Reproduce first.
        State your hypothesis before changing anything, add instrumentation to confirm it, then
        fix the root cause — not the symptom — and prove the fix with a test.&quot;
      </p>
      <p>
        <strong>10. /deps</strong> — &quot;Audit dependencies: flag outdated packages, known
        vulnerabilities ({code("!npm audit")}), and anything unmaintained. Recommend upgrades in
        order of risk, and note breaking changes from changelogs.&quot;
      </p>
      <p>
        <strong>11. /todo-sweep</strong> — &quot;Find every TODO/FIXME/HACK in src/. For each:
        still relevant? If trivially fixable, fix it. Otherwise output a prioritized list with file
        and line references.&quot;
      </p>
      <p>
        <strong>12. /dead-code</strong> — &quot;Find unused exports, unreachable branches, and
        orphaned files. Verify each candidate is truly unused (check dynamic imports and string
        references) before listing it for deletion.&quot;
      </p>

      <h2>Documentation and beyond (13–15)</h2>
      <p>
        <strong>13. /docs</strong> — &quot;Update documentation for {code("$ARGUMENTS")}: check
        README and docs/ against the current behavior of the code, fix drift, and flag anything
        undocumented that a new user would need.&quot;
      </p>
      <p>
        <strong>14. /onboard</strong> — &quot;Give me a tour of this codebase: purpose, stack, the
        five most important files, how data flows through a typical request, and what I should
        read first. Then suggest three good first tasks.&quot;
      </p>
      <p>
        <strong>15. /standup</strong> — &quot;Summarize what changed in this repo in the last 24
        hours ({code("!git log --since=yesterday --oneline")}): what shipped, what&apos;s in
        progress, anything blocked. Three bullets, written for a standup.&quot;
      </p>

      <h2>Patterns that separate good commands from noise</h2>
      <ul>
        <li>
          <strong>Encode the checklist, not just the ask.</strong> &quot;Review my code&quot; is a
          wish. Numbered steps with an output format is a workflow that runs the same way every
          time — that consistency is the entire value of a command.
        </li>
        <li>
          <strong>Inject fresh context with {code("!")}.</strong> A command that pulls the actual
          diff, log, or audit output grounds Claude in reality instead of memory.
        </li>
        <li>
          <strong>Define &quot;done&quot;.</strong> End with the verification step — run the
          tests, show the output, produce the verdict. Commands without a finish line produce
          plausible-looking half-work.
        </li>
        <li>
          <strong>Commit them to the repo.</strong> Project-level commands are shared team
          workflows in git. Your best reviewer&apos;s checklist, everyone&apos;s {code("/review")}.
        </li>
      </ul>

      <div className="callout">
        <p>
          <strong>These 15 are the free sample:</strong> the ClaudeThings kits ship 181 slash
          commands covering review, testing, security, refactoring, docs, marketing, and more —
          installed in one command. <a href="/#pricing">Browse the full library →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Slash command or skill — which should I make? <span className="plus">+</span>
          </summary>
          <div className="a">
            Commands run when you type them; skills fire automatically when the task matches. If
            the workflow is deliberate (&quot;now do a release check&quot;), make it a command. If
            forgetting to invoke it would hurt (&quot;always follow our migration rules&quot;),
            make it a skill.
          </div>
        </details>
        <details className="q">
          <summary>
            Can commands take multiple arguments? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — {code("$1")}, {code("$2")}, etc. for positional arguments, or {code("$ARGUMENTS")}{" "}
            for the whole string. Add an {code("argument-hint")} in frontmatter so the menu shows
            what to pass.
          </div>
        </details>
        <details className="q">
          <summary>
            Why isn&apos;t my command showing up? <span className="plus">+</span>
          </summary>
          <div className="a">
            Check the location ({code(".claude/commands/")} in the project or{" "}
            {code("~/.claude/commands/")} globally), the extension ({code(".md")}), and restart the
            session. Subdirectories create namespaces — {code("commands/git/pr.md")} appears as a
            project command with &quot;git&quot; in its description.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
