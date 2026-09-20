import { NextResponse } from "next/server";
import { getPublishedMdxPosts } from "@/app/lib/posts";
import { POSTS } from "@/app/blog/blogData";
import { TOOLS } from "@/app/tools/toolsData";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";

/**
 * Free, public MCP server exposing the AgentsKit blog and free tools.
 *
 * JSON-RPC 2.0 over POST, per the Model Context Protocol. Deliberately
 * unauthenticated: competitors gate the same idea behind a purchase, which
 * caps installs at the number of customers. Every install here is a
 * distribution endpoint inside someone's Claude Code session, and the free
 * tools it surfaces are the top of the funnel.
 *
 * Install:
 *   claude mcp add --transport http agentskit https://agentskit.co/api/mcp
 */

const PROTOCOL_VERSION = "2025-06-18";

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: Record<string, unknown>;
}

const TOOL_DEFS = [
  {
    name: "list_posts",
    description:
      "List every AgentsKit guide with its title, description, tag and URL. Start here to see what is available, then call get_post for the full text of one.",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string", description: "Optional tag filter, e.g. 'Commands' or 'Agents'." },
      },
    },
  },
  {
    name: "get_post",
    description:
      "Return the full text of one guide by its slug. Use list_posts or search_posts first to find the slug.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "The post slug." } },
      required: ["slug"],
    },
  },
  {
    name: "search_posts",
    description:
      "Full-text search across all AgentsKit guides. Returns matching posts with a short excerpt around the match.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string", description: "Search terms." } },
      required: ["query"],
    },
  },
  {
    name: "list_free_tools",
    description:
      "List the free AgentsKit web tools (token counter, CLAUDE.md grader, SKILL.md validator, hooks builder, and others) with what each one does and its URL.",
    inputSchema: { type: "object", properties: {} },
  },
];

/** MDX posts carry full bodies; legacy posts are metadata plus their URL. */
function allPosts() {
  const mdx = getPublishedMdxPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tag: p.tag,
    date: p.date,
    url: `${SITE_URL}/blog/${p.slug}`,
    body: `${p.intro}\n\n${p.body}`,
  }));
  const mdxSlugs = new Set(mdx.map((p) => p.slug));
  const legacy = POSTS.filter((p) => !mdxSlugs.has(p.slug)).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tag: p.tag,
    date: p.date,
    url: `${SITE_URL}/blog/${p.slug}`,
    body: null as string | null,
  }));
  return [...mdx, ...legacy];
}

function text(body: string) {
  return { content: [{ type: "text", text: body }] };
}

function callTool(name: string, args: Record<string, unknown>) {
  const posts = allPosts();

  if (name === "list_posts") {
    const tag = typeof args.tag === "string" ? args.tag.toLowerCase() : null;
    const rows = posts.filter((p) => !tag || p.tag.toLowerCase() === tag);
    if (rows.length === 0) return text(`No posts found${tag ? ` with tag "${args.tag}"` : ""}.`);
    return text(
      rows
        .map((p) => `## ${p.title}\nslug: ${p.slug}\ntag: ${p.tag}\n${p.description}\n${p.url}`)
        .join("\n\n"),
    );
  }

  if (name === "get_post") {
    const post = posts.find((p) => p.slug === args.slug);
    if (!post) return text(`No post with slug "${String(args.slug)}". Call list_posts to see valid slugs.`);
    if (!post.body) {
      return text(
        `# ${post.title}\n\n${post.description}\n\nThe full text of this older guide is on the web only: ${post.url}`,
      );
    }
    return text(`# ${post.title}\n\n${post.body}\n\n---\nSource: ${post.url}`);
  }

  if (name === "search_posts") {
    const q = String(args.query ?? "").toLowerCase().trim();
    if (!q) return text("Provide a search query.");
    const hits = posts
      .map((p) => {
        const hay = `${p.title}\n${p.description}\n${p.body ?? ""}`;
        const at = hay.toLowerCase().indexOf(q);
        if (at === -1) return null;
        return { p, excerpt: hay.slice(Math.max(0, at - 120), at + 240).replace(/\s+/g, " ").trim() };
      })
      .filter((h): h is { p: (typeof posts)[number]; excerpt: string } => h !== null);
    if (hits.length === 0) return text(`No matches for "${args.query}".`);
    return text(
      hits.map((h) => `## ${h.p.title}\nslug: ${h.p.slug}\n${h.p.url}\n\n…${h.excerpt}…`).join("\n\n"),
    );
  }

  if (name === "list_free_tools") {
    // Only shipped tools, "soon" entries are teasers with no page behind them.
    return text(
      TOOLS.filter((t) => t.status === "live")
        .map((t) => `## ${t.name}\n${t.tagline}\n\n${t.description}\n${SITE_URL}${t.slug}`)
        .join("\n\n"),
    );
  }

  return null;
}

export async function POST(req: Request) {
  let body: JsonRpcRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400 },
    );
  }

  const { id = null, method, params = {} } = body;
  const ok = (result: unknown) => NextResponse.json({ jsonrpc: "2.0", id, result });

  switch (method) {
    case "initialize":
      return ok({
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: SITE_NAME, version: "1.0.0" },
        instructions:
          `${SITE_NAME} guides for Claude Code: agents, skills, slash commands, hooks, MCP and models. ` +
          "Call search_posts or list_posts to find a guide, get_post to read one, list_free_tools for the free web tools.",
      });

    // Notifications carry no id and expect no result.
    case "notifications/initialized":
      return new NextResponse(null, { status: 202 });

    case "tools/list":
      return ok({ tools: TOOL_DEFS });

    case "tools/call": {
      const name = String((params as { name?: unknown }).name ?? "");
      const args = ((params as { arguments?: Record<string, unknown> }).arguments ?? {}) as Record<
        string,
        unknown
      >;
      const result = callTool(name, args);
      if (!result) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          error: { code: -32602, message: `Unknown tool: ${name}` },
        });
      }
      return ok(result);
    }

    default:
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      });
  }
}

/** A GET here is usually a human pasting the URL in a browser. */
export async function GET() {
  return NextResponse.json({
    name: `${SITE_NAME} MCP`,
    description: "Free MCP server for the AgentsKit Claude Code guides and tools.",
    transport: "http",
    install: `claude mcp add --transport http agentskit ${SITE_URL}/api/mcp`,
    tools: TOOL_DEFS.map((t) => t.name),
  });
}
