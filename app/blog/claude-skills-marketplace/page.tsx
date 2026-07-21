import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-skills-marketplace")!;
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
      name: "Is there an official Claude skills marketplace?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claude Code supports plugin marketplaces: a marketplace is a git repository with a manifest listing plugins, and each plugin can bundle skills, agents, commands, and MCP servers. You add a marketplace by pointing Claude Code at its repository, then install plugins from it. Anthropic maintains its own marketplace, and anyone can host one.",
      },
    },
    {
      "@type": "Question",
      name: "Are Claude skills from a marketplace safe to install?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Treat them like any dependency. A skill is a set of instructions Claude will follow with your permissions, and it can bundle scripts. Read the SKILL.md and any bundled code before installing, prefer maintained sources with real commit history, and be cautious with anything that asks for credentials or runs network commands.",
      },
    },
    {
      "@type": "Question",
      name: "Do Claude skills cost money?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The skill format is open and most community skills are free on GitHub. Paid offerings exist and generally sell curation and maintenance — a vetted, tested bundle installed in one command — rather than access to the format itself.",
      },
    },
  ],
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Marketplace" }]}
      eyebrow="Ecosystem guide"
      title={post.title}
      meta={[post.date, post.readingTime, "Find, vet, install"]}
      jsonLd={[articleLd, faqLd]}
      related={[
        {
          href: "/blog/claude-skills-github",
          title: "Claude Skills on GitHub",
          desc: "Where the open-source skills live and how to install them safely.",
        },
        {
          href: "/blog/best-claude-code-skills",
          title: "The Skills Worth Installing First",
          desc: "A curated shortlist so you can skip the browsing.",
        },
        {
          href: "/blog/claude-skills-examples",
          title: "Claude Skills Examples",
          desc: "See what a real SKILL.md looks like before you install one.",
        },
      ]}
    >
      <p className="intro">
        &quot;Claude skills marketplace&quot; is a search people make expecting an app store — a
        browsable catalog with ratings and one-click installs. The reality is both simpler and more
        open, and once you understand how distribution actually works, finding good skills gets much
        easier. Here is the real map of the ecosystem: where skills live, how marketplaces work, how
        to vet what you find, and what you should be willing to pay for.
      </p>

      <h2>What a marketplace actually is</h2>
      <p>
        Skills are folders of markdown, so distributing them is just distributing files. Claude Code
        formalizes this with <strong>plugins</strong> and <strong>marketplaces</strong>. A plugin is
        a bundle that can contain skills, subagents, slash commands, and MCP server configuration. A
        marketplace is a git repository with a manifest file listing the plugins it offers. You
        point Claude Code at a marketplace repository, and then you can install any plugin from it
        by name.
      </p>
      <p>
        This means there is no single gatekept store. Anthropic hosts a marketplace, companies host
        internal ones for their teams, and individuals publish their own. It is closer to how apt or
        Homebrew taps work than to the App Store, and the consequences are worth internalizing:
        unlimited supply, no review process, and quality that ranges from excellent to abandoned.
      </p>

      <h2>The four places skills come from</h2>
      <p>
        <strong>1. Anthropic&apos;s own skills.</strong> The document skills — PDF, Word,
        PowerPoint, Excel — are open source and are the reference implementation of the format. If
        you want to see how a skill should be structured, read these first.
      </p>
      <p>
        <strong>2. Plugin marketplaces.</strong> The one-command path. Add a marketplace repository,
        install a plugin, and its skills, agents, and commands all arrive together and stay
        updatable.
      </p>
      <p>
        <strong>3. GitHub repositories.</strong> Vast, unsorted, and free. Awesome-lists and
        collection repos hold hundreds of skills of wildly varying quality, and copying a folder is
        a perfectly valid install method. Our{" "}
        <a href="/blog/claude-skills-github">guide to Claude skills on GitHub</a> covers this route
        properly.
      </p>
      <p>
        <strong>4. Curated paid kits.</strong> Bundles where someone has already done the reading,
        testing, and deduplication. What you buy is not the format — it is the filtering and the
        upkeep.
      </p>

      <h2>How to vet a skill in thirty seconds</h2>
      <p>Open the SKILL.md and check four things:</p>
      <ul>
        <li>
          <strong>The description names its triggers.</strong> If it does not say <em>when</em> to
          use the skill, Claude will not know when to load it — and it will sit installed and inert.
        </li>
        <li>
          <strong>The body is a procedure.</strong> Steps, checklists, worked examples. If it opens
          with &quot;You are a world-class expert in…&quot; and never gets concrete, it is a prompt
          wearing a skill&apos;s clothes.
        </li>
        <li>
          <strong>Mechanical work is scripted.</strong> Good skills bundle code for the
          deterministic parts instead of asking a model to re-derive them.
        </li>
        <li>
          <strong>It says what not to do.</strong> The best skills exist because a default behavior
          was wrong, and they name it.
        </li>
      </ul>
      <p>
        Then read anything executable. This is the part people skip: a skill is instructions that
        Claude will follow with your permissions, in your repository, on your machine. Bundled
        scripts run as you. Apply the same suspicion you would to an npm package from an account
        with two commits.
      </p>

      <h2>Installing what you find</h2>
      <p>
        From a marketplace, installation is a command and updates come with it. From GitHub, you
        copy the folder into {code(".claude/skills/")} for one project or {code("~/.claude/skills/")}{" "}
        for all of them — no build step, no registry, no package manager.
      </p>
      <p>
        Either way, <strong>verify it loads</strong>. Ask Claude which skills are available, then
        phrase a request the way you naturally would and watch whether the right skill fires. When a
        skill does nothing, the description is nearly always the cause; the{" "}
        <a href="/claude-skill-md-validator">free SKILL.md validator</a> catches the frontmatter
        problems that make a skill invisible, and{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">this guide</a> explains why
        triggering fails.
      </p>

      <h2>What is worth paying for</h2>
      <p>
        Nothing about the format is paywalled, so anyone selling &quot;access to skills&quot; is
        selling you air. What genuinely costs time — and is therefore worth buying — is curation and
        maintenance: someone reading forty repositories so you read none, deduplicating overlapping
        skills so they stop competing for triggers, testing that each one fires, and keeping the set
        current as Claude Code changes. That is the honest value proposition of a paid kit, and it
        is the one we make.
      </p>

      <div className="callout">
        <p>
          <strong>The curated option:</strong> AgentsKit is a vetted library — 103 skills, 89
          agents, and 181 commands, deduplicated, trigger-tested, and installed with one command
          instead of forty folder copies.{" "}
          <a href="/#pricing">See what is inside →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Is there one official Claude skills marketplace? <span className="plus">+</span>
          </summary>
          <div className="a">
            Not in the app-store sense. Claude Code supports <em>many</em> marketplaces — each is a
            git repository with a plugin manifest. Anthropic runs one; anyone can host another. Open
            by design, unreviewed as a consequence.
          </div>
        </details>
        <details className="q">
          <summary>
            Can I publish my own skills? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes. Put your skill folders in a public repository, add a marketplace manifest, and
            anyone can add your marketplace and install from it. No approval, no gatekeeper.
          </div>
        </details>
        <details className="q">
          <summary>
            Will installing many skills slow Claude down? <span className="plus">+</span>
          </summary>
          <div className="a">
            No — only names and descriptions stay in context until a skill triggers. The real cost
            of a big library is overlapping descriptions causing the wrong skill to fire, which is a
            curation problem, not a performance one.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
