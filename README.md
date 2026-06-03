# NextHub — Curated Web Directory

A production-ready, full-stack web directory built with **Next.js 15**, **Supabase**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

- **Curated website cards** with favicons, descriptions, bookmark counters, featured badges
- **Real-time bookmark counts** via Supabase Realtime
- **Authentication** — GitHub OAuth, Google OAuth, and email/password
- **User dashboard** — bookmark management, export/import as browser HTML
- **Blog** — Markdown posts with SEO metadata, OG images, JSON-LD
- **Newsletter** — Supabase storage + Resend email delivery
- **Admin panel** — manage websites, toggle featured/active, auto-scrape metadata
- **SEO-ready** — sitemap.xml, robots.txt, structured data, dynamic OG images
- **AdSense-ready** — `<ins>` placeholders with responsive slots throughout
- **Analytics** — Vercel Analytics + Google Analytics 4
- **Dark/light mode** — persistent via `next-themes`
- **Responsive** — mobile-first design, loading skeletons, accessible

## 🏗️ Project Structure

```
nexthub/
├── app/
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout (fonts, themes, analytics)
│   ├── globals.css               # Design tokens, utilities
│   ├── sitemap.ts                # Dynamic sitemap
│   ├── robots.ts                 # Robots.txt
│   ├── not-found.tsx             # 404 page
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts     # OAuth callback
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Blog post (dynamic metadata)
│   ├── dashboard/
│   │   ├── layout.tsx            # Auth-protected layout
│   │   ├── page.tsx              # Bookmarks overview
│   │   └── settings/page.tsx     # Profile settings
│   ├── admin/
│   │   └── page.tsx              # Admin panel (role-protected)
│   └── api/
│       ├── og/route.tsx          # Dynamic OG image generation
│       ├── scrape-meta/route.ts  # Auto-scrape site metadata
│       ├── websites/route.ts     # Websites CRUD API
│       └── newsletter/subscribe/route.ts
├── components/
│   ├── layout/
│   │   ├── header.tsx            # Sticky nav + auth + theme toggle
│   │   ├── footer.tsx
│   │   ├── hero-section.tsx      # Hero with search
│   │   ├── categories-bar.tsx    # Sticky category chips
│   │   ├── newsletter-section.tsx
│   │   └── ad-slot.tsx           # AdSense placeholder
│   ├── cards/
│   │   ├── website-card.tsx      # Full card with bookmark toggle
│   │   ├── website-card-skeleton.tsx
│   │   ├── category-section.tsx
│   │   └── featured-slider.tsx   # Embla carousel
│   ├── blog/
│   │   ├── blog-card.tsx
│   │   └── blog-post-content.tsx # Markdown renderer
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── bookmarks-manager.tsx # Export/import HTML bookmarks
│   │   └── profile-settings-form.tsx
│   ├── admin/
│   │   └── websites-table.tsx    # CRUD table with scrape action
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── providers/
│   │   └── theme-provider.tsx
│   └── ui/
│       ├── button.tsx
│       ├── avatar.tsx
│       ├── dropdown-menu.tsx
│       ├── theme-toggle.tsx
│       └── toaster.tsx
├── lib/
│   ├── utils.ts                  # cn(), favicon, bookmark HTML
│   └── supabase/
│       ├── client.ts             # Browser Supabase client
│       └── server.ts             # Server Supabase client + admin
├── types/
│   ├── index.ts                  # App types + CATEGORIES constant
│   └── supabase.ts               # Generated DB types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Full schema + RLS + seed data
└── middleware.ts                  # Auth route protection
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/nexthub.git
cd nexthub
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration: **Supabase Dashboard → SQL Editor** → paste `supabase/migrations/001_initial_schema.sql`
3. Enable OAuth providers: **Auth → Providers** → enable GitHub and Google (add credentials)

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_...          # optional, for newsletter
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...   # optional
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-...  # optional
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (auto-created on signup via trigger) |
| `websites` | Directory entries with category, bookmark count, traffic rank |
| `user_bookmarks` | Join table for user ↔ website bookmarks |
| `blog_posts` | Blog content with Markdown, SEO fields |
| `newsletter_subscribers` | Email subscriptions |

### Key Database Features

- **Row Level Security** on all tables
- **Atomic bookmark toggle** via `toggle_bookmark()` SQL function
- **Real-time** enabled on `websites` table for live bookmark counts
- **Auto-profile creation** trigger on `auth.users` insert
- **15 seed websites** across 5 categories

## 👤 Making a User Admin

In Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

Then visit `/admin` to manage websites.

## 📡 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/websites?q=&category=&featured=` | Search/filter websites |
| `POST` | `/api/websites` | Create website (admin only) |
| `GET` | `/api/scrape-meta?url=` | Preview scraped metadata |
| `POST` | `/api/scrape-meta` | Scrape + update DB (service role) |
| `POST` | `/api/newsletter/subscribe` | Subscribe to newsletter |
| `GET` | `/api/og?title=&description=` | Generate OG image |
| `GET` | `/auth/callback` | OAuth redirect handler |

## 🎯 Adding Blog Posts

In Supabase Dashboard → Table Editor → `blog_posts`:

```json
{
  "slug": "my-first-post",
  "title": "Getting Started with AI Tools",
  "excerpt": "A guide to the best AI tools in 2025",
  "content": "# Introduction\n\nMarkdown content here...",
  "category": "ai_tools",
  "is_published": true,
  "published_at": "2025-01-01T00:00:00Z"
}
```

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/ssr` | Server-side Supabase auth |
| `embla-carousel-react` | Featured websites slider |
| `react-hook-form` + `zod` | Form validation |
| `next-themes` | Dark/light mode |
| `react-markdown` + `remark-gfm` | Blog post rendering |
| `lucide-react` | Icons |
| `@radix-ui/*` | Accessible UI primitives |
| `framer-motion` | Animations (available, use as needed) |
| `resend` | Newsletter email delivery |
| `@vercel/analytics` | Web analytics |

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard.

Update `NEXT_PUBLIC_SITE_URL` to your production domain.

In Supabase Auth settings, add your production URL to:
- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**: `https://yourdomain.com/auth/callback`

### AdSense Setup

1. Sign up at [Google AdSense](https://adsense.google.com)
2. Add your site and get your publisher ID (`ca-pub-XXXXXXXXXX`)
3. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX` in production env
4. Replace the `slot` props in `<AdSlot />` components with your actual ad unit IDs

## 🔧 Customization

- **Add categories**: Update `CATEGORIES` array in `types/index.ts` and add the SQL `CHECK` constraint
- **Change fonts**: Update `app/layout.tsx` Google Font imports and `tailwind.config.ts`  
- **Modify colors**: Edit CSS variables in `app/globals.css`
- **Add website fields**: Update the SQL schema, TypeScript types, and admin form

## 📄 License

MIT
