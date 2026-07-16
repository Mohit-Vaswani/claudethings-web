"use client";

import { useMemo, useState } from "react";
import {
  ToolNav,
  ToolFooter,
  KitsUpsell,
  FaqSection,
  useToolPageFx,
  renderInline,
} from "@/app/components/toolPage";

/**
 * CLAUDE.md Grader — scores a Claude Code memory file /100 with exact fixes.
 * 100% client-side. Categories and rules follow the widely-shared community
 * best practices: keep it short, specific, progressively disclosed, and free
 * of anything a linter already enforces.
 */

/* --------------------------------- engine --------------------------------- */

type Severity = "fix" | "polish" | "pass";

interface Finding {
  severity: Severity;
  category: string;
  points: number; // deduction (0 for pass)
  message: string;
}

export interface GradeResult {
  score: number;
  grade: string;
  gradeNote: string;
  findings: Finding[];
  lines: number;
  estTokens: number;
}

const VAGUE_PHRASES: Array<[RegExp, string]> = [
  [/\bbest practices\b/gi, "best practices"],
  [/\bclean code\b/gi, "clean code"],
  [/\bhigh[- ]quality\b/gi, "high-quality"],
  [/\bproperly\b/gi, "properly"],
  [/\bappropriately\b/gi, "appropriately"],
  [/\bwhere (appropriate|applicable|necessary)\b/gi, "where appropriate"],
  [/\bas needed\b/gi, "as needed"],
  [/\bbe (careful|mindful|thoughtful)\b/gi, "be careful"],
  [/\bmake sure to\b/gi, "make sure to"],
  [/\brobust\b/gi, "robust"],
  [/\bwell[- ]structured\b/gi, "well-structured"],
];

const LINTER_RULES: Array<[RegExp, string]> = [
  [/\b(2|4|two|four)[- ]space(s)? (indent|indentation)\b|\bindent(ation)? (of|with) (2|4|two|four)\b/gi, "indentation width"],
  [/\btabs? (vs\.?|versus|over|instead of) spaces\b|\buse (tabs|spaces),? not (tabs|spaces)\b/gi, "tabs vs spaces"],
  [/\b(no |avoid |always use )?semicolons?\b/gi, "semicolons"],
  [/\b(single|double) quotes\b/gi, "quote style"],
  [/\bline (length|width) (of |under |max )?\d+|\bmax(imum)? line length\b|\b\d+ characters? per line\b/gi, "line length"],
  [/\btrailing commas?\b/gi, "trailing commas"],
  [/\b(alphabetize|sort|order) (the )?imports?\b/gi, "import ordering"],
  [/\bcamel ?case|snake_?case|kebab-?case\b/gi, "naming case"],
];

const IMPORTANT_RE = /\b(IMPORTANT|YOU MUST|NEVER|ALWAYS|CRITICAL|DO NOT)\b/g;

export function gradeClaude(src: string): GradeResult {
  const findings: Finding[] = [];
  const add = (severity: Severity, category: string, points: number, message: string) =>
    findings.push({ severity, category, points, message });

  const text = src.replace(/\r\n/g, "\n");
  const rawLines = text.split("\n");
  const lines = rawLines.length;
  const estTokens = Math.round(text.length / 4);
  let score = 100;
  const deduct = (n: number) => {
    score -= n;
    return n;
  };

  /* ---- 1. size & token budget (max −25) ---- */
  if (lines <= 120 && estTokens <= 1600) {
    add("pass", "Size", 0, `${lines} lines ≈ ${estTokens} tokens — a lean file. This is loaded on every session, and yours is cheap.`);
  } else if (lines <= 250) {
    add("polish", "Size", deduct(8), `${lines} lines ≈ ${estTokens} tokens. Workable, but every line is paid on every session — aim under ~120 lines by moving detail into linked docs.`);
  } else if (lines <= 500) {
    add("fix", "Size", deduct(16), `${lines} lines ≈ ${estTokens} tokens — this burns real context on every single session. Cut it below ~150 lines: keep commands and rules, move everything explanatory into \`docs/\` files you link to.`);
  } else {
    add("fix", "Size", deduct(25), `${lines} lines ≈ ${estTokens} tokens — this is a wiki, not a memory file. Claude's attention degrades over long instruction lists. Keep the 30–50 lines that change behavior; link the rest.`);
  }

  /* ---- 2. progressive disclosure (max −12) ---- */
  const hasLinks = /@[\w./-]+\.\w+|\]\([^)]+\.md\)|\bsee\s+`?[\w./-]+\.(md|txt)\b/i.test(text);
  if (hasLinks) {
    add("pass", "Progressive disclosure", 0, "Links out to other docs instead of inlining everything — Claude reads them only when relevant.");
  } else if (lines > 100) {
    add("fix", "Progressive disclosure", deduct(12), "Long file with no pointers to other docs. Split deep material (architecture, API notes, style rationale) into separate files and reference them (`@docs/architecture.md` or a markdown link) — Claude will pull them in when needed.");
  } else {
    add("polish", "Progressive disclosure", deduct(4), "No links to deeper docs found. Fine for a small file — but as it grows, prefer `@docs/…` references over inlining.");
  }

  /* ---- 3. specificity (max −20) ---- */
  const vagueHits: string[] = [];
  for (const [re, label] of VAGUE_PHRASES) {
    const m = text.match(re);
    if (m) vagueHits.push(`\`${label}\` ×${m.length}`);
  }
  const codeSpans = (text.match(/`[^`\n]+`/g) ?? []).length + (text.match(/```/g) ?? []).length / 2;
  if (vagueHits.length === 0) {
    add("pass", "Specificity", 0, "No vague filler phrases ('best practices', 'properly', 'as needed') — instructions are concrete.");
  } else if (vagueHits.length <= 2) {
    add("polish", "Specificity", deduct(5), `Vague phrasing found: ${vagueHits.join(", ")}. Replace each with the concrete rule you actually mean (e.g. 'handle errors properly' → 'wrap DB calls in try/catch and return typed errors').`);
  } else {
    add("fix", "Specificity", deduct(Math.min(14, 4 + vagueHits.length * 2)), `Heavy vague filler: ${vagueHits.join(", ")}. These phrases don't change Claude's behavior — every one should become a concrete, checkable rule or be deleted.`);
  }
  if (codeSpans === 0 && lines > 20) {
    add("fix", "Specificity", deduct(6), "No backticked commands or code anywhere. The highest-value CLAUDE.md content is exact commands (`npm test`, `make build`) and real file paths — add them.");
  }

  /* ---- 4. linter duplication (max −12) ---- */
  const linterHits: string[] = [];
  for (const [re, label] of LINTER_RULES) {
    if (re.test(text)) linterHits.push(label);
  }
  if (linterHits.length === 0) {
    add("pass", "Linter duplication", 0, "No mechanical style rules found — formatting is left to the formatter, where it belongs.");
  } else {
    add(
      linterHits.length > 2 ? "fix" : "polish",
      "Linter duplication",
      deduct(Math.min(12, linterHits.length * 4)),
      `Rules a linter/formatter should own: ${linterHits.map((h) => `\`${h}\``).join(", ")}. Move these to ESLint/Prettier/Ruff config — tooling enforces them more reliably and for zero tokens.`
    );
  }

  /* ---- 5. structure (max −12) ---- */
  const headings = (text.match(/^#{1,3}\s+\S/gm) ?? []).length;
  const bullets = (text.match(/^\s*[-*]\s+\S/gm) ?? []).length;
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim() && !p.trim().startsWith("#"));
  const longParas = paragraphs.filter((p) => p.split(/\s+/).length > 80).length;
  if (lines > 15 && headings === 0) {
    add("fix", "Structure", deduct(6), "No headings. Group content under `## Commands`, `## Architecture`, `## Rules` — sections help Claude (and you) find rules fast.");
  } else if (headings > 0) {
    add("pass", "Structure", 0, `${headings} heading${headings > 1 ? "s" : ""} and ${bullets} bullet${bullets === 1 ? "" : "s"} — scannable structure.`);
  }
  if (longParas > 0) {
    add("polish", "Structure", deduct(Math.min(6, longParas * 3)), `${longParas} wall-of-text paragraph${longParas > 1 ? "s" : ""} (80+ words). Convert to bullets — models follow short discrete rules better than prose.`);
  }

  /* ---- 6. content essentials (max −14) ---- */
  const hasCommands = /\b(npm|pnpm|yarn|bun|make|cargo|go|pytest|python|pip|uv|gradle|mvn|rake|mix)\s+\w|```(bash|sh|shell)/i.test(text);
  const hasArch = /architect|structure|director(y|ies)|folder|layout|module|monorepo|package(s)? live|entry ?point/i.test(text);
  if (hasCommands) {
    add("pass", "Essentials", 0, "Build/test/run commands present — the single most valuable thing in a CLAUDE.md.");
  } else {
    add("fix", "Essentials", deduct(8), "No build/test/run commands detected. Add a `## Commands` section with the exact commands (`npm run dev`, `npm test`, lint) — without them Claude guesses.");
  }
  if (hasArch) {
    add("pass", "Essentials", 0, "Mentions architecture / repo layout — context Claude can't fully infer from file names.");
  } else {
    add("polish", "Essentials", deduct(6), "No architecture or repo-layout notes. Two or three lines on where things live ('API routes in `app/api`, shared logic in `lib/`') prevents wrong-directory edits.");
  }

  /* ---- 7. anti-patterns (max −15) ---- */
  const shouts = (text.match(IMPORTANT_RE) ?? []).length;
  if (shouts > 6) {
    add("fix", "Anti-patterns", deduct(6), `${shouts} instances of IMPORTANT / YOU MUST / NEVER / ALWAYS. When everything is critical, nothing is — reserve emphasis for the 2–3 rules that genuinely are.`);
  } else if (shouts > 0) {
    add("pass", "Anti-patterns", 0, `Emphasis used sparingly (${shouts}×) — keeps the truly critical rules loud.`);
  }
  if (/\b(sk-[a-zA-Z0-9]{10,}|api[_-]?key\s*[:=]\s*['"][^'"]+|password\s*[:=])/i.test(text)) {
    add("fix", "Anti-patterns", deduct(9), "Possible secret or credential detected. CLAUDE.md is committed to the repo and pasted into tools like this one — never put keys or passwords in it.");
  }
  if (/\b(as an ai|you are claude|act as)\b/i.test(text)) {
    add("polish", "Anti-patterns", deduct(3), "Persona/role-play preamble found ('you are…', 'act as…'). CLAUDE.md is project memory, not a system prompt — Claude Code already knows what it is. Delete it and save the tokens.");
  }

  score = Math.max(0, Math.round(score));
  const [grade, gradeNote] =
    score >= 95 ? ["A+", "Ship it. This is a reference-quality CLAUDE.md."]
    : score >= 88 ? ["A", "Excellent — a couple of small trims from perfect."]
    : score >= 78 ? ["B", "Solid file with clear wins available."]
    : score >= 65 ? ["C", "Works, but it's costing tokens or reliability."]
    : score >= 50 ? ["D", "Claude is fighting this file. The fixes below are high-impact."]
    : ["F", "Start from the essentials: commands, layout, 10 concrete rules."];

  const order: Record<Severity, number> = { fix: 0, polish: 1, pass: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity] || b.points - a.points);

  return { score, grade, gradeNote, findings, lines, estTokens };
}

/* --------------------------------- samples --------------------------------- */

const SAMPLE = `# CLAUDE.md

## Commands
- \`pnpm dev\` — start the dev server (port 3000)
- \`pnpm test\` — vitest; run before every commit
- \`pnpm lint\` — eslint + prettier check

## Architecture
- Next.js 15 app router. Pages in \`app/\`, shared logic in \`lib/\`, UI in \`components/\`.
- Database access ONLY through \`lib/db.ts\` helpers — never import the driver directly.
- See @docs/architecture.md for the full service map.

## Rules
- New API routes need a zod schema in \`lib/schemas.ts\` and a test.
- Use \`Result<T>\` returns in \`lib/\`; never throw across module boundaries.
- Feature flags live in \`lib/flags.ts\` — check there before adding config.
`;

const BAD_SAMPLE = `# Project guidelines

You are Claude, an expert senior engineer. Always write clean code and follow best practices. Make sure to handle errors properly and write high-quality, robust, well-structured code where appropriate.

Please use 2-space indentation, single quotes, no semicolons, and keep line length under 80 characters. Always alphabetize imports. Use camelCase for variables.

IMPORTANT: NEVER write bad code. ALWAYS think carefully. IMPORTANT: You MUST always double check everything. NEVER make mistakes. ALWAYS be careful. IMPORTANT: this is CRITICAL.

Our application is a web application that uses modern technologies and frameworks to deliver value to users. It has a frontend and a backend and a database. The frontend talks to the backend which talks to the database. We care deeply about quality and want the code to be maintainable, scalable, and performant at all times, so make sure everything you write is production ready and enterprise grade and follows industry standard patterns and conventions as needed.
`;

/* ----------------------------------- UI ----------------------------------- */

const SEV_META: Record<Severity, { label: string; icon: string; cls: string }> = {
  fix: { label: "Fix", icon: "✕", cls: "err" },
  polish: { label: "Polish", icon: "!", cls: "warn" },
  pass: { label: "Pass", icon: "✓", cls: "pass" },
};

export default function GraderPage() {
  useToolPageFx();
  const [src, setSrc] = useState("");

  const result = useMemo(() => (src.trim() ? gradeClaude(src) : null), [src]);

  const copyReport = async () => {
    if (!result) return;
    const lines = [
      `# CLAUDE.md grade: ${result.score}/100 (${result.grade})`,
      "",
      `${result.lines} lines · ~${result.estTokens} tokens loaded every session`,
      "",
      ...result.findings.map(
        (f) =>
          `${SEV_META[f.severity].icon} [${f.category}${f.points ? ` −${f.points}` : ""}] ${f.message.replace(/`/g, "")}`
      ),
      "",
      "Graded free at https://claudethings.com/claude-md-grader",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  const shareUrl = result
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `My CLAUDE.md scored ${result.score}/100 (${result.grade}) ${
          result.score >= 88 ? "😤" : "💀"
        }\n\nGrade yours free:\nhttps://claudethings.com/claude-md-grader`
      )}`
    : "#";

  const dial = result
    ? result.score >= 88
      ? "good"
      : result.score >= 65
      ? "okish"
      : "bad"
    : "";

  return (
    <>
      <ToolNav
        links={[
          { href: "#rubric", label: "The rubric" },
          { href: "#guide", label: "Best practices" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#grader"
        ctaLabel="Grade mine"
      />

      {/* HERO + TOOL */}
      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free CLAUDE.md grader · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            Grade your <span className="grad">CLAUDE.md</span> out of 100
          </h1>
          <p className="sub reveal-h d3">
            Your CLAUDE.md is loaded into <b>every single session</b> — paste it and get a score
            with <b>exact fixes</b>: token budget, vague rules, linter duplication, progressive
            disclosure, and missing essentials. Nothing leaves your browser.
          </p>

          <div id="grader" className="val-tool reveal-h d4">
            <div className="val-panel val-editor">
              <div className="val-head">
                <span className="val-file">CLAUDE.md</span>
                <div className="val-actions">
                  <button className="val-mini" onClick={() => setSrc(SAMPLE)}>
                    Load A-grade example
                  </button>
                  <button className="val-mini" onClick={() => setSrc(BAD_SAMPLE)}>
                    Load bad example
                  </button>
                  <button className="val-mini" onClick={() => setSrc("")} disabled={!src}>
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                spellCheck={false}
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder={"Paste the full contents of your CLAUDE.md here…\n\nIt's graded live as you type. 100% client-side."}
                aria-label="CLAUDE.md contents to grade"
              />
            </div>

            <div className="val-panel val-results" aria-live="polite">
              {!result ? (
                <div className="val-empty">
                  <div className="val-empty-ic">◆</div>
                  <p>
                    Paste your <code>CLAUDE.md</code> to see its score, or load an example to see
                    the rubric in action.
                  </p>
                </div>
              ) : (
                <>
                  <div className={`val-verdict ${dial}`}>
                    <span className="v-ic">{result.grade}</span>
                    <span>
                      {result.score}/100 — {result.gradeNote}
                    </span>
                  </div>
                  <div className="val-counts">
                    <span className="c err">{result.findings.filter((f) => f.severity === "fix").length} fixes</span>
                    <span className="c warn">{result.findings.filter((f) => f.severity === "polish").length} polish</span>
                    <span className="c pass">{result.findings.filter((f) => f.severity === "pass").length} passed</span>
                    <button className="val-mini val-copy" onClick={copyReport}>
                      Copy report
                    </button>
                  </div>
                  <ul className="val-findings">
                    {result.findings.map((f, i) => (
                      <li key={i} className={`val-finding ${SEV_META[f.severity].cls}`}>
                        <span className="f-chip">{SEV_META[f.severity].icon}</span>
                        <span className="f-body">
                          <b className="f-rule">
                            {f.category}
                            {f.points > 0 ? ` · −${f.points}` : ""}
                          </b>
                          <span className="f-msg">{renderInline(f.message)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ padding: "10px 16px 16px" }}>
                    <a className="btn btn-ghost" href={shareUrl} target="_blank" rel="noopener noreferrer">
                      Share your score on X →
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="micro reveal-h d5">
            100% client-side · nothing uploaded · graded against community best practices
          </p>
        </div>
      </header>

      {/* RUBRIC */}
      <section id="rubric">
        <div className="wrap center">
          <div className="tag fade">The rubric</div>
          <h2 className="fade">Six categories, 100 points</h2>
          <p className="lead fade">
            The score rewards what actually changes Claude's behavior per token spent — and
            penalizes the patterns that quietly make Claude Code worse.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["📏", "Size & token budget", "CLAUDE.md is prepended to every session. Under ~120 lines is lean; 500+ lines means degraded instruction-following and a permanent context tax."],
              ["🎯", "Specificity", "Vague filler ('best practices', 'properly', 'robust') is scored down hard — every rule should be concrete enough that you could check compliance."],
              ["🪜", "Progressive disclosure", "Big files should link out (`@docs/architecture.md`) instead of inlining. Claude reads linked docs only when the task needs them."],
              ["🤖", "Linter duplication", "Indentation, quotes, semicolons, import order — if a formatter can enforce it, prose shouldn't. Those lines cost tokens and get ignored anyway."],
              ["🧱", "Structure & essentials", "Headings and bullets beat prose walls. Exact build/test commands and a repo-layout note are the highest-value lines you can write."],
              ["🚫", "Anti-patterns", "IMPORTANT/NEVER/ALWAYS spam, role-play preambles, and anything that looks like a committed secret."],
            ].map(([ic, h, pt]) => (
              <div className="card fade" key={h}>
                <div className="ic">{ic}</div>
                <h3>{h}</h3>
                <p>{renderInline(pt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST PRACTICES GUIDE */}
      <section id="guide">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">CLAUDE.md best practices</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              What an A-grade CLAUDE.md looks like
            </h2>
            <p className="lead fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Think of it as the onboarding doc you'd give a brilliant engineer who rejoins your
              team every morning with no memory of yesterday.
            </p>
          </div>

          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["Commands first", "The `## Commands` section pays for itself instantly: dev server, test runner, lint, build — with exact flags. Without it, Claude runs `npm test` in a pnpm repo and burns a turn."],
              ["Rules Claude can't infer", "Don't describe what the code already shows. Do write the invariants that live in your team's heads: 'DB access only through lib/db.ts', 'never edit generated/ files'."],
              ["Link, don't inline", "Reference deeper docs with `@docs/architecture.md` or markdown links. The file stays under budget and the detail is still one hop away when a task needs it."],
              ["Prune it monthly", "CLAUDE.md rots like any doc. When Claude keeps doing something wrong, add one precise rule; when a rule stops mattering, delete it. The grader is a fast pruning loop."],
            ].map(([h, pt]) => (
              <div className="feat fade" key={h}>
                <div className="fi">▹</div>
                <h4>{h}</h4>
                <p>{renderInline(pt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        heading="CLAUDE.md questions"
        items={[
          [
            "Where does CLAUDE.md live?",
            "At the repo root (checked in, shared with your team). Claude Code also reads `~/.claude/CLAUDE.md` for personal global preferences and `CLAUDE.local.md` for personal per-repo notes. Subdirectory CLAUDE.md files load when Claude works in that directory.",
          ],
          [
            "How long should a CLAUDE.md be?",
            "As short as it can be while covering commands, layout, and your non-obvious rules. Under ~120 lines (roughly 1,500 tokens) is a good budget — remember it's paid on every session, forever.",
          ],
          [
            "Should I generate my CLAUDE.md with /init?",
            "`/init` is a fine starting point — it scans the repo and drafts one. But generated files trend long and generic. Run the draft through this grader, cut what the code already says, and keep the rules only your team knows.",
          ],
          [
            "What's the difference between CLAUDE.md and a system prompt?",
            "CLAUDE.md is project memory layered on top of Claude Code's own system prompt. It shouldn't define a persona ('you are an expert engineer') — it should carry project facts and rules the model can't infer.",
          ],
          [
            "Is my file uploaded when I grade it?",
            "No. The grader is pure client-side JavaScript — nothing you paste leaves your browser, and you can use it offline once the page loads.",
          ],
          [
            "My score is low but Claude works fine — does it matter?",
            "The score measures efficiency and reliability headroom. A bloated or vague file often 'works' until a long session, where the context tax and buried rules start causing missed instructions. Trimming is cheap insurance.",
          ],
        ]}
      />

      <KitsUpsell
        heading="Want the configs already done right?"
        lead={
          <>
            The ClaudeThings kits ship production-grade agents, skills, and commands — written to
            the same bar this grader enforces, so your whole Claude Code setup starts at an A.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>This grader scores common, high-impact CLAUDE.md patterns</b> drawn from Anthropic's
            public guidance and community best practices. It runs entirely in your browser and
            nothing you paste is uploaded or stored. It's a heuristic linter — a great score can't
            guarantee great sessions, but the fixes it suggests are safe wins.
          </>
        }
      />
    </>
  );
}
