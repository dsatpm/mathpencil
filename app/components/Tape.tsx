import type { TapeLine } from "../lib/calc-engine";

export interface TapeProps {
  lines: TapeLine[];
  /** The live value, printed on the bottom line where the platen is. */
  current: string;
  /** Marks the bottom line as a struck total rather than an entry in progress. */
  isTotal: boolean;
  /** Increments on every total, so the bottom line restrikes. */
  strikeCount: number;
  error: string | null;
}

/** The serrated tear-off edge at the top of the roll. */
function TearEdge() {
  return (
    <svg
      viewBox="0 0 100 4"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block h-1.75 w-full text-tape"
    >
      <path
        d="M0 4 L0 1.6 L2.5 4 L5 1.6 L7.5 4 L10 1.6 L12.5 4 L15 1.6 L17.5 4 L20 1.6 L22.5 4 L25 1.6 L27.5 4 L30 1.6 L32.5 4 L35 1.6 L37.5 4 L40 1.6 L42.5 4 L45 1.6 L47.5 4 L50 1.6 L52.5 4 L55 1.6 L57.5 4 L60 1.6 L62.5 4 L65 1.6 L67.5 4 L70 1.6 L72.5 4 L75 1.6 L77.5 4 L80 1.6 L82.5 4 L85 1.6 L87.5 4 L90 1.6 L92.5 4 L95 1.6 L97.5 4 L100 1.6 L100 4 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The size the platen line prints at.
 *
 * The answer is the page, so it is set as large as the paper allows — but a
 * long value must shrink rather than be clipped, because half an answer is
 * worse than no answer. Three steps, chosen so an everyday figure gets the
 * largest one.
 */
function platenSize(value: string): string {
  // Measured in `cqi` — a share of the paper's own width — rather than `vw`.
  // The paper is sized in `rem`, so a browser text-size setting grows the
  // paper and this figure together, which a viewport unit would not do.
  if (value.length <= 9) return "clamp(2.6rem, 15cqi, 4.5rem)";
  if (value.length <= 13) return "clamp(2rem, 11cqi, 3.4rem)";
  return "clamp(1.5rem, 8cqi, 2.4rem)";
}

/**
 * The paper tape.
 *
 * Entries print at the platen and push upward, so the newest line sits at the
 * bottom and the oldest scrolls off the top — the direction paper actually
 * travels through a printing adding machine. The bottom line never scrolls: it
 * is the live value, and after a total it is struck in ribbon red under a
 * double rule.
 */
export function Tape({ lines, current, isTotal, strikeCount, error }: TapeProps) {
  // The platen line below already shows the freshly struck total, so it is not
  // also printed into the history above — it scrolls up there on the next entry.
  const history = isTotal && lines.at(-1)?.mark === "T" ? lines.slice(0, -1) : lines;

  return (
    <div className="on-paper relative @container">
      <TearEdge />

      <div className="bg-tape px-4 pb-2 pt-2 sm:px-5">
        <div
          className="flex max-h-36 min-h-32 flex-col-reverse overflow-y-auto sm:max-h-48"
          role="log"
          aria-label="Tape"
        >
          {[...history].reverse().map((line) => {
            // The ribbon is two-colour: black for entries, red for totals and
            // for any negative value. A total that has scrolled up into the
            // history stays red, exactly as it was struck.
            const inRibbon = line.tone !== "ink" || line.text.startsWith("-");

            return (
              <div
                key={line.id}
                className={[
                  "advance flex items-baseline justify-end gap-3 font-mono text-[0.9rem] leading-[1.35rem] sm:text-[0.95rem]",
                  inRibbon ? "text-ribbon" : "text-ink",
                  line.tone === "rule"
                    ? "mt-1 border-t-[3px] border-double border-ribbon pt-1"
                    : "",
                ].join(" ")}
              >
                <span className="tabular-nums">{line.text}</span>
                <span
                  className={[
                    "w-7 shrink-0 text-right text-[0.72rem] font-semibold",
                    inRibbon ? "" : "text-ink-soft",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {line.mark}
                </span>
              </div>
            );
          })}
        </div>

        {/* The platen line: always visible, never scrolls. This is the answer. */}
        <div
          className={[
            "mt-2 flex items-baseline justify-end gap-3 pt-2",
            isTotal
              ? "border-t-4 border-double border-ribbon"
              : history.length > 0
                ? "border-t border-tape-shade"
                : "",
          ].join(" ")}
        >
          <output
            key={strikeCount}
            aria-live="polite"
            style={{ fontSize: platenSize(current) }}
            className={[
              "strike block min-w-0 font-mono font-medium tabular-nums",
              "leading-[1.08]",
              error !== null || isTotal || current.startsWith("-")
                ? "text-ribbon"
                : "text-ink",
            ].join(" ")}
          >
            {current}
          </output>
          <span
            aria-hidden="true"
            className={[
              "w-7 shrink-0 self-end pb-2 text-right font-mono text-[0.8rem] font-semibold",
              isTotal ? "text-ribbon" : "text-ink-soft",
            ].join(" ")}
          >
            {isTotal ? "T" : ""}
          </span>
        </div>

        {error !== null && (
          <p className="mt-1 text-right font-sans text-[0.85rem] font-semibold text-ribbon">
            {error} Press AC to start again.
          </p>
        )}
      </div>
    </div>
  );
}
