import WrappedPage from "./WrappedPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/claude-code-wrapped",
  title: "Claude Code Wrapped — Your ccusage Stats as a Shareable Card",
  description:
    "Free Claude Code Wrapped generator. Paste your ccusage output and get a shareable card with total tokens burned, the $ equivalent at API prices, your favorite model, longest streak, and busiest day. Runs 100% in your browser.",
  keywords: [
    "claude code wrapped",
    "ccusage",
    "claude code usage",
    "claude code token usage",
    "claude code cost tracker",
    "ccusage json",
    "claude code stats",
    "claude api cost",
    "claude code spending",
  ],
  ogTitle: "Claude Code Wrapped — How Many Tokens Did You Burn?",
  ogDescription:
    "Paste your ccusage output, get a shareable Wrapped card: tokens burned, $ value at API prices, favorite model, streak, busiest day. Free, client-side.",
  appName: "Claude Code Wrapped",
  appDescription:
    "A free, client-side generator that turns your ccusage output into a shareable Claude Code Wrapped card: total tokens, API-price value, favorite model, longest streak, and busiest day.",
  faq: [
    {
      question: "What is Claude Code Wrapped?",
      answer:
        "It's a free tool that turns your Claude Code usage data (from the ccusage CLI) into a Spotify-Wrapped-style card: total tokens burned, what that usage would cost at Claude API prices, your favorite model, your longest daily streak, and your busiest day.",
    },
    {
      question: "How do I get my ccusage data?",
      answer:
        "Run `npx ccusage@latest --json` in your terminal (or `bunx ccusage --json`). It reads Claude Code's local JSONL logs on your machine and prints a JSON summary. Copy the whole output and paste it into the tool.",
    },
    {
      question: "Is my usage data uploaded anywhere?",
      answer:
        "No. The whole tool runs client-side in your browser. The JSON you paste is parsed locally, the card is drawn on a local canvas, and nothing is sent to a server, logged, or stored.",
    },
    {
      question: "How is the dollar value calculated?",
      answer:
        "ccusage already estimates cost from Anthropic's public API prices per model (input, output, cache write, and cache read tokens each have their own rate). The tool uses ccusage's totals when present, and recomputes from the token counts at current API list prices otherwise.",
    },
    {
      question: "Does this show what I actually paid?",
      answer:
        "Not if you're on a Pro or Max subscription — then it shows what your usage would have cost at API prices, which is exactly why the number is fun to share. If you use Claude Code with an API key, it approximates your real spend.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <WrappedPage />
    </>
  );
}
