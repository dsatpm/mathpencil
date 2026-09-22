import type { Route } from "./+types/pre-algebra";
import { OnThisPage } from "../components/OnThisPage";
import { PreAlgebraSolver } from "../components/PreAlgebraSolver";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  COURSE_ROWS,
  EXAMPLES,
  FORMULA_GROUPS,
  KEY_VOCABULARY,
  MAIN_IDEA,
  MAIN_TAKEAWAY,
  PRE_ALGEBRA_FAQ,
  SECTIONS,
  TOPICS,
} from "../data/pre-algebra";
import { absoluteUrl, SITE_NAME } from "../lib/site";

const TITLE = "Pre-algebra: topics, formulas, worked examples and a step-by-step solver";
const DESCRIPTION =
  "What pre-algebra is, how it differs from algebra and algebra 2, the topics it covers, the formulas to know, key words, worked examples, and a solver that shows every step of an equation.";

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
            // A lesson rather than a tool, so it is described as one, and the
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
const H3 = "font-sans text-[0.75rem] font-bold uppercase tracking-[0.2em] text-pa-biro";
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
              Pre-algebra is the math class that takes you from arithmetic into algebra. You start
              using letters, called variables, to stand for numbers you do not know yet. This page
              covers what the class is, the {TOPICS.length} topics it teaches, the formulas to know,
              the words to learn, worked examples, and a solver that shows its steps.
            </p>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
            <OnThisPage sections={SECTIONS} />

            <div className="flex min-w-0 flex-col gap-6">
              <Lesson id="what-is-pre-algebra" title="What is pre-algebra?">
                <p className={BODY}>
                  In arithmetic, you are given all the numbers and you work out the answer. In
                  pre-algebra, one of the numbers is missing, and a letter stands in its place until
                  you find it. Everything else stays the same. The rules you already use on numbers
                  still work.
                </p>

                <div className="mt-5 bg-pa-note/45 px-4 py-4">
                  <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.18em] text-pa-ink-soft">
                    The same sum, two ways
                  </p>
                  <dl className="mt-2.5 grid gap-2 sm:grid-cols-3">
                    <div>
                      <dt className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-pa-ink-soft">
                        Arithmetic
                      </dt>
                      <dd className="m-0 font-mono text-[1.05rem] text-pa-ink">
                        {MAIN_IDEA.arithmetic}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-pa-ink-soft">
                        Pre-algebra
                      </dt>
                      <dd className="m-0 font-mono text-[1.05rem] text-pa-ink">
                        {MAIN_IDEA.preAlgebra}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-pa-ink-soft">
                        Answer
                      </dt>
                      <dd className="m-0 font-mono text-[1.05rem] text-pa-mark">
                        {MAIN_IDEA.solution}
                      </dd>
                    </div>
                  </dl>
                </div>

                <p className={BODY}>
                  You already do this in your head. If 7 plus something is 12, the something is 5.
                  Pre-algebra turns that into a method that still works when the numbers are too big
                  to guess, and the method is one rule: whatever you do to one side of an equation,
                  do the same thing to the other side.
                </p>
                <p className={BODY}>
                  It is usually taught in grades 6 to 8, but these are also the first topics any
                  adult going back to math needs. Nothing here assumes you remember them already.
                </p>
              </Lesson>

              <Lesson id="how-it-differs" title="Pre-algebra, algebra and algebra 2">
                <p className={BODY}>
                  The three classes are taken in order, and each one asks more of you than the last.
                  Pre-algebra brings in variables, equations, formulas and number rules. Algebra
                  uses those same skills on harder problems. Algebra 2 works with whole families of
                  equations and what their graphs look like.
                </p>

                {/* A table is the clearest form for a three-way comparison, so it
                    stays a table and scrolls inside itself on a narrow screen
                    rather than pushing the page sideways. */}
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[42rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b-2 border-pa-ink/20">
                        <th
                          scope="col"
                          className="w-40 py-2.5 pr-4 font-sans text-[0.72rem] font-bold uppercase tracking-[0.16em] text-pa-ink-soft"
                        >
                          &nbsp;
                        </th>
                        <th
                          scope="col"
                          className="py-2.5 pr-4 font-sans text-[0.85rem] font-bold text-pa-biro"
                        >
                          Pre-algebra
                        </th>
                        <th
                          scope="col"
                          className="py-2.5 pr-4 font-sans text-[0.85rem] font-bold text-pa-ink"
                        >
                          Algebra
                        </th>
                        <th
                          scope="col"
                          className="py-2.5 font-sans text-[0.85rem] font-bold text-pa-ink"
                        >
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
                  The short version: pre-algebra teaches the rules, algebra makes you choose which
                  rule to use, and algebra 2 asks what the answers look like when you draw them.
                </p>
              </Lesson>

              <Lesson id="topics" title="Pre-algebra topics">
                <p className={BODY}>
                  Classes put these in different orders, and some split or join them, but this is
                  what pre-algebra covers. Each topic is the same idea again: arithmetic, done
                  carefully enough that it still works when a number is missing.
                </p>

                <ol className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-2">
                  {TOPICS.map((topic, index) => (
                    <li
                      key={topic.name}
                      // Hovering or tabbing into a card lifts it off the page and
                      // puts the biro into its edge, so the one you are reading
                      // is the one that looks picked up.
                      tabIndex={0}
                      className="border border-pa-paper-edge bg-white/55 px-4 py-4 transition-[border-color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:border-pa-biro hover:shadow-[0_8px_20px_-10px_rgba(27,42,65,0.5)] focus-visible:-translate-y-0.5 focus-visible:border-pa-biro focus-visible:shadow-[0_8px_20px_-10px_rgba(27,42,65,0.5)]"
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

                      <ul className="mt-2.5 list-disc space-y-1 pl-5 font-sans text-[0.9rem] leading-[1.35rem] text-pa-ink-soft marker:text-pa-biro/70">
                        {topic.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>

                      <div className="mt-3 border-t border-pa-paper-edge pt-2.5">
                        <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-pa-ink-soft">
                          {topic.example.label}
                        </p>
                        <div className="mt-1 font-mono text-[0.88rem] leading-[1.4rem] text-pa-ink">
                          {topic.example.lines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </Lesson>

              <Lesson id="formulas" title="Formulas to know">
                <p className={BODY}>
                  A few of these are worth knowing by heart, because they come up all the time. The
                  rest are worth understanding. If you know that profit is what is left after the
                  cost comes off, you can write the formula down whenever you need it.
                </p>

                {FORMULA_GROUPS.map((group) => (
                  <div key={group.heading} className="mt-6">
                    <h3 className={H3}>{group.heading}</h3>

                    {/* Hairlines between the entries: the formulas are a list to
                        read down, and a rule beside each one would compete with
                        the highlighted formula itself. */}
                    <dl className="mt-3 divide-y divide-pa-ink/12 border-t border-pa-ink/12">
                      {group.formulas.map((formula) => (
                        <div key={formula.name} className="py-3.5">
                          <dt className="font-sans text-[0.9rem] font-bold text-pa-ink">
                            {formula.name}
                          </dt>
                          <dd className="m-0">
                            <p className="mt-1 inline-block bg-pa-note/60 px-2 py-1 font-mono text-[0.95rem] leading-[1.4rem] text-pa-ink">
                              {formula.expression}
                            </p>

                            {formula.letters !== undefined && (
                              <ul className="mt-1.5 list-none space-y-0.5 p-0 font-mono text-[0.85rem] leading-[1.3rem] text-pa-ink-soft">
                                {formula.letters.map((letter) => (
                                  <li key={letter}>{letter}</li>
                                ))}
                              </ul>
                            )}

                            <p className="mt-1.5 font-sans text-[0.92rem] leading-[1.4rem] text-pa-ink-soft">
                              {formula.meaning}
                            </p>

                            {formula.example !== undefined && (
                              <div className="mt-2 bg-white/70 px-3 py-2">
                                <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.16em] text-pa-ink-soft">
                                  Example
                                </p>
                                <div className="mt-1 font-mono text-[0.88rem] leading-[1.4rem] text-pa-ink">
                                  {formula.example.map((line) => (
                                    <p key={line}>{line}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </Lesson>

              <Lesson id="key-words" title="Key words">
                <p className={BODY}>
                  Most of the trouble in pre-algebra is words, not numbers. A question is hard to
                  answer if you are not sure what it is asking for. These ten come up constantly.
                </p>

                <dl className="mt-5 divide-y divide-pa-ink/12 border-t border-pa-ink/12">
                  {KEY_VOCABULARY.map((entry) => (
                    <div key={entry.word} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                      <dt className="font-sans text-[0.95rem] font-bold text-pa-ink">
                        {entry.word}
                      </dt>
                      <dd className="m-0 font-sans text-[0.95rem] leading-[1.5rem] text-pa-ink-soft">
                        {entry.meaning}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Lesson>

              <Lesson id="examples" title="Worked examples">
                <p className={BODY}>
                  Each one is written the way you should write it on paper: the question, the steps
                  in order, then the answer. The steps are the part that gets graded.
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
                          marks in. It is the one place that colour is used, so
                          it always means "this is the answer". */}
                      <p className="mt-3 inline-block border-b-4 border-double border-pa-mark pb-1 font-mono text-[1.15rem] font-medium text-pa-mark">
                        {example.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </Lesson>

              <Lesson id="solver" title="Work an equation out">
                <p className={BODY}>
                  Two boards. The first solves an equation with one letter in it. The second puts a
                  value in place of the letter and works the expression out. Both show every step,
                  and both keep fractions exact, so a third is{" "}
                  <span className="font-mono">1/3</span> here and not{" "}
                  <span className="font-mono">0.333333333333</span>, which is how you are expected
                  to write it.
                </p>
                <p className={BODY}>
                  Use it to check your own work rather than to replace it. Anything past one letter,
                  such as a letter squared, a letter on the bottom of a fraction, or two different
                  letters, is turned down with a sentence saying why, because that is algebra and
                  this is not the page for it. For roots, powers and trigonometry there is the{" "}
                  <a href="/scientific" className={LINK}>
                    scientific calculator
                  </a>
                  . For a running total, the{" "}
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

                <div className="mt-6 bg-pa-note/45 px-4 py-4">
                  <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.18em] text-pa-ink-soft">
                    The main thing to take away
                  </p>
                  <p className="mt-1.5 font-sans text-[1rem] leading-[1.6rem] text-pa-ink">
                    {MAIN_TAKEAWAY}
                  </p>
                </div>
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
                  them. Nothing you type into the solver is part of that. It stays in your browser
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

      <ScrollToTop tone="grid" />
      <SiteFooter />
    </div>
  );
}
