import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

const base = process.env.VITE_BASE_PATH || "/";

// Vercel serves the production site at the domain root. GitHub Pages can still
// pass VITE_BASE_PATH=/skywhale-airways/ while it remains a fallback mirror.
export default defineConfig(({ command }) => ({
  base: command === "build" ? base : "/",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: r("index.html"),
        about: r("about.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["three"],
  },
}));
