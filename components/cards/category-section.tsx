// components/cards/category-section.tsx
import { WebsiteCard } from "@/components/cards/website-card";
import type { Website, CategoryMeta } from "@/types";

interface CategorySectionProps {
  category: CategoryMeta;
  websites: Website[];
}

export function CategorySection({ category, websites }: CategorySectionProps) {
  return (
    <section id={category.value} className="scroll-mt-20">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">
            {category.icon}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">{category.label}</h2>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {websites.length} sites
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {websites.slice(0, 8).map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>
    </section>
  );
}
