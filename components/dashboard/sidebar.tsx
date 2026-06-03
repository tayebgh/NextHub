// components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Settings, LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function DashboardSidebar({ profile }: { profile: any }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0">
      {/* User info */}
      <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-card border border-border">
        <Avatar className="w-9 h-9">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {(profile?.full_name || profile?.email || "U")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {profile?.full_name || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {profile?.email}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
