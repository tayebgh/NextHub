// components/layout/hero-section.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/types";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-36 mesh-bg noise">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(243 75% 59%) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(280 65% 60%) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated web directory</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Discover the{" "}
            <span className="gradient-text">best of the web</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            A hand-curated directory of the web&apos;s essential tools, services, and
            resources — organized and ready to explore.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-lg mx-auto mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search websites, tools, services..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus-ring focus:border-primary/50 transition-colors"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-xl shrink-0">
              Search
            </Button>
          </form>

          {/* Quick category links */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <a
                key={cat.value}
                href={`#${cat.value}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-sm hover:bg-accent hover:border-primary/30 transition-all"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </a>
            ))}
            <a
              href="#more"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary hover:bg-primary/20 transition-all"
            >
              More <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">500+</p>
              <p>Curated sites</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                {CATEGORIES.length}
              </p>
              <p>Categories</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                Free
              </p>
              <p>Always</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
