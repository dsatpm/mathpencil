import { Link, useParams } from "react-router";
import type { Route } from "./+types/pre-algebra.chapter";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ChapterNav } from "../components/ChapterNav";
import { ChapterPager } from "../components/ChapterPager";
import { PreAlgebraSolver } from "../components/PreAlgebraSolver";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  chapterBySlug,
  COURSE_ROWS,
  MAIN_IDEA,
  MAIN_TAKEAWAY,
  type Chapter,
  type PageSection,
} from "../data/pre-algebra";
import {
  BODY,
  EYEBROW,
  H1,
  H2,
  H3,
  LINK,
  MASTHEAD,
  SHEET,
} from "../lib/pre-algebra-style";
import { absoluteUrl, PUBLISHER, socialMeta } from "../lib/site";

/**
 * One module renders all twelve chapters.
 *
 * The route is `/pre-algebra/:slug` and every valid slug is listed in
 * `react-router.config.ts`, so the build writes twelve HTML files and nginx
 * serves them as files. Nothing here loads at request time: the chapter is
 * looked up from the same array the prerender list was built from.
 */

/** The crumbs above the title, and the `BreadcrumbList` a crawler is given. */
function crumbsFor(chapter: Chapter) {
  return [
    { label: "MathPencil", to: "/" },
    { label: "Pre-algebra", to: "/pre-algebra" },
    { label: chapter.title },
  ];
}

export function meta({ params }: Route.MetaArgs) {
  const chapter = chapterBySlug(params.slug);

  if (chapter === undefined) {
    return [{ title: "Chapter not found" }, { name: "robots", content: "noindex" }];
  }

  const path = `/pre-algebra/${chapter.slug}`;

  return [
    ...socialMeta({
      title: chapter.metaTitle,
      description: chapter.metaDescription,
      path,
      type: "article",
    }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            // A lesson rather than a tool, so it is described as one, and its
            // sections are listed, because a crawler cannot see a left gutter.
            "@type": "LearningResource",
            name: chapter.title,
            headline: chapter.metaTitle,
            description: chapter.metaDescription,
            url: absoluteUrl(path),
            learningResourceType: "Lesson",
            educationalLevel: "Middle school",
            teaches: chapter.title,
            inLanguage: "en",
            isPartOf: {
              "@type": "Course",
              name: "Pre-algebra",
              url: absoluteUrl("/pre-algebra"),
            },
            articleSection: chapter.sections.map((section) => section.title),
            author: PUBLISHER,
            publisher: PUBLISHER,
            isAccessibleForFree: true,
          },
          {
            // The same trail the reader can see above the title.
            "@type": "BreadcrumbList",
            itemListElement: crumbsFor(chapter).map((crumb, index) => ({
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

/** A section of the chapter, carrying the id its contents entry points at. */
function Section({
  section,
  children,
}: {
  section: PageSection;
  children: React.ReactNode;
}) {
  return (
    // `scroll-mt` keeps the heading clear of the top of the window when the
    // contents list jumps to it, rather than tucking it under the edge.
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className={`${SHEET} scroll-mt-6`}
    >
      <h2 id={`${section.id}-heading`} className={H2}>
        {section.title}
      </h2>
      {children}
    </section>
  );
}

/** The subject matter: what it is, the facts, one example worked through. */
function TopicBlock({ chapter }: { chapter: Chapter }) {
  if (chapter.topic === undefined) return null;
  const { summary, points, example } = chapter.topic;

  return (
    <>
      <p className={BODY}>{summary}</p>

      <ul className="mt-4 list-disc space-y-1.5 pl-5 font-sans text-[1rem] leading-[1.6rem] text-pa-ink-soft marker:text-pa-biro/70">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <div className="mt-5 border border-pa-paper-edge bg-white/55 px-4 py-3.5">
        <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-pa-ink-soft">
          {example.label}
        </p>
        <div className="mt-1.5 font-mono text-[0.95rem] leading-4 text-pa-ink">
          {example.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </>
  );
}

/** The formulas this chapter owns, as a list to read down. */
function FormulasBlock({ chapter }: { chapter: Chapter }) {
  if (chapter.formulas === undefined) return null;

  return (
    <>
      <p className={BODY}>
        A few of these are usually memorised. The rest follow from what they describe:
        profit is what is left after the cost comes off, which is the formula itself
        stated in words.
      </p>

      {chapter.formulas.map((group) => (
        <div key={group.heading} className="mt-6">
          <h3 className={H3}>{group.heading}</h3>

          {/* Hairlines between the entries: the formulas are a list to read
              down, and a rule beside each one would compete with the
              highlighted formula itself. */}
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
    </>
  );
}

/** The words this chapter is the place to learn. */
function VocabularyBlock({ chapter }: { chapter: Chapter }) {
  if (chapter.vocabulary === undefined) return null;

  return (
    <>
      <p className={BODY}>
        Much of pre-algebra is vocabulary. A question names what it wants in these
        terms, and the term decides which arithmetic answers it.
      </p>

      <dl className="mt-5 divide-y divide-pa-ink/12 border-t border-pa-ink/12">
        {chapter.vocabulary.map((entry) => (
          <div key={entry.word} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
            <dt className="font-sans text-[0.95rem] font-bold text-pa-ink">{entry.word}</dt>
            <dd className="m-0 font-sans text-[0.95rem] leading-6 text-pa-ink-soft">
              {entry.meaning}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/** The worked examples, each set out the way a solution is written on paper. */
function ExamplesBlock({ chapter }: { chapter: Chapter }) {
  if (chapter.examples === undefined) return null;

  return (
    <>
      <p className={BODY}>
        Each one is set out the way a solution is written on paper: the question, the
        steps in order, then the answer.
      </p>

      <div className="mt-5 space-y-4">
        {chapter.examples.map((example) => (
          <article
            key={example.title}
            className="border border-pa-paper-edge bg-white/55 px-4 py-4 sm:px-5"
          >
            <h3 className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.18em] text-pa-biro">
              {example.title}
            </h3>
            <p className="mt-1.5 font-sans text-[1rem] font-semibold leading-6 text-pa-ink">
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

            {/* The answer is underlined twice, in the red a teacher marks in.
                It is the one place that colour is used, so it always means
                "this is the answer". */}
            <p className="mt-3 inline-block border-b-4 border-double border-pa-mark pb-1 font-mono text-[1.15rem] font-medium text-pa-mark">
              {example.answer}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

/** The block that holds the two boards, on the one chapter that carries them. */
function SolverBlock() {
  return (
    <>
      <p className={BODY}>
        Two boards. The first solves an equation with one letter in it. The second puts
        a value in place of the letter and works the expression out. Both show every
        step, and both keep fractions exact, so a third is{" "}
        <span className="font-mono">1/3</span> here and not{" "}
        <span className="font-mono">0.333333333333</span>, which is how you are expected
        to write it.
      </p>

      <div className="mt-5">
        <PreAlgebraSolver />
      </div>
    </>
  );
}

/** The comparison table, on the introduction chapter. */
function HowItDiffersBlock() {
  return (
    <>
      <p className={BODY}>
        The three classes are taken in order, and each one asks more of you than the
        last. Pre-algebra brings in variables, equations, formulas and number rules.
        Algebra uses those same skills on harder problems. Algebra 2 works with whole
        families of equations and what their graphs look like.
      </p>

      {/* A table is the clearest form for a three-way comparison, so it stays a
          table and scrolls inside itself on a narrow screen rather than pushing
          the page sideways. */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-2xl border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-pa-ink/20">
              <th
                scope="col"
                className="w-40 py-2.5 pr-4 font-sans text-[0.72rem] font-bold uppercase tracking-[0.16em] text-pa-ink-soft"
              >
                &nbsp;
              </th>
              <th scope="col" className="py-2.5 pr-4 font-sans text-[0.85rem] font-bold text-pa-biro">
                Pre-algebra
              </th>
              <th scope="col" className="py-2.5 pr-4 font-sans text-[0.85rem] font-bold text-pa-ink">
                Algebra
              </th>
              <th scope="col" className="py-2.5 font-sans text-[0.85rem] font-bold text-pa-ink">
                Algebra 2
              </th>
            </tr>
          </thead>
          <tbody>
            {COURSE_ROWS.map((row) => (
              <tr key={row.aspect} className="border-b border-pa-ink/12 align-top">
                <th scope="row" className="py-3 pr-4 font-sans text-[0.85rem] font-semibold text-pa-ink">
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

      <h2 className={`${H2} mt-6`}>
        The TLDR;
      </h2>
      <p className={BODY}>
        Pre-algebra teaches you the basic rules and methods, algebra asks you to decide which methods to use, and Algebra 2 expands 
        those ideas to more advanced equations, functions, and graphs.
      </p>
    </>
  );
}

/** The opening section of the introduction chapter. */
function WhatIsPreAlgebraBlock() {
  return (
    <>
      <p className={BODY}>
        In arithmetic, you are usually given all the numbers and use the rules of math to find the answer.
        In pre-algebra, one of those numbers may be unknown, so a letter, called a <span className="font-mono font-bold text-[1.05rem]">{" "}variable</span>, is
        used to represent it until you find its value. The important idea is that the rules of arithmetic do not change. A variable
        follows the same rules as the number it represents.
      </p>

      <div className="mt-5 bg-pa-note/45 px-4 py-4">
        <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.18em] text-pa-ink-soft">
          Example
        </p>
        <dl className="mt-2.5 grid gap-2 sm:grid-cols-3">
          <div>
            <dt className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-pa-ink-soft">
              Arithmetic
            </dt>
            <dd className="m-0 font-mono text-[1.05rem] text-pa-ink">{MAIN_IDEA.arithmetic}</dd>
          </div>
          <div>
            <dt className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-pa-ink-soft">
              Pre-algebra
            </dt>
            <dd className="m-0 font-mono text-[1.05rem] text-pa-ink">{MAIN_IDEA.preAlgebra}</dd>
          </div>
          <div>
            <dt className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-pa-ink-soft">
              Answer
            </dt>
            <dd className="m-0 font-mono text-[1.05rem] text-pa-mark">{MAIN_IDEA.solution}</dd>
          </div>
        </dl>
      </div>

      <p className={BODY}>
        If 7 plus an unknown number is 12, you can probably see that the missing number is 5.
      </p>
      <p className={BODY}>
        Pre-albegra turns that kind of reasoning into a method you can use even when the numbers are larger or the answer is not obvious.
        The key idea is the <span className="font-mono font-bold text-[1.05rem]">balance rule:</span> whatever operation you perform
        on one side of an equation, you must also perform on the other side to keep the equation balanced.
      </p>
    </>
  );
}

/** The last word of the course, printed at the end of the last chapter. */
function TakeawayBlock() {
  return (
    <p className="mt-3 font-sans text-[1.05rem] leading-[1.7rem] text-pa-ink">
      {MAIN_TAKEAWAY}
    </p>
  );
}

/** Picks the block a section names. */
function SectionBody({ chapter, section }: { chapter: Chapter; section: PageSection }) {
  switch (section.kind) {
    case "what-is-pre-algebra":
      return <WhatIsPreAlgebraBlock />;
    case "how-it-differs":
      return <HowItDiffersBlock />;
    case "topic":
      return <TopicBlock chapter={chapter} />;
    case "formulas":
      return <FormulasBlock chapter={chapter} />;
    case "key-words":
      return <VocabularyBlock chapter={chapter} />;
    case "examples":
      return <ExamplesBlock chapter={chapter} />;
    case "solver":
      return <SolverBlock />;
    case "takeaway":
      return <TakeawayBlock />;
  }
}

export default function PreAlgebraChapter() {
  const { slug } = useParams();
  const chapter = slug === undefined ? undefined : chapterBySlug(slug);

  // Every valid slug is prerendered, so this only shows if someone types one
  // that is not a chapter. It says so and offers the contents rather than
  // leaving a blank page.
  if (chapter === undefined) {
    return (
      <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
        <SiteHeader />
        <main className="on-grid flex-1 w-full bg-pa-ground px-4 py-6 sm:py-10">
          <div className="mx-auto w-full max-w-3xl">
            <section className={SHEET}>
              <h1 className="font-sans text-[1.75rem] font-bold leading-tight text-pa-ink">
                That chapter is not part of this course
              </h1>
              <p className={BODY}>
                The address does not match any of the twelve chapters. The{" "}
                <Link to="/pre-algebra" className={LINK}>
                  course contents
                </Link>{" "}
                lists all of them.
              </p>
            </section>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      {/* A lesson, not a machine: cool grid paper rather than the warm desk the
          two calculators stand on. */}
      <main className="on-grid flex-1 w-full bg-pa-ground px-4 py-6 sm:py-10">
        <div className="mx-auto w-full max-w-6xl">
          <header className={MASTHEAD}>
            <Breadcrumbs crumbs={crumbsFor(chapter)} />
            <p className={`${EYEBROW} mt-3`}>
              Chapter {String(chapter.number).padStart(2, "0")}
            </p>
            <h1 className={H1}>{chapter.title}</h1>
            {chapter.intro.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 max-w-2xl font-sans text-[1.05rem] leading-[1.7rem] text-pa-ink-soft sm:text-[1.15rem]"
              >
                {paragraph}
              </p>
            ))}
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
            <ChapterNav current={chapter} />

            <div className="flex min-w-0 flex-col gap-6">
              {chapter.sections.map((section) => (
                <Section key={section.id} section={section}>
                  <SectionBody chapter={chapter} section={section} />
                </Section>
              ))}

              {chapter.related !== undefined && (
                <section className={SHEET} aria-labelledby="related-heading">
                  <h2 id="related-heading" className={H2}>
                    Where this leads
                  </h2>
                  <dl className="mt-4 divide-y divide-pa-ink/12 border-t border-pa-ink/12">
                    {chapter.related.map((link) => (
                      <div key={link.to} className="py-3">
                        <dt>
                          <Link to={link.to} className={`${LINK} font-semibold`}>
                            {link.label}
                          </Link>
                        </dt>
                        <dd className="m-0 mt-1 font-sans text-[0.95rem] leading-6 text-pa-ink-soft">
                          {link.why}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <ChapterPager slug={chapter.slug} />
            </div>
          </div>
        </div>
      </main>

      <ScrollToTop tone="grid" />
      <SiteFooter />
    </div>
  );
}
