import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "node:url";

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

function escapeHtmlAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function adminMetaPlugin(googleSiteVerification) {
  return {
    name: "skywhale-admin-meta",
    transformIndexHtml(html) {
      if (!googleSiteVerification || html.includes('name="google-site-verification"')) {
        return html;
      }

      const meta = `    <meta name="google-site-verification" content="${escapeHtmlAttribute(googleSiteVerification)}" />\n`;
      return html.replace("  </head>", meta + "  </head>");
    },
  };
}

// Vercel serves production at the domain root. Set VITE_BASE_PATH manually only
// when testing the old GitHub Pages subpath build.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_PATH || "/";
  const googleSiteVerification = (env.VITE_GOOGLE_SITE_VERIFICATION || "").trim();

  return {
    base: command === "build" ? base : "/",
    plugins: [adminMetaPlugin(googleSiteVerification)],
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
  };
});
