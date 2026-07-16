/**
 * Claude API + subscription pricing constants shared by the free tools
 * (Claude Code Wrapped, Plan Calculator, Token Counter).
 *
 * Prices are per million tokens (MTok), in USD, and mirror Anthropic's public
 * price list. Update here when Anthropic changes pricing — every tool that
 * shows a $ figure reads from this file and shows a "prices as of" note.
 */

export const PRICES_AS_OF = "July 2026";

export interface ModelPrice {
  /** Substring matched against ccusage / API model ids (e.g. "claude-opus-4-8"). */
  match: string;
  label: string;
  input: number; // $ / MTok
  output: number; // $ / MTok
  cacheWrite: number; // $ / MTok (5-minute cache write)
  cacheRead: number; // $ / MTok
}

/** Ordered — first substring match wins. */
export const MODEL_PRICES: ModelPrice[] = [
  { match: "opus", label: "Claude Opus", input: 15, output: 75, cacheWrite: 18.75, cacheRead: 1.5 },
  { match: "sonnet", label: "Claude Sonnet", input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 },
  { match: "haiku", label: "Claude Haiku", input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 },
];

/** Fallback when a model id doesn't match anything above (priced like Sonnet). */
export const DEFAULT_MODEL_PRICE: ModelPrice = {
  match: "",
  label: "Claude",
  input: 3,
  output: 15,
  cacheWrite: 3.75,
  cacheRead: 0.3,
};

export function priceForModel(modelId: string): ModelPrice {
  const id = modelId.toLowerCase();
  return MODEL_PRICES.find((m) => id.includes(m.match)) ?? DEFAULT_MODEL_PRICE;
}

/** Cost in USD for a token breakdown of one model. */
export function apiCost(
  modelId: string,
  tokens: { input: number; output: number; cacheWrite: number; cacheRead: number }
): number {
  const p = priceForModel(modelId);
  return (
    (tokens.input * p.input +
      tokens.output * p.output +
      tokens.cacheWrite * p.cacheWrite +
      tokens.cacheRead * p.cacheRead) /
    1_000_000
  );
}

/* ------------------------------ subscription plans ------------------------------ */

export interface Plan {
  id: string;
  name: string;
  monthly: number; // $ / month, billed monthly
  annualMonthly: number; // $ / month equivalent when billed annually
  /**
   * Rough included usage expressed as estimated Claude Code $-equivalent per
   * 5-hour session window, based on Anthropic's published "expected usage"
   * guidance and community measurements. These are ESTIMATES — limits are
   * dynamic and vary with model mix and demand.
   */
  estSessionValue: number;
  sessionsPerMonth: number; // ~ how many 5-hour windows a heavy user actually uses
  blurb: string;
}

export const PLANS: Plan[] = [
  {
    id: "pro",
    name: "Pro",
    monthly: 20,
    annualMonthly: 17,
    estSessionValue: 10,
    sessionsPerMonth: 45,
    blurb: "Everyday use — Sonnet in Claude Code, ~45 messages / 5-hour window.",
  },
  {
    id: "max5",
    name: "Max 5x",
    monthly: 100,
    annualMonthly: 100,
    estSessionValue: 50,
    sessionsPerMonth: 45,
    blurb: "5× Pro limits, Opus access — for daily multi-hour Claude Code sessions.",
  },
  {
    id: "max20",
    name: "Max 20x",
    monthly: 200,
    annualMonthly: 200,
    estSessionValue: 200,
    sessionsPerMonth: 45,
    blurb: "20× Pro limits — for running Claude Code (and subagents) all day.",
  },
];

export function fmtUsd(n: number, digits = 2): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}
