// app/not-found.tsx
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="text-8xl font-display font-bold gradient-text mb-4">
            404
          </p>
          <h1 className="text-2xl font-display font-bold mb-3">
            Page not found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/blog">Read the blog</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
