import pagesJson from "@/content/pages.json";
import postsJson from "@/content/posts.json";

export type WpRecord = {
  id: number;
  slug: string;
  title: string;
  link: string;
  html: string;
  text: string;
  date?: string;
  excerpt?: string;
};

export const pages = pagesJson as WpRecord[];
export const posts = (postsJson as WpRecord[]).slice().sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

export function getPage(slug: string) {
  return pages.find((p) => p.slug === slug);
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function decodeHtml(value: string) {
  return value
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#038;/g, "&");
}
