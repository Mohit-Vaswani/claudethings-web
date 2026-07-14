import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";

const TITLE = "Claude vs GitHub Copilot: Autocomplete vs Agent";
const DESC =
  "Claude Code and GitHub Copilot solve different problems: inline completion vs delegated engineering. Where each wins, where they overlap in 2026, and why many developers run both.";
const URL = "https://claudethings.com/comparisons/claude-vs-copilot";

export const metadata: Metadata = {
  title: `${TITLE} — ClaudeThings`,
  description: DESC,
  alternates: { canonical: "/comparisons/claude-vs-copilot" },
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
        { label: "Comparisons", href: "/comparisons" },
        { label: "Claude vs Copilot" },
      ]}
      eyebrow="Comparison"
      title={TITLE}
      meta={["Updated July 2026", "9 min read", "For working developers"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "The agent side of this comparison, from install to shipped feature.",
        },
        {
          href: "/prompts/claude-prompts-for-coding",
          title: "10 Claude Prompts for Coding",
          desc: "Debugging, review, and refactoring prompts that show the delegation model.",
        },
        {
          href: "/comparisons/claude-vs-chatgpt",
          title: "Claude vs ChatGPT",
          desc: "The general-assistant version of this question.",
        },
      ]}
    >
      <p className="intro">
        <strong>Bias disclosure:</strong> we sell kits for Claude Code, so read accordingly — but
        the core claim here isn&apos;t controversial: Claude Code and GitHub Copilot were built to
        answer different questions. Copilot asks &quot;what are you typing?&quot;; Claude Code
        asks &quot;what do you want done?&quot; Comparing them as rivals misses how they&apos;re
        actually used — often by the same developer, in the same hour.
      </p>

      <h2>Two different products (with a growing overlap)</h2>
      <p>
        <strong>GitHub Copilot</strong> is completion-first: it lives in your editor, watches you
        type, and suggests the next lines. Its unit of work is the keystroke saved. Over time
        it&apos;s grown chat, multi-file edits, and its own agent mode — and notably, GitHub lets
        you run Claude models inside it.
      </p>
      <p>
        <strong>Claude Code</strong> is delegation-first: a terminal/IDE agent that takes a task
        (&quot;add rate limiting to the API&quot;, &quot;find and fix this race condition&quot;),
        explores the repo, edits files, runs tests, and iterates until done — under a permission
        system you control. Its unit of work is the task completed.
      </p>
      <div className="cmp">
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>GitHub Copilot</th>
              <th>Claude Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Interaction model</td>
              <td>Inline suggestions while you type</td>
              <td className="us">Delegated tasks in a loop: explore → edit → run → verify</td>
            </tr>
            <tr>
              <td>Flow state</td>
              <td className="us">Zero-friction — never asks you to leave the editor</td>
              <td>Conversational; you review diffs instead of typing</td>
            </tr>
            <tr>
              <td>Multi-file work &amp; refactors</td>
              <td>Improving via agent mode</td>
              <td className="us">Core strength — repo-wide changes with test verification</td>
            </tr>
            <tr>
              <td>Debugging &amp; codebase questions</td>
              <td>Chat-based, editor-scoped</td>
              <td className="us">Reads the whole repo, runs the code, checks its hypotheses</td>
            </tr>
            <tr>
              <td>Boilerplate &amp; line-level speed</td>
              <td className="us">The category king — this is what completion is for</td>
              <td>Overkill for single lines</td>
            </tr>
            <tr>
              <td>Extensibility</td>
              <td>GitHub ecosystem, extensions</td>
              <td className="us">CLAUDE.md, skills, slash commands, subagents, MCP</td>
            </tr>
            <tr>
              <td>Where it runs</td>
              <td>Editor + github.com surfaces</td>
              <td>Terminal, IDEs, web, CI — anywhere a shell runs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Where Copilot wins</h2>
      <p>
        <strong>The inner loop.</strong> When you know exactly what you&apos;re writing and just
        want it written faster — boilerplate, tests you&apos;ve mentally drafted, API calls whose
        shape you know — completion is the right interface, and Copilot&apos;s is mature,
        fast, and everywhere. It also wins on friction: it&apos;s already in your editor, your
        company probably already licenses it, and it never asks for a workflow change. And
        because Copilot can run Claude models under the hood, &quot;Copilot vs Claude&quot; at
        the model level is increasingly a checkbox, not a war.
      </p>

      <h2>Where Claude Code wins</h2>
      <p>
        <strong>Everything bigger than a completion.</strong> The tasks that consume real
        engineering days — tracing a bug across services, refactoring with the tests green at
        every step, understanding an inherited codebase, upgrading a framework — aren&apos;t
        typing problems, so completion can&apos;t address them. An agent that explores, edits,
        executes, and verifies can. This is also where the extensibility gap shows: teams encode
        their conventions in CLAUDE.md, package their workflows as skills and slash commands, and
        wire in their tools via MCP — the agent gets <em>institutionally</em> smarter over time.
        (That layer is exactly what our <a href="/#pricing">Engineering Kit</a> ships pre-built.)
      </p>

      <h2>The actual answer: both, with a division of labor</h2>
      <p>The stable pattern we see across teams in 2026:</p>
      <ul>
        <li>
          <strong>Copilot for the keystrokes</strong> — inline completion stays on; it&apos;s
          nearly free attention-wise and pays for itself in typing saved.
        </li>
        <li>
          <strong>Claude Code for the tasks</strong> — anything with a definition of done:
          features, bugs, refactors, migrations, reviews, test coverage.
        </li>
        <li>
          <strong>The dividing question:</strong> &quot;am I about to type something I already
          know, or delegate something I want done?&quot; Completion for the former, agent for the
          latter.
        </li>
      </ul>
      <p>
        If budget forces a choice: junior-heavy teams doing well-specified work get more from
        Copilot&apos;s ubiquity; senior-heavy teams drowning in maintenance and complexity get
        more from delegation. But the combined cost is small against an engineering salary — most
        teams shouldn&apos;t be choosing.
      </p>

      <div className="callout">
        <p>
          <strong>Evaluating Claude Code?</strong> Give it a real task, not a toy:{" "}
          <a href="/blog/getting-started-with-claude-code">the getting-started guide</a> has good
          first tasks, and the <a href="/prompts/claude-prompts-for-coding">coding prompts</a>{" "}
          show the delegation style that gets senior-level output.
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Copilot has an agent mode now — doesn&apos;t that close the gap? <span className="plus">+</span>
          </summary>
          <div className="a">
            It narrows it, and it&apos;s improving fast. The differences that remain are depth of
            the agent loop (verification habits, permission model, long-session reliability) and
            the extensibility layer — skills, CLAUDE.md, MCP, subagents. Try both on a gnarly
            multi-file task in your own repo; that experiment settles it in an afternoon.
          </div>
        </details>
        <details className="q">
          <summary>
            Can I use Claude&apos;s models inside Copilot? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — GitHub offers Claude models as a backend option in Copilot. You get Claude&apos;s
            code quality in the completion interface, though not Claude Code&apos;s agent loop,
            permissions, or extensibility. Model and product are separate choices.
          </div>
        </details>
        <details className="q">
          <summary>
            What about Cursor and the other AI editors? <span className="plus">+</span>
          </summary>
          <div className="a">
            AI-native editors sit between the two poles — completion plus a built-in agent, and
            most let you pick Claude models. The taxonomy that matters is completion vs.
            delegation, not brand: whichever products you pick, you&apos;ll want one of each.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
