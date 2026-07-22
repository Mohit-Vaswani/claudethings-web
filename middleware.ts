import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { trackAICrawlerRequest } from "@datafast/ai-crawl";

// Kept in sync by hand with COUNTRY_COOKIE in app/lib/geoDiscount.ts — that
// module is "use client" and pulls in React, so it can't be imported here.
const COUNTRY_COOKIE = "visitor_country";

export function middleware(request: NextRequest, event: NextFetchEvent) {
  // Fire-and-forget: the package uses event.waitUntil internally,
  // so the response is never blocked on DataFast.
  trackAICrawlerRequest(request, event, {
    websiteId: "dfid_2KgXjGdUBXKPy7nxWR30T",
  });

  const response = NextResponse.next();

  // Vercel sets x-vercel-ip-country on every edge request; it's absent in local
  // dev, where the cookie simply never gets written. `?country=XX` is a manual
  // override so the India pricing offer can be checked from anywhere.
  //
  // The override has to be validated *before* it's preferred: a junk value like
  // ?country=xyz is non-null, so falling back with ?? would let it shadow the
  // real header and drop an Indian visitor's discount.
  const isCountryCode = (v: string | null): v is string =>
    v !== null && /^[A-Za-z]{2}$/.test(v);

  const override = request.nextUrl.searchParams.get("country");
  const country = isCountryCode(override)
    ? override
    : request.headers.get("x-vercel-ip-country");

  if (isCountryCode(country)) {
    response.cookies.set(COUNTRY_COOKIE, country.toUpperCase(), {
      path: "/",
      sameSite: "lax",
      // Read by client JS in app/lib/geoDiscount.ts, so not httpOnly.
      httpOnly: false,
      // Re-check daily so someone who travels isn't stuck on a stale country.
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

export const config = {
  // Skip API routes, framework internals, and obvious static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
