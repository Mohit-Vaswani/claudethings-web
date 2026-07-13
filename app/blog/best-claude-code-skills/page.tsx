import type { Metadata } from "next";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("best-claude-code-skills")!;
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
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: ["/og.jpg"] },
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
      eyebrow="Curated list"
      title={post.title}
      meta={[post.date, post.readingTime, "For anyone building a skill library"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/best-claude-code-subagents",
          title: "The 12 Subagents Worth Setting Up First",
          desc: "The matching shortlist for agents — skills teach, agents do.",
        },
        {
          href: "/blog/how-to-write-a-claude-code-skill-that-triggers",
          title: "How to Write a SKILL.md That Actually Triggers",
          desc: "For the skills on this list you decide to write yourself.",
        },
        {
          href: "/claude-skill-md-validator",
          title: "Free SKILL.md Validator",
          desc: "Lint your skill files before they silently fail to load.",
        },
      ]}
    >
      <p className="intro">
        Skills are the highest-leverage extension in Claude Code: documents that teach Claude a
        capability once, then load automatically whenever a task matches. The ecosystem&apos;s
        problem is the same one subagents have — giant unsorted repos where a brilliant skill sits
        next to an abandoned one and nothing tells you which is which. Here is an opinionated
        shortlist for 2026: the skills worth installing, grouped by the job they do.
      </p>

      <h2>How to judge any skill before installing it</h2>
      <p>Four checks, thirty seconds:</p>
      <ul>
        <li>
          <strong>The description names its triggers.</strong> If the frontmatter doesn&apos;t say
          when to use it, it won&apos;t fire.{" "}
          <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">Full explanation here.</a>
        </li>
        <li>
          <strong>It encodes process, not vibes.</strong> Checklists, steps, and worked examples
          beat &quot;you are an expert in…&quot; prose.
        </li>
        <li>
          <strong>Deterministic steps ship as scripts.</strong> Good skills bundle code for
          mechanical work instead of having Claude re-derive it each run.
        </li>
        <li>
          <strong>It states what not to do.</strong> The best skills exist precisely because the
          default behavior was wrong — and say so.
        </li>
      </ul>

      <h2>Code quality: the daily drivers</h2>
      <p>
        <strong>1. Code review.</strong> A severity-ranked review checklist — correctness first,
        style last, no invented findings. The single most-used skill in most setups.
      </p>
      <p>
        <strong>2. Test writing.</strong> Behavior-driven tests in your framework&apos;s idiom,
        with edge cases and a failure mode, run before being declared done.
      </p>
      <p>
        <strong>3. Debugging methodology.</strong> Reproduce → hypothesize → instrument → confirm
        → fix root cause. A skill that forces the discipline pays for itself the first time it
        prevents a symptom-patch.
      </p>
      <p>
        <strong>4. Refactoring rules.</strong> Behavior-preserving changes only, tests green
        before and after, scope creep explicitly forbidden.
      </p>

      <h2>Shipping safely</h2>
      <p>
        <strong>5. Security review.</strong> Injection, authz gaps, secrets, unsafe input
        handling — applied as a consistent checklist on anything touching auth, payments, or user
        data.
      </p>
      <p>
        <strong>6. Database migrations.</strong> Reversible migrations, destructive operations
        flagged instead of run, schema conventions followed. Boring by design; that&apos;s the
        point.
      </p>
      <p>
        <strong>7. Release/deploy process.</strong> Your actual release ritual — version bumps,
        changelog, smoke checks — encoded so it runs identically whether you ship or your newest
        teammate does.
      </p>
      <p>
        <strong>8. Git hygiene.</strong> Commit message conventions, when to branch, how to write
        a PR description from the diff. Small skill, constant use.
      </p>

      <h2>Documents and data: the underrated workhorses</h2>
      <p>
        <strong>9–11. PDF, Word, and spreadsheet handling.</strong> Anthropic&apos;s own
        open-source document skills set the standard here: extract, create, and edit real files —
        with the mechanical parts done by bundled scripts. If your work involves documents at all,
        these three are automatic installs.
      </p>
      <p>
        <strong>12. Data analysis and visualization.</strong> Chart-type selection, sane
        defaults, honest axes — a skill that stops the default instinct to produce a rainbow pie
        chart for everything.
      </p>

      <h2>Content and growth</h2>
      <p>
        <strong>13. SEO writing.</strong> Search-intent matching, heading structure, metadata
        limits, internal linking — applied automatically whenever you draft site content.
      </p>
      <p>
        <strong>14. Brand voice review.</strong> Your tone-of-voice guide as an enforcement pass:
        flags off-brand phrasing and AI-isms before anything ships.
      </p>
      <p>
        <strong>15. Skill-writing itself.</strong> The meta-skill: teaches Claude to write and
        critique new SKILL.md files properly. Install this early — it makes every skill you author
        afterward better.
      </p>

      <h2>Installing them</h2>
      <p>
        A skill is just a folder: drop it in {code(".claude/skills/")} in a project (shared with
        your team via git) or {code("~/.claude/skills/")} for every project. Community skills from
        GitHub work by copying the folder — read them first, since skills are instructions Claude
        will follow with your permissions. Then verify each one loads and fires: ask Claude
        &quot;which skills do you have available?&quot;, then phrase a matching request naturally
        and watch whether it triggers. Our free{" "}
        <a href="/claude-skill-md-validator">SKILL.md validator</a> catches the frontmatter
        problems that make skills silently invisible.
      </p>
      <p>
        The one-command version: skills increasingly ship in plugins and kits, installed as a
        bundle instead of folder-by-folder — which is exactly how ClaudeThings works.
      </p>

      <div className="callout">
        <p>
          <strong>Everything on this list, one command:</strong> the ClaudeThings kits include all
          fifteen categories above among 103 skills — descriptions tuned to trigger, scripts
          bundled, kept current — plus the 89 agents and 181 commands they pair with.{" "}
          <a href="/#pricing">Install the full library →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Do many installed skills slow Claude down or bloat context? <span className="plus">+</span>
          </summary>
          <div className="a">
            Barely — skills use progressive disclosure. Until one triggers, only its name and
            description are in context, roughly a sentence per skill. A large, well-described
            library is cheap; a library of vague descriptions is the real cost, because it causes
            wrong or missed triggering.
          </div>
        </details>
        <details className="q">
          <summary>
            Skills vs subagents — which list do I set up first? <span className="plus">+</span>
          </summary>
          <div className="a">
            Skills first: they&apos;re simpler, they improve every session immediately, and
            subagents can use them. Then add{" "}
            <a href="/blog/best-claude-code-subagents">the agent roster</a> for delegation and
            context isolation. The two lists are designed as a matched set.
          </div>
        </details>
        <details className="q">
          <summary>
            Are community skills safe to install? <span className="plus">+</span>
          </summary>
          <div className="a">
            Treat them like dependencies: read the SKILL.md and any bundled scripts before
            installing, prefer maintained sources, and remember they run with your session&apos;s
            permissions. Curated, reviewed bundles exist precisely because auditing forty random
            repos yourself is nobody&apos;s idea of leverage.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
