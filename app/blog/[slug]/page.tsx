// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdSlot } from "@/components/layout/ad-slot";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.og_image
        ? [{ url: post.og_image, width: 1200, height: 630 }]
        : undefined,
      type: "article",
      publishedTime: post.published_at || undefined,
      url: `${siteUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.og_image ? [post.og_image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data || []).map(({ slug }) => ({ slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const { data: latestPosts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, published_at")
    .eq("is_published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(5);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // Structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.meta_description,
    image: post.og_image || post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: (post.author as any)?.full_name || "NextHub",
    },
    publisher: {
      "@type": "Organization",
      name: "NextHub",
      url: siteUrl,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Article */}
            <article className="lg:col-span-2">
              {post.featured_image && (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 border border-border">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                {post.category && (
                  <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                )}
                {post.published_at && (
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                  </time>
                )}
                {(post.author as any)?.full_name && (
                  <span>by {(post.author as any).full_name}</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-6">
                {post.title}
              </h1>

              <AdSlot slot="post-top" format="horizontal" className="mb-8" />

              <BlogPostContent content={post.content} />

              <AdSlot slot="post-bottom" format="horizontal" className="mt-8" />
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
                <h3 className="font-display font-bold mb-4">Latest Posts</h3>
                <div className="space-y-3">
                  {(latestPosts || []).map((p) => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="block group"
                    >
                      <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.published_at ? formatDate(p.published_at) : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <AdSlot slot="post-sidebar" format="rectangle" />
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
