/**
 * A sheet of paper lying on the desk.
 *
 * The desk carries no content, so every block of prose on the site — the notes
 * under the machine, the privacy page, the terms — sits on one of these. It is
 * the same cream ground, the same square shoulders and the same soft shadow the
 * machine and the docket already lie in, so a page of reading matter reads as
 * more paper on the same desk rather than as a different kind of page.
 */
export interface PaperSheetProps {
  children: React.ReactNode;
  /** Set when the sheet is a landmark in its own right, e.g. a page's article. */
  as?: "section" | "article";
  /** Labels the section for a screen reader when the heading is not inside it. */
  ariaLabelledBy?: string;
  className?: string;
}

export function PaperSheet({
  children,
  as: Element = "section",
  ariaLabelledBy,
  className = "",
}: PaperSheetProps) {
  return (
    <Element
      aria-labelledby={ariaLabelledBy}
      className={[
        "on-paper w-full max-w-136 bg-tape px-5 py-6 shadow-[0_18px_44px_-12px_rgba(0,0,0,0.7)] sm:px-6 sm:py-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Element>
  );
}
