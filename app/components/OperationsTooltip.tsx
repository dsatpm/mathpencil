import { useEffect, useId, useState } from "react";

interface OperationEntry {
  /** The glyph as it is engraved on the key. */
  key: string;
  meaning: string;
}

/**
 * What every non-obvious key does, in one line each. The memory keys come
 * first because `MC`, `M+`, `M−` and `MR` are the ones nobody is born knowing.
 */
const OPERATIONS: OperationEntry[] = [
  { key: "MC", meaning: "Memory clear — empties the stored number." },
  { key: "M+", meaning: "Memory add — adds what is on screen to the stored number." },
  { key: "M−", meaning: "Memory subtract — takes what is on screen off the stored number." },
  { key: "MR", meaning: "Memory recall — puts the stored number back on screen." },
  { key: "⌫", meaning: "Backspace — rubs out the last digit you keyed." },
  { key: "AC", meaning: "All clear — tears off the tape and starts fresh. Memory survives." },
  { key: "C", meaning: "Clear entry — clears the number on screen, keeps the sum going." },
  { key: "√", meaning: "Square root of the number on screen." },
  { key: "±", meaning: "Change sign — swaps between positive and negative." },
  { key: "%", meaning: "Percent — turns 20 into 0.20, ready to multiply. 25 × 20 % = 5." },
  { key: "=", meaning: "Total — finishes the sum and strikes the answer in red." },
];

/**
 * The legend for the machine face.
 *
 * Opens on hover and on keyboard focus, closes on Escape or when focus leaves,
 * so a mouse is never the only way in. It is `role="tooltip"` rather than a
 * dialog because it holds no controls — only reading matter.
 */
export function OperationsTooltip() {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      // Captured before the machine's own handler sees it, so closing the
      // legend does not also clear the tape.
      event.stopPropagation();
      setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-describedby={open ? panelId : undefined}
        aria-expanded={open}
        // A tap is an open, never a close: on a touch screen the hover that
        // already opened it would otherwise be undone by the same finger.
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-sm font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-tape/70 transition-colors duration-90 hover:text-tape"
      >
        <span
          aria-hidden="true"
          className="flex h-[1.05rem] w-[1.05rem] items-center justify-center rounded-full border border-current text-[0.6rem] leading-none"
        >
          ?
        </span>
        Calculator Operations
      </button>

      {open && (
        <div
          id={panelId}
          role="tooltip"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 max-h-[min(60vh,26rem)] w-[min(24rem,80vw)] overflow-y-auto bg-docket px-4 py-3 text-ink shadow-[0_12px_30px_-8px_rgba(0,0,0,0.75)]"
        >
          <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.2em] text-ink-soft">
            Calculator Operations
          </p>
          <dl className="mt-2 grid grid-cols-[2.6rem_1fr] gap-x-3 gap-y-1.5">
            {OPERATIONS.map((operation) => (
              <div key={operation.key} className="contents">
                <dt className="font-mono text-[0.85rem] font-semibold text-ink">
                  {operation.key}
                </dt>
                <dd className="m-0 font-sans text-[0.82rem] leading-5 text-ink-soft">
                  {operation.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

/** The one-line hints the keys carry in their `title`, keyed by glyph. */
export const OPERATION_HINTS: Record<string, string> = Object.fromEntries(
  OPERATIONS.map((operation) => [operation.key, operation.meaning]),
);
