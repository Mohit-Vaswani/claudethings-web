import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-skills-for-developers")!;
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
      name: "What are Claude skills?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claude skills are folders containing a SKILL.md file: YAML frontmatter with a name and description, plus markdown instructions and optional scripts. Claude keeps every installed skill's description in context and loads the full instructions only when a task matches — a design called progressive disclosure.",
      },
    },
    {
      "@type": "Question",
      name: "How do skills differ from MCP servers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Skills teach Claude how to do something; MCP servers give Claude access to something. A skill is knowledge and procedure written in markdown. An MCP server is a running process exposing tools that connect Claude to an external system such as a database or an API. They are complementary and are frequently used together.",
      },
    },
    {
      "@type": "Question",
      name: "Can my team share Claude skills?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Commit skills to .claude/skills/ in the repository and every teammate gets them on clone, reviewed through normal pull requests. This is the main reason skills beat personal prompt libraries: they are version-controlled team assets rather than private snippets.",
      },
    },
  ],
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Developers" }]}
      eyebrow="Complete guide"
      title={post.title}
      meta={[post.date, post.readingTime, "Architecture, workflow, rollout"]}
      jsonLd={[articleLd, faqLd]}
      related={[
        {
          href: "/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
          title: "Skills vs Subagents vs Slash Commands vs MCP",
          desc: "The four extension points compared side by side.",
        },
        {
          href: "/blog/claude-skills-for-coding",
          title: "Claude Skills for Coding",
          desc: "The eight coding skills that change the most.",
        },
        {
          href: "/blog/how-to-write-a-claude-code-skill-that-triggers",
          title: "How to Write a SKILL.md That Triggers",
          desc: "The single most common reason skills do nothing.",
        },
      ]}
    >
      <p className="intro">
        Skills are the highest-leverage thing a developer can add to Claude, and the least
        understood. They are not a plugin API, not a framework, and not a prompt library. A skill is
        a markdown file that teaches Claude a capability once, then loads itself automatically
        whenever a task matches. This is the developer&apos;s guide: how they work, where they fit
        among the other extension points, and how to roll them out on a team without creating a
        mess.
      </p>

      <h2>The mechanism, in one section</h2>
      <p>
        A skill is a folder containing {code("SKILL.md")}: YAML frontmatter with a{" "}
        {code("name")} and a {code("description")}, then markdown instructions, plus any scripts or
        reference files it wants to bundle. It lives in {code(".claude/skills/")} inside a project,
        or {code("~/.claude/skills/")} for every project on your machine.
      </p>
      <p>
        The important part is <strong>progressive disclosure</strong>. Claude does not load your
        skills into context. It loads only their names and descriptions — roughly a sentence each.
        When a task matches a description, the full body is pulled in and followed. This is why a
        library of a hundred skills costs almost nothing until one is needed, and why the
        description is the single most important line in the file: it is the only thing Claude sees
        when deciding whether the skill is relevant.
      </p>
      <p>
        The corollary catches everyone at least once. A skill with a vague description is not a
        weak skill — it is an <em>invisible</em> one. It never loads, and because nothing errors,
        you assume it is working. Descriptions must name situations: &quot;Use before opening a PR,
        when the user asks for a review, or after finishing a feature&quot; rather than &quot;code
        review expertise&quot;. Our{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">triggering guide</a> covers
        this in depth, and the{" "}
        <a href="/claude-skill-md-validator">free SKILL.md validator</a> catches the mechanical
        errors.
      </p>

      <h2>Skills versus everything else</h2>
      <p>
        Four extension points, one sentence each. <strong>CLAUDE.md</strong> is always-on context:
        facts true of every task in the repo. <strong>Skills</strong> are on-demand procedures:
        loaded when relevant, free when not. <strong>Subagents</strong> are delegation: a separate
        context window for work that would otherwise pollute yours. <strong>MCP servers</strong> are
        connectivity: running processes that expose tools connecting Claude to databases, APIs, and
        systems.
      </p>
      <p>
        The distinction that matters most: <em>skills teach, MCP connects</em>. A skill can explain
        exactly how to write a safe migration; it cannot reach your database. An MCP server can
        reach your database; it has no opinion about what a safe migration looks like. Used
        together, they are a complete capability. We compare all four in detail in{" "}
        <a href="/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp">
          skills vs subagents vs slash commands vs MCP
        </a>
        .
      </p>

      <h2>The pattern that separates good skills from bad</h2>
      <p>
        <strong>Let the model decide; let the code execute.</strong> Anthropic&apos;s open-source
        document skills demonstrate this: the markdown handles judgment — which branch applies, what
        the user actually wants — and bundled scripts handle everything with a single correct
        answer, like extracting a table or filling a form. Deterministic work belongs in code.
        Asking a language model to do it in prose produces output that is usually right, which is
        the worst possible reliability profile.
      </p>
      <p>
        The second pattern: <strong>state the prohibitions</strong>. The most valuable lines in most
        skills are negative — do not patch the symptom, do not refactor beyond the request, do not
        invent findings when the diff is clean. Skills exist precisely because some default behavior
        was wrong, and naming it is the whole point.
      </p>

      <h2>Rolling skills out on a team</h2>
      <p>
        Commit them. A skill in {code(".claude/skills/")} arrives with the repository, so every
        teammate — and every new hire on day one — gets the same review checklist, the same
        migration rules, the same deployment process. Changes go through pull requests like any
        other code, which means your engineering standards become reviewable artifacts instead of
        folklore.
      </p>
      <p>
        That reframes what a skill is for. The tempting first skills are generic ones — testing,
        review, debugging — and those are worth having. But the highest-value skill on any team is
        the one nobody else could write: how <em>your</em> deployment works, why <em>your</em> team
        rejected a library, which directory owns what. That knowledge currently lives in senior
        engineers&apos; heads and gets rediscovered painfully. A skill is the place to put it.
      </p>

      <h2>Where skills come from</h2>
      <p>
        Three routes. Write your own, which is the only way to capture project-specific knowledge.
        Copy from GitHub, where the supply is enormous and unvetted — read our{" "}
        <a href="/blog/claude-skills-github">GitHub sourcing guide</a>, and read the skills
        themselves, because they run with your permissions. Or install a plugin from a marketplace,
        which bundles skills, agents, and commands together with updates; our{" "}
        <a href="/blog/claude-skills-marketplace">marketplace guide</a> explains how that works.
      </p>

      <h2>Where to start this week</h2>
      <p>
        Write one skill for the thing you correct Claude about most often. Use it for a week, and
        every time you have to correct it again, add a line. That feedback loop is the entire method
        — after a few rounds you have a document encoding your actual standards rather than someone
        else&apos;s idea of best practice. Then repeat for the next most annoying thing.
      </p>

      <div className="callout">
        <p>
          <strong>Or start with a library:</strong> AgentsKit ships 103 skills, 89 agents, and 181
          commands — trigger-tested, deduplicated, and installed with one command, so you can spend
          your time on the project-specific skills only you can write.{" "}
          <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Do skills work outside Claude Code? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes — SKILL.md is a portable format used across Claude Code, the Claude apps, and agents
            built with the Agent SDK. A skill you write for the terminal travels with you.
          </div>
        </details>
        <details className="q">
          <summary>
            Do lots of skills bloat context? <span className="plus">+</span>
          </summary>
          <div className="a">
            Barely. Only names and descriptions stay loaded until a skill triggers. The real cost of
            a large library is overlapping descriptions competing for the same trigger — a curation
            problem, not a context one.
          </div>
        </details>
        <details className="q">
          <summary>
            Skills or MCP — which do I need? <span className="plus">+</span>
          </summary>
          <div className="a">
            Skills if Claude needs to know <em>how</em>; MCP if Claude needs access to something it
            cannot currently reach. Most mature setups have both, and they compose well.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
