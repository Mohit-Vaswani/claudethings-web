import type { PromptCollection } from "../promptsData";

export const coding: PromptCollection = {
  slug: "claude-prompts-for-coding",
  label: "Coding",
  icon: "⌨️",
  title: "10 Claude Prompts for Coding, Debugging & Code Review",
  metaTitle: "10 Claude Prompts for Coding (Copy & Paste) — AgentsKit",
  description:
    "Ten engineer-grade Claude prompts: debugging with hypotheses, adversarial code review, refactoring plans, test generation that finds real bugs, architecture decisions, and legacy code archaeology.",
  intro: [
    "Claude writes good code from lazy prompts. It writes excellent code — and catches the bugs that matter — from prompts that work the way senior engineers think: hypotheses before fixes, constraints before designs, failure modes before shipping.",
    "These ten prompts encode that discipline. They're written for the chat interface and the API, and every one of them gets sharper inside Claude Code, where Claude can actually read your repo, run your tests, and verify its own claims instead of guessing at context.",
  ],
  howToUse: [
    "Paste real code, real error output, real stack traces. Precision in, precision out.",
    "State your constraints (language version, framework, style, what you can't change) — most 'bad' AI code is code written for a different context than yours.",
    "Ask for reasoning before code on anything non-trivial: design mistakes are cheaper to catch in prose.",
    "In Claude Code, replace 'here is my code' with a file path — and let it run the tests itself.",
  ],
  prompts: [
    {
      title: "The hypothesis-driven debugger",
      prompt: `Debug this with me. Do NOT propose a fix yet.

The bug: [what happens vs. what should happen]
When it started: [and what changed around then, if known]
Error output / stack trace:
[paste]

Relevant code:
[paste]

Step 1 only: list the 4–5 most likely root causes, ranked by probability given the evidence. For each: what additional evidence (log line, test, inspection) would confirm or eliminate it, cheapest evidence first.

Wait for my results before proposing any fix.`,
      note: "Separating diagnosis from fixing stops the guess-and-check spiral. Ranking by evidence cost mirrors how experienced debuggers actually triage.",
    },
    {
      title: "The adversarial code review",
      prompt: `Review this code as a skeptical senior engineer who has to maintain it at 3am during an incident.

[paste code or diff]

Context: [what it does, traffic/scale, what's downstream of it]

Review in this order:
1. Correctness: inputs or states that produce wrong behavior. Give the concrete failing input, not "might have edge cases".
2. Failure modes: what happens when the network call fails, the list is empty, the same request arrives twice?
3. Security: injection, authz gaps, secrets, unsafe deserialization — only if actually present.
4. Maintainability: what will the next person misunderstand?

Rank findings by severity. Skip style nits unless they hide bugs. If it's solid, say so — don't invent findings.`,
      note: "The 3am-maintainer frame concentrates attention on failure modes. 'Don't invent findings' matters: without it, review prompts generate noise to seem thorough.",
    },
    {
      title: "The refactoring planner",
      prompt: `I want to refactor this, but safely and incrementally.

Code: [paste, or describe the module + its worst parts]
Why now: [what pain triggered this]
Constraints: [test coverage state, deploy frequency, can't break API, etc.]

Produce a refactoring plan, not refactored code:
1. The target design in a short paragraph — what good looks like.
2. Ordered steps where EACH step leaves the code working and shippable (no big-bang rewrites).
3. For each step: risk level, and the test to add BEFORE making it.
4. The steps I should skip because their cost exceeds the pain they cure.
5. Where to stop: what "good enough" looks like so this doesn't become a rewrite.`,
      note: "Shippable-at-every-step is the core discipline of safe refactoring. Asking what to skip fights the completionism that turns refactors into rewrites.",
    },
    {
      title: "The test generator that hunts bugs",
      prompt: `Write tests for this code — but design them to FIND bugs, not to confirm it works.

[paste code]

Test framework: [jest / pytest / go test / etc.]

Cover, in priority order:
1. Boundary values: empty, one, maximum, unicode, negative, zero.
2. The error paths: every throw/return-error branch, exercised.
3. Concurrency or ordering issues if any state is shared.
4. The "two features interact" cases — the bugs unit tests usually miss.

For each test, a one-line comment: what bug it would catch. If you spot a probable bug while writing tests, STOP and report it before continuing.`,
      note: "'Tests that would catch bugs' produces different tests than 'write tests' — and the stop-and-report instruction regularly surfaces real bugs during generation.",
    },
    {
      title: "The architecture decision record",
      prompt: `Help me make an architecture decision and write the ADR.

Decision: [e.g. "queue: SQS vs. Redis streams vs. Postgres SKIP LOCKED"]
System context: [scale, team size, existing stack, ops maturity]
Requirements: [throughput, latency, durability, budget — the real numbers]

1. Kill any option that fails a hard requirement — show why.
2. Compare survivors on: operational burden (who gets paged?), failure modes, cost at 10x scale, and how hard each is to migrate AWAY from later.
3. Recommend one. State the conditions under which you'd reverse this recommendation.
4. Write the ADR: context, decision, consequences (good AND bad), revisit trigger.`,
      note: "Migration-away cost and 'who gets paged' are the criteria that decide real architecture choices — and the ones comparison blog posts omit.",
    },
    {
      title: "The legacy code archaeologist",
      prompt: `Explain this legacy code I inherited. No judgment, just archaeology.

[paste code — or in Claude Code, point at the directory]

1. What does it actually do? Walk the main flow in plain English.
2. Reconstruct the history: which parts look original vs. bolted on? What requirements can you infer from the weird parts? (Weird code usually encodes a forgotten requirement.)
3. Where are the load-bearing walls — the parts everything depends on that I must not touch casually?
4. What's genuinely dead vs. only looks dead?
5. If I must modify [the thing you need to change], what's the smallest safe intervention?`,
      note: "'Weird code encodes forgotten requirements' is the mindset that prevents the classic rewrite disaster. Claude is startlingly good at inferring intent from code fossils.",
    },
    {
      title: "The performance investigator",
      prompt: `This is slow and I want to know WHY before optimizing anything.

What's slow: [operation, current timing, target timing]
Scale: [data sizes, request rates]
Code / query:
[paste]

1. Where does the time most plausibly go? Rank the candidates (algorithmic complexity, I/O waits, N+1 queries, allocation churn, lock contention...).
2. For the top 3 candidates: the measurement that would confirm each (specific profiler, EXPLAIN ANALYZE, timing harness) — measurements first, always.
3. For the likely winner: the fix, its expected gain, and its cost in complexity.
4. Tell me plainly if the honest answer is "this is fast enough, spend your time elsewhere."`,
      note: "Measure-before-optimize is easy to preach and easy to skip. Building it into the prompt makes Claude your accountability partner instead of your premature-optimization enabler.",
    },
    {
      title: "The API designer",
      prompt: `Design the API for [feature/service] before any implementation.

Consumers: [who calls it — internal services, public devs, a frontend team]
Operations needed: [the use cases, not the endpoints]
Constraints: [REST/GraphQL/gRPC, auth model, existing conventions]

Deliver:
1. The resource model and endpoints/operations, with example requests and responses (realistic payloads, not foo/bar).
2. The hard 20%: pagination, partial failure, idempotency, versioning, rate limits — decided, not deferred.
3. Three future requirements this design should survive, and one it deliberately doesn't (and why that's fine).
4. The mistake most APIs in this domain make, and how this design avoids it.`,
      note: "Idempotency and partial failure are where API designs actually fail in production. Forcing example payloads exposes fuzzy thinking that endpoint lists hide.",
    },
    {
      title: "The security pre-flight",
      prompt: `Security review this before I ship it. Assume a motivated attacker, not a scanner.

[paste code/diff — auth flows, input handling, and anything touching money or PII are highest value]

Context: [what it protects, who the users are, internet-facing or internal]

Check specifically:
1. Input trust: every place external data reaches a query, command, path, template, or deserializer.
2. AuthN vs AuthZ: not just "is someone logged in" but "can THIS user do THIS to THIS resource?" (IDOR is the one everyone misses.)
3. Secrets, tokens, and what leaks into logs or error messages.
4. The abuse case: how would someone use this feature exactly as built to do harm?

Report: severity, the attack scenario in one sentence, the fix. No theoretical findings without a plausible path.`,
      note: "The authz-per-resource question and the abuse case catch the two vulnerability classes that automated scanners are structurally blind to.",
    },
    {
      title: "The commit narrator",
      prompt: `Turn this diff into a reviewable pull request.

[paste diff, or in Claude Code just say "the current branch vs main"]

Write:
1. PR title: imperative, under 65 characters, says what changed not how.
2. Description: the WHY in two sentences, then what changed (grouped logically, not file-by-file), then how it was tested.
3. Call out for reviewers: the risky part, the part you want scrutiny on, and any decision you want validated.
4. If this diff is really 2+ unrelated changes, say so and propose the split.`,
      note: "The 'call out the risky part' section is what separates PRs that get careful review from PRs that get rubber-stamped. The split detection fights scope creep at the source.",
    },
  ],
  tips: [
    {
      title: "Move to Claude Code for real work",
      body: "Pasting code into chat works; letting Claude read the repo, run the tests, and see the actual error output works better. The terminal (or IDE) version closes the loop these prompts are designed around.",
    },
    {
      title: "Constraints are context",
      body: "Python 3.9 vs 3.12, 'we can't add dependencies', 'this must stay backwards compatible' — one line of constraints prevents the most common category of unusable AI code.",
    },
    {
      title: "Reasoning first on anything structural",
      body: "For design, architecture, or refactoring: prose plan first, code second. A wrong plan in prose costs one message to fix; a wrong plan in 500 lines of code costs an afternoon.",
    },
    {
      title: "Make skepticism the default",
      body: "'Don't invent findings', 'say so if it's solid', 'tell me if it's fast enough' — inviting no-findings answers is what makes the real findings trustworthy.",
    },
  ],
  faq: [
    {
      q: "Which Claude model is best for coding?",
      a: "Use Anthropic's current flagship tier for complex work — architecture, debugging, refactoring — where one avoided mistake pays for the tokens. The smaller, faster tiers handle boilerplate, tests, and mechanical edits well. In Claude Code you can switch models per task.",
    },
    {
      q: "What's the difference between these prompts and Claude Code?",
      a: "These prompts are technique — they work in any Claude interface. Claude Code is the environment: it reads your files, runs commands, executes tests, and iterates. Same prompts, but grounded in your actual repo instead of pasted fragments. Our Getting Started with Claude Code guide covers the setup.",
    },
    {
      q: "Can Claude review an entire codebase?",
      a: "In chat, you're limited by what you can paste into the context window. In Claude Code, it navigates the repo like an engineer would — searching, opening files as needed — so 'review the payment module and everything that calls it' is a normal request.",
    },
    {
      q: "How do I stop Claude from rewriting code I didn't ask it to touch?",
      a: "Say so explicitly: 'change only the validation logic; leave formatting and structure alone.' Claude respects scoping instructions well — unscoped requests are read as permission to improve things.",
    },
  ],
};
