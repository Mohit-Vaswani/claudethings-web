/**
 * Canonical site identity, single source of truth for the origin and brand name.
 *
 * The apex agentskit.co is canonical and is the host Vercel actually serves;
 * www.agentskit.co 308s to it, as do the legacy agentary.dev and
 * claudethings.com domains. Anything needing an absolute URL (metadataBase,
 * sitemap, robots, canonicals, OG images) should read from here rather than
 * hardcoding the domain, page-level canonicals are relative and resolve
 * against metadataBase, so they need no changes on a rename.
 *
 * This must match the serving host exactly: pointing canonicals at a hostname
 * that redirects makes Google resolve the canonical itself and weakens every
 * page on the site.
 */
export const SITE_URL = "https://agentskit.co";

/** Product name as shown in metadata, OG images, and page copy. */
export const SITE_NAME = "AgentsKit";

/** Bare host, for analytics config and anywhere the scheme is unwanted. */
export const SITE_DOMAIN = "agentskit.co";
