import { Link } from "react-router";
import type { Route } from "./+types/pre-algebra.solver";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PreAlgebraSolver } from "../components/PreAlgebraSolver";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { BODY, EYEBROW, H1, H2, LINK, MASTHEAD, SHEET } from "../lib/pre-algebra-style";
import { absoluteUrl, PUBLISHER, socialMeta } from "../lib/site";

const TITLE = "Step-by-step equation solver for pre-algebra";
const DESCRIPTION =
  "Solves an equation with one unknown and shows every line of the working, keeping fractions exact. Also substitutes a value into an expression and evaluates it step by step.";

const CRUMBS = [
  { label: "MathPencil", to: "/" },
  { label: "Pre-algebra", to: "/pre-algebra" },
  { label: "Step-by-step solver" },
];

/**
 * The solver on a page of its own.
 *
 * The same two boards are mounted inside chapter 8, where they are the natural
 * end of a lesson about equations. Here they are the whole page, and the copy
 * around them is about the tool rather than about the mathematics: what it
 * accepts, what it turns down, and why it prints fractions rather than
 * decimals. Nothing on this page is repeated from the chapter.
 */
export function meta({}: Route.MetaArgs) {
  return [
    ...socialMeta({
      title: TITLE,
      description: DESCRIPTION,
      path: "/pre-algebra/solver",
      type: "website",
    }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            name: "Pre-algebra step-by-step solver",
            url: absoluteUrl("/pre-algebra/solver"),
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any browser",
            description: DESCRIPTION,
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: PUBLISHER,
            isPartOf: {
              "@type": "Course",
              name: "Pre-algebra",
              url: absoluteUrl("/pre-algebra"),
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: CRUMBS.map((crumb, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: crumb.label,
              ...(crumb.to === undefined ? {} : { item: absoluteUrl(crumb.to) }),
            })),
          },
        ],
      },
    },
  ];
}

export default function PreAlgebraSolverPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      <main className="on-grid flex-1 w-full bg-pa-ground px-4 py-6 sm:py-10">
        <div className="mx-auto w-full max-w-4xl">
          <header className={MASTHEAD}>
            <Breadcrumbs crumbs={CRUMBS} />
            <p className={`${EYEBROW} mt-3`}>MathPencil lessons</p>
            <h1 className={H1}>Step-by-step solver</h1>
            <p className="mt-3 max-w-2xl font-sans text-[1.05rem] leading-[1.7rem] text-pa-ink-soft sm:text-[1.15rem]">
              Two boards. The first solves an equation with one letter in it. The second
              puts a value in place of the letter and works the expression out. Both print
              the working line by line, which is the part a teacher marks.
            </p>
          </header>

          {/* The instrument keeps the top of the page. Everything explaining it
              sits below, because none of it is needed to get an answer. */}
          <div className="mt-6">
            <PreAlgebraSolver />
          </div>

          <section className={`${SHEET} mt-6`} aria-labelledby="exact-heading">
            <h2 id="exact-heading" className={H2}>
              Why the answers are fractions
            </h2>
            <p className={BODY}>
              A third written as a decimal is 0.333333333333, and that is already wrong by
              the time the screen runs out of room. The solver carries the numerator and
              the denominator as whole numbers the whole way through and divides only when
              the division comes out exact, so a third stays{" "}
              <span className="font-mono">1/3</span>.
            </p>
            <p className={BODY}>
              That is also how you are expected to write it. An answer of{" "}
              <span className="font-mono">7/2</span> is marked correct where 3.5 may not
              be, depending on what the question asked for.
            </p>
          </section>

          <section className={`${SHEET} mt-6`} aria-labelledby="limits-heading">
            <h2 id="limits-heading" className={H2}>
              What it solves, and what it turns down
            </h2>
            <p className={BODY}>
              It handles one unknown, appearing as a plain letter, with the four
              operations and brackets around them. That covers one-step equations like{" "}
              <span className="font-mono">x + 8 = 15</span>, two-step equations like{" "}
              <span className="font-mono">2x + 5 = 17</span>, and equations with the letter
              on both sides.
            </p>
            <p className={BODY}>
              Anything past one letter is turned down with a sentence saying which rule it
              broke. A letter squared, a letter on the bottom of a fraction, or two
              different letters are all algebra rather than pre-algebra, and a tool that
              answered them here would be teaching a method the course has not reached.
            </p>
            <p className={BODY}>
              It is built for checking work rather than replacing it. The steps are the
              output; the answer on its own is the least useful part of what it prints.
            </p>
          </section>

          <section className={`${SHEET} mt-6`} aria-labelledby="elsewhere-heading">
            <h2 id="elsewhere-heading" className={H2}>
              For everything else
            </h2>
            <p className={BODY}>
              For roots, powers and trigonometry there is the{" "}
              <Link to="/scientific" className={LINK}>
                scientific calculator
              </Link>
              , which applies the order of operations. For a running total that prints to a
              tape, the{" "}
              <Link to="/" className={LINK}>
                adding machine
              </Link>
              . To learn the method rather than check it, the{" "}
              <Link to="/pre-algebra/expressions-variables-and-equations" className={LINK}>
                chapter on expressions, variables and equations
              </Link>{" "}
              is where the balance rule is explained, and the{" "}
              <Link to="/pre-algebra" className={LINK}>
                course contents
              </Link>{" "}
              lists the rest.
            </p>
          </section>
        </div>
      </main>

      <ScrollToTop tone="grid" />
      <SiteFooter />
    </div>
  );
}
