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
  const country =
    request.nextUrl.searchParams.get("country") ??
    request.headers.get("x-vercel-ip-country");

  if (country && /^[A-Za-z]{2}$/.test(country)) {
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
