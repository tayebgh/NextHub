// components/cards/website-card.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { cn, getFaviconUrl, getDomain, formatNumber } from "@/lib/utils";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Star,
  TrendingUp,
} from "lucide-react";
import type { Website } from "@/types";

interface WebsiteCardProps {
  website: Website;
  compact?: boolean;
}

export function WebsiteCard({ website, compact = false }: WebsiteCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(website.bookmark_count);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("user_bookmarks")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("website_id", website.id)
          .maybeSingle()
          .then(({ data: bm }) => setIsBookmarked(!!bm));
      }
    });

    // Subscribe to real-time bookmark count changes
    const channel = supabase
      .channel(`website-${website.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "websites",
          filter: `id=eq.${website.id}`,
        },
        (payload) => {
          setBookmarkCount((payload.new as Website).bookmark_count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [website.id, supabase]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("toggle_bookmark", {
        p_user_id: user.id,
        p_website_id: website.id,
      });

      if (!error) {
        const nowBookmarked = data as boolean;
        setIsBookmarked(nowBookmarked);
        setBookmarkCount((prev) => (nowBookmarked ? prev + 1 : prev - 1));
      }
    } catch (err) {
      console.error("Bookmark error:", err);
    } finally {
      setLoading(false);
    }
  };

  const faviconUrl = website.logo_url || getFaviconUrl(website.url);
  const domain = getDomain(website.url);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group">
        <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0">
          <Image
            src={faviconUrl}
            alt={website.name}
            fill
            className="object-contain p-0.5"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/icons/globe.svg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{website.name}</p>
          <p className="text-xs text-muted-foreground truncate">{domain}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmark}
            className={cn(
              "p-1.5 rounded-md transition-all",
              isBookmarked
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col p-4 rounded-xl border border-border bg-card card-glow">
      {/* Featured badge */}
      {website.is_featured && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full">
          <Star className="w-2.5 h-2.5 fill-current" />
          Featured
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
          <Image
            src={faviconUrl}
            alt={website.name}
            fill
            sizes="48px"
            className="object-contain p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/icons/globe.svg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-semibold text-sm leading-tight mb-0.5 truncate">
            {website.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">{domain}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
        {website.description || `Visit ${website.name}`}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        {/* Bookmark toggle */}
        <button
          onClick={handleBookmark}
          disabled={loading}
          className={cn(
            "flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg transition-all",
            isBookmarked
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
          )}
          title={isBookmarked ? "Remove bookmark" : "Bookmark this site"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-3.5 h-3.5" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
          <span>{formatNumber(bookmarkCount)}</span>
        </button>

        {/* Traffic indicator */}
        {website.traffic_rank && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>#{website.traffic_rank}</span>
          </div>
        )}

        {/* Visit button */}
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Visit
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
