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
 * Claude Code subagent generator — form in, valid .claude/agents/*.md out.
 * 100% client-side.
 */

const ALL_TOOLS = [
  "Read",
  "Write",
  "Edit",
  "Bash",
  "Grep",
  "Glob",
  "WebFetch",
  "WebSearch",
  "Task",
  "NotebookEdit",
] as const;

const MODELS = [
  ["", "Inherit (default)"],
  ["sonnet", "Sonnet — balanced (recommended)"],
  ["opus", "Opus — hardest problems"],
  ["haiku", "Haiku — fast & cheap"],
] as const;

const PRESETS: Record<
  string,
  { name: string; description: string; tools: string[]; model: string; role: string; process: string; output: string }
> = {
  reviewer: {
    name: "code-reviewer",
    description:
      "Expert code review specialist. Use PROACTIVELY after writing or modifying code to check quality, security, and maintainability before committing.",
    tools: ["Read", "Grep", "Glob", "Bash"],
    model: "sonnet",
    role: "You are a senior code reviewer with a bias for shipping: you flag what genuinely matters and skip nitpicks a formatter would catch.",
    process:
      "Run git diff to see recent changes.\nRead each modified file fully — review in context, not just the diff.\nCheck: correctness, security (injection, secrets, authz), error handling, performance on hot paths, and test coverage for changed logic.",
    output:
      "Report findings grouped by severity (critical / warning / suggestion). For each: file:line, the issue in one sentence, and a concrete fix. End with an overall verdict: approve or request changes.",
  },
  debugger: {
    name: "debugger",
    description:
      "Debugging specialist for errors, test failures, and unexpected behavior. Use PROACTIVELY when anything fails or behaves strangely.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "sonnet",
    role: "You are an expert debugger who finds root causes instead of patching symptoms.",
    process:
      "Capture the exact error message and stack trace.\nReproduce the failure with the smallest possible command.\nForm a hypothesis, add targeted logging or inspection, and confirm it before touching the fix.\nImplement the minimal fix at the root cause.",
    output:
      "Explain: root cause (with evidence), the fix you applied, how you verified it, and what would prevent this class of bug.",
  },
  tester: {
    name: "test-runner",
    description:
      "Test automation specialist. Use PROACTIVELY to run tests after code changes and fix failures without breaking test intent.",
    tools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "sonnet",
    role: "You are a test automation expert. You treat failing tests as specifications, never as obstacles.",
    process:
      "Detect the project's test runner from package.json / pyproject / Makefile.\nRun the relevant test suite.\nFor each failure: read the test to understand intent, then fix the code (or the test, only if the test itself is wrong — say so explicitly).",
    output: "Summary: suites run, pass/fail counts, each failure's cause and fix, and remaining risks.",
  },
};

function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export default function SubagentPage() {
  useToolPageFx();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState<string[]>(["Read", "Grep", "Glob"]);
  const [inheritAll, setInheritAll] = useState(false);
  const [model, setModel] = useState("");
  const [role, setRole] = useState("");
  const [process, setProcess] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const loadPreset = (key: string) => {
    const p = PRESETS[key];
    setName(p.name);
    setDescription(p.description);
    setTools(p.tools);
    setInheritAll(false);
    setModel(p.model);
    setRole(p.role);
    setProcess(p.process);
    setOutput(p.output);
  };

  const cleanName = kebab(name);

  const generated = useMemo(() => {
    if (!cleanName || !description.trim()) return null;
    const fm = [
      "---",
      `name: ${cleanName}`,
      `description: ${description.trim().replace(/\n+/g, " ")}`,
      ...(!inheritAll && tools.length ? [`tools: ${tools.join(", ")}`] : []),
      ...(model ? [`model: ${model}`] : []),
      "---",
    ].join("\n");

    const steps = process
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s, i) => `${i + 1}. ${s}`)
      .join("\n");

    const body = [
      ``,
      role.trim() || `You are a specialist ${cleanName.replace(/-/g, " ")}.`,
      ``,
      `## When invoked`,
      ``,
      steps || `1. Understand the request and gather the context you need.\n2. Do the work step by step.\n3. Verify the result before reporting.`,
      ``,
      `## Output`,
      ``,
      output.trim() || `Report what you did, what you found, and any follow-ups the main agent should consider.`,
      ``,
    ].join("\n");

    return `${fm}\n${body}`;
  }, [cleanName, description, tools, inheritAll, model, role, process, output]);

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
          { href: "#tips", label: "Design tips" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#generator"
        ctaLabel="Generate one"
      />

      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free subagent generator · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            Generate a <span className="grad">Claude Code subagent</span> in 60 seconds
          </h1>
          <p className="sub reveal-h d3">
            Describe the role, pick tools and model, and get a valid <b>.claude/agents/*.md</b>{" "}
            file — correct frontmatter, scoped permissions, and a system prompt structured the way
            good subagents actually work.
          </p>

          <div id="generator" className="val-tool reveal-h d4">
            {/* form */}
            <div className="val-panel" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <button className="val-mini" onClick={() => loadPreset("reviewer")}>Code reviewer preset</button>
                <button className="val-mini" onClick={() => loadPreset("debugger")}>Debugger preset</button>
                <button className="val-mini" onClick={() => loadPreset("tester")}>Test runner preset</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={label}>
                    Name {name && cleanName !== name && <span style={{ color: "var(--amber)" }}>→ {cleanName}</span>}
                  </label>
                  <input style={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="code-reviewer" aria-label="Subagent name" />
                </div>
                <div>
                  <label style={label}>Description — when should Claude delegate to it?</label>
                  <textarea style={{ ...field, minHeight: 64 }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Expert code review specialist. Use PROACTIVELY after writing or modifying code…" aria-label="Subagent description" />
                </div>
                <div>
                  <span style={label}>Tools</span>
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13.5, color: "var(--bone-dim)", marginBottom: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={inheritAll} onChange={(e) => setInheritAll(e.target.checked)} style={{ accentColor: "var(--ember)" }} />
                    Inherit all tools (omit the field — includes MCP tools)
                  </label>
                  {!inheritAll && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {ALL_TOOLS.map((t) => {
                        const on = tools.includes(t);
                        return (
                          <button
                            key={t}
                            onClick={() => setTools(on ? tools.filter((x) => x !== t) : [...tools, t])}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 999,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                              border: `1px solid ${on ? "var(--ember)" : "var(--line)"}`,
                              background: on ? "rgba(224,78,27,.1)" : "transparent",
                              color: on ? "var(--bone)" : "var(--bone-dim)",
                            }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div>
                  <label style={label}>Model</label>
                  <select style={field} value={model} onChange={(e) => setModel(e.target.value)} aria-label="Model">
                    {MODELS.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={label}>Role (one sentence)</label>
                  <input style={field} value={role} onChange={(e) => setRole(e.target.value)} placeholder="You are a senior code reviewer…" aria-label="Role" />
                </div>
                <div>
                  <label style={label}>Process — one step per line</label>
                  <textarea style={{ ...field, minHeight: 84 }} value={process} onChange={(e) => setProcess(e.target.value)} placeholder={"Run git diff to see changes\nRead each modified file\nCheck correctness, security, tests"} aria-label="Process steps" />
                </div>
                <div>
                  <label style={label}>Output format</label>
                  <textarea style={{ ...field, minHeight: 56 }} value={output} onChange={(e) => setOutput(e.target.value)} placeholder="Findings grouped by severity, each with file:line and a concrete fix…" aria-label="Output format" />
                </div>
              </div>
            </div>

            {/* preview */}
            <div className="val-panel val-results" aria-live="polite">
              {!generated ? (
                <div className="val-empty">
                  <div className="val-empty-ic">🤖</div>
                  <p>Fill in a <code>name</code> and <code>description</code> (or load a preset) and your subagent file appears here.</p>
                </div>
              ) : (
                <>
                  <div className="val-verdict good">
                    <span className="v-ic">✓</span>
                    <span>.claude/agents/{cleanName}.md</span>
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
            100% client-side · save to <code>.claude/agents/</code> (project) or <code>~/.claude/agents/</code> (personal)
          </p>
        </div>
      </header>

      {/* ANATOMY */}
      <section id="anatomy">
        <div className="wrap center">
          <div className="tag fade">Anatomy</div>
          <h2 className="fade">What makes a valid subagent file</h2>
          <p className="lead fade">
            A subagent is one markdown file: YAML frontmatter that controls routing and
            permissions, then the system prompt the subagent runs with.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["🔑", "name", "Unique kebab-case identifier — it becomes how you invoke it (`use the code-reviewer subagent`) and the filename."],
              ["🎯", "description", "How Claude decides to delegate. Lead with the role, then the trigger: phrases like `Use PROACTIVELY after code changes` measurably increase automatic invocation."],
              ["🧰", "tools", "Optional allowlist. Omit to inherit everything (including MCP tools); list the minimum set for safety and predictability."],
              ["🧠", "model + prompt", "Optional `model` (sonnet/opus/haiku/inherit) plus the body — the subagent's entire system prompt. It starts with zero context from your conversation, so the prompt must stand alone."],
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

      {/* TIPS */}
      <section id="tips">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">Design tips</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Subagents that actually get used
            </h2>
          </div>
          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["One job per agent", "A 'code-reviewer' outperforms a 'code-helper'. Narrow scope means a sharper prompt, fewer tools, and more reliable automatic delegation."],
              ["Write the trigger into the description", "Claude matches tasks against descriptions. 'Use PROACTIVELY when tests fail' fires; 'helps with testing' doesn't."],
              ["Assume zero context", "Subagents don't see your conversation. The prompt must say how to gather context itself — which files to read, which commands to run first."],
              ["Version them with the repo", "Keep project subagents in `.claude/agents/` and commit them. Your whole team gets the same specialists, and improvements ship like code."],
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
        heading="Subagent questions"
        items={[
          [
            "How do I use a subagent once it's saved?",
            "Claude Code delegates automatically when a task matches the description, or you can invoke it explicitly: 'use the code-reviewer subagent to check my changes'. Run `/agents` to see everything loaded.",
          ],
          [
            "Project vs personal subagents?",
            "Project subagents (.claude/agents/ in the repo) are shared with your team and win on name conflicts. Personal ones (~/.claude/agents/) follow you across projects.",
          ],
          [
            "Why does my subagent never trigger automatically?",
            "Almost always the description: it describes what the agent is instead of when to use it. Rewrite it trigger-first ('Use PROACTIVELY after…', 'MUST BE USED when…') and it starts firing.",
          ],
          [
            "Do subagents share my conversation context?",
            "No — each invocation starts with a clean context window containing only the subagent's system prompt and the task Claude hands it. That isolation is the point: research and noisy tool output stay out of your main thread.",
          ],
          [
            "Can a subagent use MCP tools?",
            "Yes. If you omit the tools field it inherits all tools including MCP servers'. To scope it, list the specific MCP tool names alongside built-ins.",
          ],
        ]}
      />

      <KitsUpsell
        heading="Want 89 subagents already engineered?"
        lead={
          <>
            This generator gives you a great starting file. The AgentsKit kits give you the full
            bench — 89 production-grade agents plus the skills and commands they pair with.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>This generator produces files following the public Claude Code subagent format</b>{" "}
            (frontmatter fields, placement, and conventions as documented by Anthropic). Formats
            evolve — check the official docs if something doesn&apos;t load. Everything runs in
            your browser; nothing you type is uploaded or stored.
          </>
        }
      />
    </>
  );
}
