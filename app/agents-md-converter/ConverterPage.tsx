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
 * Agent config converter — AGENTS.md ⇄ CLAUDE.md ⇄ .cursorrules ⇄ .mdc ⇄
 * copilot-instructions ⇄ .windsurfrules. 100% client-side.
 */

/* --------------------------------- formats --------------------------------- */

type FormatId = "claude" | "agents" | "cursorrules" | "cursor-mdc" | "copilot" | "windsurf";

interface Format {
  id: FormatId;
  label: string;
  filename: string;
  tool: string;
  toolName: string | null; // how the agent is referred to in prose
  heading: string; // canonical H1
}

const FORMATS: Format[] = [
  { id: "claude", label: "CLAUDE.md", filename: "CLAUDE.md", tool: "Claude Code", toolName: "Claude", heading: "CLAUDE.md" },
  { id: "agents", label: "AGENTS.md", filename: "AGENTS.md", tool: "Codex, Cursor, Jules + more", toolName: null, heading: "AGENTS.md" },
  { id: "cursorrules", label: ".cursorrules (legacy)", filename: ".cursorrules", tool: "Cursor (legacy)", toolName: null, heading: "Project rules" },
  { id: "cursor-mdc", label: "Cursor .mdc rule", filename: ".cursor/rules/project.mdc", tool: "Cursor", toolName: null, heading: "Project rules" },
  { id: "copilot", label: "Copilot instructions", filename: ".github/copilot-instructions.md", tool: "GitHub Copilot", toolName: "Copilot", heading: "Copilot instructions" },
  { id: "windsurf", label: ".windsurfrules", filename: ".windsurfrules", tool: "Windsurf", toolName: null, heading: "Project rules" },
];

const fmt = (id: FormatId) => FORMATS.find((f) => f.id === id)!;

/* -------------------------------- conversion -------------------------------- */

interface Conversion {
  output: string;
  filename: string;
  notes: string[];
}

function stripMdcFrontmatter(src: string): { body: string; hadFm: boolean } {
  const m = src.match(/^\s*---\n([\s\S]*?)\n---\n?/);
  if (!m) return { body: src, hadFm: false };
  return { body: src.slice(m[0].length), hadFm: true };
}

function firstHeadingText(src: string): string | null {
  const m = src.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function convert(src: string, from: FormatId, to: FormatId, adaptNames: boolean): Conversion {
  const notes: string[] = [];
  const target = fmt(to);
  let body = src.replace(/\r\n/g, "\n");

  // 1. Strip .mdc frontmatter when converting away from Cursor .mdc.
  if (from === "cursor-mdc") {
    const s = stripMdcFrontmatter(body);
    body = s.body;
    if (s.hadFm && to !== "cursor-mdc") {
      notes.push("Removed the `.mdc` YAML frontmatter (`description`, `globs`, `alwaysApply`) — other formats don't use it.");
    }
  }

  // 2. Rewrite Claude-specific @imports when leaving CLAUDE.md.
  if (from === "claude" && to !== "claude") {
    const imports = body.match(/(^|\s)@([\w./-]+\.\w+)/gm);
    if (imports?.length) {
      body = body.replace(/(^|\s)@([\w./-]+\.\w+)/gm, (_, pre, path) => `${pre}[${path}](${path})`);
      notes.push(`Rewrote ${imports.length} Claude-specific \`@import\` reference${imports.length > 1 ? "s" : ""} as plain markdown links — other tools don't auto-load \`@path\` imports.`);
    }
  }

  // 3. Rename the canonical H1 if it's just the filename.
  const h1 = body.match(/^#\s+(CLAUDE\.md|AGENTS\.md|\.cursorrules|Copilot instructions|Project rules)[^\S\n]*$/im);
  if (h1) {
    body = body.replace(h1[0], `# ${target.heading}`);
    notes.push(`Renamed the title heading to \`# ${target.heading}\`.`);
  }

  // 4. Optionally adapt tool-name references.
  if (adaptNames && from !== to) {
    const source = fmt(from);
    let replaced = 0;
    if (source.toolName === "Claude") {
      body = body.replace(/\bClaude Code\b/g, () => (replaced++, targetAgentPhrase(to)));
      body = body.replace(/\bClaude\b/g, () => (replaced++, targetAgentShort(to)));
    } else if (source.toolName === "Copilot") {
      body = body.replace(/\bGitHub Copilot\b|\bCopilot\b/g, () => (replaced++, targetAgentShort(to)));
    }
    if (replaced > 0) {
      notes.push(`Adapted ${replaced} tool-name reference${replaced > 1 ? "s" : ""} for the target tool (uncheck "Adapt tool references" to keep the original wording).`);
    }
  }

  // 5. Add .mdc frontmatter when targeting Cursor .mdc.
  if (to === "cursor-mdc") {
    const desc = firstHeadingText(body) ?? "Project rules and conventions";
    body = `---\ndescription: ${desc}\nglobs:\nalwaysApply: true\n---\n\n${body.trimStart()}`;
    notes.push("Added `.mdc` frontmatter with `alwaysApply: true` — edit `globs` (e.g. `src/**/*.ts`) to scope the rule to part of the codebase instead.");
  }

  // 6. Placement notes.
  const placement: Record<FormatId, string> = {
    claude: "Save as `CLAUDE.md` at the repo root. Tip: you can keep AGENTS.md as the source of truth and make CLAUDE.md a single line: `@AGENTS.md`.",
    agents: "Save as `AGENTS.md` at the repo root — Codex, Cursor, Jules, and a growing list of tools read it automatically.",
    cursorrules: "Save as `.cursorrules` at the repo root. Note: this format is deprecated by Cursor — prefer `.cursor/rules/*.mdc` for new setups.",
    "cursor-mdc": "Save as `.cursor/rules/project.mdc` (any name ending in `.mdc` inside `.cursor/rules/`).",
    copilot: "Save as `.github/copilot-instructions.md` — Copilot Chat and coding agent read it for every request in the repo.",
    windsurf: "Save as `.windsurfrules` at the repo root (Windsurf also supports global rules in its settings).",
  };
  notes.push(placement[to]);

  return { output: body, filename: target.filename, notes };
}

function targetAgentPhrase(to: FormatId): string {
  switch (to) {
    case "claude": return "Claude Code";
    case "copilot": return "Copilot";
    case "cursorrules":
    case "cursor-mdc": return "the agent";
    case "windsurf": return "Cascade";
    default: return "the agent";
  }
}
function targetAgentShort(to: FormatId): string {
  switch (to) {
    case "claude": return "Claude";
    case "copilot": return "Copilot";
    case "windsurf": return "Cascade";
    default: return "the agent";
  }
}

/* --------------------------------- sample --------------------------------- */

const SAMPLE = `# CLAUDE.md

## Commands
- \`pnpm dev\` — dev server on :3000
- \`pnpm test\` — run vitest before committing

## Architecture
Next.js app router. See @docs/architecture.md for the service map.

## Rules
- Claude should never edit files in \`generated/\`.
- DB access only through \`lib/db.ts\`.
`;

/* ----------------------------------- UI ----------------------------------- */

export default function ConverterPage() {
  useToolPageFx();
  const [src, setSrc] = useState("");
  const [from, setFrom] = useState<FormatId>("claude");
  const [to, setTo] = useState<FormatId>("agents");
  const [adaptNames, setAdaptNames] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => (src.trim() ? convert(src, from, to, adaptNames) : null),
    [src, from, to, adaptNames]
  );

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.download = result.filename.split("/").pop() ?? "converted.md";
    a.href = URL.createObjectURL(new Blob([result.output], { type: "text/markdown" }));
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const selStyle: React.CSSProperties = {
    background: "var(--card)",
    color: "var(--bone)",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 14,
    fontWeight: 600,
  };

  return (
    <>
      <ToolNav
        links={[
          { href: "#formats", label: "The formats" },
          { href: "#strategy", label: "Which to use" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#converter"
        ctaLabel="Convert now"
      />

      {/* HERO + TOOL */}
      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free agent config converter · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            AGENTS.md ⇄ <span className="grad">CLAUDE.md</span> ⇄ .cursorrules
          </h1>
          <p className="sub reveal-h d3">
            Switching between <b>Claude Code, Cursor, Codex, Copilot, or Windsurf</b>? Paste your
            agent config and convert it in one click — correct filename, conventions, imports, and
            frontmatter, with notes on exactly what changed.
          </p>

          <div id="converter" className="val-tool reveal-h d4">
            <div className="val-panel val-editor">
              <div className="val-head" style={{ flexWrap: "wrap", gap: 8 }}>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value as FormatId)}
                  style={selStyle}
                  aria-label="Source format"
                >
                  {FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      From: {f.label}
                    </option>
                  ))}
                </select>
                <span style={{ color: "var(--bone-faint)" }}>→</span>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value as FormatId)}
                  style={selStyle}
                  aria-label="Target format"
                >
                  {FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      To: {f.label}
                    </option>
                  ))}
                </select>
                <div className="val-actions">
                  <button className="val-mini" onClick={() => setSrc(SAMPLE)}>
                    Load example
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
                placeholder={`Paste your ${fmt(from).label} here…\n\nConverted live. 100% client-side — nothing is uploaded.`}
                aria-label="Source config contents"
              />
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "10px 16px",
                  fontSize: 13.5,
                  color: "var(--bone-dim)",
                  borderTop: "1px solid var(--line)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={adaptNames}
                  onChange={(e) => setAdaptNames(e.target.checked)}
                  style={{ accentColor: "var(--ember)" }}
                />
                Adapt tool references (e.g. &quot;Claude&quot; → &quot;the agent&quot;)
              </label>
            </div>

            <div className="val-panel val-results" aria-live="polite">
              {!result ? (
                <div className="val-empty">
                  <div className="val-empty-ic">⇄</div>
                  <p>
                    Paste a config on the left, pick the target format, and the converted file
                    appears here with placement notes.
                  </p>
                </div>
              ) : (
                <>
                  <div className="val-verdict good">
                    <span className="v-ic">✓</span>
                    <span>
                      Converted to <b>&nbsp;{result.filename}</b>
                    </span>
                  </div>
                  <div className="val-counts">
                    <button className="val-mini" onClick={copy}>
                      {copied ? "Copied ✓" : "Copy output"}
                    </button>
                    <button className="val-mini" onClick={download}>
                      Download {result.filename.split("/").pop()}
                    </button>
                  </div>
                  <div style={{ padding: "0 16px 8px", overflow: "auto", maxHeight: 320 }}>
                    <pre
                      style={{
                        fontSize: 12.5,
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                        color: "var(--bone-dim)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {result.output}
                    </pre>
                  </div>
                  <ul className="val-findings" style={{ borderTop: "1px solid var(--line)" }}>
                    {result.notes.map((n, i) => (
                      <li key={i} className="val-finding pass">
                        <span className="f-chip">✓</span>
                        <span className="f-body">
                          <span className="f-msg">{renderInline(n)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <p className="micro reveal-h d5">
            100% client-side · nothing uploaded · supports 6 formats in any direction
          </p>
        </div>
      </header>

      {/* FORMATS */}
      <section id="formats">
        <div className="wrap center">
          <div className="tag fade">The formats</div>
          <h2 className="fade">One idea, six file names</h2>
          <p className="lead fade">
            Every AI coding tool reads project instructions from a file — they just disagree on
            what to call it. The content is ~95% identical, which is why conversion is one click.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["◆", "CLAUDE.md", "Claude Code's memory file, loaded every session. Unique power: `@path/to/file.md` imports that pull other docs in automatically."],
              ["🤝", "AGENTS.md", "The emerging open standard — read by OpenAI Codex, Cursor, Google Jules, Zed, and more. If you pick one canonical file, pick this."],
              ["📐", "Cursor rules", "Legacy `.cursorrules` (single file, deprecated) and modern `.cursor/rules/*.mdc` with frontmatter for glob-scoped, always-on, or agent-requested rules."],
              ["🐙", "Copilot & Windsurf", "`.github/copilot-instructions.md` for GitHub Copilot; `.windsurfrules` for Windsurf's Cascade agent. Same markdown, different mailbox."],
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

      {/* STRATEGY */}
      <section id="strategy">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">Which should you keep?</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              The one-source-of-truth setup
            </h2>
          </div>
          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["Make AGENTS.md canonical", "It's the format with the broadest native support, so write your real instructions there once. Every other file becomes a thin pointer."],
              ["CLAUDE.md: one line", "Claude Code supports imports, so your whole CLAUDE.md can be `@AGENTS.md` — zero duplication, and Claude still gets its native file."],
              ["Cursor: scope with .mdc", "Instead of one giant rules file, split Cursor rules into `.cursor/rules/*.mdc` files with `globs` so frontend rules only load for frontend files."],
              ["Don't let them drift", "Duplicate files rot fast — a rule fixed in one file and not the others causes the exact inconsistent behavior these files exist to prevent. Convert, don't copy-paste."],
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
        heading="Agent config questions"
        items={[
          [
            "Does Claude Code read AGENTS.md?",
            "Claude Code's native file is CLAUDE.md, but you don't need to duplicate anything: make CLAUDE.md a single line — `@AGENTS.md` — and Claude imports the standard file automatically.",
          ],
          [
            "Does Cursor read AGENTS.md?",
            "Yes — modern Cursor versions read AGENTS.md alongside their own `.cursor/rules/*.mdc` system. Use .mdc when you want rules scoped to specific globs or triggered on request.",
          ],
          [
            "What happens to my @imports when I convert away from CLAUDE.md?",
            "The converter rewrites each `@path/file.md` as a normal markdown link and tells you it did. Other tools won't auto-load the referenced file, but the pointer keeps the information discoverable.",
          ],
          [
            "What does 'Adapt tool references' do?",
            "When moving between tools it rewrites prose like 'Claude should never edit generated/' to name the target agent (or 'the agent') so the converted file doesn't give another tool instructions addressed to Claude. Uncheck it to keep the original wording.",
          ],
          [
            "Is anything uploaded when I convert?",
            "No — the conversion is plain JavaScript running in your browser. Your config never leaves the page.",
          ],
        ]}
      />

      <KitsUpsell
        heading="Beyond the config file"
        lead={
          <>
            A great AGENTS.md is step one. The ClaudeThings kits add the agents, skills, and slash
            commands on top — the full working setup for engineering and marketing teams.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>This converter handles the format-specific conventions</b> (filenames, imports,
            frontmatter, placement) between community and vendor formats as publicly documented.
            Tool behaviors evolve — check your tool&apos;s docs for the latest. Everything runs in
            your browser; nothing you paste is uploaded or stored.
          </>
        }
      />
    </>
  );
}
