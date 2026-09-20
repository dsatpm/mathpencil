/** Where the site lives. Share cards and canonicals need absolute URLs. */
export const SITE_URL = "https://mathpencil.com";

export const SITE_NAME = "MathPencil";

/** Turns a site-root path into the absolute URL a crawler can actually fetch. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
