// app/blog/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogCard } from "@/components/blog/blog-card";
import { AdSlot } from "@/components/layout/ad-slot";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles, guides, and insights about the web's best tools and services.",
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "NextHub Blog",
    description: "Articles and insights about the web's best tools",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero */}
          <div className="border-b border-border bg-card/50 py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                The <span className="gradient-text">NextHub</span> Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                Articles, guides, and curated insights about the best tools on
                the web.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <AdSlot slot="blog-top" format="horizontal" />

                {!posts || posts.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">
                      No posts yet
                    </p>
                    <p className="text-sm">Check back soon for new content.</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <BlogCard key={post.id} post={post as any} />
                  ))
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Latest posts */}
                {posts && posts.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-display font-bold mb-4">
                      Latest Posts
                    </h3>
                    <div className="space-y-3">
                      {posts.slice(0, 5).map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="block group"
                        >
                          <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {post.published_at
                              ? formatDate(post.published_at)
                              : "Draft"}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <AdSlot slot="blog-sidebar" format="rectangle" />
              </aside>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
