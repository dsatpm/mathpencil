import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { Route } from "./+types/redirect";
import { absoluteUrl } from "../lib/site";

/**
 * Old address to new address, for pages that have moved.
 *
 * The site is static files behind nginx, so a real 301 lives in the server
 * config (see `docs/deploy.md`). This page is what a visitor gets when that rule
 * is missing: a document that says where the page went, points crawlers at it
 * with a canonical and `noindex`, and sends the browser on at once. Kept out of
 * the sitemap by the `noindex`, which `scripts/sitemap.mjs` reads.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/scientific": "/tools/scientific",
};

/** The new path for an old one, or the home page when the old one is unknown. */
function targetFor(pathname: string): string {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return LEGACY_REDIRECTS[trimmed] ?? "/";
}

export function meta({ location }: Route.MetaArgs) {
  const target = targetFor(location.pathname);
  return [
    { title: "This page has moved | MathPencil" },
    { name: "robots", content: "noindex, follow" },
    { tagName: "link", rel: "canonical", href: absoluteUrl(target) },
    // The fallback for when scripts are off. It waits two seconds because a
    // refresh at zero fires before the script and drops the query and anchor,
    // which the script below carries across.
    { httpEquiv: "refresh", content: `2; url=${target}` },
  ];
}

export default function Redirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const target = targetFor(location.pathname);

  useEffect(() => {
    // The query and the anchor travel with the visitor, so `/scientific#keys`
    // still lands on the same section of the new page.
    navigate(`${target}${location.search}${location.hash}`, { replace: true });
  }, [navigate, target, location.search, location.hash]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-desk px-4 py-12">
      <div className="on-paper w-full max-w-136 bg-tape px-6 py-7">
        <h1 className="font-sans text-[1.6rem] font-bold leading-tight text-ink">
          This page has moved
        </h1>
        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          It now lives at{" "}
          <Link to={target} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            mathpencil.com{target}
          </Link>
          . Your browser is being sent there now.
        </p>
      </div>
    </main>
  );
}
