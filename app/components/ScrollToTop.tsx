import { useEffect, useState } from "react";

export type ScrollToTopTone = "desk" | "grid";

export interface ScrollToTopProps {
  /**
   * Which page it is standing on. The button belongs to the page it sits over,
   * so it takes that page's ink rather than importing one colour everywhere.
   */
  tone?: ScrollToTopTone;
}

/** The arrow, drawn rather than borrowed from a font's glyph table. */
function UpArrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <path
        d="M8 14 L8 3 M3 8 L8 2.6 L13 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TONE_CLASSES: Record<ScrollToTopTone, string> = {
  desk: "bg-key-act text-white shadow-[0_3px_0_0_var(--color-key-act-deep),0_8px_18px_-6px_rgba(0,0,0,0.6)] active:shadow-[0_0_0_0_var(--color-key-act-deep)]",
  grid: "bg-pa-board text-pa-chalk shadow-[0_3px_0_0_var(--color-pa-board-edge),0_8px_18px_-6px_rgba(27,42,65,0.5)] active:shadow-[0_0_0_0_var(--color-pa-board-edge)]",
};

/**
 * The button back to the top of a long page.
 *
 * It only appears once there is somewhere to go back to, which on these pages
 * is about a screen and a half of scrolling. Before that it would be a control
 * that does nothing, sitting over the part of the page people actually came
 * for.
 *
 * The scroll itself is smooth unless the visitor has asked for less motion, in
 * which case the page simply arrives at the top.
 */
export function ScrollToTop({ tone = "desk" }: ScrollToTopProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShown(window.scrollY > window.innerHeight * 1.5);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function backToTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

    // Scrolling moves the page but not the keyboard, so focus is sent back to
    // the top as well. Without this a keyboard visitor lands at the top of the
    // page with their place still at the bottom of it.
    const heading = document.querySelector("h1");
    if (heading instanceof HTMLElement) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  if (!shown) return null;

  return (
    <button
      type="button"
      onClick={backToTop}
      className={[
        "fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-sm px-3.5 py-2.5",
        "font-sans text-[0.72rem] font-bold uppercase tracking-[0.16em]",
        "transition-[transform,box-shadow] duration-90 ease-linear hover:brightness-110 active:translate-y-[3px]",
        TONE_CLASSES[tone],
      ].join(" ")}
    >
      <UpArrow />
      <span className="hidden sm:inline">Top</span>
      <span className="sr-only sm:hidden">Back to the top</span>
    </button>
  );
}
