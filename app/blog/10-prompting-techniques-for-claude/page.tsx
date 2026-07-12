import type { Metadata } from "next";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("10-prompting-techniques-for-claude")!;
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

function Example({ bad, good }: { bad: string; good: string }) {
  return (
    <div className="prompt-card">
      <div className="prompt-head">
        <span className="p-title">before → after</span>
      </div>
      <pre className="prompt-body">{`✗  ${bad}

✓  ${good}`}</pre>
    </div>
  );
}

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Prompting" }]}
      eyebrow="Technique"
      title={post.title}
      meta={[post.date, post.readingTime, "Works in chat, API & Claude Code"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/prompts",
          title: "The Claude Prompt Library",
          desc: "50 ready-made prompts that apply these techniques — copy and adapt.",
        },
        {
          href: "/blog/how-to-build-ai-agents-with-claude",
          title: "How to Build AI Agents with Claude",
          desc: "Where prompting technique meets system design.",
        },
        {
          href: "/comparisons/claude-vs-chatgpt",
          title: "Claude vs ChatGPT",
          desc: "How the two assistants differ — and when each wins.",
        },
      ]}
    >
      <p className="intro">
        Prompting isn&apos;t magic words — it&apos;s interface design. Claude does exactly what a
        brilliant, extremely literal new colleague would do with your request: everything you
        specified, and a guess at everything you didn&apos;t. These ten techniques, distilled from
        Anthropic&apos;s own prompt engineering documentation and thousands of hours of daily use,
        are about removing the guessing.
      </p>
      <p className="intro">
        Each comes with a before/after. Steal the pattern, not the words.
      </p>

      <h2>1. Front-load context: who, what for, what done looks like</h2>
      <p>
        The single biggest quality lever. Claude calibrates depth, tone, and assumptions from
        context you provide — without it, you get the average answer to the average version of
        your question.
      </p>
      <Example
        bad="How do I speed up this query?"
        good="Postgres 16, orders table with 40M rows, this query runs on every page load and takes 800ms. We can add indexes but can't change the schema this quarter. How do I get it under 100ms? [query + EXPLAIN output]"
      />

      <h2>2. Show examples instead of describing preferences</h2>
      <p>
        Multishot prompting — two or three examples of input → desired output — beats paragraphs of
        description for anything with a format or a voice. Claude is a world-class pattern matcher;
        feed it patterns.
      </p>
      <Example
        bad="Write release notes in a friendly but professional tone."
        good={'Write release notes matching these examples:\n"Fixed: exports over 10k rows no longer time out. (Thanks @maria for the repro.)"\n"New: dark mode. Your retinas, avenged."\nNow write notes for: [changes]'}
      />

      <h2>3. Structure long prompts with XML tags</h2>
      <p>
        When a prompt mixes instructions, data, and examples, wrap each in tags like{" "}
        <code>&lt;instructions&gt;</code>, <code>&lt;document&gt;</code>,{" "}
        <code>&lt;example&gt;</code>. Claude is specifically trained to respect this structure —
        it stops confusing your content with your commands, and you can reference sections by name
        (&quot;quote from &lt;document&gt; before answering&quot;).
      </p>

      <h2>4. Ask for reasoning before conclusions</h2>
      <p>
        For analysis, math, or judgment calls, instruct Claude to think through the problem before
        answering — or use extended thinking where available. Order matters: reasoning-then-answer
        genuinely computes; answer-then-justification rationalizes.
      </p>
      <Example
        bad="Is this contract clause risky?"
        good="Analyze this clause step by step: first what it literally obligates us to, then the scenarios where that bites, then your risk verdict (low/medium/high) with the single biggest driver. <clause>...</clause>"
      />

      <h2>5. Give it a role with stakes</h2>
      <p>
        A system prompt like &quot;you are a security engineer reviewing code before a release&quot;
        measurably shifts what Claude attends to. The trick is specificity plus stakes — a role
        with something to lose beats a costume.
      </p>
      <Example
        bad="Review this code."
        good="You are the on-call engineer who gets paged if this ships broken. Review the diff for what will actually wake you up at 3am — not style. [diff]"
      />

      <h2>6. Constrain the output format explicitly</h2>
      <p>
        If you need JSON, a table, exactly five bullets, or 'under 200 words' — say so, and show
        the shape. For the API, prefilling the start of Claude&apos;s response (e.g. an opening{" "}
        <code>{"{"}</code>) locks the format harder than any instruction.
      </p>

      <h2>7. Tell it what to do, not what to avoid</h2>
      <p>
        Negative instructions (&quot;don&apos;t be verbose&quot;) under-specify — the space of
        not-verbose is huge. Positive constraints aim the output.
      </p>
      <Example
        bad="Don't use jargon or write too much."
        good="Write 3 short paragraphs a smart non-engineer can follow. Any technical term gets a plain-English gloss in parentheses the first time."
      />

      <h2>8. Give it permission to say &quot;I don&apos;t know&quot;</h2>
      <p>
        Claude hedges toward helpfulness: asked a question, it answers. One line changes the
        contract and dramatically cuts confabulation on factual work:
      </p>
      <Example
        bad="What does clause 14.3 of this agreement say about termination?"
        good="Answer only from the attached agreement. Quote the relevant text for every claim. If it isn't covered, say 'not in the document' — that answer is more valuable to me than a guess."
      />

      <h2>9. Chain instead of cramming</h2>
      <p>
        One prompt asking for research + outline + draft + edit gets you a mediocre average of four
        tasks. Four prompts, each consuming the last one&apos;s output, get you four focused
        performances — and a chance to steer between steps. This is also the core design idea
        behind agent workflows.
      </p>

      <h2>10. Iterate on the prompt, not just the output</h2>
      <p>
        When output disappoints, the reflex is to say &quot;no, more like X.&quot; That fixes one
        output. The compounding move is asking Claude to fix the <em>instructions</em>:
      </p>
      <Example
        bad="No, shorter, and less formal. Try again."
        good="This output was too long and too formal. Rewrite MY PROMPT so that a fresh session would produce the right thing first try. Then I'll save that prompt."
      />
      <p>
        Saved, refined prompts are how individuals build leverage — and packaged into slash
        commands and skills, they&apos;re how teams do. That&apos;s literally what the{" "}
        <a href="/#pricing">ClaudeThings kits</a> are: hundreds of prompts iterated to
        reliability, installed as one-word commands.
      </p>

      <h2>The meta-technique</h2>
      <p>
        All ten reduce to one principle: <strong>Claude's output quality mirrors your input
        specificity.</strong> Vague in, average out. The good news is that specificity is a
        writing skill, not a secret — and every prompt in our{" "}
        <a href="/prompts">free prompt library</a> is a worked example of these techniques applied
        to a real job.
      </p>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Do these techniques work on other models? <span className="plus">+</span>
          </summary>
          <div className="a">
            Mostly, yes — context, examples, and chaining are universal. XML tags and response
            prefilling are Claude-specific strengths (Anthropic trains for them), so those two
            transfer least.
          </div>
        </details>
        <details className="q">
          <summary>
            Is prompt engineering still a thing as models get smarter? <span className="plus">+</span>
          </summary>
          <div className="a">
            The gimmicks died; the interface design didn&apos;t. Better models need less
            hand-holding but still can&apos;t read minds — context, constraints, and examples are
            information the model cannot invent. Specificity will outlive every model generation.
          </div>
        </details>
        <details className="q">
          <summary>
            Should I use long system prompts? <span className="plus">+</span>
          </summary>
          <div className="a">
            Long is fine; unstructured is not. Claude handles very large system prompts well when
            they&apos;re organized (XML sections, clear priorities). Put stable instructions in
            the system prompt and per-task details in the user message.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
