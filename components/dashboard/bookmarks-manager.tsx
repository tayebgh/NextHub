// components/dashboard/bookmarks-manager.tsx
"use client";

import { useState, useRef } from "react";
import { WebsiteCard } from "@/components/cards/website-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Download,
  Upload,
  Loader2,
  BookmarkX,
  Search,
} from "lucide-react";
import { generateBookmarkHTML, parseBookmarkHTML } from "@/lib/utils";
import type { UserBookmark, Website } from "@/types";

interface BookmarksManagerProps {
  initialBookmarks: Array<UserBookmark & { website: Website }>;
  userId: string;
}

export function BookmarksManager({
  initialBookmarks,
  userId,
}: BookmarksManagerProps) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const filtered = bookmarks.filter(
    (b) =>
      b.website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.website.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export bookmarks as Netscape HTML format
  const handleExport = () => {
    const data = bookmarks.map((b) => ({
      name: b.website.name,
      url: b.website.url,
      addedAt: b.created_at,
    }));
    const html = generateBookmarkHTML(data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexthub-bookmarks.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import bookmarks from browser HTML file
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const urls = parseBookmarkHTML(text);

      if (urls.length === 0) {
        setImportResult("No valid URLs found in the file.");
        setImporting(false);
        return;
      }

      // Look up existing websites by URL
      const { data: existingWebsites } = await supabase
        .from("websites")
        .select("id, url")
        .in("url", urls);

      const toBookmark = (existingWebsites || []).filter(
        (w) => !bookmarks.some((b) => b.website_id === w.id)
      );

      if (toBookmark.length === 0) {
        setImportResult(
          `Found ${urls.length} URLs — all already bookmarked or not in directory.`
        );
        setImporting(false);
        return;
      }

      // Insert bookmarks
      const { error } = await supabase.from("user_bookmarks").insert(
        toBookmark.map((w) => ({ user_id: userId, website_id: w.id }))
      );

      if (!error) {
        // Refresh bookmarks list
        const { data: newBookmarks } = await supabase
          .from("user_bookmarks")
          .select("*, website:websites(*)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        setBookmarks((newBookmarks || []) as any);
        setImportResult(
          `Successfully imported ${toBookmark.length} bookmark${toBookmark.length !== 1 ? "s" : ""}.`
        );
      }
    } catch (err) {
      setImportResult("Error reading file. Please try again.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus-ring"
          />
        </div>

        {/* Export */}
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={bookmarks.length === 0}
          className="gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          Export ({bookmarks.length})
        </Button>

        {/* Import */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm"
            onChange={handleImport}
            className="hidden"
            id="bookmark-import"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="gap-2 w-full sm:w-auto"
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Import HTML
          </Button>
        </div>
      </div>

      {/* Import result message */}
      {importResult && (
        <div className="bg-muted border border-border rounded-lg px-4 py-3 text-sm">
          {importResult}
        </div>
      )}

      {/* Bookmarks grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookmarkX className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-1">
            {searchQuery ? "No results found" : "No bookmarks yet"}
          </p>
          <p className="text-sm">
            {searchQuery
              ? "Try a different search term"
              : "Start bookmarking websites from the home page"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <WebsiteCard key={b.id} website={b.website} />
          ))}
        </div>
      )}
    </div>
  );
}
