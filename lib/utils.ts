// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFaviconUrl(url: string, size: number = 64): string {
  try {
    const domain = new URL(url).hostname;
    return `https://favicon.twenty.com/${domain}?size=${size}`;
  } catch {
    return "/icons/globe.svg";
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

// Parse Netscape bookmark HTML format
export function parseBookmarkHTML(html: string): string[] {
  const urls: string[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = doc.querySelectorAll("a[href]");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
      urls.push(href);
    }
  });
  return [...new Set(urls)];
}

// Generate browser-compatible bookmark HTML
export function generateBookmarkHTML(
  bookmarks: Array<{ name: string; url: string; addedAt: string }>
): string {
  const items = bookmarks
    .map(
      (b) =>
        `    <DT><A HREF="${b.url}" ADD_DATE="${Math.floor(new Date(b.addedAt).getTime() / 1000)}">${b.name}</A>`
    )
    .join("\n");

  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><H3>NextHub Bookmarks</H3>
  <DL><p>
${items}
  </DL><p>
</DL><p>`;
}
