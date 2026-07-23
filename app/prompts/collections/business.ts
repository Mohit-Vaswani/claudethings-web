import type { PromptCollection } from "../promptsData";

export const business: PromptCollection = {
  slug: "claude-prompts-for-business",
  label: "Business",
  icon: "💼",
  title: "10 Claude Prompts for Business Strategy & Operations",
  metaTitle: "10 Claude Prompts for Business (Copy & Paste) — Agentary",
  description:
    "Ten practical Claude prompts for business: pressure-testing strategy, pricing decisions, meeting prep, competitive analysis, hiring scorecards, and hard emails. Built for founders, operators, and managers.",
  intro: [
    "The highest-value business use of Claude isn't writing emails faster — it's getting a tireless, well-read thinking partner for decisions you'd otherwise make alone. Strategy pressure-tests, pricing logic, negotiation prep: work that used to require a consultant, a board member, or a very patient friend.",
    "These ten prompts share one design principle: they force Claude to take a position and show its reasoning, instead of producing the balanced-but-useless summary that business questions usually get. Feed them real context — numbers, constraints, what you're actually afraid of — and they earn their place in your toolkit.",
  ],
  howToUse: [
    "Give real numbers and constraints. 'We have 8 months of runway and 2 enterprise customers' produces advice; 'we're an early-stage startup' produces platitudes.",
    "Tell Claude what you're leaning toward — it will engage with your actual decision instead of listing options you've already rejected.",
    "Ask for positions, not surveys: every prompt here demands a recommendation with reasoning.",
    "Treat outputs as a sparring partner's take, not an oracle's verdict. The value is in the arguments, which you can verify.",
  ],
  prompts: [
    {
      title: "The strategy red team",
      prompt: `Here is our current strategy:
[describe: what you sell, to whom, how you win, key bets for the next 12 months]

Key numbers: [runway/revenue/growth/team size — whatever's relevant]

Red-team it:
1. The three most likely ways this strategy fails, ranked by probability — with the early warning sign for each.
2. Which assumption, if wrong, kills the whole plan? How would we test it in 30 days for under [$X]?
3. What would a well-funded competitor do to exploit our weakest point?
4. Steelman the opposite strategy: what would a smart person do with our exact assets?
5. Your verdict: proceed, adjust, or rethink — commit to one.`,
      note: "Every ingredient here — ranked failure modes, kill assumptions, forced verdict — pushes Claude off the fence, which is where default business advice lives.",
    },
    {
      title: "The pricing decision brief",
      prompt: `Help me make a pricing decision.

Product: [what it is, who buys it, current pricing if any]
The decision: [e.g. "flat $99/mo vs. usage-based" or "should we raise prices 30%?"]
What I know: [costs, competitor prices, churn data, customer quotes — anything real]

Produce a decision brief:
1. What each option optimizes for, and what it quietly sacrifices.
2. Predicted customer reaction by segment — who churns, who shrugs, who was underpriced anyway.
3. The reversibility analysis: which choice is harder to walk back, and what that implies.
4. Recommendation with your confidence level and the data point that would change your mind.`,
      note: "The reversibility lens is the underused one — pricing mistakes differ enormously in how correctable they are, and that asymmetry should drive the choice.",
    },
    {
      title: "The meeting brutalizer",
      prompt: `I'm about to schedule this meeting:
Purpose: [why]
Attendees: [who, and their stake]
Duration: [time]

Challenge it:
1. What decision or output justifies this meeting? If none, say "this is an email" and draft the email.
2. Who on the list doesn't need to be there? Who's missing that makes it pointless?
3. Write the 5-line agenda where each item is a question to be answered, not a topic.
4. What should exist BEFORE the meeting (pre-read, data, draft) so the meeting decides instead of discusses?`,
      note: "Framing agenda items as questions to answer rather than topics to cover is the single most effective meeting fix — and Claude applies it ruthlessly when told to.",
    },
    {
      title: "The competitive teardown",
      prompt: `Analyze this competitor from public information I'll provide:

Competitor: [name]
Their materials: [paste their homepage copy, pricing page, recent announcements, job postings]
Us: [your positioning and stage]

Extract:
1. Who they're really selling to (read past the marketing to the pricing and feature gating).
2. Their strategy as revealed by hiring and announcements — where are they investing?
3. The segment they're leaving underserved, and whether it's underserved because it's unprofitable.
4. Three messages we could credibly own that they can't say — and the proof each message needs.
5. What we should NOT copy, and why it works for them but wouldn't for us.`,
      note: "Job postings and pricing pages leak strategy that homepages hide. Point Claude at primary sources and it reads them like an analyst, not a fan.",
    },
    {
      title: "The hard email",
      prompt: `Draft a difficult email for me.

Situation: [what happened — be honest, including your part in it]
Recipient: [who they are, your relationship, their likely emotional state]
What I need: [the outcome — e.g. "keep the client but reset scope expectations"]
What I must NOT do: [e.g. "admit legal fault", "burn the bridge", "grovel"]

Rules:
- Acknowledge reality in the first two sentences — no throat-clearing.
- Be direct about the hard part; be generous everywhere else.
- One clear ask or next step at the end.
- Under 180 words. Give me two versions: one warmer, one firmer.`,
      note: "The 'must not do' line prevents the two classic failure modes — over-apologizing and lawyer-speak. Two temperature variants let you calibrate against your read of the recipient.",
    },
    {
      title: "The hiring scorecard builder",
      prompt: `Build a hiring scorecard for this role before I write the job post.

Role: [title]
What broke that made us open this role: [the real trigger]
What success looks like at 12 months: [outcomes, not activities]
Team context: [size, seniority mix, what the team lacks]

Produce:
1. The 4–5 outcomes this person must deliver, each measurable.
2. For each outcome, the competency behind it and ONE interview question that actually tests it (no "tell me about a time" filler — design a work-sample or scenario question).
3. The failure profile: who looks great in interviews but fails in this specific role?
4. What we should deprioritize that similar job posts over-index on.`,
      note: "Starting from outcomes and the 'what broke' trigger produces a real scorecard instead of a wish list. The failure-profile question is what experienced hiring managers ask and job posts never do.",
    },
    {
      title: "The unit economics interrogator",
      prompt: `Interrogate my unit economics.

Business model: [how you make money]
My numbers: [CAC, LTV, gross margin, payback, churn — whatever you have, however rough]
How I calculated them: [briefly — this matters most]

1. Which of my numbers is most likely self-flattering, and what's the honest version of the calculation?
2. What's hiding in my CAC (founder time? organic mixed with paid?) and my LTV (survivorship? projected vs. observed churn)?
3. At these economics, what does scaling actually do — fix the model or amplify the losses?
4. The one metric to obsess over for the next quarter, and its target.`,
      note: "Asking which number is self-flattering — rather than 'are these good?' — matches how experienced investors actually read founder metrics.",
    },
    {
      title: "The negotiation prep",
      prompt: `Prep me for this negotiation:

Deal: [what's being negotiated]
Counterparty: [who, their situation, their pressure]
My position: [what you want, your walkaway point, your alternatives]
Their likely position: [best guess]

Build:
1. Their BATNA as they see it — what happens to THEM if this falls through?
2. The 3 concessions I can offer that are cheap for me but valuable to them (and vice versa — what should I never concede cheaply?).
3. Anchoring: who should name a number first here, and what's my opening?
4. The 5 hardest things they might say, each with a calm, prepared response.
5. My pre-commitment: the line I write down now so I don't cross it in the room.`,
      note: "Rehearsing the five hardest moments is what negotiation coaches actually do with clients. The written pre-commitment guards against the in-room concession spiral.",
    },
    {
      title: "The quarterly plan stress test",
      prompt: `Stress-test this quarterly plan:

[paste your OKRs / goals / initiative list]

Team capacity: [people, roughly how much is already committed to keep-the-lights-on]

1. Estimate the real cost of each initiative in person-weeks. Sum it. Does it fit? (It usually doesn't — show the overflow.)
2. Which goals are outcomes we influence vs. outputs we control? Flag any goal we could 'achieve' while the business gets worse.
3. Dependencies: which items secretly block each other?
4. If we could only ship the top 3, which three — and what's the argument for cutting each of the rest?
5. Rewrite the plan at 80% capacity, because something always breaks.`,
      note: "The person-week arithmetic is the confrontation most planning sessions avoid. Planning at 80% capacity is the difference between a plan and a wish.",
    },
    {
      title: "The decision journal entry",
      prompt: `Help me make and document this decision properly.

Decision: [what you're deciding]
Options: [the real candidates]
Deadline & reversibility: [when you must decide; how hard to undo]
My current lean: [what you'd pick right now and why]

Walk me through:
1. What am I optimizing for — and is that the right thing to optimize for at this stage?
2. For my leaning option: what evidence would tell me in 90 days that I chose wrong?
3. The cheapest experiment that would improve this decision, if any is worth the delay.
4. Then write the decision journal entry: context, options considered, choice, reasoning, expected outcome, review date. Keep it under 200 words so I'll actually maintain the habit.`,
      note: "The 90-day wrongness signal and the review date turn a one-off choice into a feedback loop — the practice that compounds decision quality over years.",
    },
  ],
  tips: [
    {
      title: "Feed it what you'd tell a consultant",
      body: "Claude under NDA-level context (real numbers, real fears, the political situation) performs like a $500/hr advisor. Claude with a sanitized summary performs like a business book.",
    },
    {
      title: "Demand a position",
      body: "Add 'commit to one recommendation' to any business prompt. The surveys of options you get otherwise are a way of making you do the thinking you came to delegate.",
    },
    {
      title: "Use it before the meeting, not after",
      body: "The pattern in all ten prompts: preparation. Claude's edge is letting you walk in having already rehearsed the hard questions.",
    },
    {
      title: "Verify claims that leave the building",
      body: "Anything going into a board deck, contract, or public statement gets fact-checked by you. Claude's reasoning is the product; specific external facts are your responsibility.",
    },
  ],
  faq: [
    {
      q: "Is it safe to share confidential business data with Claude?",
      a: "Anthropic's commercial terms don't train on business customers' data by default, and the API and enterprise plans have explicit data-use commitments. Check your plan's terms and your company's policy — and for regulated data, ask your counsel first, same as any SaaS tool.",
    },
    {
      q: "Can Claude replace a business consultant?",
      a: "For structured thinking, pressure-testing, and preparation — largely yes, and it's available at 11pm before the board meeting. What it can't replace is a consultant's proprietary industry data, relationships, or accountability. Use Claude for reasoning; use humans for what only humans have.",
    },
    {
      q: "How do I get Claude to stop being agreeable?",
      a: "Assign it the adversarial role explicitly ('red-team this', 'argue against me', 'be the skeptical investor') and require a ranked or committed answer. Claude follows the role faithfully — the agreeableness you've seen is a prompt problem, not a model ceiling.",
    },
    {
      q: "Which prompts work for a small business, not a startup?",
      a: "All of them — swap the vocabulary. Pricing, hiring scorecards, negotiation prep, hard emails, and the meeting brutalizer are stage-agnostic. The unit-economics prompt works for a bakery as well as a SaaS.",
    },
  ],
};
