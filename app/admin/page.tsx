// app/admin/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { AdminWebsitesTable } from "@/components/admin/websites-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: websites, count } = await supabase
    .from("websites")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: stats } = await supabase
    .from("websites")
    .select("is_active, is_featured")
    .eq("is_active", true);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold mb-1">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage websites, blog posts, and users
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Websites", value: count || 0 },
            { label: "Active", value: stats?.length || 0 },
            {
              label: "Featured",
              value: stats?.filter((s) => s.is_featured).length || 0,
            },
            { label: "Categories", value: 10 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-4"
            >
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <AdminWebsitesTable initialWebsites={(websites || []) as any} />
      </main>
    </div>
  );
}
