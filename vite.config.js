import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

const base = process.env.VITE_BASE_PATH || "/";

// Vercel serves production at the domain root. Set VITE_BASE_PATH manually only
// when testing the old GitHub Pages subpath build.
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
        press: r("press.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["three"],
  },
}));
