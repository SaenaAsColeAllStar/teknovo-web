import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static SSG for Cloudflare Pages Free (apex smkteknovo.sch.id)
export default defineConfig({
  output: "static",
  site: "https://smkteknovo.sch.id",
  vite: {
    plugins: [tailwindcss()],
  },
});
