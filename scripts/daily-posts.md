# Daily post job

Runs every morning. Writes 3–4 new blog posts for agentskit.co, opens a
single PR, and stops. **Never commit to `main` and never merge.** A human merges.

Repo: `/Users/mohitvaswani/Documents/claudekitt/claudethings-nextjs`

---

## 1. Pick the day's targets

Read `content/keyword-backlog.json`.

Take the 3–4 highest-priority entries in `targets` with `"status": "todo"`.

**Before writing, check the release feed.** If Anthropic has shipped a Claude
Code feature or model in the last 48 hours that isn't in the backlog, it
displaces the lowest-priority pick for the day. Being first on a new feature
name is the single highest-value thing this job does — those queries have real
volume and near-zero competition for about a week. Check:

- https://docs.claude.com/en/docs/claude-code/changelog
- https://github.com/anthropics/claude-code/releases
- https://www.anthropic.com/news

If you add a target this way, append it to `targets` with the new slug and a
short `angle`, so the queue stays the source of truth.

## 2. Verify before you write

**Do not describe a Claude Code feature you have not confirmed exists.** This
blog's entire value is being accurate about a fast-moving tool; one invented
flag costs more trust than four posts earn. For every factual claim about
behaviour, flags, file paths or frontmatter fields, confirm against the official
docs or the release notes. If you cannot confirm something, cut it rather than
hedging in the text.

Where a claim is genuinely version-dependent, say so in the post.

## 3. Write each post

One file: `content/blog/<slug>.mdx`. Frontmatter schema:

```yaml
---
title: "..."              # <= 60 chars where possible, primary keyword near the front
description: "..."        # 140-160 chars, reads as a sentence, not a keyword list
intro: "..."              # THE ANSWER. See below.
date: "YYYY-MM-DD"        # today
tag: "..."                # short category label, e.g. Commands, Agents, Models
icon: "..."               # one emoji
eyebrow: "..."            # Reference | Guide | Comparison | Explainer
crumb: "..."              # last breadcrumb, usually same as tag
targetKeyword: "..."      # the primary query, for tracking
related:                  # exactly 3, at least one to a free tool under /tools
  - href: "/blog/..."
    title: "..."
    desc: "..."
faq:                      # 4-5 items, feeds both the accordion and FAQPage schema
  - q: "..."
    a: "..."
---
```

Then the body in markdown, starting with `## `. **No `<Intro>` component** — the
intro lives in frontmatter. `<Callout>` is available for the one conversion
block; it takes markdown children and must not be given a wrapping paragraph.

### The rules that make these rank

1. **`intro` answers the query outright, in 40–60 words.** No throat-clearing,
   no "in this article we'll explore". Someone who reads only that paragraph
   should have their answer. This is what AI Overviews and answer engines lift,
   and it is the difference between being cited and being crawled.
2. **One page, one query.** If you catch yourself covering two distinct
   questions, that's two posts. Cannibalising your own pages is the most common
   way this kind of blog stalls.
3. **H2s are the questions people actually type.** Phrase them as questions or
   direct noun phrases, never as clever headings.
4. **FAQ items are real questions with specific answers.** Each answer must
   stand alone out of context, because that is how it gets quoted.
5. **Internal links: 3–5 in the body**, to existing posts and to the free tools
   (`/claude-token-counter`, `/claude-md-grader`, `/claude-skill-md-validator`,
   `/claude-slash-command-generator`, `/claude-hooks-builder`,
   `/mcp-config-validator`, `/claude-subagent-generator`,
   `/agents-md-converter`, `/claude-plan-calculator`). The tools are the
   strongest conversion path on the site and the best link bait — use them.
6. **Exactly one `<Callout>`**, near the end, pointing at `/#pricing`. One.
7. **1,200–1,800 words.** Long enough to be the best answer, short enough to
   have no filler. Do not pad to hit a number.
8. **House voice.** Direct, technical, opinionated, no hype. Read
   `content/blog/claude-code-commands.mdx` for the register before writing.
   Never open a sentence with "In today's fast-paced". Avoid "delve",
   "leverage" as a verb, "robust", "seamless", "game-changer".
9. **Say what not to do.** Every strong post on this site names a common mistake
   and corrects it. That section is usually what earns the link.

## 3b. The hub pages

`content/keyword-backlog.json` has a separate `hubs` array. These are different
from ordinary posts and must be treated differently.

A hub is a **living reference that is never republished, only updated**. It
accrues authority on one URL instead of splitting it across dated posts. The two
hubs are the highest-volume targets on the whole plan:

- `claude-models` — the model reference (`claude ai models` 14,800/mo,
  `claude model` 9,900, `claude models` 9,900, `latest claude model` 1,600)
- `claude-code-changelog` — versions and what changed (`claude code versions`
  2,900/mo)

Rules for hubs:

- **Build them before anything else in the queue** if their `status` is still
  `todo`. They outweigh every ordinary target.
- **Every model name, model ID, price, context window and release date must be
  verified against official Anthropic sources on the day you write or update
  it.** No recollection, no inference from older posts. If you cannot verify a
  figure, leave it out rather than guessing — a wrong price on this page is
  worse than not having the page.
- Once built, set `status: "done"` but leave `evergreen: true`. On any day when
  Anthropic ships a model or a Claude Code release, **update the relevant hub in
  the same PR** rather than writing a new post about it, and bump the post's
  `date`. The `date` field is what `dateModified` in the Article schema reads
  from, which is how Google sees the page as current.
- A hub may exceed the normal word count. It is a reference, not an essay.

## 4. Update the queue

Flip each written target to `"status": "done"`.

If fewer than 6 `todo` entries remain, refill. Use the OpenSEO MCP
(`research_keywords`, `get_search_opportunities`, `find_serp_competitors`) in
project `AgentsKit` (`0d9a7cc8-2b79-42e1-a76b-473a9fe7bd53`, US / en) and add
targets that meet all of:

- search volume >= 50/mo
- keyword difficulty <= 30
- not already covered by an existing post (check `app/blog/` folder names and
  `content/blog/*.mdx`)
- a real Claude Code / Claude / agent-tooling query, not a generic AI term

Prefer feature-surface terms (a named mechanic, flag, file or command) and
head-to-head comparisons. Those are the two formats that win here. Keep credit
use modest: one `research_keywords` call with up to 5 seeds is plenty.

## 5. Verify the build

```
npm run build
```

Must exit 0. Then confirm for each new slug that
`.next/server/app/blog/<slug>.html` contains:

- `class="intro"` and **zero** `<p><p>` nesting
- one `"@type":"Article"` and one `"@type":"FAQPage"` block
- `rel="canonical" href="https://agentskit.co/blog/<slug>"` (apex, not www)

If the build fails, fix it. Do not open a PR on a red build.

## 6. Open the PR

Note the branch you are currently on **before** branching — that is your base.

```
git rev-parse --abbrev-ref HEAD          # remember this as <base>
git checkout -b daily/YYYY-MM-DD
git add content/blog/*.mdx content/keyword-backlog.json
git commit
git push -u origin daily/YYYY-MM-DD
gh pr create --base <base>
```

If `<base>` is `main`, that is the normal case and `--base main` is correct. If
it is anything else, the MDX pipeline has not been merged to `main` yet and your
posts depend on it, so the PR **must** stack on that branch — targeting `main`
would produce a PR whose posts cannot build.

PR title: `Daily posts: <Mon DD> (<n> articles)`

PR body: one line per post — slug, target keyword, volume, KD — then a
`## Verification` section stating the build result and the per-slug schema
checks from step 5.

Commit message ends with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

PR body ends with:

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Then stop.** Do not merge, do not enable auto-merge, do not touch `main`.
Vercel builds a preview for the PR automatically; that link is how the posts get
reviewed.

## 7. If something blocks you

Open the PR with whatever is finished and say plainly in the body what is
missing and why. A short honest PR beats a padded one. If you wrote nothing,
don't open an empty PR — just report the reason.
