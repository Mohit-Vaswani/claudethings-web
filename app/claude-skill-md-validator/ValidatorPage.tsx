"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Free SKILL.md validator / linter for Claude Code Agent Skills.
 * 100% client-side — the pasted skill never leaves the browser.
 * Reuses the global design system in app/globals.css so it matches the main site.
 */

/* ----------------------------- validation engine ----------------------------- */

type Severity = "error" | "warn" | "pass";

interface Finding {
  severity: Severity;
  rule: string;
  message: string;
}

interface Parsed {
  hasFrontmatter: boolean;
  preamble: string; // any junk before the opening ---
  frontmatterRaw: string;
  body: string;
  keys: Record<string, string>; // top-level scalar keys (first value line)
  topLevelKeyList: string[];
  yamlErrors: string[];
}

const KNOWN_KEYS = new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
  "version",
  "author",
  "homepage",
]);

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESC = 1024;
const MAX_BODY_LINES = 500;

function parseSkill(src: string): Parsed {
  const parsed: Parsed = {
    hasFrontmatter: false,
    preamble: "",
    frontmatterRaw: "",
    body: src,
    keys: {},
    topLevelKeyList: [],
    yamlErrors: [],
  };

  // Normalise line endings, keep a BOM-free start.
  const text = src.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  // Find the opening fence (must be the very first non-empty line to be valid,
  // but we tolerate leading blank lines and record anything else as preamble).
  let openIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;
    if (lines[i].trim() === "---") openIdx = i;
    break;
  }
  if (openIdx === -1) {
    return parsed; // no frontmatter at all
  }
  parsed.preamble = lines.slice(0, openIdx).join("\n");

  // Find the closing fence.
  let closeIdx = -1;
  for (let i = openIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      closeIdx = i;
      break;
    }
  }
  if (closeIdx === -1) {
    parsed.yamlErrors.push("The frontmatter is never closed — add a matching `---` line.");
    parsed.frontmatterRaw = lines.slice(openIdx + 1).join("\n");
    parsed.body = "";
    return parsed;
  }

  parsed.hasFrontmatter = true;
  const fmLines = lines.slice(openIdx + 1, closeIdx);
  parsed.frontmatterRaw = fmLines.join("\n");
  parsed.body = lines.slice(closeIdx + 1).join("\n").replace(/^\n+/, "");

  // Minimal top-level YAML scan. We only care about unindented `key: value`
  // lines and their (possibly multi-line/quoted) scalar value.
  let currentKey: string | null = null;
  let currentVal: string[] = [];
  const commit = () => {
    if (currentKey !== null) {
      parsed.keys[currentKey] = currentVal.join(" ").trim();
    }
    currentKey = null;
    currentVal = [];
  };

  for (const raw of fmLines) {
    if (raw.trim() === "") continue;
    const indented = /^\s/.test(raw);
    const kv = raw.match(/^([A-Za-z0-9_-]+):(?:\s+(.*))?$/);
    if (!indented && kv) {
      commit();
      const key = kv[1];
      currentKey = key;
      parsed.topLevelKeyList.push(key);
      let val = (kv[2] ?? "").trim();
      // strip surrounding quotes for scalar extraction
      val = val.replace(/^(['"])(.*)\1$/s, "$2");
      currentVal = val ? [val] : [];
    } else if (indented && currentKey) {
      // continuation / nested (list item, folded value, nested map) — for scalar
      // keys like description we treat a plain indented line as folded text.
      const t = raw.trim();
      if (!t.startsWith("-") && !/^[A-Za-z0-9_-]+:/.test(t)) {
        currentVal.push(t.replace(/^(['"])(.*)\1$/s, "$2"));
      }
    } else if (!indented && !kv) {
      parsed.yamlErrors.push(
        `Line \`${raw.trim().slice(0, 48)}\` isn't valid YAML — expected \`key: value\`.`
      );
    }
  }
  commit();

  return parsed;
}

export interface ValidationResult {
  findings: Finding[];
  errors: number;
  warnings: number;
  passes: number;
}

export function validateSkill(src: string): ValidationResult {
  const findings: Finding[] = [];
  const add = (severity: Severity, rule: string, message: string) =>
    findings.push({ severity, rule, message });

  const p = parseSkill(src);

  /* ---- frontmatter existence ---- */
  if (!p.hasFrontmatter && p.yamlErrors.length === 0) {
    add(
      "error",
      "Frontmatter",
      "No YAML frontmatter found. A SKILL.md must open with a `---` fenced block containing at least `name` and `description`."
    );
    // Without frontmatter there's little else to check meaningfully.
    return summarize(findings);
  }
  if (p.preamble.trim() !== "") {
    add(
      "error",
      "Frontmatter",
      "Content appears before the frontmatter. The `---` block must be the very first thing in the file."
    );
  } else if (p.hasFrontmatter) {
    add("pass", "Frontmatter", "Valid `---` frontmatter block found at the top of the file.");
  }
  p.yamlErrors.forEach((e) => add("error", "YAML syntax", e));

  /* ---- name ---- */
  const name = p.keys["name"];
  if (name === undefined) {
    add("error", "name", "Missing required `name` field.");
  } else if (name === "") {
    add("error", "name", "`name` is empty — give the skill a kebab-case name.");
  } else {
    let nameOk = true;
    if (name.length > MAX_NAME) {
      add("error", "name", `\`name\` is ${name.length} characters — the limit is ${MAX_NAME}.`);
      nameOk = false;
    }
    if (/[A-Z]/.test(name)) {
      add("error", "name", "`name` must be lowercase (no capital letters).");
      nameOk = false;
    }
    if (/[_\s]/.test(name)) {
      add("error", "name", "`name` can't contain spaces or underscores — use hyphens (e.g. `pdf-form-filler`).");
      nameOk = false;
    }
    if (!NAME_RE.test(name)) {
      if (/^-|-$/.test(name)) {
        add("error", "name", "`name` can't start or end with a hyphen.");
      } else if (nameOk) {
        add("error", "name", "`name` must use only lowercase letters, numbers, and single hyphens.");
      }
      nameOk = false;
    }
    if (nameOk) {
      add("pass", "name", `\`name: ${name}\` is valid kebab-case. Make sure it matches the skill's folder name.`);
    }
  }

  /* ---- description ---- */
  const desc = p.keys["description"];
  if (desc === undefined) {
    add("error", "description", "Missing required `description` field. This is what Claude reads to decide when to load the skill.");
  } else if (desc === "") {
    add("error", "description", "`description` is empty — describe what the skill does and when to use it.");
  } else {
    let descPass = true;
    if (desc.length > MAX_DESC) {
      add("error", "description", `\`description\` is ${desc.length} characters — the limit is ${MAX_DESC}. Trim it.`);
      descPass = false;
    }
    if (desc.length < 40) {
      add("warn", "description", "`description` is very short. Include both what the skill does and the conditions that should trigger it.");
      descPass = false;
    }
    const lower = desc.toLowerCase();
    const hasTrigger = /\bwhen\b|\btrigger|\buse (this|when|for)\b/.test(lower);
    if (!/^use\s+when\b/.test(lower)) {
      if (hasTrigger) {
        add("warn", "description", 'Consider starting the description with "Use when…" — it makes the triggering condition the first thing Claude reads.');
      } else {
        add("warn", "description", 'No triggering condition found. Add "Use when…" so Claude knows when to activate the skill, not just what it does.');
        descPass = false;
      }
    }
    if (/\b(I|I'?ll|I'?m|we|we'?ll|us)\b/.test(desc)) {
      add("warn", "description", "Write the description in the third person (describe the skill), not first person (\"I\"/\"we\").");
    }
    if (descPass) {
      add("pass", "description", "`description` is present, within the length limit, and states a trigger condition.");
    }
  }

  /* ---- unknown top-level keys ---- */
  const unknown = p.topLevelKeyList.filter((k) => !KNOWN_KEYS.has(k));
  if (unknown.length) {
    add(
      "warn",
      "frontmatter keys",
      `Unrecognised frontmatter key${unknown.length > 1 ? "s" : ""}: ${unknown
        .map((k) => `\`${k}\``)
        .join(", ")}. Supported keys include name, description, license, allowed-tools, metadata.`
    );
  }

  /* ---- body ---- */
  const body = p.body.trim();
  if (p.hasFrontmatter) {
    if (body === "") {
      add("warn", "body", "The skill has no body content below the frontmatter. Add instructions telling Claude how to perform the task.");
    } else {
      const bodyLines = p.body.replace(/\n+$/, "").split("\n").length;
      if (bodyLines > MAX_BODY_LINES) {
        add(
          "warn",
          "body length",
          `The body is ${bodyLines} lines. Keep SKILL.md under ${MAX_BODY_LINES} lines — move long detail into linked reference files and point to them.`
        );
      } else {
        add("pass", "body length", `Body is ${bodyLines} lines — comfortably under the ${MAX_BODY_LINES}-line guideline.`);
      }

      if (!/^#\s+\S/m.test(p.body)) {
        add("warn", "body", "No H1 heading (`# Title`) found in the body. Start with a clear title.");
      }

      const lb = body.toLowerCase();
      const hasWhenToUse = /when to use|when should|use this skill when/.test(lb);
      const hasWhenNot = /when not to use|do not use|don'?t use this|when to avoid/.test(lb);
      if (!hasWhenToUse) {
        add("warn", "structure", 'Consider adding a "When to use this skill" section so the boundaries are explicit.');
      }
      if (!hasWhenNot) {
        add("warn", "structure", 'Consider adding a "When NOT to use this skill" section — it sharply reduces false triggering.');
      }
      if (hasWhenToUse && hasWhenNot) {
        add("pass", "structure", "Includes both when-to-use and when-not-to-use guidance.");
      }
    }
  }

  return summarize(findings);
}

function summarize(findings: Finding[]): ValidationResult {
  const order: Record<Severity, number> = { error: 0, warn: 1, pass: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);
  return {
    findings,
    errors: findings.filter((f) => f.severity === "error").length,
    warnings: findings.filter((f) => f.severity === "warn").length,
    passes: findings.filter((f) => f.severity === "pass").length,
  };
}

/* ----------------------------------- samples ----------------------------------- */

const GOOD_SAMPLE = `---
name: pdf-form-filler
description: Use when a user needs to fill out, flatten, or extract fields from PDF forms. Reads the AcroForm fields, maps supplied values, and writes a completed PDF. Use for tax forms, applications, and any interactive .pdf that must be filled programmatically.
license: MIT
allowed-tools:
  - Read
  - Write
  - Bash
---

# PDF Form Filler

Fill interactive PDF forms from structured data and return a completed file.

## When to use this skill
- The user provides a PDF with form fields and values to enter.
- They ask to "fill", "complete", or "flatten" a PDF form.

## When NOT to use this skill
- The PDF has no interactive fields (use the OCR skill instead).
- The task is generating a brand-new PDF from scratch.

## Instructions
1. Inspect the form fields with the field-dump helper.
2. Map each provided value to its field name.
3. Write the filled PDF and confirm the output path.
`;

const BROKEN_SAMPLE = `---
name: PDF Form Filler
description: I'll help you with PDFs.
category: documents
---
This skill fills PDFs.
Run it whenever.
`;

/* ----------------------------------- UI ----------------------------------- */

const SEV_META: Record<Severity, { label: string; icon: string; cls: string }> = {
  error: { label: "Error", icon: "✕", cls: "err" },
  warn: { label: "Warning", icon: "!", cls: "warn" },
  pass: { label: "Pass", icon: "✓", cls: "pass" },
};

function renderInline(msg: string) {
  // turn `code` spans into <code> without dangerouslySetInnerHTML
  const parts = msg.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function ValidatorPage() {
  const year = new Date().getFullYear();
  const [src, setSrc] = useState("");

  const result = useMemo(() => (src.trim() ? validateSkill(src) : null), [src]);

  const verdict = result
    ? result.errors > 0
      ? { cls: "bad", text: `Not valid yet — ${result.errors} error${result.errors > 1 ? "s" : ""} to fix`, icon: "✕" }
      : result.warnings > 0
      ? { cls: "okish", text: `Valid — ${result.warnings} suggestion${result.warnings > 1 ? "s" : ""} to level it up`, icon: "!" }
      : { cls: "good", text: "Looks great — no issues found", icon: "✓" }
    : null;

  // nav scrolled state + scroll reveal (mirrors the home page)
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.14 }
    );
    document.querySelectorAll(".fade").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const copyReport = async () => {
    if (!result) return;
    const lines = [
      "# SKILL.md validation report",
      "",
      `- Errors: ${result.errors}`,
      `- Warnings: ${result.warnings}`,
      `- Passed: ${result.passes}`,
      "",
      ...result.findings.map(
        (f) => `${SEV_META[f.severity].icon} [${SEV_META[f.severity].label}] ${f.rule}: ${f.message.replace(/`/g, "")}`
      ),
      "",
      "Validated for free at https://claudethings.com/claude-skill-md-validator",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <div className="nav-inner">
          <a className="logo" href="https://claudethings.com">
            ClaudeThings
          </a>
          <div className="nav-links">
            <a href="https://claudethings.com/#whats-inside">What&apos;s inside</a>
            <a href="#checks">What it checks</a>
            <a href="#guide">Format guide</a>
            <a href="#validator" className="btn btn-primary nav-cta">
              Validate now
            </a>
          </div>
        </div>
      </nav>

      {/* HERO + VALIDATOR */}
      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free SKILL.md validator · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            Validate your <span className="grad">SKILL.md</span> in seconds
          </h1>
          <p className="sub reveal-h d3">
            Paste a Claude Code skill and this <b>free linter</b> checks the YAML frontmatter,
            the <b>name</b> and <b>description</b> rules, body length, and the when-to-use
            structure — then tells you <b>exactly what to fix</b>. Nothing leaves your browser.
          </p>

          {/* the tool */}
          <div id="validator" className="val-tool reveal-h d4">
            <div className="val-panel val-editor">
              <div className="val-head">
                <span className="val-file">SKILL.md</span>
                <div className="val-actions">
                  <button className="val-mini" onClick={() => setSrc(GOOD_SAMPLE)}>
                    Load valid example
                  </button>
                  <button className="val-mini" onClick={() => setSrc(BROKEN_SAMPLE)}>
                    Load broken example
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
                placeholder={"Paste the full contents of your SKILL.md here…\n\n---\nname: your-skill\ndescription: Use when…\n---\n\n# Your skill"}
                aria-label="SKILL.md contents to validate"
              />
            </div>

            <div className="val-panel val-results" aria-live="polite">
              {!result ? (
                <div className="val-empty">
                  <div className="val-empty-ic">◆</div>
                  <p>
                    Paste your <code>SKILL.md</code> to validate it live, or load an example to see
                    the linter in action.
                  </p>
                </div>
              ) : (
                <>
                  <div className={`val-verdict ${verdict!.cls}`}>
                    <span className="v-ic">{verdict!.icon}</span>
                    <span>{verdict!.text}</span>
                  </div>
                  <div className="val-counts">
                    <span className="c err">{result.errors} errors</span>
                    <span className="c warn">{result.warnings} warnings</span>
                    <span className="c pass">{result.passes} passed</span>
                    <button className="val-mini val-copy" onClick={copyReport}>
                      Copy report
                    </button>
                  </div>
                  <ul className="val-findings">
                    {result.findings.map((f, i) => (
                      <li key={i} className={`val-finding ${SEV_META[f.severity].cls}`}>
                        <span className="f-chip">{SEV_META[f.severity].icon}</span>
                        <span className="f-body">
                          <b className="f-rule">{f.rule}</b>
                          <span className="f-msg">{renderInline(f.message)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <p className="micro reveal-h d5">
            100% client-side · nothing uploaded · works for any Claude Code / Agent Skill
          </p>
        </div>
      </header>

      {/* WHAT IT CHECKS */}
      <section id="checks">
        <div className="wrap center">
          <div className="tag fade">What it checks</div>
          <h2 className="fade">Every rule the spec (and reviewers) care about</h2>
          <p className="lead fade">
            A skill only fires when its metadata is exactly right. The validator enforces the hard
            requirements and flags the conventions that separate a good skill from a great one.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["🧾", "Valid YAML frontmatter", "Confirms the file opens with a fenced `---` block, the block closes, and every top-level line is parseable key: value YAML."],
              ["🔑", "name rules", "Required, kebab-case only (lowercase, numbers, hyphens), max 64 characters, and a reminder to match the skill's folder name."],
              ["📝", "description rules", "Required, under 1024 characters, third-person, and starting with a clear “Use when…” trigger so Claude loads it at the right moment."],
              ["📏", "Body under 500 lines", "Flags bloated skills and nudges you to move long detail into linked reference files — the pattern Anthropic recommends."],
              ["🧭", "When-to-use / when-not", "Checks for explicit boundaries so the skill triggers on the right tasks and stays quiet on the wrong ones."],
              ["🚦", "Unknown keys & structure", "Warns on unrecognised frontmatter keys, missing H1 titles, and empty bodies before they cost you a broken skill."],
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

      {/* FORMAT GUIDE (SEO content) */}
      <section id="guide">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">SKILL.md format guide</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              What a valid SKILL.md looks like
            </h2>
            <p className="lead fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              A Claude Code Agent Skill is a folder with a <code>SKILL.md</code> at its root. The
              file has two parts: YAML frontmatter and a Markdown body. Here&apos;s the anatomy.
            </p>
          </div>

          <div className="terminal fade" style={{ maxWidth: 760, marginTop: 40 }}>
            <div className="term-bar">
              <span className="dot r" />
              <span className="dot y" />
              <span className="dot g" />
              <span className="term-title">SKILL.md — annotated</span>
            </div>
            <div className="term-body" style={{ fontSize: 13.5 }}>
              <div className="dim">--- &nbsp;# frontmatter must be first</div>
              <div>
                <span className="ok">name</span>: pdf-form-filler{" "}
                <span className="dim">&nbsp;# kebab-case, ≤ 64 chars, matches folder</span>
              </div>
              <div>
                <span className="ok">description</span>:{" "}
                <span className="cmd">Use when a user needs to fill PDF forms…</span>
              </div>
              <div className="dim">&nbsp;&nbsp;# ≤ 1024 chars · third person · leads with a trigger</div>
              <div>
                <span className="ok">allowed-tools</span>: [Read, Write, Bash]{" "}
                <span className="dim">&nbsp;# optional</span>
              </div>
              <div className="dim">---</div>
              <div style={{ marginTop: 8 }}># PDF Form Filler &nbsp;<span className="dim"># H1 title</span></div>
              <div className="dim">## When to use this skill</div>
              <div className="dim">## When NOT to use this skill</div>
              <div className="dim">## Instructions &nbsp;# keep the whole body under 500 lines</div>
            </div>
          </div>

          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["name", 'Lowercase letters, numbers and hyphens only — like `web-security-audit`. No spaces, capitals, or underscores. Maximum 64 characters, and it should match the name of the folder the SKILL.md lives in.'],
              ["description", 'The single most important field: it is all Claude sees when deciding whether to load your skill. Write it in the third person, keep it under 1024 characters, and start with the trigger — "Use when…" — followed by what the skill does.'],
              ["Body length", "Keep SKILL.md under ~500 lines. If you need more, split reference material (schemas, long examples, checklists) into separate files in the skill folder and link to them from the body."],
              ["When-to-use / when-not", "Explicit boundaries are what stop a skill from firing on the wrong task. Add a short “When to use” and “When NOT to use” section so the model has crisp guardrails."],
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

      {/* FAQ */}
      <section id="faq">
        <div className="wrap center">
          <div className="tag fade">FAQ</div>
          <h2 className="fade">SKILL.md validation questions</h2>
          <div className="faq" style={{ textAlign: "left" }}>
            {FAQ.map(([q, a]) => (
              <details className="q fade" key={q}>
                <summary>
                  {q}
                  <span className="plus">+</span>
                </summary>
                <div className="a">{renderInline(a)}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* PAID OFFER */}
      <section id="kits">
        <div className="wrap center">
          <div className="tag fade">Go further</div>
          <h2 className="fade">Want 103 skills that already pass?</h2>
          <p className="lead fade">
            This validator is free. The ClaudeThings kits give you a whole library of
            production-grade agents, skills, and slash commands — every one written to the exact
            bar this linter enforces.
          </p>
          <div className="kits" style={{ textAlign: "left" }}>
            <div className="kit eng fade">
              <div className="kit-head">
                <span className="kit-emoji">🛠️</span>
                <div>
                  <div className="role">Most popular</div>
                  <h3>Engineering Kit</h3>
                </div>
              </div>
              <p style={{ color: "var(--bone-dim)", fontSize: 15 }}>
                Battle-tested Claude skills &amp; workflows for builders.
              </p>
              <ul style={{ marginTop: 18 }}>
                <li><span className="ck">✓</span> 58 agents · 61 skills · 159 commands</li>
                <li><span className="ck">✓</span> Security, testing &amp; code-review skills</li>
                <li><span className="ck">✓</span> Every skill formatted to spec</li>
                <li><span className="ck">✓</span> Lifetime updates</li>
              </ul>
              <a
                href="https://claudethings.com/#pricing"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 22 }}
              >
                Get the Engineering Kit
              </a>
            </div>

            <div className="kit mkt fade">
              <div className="kit-head">
                <span className="kit-emoji">📣</span>
                <div>
                  <div className="role">For founders</div>
                  <h3>Marketing Kit</h3>
                </div>
              </div>
              <p style={{ color: "var(--bone-dim)", fontSize: 15 }}>
                Turn Claude into your growth team.
              </p>
              <ul style={{ marginTop: 18 }}>
                <li><span className="ck">✓</span> 31 agents · 42 skills · 32 commands</li>
                <li><span className="ck">✓</span> Content, SEO &amp; email-sequence skills</li>
                <li><span className="ck">✓</span> Landing-page &amp; funnel templates</li>
                <li><span className="ck">✓</span> Lifetime updates</li>
              </ul>
              <a
                href="https://claudethings.com/#pricing"
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center", marginTop: 22 }}
              >
                Get the Marketing Kit
              </a>
            </div>
          </div>
          <p className="fade" style={{ marginTop: 26 }}>
            <a href="https://claudethings.com/#pricing" className="accent" style={{ fontWeight: 600 }}>
              Or grab all 89 agents, 103 skills &amp; 181 commands in the Complete Bundle →
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div>
              <a className="logo" href="https://claudethings.com">
                ClaudeThings
              </a>
              <p style={{ color: "var(--bone-faint)", fontSize: 14, marginTop: 12, maxWidth: "34ch" }}>
                Your AI engineering &amp; marketing team for Claude Code.
              </p>
            </div>
            <div className="foot-links">
              <div className="foot-col">
                <h5>Product</h5>
                <a href="https://claudethings.com/#whats-inside">What&apos;s inside</a>
                <a href="https://claudethings.com/#kits">Kits</a>
                <a href="https://claudethings.com/#pricing">Pricing</a>
                <a href="https://claudethings.com/#faq">FAQ</a>
              </div>
              <div className="foot-col">
                <h5>Free Tools</h5>
                <a href="/tools">All free tools</a>
                <a href="/claude-skill-md-validator">SKILL.md Validator</a>
                <a href="/claude-skill-for-website-security-audit">Website Security Audit</a>
                <a href="https://claudethings.com">More skills</a>
              </div>
              <div className="foot-col">
                <h5>Legal</h5>
                <a href="/legal">Legal</a>
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
                <a href="/refund">Refunds</a>
              </div>
              <div className="foot-col">
                <h5>Connect</h5>
                <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a>
                <a href="https://claudethings.com">claudethings.com</a>
              </div>
            </div>
          </div>
          <div className="disclaimer">
            <b>This validator checks common, high-impact SKILL.md formatting rules</b> based on the
            public Claude Code Agent Skills conventions. It runs entirely in your browser and
            nothing you paste is uploaded or stored. It is a linter, not an official Anthropic tool,
            and passing it does not guarantee acceptance in every context.
            <br />
            <br />
            <b>Unofficial &amp; independent.</b> ClaudeThings is not affiliated with, endorsed by, or
            sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
            &quot;Anthropic&quot; are trademarks of Anthropic.
            <br />
            <br />© {year} ClaudeThings. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

const FAQ: Array<[string, string]> = [
  [
    "What is a SKILL.md file?",
    "A SKILL.md is the entry point of a Claude Code Agent Skill. It's a Markdown file with YAML frontmatter (at minimum a `name` and a `description`) followed by instructions that tell Claude how to perform a task. Claude reads the description to decide when to load the skill.",
  ],
  [
    "What makes a SKILL.md invalid?",
    "The hard failures are: no `---` frontmatter block, a missing `name` or `description`, a `name` that isn't lowercase kebab-case or exceeds 64 characters, or a `description` over 1024 characters. This tool flags each of these as an error.",
  ],
  [
    'Why should the description start with "Use when…"?',
    'The description is the only thing Claude sees when deciding whether to activate a skill. Leading with the trigger condition — "Use when the user needs to…" — makes the activation criteria unambiguous and dramatically improves how reliably the skill fires at the right time.',
  ],
  [
    "How long should a SKILL.md be?",
    "Keep the body under about 500 lines. Skills are loaded into context, so a bloated SKILL.md wastes tokens and dilutes the instructions. Move long reference material — schemas, examples, checklists — into separate files in the skill folder and link to them.",
  ],
  [
    "Is my skill uploaded when I validate it?",
    "No. The entire validator runs client-side in your browser using JavaScript. Nothing you paste is sent to a server, logged, or stored. You can disconnect from the internet after the page loads and it will still work.",
  ],
  [
    "Does passing this validator guarantee my skill works?",
    "It guarantees your SKILL.md meets the common formatting rules and conventions, which is where most broken skills fail. It doesn't test your instructions' quality or run the skill — treat it as a fast linting loop: validate, fix, repeat, then test the skill in Claude Code.",
  ],
];
