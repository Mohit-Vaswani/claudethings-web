import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("best-claude-code-hooks")!;
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
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Hooks" }]}
      eyebrow="Ranked list"
      title={post.title}
      meta={[post.date, post.readingTime, "For people whose setup should enforce, not suggest"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/claude-hooks-builder",
          title: "Free Claude Hooks Builder",
          desc: "Generate the settings.json for any of these without hand-writing JSON.",
        },
        {
          href: "/blog/claude-md-best-practices-template",
          title: "CLAUDE.md Best Practices",
          desc: "The instructions layer that hooks are the enforcement layer for.",
        },
        {
          href: "/blog/best-claude-code-skills",
          title: "The Best Claude Code Skills to Install",
          desc: "Capability, where hooks are guarantees.",
        },
      ]}
    >
      <p className="intro">
        Everything else in your Claude Code setup is a request. CLAUDE.md asks, skills teach,
        commands prompt — and a model can decide, reasonably or not, to do something else. Hooks
        are the one layer that doesn&apos;t negotiate: shell commands the harness runs at fixed
        points in the loop, whose exit code can block a tool call outright. That makes them the
        right tool for a narrow, important set of jobs — and the wrong tool for most of what
        people try to use them for. Here are the nine worth having, ranked.
      </p>

      <h2>Our #1: format and lint on every edit</h2>
      <p>
        <strong>A {code("PostToolUse")} hook on file edits that runs your formatter, then your
        linter, on the file that just changed.</strong> Set this up first, before anything else on
        the list.
      </p>
      <p>
        It wins because it converts an instruction that gets ignored into a property that&apos;s
        always true. &quot;Follow our formatting&quot; in CLAUDE.md costs context on every request
        and still produces drift. A hook makes formatting non-negotiable, cleans up the diff noise
        that makes AI-written PRs annoying to review, and — the underrated part — feeds lint
        errors straight back to Claude, which then fixes them in the same turn instead of leaving
        them for CI. One line of config, immediate payoff, no downside.
      </p>

      <h2>2. Block dangerous commands before they run</h2>
      <p>
        A {code("PreToolUse")} hook that inspects the pending command and refuses the ones you
        never want executed: recursive deletes outside the project, force-pushes to main,{" "}
        {code("DROP")} against anything that isn&apos;t a local database, production deploy
        scripts. Exit code 2 blocks the call and tells Claude why, so it adapts rather than
        stalling. This is the hook that lets you loosen permissions everywhere else without
        anxiety.
      </p>

      <h2>3. Protect secrets from being read or written</h2>
      <p>
        A {code("PreToolUse")} guard on file reads that denies {code(".env")}, credential files,
        and key material, plus a {code("PostToolUse")} scan that flags anything looking like a
        live key in a file Claude just wrote. Instructions are the wrong mechanism here — this is
        exactly the case where you want a guarantee rather than a strong preference.
      </p>

      <h2>4. Run the tests when the work stops</h2>
      <p>
        A {code("Stop")} hook that runs your test suite, or the targeted subset, at the end of a
        session. It closes the most common gap between &quot;Claude said it was done&quot; and
        &quot;it was done.&quot; Keep it fast — a suite that takes four minutes turns into a hook
        you disable by Thursday. Point it at the affected package, not the monorepo.
      </p>

      <h2>5. Type-check after edits</h2>
      <p>
        In a typed codebase, a {code("PostToolUse")} type-check on changed files is the
        highest-signal feedback available, and it arrives while Claude still has full context on
        what it wrote. Cheap to add, catches a category of error that reads perfectly fine.
      </p>

      <h2>6. Tell you when Claude needs you</h2>
      <p>
        A {code("Notification")} hook that pings your desktop, terminal bell, or phone when Claude
        is waiting on input. Sounds trivial; it&apos;s the hook that actually makes long agentic
        runs practical, because otherwise you either babysit the terminal or discover forty
        minutes later that it stopped to ask a yes/no question.
      </p>

      <h2>7. Load fresh context at session start</h2>
      <p>
        A {code("SessionStart")} hook that injects the things that go stale: current branch and
        recent commits, open issues assigned to you, the current sprint, a fresh dependency list.
        Better than pasting the same orientation each morning, and better than putting facts in
        CLAUDE.md that will be wrong next week.
      </p>

      <h2>8. Enrich prompts automatically</h2>
      <p>
        A {code("UserPromptSubmit")} hook can append context to what you type — the ticket
        referenced in your message, the current test failures, today&apos;s date. Use sparingly.
        Appending too much to every prompt is how a clever hook becomes a context tax you pay on
        every request.
      </p>

      <h2>9. Log what happened</h2>
      <p>
        A {code("PostToolUse")} hook writing a JSONL line per tool call gives you a real record of
        what Claude did and when. Useful for teams that need an audit trail, and quietly useful
        for everyone else the first time you need to reconstruct a session that went sideways.
      </p>

      <h2>Which event to use</h2>
      <div className="cmp">
        <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Event</th>
              <th>Can it block?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stop an action happening</td>
              <td>PreToolUse</td>
              <td>Yes — exit 2</td>
            </tr>
            <tr>
              <td>React to a change</td>
              <td>PostToolUse</td>
              <td>No, but feeds output back</td>
            </tr>
            <tr>
              <td>Add context to a request</td>
              <td>UserPromptSubmit</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Verify before finishing</td>
              <td>Stop / SubagentStop</td>
              <td>Yes — can force continuation</td>
            </tr>
            <tr>
              <td>Get alerted</td>
              <td>Notification</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Set up a session</td>
              <td>SessionStart</td>
              <td>No</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Four rules that keep hooks from becoming the problem</h2>
      <ul>
        <li>
          <strong>Fast or nothing.</strong> Hooks run inline. Anything over a couple of seconds on
          a frequent event makes the whole tool feel broken.
        </li>
        <li>
          <strong>Match narrowly.</strong> Scope matchers to the tools and file patterns you
          actually mean, or you&apos;ll run a Python formatter over a YAML file and spend an
          afternoon confused.
        </li>
        <li>
          <strong>Fail loudly, block rarely.</strong> Reserve blocking for genuine
          irreversibility. A hook that blocks on style will get switched off, taking your safety
          hooks with it.
        </li>
        <li>
          <strong>Remember they run with your permissions.</strong> A hook from someone else&apos;s
          repo is a shell command you agreed to run automatically. Read it.
        </li>
      </ul>

      <p>
        Hooks live in {code("settings.json")} — project-level for team-wide rules committed to git,
        user-level for personal ones. The JSON shape is fiddly enough that a bad matcher fails
        silently, which is why we built a free{" "}
        <a href="/claude-hooks-builder">hooks builder</a> that generates valid config for exactly
        these patterns.
      </p>

      <div className="callout">
        <p>
          <strong>Guarantees, plus the judgment to go with them.</strong> Hooks enforce; skills and
          agents decide. ClaudeThings ships 103 skills, 89 agents, and 181 commands that encode how
          your review, testing, security, and release work should be done.{" "}
          <a href="/#pricing">See the full library →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Hooks or CLAUDE.md — where does a rule belong? <span className="plus">+</span>
          </summary>
          <div className="a">
            If a violation is merely undesirable, CLAUDE.md. If a violation is unacceptable, a
            hook. Instructions are probabilistic; hooks are deterministic. Most people over-use
            CLAUDE.md for things that were always really hook material — formatting being the
            classic example.
          </div>
        </details>
        <details className="q">
          <summary>
            Why isn&apos;t my hook firing? <span className="plus">+</span>
          </summary>
          <div className="a">
            Almost always the matcher: wrong tool name, wrong event, or a file pattern that
            doesn&apos;t match what Claude actually edited. Test the command standalone in your
            shell first, then check the matcher, then check which settings file it landed in.
          </div>
        </details>
        <details className="q">
          <summary>
            Can hooks see what Claude is doing? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — hooks receive structured JSON on stdin describing the event, including the tool
            and its inputs. That&apos;s what makes conditional logic possible: inspect the payload,
            decide, exit with the code that expresses your decision.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
