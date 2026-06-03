// app/privacy/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NextHub privacy policy – how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-display font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              When you create an account, we collect your email address and any
              profile information you provide (name, avatar). When you use
              OAuth (GitHub, Google), we receive basic profile data from those
              providers.
            </p>
            <p>
              We store your bookmarks (references to websites you&apos;ve
              saved) and your newsletter subscription status if you choose to
              subscribe.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide and improve the NextHub service</li>
              <li>To send newsletter emails (only if you subscribe)</li>
              <li>To authenticate your account securely</li>
              <li>To aggregate anonymous usage statistics</li>
            </ul>
          </section>

          <section>
            <h2>3. Data Storage</h2>
            <p>
              Your data is stored securely in Supabase (PostgreSQL), hosted on
              infrastructure with industry-standard security practices.
              Row-Level Security policies ensure you can only access your own
              data.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li>
                <strong>Supabase</strong> – authentication and database
              </li>
              <li>
                <strong>Vercel</strong> – hosting and analytics
              </li>
              <li>
                <strong>Google Analytics</strong> – anonymous usage analytics
                (opt-in)
              </li>
              <li>
                <strong>Resend</strong> – transactional email delivery
              </li>
              <li>
                <strong>Google AdSense</strong> – advertising (may use cookies)
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>
              We use cookies solely for authentication session management.
              Third-party ad networks (Google AdSense) may set their own
              cookies for ad personalization.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              You may request deletion of your account and associated data at
              any time by contacting us. You can export your bookmarks at any
              time from your dashboard.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              For privacy-related inquiries, contact us via our{" "}
              <a href="/contact">contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
