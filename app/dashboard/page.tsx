// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { BookmarksManager } from "@/components/dashboard/bookmarks-manager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: bookmarks } = await supabase
    .from("user_bookmarks")
    .select(`
      *,
      website:websites(*)
    `)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">My Bookmarks</h1>
        <p className="text-muted-foreground">
          Manage, export, and import your saved websites
        </p>
      </div>
      <BookmarksManager
        initialBookmarks={(bookmarks || []) as any}
        userId={user!.id}
      />
    </div>
  );
}
