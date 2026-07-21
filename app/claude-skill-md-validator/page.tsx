import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ValidatorPage from "./ValidatorPage";

const PATH = "/claude-skill-md-validator";
const URL = `https://agentskit.co${PATH}`;

export const metadata: Metadata = {
  title: "SKILL.md Validator — Free Claude Skill Format Checker & Linter",
  description:
    "Free online SKILL.md validator for Claude Code Agent Skills. Paste your skill to check the YAML frontmatter, name and description rules, body length, and when-to-use structure — get exact fixes instantly. Runs 100% in your browser.",
  keywords: [
    "SKILL.md validator",
    "validate claude skill",
    "claude skill format checker",
    "SKILL.md linter",
    "claude code skill",
    "agent skill frontmatter",
    "claude skill description",
    "skill md checker",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: "Free SKILL.md Validator — Claude Skill Format Checker",
    description:
      "Paste your Claude Code skill and instantly lint the YAML frontmatter, name/description rules, and structure — with exact fixes. Free and fully client-side.",
    type: "website",
    url: URL,
    images: [{ url: ogImage("SKILL.md Validator — Free Claude Skill Format Checker & Linter"), width: 1200, height: 630, alt: "Free SKILL.md validator for Claude Code skills." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SKILL.md Validator — Claude Skill Format Checker",
    description:
      "Lint your Claude Code SKILL.md in seconds: frontmatter, name, description, body length, and when-to-use structure. Free, runs in your browser.",
    images: [ogImage("SKILL.md Validator — Free Claude Skill Format Checker & Linter")],
  },
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SKILL.md Validator — Claude Skill Format Checker",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any (web browser)",
  url: URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "A free, client-side validator and linter for Claude Code Agent Skill SKILL.md files. Checks YAML frontmatter, name and description rules, body length, and when-to-use structure.",
  publisher: { "@type": "Organization", name: "AgentsKit", url: "https://agentskit.co" },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      question: "What is a SKILL.md file?",
      answer:
        "A SKILL.md is the entry point of a Claude Code Agent Skill — a Markdown file with YAML frontmatter (at minimum a name and a description) followed by instructions. Claude reads the description to decide when to load the skill.",
    },
    {
      question: "What makes a SKILL.md invalid?",
      answer:
        "The hard failures are: no --- frontmatter block, a missing name or description, a name that isn't lowercase kebab-case or exceeds 64 characters, or a description over 1024 characters.",
    },
    {
      question: "Why should the description start with 'Use when…'?",
      answer:
        "The description is the only thing Claude sees when deciding whether to activate a skill. Leading with the trigger condition makes the activation criteria unambiguous and improves how reliably the skill fires.",
    },
    {
      question: "How long should a SKILL.md be?",
      answer:
        "Keep the body under about 500 lines. Move long reference material such as schemas, examples, and checklists into separate files in the skill folder and link to them.",
    },
    {
      question: "Is my skill uploaded when I validate it?",
      answer:
        "No. The validator runs entirely client-side in your browser. Nothing you paste is sent to a server, logged, or stored.",
    },
  ].map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.answer },
  })),
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "AgentsKit", item: "https://agentskit.co" },
    { "@type": "ListItem", position: 2, name: "SKILL.md Validator", item: URL },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ValidatorPage />
    </>
  );
}
