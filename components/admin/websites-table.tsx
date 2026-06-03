// components/admin/websites-table.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { getDomain, getFaviconUrl } from "@/lib/utils";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Star,
  StarOff,
  RefreshCw,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { CATEGORIES, type Website } from "@/types";

interface AdminWebsitesTableProps {
  initialWebsites: Website[];
}

const EMPTY_FORM = {
  url: "",
  name: "",
  description: "",
  category: "services" as const,
  is_featured: false,
};

export function AdminWebsitesTable({
  initialWebsites,
}: AdminWebsitesTableProps) {
  const [websites, setWebsites] = useState(initialWebsites);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const supabase = createClient();

  const handleScrape = async () => {
    if (!form.url) return;
    setScraping(true);
    try {
      const res = await fetch(
        `/api/scrape-meta?url=${encodeURIComponent(form.url)}`
      );
      const data = await res.json();
      setForm((f) => ({
        ...f,
        name: data.name || f.name,
        description: data.description || f.description,
      }));
    } catch {}
    setScraping(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase
      .from("websites")
      .insert({
        ...form,
        logo_url: `https://favicon.twenty.com/${new URL(form.url).hostname}?size=128`,
      })
      .select()
      .single();

    if (!error && data) {
      setWebsites((prev) => [data as Website, ...prev]);
      setForm(EMPTY_FORM);
      setShowAdd(false);
    } else {
      alert(error?.message || "Failed to add website");
    }
    setSaving(false);
  };

  const toggleFeatured = async (website: Website) => {
    setActionId(website.id);
    const { error } = await supabase
      .from("websites")
      .update({ is_featured: !website.is_featured })
      .eq("id", website.id);
    if (!error) {
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === website.id ? { ...w, is_featured: !w.is_featured } : w
        )
      );
    }
    setActionId(null);
  };

  const toggleActive = async (website: Website) => {
    setActionId(website.id);
    const { error } = await supabase
      .from("websites")
      .update({ is_active: !website.is_active })
      .eq("id", website.id);
    if (!error) {
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === website.id ? { ...w, is_active: !w.is_active } : w
        )
      );
    }
    setActionId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this website? This cannot be undone.")) return;
    setActionId(id);
    const { error } = await supabase.from("websites").delete().eq("id", id);
    if (!error) setWebsites((prev) => prev.filter((w) => w.id !== id));
    setActionId(null);
  };

  const handleRescrape = async (website: Website) => {
    setActionId(website.id);
    try {
      await fetch("/api/scrape-meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ url: website.url }),
      });
    } catch {}
    setActionId(null);
  };

  return (
    <div>
      {/* Add form */}
      <div className="mb-6">
        {!showAdd ? (
          <Button onClick={() => setShowAdd(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Website
          </Button>
        ) : (
          <form
            onSubmit={handleAdd}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <h3 className="font-display font-bold text-lg">Add New Website</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://example.com"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus-ring"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleScrape}
                    disabled={scraping || !form.url}
                    className="shrink-0"
                  >
                    {scraping ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus-ring"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus-ring resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as any }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus-ring"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_featured: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="is_featured" className="text-sm font-medium">
                  Featured
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Add Website
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Websites table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Site
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Bookmarks
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {websites.map((website) => (
                <tr
                  key={website.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                        <Image
                          src={website.logo_url || getFaviconUrl(website.url)}
                          alt={website.name}
                          fill
                          className="object-contain p-0.5"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/icons/globe.svg";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{website.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getDomain(website.url)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {website.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    {website.bookmark_count}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          website.is_active
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {website.is_active ? "Active" : "Hidden"}
                      </span>
                      {website.is_featured && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        title="Visit site"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => toggleFeatured(website)}
                        disabled={actionId === website.id}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-amber-500 hover:bg-accent transition-colors"
                        title={
                          website.is_featured ? "Remove featured" : "Feature"
                        }
                      >
                        {website.is_featured ? (
                          <StarOff className="w-3.5 h-3.5" />
                        ) : (
                          <Star className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleActive(website)}
                        disabled={actionId === website.id}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        title={website.is_active ? "Hide site" : "Activate"}
                      >
                        {website.is_active ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(website.id)}
                        disabled={actionId === website.id}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
                        title="Delete"
                      >
                        {actionId === website.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
