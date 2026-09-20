import { useId, useState } from "react";
import { parseExpression } from "../lib/parse-expression";
import { formatNumber } from "../lib/format";

export interface DocketProps {
  /** Sends a solved value back into the machine, so it can be operated on further. */
  onSendToMachine: (value: number) => void;
}

interface SolvedSlip {
  expression: string;
  answer: string;
  /** Kept unformatted so sending it to the machine loses no precision. */
  value: number;
}

/**
 * The docket: a second sheet on the desk for a sum that is already written down.
 *
 * The keypad is for arithmetic worked out step by step. This is for arithmetic
 * that arrived whole — copied out of an email, a spreadsheet cell, a message —
 * where re-keying it into a keypad is the wrong job. Unlike the keypad it
 * honours operator precedence and brackets, because written arithmetic does.
 */
export function Docket({ onSendToMachine }: DocketProps) {
  const inputId = useId();
  const [expression, setExpression] = useState("");
  const [solved, setSolved] = useState<SolvedSlip | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  function solve() {
    const result = parseExpression(expression);

    if (!result.ok) {
      setSolved(null);
      setProblem(result.message);
      return;
    }

    setProblem(null);
    setSolved({
      expression: result.normalized,
      answer: formatNumber(result.value),
      value: result.value,
    });
  }

  return (
    <section
      className="on-paper relative @container w-full max-w-136 bg-docket px-5 py-3.5 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.55)] sm:px-6"
      aria-label="Paste a sum"
    >
      <label
        htmlFor={inputId}
        className="block font-sans text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-soft"
      >
        Paste a sum
      </label>

      <div className="mt-2 flex items-stretch gap-3">
        <input
          id={inputId}
          value={expression}
          onChange={(event) => {
            setExpression(event.target.value);
            setProblem(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              solve();
            }
            // The machine's global key handler must not eat what is typed here.
            event.stopPropagation();
          }}
          placeholder="(12 + 5) × 3 ÷ 2"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          aria-describedby={problem !== null ? `${inputId}-problem` : undefined}
          aria-invalid={problem !== null}
          className="min-w-0 flex-1 border-0 border-b-2 border-ink/45 bg-transparent px-0 pb-2 font-mono text-[1.05rem] text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none sm:text-[1.15rem]"
        />
        <button
          type="button"
          onClick={solve}
          className="shrink-0 select-none rounded-sm bg-key-act px-5 font-sans text-[1.2rem] font-bold uppercase tracking-[0.16em] text-white shadow-[0_3px_0_0_var(--color-key-act-deep)] transition-[transform,box-shadow] duration-90 ease-linear hover:brightness-110 active:translate-y-0.75 active:shadow-[0_0_0_0_var(--color-key-act-deep)]"
        >
          Solve
        </button>
      </div>

      <div className="mt-3 empty:mt-0 min-h-10" aria-live="polite">
        {problem !== null && (
          <p
            id={`${inputId}-problem`}
            className="font-sans text-[0.9rem] font-medium text-ribbon"
          >
            {problem}
          </p>
        )}

        {solved !== null && problem === null && (
          <div className="strike flex items-end justify-between gap-4">
            <p className="min-w-0 flex-1 truncate font-mono text-[0.85rem] text-ink-soft">
              {solved.expression}
            </p>
            <div className="flex items-baseline gap-3 border-t-4 border-double border-ribbon pt-1">
              <output className="font-mono text-[clamp(1.6rem,9cqi,2.5rem)] font-medium leading-none tabular-nums text-ribbon">
                {solved.answer}
              </output>
              <span aria-hidden="true" className="font-mono text-[0.75rem] font-semibold text-ribbon">
                T
              </span>
            </div>
          </div>
        )}
      </div>

      {solved !== null && problem === null && (
        <button
          type="button"
          onClick={() => onSendToMachine(solved.value)}
          className="mt-1 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-ink-soft underline decoration-ink/30 decoration-1 underline-offset-4 transition-colors duration-90 hover:text-ink hover:decoration-ink"
        >
          Send to the machine
        </button>
      )}
    </section>
  );
}
