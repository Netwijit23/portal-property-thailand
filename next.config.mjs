/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve photos directly from the Supabase CDN. The admin app already
    // compresses uploads (~100 KB), and Vercel's image optimizer returns
    // 402 once the plan's transformation quota is exhausted — which showed
    // up as randomly broken listing photos.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "www.portalpropertyth.com" },
    ],
  },
};

export default nextConfig;
