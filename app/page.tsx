// app/page.tsx
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { CategoriesBar } from "@/components/layout/categories-bar";
import { FeaturedSlider } from "@/components/cards/featured-slider";
import { CategorySection } from "@/components/cards/category-section";
import { NewsletterSection } from "@/components/layout/newsletter-section";
import { AdSlot } from "@/components/layout/ad-slot";
import { WebsiteCardSkeleton } from "@/components/cards/website-card-skeleton";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextHub – Curated Web Directory",
  description:
    "Discover the best websites across AI, productivity, developer tools, social networks and more. Your curated directory of the web's essential resources.",
};

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch all active websites
  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("is_active", true)
    .order("bookmark_count", { ascending: false });

  const featuredWebsites = (websites || []).filter((w) => w.is_featured);

  // Group by category
  const byCategory = CATEGORIES.reduce(
    (acc, cat) => {
      const items = (websites || []).filter((w) => w.category === cat.value);
      if (items.length > 0) acc[cat.value] = items;
      return acc;
    },
    {} as Record<string, typeof websites>
  );

  // Structured data for the directory
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NextHub",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description: "Curated web directory of the best tools and services",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
          <HeroSection />

          {/* AdSense Banner */}
          <div className="container mx-auto px-4 py-4">
            <AdSlot slot="home-top-banner" format="horizontal" />
          </div>

          <CategoriesBar />

          {/* Featured Slider */}
          {featuredWebsites.length > 0 && (
            <section className="py-12 bg-gradient-to-b from-background to-secondary/10">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-2xl font-display font-bold">
                    Featured Websites
                  </h2>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {featuredWebsites.length} picks
                  </span>
                </div>
                <Suspense
                  fallback={
                    <div className="flex gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <WebsiteCardSkeleton key={i} />
                      ))}
                    </div>
                  }
                >
                  <FeaturedSlider websites={featuredWebsites as any} />
                </Suspense>
              </div>
            </section>
          )}

          {/* Category Sections */}
          <div className="container mx-auto px-4 py-8 space-y-16">
            {CATEGORIES.map((cat, index) => {
              const items = byCategory[cat.value];
              if (!items || items.length === 0) return null;
              return (
                <div key={cat.value}>
                  {/* Insert ad every 3 categories */}
                  {index > 0 && index % 3 === 0 && (
                    <div className="mb-8">
                      <AdSlot slot={`category-${index}`} format="rectangle" />
                    </div>
                  )}
                  <Suspense
                    fallback={
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <WebsiteCardSkeleton key={i} />
                        ))}
                      </div>
                    }
                  >
                    <CategorySection
                      category={cat}
                      websites={items as any}
                    />
                  </Suspense>
                </div>
              );
            })}
          </div>

          <NewsletterSection />

          {/* Bottom AdSense */}
          <div className="container mx-auto px-4 py-4">
            <AdSlot slot="home-bottom-banner" format="horizontal" />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
