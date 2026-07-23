import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-skills-examples")!;
const URL = `https://www.agentary.dev/blog/${post.slug}`;

export const metadata: Metadata = {
  title: `${post.title} — Agentary`,
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
  author: { "@type": "Organization", name: "Agentary" },
  publisher: { "@type": "Organization", name: "Agentary", url: "https://www.agentary.dev" },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a Claude skill?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Claude skill is a folder containing a SKILL.md file — a markdown document with YAML frontmatter (a name and a description) plus instructions in the body. Claude reads the description of every installed skill, and when a task matches, it loads the full instructions and follows them. Skills can also bundle scripts and reference files.",
      },
    },
    {
      "@type": "Question",
      name: "Where do I put a Claude skill file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Put it in .claude/skills/<skill-name>/SKILL.md inside a project to share it with your team via git, or in ~/.claude/skills/<skill-name>/SKILL.md to make it available in every project on your machine.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a SKILL.md be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most good skills are 20 to 150 lines. The description should be one or two sentences naming the concrete triggers, and the body should contain steps, checklists, and examples rather than general praise of expertise.",
      },
    },
  ],
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Skills" }]}
      eyebrow="Worked examples"
      title={post.title}
      meta={[post.date, post.readingTime, "Copy-paste ready"]}
      jsonLd={[articleLd, faqLd]}
      related={[
        {
          href: "/blog/how-to-write-a-claude-code-skill-that-triggers",
          title: "How to Write a SKILL.md That Actually Triggers",
          desc: "The description formula behind every example on this page.",
        },
        {
          href: "/blog/claude-skills-for-developers",
          title: "Claude Skills for Developers",
          desc: "The full developer picture: architecture, workflow, and rollout.",
        },
        {
          href: "/claude-skill-md-validator",
          title: "Free SKILL.md Validator",
          desc: "Paste your skill file and catch the errors that make it silently fail.",
        },
      ]}
    >
      <p className="intro">
        The fastest way to understand Claude skills is to read a few real ones. A skill is not a
        framework or a plugin API — it is a folder with a markdown file in it. Claude reads the
        file&apos;s description, decides whether the current task matches, and if it does, follows
        the instructions inside. That is the whole mechanism. Below are worked examples across the
        categories people actually use, each showing what makes it fire and what makes it useful.
      </p>

      <h2>The anatomy every example shares</h2>
      <p>
        A skill lives at {code(".claude/skills/<name>/SKILL.md")} in a project, or{" "}
        {code("~/.claude/skills/")} if you want it everywhere. The file starts with YAML frontmatter
        and continues with plain markdown:
      </p>
      <pre>
        <code>{`---
name: code-review
description: Review a diff for correctness, security, and clarity.
  Use when the user asks for a review, before opening a PR, or
  after finishing a feature.
---

## How to review

1. Read the full diff before commenting on any single line.
2. Rank findings: correctness > security > performance > style.
3. For each finding, give the file, the line, and the fix.
4. Do not invent problems. If the diff is clean, say so.`}</code>
      </pre>
      <p>
        Two rules explain most of the difference between a skill that works and one that never
        loads. First, <strong>the description is the trigger</strong> — it is the only part Claude
        sees before deciding to use the skill, so it must name the situations, not just the topic.
        Second, <strong>the body is a procedure</strong>, not a personality. &quot;You are a
        world-class reviewer&quot; changes nothing. A numbered checklist changes everything.
      </p>

      <h2>Example 1: a commit message skill</h2>
      <p>
        The smallest useful skill category. The description says{" "}
        <em>&quot;Use whenever writing a git commit message or a PR title&quot;</em>, and the body
        encodes your convention: a Conventional Commits prefix, imperative mood, a subject under
        seventy characters, and a body that explains why rather than what. Nobody has to remember
        the rules again, and every commit in the repo starts looking like it was written by the
        same person.
      </p>

      <h2>Example 2: a test-writing skill</h2>
      <p>
        This is where skills beat prompting. The body states the framework, the file naming
        convention, and the non-negotiables: test behavior rather than implementation, cover the
        failure path, never assert on internal state, run the suite before claiming it passes. The
        description triggers on &quot;write tests&quot;, &quot;add coverage&quot;, and &quot;after
        implementing a new function&quot;. Now Claude writes tests in your idiom instead of a
        generic tutorial style.
      </p>

      <h2>Example 3: a PDF or document skill</h2>
      <p>
        Document skills are the clearest demonstration of why skills bundle code. Extracting text
        from a PDF, filling a form, or merging files is mechanical work that a script does perfectly
        and a language model does approximately. So the skill ships a Python script alongside the
        markdown and the instructions say &quot;run this script&quot; instead of &quot;figure it out
        each time&quot;. Anthropic&apos;s own open-source document skills work exactly this way —
        see our{" "}
        <a href="/blog/claude-skills-for-pdf">guide to Claude skills for PDF</a> for the full
        breakdown.
      </p>

      <h2>Example 4: a brand voice skill</h2>
      <p>
        Not everything is code. A brand voice skill contains your tone rules, your banned phrases,
        your preferred spellings, and a short before/after table showing an off-brand sentence next
        to its corrected version. The description triggers on any drafting or editing of public
        copy. Examples matter more than adjectives here: showing two rewritten sentences teaches
        more than a paragraph describing the voice.
      </p>

      <h2>Example 5: a debugging methodology skill</h2>
      <p>
        The body is a loop: reproduce the bug, form a hypothesis, add instrumentation, confirm or
        discard the hypothesis, fix the root cause, remove the instrumentation. The value is not the
        knowledge — Claude knows how to debug — it is the <em>discipline</em>. Without the skill,
        the default behavior under time pressure is to patch the symptom. With it, the process runs
        the same way every time.
      </p>

      <h2>Example 6: a project-specific skill</h2>
      <p>
        The highest-value skill on most teams is the one nobody else could write: how your
        deployment works, which environment variables matter, what the staging URL is, why the
        migration script must run before the build. It is boring, unglamorous institutional
        knowledge, and encoding it once saves every future session — and every future teammate —
        from rediscovering it.
      </p>

      <h2>Turning an example into your own</h2>
      <p>
        Copying a skill is a starting point, not a destination. The pattern that works: take an
        example, use it for a week, and every time Claude does something you have to correct,
        add one line to the skill preventing it. After a few rounds you have a document that
        encodes your actual standards rather than someone else&apos;s.
      </p>
      <p>
        Before you rely on a skill, verify it loads. Ask Claude which skills it has available, then
        phrase a request naturally and see whether the right one fires. If it does not, the
        description is almost always the problem — our{" "}
        <a href="/claude-skill-md-validator">free SKILL.md validator</a> catches the frontmatter
        mistakes that make a skill invisible, and{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">this guide</a> explains the
        triggering rules in detail.
      </p>

      <div className="callout">
        <p>
          <strong>Skip the copy-paste stage:</strong> the Agentary kits ship 103 production
          skills across code, documents, marketing, and ops — descriptions tuned to trigger,
          scripts bundled, kept current — plus 89 agents and 181 commands.{" "}
          <a href="/#pricing">Install the full library →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            What is a Claude skill, exactly? <span className="plus">+</span>
          </summary>
          <div className="a">
            A folder containing a SKILL.md file: YAML frontmatter with a name and description, then
            markdown instructions in the body. Claude keeps every skill&apos;s description in
            context, and loads the full body only when a task matches — so a large library stays
            cheap.
          </div>
        </details>
        <details className="q">
          <summary>
            Where do skill files go? <span className="plus">+</span>
          </summary>
          <div className="a">
            {code(".claude/skills/<name>/SKILL.md")} in a project (committed to git, shared with
            your team) or {code("~/.claude/skills/")} for every project on your machine.
          </div>
        </details>
        <details className="q">
          <summary>
            How long should a SKILL.md be? <span className="plus">+</span>
          </summary>
          <div className="a">
            Usually twenty to a hundred and fifty lines. Long enough to encode a real procedure,
            short enough that every line earns its place. If it is getting long, move the reference
            material into a separate file the skill points to.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
