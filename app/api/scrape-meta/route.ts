// app/api/scrape-meta/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ url: z.string().url() });

async function scrapeMetadata(url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NextHubBot/1.0; +https://nexthub.app)",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    // Extract title
    const titleMatch =
      html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
      html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
    const title = titleMatch?.[1]?.trim() || new URL(url).hostname;

    // Extract description (og:description > meta description)
    const ogDescMatch = html.match(
      /<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i
    ) || html.match(
      /<meta[^>]+content="([^"]+)"[^>]+property="og:description"/i
    );
    const metaDescMatch = html.match(
      /<meta[^>]+name="description"[^>]+content="([^"]+)"/i
    ) || html.match(
      /<meta[^>]+content="([^"]+)"[^>]+name="description"/i
    );
    const description =
      ogDescMatch?.[1]?.trim() ||
      metaDescMatch?.[1]?.trim() ||
      null;

    // Extract og:image
    const ogImageMatch =
      html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
      html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
    const ogImage = ogImageMatch?.[1]?.trim() || null;

    return {
      name: title.slice(0, 120),
      description: description?.slice(0, 300) || null,
      og_image: ogImage,
    };
  } catch (err) {
    const domain = new URL(url).hostname.replace("www.", "");
    return {
      name: domain,
      description: null,
      og_image: null,
    };
  }
}

export async function POST(req: Request) {
  try {
    // Admin-only via service role check
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url } = schema.parse(body);

    const meta = await scrapeMetadata(url);
    const domain = new URL(url).hostname;
    const logoUrl = `https://favicon.twenty.com/${domain}?size=128`;

    const supabase = await createAdminClient();

    // Update the website record
    const { data, error } = await supabase
      .from("websites")
      .update({
        name: meta.name,
        description: meta.description,
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("url", url)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, website: data, meta });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    console.error("Scrape error:", err);
    return NextResponse.json({ error: "Scrape failed" }, { status: 500 });
  }
}

// GET endpoint for quick metadata preview (no auth required)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const meta = await scrapeMetadata(url);
  const domain = new URL(url).hostname;

  return NextResponse.json({
    ...meta,
    logo_url: `https://favicon.twenty.com/${domain}?size=128`,
    domain,
  });
}
