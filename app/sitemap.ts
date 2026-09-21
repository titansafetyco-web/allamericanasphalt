import { cities } from "@/content/areas";
import { footerNav } from "@/content/nav";
import { posts } from "@/lib/content";

export default function sitemap() {
  const base = "https://allamericanasphaltpaving.com";
  const staticPaths = ["", ...footerNav.map((n) => n.href), "/service-areas", "/sign-in", "/sign-up"];
  return [
    ...staticPaths.map((path) => ({ url: `${base}${path || "/"}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...cities.map((c) => ({ url: `${base}/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
