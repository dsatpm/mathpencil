import { Link } from "react-router";
import type { Route } from "./+types/tools";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  BoardPreview,
  LcdPreview,
  scientificAnswer,
  tapeTotal,
  TapePreview,
} from "../components/ToolPreviews";
import { absoluteUrl, PUBLISHER, SITE_NAME, socialMeta, TOOLS } from "../lib/site";

const TITLE = "Free math tools: adding machine, scientific calculator and equation solver";
const DESCRIPTION =
  "Three free calculators that show their working: an adding machine that prints a tape, a scientific calculator that reads the whole expression back, and a solver that writes out every step.";

export function meta({}: Route.MetaArgs) {
  return [
    ...socialMeta({ title: TITLE, description: DESCRIPTION, path: "/tools", type: "website" }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            name: "MathPencil tools",
            url: absoluteUrl("/tools"),
            description: DESCRIPTION,
            publisher: PUBLISHER,
            // The same list the page renders, in the same order.
            mainEntity: {
              "@type": "ItemList",
              itemListElement: TOOLS.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: tool.name,
                url: absoluteUrl(tool.path),
              })),
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/tools") },
            ],
          },
        ],
      },
    },
  ];
}

/** Each tool's picture, keyed by path so the list in `site.ts` stays the order. */
const PREVIEWS: Record<string, React.ReactNode> = {
  "/tools/calculator": <TapePreview keys="2 + 3 × 4 =" />,
  "/tools/scientific": <LcdPreview expression="2+3×4" />,
  "/pre-algebra/solver": <BoardPreview equation="3x + 5 = 20" />,
};

/**
 * The tools section.
 *
 * Three instruments on one desk, each shown doing the thing it is for. They read
 * the same keys differently on purpose, and the page says so, because a student
 * who meets 20 on one and 14 on the other deserves to know why before trusting
 * either.
 */
export default function Tools() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      <main className="relative flex-1 w-full overflow-x-hidden bg-desk-deep px-4 pb-20 pt-12 sm:pb-28 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 45% at 20% 0%, rgba(232,98,42,0.10), transparent 70%), radial-gradient(ellipse 50% 40% at 90% 30%, rgba(121,176,212,0.08), transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl">
          <header className="max-w-3xl">
            <h1 className="font-sans text-[2.4rem] font-bold leading-[1.05] tracking-[-0.02em] text-tape sm:text-[3.4rem]">
              Tools that show their working
            </h1>
            <p className="mt-5 font-sans text-[1.1rem] leading-[1.8rem] text-tape/75">
              Three free calculators. Each one keeps a record of what it did, so an answer can be
              checked rather than only accepted. They follow different rules for the same keys, and
              each card below says which rule.
            </p>
          </header>

          <ul className="mt-14 grid list-none gap-5 p-0 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <li key={tool.path}>
                <Link
                  to={tool.path}
                  className="group flex h-full flex-col overflow-hidden rounded-md border border-desk-edge bg-desk-edge/25 no-underline transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-key-act/70 focus-visible:-translate-y-1"
                >
                  <div className="flex min-h-64 items-center justify-center overflow-hidden bg-desk-edge/35 px-6 py-8">
                    <div className="flex w-full justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                      {PREVIEWS[tool.path]}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                    <h2 className="font-sans text-[1.35rem] font-bold text-tape">{tool.name}</h2>
                    <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-tape/75">
                      {tool.summary}
                    </p>
                    <p className="mt-3 font-sans text-[0.95rem] leading-[1.5rem] text-tape/55">
                      {tool.rule}
                    </p>
                    <span className="mt-auto pt-5 font-sans text-[0.82rem] font-bold uppercase tracking-[0.16em] text-key-act">
                      Open the {tool.name.toLowerCase()}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <section
            aria-labelledby="why-they-differ"
            className="mt-20 grid gap-6 border-t border-desk-edge pt-12 md:grid-cols-[1fr_1.4fr] md:gap-12"
          >
            <h2
              id="why-they-differ"
              className="font-sans text-[1.6rem] font-bold leading-tight text-tape sm:text-[2rem]"
            >
              Why 2 + 3 × 4 gives two different answers
            </h2>
            <div className="font-sans text-[1.02rem] leading-[1.7rem] text-tape/75">
              <p>
                The adding machine works the sum out as each key is pressed: 2 + 3 is 5, then 5 × 4
                is {tapeTotal("2 + 3 × 4 =")}. The scientific calculator waits for the whole
                expression and multiplies first, the way written math is read: 3 × 4 is 12, then 2 +
                12 is {scientificAnswer("2+3×4")}.
              </p>
              <p className="mt-3">
                Neither is broken. They follow different rules, and both rules are in use. The
                written rule is the one a math class uses, and{" "}
                <Link
                  to="/pre-algebra/order-of-operations"
                  className="text-tape underline decoration-tape/35 underline-offset-4 hover:decoration-tape"
                >
                  chapter 3 of the pre-algebra course
                </Link>{" "}
                explains it from the start.
              </p>
            </div>
          </section>
        </div>
      </main>

      <ScrollToTop />
      <SiteFooter />
    </div>
  );
}
