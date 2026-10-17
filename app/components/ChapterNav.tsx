import { Link } from "react-router";
import { CHAPTERS, type Chapter } from "../data/pre-algebra";
import { useSectionSpy } from "../hooks/useSectionSpy";

export interface ChapterNavProps {
  /** The chapter being read. Its entry is marked, and its sections are listed. */
  current: Chapter;
}

/**
 * The board down the left gutter of a chapter page.
 *
 * Two lists, one above the other, because a reader of a chapter needs two
 * different things: where this chapter sits in the course, and what is on the
 * page in front of them. Chapters already read are struck off in chalk the way
 * a teacher crosses a point off the board, and so are sections already scrolled
 * past, so the same mark means the same thing in both lists.
 *
 * With no JavaScript both lists are still plain links that navigate. What stops
 * is the scoring, not the moving.
 */
export function ChapterNav({ current }: ChapterNavProps) {
  const currentSectionIndex = useSectionSpy(current.sections);

  return (
    <aside aria-labelledby="chapter-nav" className="on-board lg:sticky lg:top-6 lg:self-start">
      <nav className="border-4 border-pa-board-edge bg-pa-board px-4 py-4 shadow-[0_10px_28px_-10px_rgba(27,42,65,0.55)]">
        <h2
          id="chapter-nav"
          className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.22em] text-pa-chalk-soft"
        >
          The course
        </h2>

        <ol className="mt-3 list-none space-y-0.5 p-0">
          {CHAPTERS.map((chapter) => {
            const isCurrent = chapter.slug === current.slug;
            const isStruck = chapter.number < current.number;

            return (
              <li key={chapter.slug}>
                <Link
                  to={`/pre-algebra/${chapter.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={[
                    "flex gap-2.5 py-1.5 font-sans text-[0.85rem] leading-[1.2rem] no-underline",
                    isCurrent
                      ? "font-semibold text-pa-chalk-mark"
                      : isStruck
                        ? "text-pa-chalk-soft/60 hover:text-pa-chalk"
                        : "text-pa-chalk-soft hover:text-pa-chalk",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.72rem] tabular-nums opacity-70"
                  >
                    {String(chapter.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="chalk-strike" data-struck={isStruck}>
                      {chapter.title}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        {/* The chapter's own sections, below a chalk rule. Only worth printing
            when the chapter has more than one of them. */}
        {current.sections.length > 1 && (
          <>
            <hr className="my-4 border-0 border-t border-pa-chalk-soft/25" />

            <h2 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.22em] text-pa-chalk-soft">
              On this page
            </h2>

            <ol className="mt-3 list-none space-y-0.5 p-0">
              {current.sections.map((section, index) => {
                const isCurrent = index === currentSectionIndex;
                const isStruck = index < currentSectionIndex;

                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={isCurrent ? "location" : undefined}
                      className={[
                        "flex gap-2.5 py-1.5 font-sans text-[0.85rem] leading-[1.2rem] no-underline",
                        isCurrent
                          ? "font-semibold text-pa-chalk-mark"
                          : isStruck
                            ? "text-pa-chalk-soft/60"
                            : "text-pa-chalk-soft hover:text-pa-chalk",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-[0.72rem] tabular-nums opacity-70"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
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
          </>
        )}
      </nav>
    </aside>
  );
}
