import { SITE_NAME } from "@/app/lib/site";

/**
 * Build the URL for a dynamically-generated Open Graph image (see app/og/route.tsx).
 * Pass the page/blog title and an optional short label for the corner pill.
 * The returned relative URL is resolved against metadataBase by Next.js.
 */
export function ogImage(title: string, label = SITE_NAME): string {
  const params = new URLSearchParams({ title, label });
  return `/og?${params.toString()}`;
}
