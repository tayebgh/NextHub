// app/api/websites/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const querySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));

    const supabase = await createClient();
    let query = supabase
      .from("websites")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("bookmark_count", { ascending: false })
      .range(params.offset, params.offset + params.limit - 1);

    if (params.q) {
      query = query.ilike("name", `%${params.q}%`);
    }
    if (params.category) {
      query = query.eq("category", params.category);
    }
    if (params.featured !== undefined) {
      query = query.eq("is_featured", params.featured);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data, count, params });
  } catch (err) {
    console.error("Websites API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch websites" },
      { status: 500 }
    );
  }
}

// Admin: create a new website entry
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const websiteSchema = z.object({
      url: z.string().url(),
      name: z.string().min(1).max(120),
      description: z.string().max(300).optional(),
      logo_url: z.string().url().optional(),
      category: z.enum([
        "web_search", "social_network", "services", "productivity",
        "ai_tools", "design", "marketing", "developer_tools",
        "entertainment", "news",
      ]),
      is_featured: z.boolean().default(false),
      traffic_rank: z.number().int().positive().optional(),
    });

    const validated = websiteSchema.parse(body);

    // Auto-fetch logo if not provided
    if (!validated.logo_url) {
      const domain = new URL(validated.url).hostname;
      validated.logo_url = `https://favicon.twenty.com/${domain}?size=128`;
    }

    const { data, error } = await supabase
      .from("websites")
      .insert(validated)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Website already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }
    console.error("Create website error:", err);
    return NextResponse.json({ error: "Failed to create website" }, { status: 500 });
  }
}
