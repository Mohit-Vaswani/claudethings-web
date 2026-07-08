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
