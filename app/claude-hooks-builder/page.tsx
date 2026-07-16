import HooksPage from "./HooksPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/claude-hooks-builder",
  title: "Claude Code Hooks Builder — Free Visual settings.json Generator",
  description:
    "Free visual builder for Claude Code hooks. Pick an event (PreToolUse, PostToolUse, Stop…), set a matcher and command, and get valid settings.json — no hand-written JSON, no syntax errors. Runs 100% in your browser.",
  keywords: [
    "claude code hooks",
    "claude hooks builder",
    "claude code settings.json",
    "PreToolUse hook",
    "PostToolUse hook",
    "claude code hook examples",
    "claude code automation",
    "claude code hooks matcher",
  ],
  ogTitle: "Claude Code Hooks Builder — Visual settings.json Generator",
  ogDescription:
    "Everyone gets the hooks JSON wrong. Build it visually: event, matcher, command → valid settings.json with copy & download. Free, client-side.",
  appName: "Claude Hooks Builder",
  appDescription:
    "A free, client-side visual builder for Claude Code hooks. Generates valid settings.json hook configuration for all events (PreToolUse, PostToolUse, UserPromptSubmit, Stop, and more) with matchers and commands.",
  faq: [
    {
      question: "What are Claude Code hooks?",
      answer:
        "Hooks are shell commands that Claude Code runs automatically at lifecycle events — before a tool call (PreToolUse), after one (PostToolUse), when you submit a prompt, when Claude finishes, and more. Unlike instructions in CLAUDE.md, hooks are guaranteed to run: they're app-level automation, not suggestions the model might skip.",
    },
    {
      question: "Where does the hooks JSON go?",
      answer:
        "In a settings file: .claude/settings.json (project, shared with the team), .claude/settings.local.json (project, personal), or ~/.claude/settings.json (all your projects). Paste the generated hooks block into the file, or start from the whole generated file if you don't have one yet.",
    },
    {
      question: "How do hook matchers work?",
      answer:
        "For PreToolUse and PostToolUse, the matcher is a tool-name pattern: 'Bash' matches the Bash tool, 'Edit|Write' matches either, '*' or an empty matcher matches everything. Other events either take no matcher or use special values (PreCompact: manual/auto; SessionStart: startup/resume/clear).",
    },
    {
      question: "How does a hook block an action?",
      answer:
        "Exit code 2 from a PreToolUse hook blocks the tool call, and stderr is fed back to Claude as the reason. Exit code 0 allows it (stdout is shown in the transcript). Any other exit code is a non-blocking error. Hooks can also emit JSON for finer control like permissionDecision.",
    },
    {
      question: "Are hooks dangerous?",
      answer:
        "Hooks run arbitrary shell commands with your user's permissions, automatically. Only add commands you understand, quote variables, and prefer project-local settings reviewed like code. Claude Code also snapshots hooks at startup so mid-session file edits don't silently change behavior.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <HooksPage />
    </>
  );
}
