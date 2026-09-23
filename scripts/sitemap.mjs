/**
 * Writes `build/client/sitemap.xml` from the pages the build actually produced.
 *
 * It walks the build output for `index.html` files rather than reading a list
 * of routes. A hand-kept list is what went wrong before: the sitemap named four
 * pages and left out `/pre-algebra` and `/scientific`, the two the site exists
 * for. Reading the output instead means the sitemap cannot disagree with what
 * nginx is serving, because it is built from the same files.
 *
 * Run automatically after `npm run build` by the `postbuild` script.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CLIENT_DIR = join(ROOT, "build", "client");
const SITE_URL = "https://mathpencil.com";

/** How often each kind of page changes, and how it ranks against the others. */
const RULES = [
  { match: (path) => path === "/", changefreq: "monthly", priority: "1.0" },
  { match: (path) => path === "/scientific", changefreq: "monthly", priority: "0.9" },
  { match: (path) => path === "/pre-algebra", changefreq: "monthly", priority: "0.9" },
  { match: (path) => path.startsWith("/pre-algebra/"), changefreq: "monthly", priority: "0.8" },
  { match: () => true, changefreq: "yearly", priority: "0.3" },
];

/** Every directory under the build output that holds an `index.html`. */
async function findPages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      pages.push(...(await findPages(join(dir, entry.name))));
      continue;
    }
    if (entry.name !== "index.html") continue;

    const relativeDir = relative(CLIENT_DIR, dir);
    pages.push(relativeDir === "" ? "/" : `/${relativeDir.split("\\").join("/")}`);
  }

  return pages;
}

/**
 * When the site last changed, as one date for every page.
 *
 * The chapter pages all render from `app/data/pre-algebra.ts`, so a per-file
 * date would give most of them the same answer anyway. The commit date of HEAD
 * is what the deploy is built from, which makes it the honest value: the server
 * resets hard to `origin/main` and builds that.
 */
async function lastModified() {
  try {
    const { stdout } = await run("git", ["log", "-1", "--format=%cI"], { cwd: ROOT });
    return stdout.trim().slice(0, 10);
  } catch {
    // A tarball with no `.git` still builds; today is a reasonable stand-in.
    return new Date().toISOString().slice(0, 10);
  }
}

function entryFor(path, lastmod) {
  const rule = RULES.find((candidate) => candidate.match(path));

  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${rule.changefreq}</changefreq>`,
    `    <priority>${rule.priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function main() {
  const pages = (await findPages(CLIENT_DIR)).sort((a, b) => a.localeCompare(b));

  if (pages.length === 0) {
    throw new Error(`No pages found under ${CLIENT_DIR}. Did the build run?`);
  }

  // A page carrying `noindex` has no business in a sitemap. Nothing does today,
  // but the check costs one read per page and stops the two disagreeing later.
  const indexable = [];
  for (const path of pages) {
    const file = join(CLIENT_DIR, path === "/" ? "" : path, "index.html");
    const html = await readFile(file, "utf8");
    if (!/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) indexable.push(path);
  }

  const lastmod = await lastModified();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexable.map((path) => entryFor(path, lastmod)),
    "</urlset>",
    "",
  ].join("\n");

  await writeFile(join(CLIENT_DIR, "sitemap.xml"), xml, "utf8");
  console.log(`sitemap.xml: ${indexable.length} URLs, lastmod ${lastmod}`);
}

await main();
