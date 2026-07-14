import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("how-to-write-a-claude-code-skill-that-triggers")!;
const URL = `https://claudethings.com/blog/${post.slug}`;

export const metadata: Metadata = {
  title: `${post.title} — ClaudeThings`,
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
  author: { "@type": "Organization", name: "ClaudeThings" },
  publisher: { "@type": "Organization", name: "ClaudeThings", url: "https://claudethings.com" },
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Skills" }]}
      eyebrow="How-to"
      title={post.title}
      meta={[post.date, post.readingTime, "For skill authors"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/claude-skill-md-validator",
          title: "Free SKILL.md Validator",
          desc: "Paste your SKILL.md and get instant feedback on frontmatter and triggering.",
        },
        {
          href: "/blog/best-claude-code-skills",
          title: "The Best Claude Code Skills to Install in 2026",
          desc: "A curated shortlist of skills worth having — installable in one command.",
        },
        {
          href: "/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
          title: "Skills vs Subagents vs Slash Commands vs MCP",
          desc: "When a skill is the right primitive — and when it isn't.",
        },
      ]}
    >
      <p className="intro">
        The most common complaint about Claude Code skills isn&apos;t that they&apos;re hard to
        write — it&apos;s that they never fire. You write a careful SKILL.md, ask Claude to do
        exactly the thing it covers, and watch it improvise from scratch instead. Nine times out of
        ten the skill body is fine and the problem is one field: the description. This guide covers
        how triggering actually works, and how to write skills that reliably activate.
      </p>

      <h2>How skill triggering actually works</h2>
      <p>
        Skills use progressive disclosure. Claude does not read your whole skill library — at the
        start of a session it sees only each skill&apos;s {code("name")} and {code("description")}{" "}
        from the YAML frontmatter. When a request comes in, Claude compares the task against those
        descriptions and loads the full SKILL.md only when one matches.
      </p>
      <p>
        This has a blunt implication: <strong>the description is not documentation — it is the
        trigger.</strong> Claude decides whether to load your skill based on those one or two
        sentences alone. The 400 lines of expertise below the frontmatter play no part in the
        decision. A brilliant skill with a vague description is invisible.
      </p>

      <h2>The anatomy of a SKILL.md</h2>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">.claude/skills/api-conventions/SKILL.md</span>
        </div>
        <pre className="prompt-body">{`---
name: api-conventions
description: REST API conventions for this codebase. Use when
  creating or modifying API endpoints, routes, controllers, or
  request/response handling — covers validation, error format,
  auth middleware, and naming.
---

# API Conventions

## Endpoint checklist
1. Validate input with zod schemas in src/schemas/
2. Errors use the ApiError class — never raw strings
...`}</pre>
      </div>
      <p>
        The {code("name")} must be lowercase letters, numbers, and hyphens (max 64 characters).
        The {code("description")} has a hard budget (around 1024 characters) — but the real budget
        is attention, so aim for one to three dense sentences.
      </p>

      <h2>The description formula: what + when</h2>
      <p>Every reliable description answers two questions:</p>
      <ul>
        <li>
          <strong>What does this skill do?</strong> One clause, concrete.
        </li>
        <li>
          <strong>When should it be used?</strong> The trigger conditions, phrased in the words a
          user would actually type.
        </li>
      </ul>
      <p>Compare:</p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">before → after</span>
        </div>
        <pre className="prompt-body">{`# ❌ Never fires
description: Helps with PDFs.

# ❌ Fires at the wrong times
description: A comprehensive document processing solution
  for enterprise workflows.

# ✅ Fires reliably
description: Extract text and tables from PDF files, fill
  PDF forms, merge or split documents. Use when the user
  mentions PDFs, forms, or document extraction.`}</pre>
      </div>
      <p>
        The third version works because it contains the actual vocabulary of the task —
        &quot;PDF&quot;, &quot;forms&quot;, &quot;merge&quot;, &quot;extract&quot;. Claude matches
        your description against the user&apos;s request, so the description should sound like the
        requests it&apos;s meant to catch.
      </p>

      <h2>Five reasons skills don&apos;t trigger (in order of frequency)</h2>
      <ol>
        <li>
          <strong>Vague description.</strong> &quot;Helps with data&quot; matches everything, so it
          effectively matches nothing. Fix: name the file types, verbs, and domain words.
        </li>
        <li>
          <strong>Missing &quot;use when&quot; clause.</strong> The skill says what it does but not
          when to reach for it. Fix: add explicit trigger phrasing — &quot;Use when the user asks
          to…&quot; followed by realistic requests.
        </li>
        <li>
          <strong>Written in first person or marketing voice.</strong> Descriptions are read by
          the model in third person. &quot;I can help you with spreadsheets!&quot; matches worse
          than &quot;Reads, edits, and creates .xlsx spreadsheets.&quot;
        </li>
        <li>
          <strong>Overlapping skills.</strong> Two skills with similar descriptions compete, and
          the wrong one wins — or neither does. Fix: give each skill a distinct territory and name
          the boundary in both descriptions (&quot;for Word documents, not PDFs&quot;).
        </li>
        <li>
          <strong>Broken frontmatter.</strong> Bad YAML (tabs, unquoted colons, missing{" "}
          {code("---")} fences) means the skill silently fails to load at all. Fix: lint it — our
          free <a href="/claude-skill-md-validator">SKILL.md validator</a> catches exactly this.
        </li>
      </ol>

      <h2>Writing the body: instructions for a colleague, not an essay</h2>
      <p>
        Once triggering works, the body determines whether the skill helps. Principles that hold
        up:
      </p>
      <ul>
        <li>
          <strong>Keep SKILL.md under ~500 lines.</strong> Move deep reference material into
          separate files in the skill folder and link them — Claude reads them on demand.
          Progressive disclosure applies inside the skill too.
        </li>
        <li>
          <strong>Prefer checklists and steps over prose.</strong> &quot;1. Run the schema
          validator. 2. If it fails, fix before proceeding&quot; beats three paragraphs of context.
        </li>
        <li>
          <strong>Include one worked example.</strong> A single before/after or sample output
          anchors the format better than any amount of description.
        </li>
        <li>
          <strong>State what not to do.</strong> Skills exist because Claude&apos;s default
          behavior wasn&apos;t what you wanted — say so explicitly. &quot;Never edit generated
          files in dist/&quot; is a sentence; debugging its absence is an afternoon.
        </li>
        <li>
          <strong>Ship scripts for deterministic work.</strong> If a step is mechanical (convert,
          validate, scaffold), include a script in the folder and have the skill run it, rather
          than having Claude re-derive the logic each time.
        </li>
      </ul>

      <h2>Test it like code</h2>
      <p>
        Don&apos;t declare victory after writing the file. Open a fresh session and phrase your
        request the way a teammate would — <em>without</em> naming the skill. If it fires, try two
        more phrasings. If it doesn&apos;t, ask Claude directly: &quot;Which of your available
        skills would you use for this request, and why?&quot; The answer usually points straight at
        the description flaw. Iterate on the description like you&apos;d iterate on a failing test.
      </p>

      <div className="callout">
        <p>
          <strong>Prefer skills that already trigger?</strong> The 103 skills in the ClaudeThings
          kits ship with descriptions tuned exactly this way — installed in one command, firing on
          the first try. <a href="/#pricing">Browse the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Can I force a skill to run? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — name it in your request (&quot;use the api-conventions skill&quot;). That&apos;s
            a good debugging step: if the skill works when named but not organically, the body is
            fine and the description is the problem.
          </div>
        </details>
        <details className="q">
          <summary>
            Skill vs CLAUDE.md — where does an instruction belong? <span className="plus">+</span>
          </summary>
          <div className="a">
            CLAUDE.md is loaded every session, so it&apos;s for rules that apply to everything —
            and it should stay short. Skills load on demand, so anything task-specific (how to
            write migrations, how to do releases) belongs in a skill.
          </div>
        </details>
        <details className="q">
          <summary>
            Do skills work outside Claude Code? <span className="plus">+</span>
          </summary>
          <div className="a">
            The same SKILL.md format powers skills across Claude Code, the Claude apps, and the
            Agent SDK — one of the reasons it&apos;s worth learning to write them well.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
