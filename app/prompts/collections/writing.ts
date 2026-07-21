import type { PromptCollection } from "../promptsData";

export const writing: PromptCollection = {
  slug: "claude-prompts-for-writing",
  label: "Writing",
  icon: "✍️",
  title: "10 Claude Prompts for Writing That Doesn't Sound Like AI",
  metaTitle: "10 Claude Prompts for Writing (Copy & Paste) — AgentsKit",
  description:
    "Ten copy-paste Claude prompts for writers: first drafts with a real voice, ruthless editing, structure fixes, de-AI-ifying your text, and rewriting for a specific reader. Each prompt explains why it works.",
  intro: [
    "Claude is arguably the best writing model available — but only if you stop asking it to \"write a blog post about X.\" Generic asks produce generic prose: competent, forgettable, and instantly recognizable as AI.",
    "The prompts below treat Claude like a writing partner with a defined job: sometimes drafter, sometimes ruthless editor, sometimes the skeptical reader you don't have access to. The common thread is specificity — voice, audience, stakes, and constraints — because that's what generic AI writing lacks.",
  ],
  howToUse: [
    "Always paste an example of the voice you want (yours, or a writer you admire). Claude imitates samples far better than adjectives.",
    "Separate drafting from editing into different prompts — asking for both at once gets you a polished mediocrity.",
    "Give a real reader, not a demographic: \"my skeptical CTO\" beats \"technical audiences\".",
    "Iterate in the same conversation: Claude holds your voice and constraints across turns.",
  ],
  prompts: [
    {
      title: "The voice-matched first draft",
      prompt: `Write a first draft of [piece — e.g. "a 900-word blog post on why we killed our freemium tier"].

Audience: [who exactly, and what they already believe]
The one thing they should walk away with: [the takeaway]

Voice: match the writing sample below — sentence rhythm, vocabulary level, how it handles humor and hedging. Do NOT default to a neutral blog voice.

Writing sample:
[paste 2–4 paragraphs of yours]

Constraints:
- Open with a specific moment, number, or claim — never with a definition or "In today's world".
- No bullet lists in the body; write actual paragraphs.
- End on an implication, not a summary.`,
      note: "The pasted sample does more for voice than any list of adjectives. Banning the definition-opener and summary-ending removes the two loudest AI tells.",
    },
    {
      title: "The ruthless editor",
      prompt: `You are a ruthless line editor. Edit the piece below with the goal of cutting 30% of the words without losing a single idea.

[paste draft]

Rules:
- Kill throat-clearing, hedges ("it's worth noting"), and empty intensifiers ("very", "incredibly").
- Collapse any sentence that restates the previous one.
- Flag — but don't rewrite — any paragraph where you can't tell what I'm trying to say. Mark it [UNCLEAR: your question].
- Preserve my voice: don't smooth out deliberate fragments or informal phrasing.

Output the edited piece, then a short list of the patterns you cut most so I can stop writing them.`,
      note: "A word-count target makes editing concrete. The [UNCLEAR] convention is gold: it finds the spots where the writing problem is actually a thinking problem.",
    },
    {
      title: "The de-AI-ifier",
      prompt: `This text sounds like AI wrote it. Rewrite it to sound like a specific human with something at stake.

[paste text]

Hunt down and eliminate:
- Rule-of-three sentences ("fast, flexible, and reliable")
- Negative parallelisms ("It's not just X — it's Y")
- Words like: delve, tapestry, landscape, leverage, robust, seamless, elevate, crucial
- Every sentence that could appear in any article on this topic
- Balanced "on one hand / on the other" hedging — pick a side

Replace generalities with specifics: numbers, names, concrete scenarios. If a claim has no specific behind it, cut the claim.`,
      note: "Naming the exact patterns to remove works far better than 'make it sound human'. The last line is the real edit: AI-sounding text is usually text with nothing specific to say.",
    },
    {
      title: "The structure surgeon",
      prompt: `Diagnose the structure of this draft before touching any sentences.

[paste draft]

1. In one line each, state what job every paragraph is doing ("raises the problem", "example", "repeats para 2").
2. Identify: the actual thesis (it's often hiding in the middle), redundant paragraphs, and the point where a reader would stop reading.
3. Propose a new outline that puts the strongest material in the first 20%.
4. Tell me what's missing — the objection I haven't answered, the example the argument needs.

Do not rewrite anything yet.`,
      note: "Separating structural diagnosis from line editing mirrors how professional editors work. The paragraph-job audit reliably finds the buried lede.",
    },
    {
      title: "The skeptical reader simulation",
      prompt: `Read this as [specific skeptical reader — e.g. "a staff engineer who thinks this is marketing fluff" / "an editor at a publication that rejects 95% of pitches"].

[paste draft]

React honestly, in their voice:
1. Where did you start skimming, and why?
2. Which claims made you roll your eyes? What proof would have stopped you?
3. What's the strongest sentence in the piece? The weakest?
4. Would you share this / accept this / act on this? What would change your answer?

Don't be polite. Be the reader I'm actually afraid of.`,
      note: "Claude roleplays critics remarkably well when you give it a specific persona and permission to be harsh. This is the cheapest honest feedback you'll ever get.",
    },
    {
      title: "The opening-line generator",
      prompt: `The piece below has a weak opening. Give me 8 alternative first lines, each using a different mechanism:

1. A specific number that surprises
2. A confession or admission
3. The strongest claim in the piece, stated flat
4. A concrete scene (someone doing something)
5. The objection readers already have, voiced
6. A short declarative under 8 words
7. The ending, moved to the front
8. A question that isn't rhetorical filler

[paste piece or summary + audience]

Then mark which one you'd bet on and why.`,
      note: "Asking for eight mechanisms instead of 'a better hook' prevents Claude from giving you five versions of the same sentence.",
    },
    {
      title: "The explainer for one reader",
      prompt: `Explain [topic] to exactly one person: [describe them — e.g. "my cofounder: brilliant, non-technical, allergic to jargon, will use this in an investor meeting tomorrow"].

They need to be able to: [what they should be able to do/say afterward]
They currently believe: [their starting point or misconception]

Constraints:
- One core analogy, sustained through the piece — don't stack five different metaphors.
- Every abstraction must be followed by a concrete example within two sentences.
- Flag the places where I'm simplifying in a way an expert would object to, with a footnote.`,
      note: "Writing for one named reader with a job-to-do beats 'explain simply' every time. The expert-objection footnotes keep the simplification honest.",
    },
    {
      title: "The rewrite ladder",
      prompt: `Rewrite this paragraph at four levels, keeping the meaning identical:

[paste paragraph]

1. For a 12-year-old (short sentences, zero jargon)
2. For a smart general reader (a magazine feature)
3. For a practitioner (uses the field's real terms, respects their time)
4. In half the words of the original, for an executive summary

Then tell me: which version revealed that part of the original was actually filler?`,
      note: "The ladder exposes what's load-bearing in your writing. Whatever survives all four versions is the actual content; whatever doesn't was decoration.",
    },
    {
      title: "The title and subtitle machine",
      prompt: `Generate titles for this piece:

[paste piece or detailed summary]
Where it will live: [blog / newsletter / LinkedIn / documentation]
Readers decide to click based on: [curiosity / utility / controversy / their identity]

Give me:
- 5 utility titles (promise a specific outcome)
- 5 curiosity titles (open a gap without clickbait)
- 3 blunt titles (just say the thing)
For each, a one-line subtitle that carries the part the title had to drop.

Kill anything with a colon-and-buzzword pattern ("X: A Journey Through Y").`,
      note: "Sorting by mechanism (utility vs. curiosity vs. blunt) matches how titles actually compete for attention on different platforms.",
    },
    {
      title: "The consistency checker",
      prompt: `Check this long piece for internal consistency before I publish:

[paste full draft]

Audit:
1. Terminology: do I call the same thing by different names anywhere? List each with locations.
2. Claims: do any two statements contradict or quietly undercut each other?
3. Promises: does the intro promise anything the piece never delivers?
4. Tense, person, and formality drift between sections.
5. Numbers: do figures repeated in different places still match?

Output as a checklist with quotes, ordered by how embarrassing each would be in print.`,
      note: "Long drafts drift — especially ones written across multiple sessions. This catches the contradictions that spellcheck can't see and readers absolutely will.",
    },
  ],
  tips: [
    {
      title: "Show, don't describe, your voice",
      body: "Two paragraphs of your actual writing beats any amount of 'casual but professional, witty but not jokey'. Claude is an excellent mimic and a mediocre mind-reader.",
    },
    {
      title: "One job per prompt",
      body: "Draft, restructure, line-edit, and de-AI-ify in separate passes. Every professional editor works in passes; asking for everything at once averages the passes into mush.",
    },
    {
      title: "Ban your personal clichés",
      body: "Keep a list of the constructions you overuse (or that AI overuses) and paste it into every editing prompt. The output improves immediately and permanently.",
    },
    {
      title: "Keep the conversation going",
      body: "Claude remembers your voice sample, audience, and constraints within a conversation. Iterating in one thread beats ten cold prompts.",
    },
  ],
  faq: [
    {
      q: "Will Google penalize AI-assisted writing?",
      a: "Google's stated position is that it rewards helpful content regardless of how it's produced and penalizes content made primarily to game rankings. In practice: AI-drafted, human-edited writing with real expertise and specifics performs fine; unedited generic output performs poorly — because readers bounce off it.",
    },
    {
      q: "Why does Claude's writing sound generic sometimes?",
      a: "Because the prompt was generic. Without a voice sample, a specific reader, and constraints, Claude averages across all the writing it knows — which is the definition of generic. Every prompt on this page exists to prevent exactly that.",
    },
    {
      q: "Is Claude better than ChatGPT for writing?",
      a: "Claude has a strong reputation for prose quality, nuance, and following stylistic constraints — it's the model many professional writers reach for. The honest answer is to run your own piece through both and compare; see our Claude vs ChatGPT comparison for the fuller picture.",
    },
    {
      q: "Can I use these prompts for fiction?",
      a: "Mostly yes — the editor, skeptical-reader, structure, and opening-line prompts transfer directly. Swap 'audience' for 'reader expectations of the genre' and give Claude a sample of the narrative voice instead of a blog post.",
    },
  ],
};
