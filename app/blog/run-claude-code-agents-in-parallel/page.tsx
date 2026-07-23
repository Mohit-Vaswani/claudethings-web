import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("run-claude-code-agents-in-parallel")!;
const URL = `https://www.agentary.dev/blog/${post.slug}`;

export const metadata: Metadata = {
  title: `${post.title} — Agentary`,
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
  author: { "@type": "Organization", name: "Agentary" },
  publisher: { "@type": "Organization", name: "Agentary", url: "https://www.agentary.dev" },
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Orchestration" }]}
      eyebrow="How-to"
      title={post.title}
      meta={[post.date, post.readingTime, "For teams scaling agent use"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/best-claude-code-subagents",
          title: "The 12 Subagents Worth Setting Up First",
          desc: "The specialists your orchestrator will be delegating to.",
        },
        {
          href: "/blog/claude-code-subagents-not-working",
          title: "Why Your Subagents Aren't Working",
          desc: "Context bleed and bad delegation — fix these before parallelizing.",
        },
        {
          href: "/blog/boilerplates-are-dead-claude-code-agents",
          title: "Boilerplates Are Dead",
          desc: "How agent teams replace static SaaS templates.",
        },
      ]}
    >
      <p className="intro">
        Running multiple Claude Code agents at once is the closest thing this ecosystem has to a
        superpower: one agent refactors while another writes tests while a third updates docs. It
        is also the fastest way to burn through a token budget, because parallelism multiplies
        context — every agent pays for its own understanding of the problem. This guide covers the
        three orchestration patterns and the economics of each.
      </p>

      <h2>Why parallel agents cost more than you expect</h2>
      <p>
        A subagent doesn&apos;t share your session&apos;s context — it starts clean and rebuilds
        whatever understanding it needs by reading files itself. Spin up four agents on the same
        codebase and you pay for the codebase-reading four times. Token use scales with{" "}
        <em>agents × context each agent loads</em>, not with the amount of useful work produced.
        That&apos;s the entire cost problem, and every technique below attacks one of the two
        factors: fewer redundant agents, or less context per agent.
      </p>

      <h2>The three patterns (and when each earns its cost)</h2>
      <h3>Sequential: a pipeline, not a party</h3>
      <p>
        Implement → review → test, each stage handing a <em>summary</em> to the next. Nothing runs
        concurrently, so this is the cheapest pattern — barely more expensive than a single
        session, but each stage gets a fresh, focused context instead of one increasingly muddled
        window. Default to this. Most &quot;I need multiple agents&quot; problems are actually
        pipelines.
      </p>
      <h3>Parallel: only for truly independent work</h3>
      <p>
        Multiple agents at the same time, each in its own context. The requirement is real
        independence — separate files, separate concerns, no agent needing another&apos;s output.
        Migrating fifty components to a new API, auditing three unrelated services, researching
        four candidate libraries: parallel. Two agents editing the same module: a merge conflict
        with a token bill attached.
      </p>
      <h3>Fan-out/fan-in: research wide, decide narrow</h3>
      <p>
        Send several agents to investigate in parallel, then one agent (or your main session)
        synthesizes their reports and acts. This is the best-value pattern for research because
        the expensive part — reading lots of material — happens in disposable contexts, and only
        conclusions flow back. The critical discipline: each researcher returns a bounded report
        (say, under 500 words), not its transcript.
      </p>

      <h2>Seven rules for parallelism without the token hangover</h2>
      <ol>
        <li>
          <strong>Parallelize the work, not the thinking.</strong> One planner decides what needs
          doing; workers execute the plan. Four agents each independently &quot;figuring out the
          architecture&quot; is the most expensive way to produce four different architectures.
        </li>
        <li>
          <strong>Write briefings, not vibes.</strong> Every agent should receive the files in
          scope, the acceptance criteria, and what&apos;s out of bounds. A precise brief costs a
          paragraph and saves an agent ten files of exploratory reading — vague tasks are the #1
          source of wasted tokens.
        </li>
        <li>
          <strong>Enforce output contracts.</strong> Results flow back into a context someone pays
          for. &quot;Return a diff and a two-line summary&quot; keeps the fan-in cheap;
          unconstrained agents return essays.
        </li>
        <li>
          <strong>Match the model to the task.</strong> Subagents can specify their model. Bulk
          mechanical work — renames, format migrations, lint fixes — runs fine on a fast, cheap
          model, at a fraction of the cost. Reserve the strongest model for planning, review, and
          anything with judgment. This single lever often cuts spend by more than half.
        </li>
        <li>
          <strong>Cap the crew.</strong> Two or three well-briefed agents nearly always beat
          eight, because coordination overhead — merging, reconciling, deduplicating — grows
          faster than throughput. Add agents when tasks are independent, not when you&apos;re
          impatient.
        </li>
        <li>
          <strong>Isolate file access.</strong> Parallel agents that write must not share files.
          For heavyweight cases, git worktrees give each agent its own checkout of a separate
          branch — genuine isolation, mergeable later, no stepping on each other.
        </li>
        <li>
          <strong>Watch the meter.</strong> Check {code("/usage")} (or your API console&apos;s
          usage dashboard) after your first parallel runs, not at the end of the month. You want
          the feedback loop between &quot;pattern I tried&quot; and &quot;what it cost&quot; to be
          tight while you&apos;re learning what your workloads need.
        </li>
      </ol>

      <h2>A worked example: the three-agent feature team</h2>
      <p>A pattern that reliably works, cheap enough to run daily:</p>
      <ol>
        <li>
          <strong>Plan (main session):</strong> agree on the design and file list. This costs
          almost nothing and de-risks everything downstream.
        </li>
        <li>
          <strong>Implement (agent 1)</strong> while <strong>test-writing (agent 2)</strong> runs
          in parallel against the same agreed spec — independent outputs, no shared files.
        </li>
        <li>
          <strong>Review (agent 3, read-only, fresh context):</strong> reviews the combined diff
          with no attachment to the implementation choices. Findings return as a ranked list.
        </li>
      </ol>
      <p>
        Total overhead versus a single session: modest. Benefit: tests not biased by the
        implementation, review not biased by either, and a main session that stays clean enough to
        supervise instead of drowning in detail.
      </p>

      <div className="callout">
        <p>
          <strong>This is what the kits orchestrate for you:</strong> Agentary ships
          orchestrator agents plus sequential, parallel, and fan-out team patterns — 89 agents with
          the briefings, output contracts, and tool scoping already tuned.{" "}
          <a href="/#pricing">See the agent teams →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            How many agents can Claude Code run at once? <span className="plus">+</span>
          </summary>
          <div className="a">
            More than you should use. The practical ceiling is coordination, not the platform —
            beyond a handful of concurrent agents, merging their outputs costs more than the
            parallelism saves. Start with two or three.
          </div>
        </details>
        <details className="q">
          <summary>
            Do parallel agents hit subscription rate limits? <span className="plus">+</span>
          </summary>
          <div className="a">
            Parallel agents consume your usage allowance faster — that&apos;s arithmetic, on any
            plan. If you&apos;re hitting limits, move bulk work to cheaper models and reserve
            parallel runs for tasks where wall-clock time genuinely matters.
          </div>
        </details>
        <details className="q">
          <summary>
            Is a longer single session cheaper than subagents? <span className="plus">+</span>
          </summary>
          <div className="a">
            Often not. A bloated main context makes every subsequent message more expensive and
            the model measurably worse. Offloading research into a disposable agent context and
            keeping only conclusions is frequently the cheaper option overall — isolation is a
            cost optimization, not just a quality one.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
