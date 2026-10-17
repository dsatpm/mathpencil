/**
 * The class strings the course pages share.
 *
 * The hub, the twelve chapters and the solver page are one surface: paper on a
 * grid, ink in two weights, the biro for anything that points somewhere else.
 * Holding the strings here means a change to the paper happens once rather
 * than fourteen times, and the pages cannot drift apart from each other.
 */

/** A sheet of paper. Every section of a course page sits on one. */
export const SHEET =
  "border border-pa-paper-edge bg-pa-paper px-5 py-6 shadow-[0_2px_14px_-6px_rgba(27,42,65,0.35)] sm:px-7 sm:py-8";

/** A section heading. */
export const H2 = "font-sans text-[1.5rem] font-bold leading-tight text-pa-ink sm:text-[1.75rem]";

/** A heading below a section heading, set small and spaced out in biro. */
export const H3 = "font-sans text-[0.75rem] font-bold uppercase tracking-[0.2em] text-pa-biro";

/** Body copy. */
export const BODY = "mt-3 font-sans text-[1.02rem] leading-[1.7rem] text-pa-ink-soft";

/** A link in body copy. Underlined, because a colour alone is not a link. */
export const LINK =
  "text-pa-biro underline decoration-pa-biro/35 underline-offset-4 hover:decoration-pa-biro";

/** The eyebrow above an `h1`. */
export const EYEBROW =
  "font-sans text-[0.72rem] font-bold uppercase tracking-[0.22em] text-pa-biro";

/** A page title. */
export const H1 =
  "mt-2 font-sans text-[2rem] font-bold leading-[1.15] text-pa-ink sm:text-[2.6rem]";

/** The masthead block a course page opens with. */
export const MASTHEAD =
  "grid-paper border border-pa-paper-edge bg-pa-paper px-5 py-7 shadow-[0_2px_14px_-6px_rgba(27,42,65,0.35)] sm:px-8 sm:py-9";
