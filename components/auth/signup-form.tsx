// components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Github, Chrome, CheckCircle } from "lucide-react";

const schema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    setOauthLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (success) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-display font-bold mb-2">Check your inbox</h2>
        <p className="text-muted-foreground text-sm">
          We sent a confirmation email. Click the link to activate your account.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
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

      <div className="relative flex items-center gap-4 mb-6">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or sign up with email</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Full name</label>
          <input
            type="text"
            {...register("full_name")}
            placeholder="Jane Doe"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring focus:border-primary/50 transition-colors"
          />
          {errors.full_name && (
            <p className="text-xs text-destructive mt-1">{errors.full_name.message}</p>
          )}
        </div>

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
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Min. 8 characters"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring focus:border-primary/50 transition-colors"
          />
          {errors.password && (
            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Confirm password</label>
          <input
            type="password"
            {...register("confirm")}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring focus:border-primary/50 transition-colors"
          />
          {errors.confirm && (
            <p className="text-xs text-destructive mt-1">{errors.confirm.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Create Account
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By signing up, you agree to our{" "}
          <a href="/terms" className="underline">Terms</a> and{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
}
