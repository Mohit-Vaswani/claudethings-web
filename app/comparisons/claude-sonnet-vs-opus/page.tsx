import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";

const TITLE = "Claude Sonnet vs Opus: Which Model Tier Should You Actually Use?";
const DESC =
  "Sonnet vs Opus explained without the marketing: what the Opus tier actually buys you, when Sonnet is the smarter default, cost dynamics, and a decision framework by task type.";
const URL = "https://claudethings.com/comparisons/claude-sonnet-vs-opus";

export const metadata: Metadata = {
  title: `${TITLE} — ClaudeThings`,
  description: DESC,
  alternates: { canonical: "/comparisons/claude-sonnet-vs-opus" },
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
        { label: "Sonnet vs Opus" },
      ]}
      eyebrow="Comparison"
      title={TITLE}
      meta={["Updated July 2026", "8 min read", "Applies across model generations"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/comparisons/claude-vs-chatgpt",
          title: "Claude vs ChatGPT",
          desc: "The cross-vendor version of this question.",
        },
        {
          href: "/blog/how-to-build-ai-agents-with-claude",
          title: "How to Build AI Agents with Claude",
          desc: "Where model choice meets system design.",
        },
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "Switch models per task from inside the tool.",
        },
      ]}
    >
      <p className="intro">
        Anthropic ships Claude in tiers — historically <strong>Haiku</strong> (fast and cheap),{" "}
        <strong>Sonnet</strong> (the balanced workhorse), and <strong>Opus</strong> (maximum
        capability). Specific version numbers change several times a year; the <em>shape</em> of
        the decision doesn&apos;t. This guide is about that shape, so it stays useful after the
        next release — always check anthropic.com for current models and prices.
      </p>
      <p className="intro">
        The one-sentence answer: <strong>Sonnet is the right default; Opus is the right
        escalation.</strong> The interesting question is knowing which of your tasks are
        escalation-worthy.
      </p>

      <h2>What the tiers actually trade</h2>
      <div className="cmp">
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Sonnet</th>
              <th>Opus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cost per token</td>
              <td className="us">Meaningfully cheaper — viable for high-volume work</td>
              <td>Premium pricing</td>
            </tr>
            <tr>
              <td>Speed</td>
              <td className="us">Faster responses, better for interactive loops</td>
              <td>Slower, especially with extended thinking</td>
            </tr>
            <tr>
              <td>Everyday tasks (drafts, summaries, standard code)</td>
              <td className="us">Effectively equivalent — you won&apos;t tell the difference</td>
              <td>Equivalent, at a premium</td>
            </tr>
            <tr>
              <td>Hard reasoning, ambiguity, novel problems</td>
              <td>Good</td>
              <td className="us">The gap appears here — fewer subtle mistakes</td>
            </tr>
            <tr>
              <td>Long agentic sessions (many-step tasks)</td>
              <td>Strong</td>
              <td className="us">More reliable over long horizons; recovers better from errors</td>
            </tr>
            <tr>
              <td>High-stakes single answers (architecture, tricky bugs, hard analysis)</td>
              <td>Good</td>
              <td className="us">Worth the premium when one mistake costs more than the tokens</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>The honest truth about the gap</h2>
      <p>
        On the majority of everyday work — routine code, summaries, emails, standard analysis —
        blind-testing Sonnet against Opus produces a shrug. Each new Sonnet generation absorbs
        most of what made the previous Opus special. If your workload is 90% everyday tasks,
        defaulting to Opus is buying a truck to commute.
      </p>
      <p>
        The gap is real, though, and it lives in three places:
      </p>
      <ul>
        <li>
          <strong>Depth under ambiguity.</strong> Vague requirements, conflicting constraints,
          problems with no template — Opus-tier models make fewer subtle reasoning errors and
          notice more of what you didn&apos;t say.
        </li>
        <li>
          <strong>Long-horizon reliability.</strong> In agentic work (Claude Code sessions that
          run for an hour, multi-step pipelines), small per-step error rates compound. A model
          that&apos;s 3% better per decision is dramatically better at step forty.
        </li>
        <li>
          <strong>The last 10% of hard output.</strong> Complex refactors, nuanced strategy
          memos, subtle bug diagnosis — where Sonnet gives a good answer and Opus gives the
          answer a senior specialist would.
        </li>
      </ul>

      <h2>The cost math people get wrong</h2>
      <p>
        Token prices anchor the decision, but tokens are rarely the real cost. The real costs are{" "}
        <em>your time reviewing output</em> and <em>the price of a wrong answer</em>. One workable
        heuristic:
      </p>
      <ul>
        <li>
          If a mistake costs minutes (a reworded email, a regenerated summary) → Sonnet, always.
        </li>
        <li>
          If a mistake costs hours (a misleading analysis, a subtle bug that ships) → Opus is
          cheap insurance.
        </li>
        <li>
          If the task runs thousands of times (pipelines, classification, bulk generation) →
          Sonnet or even Haiku, with Opus reserved for the failure-escalation path.
        </li>
      </ul>

      <h2>Practical setups</h2>
      <h3>In Claude Code</h3>
      <p>
        Model switching is a command away — the effective pattern is Opus-tier for planning,
        architecture, and gnarly debugging; Sonnet for the implementation grind once the plan is
        solid. Subscribers on higher tiers get Opus access within their plan limits, which makes
        the escalation nearly frictionless.
      </p>
      <h3>In the API</h3>
      <p>
        Route by task type, not by loyalty: Sonnet as default, Opus behind a flag for the requests
        your own evals show it earning. A 20-case eval on your real workload answers this question
        better than any comparison page — including this one.
      </p>
      <h3>In the chat apps</h3>
      <p>
        Pick per conversation: Opus when you&apos;re thinking hard about something once (a
        strategy, a contract, a design), Sonnet for the daily churn. If you never notice a
        difference in your work, believe your experience and keep the cheaper default.
      </p>

      <div className="callout">
        <p>
          <strong>Model choice is the smaller half.</strong> A well-prompted Sonnet beats a lazily
          prompted Opus on almost anything — see{" "}
          <a href="/blog/10-prompting-techniques-for-claude">the ten techniques</a> that matter
          more than the tier, or install them pre-packaged via the{" "}
          <a href="/#pricing">ClaudeThings kits</a>.
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            What about Haiku? <span className="plus">+</span>
          </summary>
          <div className="a">
            Haiku is the high-volume tier: classification, extraction, simple transforms, latency-
            sensitive UX. It&apos;s startlingly capable for its price, but it&apos;s a different
            question — Sonnet vs Opus is about capability ceilings; Haiku is about unit economics.
          </div>
        </details>
        <details className="q">
          <summary>
            Do version numbers change this advice? <span className="plus">+</span>
          </summary>
          <div className="a">
            The specific gap narrows and re-opens with each generation (a new Sonnet often
            matches the previous Opus), but the tier logic — cheap default, expensive escalation,
            route by cost-of-error — has survived every release so far.
          </div>
        </details>
        <details className="q">
          <summary>
            Is Opus worth it for coding specifically? <span className="plus">+</span>
          </summary>
          <div className="a">
            For long agentic sessions and architecture decisions, usually yes — reliability
            compounds. For autocomplete-adjacent work and well-specified functions, no. The
            per-task switch in Claude Code exists precisely because one answer doesn&apos;t fit.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
