import TokenCounterPage from "./TokenCounterPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/claude-token-counter",
  title: "Claude Token Counter — Free Online Token & Cost Calculator",
  description:
    "Free Claude token counter. Paste any text or code and instantly estimate tokens plus the exact API cost for Claude Opus, Sonnet, and Haiku — input and output, with cache pricing. No signup, runs 100% in your browser.",
  keywords: [
    "claude token counter",
    "claude tokenizer",
    "anthropic token counter",
    "claude api cost calculator",
    "count tokens claude",
    "claude token price",
    "claude opus cost",
    "claude sonnet pricing",
    "tokens to dollars claude",
  ],
  ogTitle: "Claude Token Counter — Tokens & Cost, Instantly",
  ogDescription:
    "Paste text or code, get the token estimate and the exact cost on Claude Opus, Sonnet, and Haiku. Free, no signup, client-side.",
  appName: "Claude Token Counter",
  appDescription:
    "A free, client-side token counter and cost calculator for Claude models. Estimates tokens for any text or code and prices them across Claude Opus, Sonnet, and Haiku at current API rates.",
  faq: [
    {
      question: "How accurate is this token counter?",
      answer:
        "It's a calibrated estimate, typically within a few percent for English text and code. Claude's exact tokenizer is only available via the API's count_tokens endpoint, so any in-browser counter is an approximation — this one blends character and word heuristics tuned separately for prose and code.",
    },
    {
      question: "How many tokens is a word for Claude?",
      answer:
        "English prose averages about 1.3 tokens per word, or roughly 3.5–4 characters per token. Code is denser in tokens: symbols, brackets, and camelCase identifiers split into more pieces, often 25–40% more tokens than prose of the same length.",
    },
    {
      question: "What do Claude tokens cost?",
      answer:
        "Per million tokens: Claude Opus $15 input / $75 output, Claude Sonnet $3 input / $15 output, Claude Haiku $1 input / $5 output. Cache writes cost 25% extra on input; cache reads cost 90% less — which is why Claude Code leans so heavily on caching.",
    },
    {
      question: "Why do input and output tokens cost different amounts?",
      answer:
        "Generating tokens is far more compute-intensive than reading them, so output tokens cost about 5× input tokens on every Claude model. When estimating a workload, always split it: a long prompt with a short answer is cheap; the reverse is not.",
    },
    {
      question: "Is my text uploaded when I count it?",
      answer: "No — counting and pricing run entirely in your browser. Nothing you paste is sent anywhere.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <TokenCounterPage />
    </>
  );
}
