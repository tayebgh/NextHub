// app/about/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NextHub – a curated directory of the web's best tools and services.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-display font-bold mb-6">About NextHub</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            NextHub is a hand-curated directory of the web&apos;s essential
            tools, services, and resources — organized by category and ready to
            explore.
          </p>

          <h2>Our Mission</h2>
          <p>
            The web is vast and constantly growing. We believe it should be easy
            to discover the best tools available in any category — whether
            you&apos;re looking for productivity apps, AI tools, developer
            resources, or social platforms.
          </p>

          <h2>How It Works</h2>
          <p>
            Every website in our directory is manually reviewed and categorized
            by our team. We focus on quality over quantity, featuring only tools
            that genuinely provide value.
          </p>
          <ul>
            <li>Browse by category using our navigation bar</li>
            <li>
              Create a free account to bookmark your favourite websites
            </li>
            <li>Export your bookmarks to import into any browser</li>
            <li>Import your existing browser bookmarks to find matches</li>
          </ul>

          <h2>Submit a Website</h2>
          <p>
            Found a great tool that&apos;s not listed? We welcome community
            submissions. Reach out via our{" "}
            <a href="/contact">contact page</a> and we&apos;ll review it
            promptly.
          </p>

          <h2>Tech Stack</h2>
          <p>
            NextHub is built with Next.js 15, Supabase, TypeScript, and Tailwind
            CSS. We&apos;re committed to performance, accessibility, and
            open-web principles.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
