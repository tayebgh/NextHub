// components/blog/blog-card.tsx
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost & { author?: { full_name: string | null; avatar_url: string | null } };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors group">
      {post.featured_image && (
        <div className="relative w-full sm:w-48 aspect-video sm:aspect-square rounded-lg overflow-hidden shrink-0 border border-border">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex flex-col justify-between">
        <div>
          {post.category && (
            <span className="inline-block bg-primary/10 text-primary border border-primary/20 text-xs px-2.5 py-0.5 rounded-full mb-2 font-medium">
              {post.category}
            </span>
          )}
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-lg font-display font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
          </Link>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          {post.published_at && (
            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>
          )}
          {post.author?.full_name && (
            <>
              <span>·</span>
              <span>{post.author.full_name}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
