// types/index.ts

export type Category =
  | "web_search"
  | "social_network"
  | "services"
  | "productivity"
  | "ai_tools"
  | "design"
  | "marketing"
  | "developer_tools"
  | "entertainment"
  | "news";

export interface Website {
  id: string;
  url: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  category: Category;
  is_featured: boolean;
  bookmark_count: number;
  traffic_rank: number | null;
  traffic_score: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  website_id: string;
  created_at: string;
  website?: Website;
}

export interface BlogPost {
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
  author?: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  role: "user" | "admin";
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

export interface CategoryMeta {
  value: Category;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    value: "web_search",
    label: "Web Search",
    icon: "🔍",
    description: "Search engines and discovery tools",
    color: "blue",
  },
  {
    value: "social_network",
    label: "Social Networks",
    icon: "👥",
    description: "Connect and share with others",
    color: "pink",
  },
  {
    value: "services",
    label: "Services",
    icon: "⚡",
    description: "Essential online services",
    color: "orange",
  },
  {
    value: "productivity",
    label: "Productivity",
    icon: "📋",
    description: "Work smarter, not harder",
    color: "green",
  },
  {
    value: "ai_tools",
    label: "AI Tools",
    icon: "🤖",
    description: "Artificial intelligence tools",
    color: "purple",
  },
  {
    value: "design",
    label: "Design",
    icon: "🎨",
    description: "Creative and design tools",
    color: "rose",
  },
  {
    value: "marketing",
    label: "Marketing",
    icon: "📣",
    description: "Marketing and growth tools",
    color: "yellow",
  },
  {
    value: "developer_tools",
    label: "Developer Tools",
    icon: "💻",
    description: "Tools for developers",
    color: "slate",
  },
  {
    value: "entertainment",
    label: "Entertainment",
    icon: "🎬",
    description: "Fun and entertainment",
    color: "red",
  },
  {
    value: "news",
    label: "News",
    icon: "📰",
    description: "Stay informed and updated",
    color: "teal",
  },
];
