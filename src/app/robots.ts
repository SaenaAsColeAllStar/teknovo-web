import type { MetadataRoute } from "next";

import { buildLandingAbsoluteUrl } from "@/lib/seo";

/**
 * Kebijakan crawler — mesin pencari tradisional & AI search.
 * Diizinkan: GPTBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai,
 * PerplexityBot, Google-Extended, Bytespider (TikTok/ByteDance AI).
 * Panduan sitasi AI: /llms.txt dan /llms-full.txt
 */
export default function robots(): MetadataRoute.Robots {
  const host = buildLandingAbsoluteUrl("");
  const disallow = ["/api/", "/_next/"] as const;
  const aiAllow = ["/", "/llms.txt", "/llms-full.txt", "/tentang-smk-teknovo", "/berita/rss.xml"] as const;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...disallow],
      },
      {
        userAgent: "GPTBot",
        allow: [...aiAllow],
        disallow: [...disallow],
      },
      {
        userAgent: "ChatGPT-User",
        allow: [...aiAllow],
        disallow: [...disallow],
      },
      {
        userAgent: "ClaudeBot",
        allow: [...aiAllow],
        disallow: [...disallow],
      },
      {
        userAgent: "Claude-Web",
        allow: [...aiAllow],
        disallow: [...disallow],
      },
      {
        userAgent: "anthropic-ai",
        allow: [...aiAllow],
        disallow: [...disallow],
      },
      {
        userAgent: "PerplexityBot",
        allow: [...aiAllow],
        disallow: [...disallow],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: [...disallow],
      },
      {
        userAgent: "Bytespider",
        allow: [...aiAllow],
        disallow: [...disallow],
      },
    ],
    sitemap: [`${host}/sitemap.xml`, `${host}/ppdb/sitemap.xml`],
    host,
  };
}
