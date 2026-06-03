// components/layout/header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ChevronDown,
  Bookmark,
  LogOut,
  Settings,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()
          .then(({ data: p }) => setProfile(p));
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-bold text-xl shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="gradient-text">NextHub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-xl shadow-lg p-2 grid grid-cols-2 gap-1 z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/#${cat.value}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus-ring">
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarImage
                        src={profile?.avatar_url || user.user_metadata?.avatar_url}
                        alt={profile?.full_name || "User"}
                      />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {(profile?.full_name || user.email || "U")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium truncate">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/bookmarks"
                      className="flex items-center gap-2"
                    >
                      <Bookmark className="w-4 h-4" />
                      Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Blog
            </Link>
            <div className="pt-1 pb-1 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/#${cat.value}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            {!user && (
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
