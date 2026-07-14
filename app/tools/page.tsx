import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ToolsIndex from "./ToolsIndex";
import { TOOLS } from "./toolsData";

const PATH = "/tools";
const URL = `https://claudethings.com${PATH}`;

export const metadata: Metadata = {
  title: "Free Claude Code Tools — Validators, Auditors & Skills | ClaudeThings",
  description:
    "A growing collection of free tools for Claude Code: a SKILL.md validator, a website security audit skill, and more. No signup, runs free. Built by ClaudeThings.",
  keywords: [
    "claude code tools",
    "free claude tools",
    "claude skill tools",
    "SKILL.md validator",
    "claude code utilities",
    "claudethings tools",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: "Free Claude Code Tools — ClaudeThings",
    description:
      "Free validators, auditors, and skills for people building with Claude Code. No signup, no cost.",
    type: "website",
    url: URL,
    images: [{ url: ogImage("Free Claude Code Tools — Validators, Auditors & Skills"), width: 1200, height: 630, alt: "Free Claude Code tools by ClaudeThings." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Claude Code Tools — ClaudeThings",
    description:
      "Free validators, auditors, and skills for people building with Claude Code. No signup, no cost.",
    images: [ogImage("Free Claude Code Tools — Validators, Auditors & Skills")],
  },
};

const itemListLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free Claude Code Tools",
  url: URL,
  isPartOf: { "@type": "WebSite", name: "ClaudeThings", url: "https://claudethings.com" },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: TOOLS.filter((t) => t.status === "live").map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://claudethings.com${t.slug}`,
      name: t.name,
      description: t.description,
    })),
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <ToolsIndex />
    </>
  );
}
