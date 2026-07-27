import ConverterPage from "./ConverterPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/agents-md-converter",
  title: "AGENTS.md ⇄ CLAUDE.md ⇄ .cursorrules Converter — Free & Instant",
  description:
    "Free converter between AI agent config formats: AGENTS.md, CLAUDE.md, .cursorrules, Cursor .mdc rules, GitHub Copilot instructions, and .windsurfrules. One click, correct conventions, with notes on what changed. Runs 100% in your browser.",
  keywords: [
    "agents.md",
    "agents.md vs claude.md",
    "claude.md to agents.md",
    "cursorrules converter",
    "convert cursorrules to claude.md",
    "cursor rules to agents.md",
    "copilot instructions converter",
    "windsurfrules",
    "ai agent config file",
  ],
  ogTitle: "AGENTS.md ⇄ CLAUDE.md ⇄ .cursorrules Converter",
  ogDescription:
    "Switching between Claude Code, Cursor, Codex, or Copilot? Convert your agent config file in one click — correct filename, conventions, and notes. Free & client-side.",
  appName: "Agent Config Converter",
  appDescription:
    "A free, client-side converter between AI coding agent configuration formats: AGENTS.md, CLAUDE.md, .cursorrules, Cursor .mdc project rules, GitHub Copilot instructions, and Windsurf rules.",
  faq: [
    {
      question: "What is AGENTS.md?",
      answer:
        "AGENTS.md is an open, tool-agnostic convention for giving coding agents project instructions — commands, architecture, rules — in a single markdown file at the repo root. It's supported by OpenAI Codex, Cursor, Google Jules, and many other tools, making it the closest thing to a standard.",
    },
    {
      question: "What's the difference between AGENTS.md and CLAUDE.md?",
      answer:
        "Content-wise, almost nothing — both are plain markdown instructions loaded at session start. CLAUDE.md is Claude Code's native file and supports @path/to/file.md imports; AGENTS.md is the cross-tool standard. Many repos keep AGENTS.md as the source of truth and make CLAUDE.md a one-line file that imports it.",
    },
    {
      question: "Is .cursorrules deprecated?",
      answer:
        "Yes — Cursor still reads a legacy .cursorrules file but has deprecated it in favor of .cursor/rules/*.mdc files, which add frontmatter (description, globs, alwaysApply) so rules can be scoped to parts of the codebase. This converter can output either.",
    },
    {
      question: "Does converting change my instructions?",
      answer:
        "The body text passes through mostly untouched. The converter fixes the format-specific parts: the filename and placement, Claude-specific @imports (rewritten as plain markdown references), .mdc frontmatter, and — optionally — tool-name references like 'Claude Code' when you're moving to a different tool.",
    },
    {
      question: "Can one repo have all of these files?",
      answer:
        "Yes, and big open-source repos commonly do. The maintainable pattern is one canonical file (usually AGENTS.md) plus thin per-tool files that point to it — several tools now also read AGENTS.md directly as a fallback.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <ConverterPage />
    </>
  );
}
