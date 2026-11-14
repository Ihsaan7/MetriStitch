/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML, CSS and JS only. Cloudflare Pages serves the `out` folder.
  output: 'export',
  // Directory-style URLs (/privacy/) work cleanly on Cloudflare Pages.
  trailingSlash: true,
  // Next's image optimizer needs a server. Images are pre-optimized (see `npm run images`).
  images: { unoptimized: true },
    eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
