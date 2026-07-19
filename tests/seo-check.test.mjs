import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath, URL } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteUrl = "https://skywhaleairways.com";
const pages = ["/", "/about.html", "/press.html", "/gallery.html"];

function fixtureHtml(url, { canonical = true } = {}) {
  const canonicalTag = canonical
    ? `<link rel="canonical" href="${url}" />`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <title>Skywhale Airways</title>
    <meta name="description" content="I AM NOMAD by Kris Krug and Suzy Easton." />
    ${canonicalTag}
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
</html>`;
}

test("exits nonzero when a built page is missing its canonical URL", async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), "skywhale-seo-check-"));

  try {
    for (const pagePath of pages) {
      const file = pagePath === "/" ? "index.html" : pagePath.slice(1);
      await writeFile(
        path.join(outputDir, file),
        fixtureHtml(siteUrl + pagePath, { canonical: pagePath !== "/" })
      );
    }

    await writeFile(
      path.join(outputDir, "sitemap.xml"),
      `<urlset>${pages.map((pagePath) => `<url><loc>${siteUrl + pagePath}</loc></url>`).join("")}</urlset>`
    );
    await writeFile(
      path.join(outputDir, "robots.txt"),
      `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    );
    await writeFile(
      path.join(outputDir, "llms.txt"),
      `${siteUrl}/\n${siteUrl}/about.html\n${siteUrl}/press.html\n`
    );

    const result = spawnSync(
      process.execPath,
      [path.join(repoRoot, "scripts/check-seo.mjs"), "--root", outputDir],
      { encoding: "utf8" }
    );
    const output = result.stdout + result.stderr;

    assert.equal(result.status, 1);
    assert.match(output, /index\.html: missing canonical URL/);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
