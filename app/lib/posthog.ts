/**
 * PostHog config. One install covers session replay, product analytics and web
 * analytics — everything is driven by the snippet in PostHogInit.
 *
 * The project API key sits in the source next to the DataFast website id and the
 * GA measurement id for the same reason they do: it is a public, write-only
 * client key that ships in the bundle either way, so an env var would only add a
 * Vercel dashboard step that can drift out of sync with the repo.
 */
export const POSTHOG_KEY = "phc_REPLACE_ME";

/**
 * Whether a real key has been filled in above. The plumbing shipped ahead of the
 * key, and PostHog answers an unrecognised one with a 401 on every single event,
 * so without this a placeholder would put a stream of failed requests and
 * console errors on a live marketing page. Swap the key and this flips to true
 * on its own — nothing else needs touching.
 */
export const POSTHOG_ENABLED = POSTHOG_KEY.startsWith("phc_") && POSTHOG_KEY !== "phc_REPLACE_ME";

/**
 * First-party path that next.config.mjs rewrites onto PostHog's ingestion edge.
 * Going through our own origin keeps the requests first-party, so the ad
 * blockers a Claude Code audience runs don't quietly drop half the events.
 */
export const POSTHOG_API_HOST = "/ingest";

/**
 * The real PostHog origin. Only used so the toolbar and "view in PostHog" links
 * resolve to the dashboard rather than to the /ingest proxy path.
 */
export const POSTHOG_UI_HOST = "https://us.posthog.com";
