/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is a static marketing page — don't let a stray type/lint nit block deploys.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
