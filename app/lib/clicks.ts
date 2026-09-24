/**
 * clicks.page analytics helpers.
 *
 * The tracker itself is a plain deferred <script> in the <head> of the root
 * layout, so it is present on every route and `window.clicks` is ready long
 * before a visitor can click anything. Every call here is still optional-
 * chained: the script is third-party and may be blocked, and analytics must
 * never be able to break a buy button.
 */

declare global {
  interface Window {
    clicks?: {
      /** Record a named conversion event. */
      track: (event: string, properties?: Record<string, unknown>) => void;
      /** Visitor id, for attributing server-created checkout sessions. */
      id: () => string | undefined;
    };
  }
}

/**
 * Fire the "signup" conversion.
 *
 * AgentsKit has no account signup — the kits are a one-time purchase and
 * access arrives as a GitHub invite — so the signup action here is a visitor
 * opening the Polar checkout. This sits alongside the existing DataFast
 * `initiate_checkout` goal on the same buttons and counts the same moment.
 */
export function trackSignup(): void {
  window.clicks?.track("signup");
}

export {};
