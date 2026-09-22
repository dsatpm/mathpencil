import type { Route } from "./+types/pre-algebra";
import { OnThisPage } from "../components/OnThisPage";
import { PreAlgebraSolver } from "../components/PreAlgebraSolver";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  COURSE_ROWS,
  EXAMPLES,
  FORMULA_GROUPS,
  PRE_ALGEBRA_FAQ,
  SECTIONS,
  TOPICS,
} from "../data/pre-algebra";
import { absoluteUrl, SITE_NAME } from "../lib/site";

const TITLE = "Pre-algebra — topics, formulas, worked examples and a step-by-step solver";
const DESCRIPTION =
  "What pre-algebra is, how it differs from algebra 1 and algebra 2, every topic it covers, the formulas worth knowing, worked examples, and a solver that shows each step of a linear equation.";

export function meta({}: Route.MetaArgs) {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { tagName: "link", rel: "canonical", href: absoluteUrl("/pre-algebra") },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "article" },
    { property: "og:url", content: absoluteUrl("/pre-algebra") },
    { property: "og:image", content: absoluteUrl("/og.png") },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "The MathPencil wordmark" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: TITLE },
    { name: "twitter:description", content: DESCRIPTION },
    { name: "twitter:image", content: absoluteUrl("/og.png") },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            // A lesson rather than a tool, so it is described as one — and the
            // sections are listed, because a crawler cannot see a left gutter.
            "@type": "Article",
            headline: "Pre-algebra: topics, formulas and worked examples",
            description: DESCRIPTION,
            url: absoluteUrl("/pre-algebra"),
            author: { "@type": "Organization", name: "HTPdevs", url: "https://htpdevs.tech" },
            publisher: { "@type": "Organization", name: "HTPdevs", url: "https://htpdevs.tech" },
            articleSection: SECTIONS.map((section) => section.title),
            isAccessibleForFree: true,
          },
          {
            "@type": "FAQPage",
            mainEntity: PRE_ALGEBRA_FAQ.map((entry) => ({
              "@type": "Question",
              name: entry.question,
              acceptedAnswer: { "@type": "Answer", text: entry.answer },
            })),
          },
        ],
      },
    },
  ];
}

const SHEET =
  "border border-pa-paper-edge bg-pa-paper px-5 py-6 shadow-[0_2px_14px_-6px_rgba(27,42,65,0.35)] sm:px-7 sm:py-8";
const H2 = "font-sans text-[1.5rem] font-bold leading-tight text-pa-ink sm:text-[1.75rem]";
const BODY = "mt-3 font-sans text-[1.02rem] leading-[1.7rem] text-pa-ink-soft";
const LINK =
  "text-pa-biro underline decoration-pa-biro/35 underline-offset-4 hover:decoration-pa-biro";

/** One section of the lesson, carrying the id its entry in the contents list points at. */
function Lesson({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    // `scroll-mt` keeps the heading clear of the top of the window when the
    // contents list jumps to it, rather than tucking it under the edge.
    <section id={id} aria-labelledby={`${id}-heading`} className={`${SHEET} scroll-mt-6`}>
      <h2 id={`${id}-heading`} className={H2}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function PreAlgebra() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      {/* A lesson, not a machine: cool grid paper rather than the warm desk the
          two calculators stand on. */}
      <main className="on-grid flex-1 w-full bg-pa-ground px-4 py-6 sm:py-10">
        <div className="mx-auto w-full max-w-6xl">
          <header className="grid-paper border border-pa-paper-edge bg-pa-paper px-5 py-7 shadow-[0_2px_14px_-6px_rgba(27,42,65,0.35)] sm:px-8 sm:py-9">
            <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.22em] text-pa-biro">
              MathPencil lessons
            </p>
            <h1 className="mt-2 font-sans text-[2rem] font-bold leading-[1.15] text-pa-ink sm:text-[2.6rem]">
              Pre-algebra
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-[1.05rem] leading-[1.7rem] text-pa-ink-soft sm:text-[1.15rem]">
              The bridge between arithmetic and algebra: the point where a missing number gets a
              letter, and the rules you already use on numbers turn out to hold anyway. This page
              covers what the subject is, the {TOPICS.length} topics it teaches, the formulas worth
              knowing, worked examples, and a solver that shows its steps.
            </p>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
            <OnThisPage sections={SECTIONS} />

            <div className="flex min-w-0 flex-col gap-6">
              <Lesson id="what-is-pre-algebra" title="What is pre-algebra?">
                <p className={BODY}>
                  Pre-algebra is the course that takes everything arithmetic taught you — whole
                  numbers, fractions, decimals, percentages, the order operations are done in — and
                  shows that none of it stops working when one of the numbers is missing. In place
                  of the missing number you write a letter, and the letter obeys the same rules the
                  number would have.
                </p>
                <p className={BODY}>
                  That is the whole idea. If you can work out that 3 × 5 + 5 is 20, you can work
                  backwards: if 3 × something + 5 is 20, the something must be 5. Pre-algebra turns
                  that backwards reasoning into a method — the balance rule — so it works when the
                  numbers are not ones you can guess.
                </p>
                {/* The tint alone carries this: it is the same highlighter the
                    formulas are marked in, which is enough to say "this line
                    matters" without a rule down the side of it. */}
                <div className="mt-5 bg-pa-note/45 px-4 py-3">
                  <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.18em] text-pa-ink-soft">
                    In short
                  </p>
                  <p className="mt-1.5 font-sans text-[1rem] leading-[1.55rem] text-pa-ink">
                    Arithmetic asks <span className="font-mono">3 × 5 + 5 = ?</span>. Pre-algebra
                    asks <span className="font-mono">3x + 5 = 20</span>. Same sum, read from the
                    other end.
                  </p>
                </div>
                <p className={BODY}>
                  It is usually met somewhere around grades 6 to 8, but the topics are the ones any
                  adult coming back to maths needs first, and nothing here assumes you remember the
                  first time round.
                </p>
              </Lesson>

              <Lesson id="how-it-differs" title="Pre-algebra, algebra and algebra 2">
                <p className={BODY}>
                  The three courses are usually taken in order, and each one changes what you are
                  actually looking at. Pre-algebra works on numbers with one of them missing.
                  Algebra 1 works on the expression itself. Algebra 2 works on whole families of
                  functions and the shapes of their graphs.
                </p>

                {/* The table is the clearest form for a three-way comparison, so
                    it stays a table and scrolls inside itself on a narrow
                    screen rather than forcing the page sideways. */}
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[42rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b-2 border-pa-ink/20">
                        <th scope="col" className="w-40 py-2.5 pr-4 font-sans text-[0.72rem] font-bold uppercase tracking-[0.16em] text-pa-ink-soft">
                          &nbsp;
                        </th>
                        <th scope="col" className="py-2.5 pr-4 font-sans text-[0.85rem] font-bold text-pa-biro">
                          Pre-algebra
                        </th>
                        <th scope="col" className="py-2.5 pr-4 font-sans text-[0.85rem] font-bold text-pa-ink">
                          Algebra 1
                        </th>
                        <th scope="col" className="py-2.5 font-sans text-[0.85rem] font-bold text-pa-ink">
                          Algebra 2
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COURSE_ROWS.map((row) => (
                        <tr key={row.aspect} className="border-b border-pa-ink/12 align-top">
                          <th
                            scope="row"
                            className="py-3 pr-4 font-sans text-[0.85rem] font-semibold text-pa-ink"
                          >
                            {row.aspect}
                          </th>
                          <td className="py-3 pr-4 font-sans text-[0.92rem] leading-[1.4rem] text-pa-ink-soft">
                            {row.preAlgebra}
                          </td>
                          <td className="py-3 pr-4 font-sans text-[0.92rem] leading-[1.4rem] text-pa-ink-soft">
                            {row.algebra}
                          </td>
                          <td className="py-3 font-sans text-[0.92rem] leading-[1.4rem] text-pa-ink-soft">
                            {row.algebraTwo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className={BODY}>
                  The practical difference is how much choosing you do. A pre-algebra question has
                  one route through it and you undo the operations in order. An algebra 1 question
                  usually has two or three possible routes and part of the work is picking one. By
                  algebra 2 the question is often about behaviour rather than a single value.
                </p>
              </Lesson>

              <Lesson id="topics" title="Pre-algebra topics">
                <p className={BODY}>
                  Courses order these differently and some split or combine them, but this is what
                  the subject covers. Each one is the same idea seen again: arithmetic, done
                  carefully enough that it still works when a number is missing.
                </p>

                <ol className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-2">
                  {TOPICS.map((topic, index) => (
                    <li
                      key={topic.name}
                      className="border border-pa-paper-edge bg-white/55 px-4 py-4"
                    >
                      <div className="flex items-baseline gap-2.5">
                        <span
                          aria-hidden="true"
                          className="font-mono text-[0.78rem] tabular-nums text-pa-biro"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-sans text-[1.02rem] font-bold text-pa-ink">
                          {topic.name}
                        </h3>
                      </div>
                      <p className="mt-1.5 font-sans text-[0.92rem] leading-[1.4rem] text-pa-ink-soft">
                        {topic.summary}
                      </p>
                      <p className="mt-2.5 border-t border-pa-paper-edge pt-2 font-mono text-[0.85rem] leading-[1.3rem] text-pa-ink">
                        <span className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-pa-ink-soft">
                          Looks like
                        </span>
                        <br />
                        {topic.looksLike}
                      </p>
                    </li>
                  ))}
                </ol>
              </Lesson>

              <Lesson id="formulas" title="Formulas worth knowing">
                <p className={BODY}>
                  A handful of these are worth knowing by heart because they turn up constantly.
                  The rest are worth understanding: if you know that profit is what is left after
                  the cost comes off, you can write the formula down whenever you need it.
                </p>

                {FORMULA_GROUPS.map((group) => (
                  <div key={group.heading} className="mt-6">
                    <h3 className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.2em] text-pa-biro">
                      {group.heading}
                    </h3>
                    {/* Hairlines between the entries, not a tab beside each
                        one: the formulas are a list to read down, and a rule
                        per row competes with the highlighted expression. */}
                    <dl className="mt-3 divide-y divide-pa-ink/12 border-t border-pa-ink/12">
                      {group.formulas.map((formula) => (
                        <div key={formula.name} className="py-3">
                          <dt className="font-sans text-[0.9rem] font-bold text-pa-ink">
                            {formula.name}
                          </dt>
                          <dd className="m-0">
                            <p className="mt-1 inline-block bg-pa-note/60 px-2 py-1 font-mono text-[0.95rem] leading-[1.4rem] text-pa-ink">
                              {formula.expression}
                            </p>
                            <p className="mt-1.5 font-sans text-[0.92rem] leading-[1.4rem] text-pa-ink-soft">
                              {formula.meaning}
                            </p>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </Lesson>

              <Lesson id="examples" title="Worked examples">
                <p className={BODY}>
                  Each one is written the way it should be written on paper: the question, the steps
                  in order, and the answer at the end. The steps are the part that earns the marks.
                </p>

                <div className="mt-5 space-y-4">
                  {EXAMPLES.map((example) => (
                    <article
                      key={example.title}
                      className="border border-pa-paper-edge bg-white/55 px-4 py-4 sm:px-5"
                    >
                      <h3 className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.18em] text-pa-biro">
                        {example.title}
                      </h3>
                      <p className="mt-1.5 font-sans text-[1rem] font-semibold leading-[1.5rem] text-pa-ink">
                        {example.question}
                      </p>

                      <p className="mt-3 font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-pa-ink-soft">
                        Solution
                      </p>
                      <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 font-sans text-[0.95rem] leading-[1.45rem] text-pa-ink-soft marker:font-mono marker:text-pa-biro">
                        {example.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>

                      {/* The answer is underlined twice, in the red a teacher
                          marks in — the one place on the page that colour is
                          used, so it always means "this is the answer". */}
                      <p className="mt-3 inline-block border-b-4 border-double border-pa-mark pb-1 font-mono text-[1.15rem] font-medium text-pa-mark">
                        {example.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </Lesson>

              <Lesson id="solver" title="Work an equation out">
                <p className={BODY}>
                  Two boards: one solves a linear equation in one unknown, the other puts a value in
                  place of the letter and works the expression out. Both show every step, and both
                  keep fractions exact — a third is <span className="font-mono">1/3</span> here, not{" "}
                  <span className="font-mono">0.333333333333</span>, because that is how a
                  pre-algebra answer is written.
                </p>
                <p className={BODY}>
                  Use it to check your own working rather than to replace it. Anything past one
                  unknown — a letter squared, a letter in the divisor, two different letters — is
                  refused with a sentence saying why, because that is algebra 1 and this is not the
                  page for it. For roots, powers and trigonometry there is the{" "}
                  <a href="/scientific" className={LINK}>
                    scientific calculator
                  </a>
                  ; for a running total, the{" "}
                  <a href="/" className={LINK}>
                    adding machine
                  </a>
                  .
                </p>

                <div className="mt-5">
                  <PreAlgebraSolver />
                </div>
              </Lesson>

              <Lesson id="questions" title="Common questions">
                <dl className="mt-4">
                  {PRE_ALGEBRA_FAQ.map((entry, index) => (
                    <div
                      key={entry.question}
                      className={index === 0 ? "" : "mt-4 border-t border-pa-ink/12 pt-4"}
                    >
                      <dt className="font-sans text-[1rem] font-bold leading-[1.45rem] text-pa-ink">
                        {entry.question}
                      </dt>
                      <dd className="m-0 mt-1.5 font-sans text-[1rem] leading-[1.6rem] text-pa-ink-soft">
                        {entry.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Lesson>

              <section className={SHEET} aria-labelledby="pa-ads-note">
                <h2
                  id="pa-ads-note"
                  className="font-sans text-[1.1rem] font-bold leading-tight text-pa-ink"
                >
                  Advertising and your privacy
                </h2>
                <p className="mt-2 font-sans text-[0.95rem] leading-[1.6rem] text-pa-ink-soft">
                  MathPencil is free, and advertising is what pays for it. Ads are served by Google
                  AdSense, which may set cookies or read device identifiers to choose and measure
                  them. Nothing you type into the solver is part of that: it stays in your browser
                  and is not shared with any advertiser. What is collected, by whom, and how to turn
                  personalised advertising off is set out in the{" "}
                  <a href="/privacy" className={LINK}>
                    privacy policy
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
