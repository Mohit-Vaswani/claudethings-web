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
 * Nothing here enforces the discount — the code below must exist in the Polar
 * dashboard, and it ships in the client bundle, so treat it as public.
 */
export const GEO_DISCOUNT = {
  /** ISO 3166-1 alpha-2 country that gets the offer. */
  country: "IN",
  /** Must match the discount code created in the Polar dashboard. */
  code: "INDIA30",
  percent: 30,
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

/**
 * Appends the discount code to a Polar checkout link for eligible visitors.
 *
 * Note: `discount_code` only *prefills* Polar's discount box — the customer
 * still has to press Apply, which is why the banner copy says so. True
 * auto-apply requires separate India-only Checkout Links with the discount
 * preset on the link in the Polar dashboard; if those get made, swap the base
 * URLs in app/page.tsx instead of calling this.
 */
export function withDiscount(checkoutUrl: string, eligible: boolean): string {
  if (!eligible) return checkoutUrl;
  const url = new URL(checkoutUrl);
  url.searchParams.set("discount_code", GEO_DISCOUNT.code);
  return url.toString();
}
