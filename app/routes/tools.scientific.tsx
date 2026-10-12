import type { Route } from "./+types/tools.scientific";
import { ScientificCalculator } from "../components/ScientificCalculator";
import { ScientificNotes } from "../components/ScientificNotes";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { absoluteUrl, PUBLISHER, SITE_NAME, socialMeta } from "../lib/site";

const PATH = "/tools/scientific";
const TITLE = "Scientific calculator | MathPencil";
const DESCRIPTION =
  "A free scientific calculator with trigonometry, logarithms, powers, roots, π and e. Build the whole expression, read it back, then total it. Works with a mouse, a keyboard, or a number pad.";

export function meta({}: Route.MetaArgs) {
  return [
    ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH, type: "website" }),
    // What the page is, in the form a crawler parses rather than reads.
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            name: `${SITE_NAME} scientific calculator`,
            url: absoluteUrl(PATH),
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any browser",
            description: DESCRIPTION,
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: PUBLISHER,
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/tools") },
              { "@type": "ListItem", position: 3, name: "Scientific calculator", item: absoluteUrl(PATH) },
            ],
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
