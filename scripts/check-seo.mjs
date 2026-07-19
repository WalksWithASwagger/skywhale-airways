import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pages } from "../vite.config.js";

const defaultSiteUrl = "https://skywhaleairways.com";
const corePageNames = new Set(["main", "about", "press"]);

function parseOutputRoot(args) {
  if (args.length === 0) return path.resolve("dist");
  if (args.length === 2 && args[0] === "--root") {
    return path.resolve(args[1]);
  }

  throw new Error(
    "Usage: node scripts/check-seo.mjs [--root <build-directory>]"
  );
}

function parseAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      ([, name, doubleQuoted, singleQuoted]) => [
        name.toLowerCase(),
        doubleQuoted ?? singleQuoted,
      ]
    )
  );
}

function findTag(html, name, matches) {
  const tags = html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || [];

  for (const tag of tags) {
    const attributes = parseAttributes(tag);
    if (matches(attributes)) return attributes;
  }

  return null;
}

function expectedUrl(siteUrl, pagePath) {
  return siteUrl + pagePath;
}

function sameValues(actual, expected) {
  if (actual.length !== expected.length) return false;
  const sortedActual = [...actual].sort();
  const sortedExpected = [...expected].sort();
  return sortedActual.every((value, index) => value === sortedExpected[index]);
}

function extractUrls(text) {
  return new Set(text.match(/https?:\/\/[^\s)`]+/g) || []);
}

async function run() {
  const outputRoot = parseOutputRoot(process.argv.slice(2));
  const siteUrl = (process.env.VITE_SITE_URL || defaultSiteUrl).replace(
    /\/+$/,
    ""
  );
  const errors = [];

  async function readOutput(file) {
    try {
      return await readFile(path.join(outputRoot, file), "utf8");
    } catch {
      errors.push(`${file}: missing from build output`);
      return null;
    }
  }

  for (const page of pages) {
    const html = await readOutput(page.file);
    if (html === null) continue;

    const url = expectedUrl(siteUrl, page.path);
    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim();
    const description = findTag(
      html,
      "meta",
      ({ name }) => name?.toLowerCase() === "description"
    );
    const canonical = findTag(html, "link", ({ rel }) =>
      rel?.toLowerCase().split(/\s+/).includes("canonical")
    );
    const openGraphUrl = findTag(
      html,
      "meta",
      ({ property }) => property?.toLowerCase() === "og:url"
    );
    const twitterCard = findTag(
      html,
      "meta",
      ({ name }) => name?.toLowerCase() === "twitter:card"
    );

    if (!title) errors.push(`${page.file}: missing title`);
    if (!description?.content) {
      errors.push(`${page.file}: missing meta description`);
    }
    if (!canonical?.href) {
      errors.push(`${page.file}: missing canonical URL`);
    } else if (canonical.href !== url) {
      errors.push(
        `${page.file}: canonical URL must be ${url}, found ${canonical.href}`
      );
    }
    if (!openGraphUrl?.content) {
      errors.push(`${page.file}: missing Open Graph URL`);
    } else if (openGraphUrl.content !== url) {
      errors.push(
        `${page.file}: Open Graph URL must be ${url}, found ${openGraphUrl.content}`
      );
    }
    if (!twitterCard?.content) {
      errors.push(`${page.file}: missing Twitter card`);
    }
  }

  const sitemap = await readOutput("sitemap.xml");
  if (sitemap !== null) {
    const actualUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      ([, url]) => url
    );
    const expectedUrls = pages.map((page) => expectedUrl(siteUrl, page.path));

    if (!sameValues(actualUrls, expectedUrls)) {
      errors.push(
        `sitemap.xml: expected ${JSON.stringify(expectedUrls)}, found ${JSON.stringify(actualUrls)}`
      );
    }
  }

  const robots = await readOutput("robots.txt");
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  if (
    robots !== null &&
    !robots
      .split(/\r?\n/)
      .some((line) => line.trim() === `Sitemap: ${sitemapUrl}`)
  ) {
    errors.push(`robots.txt: missing Sitemap: ${sitemapUrl}`);
  }

  const llms = await readOutput("llms.txt");
  if (llms !== null) {
    const linkedUrls = extractUrls(llms);
    for (const page of pages.filter(({ name }) => corePageNames.has(name))) {
      const url = expectedUrl(siteUrl, page.path);
      if (!linkedUrls.has(url)) {
        errors.push(`llms.txt: missing core page ${url}`);
      }
    }
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`SEO check failed: ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`SEO check passed for ${pages.length} pages in ${outputRoot}`);
}

try {
  await run();
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
