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
  if (!trimmed) return "https://cms-api.smkteknovo.sch.id/api";
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
      "https://cms-api.smkteknovo.sch.id/api",
  );
  // Prefer VITE_*; accept Next-era name if someone builds from monorepo .env.local.
  const clerkPk =
    env.VITE_CLERK_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "";
  const r2Url =
    env.VITE_R2_PUBLIC_URL ||
    env.PUBLIC_R2_URL ||
    "https://storage-console.smkteknovo.sch.id/smk-teknovo";
  const appUrl = "https://cms.smkteknovo.sch.id";
  const webOrigin = (
    env.VITE_WEB_ORIGIN ||
    env.PUBLIC_SITE_URL ||
    "https://smkteknovo.sch.id"
  ).replace(/\/$/, "");

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
        // Shared `src/` imports resolve from repo root; pin CMS-only packages.
        {
          find: "react-dropzone",
          replacement: path.join(root, "node_modules/react-dropzone"),
        },
        {
          find: "@dnd-kit/core",
          replacement: path.join(root, "node_modules/@dnd-kit/core"),
        },
        {
          find: "@dnd-kit/sortable",
          replacement: path.join(root, "node_modules/@dnd-kit/sortable"),
        },
        {
          find: "@dnd-kit/utilities",
          replacement: path.join(root, "node_modules/@dnd-kit/utilities"),
        },
        {
          find: "framer-motion",
          replacement: path.join(root, "node_modules/framer-motion"),
        },
        { find: "@", replacement: repoSrc },
      ],
    },
    define: {
      "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(apiBase),
      "process.env.API_URL": JSON.stringify(apiBase),
      "process.env.R2_PUBLIC_URL": JSON.stringify(r2Url),
      "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(appUrl),
      // Keep import.meta.env.VITE_* in sync when only PUBLIC_/NEXT_PUBLIC_ were set.
      "import.meta.env.VITE_API_URL": JSON.stringify(apiBase),
      "import.meta.env.VITE_WEB_ORIGIN": JSON.stringify(webOrigin),
      ...(clerkPk
        ? {
            "import.meta.env.VITE_CLERK_PUBLISHABLE_KEY":
              JSON.stringify(clerkPk),
          }
        : {}),
    },
    server: {
      port: 5173,
    },
  };
});
