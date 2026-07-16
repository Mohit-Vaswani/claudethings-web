/**
 * Registry of free tools listed at /tools.
 *
 * To launch a new tool: build its page under app/<slug>/, then add one entry
 * here. The /tools index and the sitemap both read from this list, so the tool
 * shows up everywhere automatically.
 */

export interface ToolEntry {
  /** Route path, e.g. "/claude-skill-md-validator". Also the sitemap URL. */
  slug: string;
  /** Short product name shown on the card. */
  name: string;
  /** One-line hook under the name. */
  tagline: string;
  /** Card body — what it does and who it's for. */
  description: string;
  /** Emoji icon. */
  icon: string;
  /** Optional pill, e.g. "New" or "Free". */
  badge?: string;
  /** "live" tools link out; "soon" render as a disabled teaser. */
  status: "live" | "soon";
  /** Included in the sitemap when true (skip for "soon"/off-site). */
  indexable?: boolean;
}

export const TOOLS: ToolEntry[] = [
  {
    slug: "/claude-code-wrapped",
    name: "Claude Code Wrapped",
    tagline: "Turn your ccusage stats into a shareable flex",
    description:
      "Paste your ccusage output and get a Wrapped-style card: total tokens burned, the $ value at API prices, your favorite model, longest streak, and biggest day. Download the PNG and share it. Runs 100% in your browser.",
    icon: "🔥",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/claude-md-grader",
    name: "CLAUDE.md Grader",
    tagline: "Score your Claude Code config out of 100",
    description:
      "Paste your CLAUDE.md and get a graded score with exact fixes: token budget, vague rules, linter duplication, progressive disclosure, and missing essentials. Runs 100% in your browser.",
    icon: "🎓",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/claude-plan-calculator",
    name: "Claude Plan Calculator",
    tagline: "Pro vs Max vs API — which actually pays off?",
    description:
      "Enter your daily Claude Code usage and instantly see the cheapest plan that fits, what your usage is worth at API prices, and when you'd hit each plan's limits.",
    icon: "🧮",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/agents-md-converter",
    name: "Agent Config Converter",
    tagline: "AGENTS.md ⇄ CLAUDE.md ⇄ .cursorrules in one click",
    description:
      "Convert between AGENTS.md, CLAUDE.md, .cursorrules, Cursor .mdc rules, Copilot instructions, and .windsurfrules — correct conventions, imports, and placement notes included.",
    icon: "⇄",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/claude-subagent-generator",
    name: "Subagent Generator",
    tagline: "Describe a role, get a valid .claude/agents file",
    description:
      "Build a Claude Code subagent in a minute: name, trigger-focused description, scoped tools, model, and a structured system prompt — with presets for reviewer, debugger, and test runner.",
    icon: "🤖",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/claude-slash-command-generator",
    name: "Slash Command Generator",
    tagline: "Turn your most-repeated prompt into a /command",
    description:
      "Build valid .claude/commands files with frontmatter, $ARGUMENTS, live bash context lines, and allowed-tools — with /commit, /review-pr, and /explain presets and a live preview.",
    icon: "⌨️",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/claude-hooks-builder",
    name: "Hooks Builder",
    tagline: "Valid Claude Code hooks without hand-writing JSON",
    description:
      "Visual builder for Claude Code hooks: pick an event, matcher, and command and get valid settings.json — with presets for auto-format, file protection, bash logging, and notifications.",
    icon: "🪝",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/mcp-config-validator",
    name: "MCP Config Validator",
    tagline: "Fix your .mcp.json in seconds",
    description:
      "Paste your .mcp.json or claude_desktop_config.json and catch the exact errors that make MCP servers silently vanish — wrong keys, missing fields, trailing commas, placeholder env values.",
    icon: "🔌",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/claude-token-counter",
    name: "Claude Token Counter",
    tagline: "Tokens and cost for any text, instantly",
    description:
      "Paste text or code and get a calibrated token estimate plus the price on Claude Opus, Sonnet, and Haiku — input, output, and cache rates, scaled to any number of calls.",
    icon: "🔢",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/claude-skill-md-validator",
    name: "SKILL.md Validator",
    tagline: "Lint a Claude skill's format in seconds",
    description:
      "Paste a SKILL.md and instantly check the YAML frontmatter, name and description rules, body length, and when-to-use structure — with the exact fixes. Runs 100% in your browser.",
    icon: "🧾",
    badge: "New",
    status: "live",
    indexable: true,
  },
  {
    slug: "/claude-skill-for-website-security-audit",
    name: "Website Security Audit",
    tagline: "Scan your site for the holes that get sites breached",
    description:
      "A free Claude skill that audits your own website or codebase for missing HTTPS, exposed files, hardcoded secrets, and vulnerable dependencies — then hands you a prioritized, plain-English fix-it report.",
    icon: "🛡️",
    badge: "Free",
    status: "live",
    indexable: true,
  },
];
