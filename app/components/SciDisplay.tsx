import { useEffect, useRef } from "react";
import { formatNumber } from "../lib/format";
import type { SciLine, SciState } from "../lib/sci-engine";

export interface SciDisplayProps {
  state: SciState;
  /** The running value of the expression on screen, before `=` is pressed. */
  preview: number | null;
}

/** The size the answer prints at: large for an everyday figure, smaller as it grows. */
function answerSize(value: string): string {
  // Measured in `cqi`, a share of the window's own width, so a browser text-size
  // setting grows the window and the figure inside it together.
  if (value.length <= 10) return "clamp(2.1rem, 12cqi, 3.4rem)";
  if (value.length <= 16) return "clamp(1.6rem, 9cqi, 2.6rem)";
  return "clamp(1.2rem, 6.5cqi, 1.9rem)";
}

/** One struck calculation, kept in the window above the live expression. */
function LoggedLine({ line }: { line: SciLine }) {
  return (
    <div className="flex items-baseline justify-between gap-4 font-mono text-[0.78rem] leading-[1.3rem] text-sci-lcd-dim">
      <span className="min-w-0 flex-1 truncate">{line.expression}</span>
      <span className="shrink-0 tabular-nums">= {line.answer}</span>
    </div>
  );
}

/**
 * The instrument's window.
 *
 * A liquid-crystal panel rather than a paper tape: the expression is visible
 * while it is being built, the running value sits under it in the dim ink a
 * crystal uses for anything not yet committed, and `=` strikes the answer into
 * the large line. What has already been struck stays above, because the reason
 * to reach for this instrument over a phone is usually a chain of steps.
 *
 * The indicator strip along the top carries the three things that change what a
 * key press means — the angle mode, whether shift is latched, and whether
 * anything is in memory — for the same reason a real instrument prints them
 * there: a figure is not an answer until you know which mode produced it.
 */
export function SciDisplay({ state, preview }: SciDisplayProps) {
  const logRef = useRef<HTMLDivElement>(null);

  // The newest struck line should be the one in view, the way paper advancing
  // out of the adding machine keeps the last entry at the platen.
  useEffect(() => {
    const element = logRef.current;
    if (element !== null) element.scrollTop = element.scrollHeight;
  }, [state.log.length]);

  const answer = state.struck ?? (preview !== null ? formatNumber(preview) : "0");

  // The lines below already show the calculation that was just struck, so it is
  // not listed above as well — it joins the list on the next entry, the way a
  // line of tape only scrolls up once the paper advances.
  const listed =
    state.struck !== null && state.log.length > 0 ? state.log.slice(0, -1) : state.log;

  return (
    <div className="on-lcd @container bg-sci-lcd px-4 pb-3 pt-2 sm:px-5">
      <div className="flex items-center gap-3 font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-sci-lcd-dim">
        <span aria-live="polite">{state.angleMode === "deg" ? "DEG" : "RAD"}</span>
        <span className={state.shift ? "text-sci-lcd-ink" : "opacity-25"} aria-live="polite">
          Shift
        </span>
        <span className={state.memory !== 0 ? "text-sci-lcd-ink" : "opacity-25"}>M</span>
        <span className="ml-auto font-mono tracking-[0.1em] opacity-45">MathPencil</span>
      </div>

      {listed.length > 0 && (
        <div
          ref={logRef}
          role="log"
          aria-label="Previous calculations"
          className="mt-1.5 max-h-20 overflow-y-auto border-b border-sci-lcd-deep pb-1.5 sm:max-h-28"
        >
          {listed.map((line) => (
            <LoggedLine key={line.id} line={line} />
          ))}
        </div>
      )}

      {/* The expression as it stands. It wraps rather than scrolls sideways,
          because a formula you cannot see the start of is not readable. */}
      <div className="mt-2 min-h-6 text-right font-mono text-[0.95rem] leading-[1.5rem] break-words text-sci-lcd-ink sm:text-[1rem]">
        {/* Nothing entered prints nothing here: the large line below is already
            showing the nought, and a crystal that says it twice reads as two
            figures rather than one machine at rest. */}
        {state.entry === "" ? null : (
          <>
            {state.entry}
            {state.struck === null && state.error === null && (
              <span aria-hidden="true" className="caret ml-px inline-block align-middle">
                ▏
              </span>
            )}
          </>
        )}
      </div>

      {state.error !== null ? (
        <p className="mt-1 text-right font-sans text-[0.9rem] font-semibold text-sci-fault">
          {state.error}
        </p>
      ) : (
        <div className="mt-0.5 flex items-baseline justify-end gap-2">
          {state.struck === null && preview !== null && state.entry !== "" && (
            <span
              aria-hidden="true"
              className="font-mono text-[0.85rem] font-semibold text-sci-lcd-dim"
            >
              =
            </span>
          )}
          <output
            key={state.strikeCount}
            aria-live="polite"
            style={{ fontSize: answerSize(answer) }}
            className={[
              "strike block min-w-0 font-mono font-medium leading-[1.1] tabular-nums",
              // Dim until it is struck: on a liquid-crystal display the running
              // value and the committed answer must not look like the same claim.
              state.struck !== null ? "text-sci-lcd-ink" : "text-sci-lcd-dim",
            ].join(" ")}
          >
            {answer}
          </output>
        </div>
      )}
    </div>
  );
}
