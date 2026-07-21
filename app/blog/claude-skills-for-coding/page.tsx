import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-skills-for-coding")!;
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

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are Claude skills for coding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Coding skills are SKILL.md files that teach Claude how your team writes software: review checklists, test conventions, debugging methodology, migration rules, and release steps. Claude loads a skill automatically when the task matches its description, so the same standards apply in every session without being re-prompted.",
      },
    },
    {
      "@type": "Question",
      name: "Are coding skills better than putting rules in CLAUDE.md?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "They are complementary. CLAUDE.md is always in context and should hold facts that apply to every task, such as the stack and the build commands. Skills load only when relevant, so they are the right home for long procedures like a review checklist or a migration process that would waste context if always loaded.",
      },
    },
    {
      "@type": "Question",
      name: "Do coding skills work outside Claude Code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Skills are a portable format — the same folder of markdown and scripts works across Claude Code, the Claude apps, and agents built with the Claude Agent SDK, as long as the environment supports loading skills.",
      },
    },
  ],
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Coding" }]}
      eyebrow="Practical guide"
      title={post.title}
      meta={[post.date, post.readingTime, "For working engineers"]}
      jsonLd={[articleLd, faqLd]}
      related={[
        {
          href: "/blog/best-claude-code-skills",
          title: "The Claude Code Skills Worth Installing First",
          desc: "The curated shortlist, grouped by the job each one does.",
        },
        {
          href: "/blog/claude-md-best-practices-template",
          title: "CLAUDE.md Best Practices + Template",
          desc: "What belongs in always-on context versus a skill.",
        },
        {
          href: "/blog/claude-skills-for-developers",
          title: "Claude Skills for Developers",
          desc: "The wider picture: team rollout, plugins, and safety.",
        },
      ]}
    >
      <p className="intro">
        Most people improve Claude&apos;s coding output by writing better prompts. That works, and
        it evaporates the moment the session ends. Skills are the durable version: a markdown file
        that teaches Claude how <em>your</em> team writes software, loaded automatically whenever a
        matching task comes up. This is the set of coding skills that changes the most, and what
        goes inside each one.
      </p>

      <h2>Why coding skills beat re-prompting</h2>
      <p>
        Claude already knows how to write a unit test. What it does not know is that your team uses
        Vitest, colocates test files, forbids mocking the database, and considers a test without a
        failure case incomplete. You can say that every session, or you can write it down once. A
        skill is the writing-it-down: a folder at {code(".claude/skills/<name>/SKILL.md")} with a
        description that tells Claude when to load it and a body that tells Claude what to do.
      </p>
      <p>
        Because skills use progressive disclosure, only the description sits in context until
        something matches — roughly a sentence per skill. That means you can have twenty coding
        skills installed without paying for nineteen of them on any given turn.
      </p>

      <h2>1. Code review</h2>
      <p>
        The highest-usage coding skill in almost every setup. The body should fix a severity order
        (correctness, then security, then performance, then style), require reading the whole diff
        before commenting on any line, and demand a concrete fix with every finding. The clause that
        matters most is the one telling Claude <em>not</em> to invent problems: without it, a review
        of clean code produces a list of stylistic nitpicks, because the model assumes finding
        nothing means failing the task.
      </p>

      <h2>2. Test writing</h2>
      <p>
        Encode the framework, the file layout, and the standards: behavior over implementation, at
        least one failure path, no assertions on private state, and the suite actually run before
        anything is declared passing. That last rule turns &quot;I wrote tests&quot; into &quot;the
        tests are green&quot;, which is a different claim entirely.
      </p>

      <h2>3. Debugging methodology</h2>
      <p>
        Reproduce, hypothesize, instrument, confirm, fix the root cause, clean up. Every experienced
        engineer knows this loop and abandons it under pressure — models do too, defaulting to
        patching the symptom that makes the error message go away. A debugging skill is
        pure discipline enforcement, and it pays for itself the first time it prevents a fix that
        hides a bug instead of removing it.
      </p>

      <h2>4. Refactoring rules</h2>
      <p>
        Behavior-preserving changes only. Tests green before and after. No opportunistic renames, no
        &quot;while I was in there&quot; improvements, no scope creep. A refactor skill is mostly a
        list of prohibitions, and that is what makes it valuable: it constrains a model that is
        otherwise very willing to helpfully rewrite things you did not ask about.
      </p>

      <h2>5. Security review</h2>
      <p>
        A consistent checklist applied to anything touching authentication, payments, user input, or
        secrets: injection paths, authorization gaps, hardcoded credentials, unsafe deserialization,
        missing rate limits. The point is consistency. A human reviewer catches different things on
        a Tuesday than on a Friday; a checklist does not.
      </p>

      <h2>6. Database migrations</h2>
      <p>
        Reversible by default. Destructive operations flagged for human approval instead of
        executed. Naming conventions followed. Backfills separated from schema changes. This skill
        is deliberately boring, which is precisely the mood you want around a production database.
      </p>

      <h2>7. Git and PR hygiene</h2>
      <p>
        Commit message format, branch naming, and how to write a PR description from a diff —
        what changed, why, what to look at first, how it was tested. Small skill, constant use, and
        it makes an entire repo&apos;s history readable by one convention instead of five.
      </p>

      <h2>8. Your project&apos;s own conventions</h2>
      <p>
        The skill nobody else can write for you: how your build works, which directory owns what,
        the error-handling pattern you settled on, the library you deliberately do not use and why.
        Every team has this knowledge scattered across people&apos;s heads and old pull requests.
        Encoding it is the single highest-return skill you will write.
      </p>

      <h2>Skills, CLAUDE.md, subagents: which goes where</h2>
      <p>
        A quick rule. <strong>CLAUDE.md</strong> is always in context, so it should hold short facts
        that apply to every task — the stack, the commands, the hard prohibitions. See our{" "}
        <a href="/blog/claude-md-best-practices-template">CLAUDE.md guide</a> for a template.{" "}
        <strong>Skills</strong> hold procedures that only matter sometimes, and load on demand.{" "}
        <strong>Subagents</strong> do work in a separate context window when a task is big enough to
        pollute your main one. The three are complements, not alternatives — we compare them
        directly in{" "}
        <a href="/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp">
          skills vs subagents vs slash commands vs MCP
        </a>
        .
      </p>

      <h2>Making them actually fire</h2>
      <p>
        A coding skill that never triggers is worse than no skill, because you assume it is working.
        Write descriptions that name situations, not topics: &quot;Use before opening a pull
        request, when the user asks for a review, or after finishing a feature&quot; beats
        &quot;code review expertise&quot;. Then test it — ask Claude to list its available skills,
        phrase a normal request, and check that the right one loads. The{" "}
        <a href="/claude-skill-md-validator">free SKILL.md validator</a> catches the frontmatter
        errors that silently prevent loading.
      </p>

      <div className="callout">
        <p>
          <strong>All eight, already written:</strong> the AgentsKit engineer kit ships review,
          testing, debugging, security, migration, and release skills tuned to trigger — part of 103
          skills, 89 agents, and 181 commands installed with one command.{" "}
          <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Should coding rules go in a skill or in CLAUDE.md? <span className="plus">+</span>
          </summary>
          <div className="a">
            Short rules that apply to every single task go in CLAUDE.md. Long procedures that apply
            only to specific tasks — a review checklist, a migration process — go in a skill, so
            they cost nothing when irrelevant.
          </div>
        </details>
        <details className="q">
          <summary>
            How many coding skills is too many? <span className="plus">+</span>
          </summary>
          <div className="a">
            There is no practical ceiling from context cost, since only descriptions stay loaded.
            The real limit is overlap: two skills with similar descriptions compete, and the wrong
            one fires. Keep each skill&apos;s trigger distinct.
          </div>
        </details>
        <details className="q">
          <summary>
            Do skills work with other Claude products? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — the SKILL.md format is portable across Claude Code, the Claude apps, and agents
            built with the Agent SDK, so a skill you write for your terminal can travel with you.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
