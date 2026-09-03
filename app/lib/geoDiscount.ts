"use client";

import { useEffect, useState } from "react";

/**
 * Purchasing-power launch discount.
 *
 * The visitor's country comes from the `visitor_country` cookie that
 * middleware.ts writes from Vercel's `x-vercel-ip-country` edge header.
 * It's read after mount, not at render time: the landing page is statically
 * rendered and CDN-cached, so per-visitor country can't be baked into the HTML
 * without opting the whole page out of the cache.
 *
 * Nothing here enforces the discount, the code below must exist in the Polar
 * dashboard, and it ships in the client bundle, so treat it as public.
 */

/**
 * Countries that get the offer, ISO 3166-1 alpha-2.
 *
 * Criteria: every World Bank low-income and lower-middle-income economy, plus
 * upper-middle-income markets whose GNI per capita sits well under the global
 * average and which PPP pricing lists conventionally include (BR, CN, MX, TR,
 * ZA, TH, MY and similar).
 *
 * Deliberately excluded: countries Polar/Stripe cannot process payments for
 * (CU, IR, KP, SY, RU, BY). Showing them an offer they can't check out with is
 * worse than showing them nothing.
 */
const ELIGIBLE_COUNTRIES = [
  // South, Southeast and Central Asia
  "IN", "PK", "BD", "LK", "NP", "BT", "AF", "MM", "KH", "LA", "VN", "ID",
  "PH", "TL", "MN", "UZ", "KG", "TJ", "TM", "KZ", "CN", "TH", "MY",
  // Caucasus, Eastern Europe and the Balkans
  "AM", "AZ", "GE", "MD", "UA", "AL", "BA", "BG", "MK", "ME", "RS", "XK",
  // Middle East and North Africa
  "IQ", "JO", "LB", "YE", "PS", "TR", "EG", "DZ", "MA", "TN", "LY",
  // Sub-Saharan Africa
  "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CD", "CG",
  "CI", "DJ", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE",
  "LS", "LR", "MG", "MW", "ML", "MR", "MZ", "NA", "NE", "NG", "RW", "ST",
  "SN", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "UG", "ZM", "ZW",
  // Latin America and the Caribbean
  "AR", "BO", "BR", "CO", "DO", "EC", "SV", "GT", "GY", "HT", "HN", "JM",
  "MX", "NI", "PY", "PE", "SR", "BZ",
  // Pacific
  "PG", "FJ", "SB", "VU", "WS", "TO", "KI", "FM", "MH", "TV",
] as const;

export const GEO_DISCOUNT = {
  /** Countries that get the offer. */
  countries: new Set<string>(ELIGIBLE_COUNTRIES),
  /** Must match the discount code created in the Polar dashboard. */
  code: "SAVE50",
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
 * The country's flag emoji, built from the two regional indicator symbols its
 * letters map to. Saves hand-maintaining a 100-entry emoji table.
 */
function flagFor(country: string): string {
  return String.fromCodePoint(
    ...[...country].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

/**
 * The country's English name, e.g. "IN" -> "India". `Intl.DisplayNames` is in
 * every browser we support, but it's feature-detected anyway: the banner falls
 * back to "your country" rather than printing a raw country code at someone.
 */
function nameFor(country: string): string | null {
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    const name = names.of(country);
    return name && name !== country ? name : null;
  } catch {
    return null;
  }
}

export type GeoOffer = {
  /** True once we've confirmed client-side that the visitor is eligible. */
  eligible: boolean;
  /** ISO code, flag and English name of the visitor's country when eligible. */
  country: string | null;
  countryName: string | null;
  flag: string | null;
};

const NO_OFFER: GeoOffer = {
  eligible: false,
  country: null,
  countryName: null,
  flag: null,
};

/**
 * The visitor's purchasing-power offer. Always ineligible on the server pass
 * and on the first paint, so the markup hydrates cleanly and visitors outside
 * the list never see the offer.
 */
export function useGeoDiscount(): GeoOffer {
  const [offer, setOffer] = useState<GeoOffer>(NO_OFFER);

  useEffect(() => {
    const country = readCountryCookie();
    if (!country || !GEO_DISCOUNT.countries.has(country)) return;
    setOffer({
      eligible: true,
      country,
      countryName: nameFor(country),
      flag: flagFor(country),
    });
  }, []);

  return offer;
}

/**
 * Appends the discount code to a Polar checkout link for eligible visitors.
 *
 * Note: `discount_code` only *prefills* Polar's discount box, the customer
 * still has to press Apply, which is why the banner copy says so. True
 * auto-apply requires separate Checkout Links with the discount preset on the
 * link in the Polar dashboard; if those get made, swap the base URLs in
 * app/lib/plans.ts instead of calling this.
 */
export function withDiscount(checkoutUrl: string, eligible: boolean): string {
  if (!eligible) return checkoutUrl;
  const url = new URL(checkoutUrl);
  url.searchParams.set("discount_code", GEO_DISCOUNT.code);
  return url.toString();
}
