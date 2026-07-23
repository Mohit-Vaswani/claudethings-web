import type { Metadata } from "next";
import LegalLayout from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Disclaimer — Agentary",
  description:
    "Agentary disclaimer: educational content, no affiliation with Anthropic, no professional or financial advice, and the limits of what our guides and tools promise.",
  alternates: { canonical: "/disclaimer" },
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" updated="July 12, 2026">
      <p className="intro">
        This page sets out the limits of what the content, tools, and products on
        agentary.dev promise. It&apos;s written in plain English on purpose.
      </p>

      <h2>Independent &amp; unofficial</h2>
      <p>
        Agentary is an independent product. We are <strong>not affiliated with, endorsed by,
        or sponsored by Anthropic</strong>. &quot;Claude,&quot; &quot;Claude Code,&quot; and
        &quot;Anthropic&quot; are trademarks of Anthropic, PBC, used here only to describe
        compatibility. Nothing on this site represents Anthropic&apos;s views, roadmap, or
        pricing.
      </p>

      <h2>Educational content, not professional advice</h2>
      <p>
        Our guides, prompt collections, comparisons, and blog posts are educational material based
        on our own experience. They are <strong>not professional advice</strong> of any kind — not
        legal, financial, investment, tax, medical, or security advice. In particular:
      </p>
      <ul>
        <li>
          Content about investing (including our investing-related prompts) is for learning how to
          use AI tools for research. It is not a recommendation to buy, sell, or hold anything.
          Consult a licensed financial advisor before making investment decisions.
        </li>
        <li>
          Security-related content and tools help you find common issues; they do not guarantee
          your systems are secure, and they are not a substitute for a professional audit.
        </li>
        <li>
          AI outputs can be wrong, outdated, or misleading. Verify anything important against
          primary sources before acting on it.
        </li>
      </ul>

      <h2>Product claims &amp; results</h2>
      <p>
        The Agentary kits are prompts, skills, agents, and commands — how much value they
        produce depends on your usage, your projects, and the underlying Claude models, which we
        don&apos;t control. Counts of included components (agents, skills, commands) reflect the
        current release and may change as the product evolves. We make no guarantee of specific
        outcomes, revenue, rankings, or time savings.
      </p>

      <h2>Third-party services &amp; links</h2>
      <p>
        We link to and describe third-party products (Anthropic, GitHub, MCP servers, and others).
        Their features, pricing, and terms change without notice and are their responsibility, not
        ours. Model names, capabilities, and prices referenced in our content were accurate to the
        best of our knowledge at the stated update date of each page.
      </p>

      <h2>Free tools</h2>
      <p>
        Our free tools (like the SKILL.md validator and the security audit skill) are provided{" "}
        <strong>&quot;as is&quot;, without warranty of any kind</strong>. They run in your browser
        or your own environment; you are responsible for what you do with their output.
      </p>

      <h2>Liability</h2>
      <p>
        To the maximum extent permitted by law, Agentary and its operators are not liable for
        any loss or damage arising from your use of this site, its content, or its tools. Our{" "}
        <a href="/terms">Terms of Service</a> govern purchases and use of the paid products.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> — we read
        everything.
      </p>
    </LegalLayout>
  );
}
