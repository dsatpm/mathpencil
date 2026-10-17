import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

/** How far below the top of the screen a pinned heading holds, in pixels. */
const PIN_OFFSET = 112;

/**
 * The home page's scroll motion. Two effects, both driven by ScrollTrigger:
 *
 * - `[data-pin]` stays in place while the column after it scrolls past, so the
 *   heading of a long section stays readable next to the part being read. Wide
 *   screens only: on a phone the columns are stacked and there is nothing beside
 *   the heading to scroll past.
 * - `[data-scale-fade]` grows from 0.8 to full size as it scrolls into view and
 *   dims to 0.2 as it leaves, so the picture in focus is the one in the middle
 *   of the screen.
 *
 * Everything sits inside a `prefers-reduced-motion: no-preference` query. With
 * reduced motion requested, or before the script has loaded, every element is in
 * its finished state: the motion is decoration, and none of the content waits on
 * it.
 */
export function useLandingMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        for (const element of gsap.utils.toArray<HTMLElement>("[data-scale-fade]")) {
          gsap
            .timeline({
              scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.6 },
            })
            .fromTo(element, { scale: 0.8 }, { scale: 1, ease: "power2.out", duration: 0.45 })
            .to(element, { duration: 0.25 })
            .to(element, { opacity: 0.2, ease: "power1.in", duration: 0.3 });
        }
      });

      // 64rem is Tailwind's `lg`, where the pinned section becomes two columns.
      media.add("(prefers-reduced-motion: no-preference) and (min-width: 64rem)", () => {
        for (const pinned of gsap.utils.toArray<HTMLElement>("[data-pin]")) {
          // The column that scrolls past is the pinned element's sibling.
          const column = pinned.nextElementSibling;
          if (!(column instanceof HTMLElement)) continue;
          ScrollTrigger.create({
            trigger: pinned,
            pin: true,
            // Holds a little below the top of the screen until the bottom of
            // the column beside it lines up with the bottom of the heading.
            start: `top top+=${PIN_OFFSET}`,
            endTrigger: column,
            end: () => `bottom top+=${PIN_OFFSET + pinned.offsetHeight}`,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
        }
      });

      return () => media.revert();
    },
    { scope },
  );
}
