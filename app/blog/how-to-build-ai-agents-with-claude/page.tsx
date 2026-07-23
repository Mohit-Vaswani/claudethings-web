import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("how-to-build-ai-agents-with-claude")!;
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

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "AI agents" }]}
      eyebrow="Deep dive"
      title={post.title}
      meta={[post.date, post.readingTime, "Code examples in TypeScript"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "The agentic coding tool — install to first shipped feature.",
        },
        {
          href: "/blog/10-prompting-techniques-for-claude",
          title: "10 Prompting Techniques for Claude",
          desc: "The system-prompt craft your agent will live or die by.",
        },
        {
          href: "/tools/claude-mcp-servers",
          title: "The Best MCP Servers for Claude",
          desc: "Give your agent hands: the connectors worth installing.",
        },
      ]}
    >
      <p className="intro">
        &quot;AI agent&quot; is the most inflated term in software right now — it gets applied to
        everything from a cron job that calls an LLM to systems that genuinely plan, act, and
        correct themselves. This guide uses the working definition Anthropic uses: an agent is{" "}
        <strong>a model using tools in a loop</strong>, where the model itself decides what to do
        next based on what happened last.
      </p>
      <p className="intro">
        That definition is worth internalizing because each part carries a design decision: which{" "}
        <em>model</em>, which <em>tools</em>, and what controls the <em>loop</em>. Get those three
        right and agents are surprisingly simple. Get them wrong and you have an expensive random
        walk. Let&apos;s build one properly.
      </p>

      <h2>First: do you actually need an agent?</h2>
      <p>
        The most useful advice in Anthropic&apos;s agent-building guidance is negative: don&apos;t
        build an agent where a workflow will do. If your task has a <em>known</em> sequence of
        steps — summarize, then classify, then route — hard-code the sequence and make one LLM
        call per step. That&apos;s a <strong>workflow</strong>: cheaper, faster, testable, and
        predictable.
      </p>
      <p>
        Agents earn their complexity when the path <em>can&apos;t</em> be known in advance:
        debugging a failing test (each finding changes the next step), researching an open-ended
        question, operating a browser, fixing a customer issue that could be one of forty things.
        The signature is branching: if step 3 depends on what step 2 discovered, you want an
        agent. If not, you want a pipeline.
      </p>

      <h2>The agent loop</h2>
      <p>Every agent — Claude Code included — is architecturally this:</p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">the loop, in pseudocode</span>
        </div>
        <pre className="prompt-body">{`messages = [system_prompt, user_task]

while true:
    response = claude(messages, tools)

    if response has tool_calls:
        results = execute(tool_calls)   # your code runs here
        messages += [response, results] # feed back what happened
    else:
        return response                 # done — Claude answered`}</pre>
      </div>
      <p>
        Claude sees the task, decides whether it needs a tool, your code executes the tool and
        returns the result, and Claude decides what that result means for the next step. All the
        intelligence lives in the model; all the <em>capability</em> lives in the tools you hand
        it. The loop is dumb glue — and it should stay that way.
      </p>

      <h2>Tools: the part you actually design</h2>
      <p>
        A tool is a function you describe to Claude in JSON Schema: name, description, parameters.
        Claude never executes anything itself — it emits a structured request, your code runs the
        function, and returns the result. Here&apos;s the minimal real thing with the Anthropic
        SDK:
      </p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">agent.ts — a minimal working agent</span>
        </div>
        <pre className="prompt-body">{`import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools = [
  {
    name: "get_order",
    description:
      "Look up an order by ID. Returns status, items, and shipping info.",
    input_schema: {
      type: "object" as const,
      properties: { order_id: { type: "string" } },
      required: ["order_id"],
    },
  },
];

async function runAgent(task: string) {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: task }];

  while (true) {
    const res = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 4096,
      system: "You are a support agent. Use tools to check facts; never guess order state.",
      tools,
      messages,
    });

    if (res.stop_reason !== "tool_use") {
      return res.content; // final answer
    }

    messages.push({ role: "assistant", content: res.content });
    const results = [];
    for (const block of res.content) {
      if (block.type === "tool_use") {
        const output = await getOrder(block.input); // your real function
        results.push({
          type: "tool_result" as const,
          tool_use_id: block.id,
          content: JSON.stringify(output),
        });
      }
    }
    messages.push({ role: "user", content: results });
  }
}`}</pre>
      </div>
      <p>
        That&apos;s a complete agent. Everything else — memory, planning, multi-agent
        orchestration — is elaboration on this loop. Three design rules that matter more than any
        framework:
      </p>
      <ul>
        <li>
          <strong>Tool descriptions are prompts.</strong> Claude chooses tools based on the
          description. &quot;Look up an order by ID&quot; with the failure modes documented beats
          a bare function signature every time.
        </li>
        <li>
          <strong>Return errors as information, not exceptions.</strong> When a tool fails, send
          the error text back into the loop — a good agent reads &quot;404: order not found&quot;
          and changes strategy. That self-correction is the whole point of the architecture.
        </li>
        <li>
          <strong>Fewer, better tools.</strong> Ten crisp tools outperform forty overlapping ones.
          If two tools confuse <em>you</em>, they confuse the model.
        </li>
      </ul>

      <h2>MCP: tools you don&apos;t have to build</h2>
      <p>
        The Model Context Protocol (MCP) is an open standard for exactly the interface above — a
        server exposes tools, any MCP-capable client (Claude Code, the Claude apps, your own agent)
        can use them. Before writing a custom tool for GitHub, Postgres, Slack, or a headless
        browser, check whether an MCP server already exists; hundreds do. We keep a curated list
        in our <a href="/tools/claude-mcp-servers">guide to Claude MCP servers</a>.
      </p>

      <h2>The fastest path: don&apos;t build the loop at all</h2>
      <p>
        If your agent&apos;s job touches code, files, or shell commands, the pragmatic move in
        2026 is to build <em>on top of</em> Claude Code rather than from scratch. It already
        ships the hardened loop: permissions, sandboxing, context management, subagents, MCP
        support. You customize it with three primitives:
      </p>
      <ul>
        <li>
          <strong>CLAUDE.md</strong> — persistent instructions the agent reads every session (your
          domain knowledge, conventions, guardrails).
        </li>
        <li>
          <strong>Skills</strong> — folders teaching repeatable capabilities, loaded on demand.
        </li>
        <li>
          <strong>Subagents</strong> — scoped workers with their own context windows and tool
          allowlists, for fan-out work like &quot;review these 12 files in parallel.&quot;
        </li>
      </ul>
      <p>
        The same machinery is available programmatically as the Claude Agent SDK — the engine of
        Claude Code as a library, loop and permissions included, for agents that need to run
        headless or inside your product.
      </p>

      <h2>Reliability: the unglamorous 80%</h2>
      <p>Getting an agent to work once is a weekend. Getting it dependable is the actual job:</p>
      <ol>
        <li>
          <strong>Stop conditions.</strong> Cap iterations, tokens, and wall-clock time. An agent
          that can loop can loop forever.
        </li>
        <li>
          <strong>Permissions by blast radius.</strong> Reads can be automatic; writes should be
          gated; deletes and payments should require a human. Claude Code&apos;s permission model
          is a good template to copy.
        </li>
        <li>
          <strong>Evals over vibes.</strong> Collect 20–50 real tasks with known-good outcomes and
          run them on every change to your prompt or tools. Agent behavior shifts in non-obvious
          ways; regression tests catch what demos hide.
        </li>
        <li>
          <strong>Log the full trajectory.</strong> When an agent fails, the failure is usually
          three steps before the visible error. Persist every message and tool result; you cannot
          debug what you didn&apos;t record.
        </li>
        <li>
          <strong>Prompt injection is real.</strong> Anything your agent reads — web pages, emails,
          file contents — can contain instructions aimed at it. Treat retrieved content as data,
          never as commands, and gate side effects accordingly.
        </li>
      </ol>

      <div className="callout">
        <p>
          <strong>Want the pre-built version?</strong> The Agentary kits are exactly this
          philosophy productized: 89 specialized agents, 103 skills, and 181 commands for
          engineering and marketing work, installed into Claude Code with one command.{" "}
          <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Which Claude model should power an agent? <span className="plus">+</span>
          </summary>
          <div className="a">
            Start with the most capable model and make it work; optimize cost later. Agent errors
            compound across loop iterations, so model quality pays off non-linearly. A common
            production pattern: flagship model for planning and recovery, a faster model for
            mechanical substeps.
          </div>
        </details>
        <details className="q">
          <summary>
            Do I need LangChain or a framework? <span className="plus">+</span>
          </summary>
          <div className="a">
            No. The loop is ~40 lines, and owning it means you understand every failure. Frameworks
            earn their place when you need their specific infrastructure (tracing, deployment,
            team conventions) — adopt one for those reasons, not because agents seem hard.
          </div>
        </details>
        <details className="q">
          <summary>
            When do I need multiple agents? <span className="plus">+</span>
          </summary>
          <div className="a">
            Later than you think. Multi-agent systems help when contexts genuinely must be
            separate (a researcher fanning out to parallel readers) or when tool allowlists should
            differ by role. Most tasks that look multi-agent are one good agent with better tools.
          </div>
        </details>
        <details className="q">
          <summary>
            How do agents remember things between sessions? <span className="plus">+</span>
          </summary>
          <div className="a">
            The model doesn&apos;t — your system does. Give the agent a memory tool (a file or
            database it reads and writes), or persist notes like Claude Code&apos;s CLAUDE.md.
            Design what gets remembered deliberately; append-only memory dumps degrade fast.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
