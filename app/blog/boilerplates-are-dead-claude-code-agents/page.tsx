import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("boilerplates-are-dead-claude-code-agents")!;
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

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Shipping" }]}
      eyebrow="Opinion"
      title={post.title}
      meta={[post.date, post.readingTime, "For founders and indie hackers"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/run-claude-code-agents-in-parallel",
          title: "Run a Team of Agents Without Burning Tokens",
          desc: "The orchestration patterns behind agent-first shipping.",
        },
        {
          href: "/blog/best-claude-code-subagents",
          title: "The 12 Subagents Worth Setting Up First",
          desc: "The starting roster for an agent-built SaaS.",
        },
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "From install to first shipped feature.",
        },
      ]}
    >
      <p className="intro">
        For a decade, the fastest way to ship a SaaS was to buy someone else&apos;s starting
        point: a $200–$300 boilerplate with auth, payments, and emails pre-wired. It was a rational
        trade when writing that code yourself took three weeks. That trade just stopped making
        sense — not because boilerplates got worse, but because the thing they were competing
        against changed. The alternative to a template is no longer &quot;three weeks of manual
        work.&quot; It&apos;s a team of coding agents that builds the same foundation, in your
        stack, in an afternoon.
      </p>

      <h2>What you actually buy with a boilerplate</h2>
      <p>Strip the marketing and a boilerplate is four things:</p>
      <ul>
        <li>Pre-written integration code: auth, Stripe, transactional email, a dashboard shell.</li>
        <li>Someone else&apos;s architecture and stack decisions, frozen at purchase time.</li>
        <li>A few thousand lines of code you didn&apos;t write and now own.</li>
        <li>A head start that is largest on day one and depreciates daily.</li>
      </ul>
      <p>
        The problems are familiar to anyone who&apos;s bought one. <strong>The stack is
        locked</strong> — prefer Drizzle over Prisma, or Postgres over the template&apos;s
        favorite BaaS? You&apos;re either fighting the template or abandoning half of what you
        paid for. <strong>It rots</strong> — frameworks move fast, and a template is a snapshot;
        six months of upstream churn arrives as your migration burden. <strong>It&apos;s mostly
        dead code</strong> — you use a third of it, but you maintain, secure, and deploy all of
        it. And <strong>it doesn&apos;t know your product</strong> — the moment you build anything
        differentiated, you&apos;re alone in someone else&apos;s codebase.
      </p>

      <h2>The inversion: generation beat templating</h2>
      <p>
        Boilerplates exist because integration code was expensive to write and cheap to copy. Agents
        flipped that: integration code is now cheap to <em>generate</em> — and generated code has
        properties copied code can&apos;t have. It targets <em>your</em> stack and current library
        versions instead of last year&apos;s. It includes only what you need — no dead weight to
        maintain or audit. And it arrives with an explanation: you can ask why any line exists,
        which is more than most boilerplate buyers can say about their own codebase.
      </p>
      <p>
        The honest objection: &quot;an agent might get the tricky parts wrong — webhooks, auth
        edge cases — and the boilerplate author already debugged them.&quot; True, and it&apos;s
        why the answer isn&apos;t &quot;prompt harder.&quot; It&apos;s process: the tricky parts
        get built by specialist agents with encoded checklists, reviewed by a second agent, and
        verified with tests before you trust them. The boilerplate author&apos;s hard-won
        knowledge doesn&apos;t disappear — it moves out of frozen code and into reusable
        instructions.
      </p>

      <h2>What replaces the template: a repeatable build sequence</h2>
      <ol>
        <li>
          <strong>Spec first.</strong> Plan the architecture with Claude in plan mode — stack,
          data model, integration choices. Yours, not a template author&apos;s. This hour of
          talking beats a week of un-opinionating someone else&apos;s repo.
        </li>
        <li>
          <strong>Scaffold.</strong> Framework CLIs ({"create-next-app"} and friends) still give
          you the maintained, up-to-date skeleton — that part of templating survives because
          framework authors keep it current.
        </li>
        <li>
          <strong>Build the SaaS layer with specialists.</strong> Auth, billing, email, dashboard
          — each built by an agent working from a checklist-style skill (webhook signature
          verification, idempotency, session handling), in parallel where independent.
        </li>
        <li>
          <strong>Review and verify with different agents than the ones that built.</strong> A
          read-only security reviewer on the auth and payments code; a test-writer working from
          the spec, not the implementation. This is the step that replaces &quot;the template
          author already debugged it.&quot;
        </li>
        <li>
          <strong>Encode what you learn.</strong> Every correction goes into CLAUDE.md or a skill.
          Your second product ships faster than your first — a compounding asset no template
          offers, because templates can&apos;t learn.
        </li>
      </ol>

      <h2>The real comparison</h2>
      <p>
        A boilerplate is a <em>product</em>: static, generic, depreciating. An agent setup is a{" "}
        <em>capability</em>: it builds this product, then the next one, adapts when your stack
        changes, and improves as you feed corrections back into it. The fair price comparison
        isn&apos;t $300 versus $0 — it&apos;s $300 for one frozen starting point versus a setup
        cost (time or a kit) amortized over everything you ever ship. Templates answered
        &quot;how do I avoid writing this code?&quot; Agents answer the better question:
        &quot;how do I get exactly this code, written for me, with the judgment steps still
        applied?&quot;
      </p>

      <div className="callout">
        <p>
          <strong>This thesis is our product:</strong> ClaudeThings kits are the agent-first
          replacement for the boilerplate — 89 agents, 103 skills, and 181 commands that build,
          review, and test in <em>your</em> stack, adapting to each project via CLAUDE.md instead
          of locking you into one. <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Aren&apos;t agents slower than cloning a repo? <span className="plus">+</span>
          </summary>
          <div className="a">
            Cloning is faster for the first hour. The comparison flips the moment you start
            deleting the template&apos;s blog engine you didn&apos;t want, swapping its ORM, and
            upgrading its pinned dependencies — the un-customizing work that dominates real
            boilerplate timelines. Generated code starts already customized.
          </div>
        </details>
        <details className="q">
          <summary>
            What about genuinely hard integrations like Stripe webhooks? <span className="plus">+</span>
          </summary>
          <div className="a">
            Treat them as the highest-risk code in the build: specialist agent with an encoded
            checklist, independent review agent, and tests against Stripe&apos;s test mode before
            trust. That&apos;s also how you should treat a boilerplate&apos;s webhook code —
            you&apos;ve just probably never reviewed it.
          </div>
        </details>
        <details className="q">
          <summary>
            Is there any case where a boilerplate still wins? <span className="plus">+</span>
          </summary>
          <div className="a">
            If your stack matches the template exactly, you want zero decisions, and you&apos;ll
            ship within days of purchase — a fresh, well-maintained boilerplate is still a fine
            deal. The further your product drifts from the template&apos;s defaults, the faster
            the math flips to agents.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
