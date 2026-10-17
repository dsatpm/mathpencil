import { Link } from "react-router";
import { chapterNeighbours } from "../data/pre-algebra";

export interface ChapterPagerProps {
  /** The slug of the chapter being read. */
  slug: string;
}

/**
 * Previous and next, at the foot of a chapter.
 *
 * The course is meant to be read in order, so the page ends by offering the
 * next one rather than leaving the reader to go back up to the contents. The
 * first chapter has nothing before it and the last has nothing after it; each
 * side is simply left out, and the remaining one keeps its side of the row.
 */
export function ChapterPager({ slug }: ChapterPagerProps) {
  const { prev, next } = chapterNeighbours(slug);

  if (prev === undefined && next === undefined) return null;

  const card =
    "flex flex-col gap-1 border border-pa-paper-edge bg-pa-paper px-4 py-3.5 no-underline transition-[border-color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:border-pa-biro hover:shadow-[0_8px_20px_-10px_rgba(27,42,65,0.5)] focus-visible:-translate-y-0.5 focus-visible:border-pa-biro focus-visible:shadow-[0_8px_20px_-10px_rgba(27,42,65,0.5)]";
  const label =
    "font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-pa-biro";
  const title = "font-sans text-[1rem] font-bold leading-[1.35rem] text-pa-ink";

  return (
    <nav aria-label="Chapters" className="grid gap-3 sm:grid-cols-2">
      {prev !== undefined ? (
        <Link to={`/pre-algebra/${prev.slug}`} className={card}>
          <span className={label}>Previous</span>
          <span className={title}>
            {String(prev.number).padStart(2, "0")}. {prev.title}
          </span>
        </Link>
      ) : (
        // Holds the left column so a lone "next" stays on the right, where the
        // reader is already looking.
        <div aria-hidden="true" className="hidden sm:block" />
      )}

      {next !== undefined && (
        <Link to={`/pre-algebra/${next.slug}`} className={`${card} sm:text-right`}>
          <span className={label}>Next</span>
          <span className={title}>
            {String(next.number).padStart(2, "0")}. {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
