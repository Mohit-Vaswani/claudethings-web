import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("claude-skills-for-studying")!;
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
      name: "How can Claude skills help me study?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A study skill encodes a learning method — active recall, spaced repetition, the Feynman technique, worked-example practice — so Claude quizzes you, grades you, and makes you explain things back, instead of handing over answers. The skill loads automatically whenever you start studying, so the method runs even when you would rather take the shortcut.",
      },
    },
    {
      "@type": "Question",
      name: "Is using Claude to study cheating?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Using it to produce work you submit as your own is cheating, and it also teaches you nothing. Using it as a tutor that tests you, marks your errors, and refuses to hand over answers is the opposite: it is closer to having a patient study partner available at 2am. The skill you write decides which one you get.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best study skill to start with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Socratic tutor skill: one that answers a question with a question, asks you to explain your reasoning, and only confirms once you have arrived at the answer yourself. It is the single instruction that changes Claude from an answer machine into a tutor.",
      },
    },
  ],
};

const code = (s: string) => <code>{s}</code>;

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Studying" }]}
      eyebrow="Learning workflows"
      title={post.title}
      meta={[post.date, post.readingTime, "For students and self-teachers"]}
      jsonLd={[articleLd, faqLd]}
      related={[
        {
          href: "/blog/claude-skills-for-research",
          title: "Claude Skills for Research",
          desc: "When studying turns into sourcing and citing.",
        },
        {
          href: "/blog/claude-skills-examples",
          title: "Claude Skills Examples",
          desc: "See the SKILL.md format before you write your own.",
        },
        {
          href: "/blog/10-prompting-techniques-for-claude",
          title: "10 Prompting Techniques for Claude",
          desc: "Prompt-level habits that make explanations land better.",
        },
      ]}
    >
      <p className="intro">
        The default way students use Claude is the least useful one: paste the question, read the
        answer, feel like you learned something, discover in the exam that you did not. Recognition
        is not recall. A study skill fixes this by encoding a learning method — one that makes
        Claude test you rather than tell you — and loading it automatically every time you sit down
        to study.
      </p>

      <h2>Why the default is a trap</h2>
      <p>
        Reading a fluent explanation produces a strong feeling of understanding and almost no
        durable memory. Cognitive scientists call it the fluency illusion, and a very articulate AI
        is the best fluency-illusion generator ever built. Everything in it feels obvious as you
        read it, which is precisely the sensation that convinces you to stop studying.
      </p>
      <p>
        What actually builds knowledge is uncomfortable: retrieving information from memory without
        looking, explaining it in your own words, and getting things wrong early enough to fix them.
        A skill is how you force that, because it runs even on the night when you would much rather
        just be given the answer.
      </p>

      <h2>1. The Socratic tutor skill</h2>
      <p>
        The single highest-value study skill, and almost the simplest. The body says: never give the
        answer directly. Respond with a question that moves the student one step closer. Ask them to
        explain their reasoning. If they are wrong, ask a question that exposes the contradiction
        rather than announcing the correction. Confirm only once they have arrived themselves.
      </p>
      <p>
        You will hate it for about ten minutes and then it will be the only mode you want. The
        description should trigger on studying, homework help, and &quot;explain this concept&quot;
        — the exact moments the shortcut is most tempting.
      </p>

      <h2>2. Active recall and quizzing</h2>
      <p>
        Given a chapter, a lecture transcript, or a set of notes, generate questions rather than a
        summary — and crucially, do not show the answers up front. Ask one question at a time, wait
        for the attempt, mark it, and explain what was missed. The skill should mix question types:
        recall, application, and &quot;why is the obvious answer wrong here&quot;.
      </p>
      <p>
        The instruction that makes this work is the one forbidding an answer key alongside the
        questions. Given both, you will read both, and you will learn nothing.
      </p>

      <h2>3. The Feynman technique skill</h2>
      <p>
        You explain the concept out loud, in plain language, as if to a twelve-year-old. Claude
        identifies exactly where the explanation went vague, where jargon papered over a gap, and
        where an analogy broke. Then you try again. This is the fastest known way to find the parts
        of a topic you only think you understand, and it is one short skill.
      </p>

      <h2>4. Spaced repetition scheduling</h2>
      <p>
        A skill that turns material into a review schedule and, more usefully, generates flashcards
        that are actually good: one fact per card, questions that force retrieval rather than
        recognition, no cards that can be answered by pattern-matching the shape of the question.
        Most people&apos;s self-made flashcards fail on exactly these points.
      </p>

      <h2>5. Worked-example practice</h2>
      <p>
        For quantitative subjects. The skill generates a problem, waits, then critiques your{" "}
        <em>method</em> rather than just checking your final number — because in maths, physics, and
        statistics the number is rarely where the learning is. When you are stuck, it gives the next
        step only, never the full solution.
      </p>

      <h2>6. Exam-mode simulation</h2>
      <p>
        Past-paper style questions under time pressure, marked against a real rubric, with feedback
        naming which specific misunderstanding produced each error. Grading is where this earns its
        keep: &quot;you lost marks because you described the mechanism instead of evaluating it&quot;
        is worth more than a score.
      </p>

      <h2>Getting your material in</h2>
      <p>
        Study material arrives as lecture slides, scanned handouts, and textbook PDFs. A document
        skill handles extraction — including OCR when the handout is a photocopy of a photocopy — so
        your actual course content becomes the source rather than the model&apos;s general knowledge
        of the subject. See{" "}
        <a href="/blog/claude-skills-for-pdf">Claude skills for PDF</a> for how that works. When
        studying turns into a literature review or an essay with citations,{" "}
        <a href="/blog/claude-skills-for-research">the research skills</a> are the next step.
      </p>

      <h2>Writing your own in five minutes</h2>
      <p>
        Make a folder at {code("~/.claude/skills/tutor/SKILL.md")}. Frontmatter: a name, and a
        description saying when to use it — &quot;Use when the user is studying, revising, working
        through homework, or asking to be quizzed.&quot; Body: your rules. Never give the answer
        first. Ask before telling. One question at a time. Make the student explain their reasoning.
        Point out errors without correcting them outright.
      </p>
      <p>
        That is a complete, working skill. Then improve it the way everything else improves: every
        time it lets you take a shortcut you should not have taken, add a line forbidding that
        shortcut. Our{" "}
        <a href="/blog/claude-skills-examples">skills examples guide</a> shows the format in full,
        and the{" "}
        <a href="/claude-skill-md-validator">free SKILL.md validator</a> checks the file loads
        correctly.
      </p>

      <div className="callout">
        <p>
          <strong>Skills are not just for students:</strong> the same mechanism that turns Claude
          into a tutor turns it into a reviewer, an editor, or a researcher. AgentsKit ships 103
          production skills with 89 agents and 181 commands.{" "}
          <a href="/#pricing">See the kits →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Is studying with Claude cheating? <span className="plus">+</span>
          </summary>
          <div className="a">
            Submitting its work as your own is. Being quizzed, corrected, and forced to explain
            things back is the opposite of cheating — it is what a good tutor does. The skill you
            install decides which of the two you get.
          </div>
        </details>
        <details className="q">
          <summary>
            Which study skill should I write first? <span className="plus">+</span>
          </summary>
          <div className="a">
            The Socratic tutor. One rule — ask, do not tell — changes Claude from an answer machine
            into a study partner, and it takes five minutes to write.
          </div>
        </details>
        <details className="q">
          <summary>
            Can Claude study from my own course materials? <span className="plus">+</span>
          </summary>
          <div className="a">
            Yes. Pair a study skill with a document skill so your slides, handouts, and textbook
            chapters become the source material — including scanned pages, which need OCR first.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
