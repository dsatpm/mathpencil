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
const h1 = home.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
check(
  h1 !== null && visibleText(h1[1]).trim() === "Math, explained one step at a time.",
  "/ does not carry the landing page heading",
);
check(home.includes('href="/tools"'), "/ does not link to /tools");
check(home.includes('href="/pre-algebra/introduction"'), "/ does not link to chapter 1");
check(home.includes(`<link rel="canonical" href="${SITE_URL}/"/>`), "/ has the wrong canonical");

// "Start with your question": every question links to a page that was built, and
// the section exists for the hero's anchor link to land on.
check(home.includes('href="#questions"') && home.includes('id="questions"'), "/ has no questions section for the hero link");
const questionPaths = [...home.matchAll(/<section id="questions"[\s\S]*?<\/section>/g)]
  .flatMap((section) => [...section[0].matchAll(/href="([^"#]+)"/g)].map((match) => match[1]));
check(questionPaths.length >= 8, `/ lists ${questionPaths.length} questions, expected at least 8`);
for (const path of questionPaths) {
  check(built.has(path), `/ has a question linking to ${path}, which was not built`);
}

// Levels that do not exist yet are named on the page but must stay out of every
// place a search result or a share card quotes: the title, the description,
// the heading and the structured data. They are marked "Planned" in words, and
// they are not links.
const head = home.slice(0, home.indexOf("</head>"));
for (const word of ["grade-school", "high school", "college"]) {
  check(!new RegExp(word, "i").test(head), `/ names planned level "${word}" in the head, where a search result would quote it`);
}
const homeBody = visibleText(home);
check(homeBody.includes("Planned. Not available yet."), "/ does not mark the planned levels in words");
check((homeBody.match(/Planned\. Not available yet\./g) ?? []).length === 3, "/ should mark exactly three levels as planned");
for (const level of ["Grade-school math", "High school math", "College math"]) {
  check(!new RegExp(`<a [^>]*>[^<]*${level}`).test(home), `/ links the planned level ${level}`);
}

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

// The site is used by children, so ads are set to child-directed treatment in
// Google's Search Console and the privacy policy must say so. Text that claims
// the opposite, or describes interest-based ads as running here, is a
// regression: it would tell visitors something the ad setup does not do.
if (built.has("/privacy")) {
  const privacy = visibleText(await html("/privacy"));
  check(!/not directed at children/i.test(privacy), "/privacy says the site is not directed at children");
  check(!/ads based on (a user's|your) prior visits/i.test(privacy), "/privacy says ads follow prior visits");
  check(/child-directed/i.test(privacy), "/privacy does not describe the child-directed ad treatment");
}

// The ad notes under the calculators and the course must not offer a way to turn
// personalised ads off: they are off for everyone.
for (const path of ["/tools/calculator", "/tools/scientific", "/pre-algebra"]) {
  if (!built.has(path)) continue;
  const note = visibleText(await html(path));
  check(!/turn personalised advertising off/i.test(note), `${path} still offers to turn personalised ads off`);
  check(/ads are not personalised/i.test(note), `${path} ad note does not say the ads are not personalised`);
}

// The house rule: no em dash anywhere a visitor reads, on the pages this work added.
for (const path of ["/", "/tools", "/scientific", "/privacy"]) {
  if (built.has(path)) check(!visibleText(await html(path)).includes("\u2014"), `${path} shows an em dash`);
}

if (failures.length > 0) {
  console.error(`check-build: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`check-build: ${built.size} pages, ${listed.size} in the sitemap, all checks passed`);
