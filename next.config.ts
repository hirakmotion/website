import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the site builds to plain files in `out/` and can be hosted
  // anywhere (Vercel, Netlify, Cloudflare Pages, GitHub Pages, any web server).
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
