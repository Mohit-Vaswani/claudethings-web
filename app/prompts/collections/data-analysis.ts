import type { PromptCollection } from "../promptsData";

export const dataAnalysis: PromptCollection = {
  slug: "claude-prompts-for-data-analysis",
  label: "Data analysis",
  icon: "📊",
  title: "10 Claude Prompts for Data Analysis That Actually Work",
  metaTitle: "10 Claude Prompts for Data Analysis (Copy & Paste) — Agentary",
  description:
    "Ten battle-tested Claude prompts for data analysis: profiling messy datasets, writing SQL, statistical sanity checks, chart selection, and turning numbers into an executive narrative. Copy, paste, and adapt.",
  intro: [
    "Claude is unusually good at data work — not because it can crunch a billion rows (it can't; your warehouse does that), but because it can reason about data: what to check first, which comparison actually answers the question, and what a number means for the person reading it.",
    "The prompts below are structured the way strong analysts think. Each one gives Claude a role, real context, a specific task, and a defined output format — the four ingredients that separate a vague answer from a useful one. Replace the [bracketed] placeholders with your own details, and paste your data (or schema) right after the prompt.",
  ],
  howToUse: [
    "Paste the actual data, schema, or query results below the prompt — Claude reasons far better over concrete rows than over descriptions of rows.",
    "If your dataset is large, paste a representative sample plus the column list. Claude can write code (Python/SQL) for the full dataset.",
    "Chain the prompts: profile first, then analyze, then visualize, then narrate. Each output feeds the next.",
    "In Claude Code or the API, these work even better with file access — point Claude at the CSV instead of pasting it.",
  ],
  prompts: [
    {
      title: "The dataset profiler",
      prompt: `You are a senior data analyst doing a first-pass profile of a new dataset.

Here is the dataset (or a sample of it):
[paste CSV sample / schema]

Profile it before any analysis:
1. What does each column appear to represent? Flag ambiguous ones.
2. Data quality issues: nulls, duplicates, impossible values, mixed types, suspicious outliers.
3. Which columns are dimensions vs. metrics?
4. What questions could this dataset credibly answer — and which questions would it NOT support?
5. The three checks you'd run before trusting any conclusion from this data.

Be specific: reference actual column names and example values.`,
      note: "Forcing a profile step before analysis catches the quality problems that silently poison conclusions. Asking what the data can't answer is what senior analysts do and juniors skip.",
    },
    {
      title: "The hypothesis-first analysis",
      prompt: `I need to answer this business question: [question, e.g. "why did signups drop 18% in June?"]

Available data: [describe tables/columns or paste sample]

Work like an analyst, not a search engine:
1. List 4–6 plausible hypotheses that could explain this, ordered by prior likelihood.
2. For each hypothesis, state exactly what pattern in the data would confirm or kill it.
3. Specify the queries/cuts needed to test each one (write them if you have the schema).
4. State what result would make you say "we don't have the data to know."

Do not conclude anything yet — this is the analysis plan.`,
      note: "Asking for hypotheses and disconfirming evidence before conclusions prevents the classic failure mode: Claude (or any analyst) rationalizing the first pattern it sees.",
    },
    {
      title: "The SQL writer with guardrails",
      prompt: `Write a [PostgreSQL / BigQuery / Snowflake] query for this request:

Request: [e.g. "monthly retention by signup cohort for the last 12 months"]

Schema:
[paste CREATE TABLE statements or column lists]

Requirements:
- Use CTEs with descriptive names, one logical step per CTE.
- Comment any non-obvious business logic.
- State every assumption you made about the schema (grain, timezone, soft-deletes, duplicates).
- List 2–3 sanity checks I should run to verify the output is right.
- If the request is ambiguous, ask me the clarifying question INSTEAD of guessing.`,
      note: "The assumptions + sanity-check requirement turns a code generator into a colleague. The 'ask instead of guessing' line is the single highest-leverage sentence in SQL prompting.",
    },
    {
      title: "The statistical sanity check",
      prompt: `Here is an analysis/claim I'm about to present:
[paste your finding, e.g. "users who enable feature X retain 2.3x better"]

And the underlying numbers:
[paste the data or summary stats]

Attack it like a skeptical reviewer:
1. Is the sample size adequate? Show the rough math.
2. Correlation vs. causation: what confounders could produce this pattern?
3. Survivorship, selection, or seasonality effects that could explain it?
4. Would this survive a segment split (by cohort, geography, plan tier)?
5. Verdict: "solid", "directionally useful", or "not supported" — and the one test that would upgrade it.`,
      note: "Inviting Claude to attack your conclusion flips it from agreeable assistant to adversarial reviewer — you get the criticism before your stakeholders deliver it.",
    },
    {
      title: "The chart chooser",
      prompt: `I need to visualize this for [audience, e.g. "the exec team"] to support this point: [the takeaway, e.g. "growth is concentrated in two regions"].

Data shape: [describe, e.g. "monthly revenue for 8 regions over 24 months"]

Recommend:
1. The single best chart type, and why it beats the two obvious alternatives.
2. What goes on each axis, what gets aggregated, what gets dropped.
3. The title written as the takeaway (a sentence, not a label).
4. Two mistakes people typically make with this chart type.

Then generate the chart code in [Python/matplotlib, plotly, or React/Recharts].`,
      note: "Anchoring the chart to a takeaway and an audience — not just data shape — is what produces charts that persuade rather than decorate.",
    },
    {
      title: "The anomaly investigator",
      prompt: `This metric moved and I need to know why: [metric, direction, magnitude, when — e.g. "checkout conversion fell from 3.1% to 2.4% starting May 14"].

Context: [product, recent changes, seasonality you know about]
Data I can pull: [tables/dimensions available]

Run a structured root-cause investigation:
1. Segment first: which cuts (device, geo, channel, browser, plan) would localize the drop? Order them by diagnostic power.
2. Timeline: what internal events (deploys, pricing, campaigns) and external events should I check against May 14?
3. Denominator check: did the metric fall because the numerator dropped or the denominator grew?
4. Give me the decision tree: "if segment X shows it, look at Y next."`,
      note: "The denominator check alone has solved a remarkable share of real-world 'metric crashes'. The decision-tree format makes the output actionable instead of a list of maybes.",
    },
    {
      title: "The cohort analysis designer",
      prompt: `Design a cohort analysis for: [question, e.g. "is our onboarding redesign improving week-4 retention?"]

Product context: [what the product is, what 'active' means, when the change shipped]

Specify precisely:
1. Cohort definition (what event, what grain — day/week/month).
2. The activity metric and its exact definition (avoid vanity definitions — justify your choice).
3. The comparison that isolates the change (pre/post cohorts, and what contaminates them).
4. How many periods until the answer is trustworthy.
5. A mock table of what the output should look like, with realistic fake numbers so I can sense-check the shape.`,
      note: "Cohort analyses fail at the definition stage, not the query stage. The mock-output trick catches misunderstandings before you burn hours on the real query.",
    },
    {
      title: "The Python analysis pair-programmer",
      prompt: `Act as my pair-programmer for exploratory data analysis in Python (pandas).

Dataset: [path or paste sample + column descriptions]
Goal: [what you want to learn]

Write a single, runnable analysis script that:
1. Loads and validates the data (assert expected columns, log rows dropped and why).
2. Runs the analysis in clearly separated, commented steps.
3. Prints intermediate results so I can verify each step, not just the ending.
4. Ends with a plain-English summary of findings printed to stdout.

Style: prefer readable over clever. No functions longer than a screen. If a step involves a judgment call (imputation, outlier handling), stop and flag it as a comment starting with # DECISION:.`,
      note: "The # DECISION: convention surfaces the silent judgment calls that make two analysts get different answers from the same data.",
    },
    {
      title: "The executive translator",
      prompt: `Turn this analysis into an executive summary:

[paste your analysis, tables, or notebook conclusions]

Audience: [e.g. "CFO — numerate, skeptical, 90 seconds of attention"]
Decision at stake: [what will be decided based on this]

Produce:
1. A one-sentence headline stating the finding (not the topic).
2. Three supporting bullets, each with a number.
3. The caveat that matters (just one — the one that could change the decision).
4. The recommendation, phrased as an action with an owner and a timeframe.

Cut everything that doesn't serve the decision. No methodology unless it changes the conclusion.`,
      note: "Naming the decision at stake is the difference between a report that gets read and one that gets skimmed. The one-caveat limit forces prioritization.",
    },
    {
      title: "The metric definition arbiter",
      prompt: `Our team disagrees about how to define this metric: [metric, e.g. "active user"]

Positions:
[summarize each camp's definition and reasoning]

Business context: [what the metric drives — goals, comp, board reporting]

Arbitrate:
1. What behavior does each definition actually incentivize? Where would each be gamed?
2. What does each definition hide? Give a concrete scenario where they'd tell opposite stories.
3. Industry norms for this metric in [industry], and where norms shouldn't apply to us.
4. Recommend one definition, one guardrail metric to watch alongside it, and the migration note for historical comparisons.`,
      note: "Metric definitions are political. Framing Claude as arbiter with incentive analysis produces the neutral memo nobody on the team could credibly write.",
    },
  ],
  tips: [
    {
      title: "Paste real data, not descriptions",
      body: "Claude reasons dramatically better over 30 concrete rows than over 'a table of customer orders'. Sample rows + column names cost you nothing and upgrade every answer.",
    },
    {
      title: "Make Claude show its checks",
      body: "Every prompt above asks for assumptions, sanity checks, or disconfirming evidence. That's not decoration — it's how you catch the 5% of answers that would otherwise mislead you.",
    },
    {
      title: "Use Claude Code for real datasets",
      body: "For files too big to paste, run Claude Code in the folder with your CSVs. It reads the files, writes and executes the pandas/SQL itself, and iterates on errors — the analysis loop closes without you copy-pasting.",
    },
    {
      title: "Keep a prompt notebook",
      body: "When a prompt produces a great analysis, save the exact wording. Teams that maintain a shared prompt library stop re-deriving the same instructions every week.",
    },
  ],
  faq: [
    {
      q: "Can Claude analyze a full CSV file?",
      a: "In the Claude apps you can upload files directly, and Claude's analysis tool can run code over them. For bigger or private datasets, use Claude Code locally — it reads files from disk and executes real Python/SQL, so nothing is size-limited by the chat window.",
    },
    {
      q: "Is Claude accurate enough for statistics?",
      a: "Claude is strong at statistical reasoning — choosing tests, spotting confounders, interpreting results. For actual computation, have it write code and run the code. The prompts above are built around that split: Claude reasons, code computes.",
    },
    {
      q: "Which Claude model should I use for data analysis?",
      a: "Use the most capable model you have access to for analysis design and interpretation, where reasoning quality dominates. Cheaper/faster models are fine for mechanical steps like reformatting output or generating boilerplate queries.",
    },
    {
      q: "How is this different from just asking 'analyze my data'?",
      a: "'Analyze my data' makes Claude guess your intent, your standards, and your output format all at once — so it hedges. These prompts pin down role, context, task, and format, which is why the answers come back specific and decision-ready.",
    },
  ],
};
