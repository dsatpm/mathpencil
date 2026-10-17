import type { Config } from "@react-router/dev/config";

/**
 * The routes with no dynamic segment. `/pre-algebra/:slug` is filled in from
 * the course data below, because `prerender` cannot discover a param on its own.
 *
 * Exported so the sitemap is built from the same list that decides which pages
 * exist, rather than from a second one kept by hand.
 */
export const STATIC_ROUTES = [
  "/",
  "/scientific",
  "/pre-algebra",
  "/pre-algebra/solver",
  "/contact",
  "/privacy",
  "/terms",
];

export default {
  // No route uses a loader or action, so there is nothing for a runtime
  // server to do. Pre-render every route to HTML at build time and serve the
  // result from nginx as plain files.
  ssr: false,
  prerender: async () => {
    // Imported rather than listed: a chapter added to `CHAPTERS` gets a page
    // without anyone remembering to add its path here.
    const { CHAPTERS } = await import("./app/data/pre-algebra");
    return [...STATIC_ROUTES, ...CHAPTERS.map((chapter) => `/pre-algebra/${chapter.slug}`)];
  },
} satisfies Config;
