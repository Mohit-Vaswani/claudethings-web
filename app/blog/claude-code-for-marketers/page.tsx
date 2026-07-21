import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-code-for-marketers")!;
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

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Marketing" }]}
      eyebrow="For marketers"
      title={post.title}
      meta={[post.date, post.readingTime, "No coding required"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/claude-md-best-practices-template",
          title: "CLAUDE.md Best Practices",
          desc: "The context file that teaches Claude your brand — template included.",
        },
        {
          href: "/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
          title: "Skills vs Subagents vs Slash Commands vs MCP",
          desc: "The four building blocks, explained without the jargon.",
        },
        {
          href: "/blog/getting-started-with-claude-code",
          title: "Getting Started with Claude Code",
          desc: "The developer-flavored setup guide, if you want the full tour.",
        },
      ]}
    >
      <p className="intro">
        Claude Code has a naming problem: marketers hear &quot;Code&quot; and assume it&apos;s not
        for them. It is. Under the name is something more general — Claude with hands: it can read
        and write files, run tools, browse pages, and execute multi-step work on your machine
        instead of in a chat window. For a marketer, that&apos;s the difference between &quot;write
        me a blog post&quot; and &quot;write the post, save it in our content folder following our
        template, check it against the brand guide, and draft the five social cuts.&quot;
      </p>

      <h2>Why files beat chat for marketing work</h2>
      <p>
        The chat workflow everyone knows — prompt, copy, paste, lose the thread — has a ceiling:
        the AI never sees your <em>body of work</em>. Claude Code operates on a folder. Put your
        brand guide, tone-of-voice doc, past campaigns, and content calendar in a directory, and
        every draft is written with all of it in view. Three practical consequences:
      </p>
      <ul>
        <li>
          <strong>Consistency:</strong> drafts sound like your brand because the brand guide is
          sitting right there, not summarized from memory.
        </li>
        <li>
          <strong>Batch work:</strong> &quot;update the CTA on all 14 landing-page drafts&quot; is
          one instruction, not fourteen chat sessions.
        </li>
        <li>
          <strong>Compounding context:</strong> a file called CLAUDE.md holds your standing
          instructions — audience, voice, banned phrases, formatting rules — and is read
          automatically at the start of every session. Correct something once, write it down, and
          you never repeat the correction. (We have a{" "}
          <a href="/blog/claude-md-best-practices-template">full template here</a>.)
        </li>
      </ul>

      <h2>The setup, honestly described</h2>
      <p>
        Yes, there&apos;s a terminal involved. No, that&apos;s not a real barrier — you type two
        commands once, and if anything goes wrong you ask Claude itself to fix it (it&apos;s
        genuinely good tech support for its own installation):
      </p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">terminal — one-time setup</span>
        </div>
        <pre className="prompt-body">{`npm install -g @anthropic-ai/claude-code

cd my-marketing-folder
claude`}</pre>
      </div>
      <p>
        From there you work in plain English. If the terminal truly isn&apos;t your thing, Claude
        Code also runs in the desktop app and on the web — same capabilities, friendlier window.
      </p>

      <h2>Workflow 1: an SEO content pipeline</h2>
      <p>The concrete no-code workflow that sells the whole idea. In a folder with your brand guide and a keyword list, one instruction:</p>
      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">prompt</span>
        </div>
        <pre className="prompt-body">{`Read brand-guide.md and keywords.csv. For the top 5 keywords
by priority: draft a 1,200-word article each — search intent
matched, H2/H3 structure, internal links to our existing posts
(listed in sitemap.md), meta title under 60 chars, meta
description under 155. Save each as drafts/<slug>.md with the
metadata in frontmatter. Then give me a summary table of the
five with target keyword and suggested publish order.`}</pre>
      </div>
      <p>
        Fifteen minutes later you have five structured drafts in your folder, each one written
        against your actual brand guide, ready for human editing. The edit-review loop also
        happens in place: &quot;tighten the intro of drafts/pricing-page-seo.md, it buries the
        point&quot; edits the file directly.
      </p>

      <h2>Workflow 2: campaign assets from one brief</h2>
      <p>
        Write a one-page brief — audience, offer, deadline, key message — and let Claude Code fan
        it out: the landing-page copy, a five-email nurture sequence, ad variants per channel with
        character limits respected, and the UTM-tagged link list, each saved as its own file in a
        campaign folder. Because it&apos;s all files, your team reviews it in the tools you already
        use, and next quarter&apos;s campaign starts by pointing at this one: &quot;same structure,
        new offer.&quot;
      </p>

      <h2>Workflow 3: reporting without the spreadsheet slog</h2>
      <p>
        Claude Code can run scripts, which means it can process data you drop in the folder:
        export your channel CSVs and ask for &quot;a monthly summary — top movers, underperformers
        versus last month, and three recommendations — as a formatted report I can paste into
        Slack.&quot; You don&apos;t write the analysis script; you approve it running. And through
        MCP connectors, it can pull from tools like your analytics or CRM directly rather than
        waiting on exports.
      </p>

      <h2>Where the leverage actually comes from: skills and commands</h2>
      <p>
        Everything above works with raw prompting. The step change comes from encoding your
        processes so they run the same way every time. A <strong>skill</strong> is a document
        teaching Claude how your team does something — your SEO checklist, your brand-review
        criteria — applied automatically when relevant. A <strong>slash command</strong> is a
        saved workflow you trigger by name: {code("/blog-post")}, {code("/campaign-brief")},{" "}
        {code("/brand-check")}. Write them once (or install them) and your junior marketer runs
        the same quality pipeline as your best one.
      </p>

      <div className="callout">
        <p>
          <strong>That&apos;s exactly what the Marketing Kit is:</strong> 31 marketing agents, 42
          skills, and 32 commands — content pipelines, SEO audits, campaign briefs, brand review —
          pre-built and installed into Claude Code with one command.{" "}
          <a href="/#pricing">See the Marketing Kit →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Do I need to know how to code, at all? <span className="plus">+</span>
          </summary>
          <div className="a">
            No. You work in plain English on plain files. The occasional script Claude writes to
            process a CSV is something it writes and runs itself — you just approve it. Treat
            &quot;Code&quot; in the name as historical.
          </div>
        </details>
        <details className="q">
          <summary>
            Will the content sound like AI? <span className="plus">+</span>
          </summary>
          <div className="a">
            That depends on what you feed it. Generic prompt, generic output. A real brand guide,
            three examples of your best past posts, and a banned-phrases list produce drafts that
            sound like your team on a good day — and a brand-review skill can screen for AI-isms
            before anything ships. Human editing stays in the loop either way.
          </div>
        </details>
        <details className="q">
          <summary>
            How is this different from ChatGPT or Claude in the browser? <span className="plus">+</span>
          </summary>
          <div className="a">
            Persistence and hands. Chat produces text you shuttle around manually. Claude Code
            works inside your actual content library — reading your existing assets, saving
            outputs as organized files, and running multi-step pipelines — with standing
            instructions that persist across sessions.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
