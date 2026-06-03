// components/dashboard/profile-settings-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CheckCircle } from "lucide-react";

const schema = z.object({
  full_name: z.string().min(1, "Name is required").max(100),
  username: z
    .string()
    .min(3, "Min 3 characters")
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Only lowercase letters, numbers, _ and -")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export function ProfileSettingsForm({ profile }: { profile: any }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name || "",
      username: profile?.username || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");
    setSaved(false);

    const { error: err } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        username: data.username || null,
      })
      .eq("id", profile.id);

    if (err) {
      if (err.code === "23505") {
        setError("That username is already taken.");
      } else {
        setError(err.message);
      }
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-xl space-y-8">
      {/* Avatar section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-border">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {(profile?.full_name || profile?.email || "U")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">
              Avatar is synced from your OAuth provider (GitHub / Google).
            </p>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Personal Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              {...register("full_name")}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring"
            />
            {errors.full_name && (
              <p className="text-xs text-destructive mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                @
              </span>
              <input
                type="text"
                {...register("username")}
                className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring"
                placeholder="yourusername"
              />
            </div>
            {errors.username && (
              <p className="text-xs text-destructive mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
            {saved && (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Saved!
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/30 rounded-xl p-6">
        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting your account is permanent and cannot be undone. All your
          bookmarks will be lost.
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (
              confirm(
                "Are you sure? This will permanently delete your account."
              )
            ) {
              // Account deletion would require a server action or API route
              alert("Please contact support to delete your account.");
            }
          }}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
