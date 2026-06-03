// app/auth/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/layout/header";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NextHub account",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your bookmarks and dashboard
            </p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
