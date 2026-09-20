import type { Route } from "./+types/home";
import { AddingMachine } from "../components/AddingMachine";
import { SiteHeader } from "../components/SiteHeader";
import { absoluteUrl, SITE_NAME } from "../lib/site";

const TITLE = "MathPencil — a simple calculator for quick calculations";
const DESCRIPTION =
  "A calculator that prints its working to a tape, plus a field for pasting a sum you already have written down. Works with a mouse, a keyboard, or a number pad.";

export function meta({}: Route.MetaArgs) {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    // Share cards and canonicals are fetched by machines that have no idea
    // what host they came from, so every URL here is absolute.
    { tagName: "link", rel: "canonical", href: absoluteUrl("/") },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:url", content: absoluteUrl("/") },
    { property: "og:image", content: absoluteUrl("/og.png") },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "The MathPencil wordmark" },
    // 1200×630 is the size a large card wants; the small wordmark would have
    // been letterboxed or rejected.
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: TITLE },
    { name: "twitter:description", content: DESCRIPTION },
    { name: "twitter:image", content: absoluteUrl("/og.png") },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      <main className="relative flex flex-1 w-full items-center justify-center bg-desk px-4 py-4 sm:py-6">
        {/* The desk surface: a faint grain so the paper reads as paper lying on something. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(255,255,255,0.055), transparent 70%)",
          }}
        />
        <div className="relative w-full">
          {/* The page's heading lives in the machine's own type, so it is said
              once for a screen reader rather than twice on screen. */}
          <h1 className="sr-only">
            MathPencil calculator — add, subtract, multiply, and divide
          </h1>
          <AddingMachine />
        </div>
      </main>
    </div>
  );
}
