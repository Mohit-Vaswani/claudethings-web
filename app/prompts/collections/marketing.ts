import type { PromptCollection } from "../promptsData";

export const marketing: PromptCollection = {
  slug: "claude-prompts-for-marketing",
  label: "Marketing",
  icon: "📣",
  title: "10 Claude Prompts for Marketing That Converts",
  metaTitle: "10 Claude Prompts for Marketing (Copy & Paste) — AgentsKit",
  description:
    "Ten field-tested Claude prompts for marketers: positioning, landing pages that convert, email sequences, SEO content briefs, ad variants, and turning customer interviews into messaging. Copy and adapt.",
  intro: [
    "Marketing is where AI output quality varies most wildly — because marketing prompts are usually missing the two things marketing actually runs on: a sharply defined customer and a reason to believe. Give Claude those, and it stops producing brochure-speak.",
    "These ten prompts are built around real marketing craft: positioning before copy, customer language before cleverness, one job per asset. They work for SaaS, e-commerce, services, and personal brands — swap the placeholders and go.",
  ],
  howToUse: [
    "Paste real customer quotes wherever you have them — reviews, support tickets, sales-call notes. Customer language outperforms invented copy in almost every test.",
    "Define ONE reader per asset. Copy written for 'businesses of all sizes' converts none of them.",
    "Give Claude your actual differentiator and the proof for it. Without proof, it will generate claims — and claims without proof read as noise.",
    "Generate variants, then test. Claude's job is a strong starting field, not a guaranteed winner.",
  ],
  prompts: [
    {
      title: "The positioning sharpener",
      prompt: `Sharpen my positioning using April Dunford's framework.

Product: [what it is and does]
Customers who love us most: [who they are, and why they chose us — real quotes if you have them]
Alternatives they compare us to: [including "do nothing" and spreadsheets]
What we do that alternatives can't: [features/capabilities — be concrete]

Work through:
1. True competitive alternatives (from the customer's view, not our category's).
2. Our differentiated capabilities — and cut any that customers don't actually care about.
3. The value those capabilities enable, in customer outcomes.
4. Who cares most about that value (the segment where we win by default).
5. The market category that makes all this obvious in one sentence.
Then write the positioning statement and the 3 messages everything else should ladder up to.`,
      note: "Following an actual named framework (Dunford's) keeps the output rigorous. The 'cut what customers don't care about' step kills the feature-vanity that ruins most positioning.",
    },
    {
      title: "The landing page architect",
      prompt: `Write a landing page for [product/offer].

The ONE reader: [specific person — role, pain, what they were doing 5 minutes before landing here]
Traffic source: [where they come from — this sets what they already know]
The action: [the single conversion goal]
Proof we have: [numbers, testimonials, logos, guarantees — only what's real]

Structure:
1. Hero: headline (their outcome, their words), subhead (how + for whom), CTA.
2. Problem section that shows we understand their current painful workaround.
3. How it works — 3 steps max.
4. Proof section using ONLY the proof I gave you, placed for maximum effect.
5. Objection handling as FAQ: the 4 real reasons this reader wouldn't buy.
6. Final CTA with risk reversal.

Write actual copy, not descriptions of copy. Match sophistication to the traffic source.`,
      note: "'What were they doing 5 minutes before' produces more targeted copy than any demographic profile. Restricting proof to what's real prevents invented testimonials.",
    },
    {
      title: "The customer-language miner",
      prompt: `Mine this raw customer language for marketing gold:

[paste reviews / support tickets / sales call notes / survey answers / Reddit threads]

Extract and organize:
1. Exact phrases customers use for the problem (their words — flag anything we'd never have written ourselves).
2. The "moment of struggle" stories: what happened right before they went looking for a solution?
3. Objections and anxieties, in their words.
4. The outcome language: how do they describe success after buying?
5. Turn the 5 strongest phrases into: 2 headlines, 2 email subject lines, 1 ad hook — using their wording nearly verbatim.`,
      note: "Voice-of-customer mining is the highest-ROI marketing task Claude does. The 'we'd never have written this' flag finds the phrases that make ads feel telepathic.",
    },
    {
      title: "The email sequence builder",
      prompt: `Build a [5]-email sequence for: [goal — e.g. "trial users who haven't activated" / "post-purchase onboarding" / "cold leads from the ebook"]

Reader: [who, and their state of mind entering the sequence]
Product: [what, and the ONE action each email should drive toward]
Voice: [paste a sample email you like]

For each email:
- Trigger/timing and the job of this specific email in the sequence
- Subject line (2 options: one curiosity, one direct)
- Body under 150 words, one idea, one CTA
- The exit condition (when someone should stop getting the sequence)

Sequence logic: each email must earn the next — no "just checking in" filler. Email 3 should handle the biggest objection head-on.`,
      note: "Giving each email a distinct job and exit condition is what separates a sequence from five repetitions of the same pitch. The no-filler rule bans the emails everyone deletes.",
    },
    {
      title: "The SEO content brief",
      prompt: `Create a content brief for an article targeting: [keyword/topic]

Searcher intent: [what is this person actually trying to do when they search this?]
Our angle: [what we can say that the current top results can't — experience, data, contrarian take]
Top-ranking content right now: [paste titles/summaries of the top 3–5 results]

Brief:
1. The intent gap: what do current results fail to answer? That's our headline advantage.
2. Title (3 options) and H2 outline — ordered by searcher priority, not our narrative preference.
3. Questions to answer for featured snippets / AI answer engines (with the direct-answer sentence for each).
4. What genuinely unique thing must this article contain to deserve to rank? If we have nothing, say so — that's a "don't write it" verdict.
5. Internal links it should give and receive.`,
      note: "The 'deserve to rank' test is the honest filter most content programs skip. Optimizing for answer engines (direct-answer sentences) is table stakes now that AI reads before humans do.",
    },
    {
      title: "The ad variant machine",
      prompt: `Generate ad variants for [platform: Meta / Google / LinkedIn / X].

Offer: [what's being promoted]
Audience: [targeting — who sees this]
Proof: [the strongest specific: number, testimonial, outcome]
Winning ads so far: [paste any current winners — Claude should learn from them, not repeat them]

Give me 10 variants across distinct angles:
- 2 pain-first (the moment of struggle)
- 2 proof-first (lead with the number)
- 2 identity ("for people who...")
- 2 objection-flip (attack the reason they scroll past)
- 2 curiosity (specific, not clickbait)

For each: hook line, body (platform-appropriate length), CTA. Then predict the winner and say why — I want your reasoning, not just output.`,
      note: "Forcing distinct psychological angles prevents ten near-identical ads. The prediction at the end is surprisingly well-calibrated and makes a great testing prior.",
    },
    {
      title: "The launch announcement stack",
      prompt: `We're launching [thing]. Write the full announcement stack, one core message, every format:

The launch: [what's new, who it's for, why it matters]
The ONE takeaway everyone should remember: [single sentence]
Proof/demo: [what we can show]

Write:
1. X/Twitter thread (6–8 posts, first post must work standalone)
2. LinkedIn post (professional but human, no "I'm thrilled to announce")
3. Email to existing users (angle: what this makes possible for them, not what we did)
4. Product Hunt tagline + first-comment maker story
5. 2-sentence version for a newsletter mention

Same message, native to each format — don't just resize the same paragraph. Ban: "excited", "thrilled", "game-changer", "revolutionize", rocket emoji.`,
      note: "The banned-word list is doing real work — those five words mark announcements nobody reads. 'Native to each format' is what makes launches feel everywhere rather than copy-pasted.",
    },
    {
      title: "The pricing page psychologist",
      prompt: `Review my pricing page like a conversion specialist:

[paste pricing page copy/structure, or describe tiers and prices]

Customer context: [who buys, deal size, sales-assisted or self-serve]

Analyze:
1. Which tier is doing the anchoring, and is it anchoring in the right direction?
2. Tier naming and feature-gating: does the middle tier make the decision easy? (It should be ~70% of buyers.)
3. Where does cognitive load spike — too many rows, unclear units, "contact us" ambiguity?
4. The FUD audit: what unanswered anxiety sits next to the buy button (lock-in, migration, what happens at the limit)?
5. Three specific changes ranked by expected impact, and the one A/B test to run first.`,
      note: "Anchoring, middle-tier design, and buy-button anxiety are the three levers that actually move pricing-page conversion — this aims Claude straight at them.",
    },
    {
      title: "The case study interviewer & writer",
      prompt: `Turn this customer win into a case study.

Raw material: [interview notes / email thread / metrics — whatever exists]
Customer: [who, industry, size — and what I'm allowed to name publicly]
Reader: [the prospect persona this case study should convince]

First: list the 5 follow-up questions I should ask the customer to make this 10x stronger (missing numbers, the before-state, the moment they knew it worked).

Then write it with what we have:
- Title: their outcome with a number, not our product name
- Before: the struggle in their words
- Decision: why us over alternatives (honest, including hesitations)
- After: outcomes with numbers; the workflow that changed
- Pull quote that a salesperson would actually use
Keep it under 600 words. Mark every place where a real number would strengthen a vague claim.`,
      note: "The follow-up-questions step is the difference between a real case study and marketing fiction — it tells you what to go get. Number-markers keep the pressure on specificity.",
    },
    {
      title: "The funnel diagnostician",
      prompt: `Diagnose my funnel and tell me what to fix first.

Funnel stages & numbers: [e.g. "10k visitors → 400 signups (4%) → 120 activated (30%) → 25 paid (21%)"]
Benchmarks I know of: [if any]
What we've already tried: [so Claude doesn't suggest it again]

1. Which conversion is most below reasonable benchmarks for [business type]? Show comparative reasoning.
2. For the worst stage: the 3 most likely causes, and the fastest way to distinguish between them (session recordings? exit survey? one interview question?).
3. The math: if we fix the worst stage to benchmark, what happens to revenue vs. fixing any other stage? (Leverage, not vibes.)
4. This week's action: one diagnostic, one experiment, expected learning from each.`,
      note: "The leverage math in step 3 is what stops teams from optimizing the stage that's easiest to touch instead of the one that moves revenue.",
    },
  ],
  tips: [
    {
      title: "Customer words beat clever words",
      body: "The mining prompt isn't one of ten — it's the one to run first. Every other prompt gets better when you feed it real voice-of-customer language.",
    },
    {
      title: "One asset, one reader, one job",
      body: "Every conversion asset in this list demands a single reader and single action. When Claude's marketing output feels mushy, it's almost always because the prompt asked it to serve three audiences at once.",
    },
    {
      title: "Proof is your bottleneck, not copy",
      body: "Claude can generate infinite claims. Only you can supply the numbers, testimonials, and demos that make claims land. Gather proof first; prompt second.",
    },
    {
      title: "Ship variants, keep score",
      body: "Treat outputs as a test field. Track which angles win in your market, tell Claude the winners next time, and it compounds — the ad-variant prompt explicitly builds this loop.",
    },
  ],
  faq: [
    {
      q: "Can Claude really match my brand voice?",
      a: "Yes, if you show it rather than describe it. Paste 2–3 examples of on-brand copy plus a note about what to never do, and Claude holds the voice remarkably well within a conversation. Save the voice sample and reuse it in every prompt.",
    },
    {
      q: "Is AI-generated marketing content bad for SEO?",
      a: "Search engines penalize unhelpful content, not AI-assisted content. The SEO brief prompt above bakes in the honest test: if the article contains nothing genuinely unique, don't publish it. AI drafting + human expertise and editing is the workflow that ranks.",
    },
    {
      q: "Which prompt should a solo founder start with?",
      a: "The customer-language miner, then the positioning sharpener. Everything downstream — landing page, emails, ads — reuses those two outputs. An hour on those saves weeks of copy thrash.",
    },
    {
      q: "Can Claude run my whole marketing function?",
      a: "It can draft, analyze, and strategize at a level that replaces a lot of agency work. What it can't do alone is choose what's true about your product, gather proof, or press publish. Pair it with the AgentsKit Marketing Kit and one decisive human, and you have a function.",
    },
  ],
};
