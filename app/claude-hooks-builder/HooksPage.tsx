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
 * Claude Code hooks builder — visual rules in, valid settings.json out.
 * 100% client-side.
 */

/* --------------------------------- model --------------------------------- */

const EVENTS = [
  ["PreToolUse", "Before a tool runs (can block it)"],
  ["PostToolUse", "After a tool succeeds"],
  ["UserPromptSubmit", "When you submit a prompt"],
  ["Notification", "When Claude sends a notification"],
  ["Stop", "When Claude finishes responding"],
  ["SubagentStop", "When a subagent finishes"],
  ["PreCompact", "Before context compaction"],
  ["SessionStart", "When a session starts/resumes"],
  ["SessionEnd", "When a session ends"],
] as const;

type EventName = (typeof EVENTS)[number][0];

/** Which events use a matcher, and its meaning. */
const MATCHER_KIND: Record<EventName, "tool" | "compact" | "source" | "none"> = {
  PreToolUse: "tool",
  PostToolUse: "tool",
  UserPromptSubmit: "none",
  Notification: "none",
  Stop: "none",
  SubagentStop: "none",
  PreCompact: "compact",
  SessionStart: "source",
  SessionEnd: "none",
};

interface HookRule {
  id: number;
  event: EventName;
  matcher: string;
  command: string;
  timeout: string; // keep as string for the input; parsed on generate
}

let nextId = 1;
const newRule = (partial?: Partial<HookRule>): HookRule => ({
  id: nextId++,
  event: "PostToolUse",
  matcher: "Edit|Write",
  command: "",
  timeout: "",
  ...partial,
});

const PRESETS: Record<string, () => HookRule> = {
  format: () =>
    newRule({
      event: "PostToolUse",
      matcher: "Edit|Write",
      command:
        "jq -r '.tool_input.file_path' | { read f; [[ \"$f\" == *.ts || \"$f\" == *.tsx ]] && npx prettier --write \"$f\"; } || true",
    }),
  log: () =>
    newRule({
      event: "PreToolUse",
      matcher: "Bash",
      command: "jq -r '\"\\(.tool_input.command) — \\(.tool_input.description // \"no description\")\"' >> ~/.claude/bash-log.txt",
    }),
  protect: () =>
    newRule({
      event: "PreToolUse",
      matcher: "Edit|Write",
      command:
        "jq -r '.tool_input.file_path' | grep -qE '\\.(env|pem|key)$' && { echo 'Blocked: sensitive file' >&2; exit 2; } || exit 0",
    }),
  notify: () =>
    newRule({
      event: "Notification",
      matcher: "",
      command: "osascript -e 'display notification \"Claude Code needs your input\" with title \"Claude\"'",
    }),
};

/* -------------------------------- generation -------------------------------- */

function buildSettings(rules: HookRule[]): { json: string; warnings: string[] } {
  const warnings: string[] = [];
  const hooks: Record<string, Array<{ matcher?: string; hooks: Array<Record<string, unknown>> }>> = {};

  for (const r of rules) {
    if (!r.command.trim()) continue;
    const kind = MATCHER_KIND[r.event];
    const entry: { matcher?: string; hooks: Array<Record<string, unknown>> } = {
      hooks: [
        {
          type: "command",
          command: r.command.trim(),
          ...(r.timeout && !isNaN(+r.timeout) && +r.timeout > 0 ? { timeout: +r.timeout } : {}),
        },
      ],
    };
    if (kind !== "none") {
      entry.matcher = r.matcher.trim() || "*";
    } else if (r.matcher.trim()) {
      warnings.push(`${r.event} hooks don't use a matcher — it was omitted from the JSON.`);
    }
    hooks[r.event] = hooks[r.event] ?? [];
    hooks[r.event].push(entry);
  }

  return { json: JSON.stringify({ hooks }, null, 2), warnings };
}

/* ----------------------------------- UI ----------------------------------- */

export default function HooksPage() {
  useToolPageFx();
  const [rules, setRules] = useState<HookRule[]>([PRESETS.format()]);
  const [copied, setCopied] = useState(false);

  const update = (id: number, patch: Partial<HookRule>) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRules((rs) => rs.filter((r) => r.id !== id));

  const { json, warnings } = useMemo(() => buildSettings(rules), [rules]);
  const hasOutput = rules.some((r) => r.command.trim());

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.download = "settings.json";
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const field: React.CSSProperties = {
    width: "100%",
    background: "var(--card)",
    color: "var(--bone)",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "9px 11px",
    fontSize: 13.5,
    fontFamily: "inherit",
  };

  return (
    <>
      <ToolNav
        links={[
          { href: "#events", label: "The events" },
          { href: "#recipes", label: "Recipes" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#builder"
        ctaLabel="Build my hooks"
      />

      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free hooks builder · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            Claude Code <span className="grad">hooks</span>, without the JSON pain
          </h1>
          <p className="sub reveal-h d3">
            Hooks are the most powerful (and most mistyped) feature in Claude Code. Pick an event,
            set a matcher and command, and get a <b>valid settings.json</b> — auto-format on save,
            block dangerous edits, log every command, get notified.
          </p>

          <div id="builder" className="val-tool reveal-h d4">
            {/* rules */}
            <div className="val-panel" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <button className="val-mini" onClick={() => setRules((r) => [...r, PRESETS.format()])}>+ Auto-format</button>
                <button className="val-mini" onClick={() => setRules((r) => [...r, PRESETS.protect()])}>+ Protect files</button>
                <button className="val-mini" onClick={() => setRules((r) => [...r, PRESETS.log()])}>+ Log bash</button>
                <button className="val-mini" onClick={() => setRules((r) => [...r, PRESETS.notify()])}>+ Notify (macOS)</button>
                <button className="val-mini" onClick={() => setRules((r) => [...r, newRule({ command: "" })])}>+ Blank rule</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {rules.map((r, idx) => {
                  const kind = MATCHER_KIND[r.event];
                  return (
                    <div key={r.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <b style={{ fontSize: 13, color: "var(--bone-dim)" }}>Hook {idx + 1}</b>
                        <button className="val-mini" onClick={() => remove(r.id)}>Remove</button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <select
                          style={field}
                          value={r.event}
                          onChange={(e) => {
                            const event = e.target.value as EventName;
                            const k = MATCHER_KIND[event];
                            update(r.id, {
                              event,
                              matcher: k === "tool" ? r.matcher || "Edit|Write" : k === "compact" ? "auto" : k === "source" ? "startup" : "",
                            });
                          }}
                          aria-label="Hook event"
                        >
                          {EVENTS.map(([e, hint]) => (
                            <option key={e} value={e}>
                              {e} — {hint}
                            </option>
                          ))}
                        </select>
                        {kind !== "none" && (
                          <input
                            style={field}
                            value={r.matcher}
                            onChange={(e) => update(r.id, { matcher: e.target.value })}
                            placeholder={kind === "tool" ? 'Matcher: tool name(s), e.g. Bash or Edit|Write or *' : kind === "compact" ? "manual | auto" : "startup | resume | clear"}
                            aria-label="Matcher"
                          />
                        )}
                        <textarea
                          style={{ ...field, minHeight: 64, fontFamily: "var(--font-mono)", fontSize: 12.5 }}
                          value={r.command}
                          onChange={(e) => update(r.id, { command: e.target.value })}
                          placeholder="Shell command — receives the event JSON on stdin"
                          aria-label="Hook command"
                        />
                        <input
                          style={{ ...field, maxWidth: 220 }}
                          value={r.timeout}
                          onChange={(e) => update(r.id, { timeout: e.target.value })}
                          placeholder="Timeout seconds (optional)"
                          aria-label="Timeout in seconds"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* output */}
            <div className="val-panel val-results" aria-live="polite">
              {!hasOutput ? (
                <div className="val-empty">
                  <div className="val-empty-ic">⚙️</div>
                  <p>Add a rule (the presets are one click) and the valid <code>settings.json</code> appears here.</p>
                </div>
              ) : (
                <>
                  <div className="val-verdict good">
                    <span className="v-ic">✓</span>
                    <span>Valid hooks config — paste into .claude/settings.json</span>
                  </div>
                  <div className="val-counts">
                    <button className="val-mini" onClick={copy}>{copied ? "Copied ✓" : "Copy JSON"}</button>
                    <button className="val-mini" onClick={download}>Download settings.json</button>
                  </div>
                  {warnings.length > 0 && (
                    <ul className="val-findings">
                      {warnings.map((w, i) => (
                        <li key={i} className="val-finding warn">
                          <span className="f-chip">!</span>
                          <span className="f-body"><span className="f-msg">{w}</span></span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div style={{ padding: "0 16px 16px", overflow: "auto" }}>
                    <pre style={{ fontSize: 12.5, lineHeight: 1.55, whiteSpace: "pre", color: "var(--bone-dim)", fontFamily: "var(--font-mono)" }}>
                      {json}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="micro reveal-h d5">
            100% client-side · hooks run shell commands — only use commands you understand
          </p>
        </div>
      </header>

      {/* EVENTS */}
      <section id="events">
        <div className="wrap center">
          <div className="tag fade">The events</div>
          <h2 className="fade">Nine places to intercept Claude Code</h2>
          <p className="lead fade">
            Hooks turn &quot;please always run prettier&quot; from a hope in CLAUDE.md into a
            guarantee — the app runs your command every time, deterministically.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["🛡️", "PreToolUse", "Runs before a tool call and can block it: exit code 2 stops the action and sends stderr back to Claude. The place for guardrails — protect `.env`, block `rm -rf`, enforce your deploy process."],
              ["🪄", "PostToolUse", "Runs after a tool succeeds. The classic: match `Edit|Write` and auto-format the touched file. Also great for type-checking, test-triggering, and change logs."],
              ["💬", "UserPromptSubmit & Stop", "Inject context or validation when you submit a prompt; run cleanup, linters, or notifications when Claude finishes a response (or a subagent does)."],
              ["🔄", "Session & compaction", "SessionStart loads context when you begin or resume; PreCompact fires before Claude compresses history; SessionEnd is your teardown hook."],
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

      {/* RECIPES */}
      <section id="recipes">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">Recipes</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              The four hooks everyone ends up wanting
            </h2>
          </div>
          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["Auto-format every edit", "PostToolUse on `Edit|Write` → read the file path from the event JSON with `jq`, run prettier/ruff/gofmt on it. Claude's edits always land formatted."],
              ["Protect sensitive files", "PreToolUse on `Edit|Write` → if the path matches `.env`, keys, or lockfiles, `exit 2` with a reason on stderr. Claude sees why and works around it."],
              ["Audit every bash command", "PreToolUse on `Bash` → append the command + description to a log file. A complete audit trail of everything Claude ran, for free."],
              ["Ping when it needs you", "Notification → `osascript` (macOS) or `notify-send` (Linux). Walk away from long sessions; get pinged the moment Claude is waiting on you."],
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
        heading="Hooks questions"
        items={[
          [
            "What data does my hook command receive?",
            "The event payload as JSON on stdin — session id, tool name, and `tool_input` (for tool events the exact arguments, like `.tool_input.file_path` or `.tool_input.command`). `jq` is the standard way to pull fields out.",
          ],
          [
            "What's the difference between exit codes 0, 2, and others?",
            "0 = success (stdout shown in transcript; for UserPromptSubmit it's added as context). 2 = blocking error — stops the action and feeds stderr to Claude. Anything else = non-blocking error shown to you.",
          ],
          [
            "Which settings file should I use?",
            "`.claude/settings.json` for team-shared project hooks (committed), `.claude/settings.local.json` for personal project hooks (gitignored), `~/.claude/settings.json` for hooks you want everywhere.",
          ],
          [
            "Why isn't my hook firing?",
            "Check: the JSON is under a top-level `hooks` key, the event name is exact (case-sensitive), the matcher matches the real tool name, and you restarted Claude Code — hooks are snapshotted at startup, so run `/hooks` to verify what's loaded.",
          ],
          [
            "Can hooks run scripts instead of inline commands?",
            "Yes, and for anything non-trivial you should: point the command at a script (`\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check.sh`) so it's versioned, testable, and readable instead of a one-line jq puzzle.",
          ],
        ]}
      />

      <KitsUpsell
        heading="Hooks are one piece of the setup"
        lead={
          <>
            The ClaudeThings kits ship complete Claude Code environments — agents, skills, and
            commands engineered to work together, hooks-friendly out of the box.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>Hooks execute arbitrary shell commands with your user&apos;s permissions.</b> The
            presets here are common community patterns — review and test any command before adding
            it to your settings, and prefer scripts checked into your repo. This builder follows
            the public Claude Code hooks format; everything runs in your browser and nothing is
            uploaded.
          </>
        }
      />
    </>
  );
}
