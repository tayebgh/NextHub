// app/contact/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Mail, MessageSquare } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    // In production: send via Resend or similar
    // For now, simulate success
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">Get in Touch</h1>
          <p className="text-muted-foreground">
            Have a question, want to suggest a website, or report an issue?
            We&apos;d love to hear from you.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">
              Message sent!
            </h2>
            <p className="text-muted-foreground">
              Thanks for reaching out. We&apos;ll get back to you as soon as
              possible.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => setStatus("idle")}
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card border border-border rounded-2xl p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Subject
              </label>
              <input
                type="text"
                {...register("subject")}
                placeholder="Website submission, bug report, etc."
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring"
              />
              {errors.subject && (
                <p className="text-xs text-destructive mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Message
              </label>
              <textarea
                {...register("message")}
                rows={6}
                placeholder="Tell us what's on your mind..."
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus-ring resize-none"
              />
              {errors.message && (
                <p className="text-xs text-destructive mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Send Message
            </Button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
