import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const repoSrc = path.resolve(root, "../../src");
const shims = path.resolve(root, "src/shims");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiRaw = (
    env.VITE_API_URL || "https://cf.smkteknovo.sch.id/api"
  ).replace(/\/$/, "");
  // Worker routes live under `/api` — normalize host-only env values.
  const apiBase = apiRaw.endsWith("/api") ? apiRaw : `${apiRaw}/api`;
  const r2Url = env.VITE_R2_PUBLIC_URL || "https://r2.ctos.web.id";
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
    },
    server: {
      port: 5173,
    },
  };
});
