/**
 * Canonical site identity — single source of truth for the origin and brand name.
 *
 * The apex is canonical; www.agentskit.co redirects here. Anything needing an
 * absolute URL (metadataBase, sitemap, robots, canonicals, OG images) should
 * read from here rather than hardcoding the domain.
 */
export const SITE_URL = "https://agentskit.co";

/** Product name as shown in metadata, OG images, and page copy. */
export const SITE_NAME = "AgentsKit";

/** Bare host, for analytics config and anywhere the scheme is unwanted. */
export const SITE_DOMAIN = "agentskit.co";
