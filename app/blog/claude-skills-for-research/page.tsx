import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-skills-for-research")!;
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
      name: "How do Claude skills help with research?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A research skill encodes a method rather than a request: how to search, how to record sources, when to say the evidence is thin, and how to format citations. Because the skill loads automatically whenever a research task starts, every session follows the same procedure instead of depending on how carefully you phrased the prompt.",
      },
    },
    {
      "@type": "Question",
      name: "Can Claude skills stop hallucinated citations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "They substantially reduce the risk by making sourcing a required step: every claim must carry a link or a document reference, unverifiable claims must be labelled as such, and a citation may only be written from a source actually retrieved. Verification still belongs to you, but the failure becomes visible instead of invisible.",
      },
    },
    {
      "@type": "Question",
      name: "Are research skills only for academics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The same structure serves market research, competitive analysis, due diligence, and technical evaluation. Any work that involves gathering evidence, weighing it, and writing a defensible conclusion benefits from encoding the method once.",
      },
    },
  ],
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Research" }]}
      eyebrow="Method, not vibes"
      title={post.title}
      meta={[post.date, post.readingTime, "For anyone who cites sources"]}
      jsonLd={[articleLd, faqLd]}
      related={[
        {
          href: "/blog/claude-skills-for-pdf",
          title: "Claude Skills for PDF",
          desc: "Papers and reports arrive as PDFs — this is how you process them.",
        },
        {
          href: "/blog/claude-skills-for-studying",
          title: "Claude Skills for Studying",
          desc: "The learning-side companion to the research workflow.",
        },
        {
          href: "/blog/10-prompting-techniques-for-claude",
          title: "10 Prompting Techniques for Claude",
          desc: "The prompt-level habits that make research output better.",
        },
      ]}
    >
      <p className="intro">
        Ask Claude to &quot;research&quot; something and you get an answer shaped like research:
        confident, structured, plausible. Whether it is <em>grounded</em> depends entirely on how
        carefully you phrased the request that day. A research skill removes that dependency by
        encoding the method — how to search, how to source, when to admit uncertainty — so the
        procedure runs the same way every time.
      </p>

      <h2>The problem a research skill solves</h2>
      <p>
        Language models are fluent, and fluency is indistinguishable from rigor when you are reading
        quickly. The specific failures are well known: a citation that looks perfect and does not
        exist, a confident summary of a paper the model never opened, a single source treated as
        consensus, and a conclusion that quietly matches whatever the question implied.
      </p>
      <p>
        None of these are fixed by asking nicer. They are fixed by a <em>process</em> — and a skill
        is where a process lives. A skill is a folder at {code(".claude/skills/<name>/SKILL.md")}{" "}
        whose description tells Claude when to load it and whose body tells Claude how to work.
      </p>

      <h2>What goes inside a research skill</h2>
      <p>
        <strong>A search protocol.</strong> Do not answer from memory. Search, retrieve, and read
        before writing. State the queries used, so the search itself can be criticized. Where a
        primary source exists, go to it rather than to an article about it.
      </p>
      <p>
        <strong>A sourcing rule with teeth.</strong> Every factual claim carries a link or a document
        reference. Anything that cannot be sourced is labelled explicitly as unverified rather than
        quietly folded into the prose. A citation may only be written from a source actually
        retrieved — never reconstructed from memory, which is exactly how fabricated references get
        born.
      </p>
      <p>
        <strong>Permission to find nothing.</strong> The most valuable line in any research skill is
        the one authorizing &quot;the evidence here is thin&quot; as a complete answer. Without it,
        a model asked for five supporting studies will produce five, because producing five is the
        task it was given.
      </p>
      <p>
        <strong>A disagreement rule.</strong> Where sources conflict, report the conflict. Do not
        average two contradictory findings into a smooth paragraph that represents neither.
      </p>
      <p>
        <strong>An output format.</strong> Claim, evidence, source, confidence. Structure that makes
        a weak claim look weak instead of letting it hide inside an elegant sentence.
      </p>

      <h2>Skills worth having in a research setup</h2>
      <p>
        <strong>Literature review.</strong> Search, screen by relevance, extract method and finding
        and limitation from each paper, then synthesize — noting where the field agrees and where it
        does not. The extraction step matters: a table of methods and findings is auditable, whereas
        a flowing summary is not.
      </p>
      <p>
        <strong>Source evaluation.</strong> Who published this, who funded it, how large was the
        sample, was it peer reviewed, is it primary or secondary? Applied consistently rather than
        when you happen to remember.
      </p>
      <p>
        <strong>Document processing.</strong> Research arrives as PDFs. Extracting text, tables, and
        figures reliably — including from scans that need OCR — is a solved problem if you have the
        right skill. See our{" "}
        <a href="/blog/claude-skills-for-pdf">guide to Claude skills for PDF</a>.
      </p>
      <p>
        <strong>Citation formatting.</strong> APA, MLA, Chicago, or your journal&apos;s house style,
        applied automatically and consistently. Unglamorous, and it removes an entire category of
        tedious final-pass corrections.
      </p>
      <p>
        <strong>Red-teaming your own conclusion.</strong> The skill that argues against you: what
        would have to be true for this conclusion to be wrong, what evidence would falsify it, what
        the strongest counterargument is. Run it before you publish, not after a reviewer does it
        for you.
      </p>

      <h2>Beyond academia</h2>
      <p>
        The same architecture serves market research, competitive analysis, technical evaluation,
        and due diligence. The claim–evidence–source–confidence structure is exactly what a
        competitor teardown or a build-versus-buy memo needs; only the sources change. If you are
        doing that kind of work, our{" "}
        <a href="/blog/claude-code-for-marketers">guide for marketers</a> covers the research
        workflows that show up in growth teams.
      </p>

      <h2>What a skill will not do</h2>
      <p>
        It will not make Claude a reliable narrator of things it did not read, and it will not
        eliminate your responsibility to verify. What it does is make failures <em>visible</em>: a
        claim without a source is now conspicuously missing a source instead of blending in. That is
        the honest promise, and it is worth a lot more than a skill that claims to eliminate
        hallucination.
      </p>
      <p>
        Verify the skill loads before you rely on it — ask Claude which skills are available, then
        make a normal research request and watch for it. The{" "}
        <a href="/claude-skill-md-validator">free SKILL.md validator</a> catches the frontmatter
        errors that make skills silently invisible.
      </p>

      <div className="callout">
        <p>
          <strong>Research, documents, and analysis in one library:</strong> ClaudeThings ships 103
          skills — including document processing, source evaluation, and analysis workflows — with 89
          agents and 181 commands. <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Will a research skill stop fake citations? <span className="plus">+</span>
          </summary>
          <div className="a">
            It makes them far less likely by requiring that every citation come from a source
            actually retrieved, and that unverifiable claims be labelled. It does not remove your
            obligation to check the important ones.
          </div>
        </details>
        <details className="q">
          <summary>
            Do I need web access for research skills to work? <span className="plus">+</span>
          </summary>
          <div className="a">
            For anything current, yes — a skill is a method, not a knowledge source. Pair it with
            search or with local documents so there is something real to read.
          </div>
        </details>
        <details className="q">
          <summary>
            Can a research skill work over my own files? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes, and it is one of the best uses: point it at a folder of papers, reports, or
            transcripts and the same claim–evidence–source discipline applies, with your documents
            as the evidence base.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
