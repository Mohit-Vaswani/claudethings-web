import SubagentPage from "./SubagentPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/claude-subagent-generator",
  title: "Claude Code Subagent Generator — Free .claude/agents Builder",
  description:
    "Free Claude Code subagent generator. Describe a role, pick tools and model, and get a valid .claude/agents/*.md file with correct frontmatter and a production-grade system prompt. Runs 100% in your browser.",
  keywords: [
    "claude code subagent",
    "claude subagent generator",
    "claude code agents",
    ".claude/agents",
    "claude code custom agent",
    "subagent frontmatter",
    "claude code agent examples",
    "create claude subagent",
  ],
  ogTitle: "Claude Code Subagent Generator — Free",
  ogDescription:
    "Describe a role, get a valid .claude/agents/*.md file — correct frontmatter, scoped tools, and a real system prompt. Free & client-side.",
  appName: "Claude Subagent Generator",
  appDescription:
    "A free, client-side generator for Claude Code subagents. Produces valid .claude/agents/*.md files with correct YAML frontmatter (name, description, tools, model) and a structured system prompt.",
  faq: [
    {
      question: "What is a Claude Code subagent?",
      answer:
        "A subagent is a specialized assistant Claude Code can delegate tasks to. Each one is a markdown file in .claude/agents/ with YAML frontmatter (name, description, optional tools and model) and a system prompt. Subagents run in their own context window, keeping the main conversation clean.",
    },
    {
      question: "Where do I save the generated file?",
      answer:
        "Project subagents go in .claude/agents/ inside your repo (shared with your team, highest priority). Personal subagents go in ~/.claude/agents/ and work across all your projects.",
    },
    {
      question: "Which tools should I give a subagent?",
      answer:
        "As few as it needs. A code reviewer needs Read, Grep, and Glob but not Write or Bash; giving fewer tools makes the agent safer and its behavior more predictable. Omit the tools field entirely to inherit all tools including MCP tools.",
    },
    {
      question: "How does Claude decide when to use my subagent?",
      answer:
        "It reads the description field. Make it action-oriented and trigger-focused ('Use PROACTIVELY after any code change…') — vague descriptions mean the subagent never fires.",
    },
    {
      question: "Is anything I type uploaded?",
      answer: "No — the generator is pure client-side JavaScript. Nothing leaves your browser.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <SubagentPage />
    </>
  );
}
