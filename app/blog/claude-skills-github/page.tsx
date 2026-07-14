import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-skills-github")!;
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

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I install a Claude skill from GitHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clone or download the repository, then copy the skill folder — the directory containing SKILL.md — into .claude/skills/ in your project or ~/.claude/skills/ for every project. There is no build step and no package manager; the folder is the install.",
      },
    },
    {
      "@type": "Question",
      name: "Where are Anthropic's official Claude skills on GitHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Anthropic publishes open-source skills, including the document skills for PDF, Word, Excel, and PowerPoint, in its skills repository on GitHub. They are the reference implementation of the format and the best models to study before writing your own.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to install Claude skills from GitHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only after reading them. A skill is instructions Claude will follow with your permissions, and it may bundle scripts that run as you. Read the SKILL.md and any executable files, prefer repositories with real commit history and named maintainers, and be wary of skills that fetch remote code or ask for credentials.",
      },
    },
  ],
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "GitHub" }]}
      eyebrow="Sourcing guide"
      title={post.title}
      meta={[post.date, post.readingTime, "Install without regret"]}
      jsonLd={[articleLd, faqLd]}
      related={[
        {
          href: "/blog/claude-skills-marketplace",
          title: "Claude Skills Marketplace",
          desc: "How plugins and marketplaces work — the one-command alternative.",
        },
        {
          href: "/blog/best-claude-code-skills",
          title: "The Skills Worth Installing First",
          desc: "The shortcut past the browsing.",
        },
        {
          href: "/claude-skill-md-validator",
          title: "Free SKILL.md Validator",
          desc: "Check any skill you downloaded before trusting it.",
        },
      ]}
    >
      <p className="intro">
        Almost every Claude skill in existence lives on GitHub. That is the good news and the
        problem: the supply is enormous, entirely unreviewed, and sorted by nothing more useful than
        star count. This is a practical guide to sourcing skills from GitHub — what is worth
        looking at, how to install a folder, how to tell a good skill from an abandoned one, and the
        safety rules that matter more than people admit.
      </p>

      <h2>Why GitHub is the distribution channel</h2>
      <p>
        A skill has no registry, no versioning, and no build artifact. It is a directory containing
        a {code("SKILL.md")} file and, optionally, scripts and reference documents. Distributing one
        means distributing a folder — and the place the world keeps folders is git. So there is no
        npm-for-skills, and there does not need to be.
      </p>
      <p>
        Two consequences follow. Installing is trivially easy: copy the directory. And nothing has
        been checked by anyone: no review, no signing, no quality bar. Both are worth holding in
        your head at the same time.
      </p>

      <h2>What is actually on GitHub</h2>
      <p>
        <strong>Anthropic&apos;s open-source skills.</strong> The document skills — PDF, Word,
        Excel, PowerPoint — are published by Anthropic and are the best-written examples of the
        format available anywhere. Even if you never install them, read one: they demonstrate the
        core pattern of routing logic in markdown and mechanical work in bundled scripts.
      </p>
      <p>
        <strong>Awesome-lists and collections.</strong> Big aggregator repos listing hundreds of
        community skills. Useful for discovering that a category exists; useless as a quality
        signal, since inclusion usually means someone opened a pull request and nobody objected.
      </p>
      <p>
        <strong>Individual developers&apos; dotfiles.</strong> An underrated source. When an engineer
        publishes their {code(".claude/")} directory, you get skills written for real daily work
        rather than for an audience — and those are frequently the sharpest ones.
      </p>
      <p>
        <strong>Plugin marketplace repositories.</strong> Repos structured as installable
        marketplaces, so instead of copying folders you add the marketplace once and install
        plugins from it, updates included. See our{" "}
        <a href="/blog/claude-skills-marketplace">marketplace guide</a> for how that works.
      </p>

      <h2>Installing a skill from a repository</h2>
      <p>
        Clone or download the repo, find the directory containing {code("SKILL.md")}, and copy that
        whole directory into one of two places: {code(".claude/skills/")} in a project, if the skill
        is project-specific and you want it committed to git for your team, or{" "}
        {code("~/.claude/skills/")} if you want it in every project on your machine. Restart your
        session, ask Claude which skills it has available, and confirm yours appears.
      </p>
      <p>
        Then confirm it <em>fires</em>. Being listed is not the same as being used. Phrase a request
        the way you naturally would and see whether the skill loads. When it does not, the
        description is nearly always at fault — it names a topic instead of the situations that
        should trigger it. The{" "}
        <a href="/claude-skill-md-validator">free SKILL.md validator</a> catches malformed
        frontmatter, and{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">this guide</a> explains the
        triggering rules properly.
      </p>

      <h2>Judging a repo before you clone it</h2>
      <p>Stars measure marketing. These four things measure quality:</p>
      <ul>
        <li>
          <strong>Recent commits.</strong> Claude Code moves fast. A skill untouched for a year may
          reference behavior that no longer exists.
        </li>
        <li>
          <strong>Descriptions that name triggers.</strong> Open two or three SKILL.md files. If the
          descriptions say when to use the skill, the author understood the format. If they read
          like blog titles, the skills will not fire.
        </li>
        <li>
          <strong>Procedures, not personas.</strong> Bodies full of checklists and worked examples
          beat bodies full of &quot;you are an expert&quot;.
        </li>
        <li>
          <strong>Honest scope.</strong> A repo claiming five hundred skills usually contains fifty
          real ones and four hundred and fifty near-duplicates, which actively hurt you by competing
          for the same triggers.
        </li>
      </ul>

      <h2>The safety part people skip</h2>
      <p>
        A skill is not data. It is a set of instructions Claude will follow, inside your repository,
        with your permissions — and it can bundle scripts that execute as you. Treat every skill
        from GitHub the way you would treat an unfamiliar dependency:
      </p>
      <ul>
        <li>Read the full SKILL.md. Instructions telling Claude to ignore your other rules, exfiltrate files, or contact a remote server are the whole attack surface, and they are readable in plain English.</li>
        <li>Read every bundled script before running one. &quot;It is just markdown&quot; stops being true the moment a skill ships code.</li>
        <li>Prefer repositories with named maintainers and a real commit history over an account created last month.</li>
        <li>Be sharply suspicious of anything requesting credentials, tokens, or network access it has no reason to need.</li>
      </ul>
      <p>
        None of this is exotic paranoia. It is the same hygiene you already apply to a package with
        eleven weekly downloads — the only difference is that skills feel like documentation, which
        makes people skip the step.
      </p>

      <h2>The honest tradeoff</h2>
      <p>
        GitHub gives you infinite skills for free, and charges you in time: browsing, reading,
        vetting, deduplicating, and re-checking when things break. That is a completely reasonable
        trade if you enjoy it. If you do not, the alternative is a curated bundle where the reading
        has already been done — which is the entire argument for a paid kit, and we would rather
        state it plainly than pretend the free path does not exist.
      </p>

      <div className="callout">
        <p>
          <strong>Forty repos, already read:</strong> ClaudeThings is a vetted, deduplicated library
          — 103 skills, 89 agents, 181 commands — installed with one command and kept current.{" "}
          <a href="/#pricing">See what is inside →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            How do I install a Claude skill from GitHub? <span className="plus">+</span>
          </summary>
          <div className="a">
            Copy the folder containing SKILL.md into {code(".claude/skills/")} (project) or{" "}
            {code("~/.claude/skills/")} (global). No build, no registry — the folder is the install.
          </div>
        </details>
        <details className="q">
          <summary>
            Can I install a whole repo of skills at once? <span className="plus">+</span>
          </summary>
          <div className="a">
            If it is structured as a plugin marketplace, yes — add the marketplace and install the
            plugin, and you get skills, agents, and commands together with updates. Otherwise you
            are copying folders one at a time.
          </div>
        </details>
        <details className="q">
          <summary>
            Do skills from GitHub update automatically? <span className="plus">+</span>
          </summary>
          <div className="a">
            No. A copied folder is a snapshot and will drift. Plugins installed from a marketplace
            can be updated in place, which is the main practical reason to prefer that route.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
