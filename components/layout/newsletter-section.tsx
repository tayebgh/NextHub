// components/layout/newsletter-section.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function NewsletterSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        const body = await res.json();
        setErrorMessage(body.error || "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Stay in the loop
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Get weekly updates on new tools, featured sites, and curated picks
            delivered to your inbox.
          </p>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">You're subscribed! Welcome aboard.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-2 max-w-md mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus-ring focus:border-primary/50 transition-colors"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1 text-left">
                    {errors.email.message}
                  </p>
                )}
                {status === "error" && (
                  <p className="text-xs text-destructive mt-1 text-left">
                    {errorMessage}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="rounded-xl shrink-0"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
