// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Github, Chrome } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    setOauthLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
      {/* OAuth buttons */}
      <div className="space-y-3 mb-6">
        <Button
          variant="outline"
          className="w-full gap-3"
          onClick={() => handleOAuth("github")}
          disabled={!!oauthLoading}
        >
          {oauthLoading === "github" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Github className="w-4 h-4" />
          )}
          Continue with GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full gap-3"
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading}
        >
          {oauthLoading === "google" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Chrome className="w-4 h-4" />
          )}
          Continue with Google
        </Button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-4 mb-6">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or sign in with email</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* Email/password form */}
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
            {...register("email")}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring focus:border-primary/50 transition-colors"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium">Password</label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring focus:border-primary/50 transition-colors"
          />
          {errors.password && (
            <p className="text-xs text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Sign In
        </Button>
      </form>
    </div>
  );
}
