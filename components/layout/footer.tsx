// components/layout/footer.tsx
import Link from "next/link";
import { CATEGORIES } from "@/types";
import { Zap, Github, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span>NextHub</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Your curated directory of the web's essential tools, services, and resources.
            </p>
            <div className="flex gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.value}>
                  <Link
                    href={`/#${cat.value}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-xs">{cat.icon}</span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More categories */}
          <div>
            <h3 className="font-semibold text-sm mb-4">More</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.value}>
                  <Link
                    href={`/#${cat.value}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-xs">{cat.icon}</span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Pages</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
              ].map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {year} NextHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
