import { useEffect, useState } from "react";
import type { PageSection } from "../data/pre-algebra";

export interface OnThisPageProps {
  sections: PageSection[];
}

/**
 * The contents list down the left gutter, kept on a board.
 *
 * A lesson is a long page, and a long page needs to say what is on it before
 * you have scrolled through it. This one also says how far through it you are:
 * each section is struck through in chalk once you have read past it, the way a
 * teacher crosses a point off the board as the lesson moves on, and the section
 * you are in is the one still written up in yellow.
 *
 * The list is generated from the same objects the page renders its sections
 * from, so it cannot fall out of step with the headings. Underneath it is a
 * plain list of anchors: with no JavaScript it still navigates, it only stops
 * keeping score.
 */
export function OnThisPage({ sections }: OnThisPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    // Which sections are currently crossing the reading band, kept across
    // callbacks. An observer only reports what *changed*, so deciding from one
    // callback's entries alone leaves the mark on a section that has already
    // scrolled away.
    const crossing = new Set<string>();

    // The band is the top third of the viewport: a section counts as "where you
    // are" once it has reached reading height, not when it first appears at the
    // bottom of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        });

        // Document order, so the topmost section in the band wins.
        const index = sections.findIndex((section) => crossing.has(section.id));
        if (index !== -1) setCurrentIndex(index);
      },
      { rootMargin: "-88px 0px -66% 0px", threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside aria-labelledby="on-this-page" className="on-board lg:sticky lg:top-6 lg:self-start">
      <nav className="border-4 border-pa-board-edge bg-pa-board px-4 py-4 shadow-[0_10px_28px_-10px_rgba(27,42,65,0.55)]">
        <h2
          id="on-this-page"
          className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.22em] text-pa-chalk-soft"
        >
          On this page
        </h2>

        <ol className="mt-3 list-none space-y-0.5 p-0">
          {sections.map((section, index) => {
            const isCurrent = index === currentIndex;
            const isStruck = index < currentIndex;

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isCurrent ? "location" : undefined}
                  className={[
                    "flex gap-2.5 py-1.5 font-sans text-[0.88rem] leading-[1.25rem] no-underline",
                    isCurrent
                      ? "font-semibold text-pa-chalk-mark"
                      : isStruck
                        ? "text-pa-chalk-soft/60"
                        : "text-pa-chalk-soft hover:text-pa-chalk",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.75rem] tabular-nums opacity-70"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Crossed off, not deleted: the line is thin and the words
                      stay legible under it, because a struck section is still
                      somewhere you can go back to. */}
                  {/* The wrapper is the flex item; the struck span stays inline
                      inside it, so a title that wraps is two inline fragments
                      and each one gets its own line of chalk. */}
                  <span className="min-w-0">
                    <span className="chalk-strike" data-struck={isStruck}>
                      {section.title}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
