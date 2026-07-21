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
 * Claude Code slash command generator — form in, valid .claude/commands/*.md
 * out. 100% client-side.
 */

const PRESETS: Record<
  string,
  { name: string; description: string; argHint: string; allowedTools: string; context: string; prompt: string }
> = {
  commit: {
    name: "commit",
    description: "Create a well-formed git commit from staged and unstaged changes",
    argHint: "[optional message hint]",
    allowedTools: "Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*)",
    context: "git status\ngit diff HEAD",
    prompt:
      "Based on the changes above, create a single git commit.\n\n- Write a conventional-commit style message (feat/fix/chore…), imperative mood, under 72 chars in the subject.\n- Stage the relevant files and commit.\n- If the changes look like they should be multiple commits, say so and propose the split instead of committing.\n\nMessage hint from the user (may be empty): $ARGUMENTS",
  },
  review: {
    name: "review-pr",
    description: "Review a pull request by number with a severity-ranked report",
    argHint: "[pr-number]",
    allowedTools: "Bash(gh pr view:*), Bash(gh pr diff:*), Read, Grep, Glob",
    context: "gh pr view $1\ngh pr diff $1",
    prompt:
      "Review PR #$1 using the details and diff above.\n\nCheck correctness, security, error handling, performance, and test coverage. Read surrounding source files when the diff alone is ambiguous.\n\nReport findings ranked by severity with file:line references and concrete fixes. End with a verdict: approve, approve with nits, or request changes.",
  },
  explain: {
    name: "explain",
    description: "Explain how a file or feature works, with a diagram",
    argHint: "[file or feature]",
    allowedTools: "Read, Grep, Glob",
    context: "",
    prompt:
      "Explain how $ARGUMENTS works in this codebase.\n\n1. Find the relevant files (search if a feature was named rather than a path).\n2. Explain the flow end-to-end for someone new to the repo — entry points, key functions, data flow.\n3. Include a small text/mermaid diagram of the flow.\n4. List the 3 files someone should read first, in order.",
  },
};

function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/^\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SlashCommandPage() {
  useToolPageFx();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [argHint, setArgHint] = useState("");
  const [allowedTools, setAllowedTools] = useState("");
  const [context, setContext] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const loadPreset = (key: string) => {
    const p = PRESETS[key];
    setName(p.name);
    setDescription(p.description);
    setArgHint(p.argHint);
    setAllowedTools(p.allowedTools);
    setContext(p.context);
    setPrompt(p.prompt);
  };

  const cleanName = kebab(name);

  const generated = useMemo(() => {
    if (!cleanName || !prompt.trim()) return null;
    const fmLines = [
      ...(allowedTools.trim() ? [`allowed-tools: ${allowedTools.trim()}`] : []),
      ...(argHint.trim() ? [`argument-hint: ${argHint.trim()}`] : []),
      ...(description.trim() ? [`description: ${description.trim()}`] : []),
    ];
    const fm = fmLines.length ? `---\n${fmLines.join("\n")}\n---\n\n` : "";

    const ctxBlock = context.trim()
      ? `## Context\n\n${context
          .split("\n")
          .map((c) => c.trim())
          .filter(Boolean)
          .map((c) => `- !\`${c}\``)
          .join("\n")}\n\n## Task\n\n`
      : "";

    return `${fm}${ctxBlock}${prompt.trim()}\n`;
  }, [cleanName, description, argHint, allowedTools, context, prompt]);

  const usesArgs = /\$ARGUMENTS|\$\d/.test(prompt + context);

  const copy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    if (!generated) return;
    const a = document.createElement("a");
    a.download = `${cleanName}.md`;
    a.href = URL.createObjectURL(new Blob([generated], { type: "text/markdown" }));
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const field: React.CSSProperties = {
    width: "100%",
    background: "var(--card)",
    color: "var(--bone)",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "inherit",
  };
  const label: React.CSSProperties = { fontSize: 13.5, fontWeight: 700, display: "block", marginBottom: 6 };

  return (
    <>
      <ToolNav
        links={[
          { href: "#anatomy", label: "Anatomy" },
          { href: "#patterns", label: "Patterns" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#generator"
        ctaLabel="Build a command"
      />

      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free slash command generator · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            Build a <span className="grad">/slash command</span> for Claude Code
          </h1>
          <p className="sub reveal-h d3">
            Turn your most-repeated prompt into a proper command: frontmatter, <b>$ARGUMENTS</b>,
            live <b>!`bash`</b> context, and the right file in <b>.claude/commands/</b> — with a
            live preview as you type.
          </p>

          <div id="generator" className="val-tool reveal-h d4">
            {/* form */}
            <div className="val-panel" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <button className="val-mini" onClick={() => loadPreset("commit")}>/commit preset</button>
                <button className="val-mini" onClick={() => loadPreset("review")}>/review-pr preset</button>
                <button className="val-mini" onClick={() => loadPreset("explain")}>/explain preset</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={label}>
                    Command name{" "}
                    {cleanName && <span className="accent" style={{ fontFamily: "var(--font-mono)" }}>/{cleanName}</span>}
                  </label>
                  <input style={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="commit" aria-label="Command name" />
                </div>
                <div>
                  <label style={label}>Description (shows in /help)</label>
                  <input style={field} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Create a well-formed git commit" aria-label="Description" />
                </div>
                <div>
                  <label style={label}>Argument hint (shows during autocomplete)</label>
                  <input style={field} value={argHint} onChange={(e) => setArgHint(e.target.value)} placeholder="[pr-number] or [message]" aria-label="Argument hint" />
                </div>
                <div>
                  <label style={label}>Allowed tools (needed for !`bash` context)</label>
                  <input style={field} value={allowedTools} onChange={(e) => setAllowedTools(e.target.value)} placeholder="Bash(git status:*), Bash(git diff:*)" aria-label="Allowed tools" />
                </div>
                <div>
                  <label style={label}>Bash context — one command per line (becomes !`cmd` lines)</label>
                  <textarea style={{ ...field, minHeight: 60 }} value={context} onChange={(e) => setContext(e.target.value)} placeholder={"git status\ngit diff HEAD"} aria-label="Context commands" />
                </div>
                <div>
                  <label style={label}>
                    Prompt — use <code>$ARGUMENTS</code> or <code>$1</code>, <code>$2</code> for arguments
                  </label>
                  <textarea style={{ ...field, minHeight: 120 }} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={"Based on the changes above, create a git commit…\n\nUser hint: $ARGUMENTS"} aria-label="Prompt body" />
                </div>
              </div>
            </div>

            {/* preview */}
            <div className="val-panel val-results" aria-live="polite">
              {!generated ? (
                <div className="val-empty">
                  <div className="val-empty-ic">/</div>
                  <p>Give the command a <code>name</code> and a <code>prompt</code> (or load a preset) and the file appears here.</p>
                </div>
              ) : (
                <>
                  <div className="val-verdict good">
                    <span className="v-ic">/</span>
                    <span>
                      .claude/commands/{cleanName}.md
                      {argHint && !usesArgs ? " — hint set but prompt never uses $ARGUMENTS/$1" : ""}
                    </span>
                  </div>
                  <div className="val-counts">
                    <button className="val-mini" onClick={copy}>{copied ? "Copied ✓" : "Copy file"}</button>
                    <button className="val-mini" onClick={download}>Download</button>
                  </div>
                  <div style={{ padding: "0 16px 16px", overflow: "auto" }}>
                    <pre style={{ fontSize: 12.5, lineHeight: 1.55, whiteSpace: "pre-wrap", color: "var(--bone-dim)", fontFamily: "var(--font-mono)" }}>
                      {generated}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="micro reveal-h d5">
            100% client-side · save to <code>.claude/commands/</code> (project) or <code>~/.claude/commands/</code> (personal)
          </p>
        </div>
      </header>

      {/* ANATOMY */}
      <section id="anatomy">
        <div className="wrap center">
          <div className="tag fade">Anatomy</div>
          <h2 className="fade">Everything a command file can do</h2>
          <p className="lead fade">
            A slash command is a markdown file whose name becomes the command. Four features turn
            it from a canned prompt into a small program.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["📝", "Frontmatter", "`description` (shows in /help), `argument-hint` (autocomplete), `allowed-tools` (pre-approves the bash the command needs), and optional `model`."],
              ["🧩", "Arguments", "`$ARGUMENTS` grabs everything after the command; `$1`, `$2`… grab positional args — so `/fix-issue 123 high` can slot values exactly where they belong."],
              ["⚡", "Live bash context", "Lines like `!`git diff HEAD`` run before the prompt and inject real output — the command reasons about your actual repo state, not a guess."],
              ["📎", "File references", "`@src/utils/helpers.ts` inlines a file's contents into the prompt, so commands can review or compare specific files."],
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

      {/* PATTERNS */}
      <section id="patterns">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">Patterns</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Commands worth stealing
            </h2>
          </div>
          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["The context-first command", "Put `!`git status`` / `!`git diff`` under a `## Context` heading, your instructions under `## Task`. The model gets state before instructions — accuracy jumps."],
              ["The scoped permissions trick", "`allowed-tools: Bash(git commit:*)` pre-approves exactly the commands your slash command needs and nothing else — no permission prompts, no over-granting."],
              ["Namespacing with folders", "`.claude/commands/frontend/component.md` becomes `/frontend:component`. Group your team's commands by domain instead of one flat pile."],
              ["Commit them", "Project commands live in the repo, so `/commit`, `/review-pr`, and `/deploy-check` behave identically for every teammate — prompt engineering that ships like code."],
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
        heading="Slash command questions"
        items={[
          [
            "Where do slash command files go?",
            "Project commands: `.claude/commands/` in your repo (shared, shown as '(project)' in /help). Personal commands: `~/.claude/commands/` (available in all your projects). Subfolders become namespaces: `frontend/component.md` → `/frontend:component`.",
          ],
          [
            "Why isn't my !`command` running?",
            "Two usual causes: the line must start with `!` immediately followed by a backticked command, and the command needs to be covered by `allowed-tools` in the frontmatter (e.g. `Bash(git diff:*)`).",
          ],
          [
            "Can a slash command use a specific model?",
            "Yes — add `model: haiku` (or sonnet/opus) to the frontmatter. Cheap models are great for mechanical commands like changelog formatting; keep your default model for judgment calls.",
          ],
          [
            "How is this different from a skill?",
            "Commands are single prompts you invoke explicitly. Skills are folders (SKILL.md + resources) that Claude loads automatically when relevant. If your command keeps growing sections, it probably wants to be a skill — try our SKILL.md validator next.",
          ],
          [
            "Is anything uploaded when I use this generator?",
            "No — it's entirely client-side. Your prompts never leave the browser.",
          ],
        ]}
      />

      <KitsUpsell
        heading="181 commands, already written"
        lead={
          <>
            This builder makes one great command. The AgentsKit kits ship 181 of them —
            commit flows, review pipelines, deploy checks, content workflows — plus the agents and
            skills they orchestrate.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>This generator follows the public Claude Code slash-command format</b> (frontmatter
            fields, argument placeholders, bash-context syntax) as documented by Anthropic. The
            format evolves — check the official docs if a feature doesn&apos;t work. Everything
            runs in your browser; nothing you type is uploaded or stored.
          </>
        }
      />
    </>
  );
}
