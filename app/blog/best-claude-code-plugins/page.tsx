import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("best-claude-code-plugins")!;
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
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Plugins" }]}
      eyebrow="Ranked list"
      title={post.title}
      meta={[post.date, post.readingTime, "For anyone past the default setup"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/best-claude-code-skills",
          title: "The Best Claude Code Skills to Install",
          desc: "What goes inside a good plugin, one component at a time.",
        },
        {
          href: "/blog/best-claude-code-subagents",
          title: "The 12 Subagents Worth Setting Up First",
          desc: "The agent roster most plugins are built around.",
        },
        {
          href: "/blog/claude-skills-marketplace",
          title: "Where to Find and Vet Claude Skills",
          desc: "How to judge a marketplace before you trust it.",
        },
      ]}
    >
      <p className="intro">
        A plugin is the packaging format Claude Code was missing: one install that carries skills,
        subagents, slash commands, hooks, and MCP servers together, versioned and updatable,
        instead of fifteen folders you copied from GitHub in March and never touched again. The
        catch is that plugins are also the easiest thing in the ecosystem to publish badly — a
        README, four thin prompts, and a marketplace listing. Here is what&apos;s actually worth
        installing, ranked, plus how to judge anything not on the list.
      </p>

      <h2>Our #1: the AgentsKit kits</h2>
      <p>
        <strong>Disclosure first: we build this.</strong> Read the rest with that in mind — and
        then judge it on the criteria in the section below, which is how we&apos;d want you to
        judge ours.
      </p>
      <p>
        The case for it is coverage plus maintenance. Most plugins solve one slice: a review
        agent, a test writer, a docs helper. The problem with a slice is that your setup ends up
        as eight plugins from eight authors, with overlapping triggers, contradictory
        conventions, and three abandoned repos. AgentsKit ships 89 agents, 103 skills, and 181
        commands as one coherent library across engineering and marketing — descriptions tuned so
        things actually fire, deterministic work in bundled scripts, and one place to update when
        Claude Code changes.
      </p>
      <p>
        If you want the honest disqualifier: it&apos;s paid, and if your needs are narrow — you
        want a review skill and nothing else — a free single-purpose plugin is the better buy. The
        kits earn their place when you&apos;re running Claude Code daily across a real codebase or
        a real content operation. <a href="/#pricing">See the full contents →</a>
      </p>

      <h2>2. Anthropic&apos;s official plugins and document skills</h2>
      <p>
        The first-party ones set the standard, particularly for documents: PDF, Word, and
        spreadsheet handling that produces real files instead of markdown pretending to be a
        deliverable. They&apos;re free, well-built, and demonstrate the pattern worth copying —
        the model decides, bundled scripts execute the mechanical parts. Install these before
        anything from a stranger.
      </p>

      <h2>3. Language and framework plugins</h2>
      <p>
        The good ones encode idiom, not syntax. A strong Next.js or Rails or Django plugin knows
        your framework&apos;s file conventions, its testing idiom, and the six things people get
        wrong in it — so Claude stops writing generically correct code that looks foreign in your
        repo. Install the one matching your primary stack; skip the rest, since inactive plugins
        still occupy description space.
      </p>

      <h2>4. Review and security bundles</h2>
      <p>
        Severity-ranked review, injection and authz checks, secret scanning, dependency audits.
        This is the category where a consistent checklist beats a smart improvisation every time,
        which is exactly what a plugin is good at. It also pairs with hooks: the review runs, and
        a hook makes sure it ran.
      </p>

      <h2>5. Marketing and content plugins</h2>
      <p>
        Underrated, because most people still think of Claude Code as a developer tool. SEO
        writing, brand-voice enforcement, campaign planning, and performance reporting work
        unusually well here for the same reason coding does: the work is files in a folder, and
        an agent that can read and write the whole folder beats a chat window you paste into.
        More on that in{" "}
        <a href="/blog/claude-code-for-marketers">Claude Code for marketers</a>.
      </p>

      <h2>How to judge a plugin in sixty seconds</h2>
      <div className="cmp">
        <table>
          <thead>
            <tr>
              <th>Check</th>
              <th>Good sign</th>
              <th>Walk away</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Descriptions</td>
              <td>Name concrete triggers and file types</td>
              <td>&quot;You are an expert in…&quot; and nothing else</td>
            </tr>
            <tr>
              <td>Content</td>
              <td>Checklists, steps, worked examples, scripts</td>
              <td>Adjectives and encouragement</td>
            </tr>
            <tr>
              <td>Maintenance</td>
              <td>Commits since the last Claude Code release</td>
              <td>Last touched eight months ago</td>
            </tr>
            <tr>
              <td>Scope</td>
              <td>Says what it does <em>not</em> do</td>
              <td>Claims to do everything</td>
            </tr>
            <tr>
              <td>Safety</td>
              <td>Readable source, no surprise network calls</td>
              <td>Obfuscated scripts, broad hook permissions</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        That last row matters more for plugins than for standalone skills. A plugin can register
        hooks and MCP servers, which means installing one can grant it the ability to run commands
        around your tool calls. Read what you install, the same way you&apos;d read a dependency
        that ships a postinstall script.
      </p>

      <h2>Installing and managing them</h2>
      <p>
        Plugins come from marketplaces, which are just git repos with a manifest. You add a
        marketplace, then install from it — {code("/plugin marketplace add owner/repo")} followed
        by {code("/plugin install name@marketplace")} inside Claude Code. Project-level plugin
        config lives in your repo, so a teammate cloning it gets the same setup rather than a
        message from you explaining the setup.
      </p>
      <p>
        Then actually verify. Ask Claude which skills and agents it has available, phrase a request
        that should trigger one naturally, and watch whether it fires. Half of &quot;this plugin
        doesn&apos;t work&quot; is a description problem, not an install problem — our free{" "}
        <a href="/claude-skill-md-validator">SKILL.md validator</a> and{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">the triggering guide</a>{" "}
        cover the fix.
      </p>

      <h2>What not to install</h2>
      <ul>
        <li>
          <strong>Prompt-pack plugins.</strong> Fifty prompts in a trench coat. Prompts belong in
          a <a href="/prompts">library you copy from</a>, not in your trigger space.
        </li>
        <li>
          <strong>Anything duplicating built-ins.</strong> File reading, git, running commands —
          Claude Code already does these natively.
        </li>
        <li>
          <strong>Overlapping bundles.</strong> Two plugins with review agents means two agents
          competing for the same trigger and neither winning cleanly.
        </li>
      </ul>

      <div className="callout">
        <p>
          <strong>One install instead of eight:</strong> AgentsKit bundles 89 agents, 103
          skills, and 181 commands across engineering and marketing — triggers tuned, scripts
          included, maintained as Claude Code changes.{" "}
          <a href="/#pricing">See the full contents →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Plugin, skill, or subagent — what&apos;s the difference? <span className="plus">+</span>
          </summary>
          <div className="a">
            A skill teaches a capability, a subagent does work in its own context, a slash command
            is a saved prompt, and an MCP server connects an external system. A plugin is the
            container that ships any combination of those as one versioned install. Full
            comparison{" "}
            <a href="/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp">here</a>.
          </div>
        </details>
        <details className="q">
          <summary>
            Do installed plugins slow Claude down? <span className="plus">+</span>
          </summary>
          <div className="a">
            Not meaningfully, thanks to progressive disclosure — only names and descriptions stay
            loaded until something triggers. The real cost of a bloated setup is wrong triggering,
            not latency. Vague, overlapping descriptions are what hurt.
          </div>
        </details>
        <details className="q">
          <summary>
            Are paid plugins worth it? <span className="plus">+</span>
          </summary>
          <div className="a">
            Only for breadth and upkeep. Any single skill in any kit is something you could write
            yourself in an afternoon — a hundred of them, tuned to trigger and maintained across
            Claude Code releases, is the part nobody has an afternoon for. If you need one narrow
            capability, write it yourself and skip the purchase.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
