import McpPage from "./McpPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/mcp-config-validator",
  title: "MCP Config Validator — Free .mcp.json Checker & Fixer",
  description:
    "Free MCP config validator. Paste your .mcp.json or claude_desktop_config.json and catch the errors that break MCP servers: wrong top-level key, missing command or url, bad env, trailing commas — with exact fixes. Runs 100% in your browser.",
  keywords: [
    "mcp config validator",
    "mcp.json",
    "claude_desktop_config.json",
    "mcp server not working",
    "mcp server config",
    "model context protocol config",
    "claude mcp setup",
    "mcpServers",
    "validate mcp json",
  ],
  ogTitle: "MCP Config Validator — Fix Your .mcp.json in Seconds",
  ogDescription:
    "Paste your MCP config, catch the exact error breaking it — wrong key, missing command/url, bad env, trailing comma. Free & client-side.",
  appName: "MCP Config Validator",
  appDescription:
    "A free, client-side validator for Model Context Protocol server configs (.mcp.json, claude_desktop_config.json). Checks JSON syntax, the mcpServers structure, stdio/http/sse fields, env vars, and common gotchas.",
  faq: [
    {
      question: "What is an MCP config file?",
      answer:
        "MCP (Model Context Protocol) servers give Claude extra tools — databases, browsers, APIs. They're configured in JSON: .mcp.json at your project root for Claude Code, claude_desktop_config.json for Claude Desktop. Both use the same shape: a top-level mcpServers object with one entry per server.",
    },
    {
      question: "Why isn't my MCP server showing up?",
      answer:
        "The four most common causes: the top-level key isn't exactly mcpServers, the JSON has a syntax error (usually a trailing comma), a stdio server is missing its command, or you edited the config while the app was running — restart Claude Code / Claude Desktop after changes.",
    },
    {
      question: "What's the difference between stdio, sse, and http servers?",
      answer:
        "stdio servers are local processes Claude launches (need command + args). http and sse servers are remote endpoints Claude connects to (need url, optionally headers for auth). sse is the older streaming transport; new remote servers generally use http.",
    },
    {
      question: "Is my config uploaded when I validate it?",
      answer:
        "No — validation runs entirely in your browser. That matters here because MCP configs often contain API keys in env blocks. Nothing you paste is sent, logged, or stored (but rotate any key you've pasted into random online tools that can't say the same).",
    },
    {
      question: "Does this validate the server itself?",
      answer:
        "It validates the config file — structure, required fields, and common mistakes. It can't launch the server to test it; for that, run `claude mcp list` in Claude Code and check the connection status.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <McpPage />
    </>
  );
}
