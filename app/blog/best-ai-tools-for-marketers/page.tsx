import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("best-ai-tools-for-marketers")!;
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

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Marketing" }]}
      eyebrow="Ranked list"
      title={post.title}
      meta={[post.date, post.readingTime, "For marketers rebuilding their stack"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/claude-code-for-marketers",
          title: "Claude Code for Marketers",
          desc: "How the #1 pick actually works when you don't write code.",
        },
        {
          href: "/prompts",
          title: "The Prompt Library",
          desc: "50 field-tested prompts across marketing, writing, and business.",
        },
        {
          href: "/blog/mention-your-product-on-reddit-without-getting-banned",
          title: "Posting on Reddit Without Getting Banned",
          desc: "A distribution channel most AI content strategies get thrown out of.",
        },
      ]}
    >
      <p className="intro">
        Most &quot;best AI tools for marketers&quot; lists are affiliate directories with fifty
        entries and no opinion. Fifty tools is not a stack, it&apos;s a subscription problem. What
        actually moves output is a small set that covers four jobs — producing work, knowing what
        to produce, making it look right, and getting it out — with one tool clearly at the
        centre. Here&apos;s that set, ranked, with the reasoning attached.
      </p>

      <h2>Our #1: Claude Code with a marketing kit</h2>
      <p>
        <strong>Yes, it&apos;s a developer tool. Use it anyway — this is the biggest single
        upgrade available to a marketer right now.</strong> (Disclosure: we sell a marketing kit
        for it. The reasoning below stands on its own; the tool is free to try without us.)
      </p>
      <p>
        Here&apos;s the difference from a chat window. Chat has no memory of your business and no
        access to your work, so every task starts with you pasting context and ends with you
        copying output somewhere else. Claude Code works on a folder — your briefs, your brand
        guide, your past posts, your keyword exports, your CSVs. It reads all of it, writes files
        back, and repeats a process identically every time because the process lives in a skill
        rather than in your memory of how you phrased it last month.
      </p>
      <p>
        What that looks like in practice: a content pipeline that goes from keyword list to
        outline to draft to metadata across thirty posts; a brand-voice pass that flags off-voice
        phrasing before publishing; campaign briefs built from your actual positioning docs;
        monthly reporting that reads exports and writes the summary. No code required — you type
        in English, it works on files.{" "}
        <a href="/blog/claude-code-for-marketers">The full walkthrough is here.</a>
      </p>
      <p>
        The catch: it&apos;s a terminal, and the first twenty minutes feel strange if you&apos;ve
        never used one. That&apos;s the entire learning curve, and it&apos;s the reason this is
        still an advantage rather than table stakes.
      </p>

      <h2>2. A real SEO data source (Ahrefs or Semrush)</h2>
      <p>
        AI is excellent at producing content and unreliable at telling you what to produce.
        Volumes, difficulty, SERP composition, and competitor gaps have to come from a tool with
        an index behind it — a model guessing search volume is confidently making numbers up. Buy
        one of these, then feed its exports to the tool in slot #1. That pairing is the whole
        content engine.
      </p>

      <h2>3. Perplexity for research</h2>
      <p>
        Cited, current answers for the research phase: competitor moves, category questions, what
        an audience is complaining about this month. Treat the citations as the product and click
        through the important ones — the summary is a starting point, not a source.
      </p>

      <h2>4. Canva or Figma for design</h2>
      <p>
        Both have serious generative features now, and the choice is about your team rather than
        the AI: Canva if you need decent assets fast without a designer, Figma if you have a
        design system to stay inside. Either beats a standalone image generator, because the job
        is rarely one image — it&apos;s eight sizes of one image, on brand.
      </p>

      <h2>5. Descript or an AI video editor</h2>
      <p>
        Editing video by editing a transcript remains the single biggest time saving in content
        production. Cut filler, generate clips and captions for social, repurpose one recording
        into a week of posts. If video is anywhere in your plan, this pays for itself immediately.
      </p>

      <h2>6. Your email and lifecycle platform&apos;s built-in AI</h2>
      <p>
        Subject-line variants, send-time optimization, and segment suggestions are worth using
        where your list already lives. Don&apos;t buy a separate AI email tool — the value is in
        proximity to your data, so a bolt-on that can&apos;t see behaviour is a worse version of
        what you already have.
      </p>

      <h2>7. n8n or Zapier for the glue</h2>
      <p>
        The unglamorous multiplier: move a finished draft into the CMS, push a report into Slack,
        file a lead into the CRM. Automate the handoffs between tools before you buy another
        tool — most stacks lose more time to copy-paste between systems than to any single task.
      </p>

      <h2>What each one is for</h2>
      <div className="cmp">
        <table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Tool</th>
              <th>Replaces</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Producing the work</td>
              <td>Claude Code + marketing kit</td>
              <td>Chat window plus manual copy-paste</td>
            </tr>
            <tr>
              <td>Deciding what to produce</td>
              <td>Ahrefs or Semrush</td>
              <td>Guessing, or asking an AI to guess</td>
            </tr>
            <tr>
              <td>Research with sources</td>
              <td>Perplexity</td>
              <td>Twenty tabs</td>
            </tr>
            <tr>
              <td>Visual assets</td>
              <td>Canva or Figma</td>
              <td>Design request queue</td>
            </tr>
            <tr>
              <td>Video and repurposing</td>
              <td>Descript</td>
              <td>An editor, for rough cuts</td>
            </tr>
            <tr>
              <td>Handoffs</td>
              <td>n8n or Zapier</td>
              <td>You, at 6pm</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>The rule that keeps this from producing slop</h2>
      <p>
        Every tool above is a drafting and leverage tool. None of them is a publishing decision.
        The teams getting compounding results from AI content have a human editorial pass that
        kills roughly a third of what gets drafted, and a voice guide enforced on everything that
        survives. The teams that got penalised skipped both and shipped volume. The advantage was
        never generation speed — everyone has that now — it&apos;s having a point of view worth
        generating, and a process that keeps the output sounding like you.
      </p>

      <div className="callout">
        <p>
          <strong>The marketing kit for Claude Code:</strong> 31 agents, 42 skills, and 32 commands
          covering SEO content pipelines, brand voice enforcement, campaign planning, email
          sequences, competitive briefs, and reporting — installed in one command, no code
          required. <a href="/#pricing">See what&apos;s inside →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Can a non-technical marketer really use Claude Code? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes. You install it once, open a folder of your work, and type requests in plain
            English. The commands you need on day one number about three. The mental model that
            helps: it&apos;s an assistant that can see and edit your files, not a programming
            environment you have to understand.
          </div>
        </details>
        <details className="q">
          <summary>
            Will Google penalise AI-assisted content? <span className="plus">+</span>
          </summary>
          <div className="a">
            Google penalises unhelpful content, not a production method. Thin, undifferentiated
            pages at scale get hit whether a person or a model wrote them. Content with genuine
            expertise, original data, or a real point of view ranks — the method of production
            isn&apos;t the variable being judged.
          </div>
        </details>
        <details className="q">
          <summary>
            What should I cut first if I&apos;m consolidating? <span className="plus">+</span>
          </summary>
          <div className="a">
            Single-purpose writing tools — AI headline generators, blog-post writers, social
            caption apps. They&apos;re wrappers around a model you can prompt directly, without
            your brand context, and they&apos;re the first line item nobody misses.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
