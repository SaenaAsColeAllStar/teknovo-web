import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const repoSrc = path.resolve(root, "../../src");
const shims = path.resolve(root, "src/shims");

/** Worker mounts at `/api/v1/...`. Accept host-only or `…/api` — never double `/api`. */
function normalizeCmsApiBase(raw: string): string {
  const trimmed = raw.replace(/\/$/, "");
  if (!trimmed) return "https://cf.smkteknovo.sch.id/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export default defineConfig(({ mode }) => {
  // Prefix "" so Cloudflare Pages vars (not only VITE_*) are visible at build time.
  const env = loadEnv(mode, process.cwd(), "");

  // Prefer VITE_API_URL; also accept PUBLIC_API_URL (Astro name) if set on Pages by mistake.
  const apiBase = normalizeCmsApiBase(
    env.VITE_API_URL ||
      env.PUBLIC_API_URL ||
      env.NEXT_PUBLIC_API_URL ||
      "https://cf.smkteknovo.sch.id/api",
  );
  const r2Url =
    env.VITE_R2_PUBLIC_URL || env.PUBLIC_R2_URL || "https://r2.ctos.web.id";
  const appUrl = "https://cms.smkteknovo.sch.id";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [
        // Shims take priority — must precede the generic `@` → repo `src` alias.
        { find: "next/link", replacement: path.join(shims, "next-link.tsx") },
        {
          find: "next/navigation",
          replacement: path.join(shims, "next-navigation.ts"),
        },
        {
          find: "@clerk/nextjs",
          replacement: path.join(shims, "clerk-nextjs.ts"),
        },
        {
          find: "@/lib/cms-revalidate",
          replacement: path.join(shims, "cms-revalidate.ts"),
        },
        {
          find: "@teknovo/shared",
          replacement: path.resolve(root, "../../packages/shared/src/index.ts"),
        },
        { find: "@", replacement: repoSrc },
      ],
    },
    define: {
      "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(apiBase),
      "process.env.API_URL": JSON.stringify(apiBase),
      "process.env.R2_PUBLIC_URL": JSON.stringify(r2Url),
      "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(appUrl),
      // Keep import.meta.env.VITE_API_URL in sync when only PUBLIC_API_URL was set.
      "import.meta.env.VITE_API_URL": JSON.stringify(apiBase),
    },
    server: {
      port: 5173,
    },
  };
});
