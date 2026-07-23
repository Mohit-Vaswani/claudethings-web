/**
 * Content model + registry for /use-cases. Routed by app/use-cases/[slug]/page.tsx;
 * the index and sitemap read USE_CASES.
 */

export interface UseCasePrompt {
  title: string;
  prompt: string;
  note?: string;
}

export interface UseCase {
  slug: string;
  label: string;
  icon: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string[];
  /** "Where Claude earns its keep" — concrete capability cards. */
  fits: { title: string; body: string }[];
  /** A realistic day-in-the-life workflow, told as steps. */
  workflow: { title: string; body: string }[];
  /** Starter prompts for this role. */
  prompts: UseCasePrompt[];
  /** Recommended setup bullets. */
  setup: string[];
  faq: { q: string; a: string }[];
}

export const USE_CASES: UseCase[] = [
  {
    slug: "claude-for-developers",
    label: "Developers",
    icon: "👩‍💻",
    title: "Claude for Developers: What It's Actually Good For",
    metaTitle: "Claude for Developers — Real Workflows, Not Demos — Agentary",
    description:
      "How professional developers actually use Claude: codebase archaeology, debugging, review, test generation, and Claude Code workflows — with the starter prompts and setup that make it stick.",
    intro: [
      "Developers were Claude's first power users, and the reason is specific: software work is full of tasks that are cognitively expensive but verifiable. You can check whether the test passes, whether the refactor preserved behavior, whether the explanation matches the code. That verifiability is what makes an AI assistant safe to lean on hard.",
      "This page is the honest map: where Claude genuinely changes how development feels, where it's merely convenient, and the workflow habits that separate the two.",
    ],
    fits: [
      {
        title: "Codebase archaeology",
        body: "\"Explain how auth works in this repo\" against a codebase Claude has never seen is the closest thing to magic in the current toolchain. Onboarding to unfamiliar code — new job, inherited service, open-source dependency — compresses from days to hours.",
      },
      {
        title: "Debugging with a tireless partner",
        body: "Claude holds the whole stack trace, the code, and six hypotheses in mind simultaneously, at hour three when your working memory is gone. Used with discipline (hypotheses before fixes), it's the best rubber duck ever built.",
      },
      {
        title: "The tests you weren't going to write",
        body: "Boundary cases, error paths, the concurrency scenario you know matters but keep deferring. Test generation is Claude's highest benefit-to-risk task: worst case you review and delete; best case it finds the bug before production does.",
      },
      {
        title: "Review before the review",
        body: "A Claude pass over your diff catches the embarrassing stuff before a human sees it — and an adversarial-review prompt catches real failure modes. Your colleagues' review time gets spent on design, where it belongs.",
      },
      {
        title: "The migrations nobody wants",
        body: "Framework upgrades, API deprecations, converting test suites, typing legacy modules: high-volume, pattern-based, boring. Exactly the work delegation was invented for — and in Claude Code, it runs the tests to prove each step held.",
      },
    ],
    workflow: [
      {
        title: "Morning: the feature",
        body: "Open Claude Code in the repo. Describe the feature with constraints and ask for a plan before code. Critique the plan (or run plan mode), then let it implement while you review the diffs it proposes. It runs the test suite itself and fixes what breaks.",
      },
      {
        title: "Midday: the interrupt",
        body: "Production bug. Paste the stack trace and symptoms; ask for ranked hypotheses with the cheapest diagnostic for each — not a fix. Confirm the hypothesis with the diagnostic it suggested, then let it write the fix plus the regression test that would have caught it.",
      },
      {
        title: "Afternoon: the PR",
        body: "Before requesting review: an adversarial pass (\"review as the 3am maintainer\"), then have Claude draft the PR description with the risky part flagged for reviewers. Your human reviewers see a diff that's already survived one skeptic.",
      },
    ],
    prompts: [
      {
        title: "Codebase orientation",
        prompt: `I just inherited this codebase. Orient me:
1. Map the main modules and what each owns — where does a request enter and exit?
2. Which parts look load-bearing and under-tested? (I must not break these casually.)
3. What conventions does this code follow that I should imitate?
4. What would you refactor first, and what should be left alone despite being ugly?`,
        note: "Run in Claude Code so it can actually read the repo instead of guessing from your description.",
      },
      {
        title: "Design-first feature",
        prompt: `I need to build: [feature]
Constraints: [stack, patterns this repo uses, what you can't change]

Before writing ANY code: propose the design — files touched, data flow, edge cases you'll handle, and the one decision you're least sure about. I'll approve or push back, then we implement.`,
        note: "The 'least sure about' question surfaces the risky decision while it's still cheap to change.",
      },
      {
        title: "The failing test",
        prompt: `This test fails and I don't know why:
[test + failure output]

List the possible causes ranked by likelihood, with the fastest check for each. Don't propose a fix until we've confirmed a cause — I'll run the checks and report back.`,
        note: "Diagnosis-before-fix prevents the plausible-looking patch that hides the real bug.",
      },
    ],
    setup: [
      "Claude Code in the terminal or IDE — the chat window is for questions; the repo is where the work is.",
      "A real CLAUDE.md: commands, conventions, gotchas. Five minutes now, repaid every session.",
      "Skills and slash commands for your repeated workflows — /review, /test, /security-review. Write your own or install the Agentary Engineering Kit (58 agents, 61 skills, 159 commands).",
      "A habit: read every diff. The tool is a very fast colleague, not a compiler.",
    ],
    faq: [
      {
        q: "Will Claude make me a worse engineer?",
        a: "It makes deliberate engineers faster and careless ones more prolific. The skills that atrophy are the ones you delegate blindly; the ones that compound are specification, review, and design — which is where senior value always lived anyway.",
      },
      {
        q: "Chat vs. Claude Code — which do I need?",
        a: "If the task touches your files or needs verification (tests, builds), Claude Code. Conceptual questions, quick syntax, thinking out loud — chat is fine. Most developers end up using Code for 80% of real work.",
      },
      {
        q: "How do teams adopt this without chaos?",
        a: "Shared CLAUDE.md files in each repo, a shared library of skills/commands so quality is consistent, and a norm that AI-assisted diffs get the same review as human ones. The teams that struggle are the ones with no conventions for it at all.",
      },
    ],
  },
  {
    slug: "claude-for-data-scientists",
    label: "Data scientists",
    icon: "🔬",
    title: "Claude for Data Scientists: From Messy CSV to Defensible Finding",
    metaTitle: "Claude for Data Scientists — Real Workflows — Agentary",
    description:
      "How data scientists use Claude across the real lifecycle: profiling messy data, pandas and SQL pair-programming, statistical sanity checks, literature-grade skepticism, and stakeholder translation.",
    intro: [
      "Data science has a dirty secret: most of the job isn't modeling, it's everything around modeling — understanding messy data, writing glue code, checking assumptions, and explaining findings to people who will make decisions with them. Claude is strongest in exactly that surrounding 80%.",
      "The mental model that works: Claude reasons, code computes. Let it design analyses, write the pandas and SQL, and interrogate your conclusions — and make everything numerical run as actual code, which Claude Code executes and iterates on itself.",
    ],
    fits: [
      {
        title: "First contact with messy data",
        body: "Profiling a new dataset — what the columns mean, what's suspicious, what questions it can support — is a conversation, not a script. Claude does in minutes the skeptical first pass that separates analysts who get burned from those who don't.",
      },
      {
        title: "Pandas/SQL pair programmer",
        body: "The daily grind of groupbys, window functions, reshapes, and joins is where Claude saves the most raw time. It writes idiomatic code against your actual schema and — in Claude Code — runs it, sees the error, and fixes it without you.",
      },
      {
        title: "Statistical conscience",
        body: "Sample size, confounders, multiple comparisons, survivorship: Claude is an excellent skeptical reviewer of your own findings before they ship. 'Attack this conclusion' is worth more than any single analysis it writes.",
      },
      {
        title: "Methods sparring partner",
        body: "\"Should this be a mixed-effects model or is clustering the errors enough?\" Claude discusses methods like a well-read colleague — including the practical tradeoffs papers omit. You still decide; you just decide better-argued.",
      },
      {
        title: "The stakeholder translation layer",
        body: "Turning a notebook into the three sentences a VP will act on is a skill orthogonal to analysis — and Claude is elite at it. Findings that die in slide decks are findings that didn't happen.",
      },
    ],
    workflow: [
      {
        title: "Monday: new dataset lands",
        body: "Point Claude Code at the files. Profile pass: schema inference, quality issues, what the data can and can't answer. You correct its misreadings — that dialogue IS the documentation nobody ever writes.",
      },
      {
        title: "Tuesday–Wednesday: the analysis",
        body: "Hypothesis-first: list explanations, define what would confirm or kill each, then write the queries. Claude drafts each analysis step as runnable, printed-intermediate code you can verify — not a black-box notebook cell.",
      },
      {
        title: "Thursday: the attack",
        body: "Before writing up: 'Here's my finding and the data — attack it as a skeptical reviewer.' Fix what survives fixing. What doesn't survive wasn't a finding.",
      },
      {
        title: "Friday: the memo",
        body: "Claude turns the notebook into a one-page decision memo: headline finding, three numbers, the one caveat that matters, recommendation with an owner. The analysis gets used instead of admired.",
      },
    ],
    prompts: [
      {
        title: "The data interview",
        prompt: `Here's a sample of a dataset I don't trust yet:
[paste sample + column names]

Interview this data: what does each column claim to be, where would you expect lies (nulls coded as zeros, timezone chaos, duplicate grains), and what three checks should I run before believing any aggregate built on it?`,
        note: "Framing data as an unreliable witness sets the right prior for everything downstream.",
      },
      {
        title: "Methods consult",
        prompt: `Question I'm answering: [question]
Data I have: [structure, size, how collected]
My planned approach: [method]

Consult: is this method right for this data-generating process? What assumption am I most likely violating, how would I check it, and what's the pragmatic fallback if it fails? Cite the standard reference for anything non-obvious.`,
        note: "The data-generating-process framing pushes past 'which test' into whether the inference is valid at all.",
      },
      {
        title: "Finding stress test",
        prompt: `My finding: [claim + effect size]
Evidence: [paste the numbers/analysis]

Stress test before I present it: sample adequacy, confounders that could produce this without my explanation, whether it survives obvious segment splits, and what a hostile reviewer says in the first two minutes. Verdict: ship, caveat, or kill.`,
        note: "'Ship, caveat, or kill' forces the triage decision the analysis actually exists to inform.",
      },
    ],
    setup: [
      "Claude Code pointed at your data directory — it reads the CSVs/parquet, writes and executes the pandas itself, and iterates on errors.",
      "The analysis tool in claude.ai for lighter-weight file exploration when you're not at a terminal.",
      "A methods CLAUDE.md: your stack (pandas/polars, plotting lib), your conventions (how you handle nulls, significance thresholds), your warehouse dialect.",
      "The data-analysis prompt collection — profiling, hypothesis, and translation prompts ready to paste.",
    ],
    faq: [
      {
        q: "Can Claude do the actual statistics?",
        a: "It reasons about statistics excellently and computes via code it writes. Never accept mental arithmetic on real data — the prompts here all route computation through pandas/SQL, which is the correct division of labor.",
      },
      {
        q: "Is my proprietary data safe to analyze this way?",
        a: "With Claude Code, data stays on your machine and only what enters the conversation goes to the API — and commercial terms exclude training on it by default. For regulated data, involve your security team, and prefer schemas + samples over full dumps in prompts.",
      },
      {
        q: "Will it replace data scientists?",
        a: "It replaces the parts that were always overhead: glue code, boilerplate EDA, first-draft writeups. Judgment about what to measure, whether the inference is valid, and what the org should do about it — that's the job, and it's untouched.",
      },
    ],
  },
  {
    slug: "claude-for-product-managers",
    label: "Product managers",
    icon: "🧭",
    title: "Claude for Product Managers: The Leverage Is in the Writing",
    metaTitle: "Claude for Product Managers — Real Workflows — Agentary",
    description:
      "How PMs use Claude for the work that actually consumes the week: PRDs that survive engineering review, user-feedback synthesis, prioritization math, stakeholder communication, and sharper product thinking.",
    intro: [
      "Product management runs on documents and synthesis: PRDs, strategy memos, user-research readouts, the endless translation between engineering, design, and the business. That's not the fun part of the job — but it's most of the job, and it's precisely the work Claude does at a staff-PM level when prompted like one.",
      "The pattern across everything on this page: Claude doesn't decide what to build. It makes your thinking legible faster, pressure-tests it before others do, and turns raw customer noise into structure you can act on.",
    ],
    fits: [
      {
        title: "Feedback synthesis at scale",
        body: "500 support tickets, 40 sales-call notes, a quarter of NPS verbatims — pasted in, clustered by underlying job-to-be-done rather than surface keyword, with representative quotes attached. A week of intern work in twenty minutes, and better organized.",
      },
      {
        title: "PRDs that survive engineering review",
        body: "Claude drafts the spec, but its higher value is adversarial: 'find the underspecified edge cases an engineer will ask about' catches the gaps before sprint planning does — empty states, permissions, failure modes, migrations.",
      },
      {
        title: "Prioritization with the politics removed",
        body: "Score the backlog against stated criteria, surface the items where scores and gut disagree, and articulate the case for cutting things. Claude has no pet features and no stakeholder to please — use that.",
      },
      {
        title: "The translation layer",
        body: "The same decision explained to engineering (tradeoffs), execs (bets and numbers), sales (what to promise), and customers (what changed) — four documents, one source of truth, native tone for each.",
      },
      {
        title: "Strategy sparring",
        body: "Red-team the roadmap, steelman the competitor's approach, war-game 'what does the market leader do if we ship this?' The thinking partner every PM wants and few get.",
      },
    ],
    workflow: [
      {
        title: "Monday: the synthesis",
        body: "Dump the week's customer signal (tickets, calls, reviews) into Claude. Cluster by job-to-be-done, quantify, attach quotes. The output feeds the priority discussion instead of the loudest-voice anecdote.",
      },
      {
        title: "Wednesday: the spec",
        body: "Draft the PRD with Claude from your bullet points, then flip it adversarial: unhandled edge cases, unstated assumptions, the questions engineering will ask. Fix on paper — where fixes are free.",
      },
      {
        title: "Friday: the comms",
        body: "One decision, four artifacts: eng brief, exec summary, sales enablement note, changelog entry. Claude drafts all four from the PRD; you fact-check the promises before they ship.",
      },
    ],
    prompts: [
      {
        title: "Feedback synthesizer",
        prompt: `Here is raw user feedback from [sources]:
[paste it — more is better]

Synthesize:
1. Cluster by underlying user need, not keyword. Name each cluster by the job the user was trying to do.
2. For each: frequency, severity (blocks work vs. annoys), representative verbatim quote.
3. What are users asking for vs. what problem they actually have? Flag any cluster where the popular request is probably the wrong fix.
4. The three questions I should investigate next, given what's here.`,
        note: "The request-vs-problem split (3) is the PM craft most feedback pipelines flatten away.",
      },
      {
        title: "PRD adversary",
        prompt: `Review this PRD as a skeptical tech lead seeing it for the first time:
[paste PRD]

1. Every edge case and failure mode left unspecified — empty states, permissions, concurrent edits, what happens to existing data.
2. Requirements that are actually solutions in disguise (spec says HOW where it should say WHAT).
3. What's unmeasurable in the success criteria as written?
4. The question you'd ask in sprint planning that this document can't answer.`,
        note: "Cheaper to be embarrassed by Claude on Wednesday than by your tech lead on Monday.",
      },
      {
        title: "The cut list",
        prompt: `Our capacity this quarter: [rough person-weeks]
The candidate list: [features with one-line descriptions and rough sizes]
Strategy context: [what the company must be true by year-end]

1. Score each against strategy contribution vs. cost. Show your reasoning, not just numbers.
2. Draw the cut line at 80% of capacity. Argue FOR cutting each item below it — the strongest honest case.
3. Which cut will generate the loudest internal objection, and what's the response that respects the objector?`,
        note: "Making Claude argue for the cuts produces the language you'll need in the meeting where they're contested.",
      },
    ],
    setup: [
      "Claude with Projects (claude.ai) — one project per product area with your strategy docs, past PRDs, and personas loaded as context.",
      "A voice-and-standards doc: how your org writes specs, what a good success metric looks like, banned vagueness ('improve UX').",
      "Pipe in real data: exports from your support tool, call transcripts, NPS verbatims. Synthesis quality tracks input volume.",
      "For PM + growth work together, the Agentary Marketing Kit covers the messaging half: positioning, launch copy, email sequences.",
    ],
    faq: [
      {
        q: "Can Claude talk to customers for me?",
        a: "No — and beware anything that promises it. What it does brilliantly: prep your interview guide, then synthesize the transcripts afterward. The conversation itself is the part of the job that was never overhead.",
      },
      {
        q: "Will engineers respect an AI-drafted PRD?",
        a: "They'll respect a complete, unambiguous PRD and resent a vague one — authorship doesn't enter into it. The adversarial-review step is what makes AI-drafted specs consistently more complete than rushed human ones.",
      },
      {
        q: "How is this different from just using ChatGPT?",
        a: "Claude's long context (whole research corpora, full PRD histories) and its writing quality are the practical differences PMs notice. See our Claude vs ChatGPT comparison for the honest breakdown.",
      },
    ],
  },
  {
    slug: "claude-for-students",
    label: "Students",
    icon: "🎓",
    title: "Claude for Students: Learn Faster Without Learning Less",
    metaTitle: "Claude for Students — Study Workflows That Don't Backfire — Agentary",
    description:
      "How to use Claude as a student without hollowing out your education: Socratic tutoring, feedback on your drafts, exam generation from your notes, research assistance — and where the academic-integrity line actually is.",
    intro: [
      "Every student now has access to a tutor that knows every subject, never tires, and never judges a 2am question. Whether that makes you dramatically better educated or quietly worse depends entirely on one distinction: using Claude to generate understanding versus using it to generate deliverables.",
      "This page is the honest playbook: the study workflows where Claude compounds your learning, the integrity line and how to stay on the right side of it, and the specific prompts that make Claude teach instead of answer.",
    ],
    fits: [
      {
        title: "The tutor who never gets impatient",
        body: "Stuck on eigenvectors, supply curves, or the subjunctive? Claude explains at exactly your level, re-explains from a different angle when you don't get it, and answers the 'wait, why?' questions you'd be embarrassed to ask in office hours.",
      },
      {
        title: "Feedback on YOUR work",
        body: "The highest-integrity, highest-value use: write the draft yourself, then get essay feedback like a generous TA — argument gaps, unsupported claims, structure problems. You revise. Your writing improves instead of your prompt-writing.",
      },
      {
        title: "Exam simulation from your notes",
        body: "Paste your lecture notes; get practice problems, oral-exam questions, and 'explain it back to me' drills. Retrieval practice is the highest-evidence study technique in cognitive science, and Claude generates unlimited material for it.",
      },
      {
        title: "Reading dense material",
        body: "A 40-page paper or a dense textbook chapter becomes a conversation: summary first, then interrogate it — 'why does the method require assumption X?' Reading with a knowledgeable partner beats highlighting alone.",
      },
      {
        title: "Research navigation",
        body: "Scoping a topic, structuring a literature review, stress-testing your thesis statement. (With one hard rule: Claude can misremember citations — verify every source exists before it enters your bibliography.)",
      },
    ],
    workflow: [
      {
        title: "Before class: pre-load",
        body: "Ten minutes: 'Explain the key ideas of [tomorrow's topic] simply, and what confusion to watch for.' Lectures land differently when they're your second exposure.",
      },
      {
        title: "After class: the Feynman loop",
        body: "Explain the lecture back to Claude from memory, and have it grade the explanation — what you got wrong, what you skipped. This is active recall, the technique that actually builds retention.",
      },
      {
        title: "Before the exam: simulate",
        body: "Claude generates exams from your syllabus and notes. Take them cold, under time. Wrong answers become the study list; right answers stop consuming review time.",
      },
      {
        title: "For the paper: scaffold, don't outsource",
        body: "Brainstorm angles with Claude, argue your thesis against it, write alone, then bring the draft back for critique. Every step strengthens your thinking; none of it puts someone else's words under your name.",
      },
    ],
    prompts: [
      {
        title: "Socratic mode",
        prompt: `I'm learning [topic] for [course]. Do NOT lecture me. Teach Socratically:
1. Ask me one question at a time to find the edge of what I understand.
2. When I'm wrong, don't correct me — ask the question that makes me see it.
3. Escalate difficulty as I get things right.
4. Every 10 minutes, have me summarize — and grade my summary honestly.`,
        note: "Turns Claude from an answer machine into a tutor. The struggle this preserves is where learning physically happens.",
      },
      {
        title: "The TA critique",
        prompt: `Here's my draft essay for [assignment + prompt]:
[paste YOUR draft]

Critique like a rigorous, fair TA — do not rewrite anything:
1. Is my thesis actually arguable, or a fact dressed up?
2. Weakest link in the argument chain — where does a skeptic get off the train?
3. Which claims lack support, and what KIND of evidence each needs?
4. Grade it against the rubric, then tell me the one revision worth the most points.`,
        note: "'Do not rewrite' is the integrity line built into the prompt. The feedback loop is yours to close.",
      },
      {
        title: "Exam generator",
        prompt: `Here are my notes for [course, topic list]:
[paste notes/syllabus]

Build me a practice exam matching this course's real style: [format — problem sets / essays / MCQ].
Include: 2 questions testing the concepts I'll most likely confuse with each other, 1 that combines two topics, and 1 harder than the real exam will be. Answer key at the end, with the misconception each wrong answer represents.`,
        note: "The confusable-concepts questions target exactly what exams target. Grading your errors by misconception turns review from rereading into repair.",
      },
    ],
    setup: [
      "Claude's free tier covers serious studying; Pro earns its cost around thesis or finals season with longer sessions and file uploads.",
      "One conversation (or Project) per course — Claude keeps your level and syllabus in context all semester.",
      "Read your institution's AI policy and each syllabus's rules — they differ per course, and 'nobody told me' has stopped working as a defense.",
      "For CS students: Claude Code on your own projects is the fastest way to learn how software is actually built — see the developer use case.",
    ],
    faq: [
      {
        q: "Is using Claude cheating?",
        a: "Depends what you use it for and what your course allows. Tutoring, feedback on your drafts, and practice generation are study techniques. Submitting its words or solutions as yours is plagiarism under most policies. The internal test: are you building understanding or avoiding it?",
      },
      {
        q: "Will professors know if I use AI?",
        a: "Detectors are unreliable in both directions, but experienced graders notice voice shifts and suspiciously frictionless prose — and oral follow-ups expose hollow submissions instantly. The workflows on this page leave nothing to detect: the thinking and words are yours.",
      },
      {
        q: "Can Claude solve my problem sets?",
        a: "Often yes — which is exactly the trap. A solved problem set you didn't struggle through is negative study time; the exam will find you. Use Socratic mode on hard problems: hints and checks, not solutions.",
      },
      {
        q: "Are Claude's citations trustworthy?",
        a: "Treat every citation as unverified until you've found the actual source. Claude can conflate or misremember references. It's excellent at helping you understand and organize sources you provide — that's the reliable research workflow.",
      },
    ],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
