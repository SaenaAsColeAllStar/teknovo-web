import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoSrc = path.resolve(root, "../../src");
const shims = path.resolve(root, "src/shims");

const siteUrl = process.env.PUBLIC_SITE_URL || "https://smkteknovo.sch.id";
const apiUrl = process.env.PUBLIC_API_URL || "https://cf.smkteknovo.sch.id";
const r2Url = process.env.PUBLIC_R2_URL || "https://r2.ctos.web.id";

export default defineConfig({
  output: "static",
  site: siteUrl,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        { find: "next/link", replacement: path.join(shims, "next-link.tsx") },
        { find: "next/image", replacement: path.join(shims, "next-image.tsx") },
        {
          find: "next/navigation",
          replacement: path.join(shims, "next-navigation.ts"),
        },
        { find: "@/lib/r2", replacement: path.join(shims, "r2.ts") },
        { find: "@/lib/public-app-url", replacement: path.join(shims, "public-app-url.ts") },
        {
          find: "@/lib/auth-sign-in-path",
          replacement: path.join(shims, "auth-sign-in-path.ts"),
        },
        { find: "@", replacement: repoSrc },
      ],
    },
    define: {
      "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(siteUrl),
      "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(apiUrl),
      "process.env.API_URL": JSON.stringify(apiUrl),
      "process.env.R2_PUBLIC_URL": JSON.stringify(r2Url),
      "process.env.NEXT_PUBLIC_TEKNOVO_PUBLIC_APP": JSON.stringify("landing"),
    },
    ssr: {
      noExternal: ["framer-motion", "lenis", "@teknovo/shared"],
    },
  },
});
