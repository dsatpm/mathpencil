import { useRef, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  BoardPreview,
  LcdPreview,
  scientificAnswer,
  solvedFor,
  tapeTotal,
  TapePreview,
} from "../components/ToolPreviews";
import { CHAPTERS, chapterBySlug } from "../data/pre-algebra";
import { useLandingMotion } from "../hooks/useLandingMotion";
import { formatFraction } from "../lib/linear-solver";
import { absoluteUrl, PUBLISHER, SITE_NAME, socialMeta, TOOLS } from "../lib/site";

// The title and description name only what exists today. The levels still
// planned appear on the page, next to the word "planned", and nowhere a search
// result would quote them.
const TITLE = "MathPencil: free math, explained step by step";
const DESCRIPTION =
  "A free pre-algebra course that explains why each rule works, plus an adding machine, scientific calculator and equation solver that show their working.";

export function meta({}: Route.MetaArgs) {
  return [
    ...socialMeta({ title: TITLE, description: DESCRIPTION, path: "/", type: "website" }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            name: SITE_NAME,
            url: absoluteUrl("/"),
            description: DESCRIPTION,
            inLanguage: "en",
            publisher: PUBLISHER,
          },
          {
            "@type": "ItemList",
            name: "What MathPencil offers",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Pre-algebra course", url: absoluteUrl("/pre-algebra") },
              ...TOOLS.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: tool.name,
                url: absoluteUrl(tool.path),
              })),
            ],
          },
        ],
      },
    },
  ];
}

/* --- What the page quotes ------------------------------------------------
   Every sum and every passage below is pulled from the engines or the course
   data rather than typed again here, so the home page cannot promise an answer
   or a sentence the rest of the site does not give.
------------------------------------------------------------------------- */

const FIRST = CHAPTERS[0];
const LAST = CHAPTERS[CHAPTERS.length - 1];
const FIRST_CHAPTER_PATH = `/pre-algebra/${FIRST.slug}`;

/** A chapter the page quotes. Throws at build time if the slug is renamed. */
function quotedChapter(slug: string) {
  const chapter = chapterBySlug(slug);
  if (!chapter) throw new Error(`The home page quotes a chapter that does not exist: ${slug}`);
  return chapter;
}

const ORDER_CHAPTER = quotedChapter("order-of-operations");
const INTEGERS_CHAPTER = quotedChapter("integers-and-negative-numbers");
const INTEGERS_EXAMPLE = INTEGERS_CHAPTER.examples?.[0];

/**
 * What a visitor might arrive asking, and the page on this site that answers it.
 *
 * A chapter question takes its label and its one-line answer from the course
 * data, so the line under a question is the chapter's own blurb and cannot drift
 * from the chapter. A tool question reads from `TOOLS`. A renamed slug or path
 * throws at build time instead of shipping a dead link.
 */
interface Question {
  question: string;
  to: string;
  /** Where the answer lives, in a few words. */
  source: string;
  /** What that page covers, in a sentence. */
  summary: string;
}

function chapterQuestion(question: string, slug: string): Question {
  const chapter = quotedChapter(slug);
  return {
    question,
    to: `/pre-algebra/${chapter.slug}`,
    source: `Chapter ${chapter.number}, ${chapter.title}`,
    summary: chapter.blurb,
  };
}

function toolQuestion(question: string, path: string): Question {
  const tool = TOOLS.find((candidate) => candidate.path === path);
  if (!tool) throw new Error(`The home page quotes a tool that does not exist: ${path}`);
  return { question, to: tool.path, source: tool.name, summary: tool.summary };
}

const QUESTIONS: Question[] = [
  chapterQuestion("I have been away from math for years. Where do I start?", "introduction"),
  chapterQuestion("What is a negative times a negative?", "integers-and-negative-numbers"),
  chapterQuestion("Why is 2 + 3 × 4 equal to 14 and not 20?", "order-of-operations"),
  chapterQuestion("How do I solve for x?", "inequalities-and-one-step-equations"),
  toolQuestion("How do I check my working on an equation?", "/pre-algebra/solver"),
  chapterQuestion("What is the difference between an expression and an equation?", "expressions-variables-and-equations"),
  chapterQuestion("How do I work out a percent?", "fractions-decimals-and-percents"),
  chapterQuestion("How do I find an area, a perimeter or a missing side?", "geometry-and-measurement"),
  toolQuestion("How do I add up a long list of numbers and check it?", "/tools/calculator"),
  chapterQuestion("What does an average or a median tell me?", "probability-and-statistics"),
];

/**
 * The route through math, lowest level first. Only a level with `to` exists.
 * A level without one has no page, no link and no description: saying what a
 * planned course will contain would be promising it.
 */
const LEVELS: Array<{ name: string; to?: string }> = [
  { name: "Grade-school math" },
  { name: "Pre-algebra", to: "/pre-algebra" },
  { name: "High school math" },
  { name: "College math" },
];

const HERO_EQUATION = "3x + 5 = 20";
const BOARD_EQUATION = "5x - 7 = 2x + 8";
const SUM_KEYS = "2 + 3 × 4 =";
const SUM_EXPRESSION = "2+3×4";
const EXACT_EQUATION = "x + 1/3 = 1";

const BUTTON_PRIMARY =
  "inline-flex items-center justify-center rounded-sm bg-key-act px-6 py-3.5 font-sans text-[1rem] font-bold uppercase tracking-[0.14em] text-white no-underline shadow-[0_3px_0_0_var(--color-key-act-deep)] transition-[transform,box-shadow] duration-90 ease-linear hover:brightness-105 active:translate-y-0.75 active:shadow-[0_0_0_0_var(--color-key-act-deep)]";

const BUTTON_SECONDARY =
  "inline-flex items-center justify-center rounded-sm border border-tape/45 px-6 py-3.5 font-sans text-[1rem] font-bold uppercase tracking-[0.14em] text-tape no-underline transition-colors duration-150 hover:border-tape hover:bg-tape/8";

/** Section spacing: each block is a separate stop, not a continuation of the last. */
const SECTION = "relative px-4 py-24 sm:px-6 md:py-36";

/* --- Pieces -------------------------------------------------------------- */

/**
 * A page from the exercise book with a solution written out in biro.
 *
 * The working is the solver's, so the steps a visitor sees here are the steps
 * the solver prints when they type the same equation.
 */
function ExerciseSheet({ equation }: { equation: string }) {
  const solved = solvedFor(equation);

  return (
    <figure className="on-grid grid-paper w-full max-w-88 rotate-[-2.5deg] border border-pa-paper-edge bg-pa-paper px-6 pb-6 pt-5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
      <figcaption className="font-sans text-[0.78rem] font-bold uppercase tracking-[0.18em] text-pa-ink-soft">
        Solve {equation}
      </figcaption>
      <ol className="mt-3 list-none space-y-2 p-0 font-mono text-pa-biro">
        {solved.steps.map((step) => (
          <li key={`${step.instruction}-${step.equation}`}>
            <span className="block font-sans text-[0.78rem] text-pa-ink-soft">{step.instruction}</span>
            <span className="text-[1.15rem]">{step.equation}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 inline-block rounded-full border-2 border-pa-mark px-3 py-0.5 font-mono text-[1.25rem] text-pa-mark">
        {solved.answer}
      </p>
    </figure>
  );
}

/** A small swatch of one of the site's surfaces, set inside a line of type. */
function Swatch({ surface }: { surface: "grid" | "tape" | "lcd" }) {
  const look = {
    grid: "grid-paper bg-pa-paper",
    tape: "bg-tape bg-[linear-gradient(to_bottom,transparent_45%,var(--color-ribbon)_45%,var(--color-ribbon)_55%,transparent_55%)] bg-[length:60%_100%] bg-center bg-no-repeat",
    lcd: "bg-sci-lcd shadow-[inset_0_0_0_3px_var(--color-sci-bezel)]",
  }[surface];

  return (
    <span
      aria-hidden="true"
      className={`mx-[0.2em] inline-block h-[0.78em] w-[1.9em] rounded-full align-[-0.05em] ring-1 ring-pa-ink/15 ${look}`}
      style={surface === "grid" ? { backgroundSize: "0.4em 0.4em" } : undefined}
    />
  );
}

/** The comparison the accordion opens out. */
interface Slice {
  id: string;
  name: string;
  path: string;
  figure: string;
  figureClass: string;
  explanation: React.ReactNode;
  picture: React.ReactNode;
}

function buildSlices(): Slice[] {
  const exact = solvedFor(EXACT_EQUATION);

  return [
    {
      id: "adding-machine",
      name: "Adding machine",
      path: "/tools/calculator",
      figure: tapeTotal(SUM_KEYS),
      figureClass: "text-ribbon",
      explanation: (
        <>
          Works each step out as the key is pressed. 2 + 3 is already 5 by the time × is pressed, and
          5 × 4 is {tapeTotal(SUM_KEYS)}. A printing adding machine has always worked this way, and the
          tape prints the route it took.
        </>
      ),
      picture: <TapePreview keys={SUM_KEYS} />,
    },
    {
      id: "scientific",
      name: "Scientific calculator",
      path: "/tools/scientific",
      figure: scientificAnswer(SUM_EXPRESSION),
      figureClass: "text-sci-lcd",
      explanation: (
        <>
          Reads the whole line first, then multiplies before it adds: 3 × 4 is 12, and 2 + 12 is{" "}
          {scientificAnswer(SUM_EXPRESSION)}. This is the order of operations, and it is the rule a
          math class uses.
        </>
      ),
      picture: <LcdPreview expression={SUM_EXPRESSION} />,
    },
    {
      id: "solver",
      name: "Equation solver",
      path: "/pre-algebra/solver",
      figure: formatFraction(exact.value),
      figureClass: "text-pa-chalk-mark",
      explanation: (
        <>
          Keeps every number as an exact fraction. In {EXACT_EQUATION}, the answer is{" "}
          {exact.answer}, written as a fraction rather than a decimal that has to stop somewhere.
          A rounded decimal is marked wrong on a test where a fraction is expected.
        </>
      ),
      picture: <BoardPreview equation={EXACT_EQUATION} />,
    },
  ];
}

/**
 * Three instruments side by side, one opened out at a time.
 *
 * On a wide screen the slices sit in a row and the open one widens; on a narrow
 * one they stack and the open one grows downward. Either way each slice is a
 * button that says whether it is open, and hovering a slice on a wide screen
 * opens it as well, so a mouse and a keyboard reach the same states.
 */
function CompareAccordion() {
  const slices = buildSlices();
  const [open, setOpen] = useState(slices[0].id);

  return (
    <div className="mt-14 flex flex-col gap-3 lg:h-[34rem] lg:flex-row">
      {slices.map((slice) => {
        const isOpen = slice.id === open;
        return (
          <article
            key={slice.id}
            onMouseEnter={() => setOpen(slice.id)}
            className={[
              "group relative flex min-w-0 flex-col overflow-hidden rounded-md border transition-[flex-grow,border-color,background-color] duration-500 ease-out",
              isOpen
                ? "border-desk-edge bg-desk-edge/40 lg:grow-[3.2]"
                : "border-desk-edge/60 bg-desk-edge/15 lg:grow",
              "lg:basis-0",
            ].join(" ")}
          >
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`slice-${slice.id}`}
                onClick={() => setOpen(slice.id)}
                className="flex w-full cursor-pointer items-baseline justify-between gap-4 px-6 pb-3 pt-5 text-left"
              >
                <span className="font-sans text-[1.15rem] font-bold text-tape">{slice.name}</span>
                <span
                  className={`font-mono text-[2.2rem] leading-none tabular-nums ${slice.figureClass}`}
                >
                  {slice.figure}
                </span>
              </button>
            </h3>

            <div
              id={`slice-${slice.id}`}
              hidden={!isOpen}
              className="flex flex-1 flex-col gap-6 px-6 pb-6 lg:min-w-[26rem] lg:flex-row lg:items-end"
            >
              <p className="font-sans text-[1rem] leading-[1.65rem] text-tape/75 lg:max-w-xs">
                {slice.explanation}{" "}
                <Link
                  to={slice.path}
                  className="text-tape underline decoration-tape/35 underline-offset-4 hover:decoration-tape"
                >
                  Open the {slice.name.toLowerCase()}
                </Link>
                .
              </p>
              <div className="flex flex-1 justify-center overflow-hidden lg:justify-end">
                <div className="w-full max-w-64 transition-transform duration-700 ease-out group-hover:scale-105">
                  {slice.picture}
                </div>
              </div>
            </div>

            {/* A closed slice on a wide screen still shows what it holds, set
                along its length the way a spine is labelled on a shelf. */}
            {!isOpen && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-6 left-6 hidden font-sans text-[0.8rem] font-bold uppercase tracking-[0.2em] text-tape/40 [writing-mode:vertical-rl] lg:block"
              >
                {slice.name}
              </span>
            )}
          </article>
        );
      })}
    </div>
  );
}

/* --- The page ------------------------------------------------------------ */

export default function Home() {
  const page = useRef<HTMLDivElement>(null);
  useLandingMotion(page);

  return (
    <div ref={page} className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      <main className="w-full max-w-full flex-1 overflow-x-hidden">
        {/* Attention. The promise on the left, the work itself on the right,
            overlapping the line of type the way a sheet lies across a book. */}
        <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 md:pb-36 md:pt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 55% 60% at 78% 70%, rgba(232,98,42,0.16), transparent 70%), radial-gradient(ellipse 60% 55% at 10% 10%, rgba(242,236,224,0.07), transparent 70%)",
            }}
          />
          <div aria-hidden="true" className="desk-grain pointer-events-none absolute inset-0" />

          <div className="relative mx-auto w-full max-w-6xl [container-type:inline-size]">
            <h1 className="max-w-5xl font-sans text-[clamp(2.5rem,1.2rem+5cqi,5.25rem)] font-bold leading-[1.02] tracking-[-0.03em] text-tape">
              Math, explained
              {/* Breaks the line where the exercise sheet begins, so the sheet
                  overlaps empty desk and not the end of the heading. */}
              <br className="hidden md:block" /> one step at a time.
            </h1>

            <div className="mt-10 grid items-start gap-14 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="lg:pt-12">
                <p className="max-w-xl font-sans text-[1.15rem] leading-[1.85rem] text-tape/80 sm:text-[1.25rem]">
                  Free lessons that explain why each rule works before asking you to use it, and
                  tools that write out every step so you can check your own. No account, no
                  sign-up.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link to={FIRST_CHAPTER_PATH} className={BUTTON_PRIMARY}>
                    Start the course
                  </Link>
                  <Link to="/tools" className={BUTTON_SECONDARY}>
                    Try a tool
                  </Link>
                </div>
                <p className="mt-6 font-sans text-[1rem] text-tape/70">
                  Looking for one answer?{" "}
                  <a
                    href="#questions"
                    className="text-tape underline decoration-tape/35 underline-offset-4 hover:decoration-tape"
                  >
                    Start with your question
                  </a>
                  .
                </p>
              </div>

              <div className="relative flex justify-center lg:-mt-24 lg:justify-end">
                <ExerciseSheet equation={HERO_EQUATION} />
                <TapePreview
                  keys={SUM_KEYS}
                  className="absolute -bottom-12 left-0 hidden max-w-48 rotate-[5deg] sm:block lg:-left-6"
                />
              </div>
            </div>
          </div>
        </section>

        {/* The twelve chapter titles, running along the desk edge. A picture of
            the course's reach rather than its index, so it is hidden from
            assistive technology; the real list is on the course page. */}
        <div
          aria-hidden="true"
          className="marquee overflow-hidden border-y border-desk-edge/70 bg-desk-deep py-6"
        >
          <div className="marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 list-none items-center p-0">
                {CHAPTERS.map((chapter) => (
                  <li
                    key={chapter.slug}
                    className="flex items-center whitespace-nowrap px-6 font-sans text-[1.6rem] font-bold tracking-[-0.01em] text-tape/30 sm:text-[2.2rem]"
                  >
                    <span className="mr-6 font-mono text-[1rem] text-key-act/80">
                      {String(chapter.number).padStart(2, "0")}
                    </span>
                    {chapter.title}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* The questions people arrive with, each linked to the page that answers
            it. Works as an index for a visitor who does not know the course's
            vocabulary, and as plain links a search engine can follow. */}
        <section
          id="questions"
          aria-labelledby="questions-heading"
          className={`${SECTION} scroll-mt-4 bg-desk-deep`}
        >
          <div className="mx-auto w-full max-w-6xl [container-type:inline-size]">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
              <h2
                id="questions-heading"
                className="font-sans text-[clamp(2rem,1.4rem+2.4cqi,3.4rem)] font-bold leading-[1.08] tracking-[-0.02em] text-tape"
              >
                Start with your question
              </h2>
              <p className="font-sans text-[1.05rem] leading-[1.75rem] text-tape/70">
                Each question leads to the page on this site that answers it. Nothing here is a
                quiz and nothing is saved.
              </p>
            </div>

            <ul className="mt-14 grid list-none gap-4 p-0 md:grid-cols-2">
              {QUESTIONS.map((item) => (
                <li key={item.question}>
                  <Link
                    to={item.to}
                    className="group flex h-full flex-col border border-desk-edge/70 p-6 no-underline transition-colors duration-150 hover:border-tape/60 hover:bg-desk-edge/20"
                  >
                    <span className="font-sans text-[1.2rem] font-bold leading-[1.6rem] text-tape underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-150 group-hover:decoration-key-act">
                      {item.question}
                    </span>
                    <span className="mt-3 font-mono text-[0.78rem] uppercase tracking-[0.12em] text-key-act">
                      {item.source}
                    </span>
                    <span className="mt-1 font-sans text-[0.98rem] leading-[1.6rem] text-tape/70">
                      {item.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Interest. What is here, as one grid: the course, and the three
            instruments that sit beside it. */}
        <section aria-labelledby="whats-here" className={`${SECTION} on-grid bg-pa-ground`}>
          <div className="mx-auto w-full max-w-6xl [container-type:inline-size]">
            <h2
              id="whats-here"
              className="max-w-5xl font-sans text-[clamp(2rem,1.4rem+2.4cqi,3.4rem)] font-bold leading-[1.12] tracking-[-0.02em] text-pa-ink"
            >
              A course <Swatch surface="grid" /> and three tools <Swatch surface="tape" /> that keep
              their working in view <Swatch surface="lcd" />
            </h2>

            <ul className="mt-14 grid list-none grid-flow-dense auto-rows-[minmax(15rem,auto)] gap-4 p-0 md:grid-cols-2 lg:grid-cols-4">
              {/* The course: two columns by two rows. */}
              <li className="md:col-span-2 md:row-span-2">
                <Link
                  to="/pre-algebra"
                  className="group grid-paper relative flex h-full flex-col overflow-hidden border border-pa-paper-edge bg-pa-paper p-7 no-underline shadow-[0_2px_14px_-6px_rgba(27,42,65,0.35)] transition-[border-color,box-shadow] duration-300 hover:border-pa-biro hover:shadow-[0_18px_40px_-20px_rgba(27,42,65,0.6)] sm:p-9"
                >
                  <h3 className="font-sans text-[1.6rem] font-bold text-pa-ink">Pre-algebra course</h3>
                  <p className="mt-3 max-w-md font-sans text-[1.02rem] leading-[1.7rem] text-pa-ink-soft">
                    Written for a student meeting each topic for the first time. Every chapter
                    states the rule, shows the mechanism behind it, then works examples through
                    line by line.
                  </p>

                  <div className="mt-auto pt-10">
                    <p className="font-mono text-[clamp(5rem,4rem+4cqi,8.5rem)] leading-none text-pa-biro transition-transform duration-700 ease-out group-hover:scale-105 origin-bottom-left">
                      {CHAPTERS.length}
                    </p>
                    <p className="mt-2 font-sans text-[0.8rem] font-bold uppercase tracking-[0.2em] text-pa-ink-soft">
                      chapters, free
                    </p>
                    <ol className="mt-6 grid list-none gap-2 p-0 font-sans text-[0.98rem] text-pa-ink sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4">
                      <li>
                        <span className="font-mono text-pa-biro">01</span> {FIRST.title}
                      </li>
                      <li
                        aria-hidden="true"
                        className="hidden h-px bg-[repeating-linear-gradient(90deg,var(--color-pa-ink-soft)_0_4px,transparent_4px_10px)] opacity-50 sm:block"
                      />
                      <li>
                        <span className="font-mono text-pa-biro">
                          {String(LAST.number).padStart(2, "0")}
                        </span>{" "}
                        {LAST.title}
                      </li>
                    </ol>
                  </div>
                </Link>
              </li>

              {/* The adding machine: two columns by one row. */}
              <li className="md:col-span-2">
                <BentoTool
                  path="/tools/calculator"
                  className="bg-desk"
                  picture={<TapePreview keys="125 + 48 - 19 =" className="max-w-48" />}
                  wide
                />
              </li>

              {/* The scientific calculator and the solver: one cell each. With
                  the course's four cells and the adding machine's two, that is
                  eight cells: two full rows of four, or four full rows of two. */}
              <li>
                <BentoTool
                  path="/tools/scientific"
                  className="bg-sci-case"
                  dark
                  picture={<LcdPreview expression="√(3²+4²)" className="max-w-52" />}
                />
              </li>
              <li>
                <BentoTool
                  path="/pre-algebra/solver"
                  className="bg-pa-board"
                  dark
                  picture={<BoardPreview equation="4x = 18" maxSteps={1} className="max-w-52" />}
                />
              </li>
            </ul>
          </div>
        </section>

        {/* Desire. How a chapter teaches, with the heading held in place while
            the four parts of a chapter pass beside it. */}
        <section
          aria-labelledby="how-a-chapter-teaches"
          className={`${SECTION} bg-desk-deep`}
        >
          <div className="mx-auto grid w-full max-w-6xl [container-type:inline-size] gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <div data-pin className="self-start">
              <h2
                id="how-a-chapter-teaches"
                className="font-sans text-[clamp(2rem,1.4rem+2.4cqi,3.4rem)] font-bold leading-[1.08] tracking-[-0.02em] text-tape"
              >
                How a chapter teaches
              </h2>
              <p className="mt-5 max-w-md font-sans text-[1.08rem] leading-[1.8rem] text-tape/70">
                Every chapter page is laid out the same way, so the layout is familiar by the
                second one and the attention can go to the math.
              </p>
              <Link to={FIRST_CHAPTER_PATH} className={`${BUTTON_SECONDARY} mt-8`}>
                Read chapter 1
              </Link>
            </div>

            <ol className="flex list-none flex-col gap-20 p-0 md:gap-28">
              <TeachingStep
                title="The reason comes with the rule"
                body="A rule on its own is something to memorise. A rule with its reason is something you can rebuild when you forget it, so each topic opens by saying what happens and why."
              >
                <figure className="on-grid w-full bg-pa-note px-6 py-6 text-pa-ink shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]">
                  <figcaption className="font-sans text-[0.78rem] font-bold uppercase tracking-[0.18em] text-pa-ink-soft">
                    From chapter {ORDER_CHAPTER.number},{" "}
                    <Link to={`/pre-algebra/${ORDER_CHAPTER.slug}`} className="text-pa-biro underline underline-offset-4">
                      {ORDER_CHAPTER.title.toLowerCase()}
                    </Link>
                  </figcaption>
                  <blockquote className="mt-3 font-sans text-[1.15rem] leading-[1.8rem]">
                    {ORDER_CHAPTER.topic?.summary}
                  </blockquote>
                </figure>
              </TeachingStep>

              {INTEGERS_EXAMPLE && (
                <TeachingStep
                  title="Examples are worked one line at a time"
                  body="Where a chapter has worked examples, each is written the way it would be on paper: the question, each move with what it does, then the answer."
                >
                  <figure className="on-grid grid-paper w-full border border-pa-paper-edge bg-pa-paper px-6 py-6 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]">
                    <figcaption className="font-sans text-[0.78rem] font-bold uppercase tracking-[0.18em] text-pa-ink-soft">
                      From chapter {INTEGERS_CHAPTER.number},{" "}
                      <Link to={`/pre-algebra/${INTEGERS_CHAPTER.slug}`} className="text-pa-biro underline underline-offset-4">
                        {INTEGERS_CHAPTER.title.toLowerCase()}
                      </Link>
                    </figcaption>
                    <p className="mt-3 font-sans text-[1.1rem] font-bold text-pa-ink">
                      {INTEGERS_EXAMPLE.question}
                    </p>
                    <ol className="mt-3 list-none space-y-1.5 p-0 font-sans text-[1.02rem] leading-[1.6rem] text-pa-biro">
                      {INTEGERS_EXAMPLE.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                    <p className="mt-4 inline-block rounded-full border-2 border-pa-mark px-3 py-0.5 font-mono text-[1.2rem] text-pa-mark">
                      {INTEGERS_EXAMPLE.answer}
                    </p>
                  </figure>
                </TeachingStep>
              )}

              <TeachingStep
                title="The solver checks your working, not only your answer"
                body="Type an equation into the solver and it writes out each move it makes to both sides. Lay that beside your own working and the first line that differs is where to look."
              >
                <BoardPreview equation={BOARD_EQUATION} />
              </TeachingStep>

              <TeachingStep
                title="Each chapter leads into the next"
                body="The chapters run in the order a class takes them, and the foot of each page links to the previous and the next, so a chapter can be read on its own or as part of the whole."
              >
                <ol className="flex w-full list-none flex-col gap-2 p-0">
                  {CHAPTERS.slice(6, 9).map((chapter, index) => (
                    <li key={chapter.slug}>
                      <Link
                        to={`/pre-algebra/${chapter.slug}`}
                        className={[
                          "flex items-baseline gap-5 border px-5 py-4 font-sans no-underline transition-colors duration-150",
                          index === 1
                            ? "border-tape bg-tape text-ink"
                            : "border-desk-edge text-tape/60 hover:border-tape/60 hover:text-tape",
                        ].join(" ")}
                      >
                        <span className="font-mono text-[0.95rem] text-key-act">
                          {String(chapter.number).padStart(2, "0")}
                        </span>
                        <span className="text-[1.1rem] font-bold">{chapter.title}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </TeachingStep>
            </ol>
          </div>
        </section>

        {/* The three instruments, put to the same sum. */}
        <section
          aria-labelledby="same-keys"
          className={`${SECTION} border-t border-desk-edge/70 bg-desk-deep`}
        >
          <div className="mx-auto w-full max-w-6xl [container-type:inline-size]">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
              <h2
                id="same-keys"
                className="font-sans text-[clamp(2rem,1.4rem+2.4cqi,3.4rem)] font-bold leading-[1.08] tracking-[-0.02em] text-tape"
              >
                Same keys, different answers, and why
              </h2>
              <p className="font-sans text-[1.05rem] leading-[1.75rem] text-tape/70">
                Key 2 + 3 × 4 into two calculators and you can get two answers. Both are correct
                for the rule each one follows, and knowing the rule is what makes an answer
                trustworthy.
              </p>
            </div>
            <CompareAccordion />
          </div>
        </section>

        {/* Who the site is for and how far it reaches. Levels that do not exist
            are named so a visitor knows the route, and marked in words (not
            only by style) so nobody takes them for pages they can open. */}
        <section
          aria-labelledby="route"
          className={`${SECTION} border-t border-desk-edge/70 bg-desk-deep`}
        >
          <div className="mx-auto grid w-full max-w-6xl [container-type:inline-size] gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
            <div>
              <h2
                id="route"
                className="font-sans text-[clamp(2rem,1.4rem+2.4cqi,3.4rem)] font-bold leading-[1.08] tracking-[-0.02em] text-tape"
              >
                The route through math
              </h2>
              <p className="mt-5 max-w-xl font-sans text-[1.08rem] leading-[1.8rem] text-tape/70">
                Math is learned in a sequence, and each level uses the one before it. This is the
                route the site is built to follow. Only pre-algebra is open today. The other levels
                are planned and have no pages yet.
              </p>
              <p className="mt-5 max-w-xl font-sans text-[1.08rem] leading-[1.8rem] text-tape/70">
                MathPencil is for learners of every age: a child meeting a topic for the first
                time, an adult coming back to math after years away. There are no accounts and no
                email collection. The site is free, and advertising pays for it.
              </p>
            </div>

            <ol className="flex list-none flex-col gap-2 p-0">
              {LEVELS.map((level, index) => (
                <li key={level.name}>
                  {level.to ? (
                    <Link
                      to={level.to}
                      className="flex items-baseline gap-5 border border-tape bg-tape px-5 py-4 font-sans text-ink no-underline transition-[filter] duration-150 hover:brightness-95"
                    >
                      <span className="font-mono text-[0.95rem] text-key-act-deep">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4">
                        <span className="text-[1.1rem] font-bold">{level.name}</span>
                        <span className="text-[0.9rem] font-semibold">
                          Open now, {CHAPTERS.length} chapters
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-baseline gap-5 border border-dashed border-desk-edge px-5 py-4 font-sans text-tape/70">
                      <span className="font-mono text-[0.95rem]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4">
                        <span className="text-[1.1rem] font-bold">{level.name}</span>
                        <span className="text-[0.9rem]">Planned. Not available yet.</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Action. */}
        <section aria-labelledby="start" className={`${SECTION} on-paper bg-tape text-ink`}>
          <div className="mx-auto w-full max-w-6xl [container-type:inline-size]">
            <h2
              id="start"
              className="max-w-5xl font-sans text-[clamp(2.4rem,1.4rem+4cqi,5rem)] font-bold leading-[1.02] tracking-[-0.03em]"
            >
              Start with the introduction.
            </h2>
            <p className="mt-6 max-w-2xl font-sans text-[1.15rem] leading-[1.85rem] text-ink-soft">
              {FIRST.blurb} No account, no sign-up, and nothing to pay.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to={FIRST_CHAPTER_PATH} className={BUTTON_PRIMARY}>
                Start the course
              </Link>
              <Link
                to="/pre-algebra"
                className="px-2 py-3 font-sans text-[1rem] font-bold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                See all {CHAPTERS.length} chapters
              </Link>
            </div>
          </div>
        </section>
      </main>

      <ScrollToTop />
      <SiteFooter />
    </div>
  );
}

/** One part of how a chapter teaches: what it is on the left, a sample on the right. */
function TeachingStep({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid gap-6">
      <div data-scale-fade className="origin-center">
        {children}
      </div>
      <div>
        <h3 className="font-sans text-[1.4rem] font-bold text-tape">{title}</h3>
        <p className="mt-2 max-w-xl font-sans text-[1.02rem] leading-[1.7rem] text-tape/70">{body}</p>
      </div>
    </li>
  );
}

/** A tool's cell in the grid: its picture above, its name and summary below. */
function BentoTool({
  path,
  picture,
  className,
  dark = false,
  wide = false,
}: {
  path: string;
  picture: React.ReactNode;
  className: string;
  dark?: boolean;
  wide?: boolean;
}) {
  const tool = TOOLS.find((candidate) => candidate.path === path);
  if (!tool) throw new Error(`No tool at ${path}`);

  return (
    <Link
      to={tool.path}
      className={`group flex h-full flex-col overflow-hidden border border-pa-paper-edge no-underline transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgba(27,42,65,0.7)] ${className} ${
        wide ? "sm:flex-row" : ""
      }`}
    >
      <div
        className={`flex items-center justify-center overflow-hidden px-6 pt-7 ${
          wide ? "sm:w-1/2 sm:py-7" : ""
        }`}
      >
        <div className="flex w-full justify-center transition-transform duration-700 ease-out group-hover:scale-105">
          {picture}
        </div>
      </div>
      <div className={`flex flex-1 flex-col p-6 ${wide ? "sm:justify-center" : ""}`}>
        <h3 className={`font-sans text-[1.2rem] font-bold ${dark ? "text-tape" : "text-ink"}`}>
          {tool.name}
        </h3>
        <p
          className={`mt-1.5 font-sans text-[0.95rem] leading-[1.5rem] ${
            dark ? "text-tape/70" : "text-ink-soft"
          }`}
        >
          {wide ? tool.summary : tool.rule}
        </p>
      </div>
    </Link>
  );
}
