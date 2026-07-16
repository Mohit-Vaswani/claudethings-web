import CalculatorPage from "./CalculatorPage";
import { toolMetadata, ToolJsonLd, type ToolSeoInput } from "@/app/lib/toolSeo";

const seo: ToolSeoInput = {
  path: "/claude-plan-calculator",
  title: "Claude Plan Calculator — Pro vs Max vs API: Which Pays Off?",
  description:
    "Free Claude plan calculator. Enter your daily Claude Code usage and instantly see whether Pro ($20), Max 5x ($100), Max 20x ($200), or the pay-as-you-go API is cheapest — plus when you'll hit each plan's usage limits.",
  keywords: [
    "claude pro vs max",
    "claude plan calculator",
    "claude usage limits",
    "claude max worth it",
    "claude pro limits",
    "claude code usage limits",
    "claude api cost calculator",
    "claude max 5x vs 20x",
    "claude subscription vs api",
  ],
  ogTitle: "Claude Plan Calculator — Pro vs Max vs API",
  ogDescription:
    "Enter your daily usage, see which Claude plan actually pays off and when you'd hit the limits. Free, instant, no signup.",
  appName: "Claude Plan Calculator",
  appDescription:
    "A free calculator that compares Claude Pro, Max 5x, Max 20x, and pay-as-you-go API pricing against your actual daily Claude Code usage, including estimated usage-limit headroom.",
  faq: [
    {
      question: "What's the difference between Claude Pro and Claude Max?",
      answer:
        "Pro ($20/month) gives everyday access to Claude and Claude Code with standard usage limits — roughly 40–80 hours of Sonnet per week. Max comes in two tiers: Max 5x ($100/month) with about 5× Pro's limits plus meaningful Opus access, and Max 20x ($200/month) with about 20× Pro's limits for all-day agent workloads.",
    },
    {
      question: "When is the API cheaper than a subscription?",
      answer:
        "When your usage is light or bursty. If your API-equivalent usage is under ~$20/month, pay-as-you-go wins. Steady daily Claude Code use almost always makes a subscription cheaper — heavy users routinely consume 10–50× their subscription price in API-equivalent tokens.",
    },
    {
      question: "How do Claude's usage limits work?",
      answer:
        "Limits apply per 5-hour rolling session window plus an overall weekly cap, and they scale with your plan. They're dynamic — Anthropic publishes expected ranges (e.g. 40–80 Sonnet hours/week on Pro) rather than hard numbers, and actual headroom varies with model choice, codebase size, and demand.",
    },
    {
      question: "Are these numbers official?",
      answer:
        "Plan prices are Anthropic's published prices. The usage-limit ranges are Anthropic's published expectations combined with community measurements, and the API-equivalent burn rates are estimates — treat the output as a well-informed estimate, not a quote.",
    },
    {
      question: "Do I need this if I already have ccusage?",
      answer:
        "They pair well: run ccusage to see your real API-equivalent spend, then put your daily hours into this calculator to check whether your current plan is the right tier — or try our Claude Code Wrapped tool to turn the numbers into a shareable card.",
    },
  ],
};

export const metadata = toolMetadata(seo);

export default function Page() {
  return (
    <>
      <ToolJsonLd {...seo} />
      <CalculatorPage />
    </>
  );
}
