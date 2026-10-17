import type { Route } from "./+types/tools.calculator";
import { AddingMachine } from "../components/AddingMachine";
import { MachineNotes } from "../components/MachineNotes";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { absoluteUrl, PUBLISHER, SITE_NAME, socialMeta } from "../lib/site";

const PATH = "/tools/calculator";
const TITLE = "Adding machine calculator with a printed tape | MathPencil";
const DESCRIPTION =
  "A calculator that prints its working to a tape, plus a field for pasting a sum that is already written down. Works with a mouse, a keyboard, or a number pad.";

export function meta({}: Route.MetaArgs) {
  return [
    ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH, type: "website" }),
    // What the page is, said in the form a crawler parses rather than reads.
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            name: `${SITE_NAME} adding machine`,
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
              { "@type": "ListItem", position: 3, name: "Adding machine", item: absoluteUrl(PATH) },
            ],
          },
        ],
      },
    },
  ];
}

export default function Calculator() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      <main className="relative flex flex-1 w-full flex-col items-center bg-desk px-4 py-4 sm:py-6">
        {/* The desk surface: a faint grain so the paper reads as paper lying on something. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(255,255,255,0.055), transparent 70%)",
          }}
        />
        {/* The machine keeps the whole first viewport to itself: the notes below
            are reading matter, and nothing in them is needed to get an answer. */}
        <div className="relative flex w-full flex-1 items-center justify-center">
          {/* The page's heading lives in the machine's own type, so it is said
              once for a screen reader rather than twice on screen. */}
          <h1 className="sr-only">
            MathPencil calculator: add, subtract, multiply, and divide
          </h1>
          <AddingMachine />
        </div>

        <div className="relative flex w-full flex-col items-center pb-4 sm:pb-8">
          <MachineNotes />
        </div>
      </main>

      <ScrollToTop />
      <SiteFooter />
    </div>
  );
}
