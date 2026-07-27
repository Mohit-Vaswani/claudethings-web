import GraderPage from "./GraderPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/claude-md-grader",
  title: "CLAUDE.md Grader — Free Score & Linter for Your Claude Code Config",
  description:
    "Free CLAUDE.md grader for Claude Code. Paste your CLAUDE.md and get a score out of 100 with exact fixes: token budget, progressive disclosure, linter duplication, vague instructions, and structure. Runs 100% in your browser.",
  keywords: [
    "claude.md grader",
    "claude.md best practices",
    "claude md checker",
    "claude.md generator",
    "claude code memory file",
    "claude.md examples",
    "claude code claude.md",
    "claude.md linter",
    "how to write claude.md",
  ],
  ogTitle: "CLAUDE.md Grader — Score Your Claude Code Config /100",
  ogDescription:
    "Paste your CLAUDE.md, get a score /100 with the exact fixes: length, progressive disclosure, linter duplication, vague rules. Free & client-side.",
  appName: "CLAUDE.md Grader",
  appDescription:
    "A free, client-side grader and linter for Claude Code CLAUDE.md files. Scores token budget, progressive disclosure, specificity, structure, and linter duplication, with exact fixes for every deduction.",
  faq: [
    {
      question: "What is a CLAUDE.md file?",
      answer:
        "CLAUDE.md is Claude Code's project memory file. It's loaded into context at the start of every session, so it's where you put build/test commands, architecture notes, code-style pointers, and repo-specific rules Claude can't infer from the code.",
    },
    {
      question: "What makes a good CLAUDE.md?",
      answer:
        "Short and specific. Every line costs context tokens on every single session, so the best files are under ~100 lines, use concrete commands instead of vague guidance, link out to deeper docs instead of inlining them, and never restate rules a linter or formatter already enforces.",
    },
    {
      question: "How is the score calculated?",
      answer:
        "100 points across six categories: size and token budget, specificity, progressive disclosure, structure, content essentials (commands, architecture), and anti-patterns like linter duplication, shouting, and vague filler. Each finding shows the exact deduction and the fix.",
    },
    {
      question: "Is my CLAUDE.md uploaded when I grade it?",
      answer:
        "No. The grader runs entirely client-side in your browser. Nothing you paste is sent to a server, logged, or stored.",
    },
    {
      question: "Why shouldn't CLAUDE.md repeat my linter rules?",
      answer:
        "Prose rules like 'use 2-space indentation' or 'no semicolons' waste tokens and are less reliable than tooling — Claude Code sees your linter/formatter output directly. Keep mechanical style in ESLint/Prettier/Ruff configs and use CLAUDE.md for what tools can't check.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <GraderPage />
    </>
  );
}
