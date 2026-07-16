import SlashCommandPage from "./SlashCommandPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/claude-slash-command-generator",
  title: "Claude Code Slash Command Generator — Free .claude/commands Builder",
  description:
    "Free slash command generator for Claude Code. Build a valid .claude/commands/*.md file with frontmatter, $ARGUMENTS, bash context lines, and file references — with live preview. Runs 100% in your browser.",
  keywords: [
    "claude code slash commands",
    "claude slash command generator",
    ".claude/commands",
    "claude code custom commands",
    "claude code commands examples",
    "slash command frontmatter",
    "claude code $ARGUMENTS",
    "create claude code command",
  ],
  ogTitle: "Claude Code Slash Command Generator — Free",
  ogDescription:
    "Build custom /commands for Claude Code: frontmatter, arguments, bash context, file references — valid file, live preview, one-click download.",
  appName: "Claude Slash Command Generator",
  appDescription:
    "A free, client-side generator for Claude Code slash commands. Produces valid .claude/commands/*.md files with frontmatter (description, argument-hint, allowed-tools, model), $ARGUMENTS placeholders, and bash context lines.",
  faq: [
    {
      question: "What is a Claude Code slash command?",
      answer:
        "A reusable prompt stored as a markdown file in .claude/commands/ (project) or ~/.claude/commands/ (personal). Typing /name runs it; the file can take arguments via $ARGUMENTS or $1/$2, pull in live command output with !`cmd` lines, and reference files with @path.",
    },
    {
      question: "What's the difference between $ARGUMENTS and $1, $2?",
      answer:
        "$ARGUMENTS captures everything typed after the command as one string — best for free-form input like a description. $1, $2… capture positional arguments — best when the command takes distinct parameters like /fix-issue 123 high.",
    },
    {
      question: "What do the !`command` lines do?",
      answer:
        "Lines starting with ! followed by a backticked command execute before the prompt runs and inject their output as context — e.g. !`git status` gives the command your current repo state. The commands used must be permitted by the allowed-tools frontmatter.",
    },
    {
      question: "Slash command or subagent — which do I need?",
      answer:
        "A slash command is a canned prompt you fire explicitly in your current conversation. A subagent is a separate assistant with its own context window and system prompt that Claude can delegate to automatically. Repetitive prompts → command; a whole role → subagent.",
    },
    {
      question: "Is anything I type uploaded?",
      answer: "No — the generator runs entirely client-side. Nothing leaves your browser.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <SlashCommandPage />
    </>
  );
}
