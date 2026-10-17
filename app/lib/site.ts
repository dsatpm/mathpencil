import type { MetaDescriptor } from "react-router";

/** Where the site lives. Share cards and canonicals need absolute URLs. */
export const SITE_URL = "https://mathpencil.com";

export const SITE_NAME = "MathPencil";

/** Who publishes the site, in the shape structured data wants it. */
export const PUBLISHER = {
  "@type": "Organization",
  name: "HTPdevs",
  url: "https://htpdevs.tech",
} as const;

/** Turns a site-root path into the absolute URL a crawler can actually fetch. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export interface SocialMetaInput {
  title: string;
  description: string;
  /** Site-root path, like `/pre-algebra/number-theory`. */
  path: string;
  /** `article` for a lesson, `website` for a tool or an index. */
  type?: "article" | "website";
}

/**
 * The title, description, canonical and share-card tags every page needs.
 *
 * Written once because there is nothing page-specific about the shape, only
 * about the three strings that go into it. A page adds its own structured data
 * after spreading this, since what a page *is* differs from page to page in a
 * way the card tags do not.
 *
 * The image is the site's one 1200×630 card. A smaller image is letterboxed or
 * refused by the large-card layout, so the wordmark is not used here.
 */
export function socialMeta({
  title,
  description,
  path,
  type = "article",
}: SocialMetaInput): MetaDescriptor[] {
  const url = absoluteUrl(path);

  return [
    { title },
    { name: "description", content: description },
    // Fetched by machines that have no idea what host they came from, so every
    // URL here is absolute.
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: absoluteUrl("/og.png") },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "The MathPencil wordmark" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteUrl("/og.png") },
  ];
}

export interface Tool {
  /** Site-root path. */
  path: string;
  /** The name a link carries. */
  name: string;
  /** What the tool does, in one sentence. */
  summary: string;
  /** The rule it follows, which is what sets it apart from the other two. */
  rule: string;
}

/**
 * The instruments, in the order they are listed everywhere.
 *
 * Kept here rather than in a page so the header, the footer, the tools page and
 * the home page link the same paths under the same names. A tool that moves
 * moves once.
 */
export const TOOLS: Tool[] = [
  {
    path: "/tools/calculator",
    name: "Adding machine",
    summary:
      "A calculator that prints every entry to a tape, so a long column of figures can be checked line by line after it is added.",
    rule: "Each operator is applied the moment it is pressed, the way a desk calculator works.",
  },
  {
    path: "/tools/scientific",
    name: "Scientific calculator",
    summary:
      "Trigonometry, logarithms, powers, roots, π and e. The whole expression is built in the window and read back before it is answered.",
    rule: "Multiplication and division are done before addition and subtraction, the way written math works.",
  },
  {
    path: "/pre-algebra/solver",
    name: "Equation solver",
    summary:
      "Solves an equation with one unknown in exact fractions and writes out every step, so the working can be compared with your own.",
    rule: "Nothing is rounded. A third stays 1/3 rather than becoming 0.333.",
  },
];
