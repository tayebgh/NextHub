// app/sitemap.ts
import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexthub.app";
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/auth/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/auth/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("is_published", true);

  const blogPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
