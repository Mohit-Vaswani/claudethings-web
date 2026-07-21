import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import PromptCard from "../../components/PromptCard";
import { getPost } from "../blogData";

const post = getPost("7-claude-prompts-for-smarter-investing")!;
const URL = `https://agentskit.co/blog/${post.slug}`;

export const metadata: Metadata = {
  title: `${post.title} — AgentsKit`,
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
  author: { "@type": "Organization", name: "AgentsKit" },
  publisher: { "@type": "Organization", name: "AgentsKit", url: "https://agentskit.co" },
};

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Investing" }]}
      eyebrow="Applied prompts"
      title={post.title}
      meta={[post.date, post.readingTime, "Educational — not financial advice"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/prompts/claude-prompts-for-data-analysis",
          title: "10 Claude Prompts for Data Analysis",
          desc: "The profiling, hypothesis, and sanity-check prompts behind good research.",
        },
        {
          href: "/blog/10-prompting-techniques-for-claude",
          title: "10 Prompting Techniques for Claude",
          desc: "The technique layer under every prompt on this page.",
        },
        {
          href: "/prompts/claude-prompts-for-business",
          title: "10 Claude Prompts for Business",
          desc: "Strategy red-teams, pricing briefs, and decision journals.",
        },
      ]}
    >
      <div className="callout">
        <p>
          <strong>Before anything else:</strong> Claude is a research assistant, not a financial
          advisor — and neither are we. Nothing here is a recommendation to buy or sell anything.
          These prompts help you <strong>read faster, question harder, and document your own
          reasoning</strong>. Decisions, and their consequences, stay yours. Verify every number
          against primary sources; see our <a href="/disclaimer">full disclaimer</a>.
        </p>
      </div>

      <p className="intro">
        The honest case for using Claude in investing research is narrow but real: most retail
        investing mistakes aren&apos;t information problems, they&apos;re discipline problems —
        unread filings, unexamined theses, decisions made in a mood and reviewed never. A model
        that reads 200 pages without fatigue and argues against you without ego attacks exactly
        that weak spot.
      </p>
      <p className="intro">
        What Claude can&apos;t do: know today&apos;s prices (verify anything time-sensitive),
        predict returns, or want your money to grow. Use it where it&apos;s strong — comprehension,
        skepticism, and process — and keep it away from &quot;what should I buy.&quot;
      </p>

      <h2>1. The annual report distiller</h2>
      <p>
        A 10-K is 150+ pages designed to be legally complete, not readable. Claude reads all of
        it. Upload the filing (or paste sections) with this:
      </p>
      <PromptCard
        title="prompt 01 — annual report distiller"
        prompt={`Read this annual report (10-K) and distill it for a careful non-professional investor.

[attach or paste the filing]

1. How does this company actually make money? Break revenue down by segment with rough percentages.
2. What changed vs. last year — in the business itself, not just the numbers?
3. Risk factors: which 3 of the listed risks are SPECIFIC to this company (skip the boilerplate every filing has)?
4. Read the footnotes and MD&A: any changes in accounting treatment, one-time items dressed as recurring, or growing gaps between net income and cash flow?
5. What questions would a skeptical analyst ask management after reading this?

Quote the filing directly for anything important. If something is unclear or missing, say so rather than smoothing over it.`}
        note="The footnote/MD&A instruction points Claude at where filings hide things. The 'skip the boilerplate' filter on risk factors saves you from the generic litigation-and-competition list."
      />

      <h2>2. The thesis red team</h2>
      <p>
        Write down why you own (or want to own) something, then make Claude attack it. This is the
        highest-value prompt on the page.
      </p>
      <PromptCard
        title="prompt 02 — thesis red team"
        prompt={`Here is my investment thesis:
[write it out — the company, why you think it wins, your time horizon, what you paid or would pay]

Red-team it without mercy:
1. Restate my thesis in its weakest defensible form — what am I actually betting on?
2. What has to go RIGHT, in sequence, for this to work? Which link is most fragile?
3. Argue the bear case as a smart short-seller would — not strawmen, their best material.
4. What evidence, if I saw it in the next two quarters, should make me exit? Be specific enough that I can't rationalize past it.
5. What does the current price already assume? Am I paying for the optimistic scenario?

Do not reassure me. If the thesis is mostly vibes, say so.`}
        note="Pre-committing to exit evidence (step 4) is the discipline most investors lack — deciding what would change your mind BEFORE you're emotionally invested in being right."
      />

      <h2>3. The earnings call decoder</h2>
      <PromptCard
        title="prompt 03 — earnings call decoder"
        prompt={`Analyze this earnings call transcript:
[paste transcript]

1. What did management emphasize — and what did they conspicuously not mention that they discussed last quarter?
2. Decode the hedged language: list phrases like "largely on track" or "some softness" and what they likely mean.
3. Analyst Q&A: which questions did management actually answer, and which did they deflect? Deflections are data.
4. Guidance: what exactly was promised, in numbers? How does it compare to what they promised last time vs. what they delivered?
5. One-line verdict: did this call raise or lower the quality of information available to shareholders?`}
        note="Comparing what disappeared between quarters, and treating deflections as signal, is how professional listeners read calls — most retail summaries capture neither."
      />

      <h2>4. The portfolio concentration X-ray</h2>
      <PromptCard
        title="prompt 04 — concentration x-ray"
        prompt={`Here are my holdings and rough weights:
[list them — tickers/funds and % of portfolio]

Without giving buy/sell advice, X-ray the structure:
1. What are my REAL exposures once you look through the funds — by sector, geography, factor, and single-company overlap? (e.g. how many of my funds are secretly the same 7 mega-caps?)
2. What single scenario would hurt the most positions at once?
3. Where am I taking risks I'm probably not being paid for (overlap, correlation), vs. deliberate concentrated bets?
4. What questions should I be asking myself about this structure? Frame them as questions, not recommendations.`}
        note="Look-through overlap is the analysis retail portfolios most need and least get — three diversified funds are often one concentrated bet wearing three hats. The questions-not-recommendations frame keeps this as research, where it belongs."
      />

      <h2>5. The moat interrogator</h2>
      <PromptCard
        title="prompt 05 — moat interrogator"
        prompt={`Company: [name]
What I believe their competitive advantage is: [your words]

Interrogate the moat:
1. Classify the claimed advantage: network effects, switching costs, scale economics, brand, regulation, or none of the above. What's the evidence FOR the classification — pricing power, retention, margins vs. peers?
2. Who has attacked this moat in the past 5 years and what happened?
3. What technology or behavior shift would make this moat irrelevant (not weaker — irrelevant)?
4. Rate the moat: durable / eroding / narrative. Justify with observable facts, and tell me what to watch that would signal erosion early.`}
        note="Forcing the moat into a named category with observable evidence separates real structural advantages from stories. 'Narrative' as a rating option keeps the exercise honest."
      />

      <h2>6. The fee and behavior auditor</h2>
      <PromptCard
        title="prompt 06 — fee & behavior audit"
        prompt={`Audit the costs and behaviors in my investing, not my picks.

My setup: [account types, funds and their expense ratios, how often you trade, tax situation basics]
My last 5 buy/sell decisions and roughly why: [honest list]

1. Total up what I'm paying annually in expense ratios and estimated trading/tax friction. Show the 20-year compounding cost of that drag on a [portfolio size] portfolio.
2. From my 5 decisions: what behavioral patterns do you see? (chasing recent performance, selling on drawdowns, thesis drift, position sizing by conviction or by mood?)
3. Which ONE change — in cost or behavior — would statistically matter most, based on what actually drives retail underperformance?
4. Design a simple rule I could adopt to interrupt my worst pattern before it executes.`}
        note="Costs and behavior are where the research consensus says retail returns are actually won and lost. Claude computing your personal 20-year fee drag makes the abstract visceral."
      />

      <h2>7. The decision journal</h2>
      <PromptCard
        title="prompt 07 — decision journal"
        prompt={`I'm about to make this investment decision: [what and why, in your own words]

Interview me for a decision journal entry, one question at a time:
1. What's my specific expectation — over what time frame, with what confidence?
2. What information am I acting on, and what's its source and age?
3. What would make this a mistake even if the price goes my way (bad process, right outcome)?
4. Am I deciding differently than I would have a month ago? What changed — the facts or my mood?

Then write the entry: date, decision, reasoning, expected outcome, exit conditions, review date. Keep it under 150 words so I'll actually do this every time.`}
        note="The process-vs-outcome question (3) is the core of good decision hygiene. A journal Claude maintains with you turns every trade into training data for your own judgment."
      />

      <h2>The pattern behind all seven</h2>
      <p>
        None of these prompts ask Claude what to buy — that&apos;s not a question it can answer
        well, and anyone selling prompts that claim otherwise is selling something else. What they
        do is put a tireless, well-read skeptic between your impulses and your money: reading the
        filings you&apos;d skim, voicing the bear case your friends won&apos;t, and writing down
        the reasoning you&apos;d otherwise reconstruct favorably in hindsight.
      </p>
      <p>
        For the general research techniques underneath these — hypothesis-first analysis,
        sanity-checking claims, executive summaries — see the{" "}
        <a href="/prompts/claude-prompts-for-data-analysis">data analysis prompt collection</a>.
      </p>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Can Claude tell me what stocks to buy? <span className="plus">+</span>
          </summary>
          <div className="a">
            It will decline personalized investment advice, and that&apos;s correct behavior — it
            doesn&apos;t know current prices, your finances, or the future. Its genuine edge is
            comprehension and structured skepticism over documents you give it, which is what
            these prompts use.
          </div>
        </details>
        <details className="q">
          <summary>
            How current is Claude&apos;s market knowledge? <span className="plus">+</span>
          </summary>
          <div className="a">
            Claude&apos;s training has a cutoff date, and it doesn&apos;t see live prices unless
            you provide data or enable web search. Best practice: paste or attach the current
            documents you want analyzed, and independently verify any figure before acting on it.
          </div>
        </details>
        <details className="q">
          <summary>
            Is it safe to share my portfolio with Claude? <span className="plus">+</span>
          </summary>
          <div className="a">
            Anthropic&apos;s consumer and commercial products have differing data policies —
            review the one for your plan. Sharing tickers and weights (without account numbers or
            personal identifiers) is the sensible middle ground the prompts here assume.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
