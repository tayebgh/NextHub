-- supabase/migrations/001_initial_schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================
-- PROFILES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- WEBSITES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'web_search', 'social_network', 'services', 'productivity',
    'ai_tools', 'design', 'marketing', 'developer_tools',
    'entertainment', 'news'
  )),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  bookmark_count INTEGER NOT NULL DEFAULT 0,
  traffic_rank INTEGER,
  traffic_score NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_websites_category ON public.websites(category);
CREATE INDEX idx_websites_is_featured ON public.websites(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_websites_bookmark_count ON public.websites(bookmark_count DESC);
CREATE INDEX idx_websites_search ON public.websites USING gin(name gin_trgm_ops);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER websites_updated_at
  BEFORE UPDATE ON public.websites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- USER BOOKMARKS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, website_id)
);

CREATE INDEX idx_user_bookmarks_user ON public.user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_website ON public.user_bookmarks(website_id);

-- Toggle bookmark function (atomic)
CREATE OR REPLACE FUNCTION public.toggle_bookmark(p_user_id UUID, p_website_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.user_bookmarks
    WHERE user_id = p_user_id AND website_id = p_website_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.user_bookmarks
    WHERE user_id = p_user_id AND website_id = p_website_id;
    
    UPDATE public.websites
    SET bookmark_count = GREATEST(0, bookmark_count - 1)
    WHERE id = p_website_id;
    
    RETURN FALSE;
  ELSE
    INSERT INTO public.user_bookmarks (user_id, website_id)
    VALUES (p_user_id, p_website_id);
    
    UPDATE public.websites
    SET bookmark_count = bookmark_count + 1
    WHERE id = p_website_id;
    
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- BLOG POSTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published_at DESC) WHERE is_published = TRUE;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- NEWSLETTER SUBSCRIBERS
-- =====================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Websites (public read, admin write)
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Websites are viewable by everyone" ON public.websites FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage websites" ON public.websites FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User Bookmarks
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookmarks" ON public.user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Blog Posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Newsletter
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Enable realtime for bookmark counts
ALTER PUBLICATION supabase_realtime ADD TABLE public.websites;

-- =====================
-- SEED DATA
-- =====================
INSERT INTO public.websites (url, name, description, category, is_featured, traffic_rank) VALUES
  ('https://google.com', 'Google', 'The world''s most popular search engine', 'web_search', true, 1),
  ('https://bing.com', 'Bing', 'Microsoft''s search engine with AI-powered features', 'web_search', false, 3),
  ('https://duckduckgo.com', 'DuckDuckGo', 'Privacy-focused search engine that doesn''t track you', 'web_search', true, 2),
  ('https://twitter.com', 'X (Twitter)', 'Real-time social network and microblogging platform', 'social_network', true, 4),
  ('https://instagram.com', 'Instagram', 'Photo and video sharing social network', 'social_network', true, 5),
  ('https://linkedin.com', 'LinkedIn', 'Professional networking and career development', 'social_network', false, 6),
  ('https://reddit.com', 'Reddit', 'Community-driven content sharing and discussion', 'social_network', false, 7),
  ('https://chat.openai.com', 'ChatGPT', 'OpenAI''s conversational AI assistant', 'ai_tools', true, 8),
  ('https://claude.ai', 'Claude', 'Anthropic''s helpful AI assistant', 'ai_tools', true, 9),
  ('https://midjourney.com', 'Midjourney', 'AI image generation from text prompts', 'ai_tools', false, 10),
  ('https://notion.so', 'Notion', 'All-in-one workspace for notes, tasks, and collaboration', 'productivity', true, 11),
  ('https://figma.com', 'Figma', 'Collaborative design tool for UI/UX professionals', 'design', true, 12),
  ('https://github.com', 'GitHub', 'Platform for version control and software collaboration', 'developer_tools', true, 13),
  ('https://vercel.com', 'Vercel', 'Platform for deploying web applications', 'developer_tools', false, 14),
  ('https://supabase.com', 'Supabase', 'Open source Firebase alternative with PostgreSQL', 'developer_tools', false, 15)
ON CONFLICT (url) DO NOTHING;
