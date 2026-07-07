import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API endpoints and the personal saved page have no SEO value
      disallow: ["/api/", "/saved"],
    },
    sitemap: "https://portalpropertythailand.com/sitemap.xml",
  };
}
