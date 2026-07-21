import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

const BASE = SITE_URL;

/**
 * robots.txt — served at /robots.txt.
 *
 * We explicitly welcome the major AI crawlers and answer-engine bots (ChatGPT,
 * Claude, Perplexity, Gemini, and others) in addition to classic search
 * engines, so AgentsKit can be indexed and cited across AI platforms.
 * AI-facing content lives in /llms.txt, /llms-full.txt, and /ai.txt.
 */

// AI assistant / answer-engine crawlers we explicitly allow full access.
const AI_BOTS = [
  "GPTBot", // OpenAI — ChatGPT training/index
  "OAI-SearchBot", // OpenAI — ChatGPT Search
  "ChatGPT-User", // OpenAI — live browsing on user request
  "ClaudeBot", // Anthropic — Claude crawler
  "Claude-Web", // Anthropic — Claude live browsing
  "anthropic-ai", // Anthropic — legacy
  "PerplexityBot", // Perplexity — index
  "Perplexity-User", // Perplexity — live browsing on user request
  "Google-Extended", // Google — Gemini / Vertex AI grounding
  "GoogleOther", // Google — non-search product crawls
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot", // Amazon / Alexa
  "Bytespider", // ByteDance / Doubao
  "Meta-ExternalAgent", // Meta AI
  "cohere-ai", // Cohere
  "DuckAssistBot", // DuckDuckGo AI
  "YouBot", // You.com
  "Diffbot", // Diffbot knowledge graph
  "Timpibot", // Timpi
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everyone (classic search engines included) — full access.
      { userAgent: "*", allow: "/" },
      // Named AI crawlers — explicit welcome so intent is unambiguous.
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
