// components/blog/blog-post-content.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary prose-img:rounded-xl prose-code:text-sm prose-pre:bg-muted prose-pre:border prose-pre:border-border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
