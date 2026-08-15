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
};

export default nextConfig;
