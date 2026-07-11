import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { trackAICrawlerRequest } from "@datafast/ai-crawl";

export function middleware(request: NextRequest, event: NextFetchEvent) {
  // Fire-and-forget: the package uses event.waitUntil internally,
  // so the response is never blocked on DataFast.
  trackAICrawlerRequest(request, event, {
    websiteId: "dfid_2KgXjGdUBXKPy7nxWR30T",
  });

  return NextResponse.next();
}

export const config = {
  // Skip API routes, framework internals, and obvious static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
