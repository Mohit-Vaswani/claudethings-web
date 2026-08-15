"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import {
  POSTHOG_API_HOST,
  POSTHOG_ENABLED,
  POSTHOG_KEY,
  POSTHOG_UI_HOST,
} from "@/app/lib/posthog";

/**
 * Boots PostHog on the client. Rendered once from the root layout so it stays
 * mounted across client-side navigation and the singleton is only initialised
 * once.
 *
 * `defaults` is what makes this work under the App Router: it turns on
 * history-change pageviews, and an in-app route change is a pushState with no
 * full page load, so without it only the first page of a visit would be
 * recorded. It also switches on pageleave events, which is what web analytics
 * needs to compute time on page and bounce rate.
 */
export default function PostHogInit() {
  useEffect(() => {
    if (!POSTHOG_ENABLED) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_API_HOST,
      ui_host: POSTHOG_UI_HOST,
      defaults: "2025-05-24",
    });
  }, []);

  return null;
}
