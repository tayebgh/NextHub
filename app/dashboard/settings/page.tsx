// app/dashboard/settings/page.tsx
import { createClient } from "@/lib/supabase/server";
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>
      <ProfileSettingsForm profile={profile} />
    </div>
  );
}
