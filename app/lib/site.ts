/**
 * Canonical site identity — single source of truth for the origin and brand name.
 *
 * www is canonical; the apex agentary.dev 308s to it, as do the legacy
 * agentskit.co and claudethings.com domains. Anything needing an absolute URL
 * (metadataBase, sitemap, robots, canonicals, OG images) should read from here
 * rather than hardcoding the domain — page-level canonicals are relative and
 * resolve against metadataBase, so they need no changes on a rename.
 */
export const SITE_URL = "https://www.agentary.dev";

/** Product name as shown in metadata, OG images, and page copy. */
export const SITE_NAME = "Agentary";

/** Bare host, for analytics config and anywhere the scheme is unwanted. */
export const SITE_DOMAIN = "agentary.dev";
