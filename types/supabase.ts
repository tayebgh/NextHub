// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      websites: {
        Row: {
          id: string;
          url: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          category: string;
          is_featured: boolean;
          bookmark_count: number;
          traffic_rank: number | null;
          traffic_score: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          category: string;
          is_featured?: boolean;
          bookmark_count?: number;
          traffic_rank?: number | null;
          traffic_score?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          category?: string;
          is_featured?: boolean;
          bookmark_count?: number;
          traffic_rank?: number | null;
          traffic_score?: number | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      user_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          website_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          website_id: string;
          created_at?: string;
        };
        Update: never;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          featured_image: string | null;
          author_id: string | null;
          category: string | null;
          tags: string[];
          is_published: boolean;
          meta_title: string | null;
          meta_description: string | null;
          og_image: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content: string;
          featured_image?: string | null;
          author_id?: string | null;
          category?: string | null;
          tags?: string[];
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          featured_image?: string | null;
          category?: string | null;
          tags?: string[];
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image?: string | null;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          username: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          username?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          username?: string | null;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
          is_active?: boolean;
        };
        Update: {
          is_active?: boolean;
        };
      };
    };
    Functions: {
      toggle_bookmark: {
        Args: { p_user_id: string; p_website_id: string };
        Returns: boolean;
      };
    };
  };
}
