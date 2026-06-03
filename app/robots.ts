// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexthub.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api/", "/auth/callback"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
