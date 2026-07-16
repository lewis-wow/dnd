import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Served from https://lewis-wow.github.io/dnd/ (a project page, not a
  // user/org root page) — asset URLs need the /dnd/ prefix in the built
  // output, but local dev should still serve from /. Keyed on the Vite
  // command (not an env var) so `vite build`/`vite preview` always exercise
  // the same path a GitHub Pages deploy will actually use.
  base: command === "build" ? "/dnd/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
