import { useEffect, useState } from "react";
import type { PageSection } from "../data/pre-algebra";

/**
 * Which section of a long page the reader is currently in.
 *
 * Returns the index into `sections`. Used by the contents lists to mark where
 * you are and cross off what you have read past.
 *
 * The band is the top third of the viewport: a section counts as "where you
 * are" once it has reached reading height, not when it first appears at the
 * bottom of the screen.
 */
export function useSectionSpy(sections: PageSection[]): number {
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

  return currentIndex;
}
