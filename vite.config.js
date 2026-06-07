import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// Single source of truth for the site's indexable HTML pages. Drives both the
// multi-page build inputs and the generated sitemap.xml, so the page list and
// the sitemap can never drift apart — add a page here and it lands in both.
const pages = [
  { name: "main", file: "index.html", path: "/" },
  { name: "about", file: "about.html", path: "/about.html" },
  { name: "press", file: "press.html", path: "/press.html" },
];

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
      if (
        !googleSiteVerification ||
        html.includes('name="google-site-verification"')
      ) {
        return html;
      }

      const meta = `    <meta name="google-site-verification" content="${escapeHtmlAttribute(googleSiteVerification)}" />\n`;
      return html.replace("  </head>", meta + "  </head>");
    },
  };
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Last-modified date (YYYY-MM-DD) for a page, taken from git so it reflects the
// real last content change. Falls back to HEAD's date so shallow CI clones still
// emit a sensible publish date, and returns null (no lastmod) when git is
// unavailable.
function gitLastmod(file) {
  for (const args of [
    ["log", "-1", "--format=%cs", "--", file],
    ["log", "-1", "--format=%cs"],
  ]) {
    try {
      const out = execFileSync("git", args, {
        cwd: process.cwd(),
        encoding: "utf8",
      }).trim();
      if (out) return out;
    } catch {
      return null;
    }
  }
  return null;
}

// Generate sitemap.xml from the shared `pages` list at build time. It lives only
// in the build output (not committed), so it always matches what actually
// shipped. robots.txt already points crawlers at /sitemap.xml.
function sitemapPlugin(siteUrl) {
  return {
    name: "skywhale-sitemap",
    apply: "build",
    generateBundle() {
      const body = pages
        .map(({ file, path }) => {
          const loc = xmlEscape(siteUrl + path);
          const lastmod = gitLastmod(file);
          const lastmodLine = lastmod
            ? `\n    <lastmod>${lastmod}</lastmod>`
            : "";
          return `  <url>\n    <loc>${loc}</loc>${lastmodLine}\n  </url>`;
        })
        .join("\n");
      const source = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source });
    },
  };
}

// Vercel serves production at the domain root. Set VITE_BASE_PATH manually only
// when testing the old GitHub Pages subpath build.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_PATH || "/";
  const googleSiteVerification = (
    env.VITE_GOOGLE_SITE_VERIFICATION || ""
  ).trim();
  const siteUrl = (env.VITE_SITE_URL || "https://skywhaleairways.com").replace(
    /\/+$/,
    ""
  );

  return {
    base: command === "build" ? base : "/",
    plugins: [adminMetaPlugin(googleSiteVerification), sitemapPlugin(siteUrl)],
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      // Vite 8 bundles with Rolldown; rollupOptions was renamed to rolldownOptions.
      rolldownOptions: {
        input: Object.fromEntries(pages.map((p) => [p.name, r(p.file)])),
      },
    },
    optimizeDeps: {
      include: ["three"],
    },
  };
});
