import type { Metadata } from "next";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("getting-started-with-claude-code")!;
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
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: ["/og.jpg"] },
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
      eyebrow="Guide"
      title={post.title}
      meta={[post.date, post.readingTime, "For developers new to Claude Code"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/how-to-build-ai-agents-with-claude",
          title: "How to Build AI Agents with Claude",
          desc: "The agent loop, tool use, and MCP — from first principles to a working agent.",
        },
        {
          href: "/prompts/claude-prompts-for-coding",
          title: "10 Claude Prompts for Coding",
          desc: "Engineer-grade prompts for debugging, review, refactoring, and tests.",
        },
        {
          href: "/use-cases/claude-for-developers",
          title: "Claude for Developers",
          desc: "Where Claude fits in a professional development workflow.",
        },
      ]}
    >
      <p className="intro">
        Claude Code is Anthropic&apos;s agentic coding tool: Claude, running in your terminal (or
        IDE, or browser), with permission to read your files, run your commands, and edit your
        code. The pitch is simple — instead of copy-pasting snippets into a chat window, you give
        Claude the same access a new teammate would get, and it does the work where the work lives.
      </p>
      <p className="intro">
        This guide takes you from zero to a productive setup: installation, your first real
        session, the configuration that actually matters, and the habits that separate people who
        get senior-engineer output from people who get autocomplete.
      </p>

      <h2>1. Install it</h2>
      <p>Claude Code runs on macOS, Linux, and Windows. Install via npm:</p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">terminal</span>
        </div>
        <pre className="prompt-body">{`npm install -g @anthropic-ai/claude-code

cd your-project
claude`}</pre>
      </div>
      <p>
        On first run you&apos;ll authenticate with your Anthropic account — Claude Code works with
        Claude Pro/Max subscriptions or with an API key. Once you&apos;re in, you get a chat prompt
        that lives in your project directory. That directory scoping matters: Claude can see and
        touch this project, not your whole machine.
      </p>

      <h2>2. Your first session: pick a real task</h2>
      <p>
        Skip the toy demos. The fastest way to understand Claude Code is to hand it something you
        actually need done, then watch how it works. Good first tasks:
      </p>
      <ul>
        <li>&quot;Explain this codebase: what are the main modules and how do they fit together?&quot;</li>
        <li>&quot;Find where user authentication happens and walk me through the flow.&quot;</li>
        <li>&quot;This test is failing — figure out why and fix it.&quot; (paste nothing; it will find it)</li>
        <li>&quot;Add input validation to the signup endpoint, following the patterns this repo already uses.&quot;</li>
      </ul>
      <p>
        Notice what happens: Claude searches the repo, reads only the files it needs, proposes
        changes, and asks permission before running anything with side effects. You approve or
        reject each action — or grant standing permissions as trust builds. That permission system
        is the core of the tool. You can be as paranoid or as hands-off as your project deserves.
      </p>

      <h2>3. Create a CLAUDE.md — the five minutes with the highest ROI</h2>
      <p>
        {code("CLAUDE.md")} is a markdown file at your project root that Claude reads at the start
        of every session. It&apos;s where you write down what you&apos;d tell a new hire on day
        one. Run {code("/init")} and Claude will draft one from your codebase; then edit it to add
        what only you know:
      </p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">CLAUDE.md — example</span>
        </div>
        <pre className="prompt-body">{`# MyApp

Next.js 15 (App Router) + TypeScript + Postgres via Drizzle.

## Commands
- npm run dev — dev server (port 3000)
- npm run test — vitest; run before claiming anything works
- npm run db:migrate — apply migrations

## Conventions
- Server components by default; "use client" only when interactive
- All DB access goes through src/db/queries/ — never inline SQL in routes
- Error messages are user-facing: no stack traces in responses

## Gotchas
- The payments webhook (src/app/api/stripe/) is load-bearing and
  under-tested. Do not refactor it casually.`}</pre>
      </div>
      <p>
        Every instruction in this file is an instruction you never type again. When Claude does
        something wrong, don&apos;t just correct it in chat — ask yourself if the correction
        belongs in CLAUDE.md. Teams that treat this file like real documentation compound their
        setup; teams that skip it re-explain their stack every session.
      </p>

      <h2>4. Learn the four commands that matter</h2>
      <ul>
        <li>
          {code("/init")} — generates a CLAUDE.md from your codebase. Run it once per project.
        </li>
        <li>
          {code("/clear")} — wipes the conversation. Use it between unrelated tasks; a context
          window full of the last task&apos;s details makes the next task worse.
        </li>
        <li>
          {code("Esc")} — interrupts Claude mid-action. You&apos;re never a passenger; steer the
          moment it heads somewhere wrong.
        </li>
        <li>
          {code("/help")} — everything else, discoverable when you need it.
        </li>
      </ul>

      <h2>5. Extend it: skills and slash commands</h2>
      <p>
        This is where Claude Code stops being a chat tool and starts being a platform.{" "}
        <strong>Skills</strong> are folders of instructions (a {code("SKILL.md")} plus optional
        scripts) that teach Claude a repeatable capability — &quot;how we do code reviews&quot;,
        &quot;how to audit a site&apos;s security&quot;, &quot;how we write commit messages&quot;.{" "}
        <strong>Slash commands</strong> are reusable prompts you invoke by name:{" "}
        {code("/review")}, {code("/test")}, {code("/security-review")}.
      </p>
      <p>
        You can write your own — or install a library of them. Our{" "}
        <a href="/#pricing">ClaudeThings kits</a> package 89 agents, 103 skills, and 181 slash
        commands built exactly this way (and the free{" "}
        <a href="/claude-skill-md-validator">SKILL.md validator</a> lints the ones you write
        yourself).
      </p>

      <h2>6. The workflow habits that actually matter</h2>
      <h3>Plan before code on anything non-trivial</h3>
      <p>
        For multi-file changes, ask Claude to propose a plan first and critique it before letting
        it edit. Claude Code has a dedicated plan mode for exactly this. A wrong plan costs one
        message to fix; a wrong implementation costs a review cycle.
      </p>
      <h3>Make it verify its own work</h3>
      <p>
        End feature requests with &quot;run the tests and fix whatever breaks&quot; or &quot;start
        the dev server and confirm the page renders.&quot; Claude Code can execute the feedback
        loop itself — that&apos;s the difference between code that <em>looks</em> right and code
        that <em>is</em> right.
      </p>
      <h3>Commit early, keep diffs reviewable</h3>
      <p>
        Let Claude make git commits as it goes (it writes good commit messages). Small commits
        mean you can review its work like a colleague&apos;s PR instead of auditing a 40-file
        surprise.
      </p>
      <h3>Scope your asks</h3>
      <p>
        &quot;Fix the validation bug in signup&quot; beats &quot;improve the auth code.&quot;
        Claude treats vague scope as permission to be ambitious — which is occasionally wonderful
        and usually a bigger diff than you wanted.
      </p>

      <h2>7. Where people get stuck</h2>
      <ul>
        <li>
          <strong>Trusting it blindly, then swearing off it entirely.</strong> Both extremes lose.
          Treat Claude Code like a very fast mid-to-senior engineer: review the work, especially
          anything touching auth, money, or data deletion.
        </li>
        <li>
          <strong>One giant session for everything.</strong> Context bloat degrades quality.{" "}
          {code("/clear")} between tasks; one task, one conversation.
        </li>
        <li>
          <strong>Never reading the diff.</strong> The habit that catches 95% of problems is the
          one you already have: read the diff before it merges.
        </li>
        <li>
          <strong>Under-investing in CLAUDE.md.</strong> If you&apos;ve corrected the same thing
          twice, it belongs in the file.
        </li>
      </ul>

      <div className="callout">
        <p>
          <strong>Shortcut the setup:</strong> the ClaudeThings Engineering Kit ships 58 agents,
          61 skills, and 159 slash commands — code review, testing, security audits, refactoring
          workflows — installed into Claude Code with one command.{" "}
          <a href="/#pricing">See what&apos;s inside →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Do I need to be a senior engineer to use Claude Code? <span className="plus">+</span>
          </summary>
          <div className="a">
            No — but the tool amplifies judgment. Beginners get the most value using it to
            understand codebases and learn patterns; experienced engineers get the most value
            delegating implementation. Either way, the skill that matters is describing what you
            want precisely.
          </div>
        </details>
        <details className="q">
          <summary>
            Claude Code vs. the Claude chat app — when do I use which? <span className="plus">+</span>
          </summary>
          <div className="a">
            If the task involves your files, your tests, or more than one edit — Claude Code. The
            chat app is for questions, thinking, and work that doesn&apos;t live in a repo. The
            dividing line is whether the work needs hands, not just a brain.
          </div>
        </details>
        <details className="q">
          <summary>
            Is my code sent to Anthropic&apos;s training? <span className="plus">+</span>
          </summary>
          <div className="a">
            Anthropic&apos;s commercial products don&apos;t train on your data by default. Review
            the current data-usage policy for your plan tier at anthropic.com — and if you work
            somewhere with a security team, loop them in like you would for any dev tool.
          </div>
        </details>
        <details className="q">
          <summary>
            How much does it cost to run? <span className="plus">+</span>
          </summary>
          <div className="a">
            Claude Code is included with Claude Pro and Max subscriptions (with usage limits), or
            pay-as-you-go via API key. For serious daily use, a subscription is usually the
            simpler deal; check anthropic.com for current pricing.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
