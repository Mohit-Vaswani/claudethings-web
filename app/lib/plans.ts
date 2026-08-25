/**
 * The three Dodo Payments products, in one place.
 *
 * Every page that renders a buy button needs the exact same checkout links.
 * Keeping the URLs here means a product swap in Dodo is a one-line change
 * instead of a find-and-replace across pages.
 */

export type Plan = {
  /** Stable id, also sent to DataFast as `data-fast-goal-plan`. */
  id: "engineer" | "bundle" | "marketing";
  name: string;
  /** One-line "who is this for". */
  who: string;
  /** Buy-button label, so every page asks for the sale in the same words. */
  cta: string;
  /** List price in USD, before any discount code. */
  price: number;
  /** Struck-through anchor price, when the plan has one. */
  was?: number;
  /**
   * DODO PAYMENTS: hosted checkout link.
   *
   * These are dodo.pe short links; each one 302s to a fresh
   * checkout.dodopayments.com/session/... URL and drops any query string on
   * the way, so never try to pass params (discount codes, prefills) here.
   */
  checkoutUrl: string;
  features: string[];
  /** The visually promoted plan in the price grid. */
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "engineer",
    name: "Engineer Kit",
    who: "the software team",
    cta: "Get Engineer Kit",
    price: 59,
    checkoutUrl: "https://dodo.pe/engkit",
    features: [
      "58 engineering agents",
      "61 pre-built skills",
      "159 slash commands",
      "CLAUDE.md template + CLI",
      "Private repo + lifetime updates",
    ],
  },
  {
    id: "bundle",
    name: "Complete Bundle",
    who: "engineer + marketing",
    cta: "Get the Bundle",
    price: 99,
    was: 139,
    featured: true,
    checkoutUrl: "https://dodo.pe/kit",
    features: [
      "Everything in both kits",
      "89 agents · 122 skills · 181 commands",
      "Ship code and growth",
      "Both CLAUDE.md templates",
      "Private repo + lifetime updates",
    ],
  },
  {
    id: "marketing",
    name: "Marketing Kit",
    who: "the growth team",
    cta: "Get Marketing Kit",
    price: 59,
    checkoutUrl: "https://dodo.pe/marketingkit",
    features: [
      "31 marketing agents",
      "61 pre-built skills",
      "32 slash commands",
      "Brand CLAUDE.md template + CLI",
      "Private repo + lifetime updates",
    ],
  },
];

/** Lookup by id, for the pages that render one specific plan. */
export const PLAN_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p])) as Record<
  Plan["id"],
  Plan
>;
