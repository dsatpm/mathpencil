/**
 * Checks the built site for the things a typecheck cannot see.
 *
 * The repo has no test runner, and most of what can go wrong with a static site
 * only shows up in the HTML it produced: a page that stopped being built, a link
 * still pointing at an address that moved, a sitemap that lists a forwarding
 * page. Each check below is one of those, read from `build/client` after
 * `npm run build`. Run with `npm run check:build`; CI runs it on every PR.
 *
 * Exits non-zero and names every failure, rather than stopping at the first.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const CLIENT_DIR = fileURLToPath(new URL("../build/client", import.meta.url));
const SITE_URL = "https://mathpencil.com";

/** Addresses that moved, and where to. Must match `LEGACY_REDIRECTS` in `app/routes/redirect.tsx`. */
const MOVED = { "/scientific": "/tools/scientific" };

const failures = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}

async function pages(dir = CLIENT_DIR) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await pages(path)));
    else if (entry.name === "index.html") {
      const rel = relative(CLIENT_DIR, dir).split("\\").join("/");
      found.push(rel === "" ? "/" : `/${rel}`);
    }
  }
  return found;
}

const html = (path) => readFile(join(CLIENT_DIR, path === "/" ? "" : path, "index.html"), "utf8");

/** The text a visitor reads: tags and scripts removed, whitespace collapsed. */
const visibleText = (source) =>
  source
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

const built = new Set(await pages());

// Every page the site links to in its header was built.
for (const path of ["/", "/tools", "/tools/calculator", "/tools/scientific", "/pre-algebra", "/pre-algebra/solver"]) {
  check(built.has(path), `${path} was not built`);
}

// The home page is the landing page, not a calculator.
const home = await html("/");
check(/<h1[^>]*>Pre-algebra, explained step by step\.<\/h1>/.test(home), "/ does not carry the landing page heading");
check(home.includes('href="/tools"'), "/ does not link to /tools");
check(home.includes('href="/pre-algebra/introduction"'), "/ does not link to chapter 1");
check(home.includes(`<link rel="canonical" href="${SITE_URL}/"/>`), "/ has the wrong canonical");

// The figures the landing page quotes are the engines' answers, not typed ones.
// If an engine changes, these fail and someone reads the page again.
const homeText = visibleText(home);
for (const [label, expected] of [
  ["adding machine total for 2 + 3 × 4", "Adding machine 20"],
  ["scientific answer for 2 + 3 × 4", "Scientific calculator 14"],
  ["solver answer for x + 1/3 = 1", "Equation solver 2/3"],
  ["hero working for 3x + 5 = 20", "x = 5"],
]) {
  check(homeText.includes(expected), `/ is missing the ${label} ("${expected}")`);
}

// Each tool page points crawlers at its own new address.
for (const path of ["/tools", "/tools/calculator", "/tools/scientific"]) {
  if (!built.has(path)) continue;
  check(
    (await html(path)).includes(`<link rel="canonical" href="${SITE_URL}${path}"/>`),
    `${path} has the wrong canonical`,
  );
}

// A moved address is a forwarding page: noindex, canonical to the new one, and a refresh.
for (const [from, to] of Object.entries(MOVED)) {
  if (!built.has(from)) {
    failures.push(`${from} has no forwarding page, so old links to it 404`);
    continue;
  }
  const page = await html(from);
  check(/<meta name="robots" content="noindex/.test(page), `${from} is not marked noindex`);
  check(page.includes(`<link rel="canonical" href="${SITE_URL}${to}"/>`), `${from} does not name ${to} as canonical`);
  check(page.includes(`url=${to}"`), `${from} has no refresh to ${to}`);
}

// No page links to a moved address. Matches `href="/scientific"` exactly, so
// `/tools/scientific` does not count.
for (const path of built) {
  if (path in MOVED) continue;
  const page = await html(path);
  for (const from of Object.keys(MOVED)) {
    check(!page.includes(`href="${from}"`) && !page.includes(`href="${from}#`), `${path} still links to ${from}`);
  }
}

// The sitemap lists every indexable page and no forwarding page.
const sitemap = await readFile(join(CLIENT_DIR, "sitemap.xml"), "utf8");
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(SITE_URL, "") || "/"));
for (const path of built) {
  const indexable = !/<meta name="robots" content="noindex/.test(await html(path));
  check(listed.has(path) === indexable, `${path} is ${indexable ? "missing from" : "listed in"} the sitemap`);
}

// The house rule: no em dash anywhere a visitor reads, on the pages this work added.
for (const path of ["/", "/tools", "/scientific"]) {
  if (built.has(path)) check(!visibleText(await html(path)).includes("\u2014"), `${path} shows an em dash`);
}

if (failures.length > 0) {
  console.error(`check-build: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`check-build: ${built.size} pages, ${listed.size} in the sitemap, all checks passed`);
