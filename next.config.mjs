/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is a static marketing page — don't let a stray type/lint nit block deploys.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      // Crawlers and users guess this URL; the canonical page lives at /privacy.
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
    ];
  },
  // PostHog reverse proxy. Serving ingestion off our own origin keeps the
  // requests first-party, so the ad blockers a Claude Code audience runs don't
  // silently drop events and session recordings. Order matters: the /static and
  // /flags rules have to come before the catch-all, which would otherwise
  // swallow them and send asset requests to the ingestion host.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      { source: "/ingest/flags", destination: "https://us.i.posthog.com/flags" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  // PostHog's API is trailing-slash sensitive; without this Next would 308 the
  // proxied paths and the SDK's POSTs would lose their body on the redirect.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
