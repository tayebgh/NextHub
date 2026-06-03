// components/layout/categories-bar.tsx
"use client";

import { useRef } from "react";
import { CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";

export function CategoriesBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground shrink-0 hover:opacity-90 transition-opacity"
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <a
              key={cat.value}
              href={`#${cat.value}`}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium shrink-0 border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
