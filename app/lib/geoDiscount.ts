"use client";

import { useEffect, useState } from "react";

/**
 * India-only launch discount.
 *
 * The visitor's country comes from the `visitor_country` cookie that
 * middleware.ts writes from Vercel's `x-vercel-ip-country` edge header.
 * It's read after mount, not at render time: the landing page is statically
 * rendered and CDN-cached, so per-visitor country can't be baked into the HTML
 * without opting the whole page out of the cache.
 *
 * Nothing here enforces the discount, the code below must exist in the Dodo
 * Payments dashboard, and it ships in the client bundle, so treat it as public.
 *
 * There is deliberately no prefill helper: the buy buttons point at dodo.pe
 * short links, which 302 to a fresh checkout session and drop the query string
 * on the way, so appending `?discount_code=` would silently do nothing. The
 * banner copy therefore asks the customer to type the code in themselves.
 */
export const GEO_DISCOUNT = {
  /** ISO 3166-1 alpha-2 country that gets the offer. */
  country: "IN",
  /** Must match the discount code created in the Dodo Payments dashboard. */
  code: "INDIAN50",
  percent: 50,
} as const;

export const COUNTRY_COOKIE = "visitor_country";

function readCountryCookie(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COUNTRY_COOKIE}=([A-Za-z]{2})(?:;|$)`)
  );
  return match ? match[1].toUpperCase() : null;
}

/**
 * True once we've confirmed client-side that the visitor is in India.
 * Always false on the server pass and on the first paint, so the markup
 * hydrates cleanly and non-Indian visitors never see the offer.
 */
export function useGeoDiscount(): boolean {
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    setEligible(readCountryCookie() === GEO_DISCOUNT.country);
  }, []);

  return eligible;
}
