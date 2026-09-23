import { Link } from "react-router";
import type { Route } from "./+types/pre-algebra";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CHAPTERS, MAIN_IDEA } from "../data/pre-algebra";
import {
  BODY,
  EYEBROW,
  H1,
  H2,
  LINK,
  MASTHEAD,
  SHEET,
} from "../lib/pre-algebra-style";
import { absoluteUrl, PUBLISHER, socialMeta } from "../lib/site";

const TITLE = "Pre-algebra: a free course in twelve chapters";
const DESCRIPTION =
  "A free pre-algebra course covering integers, order of operations, fractions, ratios, equations, exponents, probability and geometry. Every chapter explains the mechanism and works the examples through.";

/**
 * The course hub.
 *
 * It holds the contents and nothing else that a chapter holds. The topics, the
 * formulas, the vocabulary and the worked examples all live on chapter pages
 * now, so this page does not repeat any of them: a hub that restates its own
 * chapters competes with them, both for a reader's attention and in an index.
 */
export function meta({}: Route.MetaArgs) {
  return [
    ...socialMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/pre-algebra",
      type: "website",
    }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Course",
            name: "Pre-algebra",
            description: DESCRIPTION,
            url: absoluteUrl("/pre-algebra"),
            educationalLevel: "Middle school",
            inLanguage: "en",
            provider: PUBLISHER,
            publisher: PUBLISHER,
            isAccessibleForFree: true,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              category: "Free",
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
              courseWorkload: "PT6H",
            },
            // The twelve chapters, in the order the page lists them, so the
            // structure a crawler is given is the structure a reader sees.
            hasPart: CHAPTERS.map((chapter) => ({
              "@type": "LearningResource",
              position: chapter.number,
              name: chapter.title,
              description: chapter.blurb,
              url: absoluteUrl(`/pre-algebra/${chapter.slug}`),
              learningResourceType: "Lesson",
            })),
          },
        ],
      },
    },
  ];
}

export default function PreAlgebra() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      {/* A lesson, not a machine: cool grid paper rather than the warm desk the
          two calculators stand on. */}
      <main className="on-grid flex-1 w-full bg-pa-ground px-4 py-6 sm:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <header className={MASTHEAD}>
            <p className={EYEBROW}>MathPencil lessons</p>
            <h1 className={H1}>Pre-algebra</h1>
            <p className="mt-3 max-w-3xl font-sans text-[1.05rem] leading-[1.7rem] text-pa-ink-soft sm:text-[1.15rem]">
              Pre-algebra is the math subject that takes you from basic
              arithmetic into algebra and helps build the foundation you'll need
              for all future math. The course is designed to be accessible and
              engaging for learners at every stage. We'll cover equations,
              inequalities, ratios, percentages, integers, and other fundamental
              pre-algebra topics.
            </p>
            <p className="mt-2 max-w-3xl font-sans text-[1.05rem] leading-[1.7rem] text-pa-ink-soft sm:text-[1.15rem]">
              We have split up the course into {CHAPTERS.length} chapters, each
              focusing on a specific aspect of pre-algebra to make learning more
              manageable and structured. And of course, it is always going to be
              free!
            </p>

            <div className="mt-5 inline-block bg-pa-note/45 px-4 py-3.5">
              <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.18em] text-pa-ink-soft">
                Example
              </p>
              <p className="mt-1.5 font-mono text-[1.05rem] leading-[1.6rem] text-pa-ink">
                {MAIN_IDEA.arithmetic} becomes {MAIN_IDEA.preAlgebra}, so{" "}
                <span className="text-pa-mark">{MAIN_IDEA.solution}</span>
              </p>
            </div>
          </header>

          <section
            className={`${SHEET} mt-6`}
            aria-labelledby="contents-heading"
          >
            <h2 id="contents-heading" className={H2}>
              Welcome!
            </h2>
            <p className={BODY}>
              Choose a chapter to get started. If you're new to pre-algebra or haven't studied in a while, we
              recommend starting from
              <span
                aria-hidden="true"
                className="font-mono text-[0.78rem] tabular-nums text-pa-biro"
              >
                {" "}
                {String(CHAPTERS[0].number).padStart(2, "0")}
                <span className="font-sans text-[1.02rem] font-bold text-pa-ink ml-1">
                  {CHAPTERS[0].title}{" "}
                </span>
              </span>
              and working through each chapter in order. This will help you
              build a strong foundation as you learn each new concept.
            </p>

            <ol className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-2">
              {CHAPTERS.map((chapter) => (
                <li key={chapter.slug}>
                  {/* Hovering or tabbing into a card lifts it off the page and
                      puts the biro into its edge, so the one you are about to
                      open is the one that looks picked up. */}
                  <Link
                    to={`/pre-algebra/${chapter.slug}`}
                    className="flex h-full flex-col border border-pa-paper-edge bg-white/55 px-4 py-4 no-underline transition-[border-color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:border-pa-biro hover:shadow-[0_8px_20px_-10px_rgba(27,42,65,0.5)] focus-visible:-translate-y-0.5 focus-visible:border-pa-biro focus-visible:shadow-[0_8px_20px_-10px_rgba(27,42,65,0.5)]"
                  >
                    <span className="flex items-baseline gap-2.5">
                      <span
                        aria-hidden="true"
                        className="font-mono text-[0.78rem] tabular-nums text-pa-biro"
                      >
                        {String(chapter.number).padStart(2, "0")}
                      </span>
                      <span className="font-sans text-[1.02rem] font-bold text-pa-ink">
                        {chapter.title}
                      </span>
                    </span>

                    <span className="mt-1.5 font-sans text-[0.92rem] leading-[1.4rem] text-pa-ink-soft">
                      {chapter.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className={`${SHEET} mt-6`} aria-labelledby="solver-heading">
            <h2 id="solver-heading" className={H2}>
              Checking your work
            </h2>
            <p className={BODY}>
              The course comes with a solver that shows every line of an
              equation rather than only the answer, and keeps fractions exact
              while it does it. It sits on its own page, and again inside the
              chapter on equations.
            </p>
            <p className={BODY}>
              <Link to="/pre-algebra/solver" className={LINK}>
                Open the solver tool
              </Link>
            </p>
          </section>

          <section className={`${SHEET} mt-6`} aria-labelledby="pa-ads-note">
            <h2
              id="pa-ads-note"
              className="font-sans text-[1.1rem] font-bold leading-tight text-pa-ink"
            >
              Advertising and your privacy
            </h2>
            <p className="mt-2 font-sans text-[0.95rem] leading-[1.6rem] text-pa-ink-soft">
              MathPencil is free, and advertising is what pays for it. Ads are
              served by Google AdSense, which may set cookies or read device
              identifiers to choose and measure them. Nothing you type into the
              solver is part of that. It stays in your browser and is not shared
              with any advertiser. What is collected, by whom, and how to turn
              personalised advertising off is set out in the{" "}
              <Link to="/privacy" className={LINK}>
                privacy policy
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <ScrollToTop tone="grid" />
      <SiteFooter />
    </div>
  );
}
