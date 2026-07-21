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
 * MCP config validator — paste .mcp.json / claude_desktop_config.json, get the
 * exact errors and fixes. 100% client-side (configs often contain API keys —
 * they never leave the browser).
 */

/* --------------------------------- engine --------------------------------- */

type Severity = "error" | "warn" | "pass";

interface Finding {
  severity: Severity;
  rule: string;
  message: string;
}

const VALID_TYPES = new Set(["stdio", "sse", "http"]);

export function validateMcp(src: string): { findings: Finding[]; serverCount: number } {
  const findings: Finding[] = [];
  const add = (severity: Severity, rule: string, message: string) =>
    findings.push({ severity, rule, message });

  const trimmed = src.trim();

  /* ---- JSON syntax ---- */
  let data: unknown;
  try {
    data = JSON.parse(trimmed);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/,\s*[}\]]/.test(trimmed)) {
      add("error", "JSON syntax", "Trailing comma detected — JSON doesn't allow a comma before a closing `}` or `]`. Remove it. (This is the #1 MCP config error.)");
    } else if (/\/\/|\/\*/.test(trimmed)) {
      add("error", "JSON syntax", "Comments detected — JSON doesn't support `//` or `/* */` comments. Remove them.");
    } else if (/'\w/.test(trimmed)) {
      add("error", "JSON syntax", "Single quotes detected — JSON requires double quotes around keys and strings.");
    } else {
      add("error", "JSON syntax", `Not valid JSON: ${msg.slice(0, 120)}`);
    }
    return { findings, serverCount: 0 };
  }
  add("pass", "JSON syntax", "Parses as valid JSON.");

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    add("error", "Structure", "The config must be a JSON object at the top level.");
    return { findings, serverCount: 0 };
  }
  const root = data as Record<string, unknown>;

  /* ---- top-level key ---- */
  let servers: Record<string, unknown> | null = null;
  if (root.mcpServers && typeof root.mcpServers === "object" && !Array.isArray(root.mcpServers)) {
    servers = root.mcpServers as Record<string, unknown>;
    add("pass", "mcpServers", "Top-level `mcpServers` object found.");
  } else {
    const wrongKey = ["mcp_servers", "servers", "mcpservers", "MCPServers", "mcp"].find((k) => k in root);
    if (wrongKey) {
      add("error", "mcpServers", `Found \`${wrongKey}\` but the key must be exactly \`mcpServers\` (camelCase). Rename it.`);
    } else if (Object.values(root).some((v) => typeof v === "object" && v !== null && ("command" in (v as object) || "url" in (v as object)))) {
      add("error", "mcpServers", "Your servers are at the top level. Wrap them in a `mcpServers` object: `{ \"mcpServers\": { …your servers… } }`.");
    } else {
      add("error", "mcpServers", "No `mcpServers` object found. The config needs `{ \"mcpServers\": { \"server-name\": { … } } }`.");
    }
    return { findings, serverCount: 0 };
  }

  const names = Object.keys(servers);
  if (names.length === 0) {
    add("warn", "mcpServers", "`mcpServers` is empty — no servers configured.");
  }

  /* ---- each server ---- */
  for (const name of names) {
    const s = servers[name];
    const label = `server \`${name}\``;
    if (/\s/.test(name)) {
      add("warn", "naming", `${label}: the name contains spaces — use kebab-case (\`${name.trim().toLowerCase().replace(/\s+/g, "-")}\`) to keep tool names clean.`);
    }
    if (typeof s !== "object" || s === null || Array.isArray(s)) {
      add("error", "server shape", `${label} must be an object with \`command\` (stdio) or \`url\` (http/sse).`);
      continue;
    }
    const srv = s as Record<string, unknown>;
    const declaredType = typeof srv.type === "string" ? srv.type : undefined;
    if (declaredType && !VALID_TYPES.has(declaredType)) {
      add("error", "type", `${label}: \`type: "${declaredType}"\` isn't valid — use \`stdio\`, \`http\`, or \`sse\`.`);
    }
    const isRemote = declaredType === "http" || declaredType === "sse" || (!declaredType && typeof srv.url === "string");

    if (isRemote) {
      if (typeof srv.url !== "string" || !srv.url) {
        add("error", "url", `${label}: remote (${declaredType ?? "http"}) servers need a \`url\`.`);
      } else if (!/^https?:\/\//.test(srv.url)) {
        add("error", "url", `${label}: \`url\` must start with http:// or https:// (got \`${String(srv.url).slice(0, 40)}\`).`);
      } else {
        add("pass", "url", `${label}: valid ${declaredType ?? "http"} endpoint.`);
      }
      if (srv.command || srv.args) {
        add("warn", "fields", `${label}: has both \`url\` and \`command\`/\`args\` — remote servers ignore command fields. Remove them.`);
      }
      if (srv.headers && (typeof srv.headers !== "object" || Array.isArray(srv.headers))) {
        add("error", "headers", `${label}: \`headers\` must be an object of string values.`);
      }
    } else {
      if (typeof srv.command !== "string" || !srv.command) {
        const hint = typeof srv.path === "string" ? " (found `path` — the field is called `command`)" : "";
        add("error", "command", `${label}: stdio servers need a \`command\` string${hint}.`);
      } else {
        add("pass", "command", `${label}: launches \`${srv.command}\`.`);
        if (srv.command === "npx" && Array.isArray(srv.args) && !((srv.args as unknown[]).includes("-y") || (srv.args as unknown[]).includes("--yes"))) {
          add("warn", "args", `${label}: \`npx\` without \`-y\` can hang waiting for an install prompt Claude can't answer. Add \`"-y"\` as the first arg.`);
        }
      }
      if (srv.args !== undefined && (!Array.isArray(srv.args) || (srv.args as unknown[]).some((a) => typeof a !== "string"))) {
        add("error", "args", `${label}: \`args\` must be an array of strings — split \`"run server --port 3000"\` into separate items.`);
      }
    }

    if (srv.env !== undefined) {
      if (typeof srv.env !== "object" || srv.env === null || Array.isArray(srv.env)) {
        add("error", "env", `${label}: \`env\` must be an object like \`{"API_KEY": "value"}\`.`);
      } else {
        const bad = Object.entries(srv.env as Record<string, unknown>).filter(([, v]) => typeof v !== "string");
        if (bad.length) {
          add("error", "env", `${label}: env values must be strings — quote ${bad.map(([k]) => `\`${k}\``).join(", ")}.`);
        }
        const placeholder = Object.entries(srv.env as Record<string, unknown>).filter(
          ([, v]) => typeof v === "string" && /^(<|YOUR_|your-|xxx|\.\.\.|\$\{)/i.test(v as string)
        );
        if (placeholder.length) {
          add("warn", "env", `${label}: ${placeholder.map(([k]) => `\`${k}\``).join(", ")} look${placeholder.length === 1 ? "s" : ""} like placeholder value${placeholder.length === 1 ? "" : "s"} — the server will fail to authenticate until you set real values.`);
        }
      }
    }
  }

  const order: Record<Severity, number> = { error: 0, warn: 1, pass: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);
  return { findings, serverCount: names.length };
}

/* --------------------------------- samples --------------------------------- */

const EXAMPLES: Record<string, string> = {
  github: `{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_GITHUB_PAT"
      }
    }
  }
}`,
  filesystem: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    }
  }
}`,
  playwright: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}`,
  broken: `{
  "mcp_servers": {
    "postgres server": {
      "path": "npx",
      "args": "-y @modelcontextprotocol/server-postgres postgresql://localhost/db",
      "env": { "PGPASSWORD": "<your password>" }
    },
  }
}`,
};

/* ----------------------------------- UI ----------------------------------- */

const SEV_META: Record<Severity, { label: string; icon: string; cls: string }> = {
  error: { label: "Error", icon: "✕", cls: "err" },
  warn: { label: "Warning", icon: "!", cls: "warn" },
  pass: { label: "Pass", icon: "✓", cls: "pass" },
};

export default function McpPage() {
  useToolPageFx();
  const [src, setSrc] = useState("");

  const result = useMemo(() => (src.trim() ? validateMcp(src) : null), [src]);
  const errors = result?.findings.filter((f) => f.severity === "error").length ?? 0;
  const warns = result?.findings.filter((f) => f.severity === "warn").length ?? 0;

  return (
    <>
      <ToolNav
        links={[
          { href: "#checks", label: "What it checks" },
          { href: "#gotchas", label: "Common gotchas" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaHref="#validator"
        ctaLabel="Validate mine"
      />

      <header id="top">
        <div className="wrap">
          <span className="eyebrow reveal-h d1">
            <span className="pulse" /> Free MCP config validator · Runs in your browser
          </span>
          <h1 className="reveal-h d2">
            Fix your <span className="grad">.mcp.json</span> in seconds
          </h1>
          <p className="sub reveal-h d3">
            MCP server &quot;not showing up&quot;? It&apos;s almost always the config. Paste your{" "}
            <b>.mcp.json</b> or <b>claude_desktop_config.json</b> and get the exact errors — wrong
            keys, missing fields, trailing commas — with fixes. API keys never leave your browser.
          </p>

          <div id="validator" className="val-tool reveal-h d4">
            <div className="val-panel val-editor">
              <div className="val-head" style={{ flexWrap: "wrap", gap: 8 }}>
                <span className="val-file">.mcp.json</span>
                <div className="val-actions" style={{ flexWrap: "wrap" }}>
                  <button className="val-mini" onClick={() => setSrc(EXAMPLES.github)}>GitHub example</button>
                  <button className="val-mini" onClick={() => setSrc(EXAMPLES.filesystem)}>Filesystem</button>
                  <button className="val-mini" onClick={() => setSrc(EXAMPLES.playwright)}>Playwright</button>
                  <button className="val-mini" onClick={() => setSrc(EXAMPLES.broken)}>Broken example</button>
                  <button className="val-mini" onClick={() => setSrc("")} disabled={!src}>Clear</button>
                </div>
              </div>
              <textarea
                spellCheck={false}
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder={'Paste your MCP config here…\n\n{\n  "mcpServers": {\n    "my-server": { "command": "npx", "args": ["-y", "…"] }\n  }\n}'}
                aria-label="MCP config JSON to validate"
              />
            </div>

            <div className="val-panel val-results" aria-live="polite">
              {!result ? (
                <div className="val-empty">
                  <div className="val-empty-ic">◆</div>
                  <p>
                    Paste your config to validate it live, or load an example — including a broken
                    one showing the five classic mistakes.
                  </p>
                </div>
              ) : (
                <>
                  <div className={`val-verdict ${errors ? "bad" : warns ? "okish" : "good"}`}>
                    <span className="v-ic">{errors ? "✕" : warns ? "!" : "✓"}</span>
                    <span>
                      {errors
                        ? `${errors} error${errors > 1 ? "s" : ""} breaking your config`
                        : warns
                        ? `Valid — ${warns} thing${warns > 1 ? "s" : ""} worth fixing`
                        : `Valid — ${result.serverCount} server${result.serverCount === 1 ? "" : "s"} configured correctly`}
                    </span>
                  </div>
                  <div className="val-counts">
                    <span className="c err">{errors} errors</span>
                    <span className="c warn">{warns} warnings</span>
                    <span className="c pass">{result.findings.filter((f) => f.severity === "pass").length} passed</span>
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
            100% client-side · your API keys never leave the page · works for Claude Code &amp;
            Claude Desktop configs
          </p>
        </div>
      </header>

      {/* WHAT IT CHECKS */}
      <section id="checks">
        <div className="wrap center">
          <div className="tag fade">What it checks</div>
          <h2 className="fade">Every error that makes servers silently vanish</h2>
          <p className="lead fade">
            MCP fails quietly: a malformed config usually means the server just never appears.
            These are the checks that catch 95% of &quot;my MCP server isn&apos;t working&quot;.
          </p>
          <div className="sol-grid" style={{ textAlign: "left" }}>
            {[
              ["🧾", "JSON syntax", "Trailing commas, comments, single quotes — the classics. Each gets a specific message, not just 'parse error'."],
              ["🔑", "The mcpServers key", "Must be exactly `mcpServers`. Catches `mcp_servers`, `servers`, and servers accidentally placed at the top level."],
              ["⚙️", "stdio fields", "`command` present and a string, `args` an array of separate strings (not one long string), `npx` with `-y` so installs don't hang."],
              ["🌐", "Remote fields", "`url` present and http(s) for `http`/`sse` servers, `headers` well-formed, and no leftover `command` fields being silently ignored."],
              ["🔐", "env blocks", "Object shape, string values, and placeholder detection — `<your password>` and `YOUR_API_KEY` get flagged before you spend an hour debugging auth."],
              ["🏷️", "Names & types", "Valid `type` values (stdio / http / sse) and kebab-case server names so your tool names stay clean."],
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

      {/* GOTCHAS */}
      <section id="gotchas">
        <div className="wrap">
          <div className="center">
            <div className="tag t-teal fade">Beyond the file</div>
            <h2 className="fade" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Config is valid but the server still won&apos;t connect?
            </h2>
          </div>
          <div className="feat-grid" style={{ marginTop: 48 }}>
            {[
              ["Restart the app", "Both Claude Code and Claude Desktop read MCP configs at startup. Edits while running do nothing until you restart (or run `claude mcp list` to check status)."],
              ["Check the right file", "Claude Code: `.mcp.json` at the project root (or `claude mcp add`). Claude Desktop: `claude_desktop_config.json` in Application Support (macOS) / AppData (Windows). Same shape, different files."],
              ["Node not found", "stdio servers need their runtime on PATH — GUI apps don't always inherit your shell's PATH. Use absolute paths (`/usr/local/bin/npx`) if servers die instantly."],
              ["Scope confusion", "Claude Code has three scopes: local (just you, this repo), project (.mcp.json, committed), user (all projects). `claude mcp add --scope project` writes the shareable one."],
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
        heading="MCP config questions"
        items={[
          [
            "What does MCP actually do?",
            "The Model Context Protocol is an open standard for connecting AI apps to tools and data. Each MCP server exposes tools (query this database, control this browser) that Claude can call mid-conversation. The config file tells Claude which servers to launch or connect to.",
          ],
          [
            "Where does .mcp.json go?",
            "At your project root, next to .claude/. It's meant to be committed so your whole team gets the same servers. Personal servers can be added with `claude mcp add` (local or user scope) instead.",
          ],
          [
            "Is it safe to paste a config with API keys here?",
            "The validation is pure client-side JavaScript — nothing is transmitted. Still, hygiene matters: prefer env-var expansion (`${API_KEY}`) over hardcoding secrets in committed configs.",
          ],
          [
            "Why does my npx server hang forever?",
            "Usually `npx` waiting for a 'need to install package, ok?' prompt that Claude can't answer. Add `-y` as the first arg. Second most common: the package name is wrong, so npx sits resolving it.",
          ],
          [
            "Can I use environment variables in the config?",
            "Claude Code supports `${VAR}` expansion in command, args, env, url, and headers — ideal for keeping tokens out of the committed .mcp.json. Claude Desktop is more limited; there you typically hardcode values in the env block.",
          ],
        ]}
      />

      <KitsUpsell
        heading="MCP connects the tools. The kits do the work."
        lead={
          <>
            Once your servers connect, the AgentsKit kits give Claude the playbooks — 103
            production-grade skills plus the agents and commands that use your MCP tools well.
          </>
        }
      />

      <ToolFooter
        disclaimer={
          <>
            <b>This validator checks config structure against the publicly documented MCP formats</b>{" "}
            for Claude Code and Claude Desktop. It cannot launch servers or test connections, and
            formats evolve. Everything runs in your browser; nothing you paste — including API
            keys — is uploaded or stored.
          </>
        }
      />
    </>
  );
}
