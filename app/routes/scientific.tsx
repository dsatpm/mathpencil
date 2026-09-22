import type { Route } from "./+types/scientific";
import { ScientificCalculator } from "../components/ScientificCalculator";
import { ScientificNotes } from "../components/ScientificNotes";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { absoluteUrl, SITE_NAME } from "../lib/site";

const TITLE = "Scientific calculator | MathPencil";
const DESCRIPTION =
  "A free scientific calculator with trigonometry, logarithms, powers, roots, π and e. Build the whole expression, read it back, then total it. Works with a mouse, a keyboard, or a number pad.";

export function meta({}: Route.MetaArgs) {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    // Share cards and canonicals are fetched by machines that have no idea what
    // host they came from, so every URL here is absolute.
    { tagName: "link", rel: "canonical", href: absoluteUrl("/scientific") },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:url", content: absoluteUrl("/scientific") },
    { property: "og:image", content: absoluteUrl("/og.png") },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "The MathPencil wordmark" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: TITLE },
    { name: "twitter:description", content: DESCRIPTION },
    { name: "twitter:image", content: absoluteUrl("/og.png") },
    // What the page is, in the form a crawler parses rather than reads. The
    // questions are the same objects the page renders, so the markup cannot
    // drift from the visible text.
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            name: `${SITE_NAME} scientific calculator`,
            url: absoluteUrl("/scientific"),
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any browser",
            description: DESCRIPTION,
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: { "@type": "Organization", name: "HTPdevs", url: "https://htpdevs.tech" },
          },
        ],
      },
    },
  ];
}

export default function Scientific() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      {/* The desk is the same desk: only the instrument standing on it changes. */}
      <main className="relative flex flex-1 w-full flex-col items-center bg-desk px-4 py-4 sm:py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(255,255,255,0.055), transparent 70%)",
          }}
        />

        {/* The instrument keeps the whole first viewport to itself: the notes
            below are reading matter, and none of it is needed for an answer. */}
        <div className="relative flex w-full flex-1 items-center justify-center">
          <h1 className="sr-only">
            Scientific calculator: trigonometry, logarithms, powers and roots
          </h1>
          <ScientificCalculator />
        </div>

        <div className="relative flex w-full flex-col items-center pb-4 sm:pb-8">
          <ScientificNotes />
        </div>
      </main>

      <ScrollToTop />
      <SiteFooter />
    </div>
  );
}
