import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-skills-for-pdf")!;
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
      name: "Can Claude edit a PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, with a PDF skill. The skill bundles Python scripts that manipulate the file directly, so Claude can merge, split, rotate, watermark, fill forms, extract text and images, and encrypt or decrypt PDFs — producing a real .pdf file rather than a description of one.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between uploading a PDF to Claude and using a PDF skill?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Uploading lets Claude read the document and answer questions about it. A PDF skill lets Claude operate on the file: producing new PDFs, editing existing ones, filling forms, and processing many files at once with scripts, which is reliable in a way that model-generated output is not.",
      },
    },
    {
      "@type": "Question",
      name: "Can Claude read scanned PDFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A scanned PDF is images, so plain text extraction returns nothing. A good PDF skill detects this and runs OCR to produce a searchable text layer before extraction, which is exactly the kind of branching a skill encodes and a prompt does not.",
      },
    },
  ],
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Documents" }]}
      eyebrow="Document workflows"
      title={post.title}
      meta={[post.date, post.readingTime, "Real files, not summaries"]}
      jsonLd={[articleLd, faqLd]}
      related={[
        {
          href: "/blog/claude-skills-examples",
          title: "Claude Skills Examples",
          desc: "What a SKILL.md looks like, across six categories.",
        },
        {
          href: "/blog/claude-skills-for-research",
          title: "Claude Skills for Research",
          desc: "The natural companion: PDFs in, literature review out.",
        },
        {
          href: "/blog/best-claude-code-skills",
          title: "The Skills Worth Installing First",
          desc: "Where document skills sit in a complete library.",
        },
      ]}
    >
      <p className="intro">
        PDF is the format everyone has to deal with and nobody enjoys: invoices, contracts,
        statements, scanned forms, hundred-page reports. Claude can read a PDF you upload — but
        reading is only half the job. A PDF <em>skill</em> lets Claude operate on the file: merge,
        split, fill, extract, OCR, and generate real documents. Here is how that works, and why the
        skill approach is dramatically more reliable than prompting.
      </p>

      <h2>Reading a PDF vs working with PDFs</h2>
      <p>
        Drop a PDF into a chat and Claude will happily summarize it, pull out the key numbers, or
        answer questions about clause fourteen. That is document <em>comprehension</em>, and it
        needs no skill at all.
      </p>
      <p>
        What comprehension cannot do is give you a file back. Merging six PDFs into one, filling a
        form with three hundred rows of data, splitting a report by chapter, stamping a watermark
        on every page, OCR-ing a stack of scans so they become searchable — these are file
        operations. They are deterministic, they have exactly one correct answer, and a language
        model approximating them is the wrong tool. So a well-built PDF skill does not ask Claude to
        approximate: it ships the code.
      </p>

      <h2>What a PDF skill actually contains</h2>
      <p>
        A skill is a folder — {code(".claude/skills/pdf/SKILL.md")} plus whatever it bundles. The
        markdown holds the routing logic and the scripts do the work. Anthropic&apos;s open-source
        document skills are the reference implementation of this pattern, and it looks roughly like
        this:
      </p>
      <ul>
        <li>
          <strong>A description that triggers on real situations</strong> — anything involving a
          .pdf file, extracting text or tables, merging, splitting, filling a form, or producing a
          PDF as the deliverable.
        </li>
        <li>
          <strong>A decision tree in the body.</strong> Is the PDF text-based or scanned? Does it
          have a form layer, or does the form need to be filled by overlay? Is the task extraction,
          transformation, or creation? Each branch points at a different tool.
        </li>
        <li>
          <strong>Bundled Python scripts</strong> using the standard libraries — pypdf and friends
          for structure, an OCR engine for scans, a rendering library for generation.
        </li>
        <li>
          <strong>Explicit failure handling.</strong> If text extraction returns almost nothing, the
          document is scanned: run OCR rather than reporting an empty file. This single rule fixes
          the most common PDF failure people hit.
        </li>
      </ul>

      <h2>The jobs a PDF skill does well</h2>
      <p>
        <strong>Extraction.</strong> Text, tables, and images out of a document and into something
        usable — CSV, JSON, markdown. Tables are the hard part, and a script that understands page
        structure beats a model reading a wall of characters.
      </p>
      <p>
        <strong>Form filling.</strong> Given a fillable PDF and a data source, populate every field
        programmatically. This is the classic case where doing it once by hand takes ten minutes and
        doing it two hundred times takes a script.
      </p>
      <p>
        <strong>Merging, splitting, and rotating.</strong> Combine an appendix into a report, split
        a scanned batch into individual invoices, fix pages someone scanned upside down.
      </p>
      <p>
        <strong>OCR.</strong> Turn scans into searchable documents, so everything downstream — grep,
        extraction, analysis — starts working.
      </p>
      <p>
        <strong>Generation.</strong> Produce a properly typeset PDF report, invoice, or one-pager
        from data, with real page breaks and real headers, rather than a markdown file someone has
        to print.
      </p>
      <p>
        <strong>Encryption and redaction.</strong> Lock a document with a password, or strip
        sensitive content before sharing. Redaction deserves a warning: covering text with a black
        rectangle does not remove it. A serious skill deletes the underlying content.
      </p>

      <h2>Installing a PDF skill</h2>
      <p>
        Copy the skill folder into {code(".claude/skills/")} in a project, or{" "}
        {code("~/.claude/skills/")} to have it everywhere — document skills are the classic case for
        installing globally, since PDFs show up in every kind of work. Then check that the
        dependencies the scripts need are installed, and confirm the skill fires by asking for
        something ordinary like &quot;pull the tables out of this statement&quot;.
      </p>
      <p>
        If nothing happens, the description is almost certainly too vague. Our{" "}
        <a href="/claude-skill-md-validator">free SKILL.md validator</a> catches the frontmatter
        issues that stop a skill from loading at all, and{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">the triggering guide</a>{" "}
        explains how descriptions get matched.
      </p>

      <h2>The pattern worth stealing</h2>
      <p>
        PDF skills teach a lesson that applies far beyond documents: <strong>let the model decide,
        let the code execute.</strong> The markdown handles judgment — which branch applies, what
        the user actually wants, when to ask. The scripts handle everything with a single correct
        answer. Skills that follow this split are reliable. Skills that ask a model to do
        arithmetic-grade work in prose are the ones that quietly produce wrong output and sound
        confident about it.
      </p>

      <div className="callout">
        <p>
          <strong>Document skills, pre-installed:</strong> ClaudeThings bundles PDF, Word, Excel,
          and PowerPoint skills — scripts included, triggers tuned — among 103 skills, 89 agents,
          and 181 commands. <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Can Claude actually edit a PDF, or just describe changes? <span className="plus">+</span>
          </summary>
          <div className="a">
            With a PDF skill it edits the real file — merging, splitting, filling, watermarking,
            encrypting — because the skill bundles scripts that manipulate the document directly.
            Without one, you get a description of what should change.
          </div>
        </details>
        <details className="q">
          <summary>
            What about scanned PDFs? <span className="plus">+</span>
          </summary>
          <div className="a">
            A scan is a picture of text, so extraction returns nothing. A good skill detects the
            empty result and runs OCR to add a text layer first — a branch that is written into the
            skill rather than remembered by you.
          </div>
        </details>
        <details className="q">
          <summary>
            Does this work with Word and Excel too? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes. The same pattern covers .docx, .xlsx, and .pptx, and the skills are usually
            installed as a set — most real document work crosses formats anyway.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
