// app/auth/signup/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free NextHub account",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Start bookmarking your favorite websites for free
            </p>
          </div>
          <SignupForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
