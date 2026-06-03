// app/terms/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "NextHub terms of use and user agreement.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-display font-bold mb-2">Terms of Use</h1>
        <p className="text-muted-foreground mb-10">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            By using NextHub, you agree to these terms. Please read them
            carefully.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using NextHub, you agree to be bound by these
            Terms of Use and our Privacy Policy.
          </p>

          <h2>2. Use of Service</h2>
          <p>NextHub is a free web directory service. You may:</p>
          <ul>
            <li>Browse and search the directory without an account</li>
            <li>Create a free account to bookmark websites</li>
            <li>Export and import bookmarks for personal use</li>
          </ul>
          <p>You may not:</p>
          <ul>
            <li>Attempt to scrape or abuse our API</li>
            <li>Use automated systems to create accounts or spam</li>
            <li>Submit malicious or harmful website URLs</li>
          </ul>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the security of your account
            credentials. We reserve the right to suspend accounts that violate
            these terms.
          </p>

          <h2>4. Content</h2>
          <p>
            We curate website listings and make no endorsement of any listed
            services. Inclusion in our directory does not imply recommendation.
          </p>

          <h2>5. Disclaimers</h2>
          <p>
            NextHub is provided &quot;as is&quot; without warranties of any
            kind. We are not responsible for the content, availability, or
            practices of external websites listed in our directory.
          </p>

          <h2>6. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the service
            after changes constitutes acceptance.
          </p>

          <h2>7. Contact</h2>
          <p>
            Questions? Reach us via our <a href="/contact">contact page</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
