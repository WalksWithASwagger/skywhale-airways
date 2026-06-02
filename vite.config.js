import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// GitHub Pages serves this project site under /skywhale-airways/. The base is
// applied only for the production build; dev stays at the root for convenience.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/skywhale-airways/" : "/",
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
    include: ["three", "gsap"],
  },
}));
