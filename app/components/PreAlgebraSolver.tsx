import { useId, useState } from "react";
import {
  evaluateExpression,
  formatFraction,
  isExactWholeNumber,
  solveEquation,
  toDecimal,
  type EvaluateOutcome,
  type SolveOutcome,
} from "../lib/linear-solver";

/** The examples under each field: a way in for someone who does not know what to type. */
const EQUATION_SUGGESTIONS = ["3x + 5 = 20", "5x − 4 = 3x + 10", "2(x + 3) = 10", "x/3 = 4"];

/** A field on the board: chalk on slate, underlined rather than boxed. */
const FIELD_CLASSES =
  "w-full border-0 border-b-2 border-pa-chalk-soft/60 bg-transparent px-0 pb-1.5 font-mono text-[1.05rem] text-pa-chalk placeholder:text-pa-chalk-soft/60 focus:border-pa-chalk-mark focus:outline-none sm:text-[1.15rem]";

const BUTTON_CLASSES =
  "shrink-0 select-none rounded-sm bg-pa-chalk-mark px-5 py-2.5 font-sans text-[0.9rem] font-bold uppercase tracking-[0.14em] text-[#1d2b18] shadow-[0_3px_0_0_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-90 ease-linear hover:brightness-110 active:translate-y-0.75 active:shadow-none";

const LABEL_CLASSES =
  "block font-sans text-[0.72rem] font-bold uppercase tracking-[0.18em] text-pa-chalk-soft";

/** Adds the decimal after a fraction, but only when the fraction is not already whole. */
function withDecimal(value: Parameters<typeof formatFraction>[0]): string {
  if (isExactWholeNumber(value)) return formatFraction(value);
  const approximate = Math.round(toDecimal(value) * 10000) / 10000;
  return `${formatFraction(value)}  (${approximate})`;
}

/**
 * The board at the back of the room.
 *
 * Two things a pre-algebra course asks you to do — solve for the letter, and
 * put a value in and work an expression out — with the working shown in full
 * for both. The answer is never given on its own: every step names the move
 * made to both sides and then shows the equation as it stands, because that
 * layout is the thing being marked, and a student who copies only the last line
 * has been given nothing.
 *
 * Arithmetic here is exact. A third is `1/3`, not `0.333333333333`.
 */
export function PreAlgebraSolver() {
  const equationId = useId();
  const expressionId = useId();
  const valueId = useId();

  const [equation, setEquation] = useState("3x + 5 = 20");
  const [solved, setSolved] = useState<SolveOutcome | null>(null);

  const [expression, setExpression] = useState("8 × (x + 3)");
  const [value, setValue] = useState("2");
  const [evaluated, setEvaluated] = useState<EvaluateOutcome | null>(null);

  return (
    <div className="on-board grid gap-4 lg:grid-cols-2">
      {/* Solving for the letter. */}
      <section
        aria-labelledby={`${equationId}-title`}
        className="border-4 border-pa-board-edge bg-pa-board px-5 py-5 shadow-[0_10px_28px_-10px_rgba(27,42,65,0.55)] sm:px-6"
      >
        <h3
          id={`${equationId}-title`}
          className="font-sans text-[1.1rem] font-bold text-pa-chalk"
        >
          Solve an equation
        </h3>
        <p className="mt-1 font-sans text-[0.9rem] leading-[1.35rem] text-pa-chalk-soft">
          One letter, one answer, and every step it took to get there.
        </p>

        <form
          className="mt-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSolved(solveEquation(equation));
          }}
        >
          <label htmlFor={equationId} className={LABEL_CLASSES}>
            The equation
          </label>
          <div className="mt-2 flex items-end gap-3">
            <input
              id={equationId}
              value={equation}
              onChange={(event) => {
                setEquation(event.target.value);
                setSolved(null);
              }}
              placeholder="3x + 5 = 20"
              autoComplete="off"
              spellCheck={false}
              className={FIELD_CLASSES}
            />
            <button type="submit" className={BUTTON_CLASSES}>
              Solve
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-pa-chalk-soft/70">
            Try
          </span>
          {EQUATION_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setEquation(suggestion);
                setSolved(solveEquation(suggestion));
              }}
              className="rounded-sm border border-pa-chalk-soft/40 px-2 py-1 font-mono text-[0.8rem] text-pa-chalk-soft transition-colors duration-90 hover:border-pa-chalk hover:text-pa-chalk"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-24" aria-live="polite">
          {solved !== null && !solved.ok && (
            <p className="font-sans text-[0.95rem] font-semibold text-pa-chalk-mark">
              {solved.message}
            </p>
          )}

          {solved !== null && solved.ok && (
            <div className="strike">
              <ol className="list-none space-y-2.5 p-0">
                {solved.steps.map((step, index) => (
                  <li key={step.equation + index} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 font-mono text-[0.78rem] tabular-nums text-pa-chalk-soft/70"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-sans text-[0.88rem] leading-[1.3rem] text-pa-chalk-soft">
                        {step.instruction}
                      </span>
                      <span className="mt-0.5 block font-mono text-[1.05rem] text-pa-chalk">
                        {step.equation}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              {solved.kind === "one-answer" ? (
                <div className="mt-4 border-t-2 border-double border-pa-chalk-mark/70 pt-3">
                  <p className="font-mono text-[1.6rem] leading-none text-pa-chalk-mark sm:text-[1.9rem]">
                    {solved.letter} = {withDecimal(solved.value)}
                  </p>
                  {solved.check !== null && (
                    <p className="mt-2 font-sans text-[0.85rem] leading-[1.25rem] text-pa-chalk-soft">
                      {solved.check}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 border-t-2 border-double border-pa-chalk-mark/70 pt-3 font-sans text-[0.95rem] leading-[1.4rem] text-pa-chalk">
                  {solved.note}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Putting a value in. */}
      <section
        aria-labelledby={`${expressionId}-title`}
        className="border-4 border-pa-board-edge bg-pa-board px-5 py-5 shadow-[0_10px_28px_-10px_rgba(27,42,65,0.55)] sm:px-6"
      >
        <h3
          id={`${expressionId}-title`}
          className="font-sans text-[1.1rem] font-bold text-pa-chalk"
        >
          Evaluate an expression
        </h3>
        <p className="mt-1 font-sans text-[0.9rem] leading-[1.35rem] text-pa-chalk-soft">
          Give the letter a value, and see the substitution before the answer.
        </p>

        <form
          // A grid rather than a flex row: the value field wants a fixed narrow
          // column and the expression wants whatever is left, which is exactly
          // what a grid states and a flex row has to be argued into.
          className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_5.5rem] sm:items-end sm:gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setEvaluated(evaluateExpression(expression, value));
          }}
        >
          <div className="min-w-0">
            <label htmlFor={expressionId} className={LABEL_CLASSES}>
              The expression
            </label>
            <input
              id={expressionId}
              value={expression}
              onChange={(event) => {
                setExpression(event.target.value);
                setEvaluated(null);
              }}
              placeholder="8 × (x + 3)"
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASSES} mt-2`}
            />
          </div>

          <div className="min-w-0">
            <label htmlFor={valueId} className={LABEL_CLASSES}>
              The value
            </label>
            <input
              id={valueId}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setEvaluated(null);
              }}
              placeholder="2"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={`${FIELD_CLASSES} mt-2`}
            />
          </div>

          {/* The button takes its own row: beside two fields it would squeeze
              the expression into a slot too narrow to read what is in it. */}
          <button type="submit" className={`${BUTTON_CLASSES} sm:col-span-2 sm:justify-self-start`}>
            Work it out
          </button>
        </form>

        <div className="mt-4 min-h-24" aria-live="polite">
          {evaluated !== null && !evaluated.ok && (
            <p className="font-sans text-[0.95rem] font-semibold text-pa-chalk-mark">
              {evaluated.message}
            </p>
          )}

          {evaluated !== null && evaluated.ok && (
            <div className="strike">
              {evaluated.letter !== null && (
                <>
                  <p className="font-sans text-[0.88rem] leading-[1.3rem] text-pa-chalk-soft">
                    Put the value in place of the letter.
                  </p>
                  <p className="mt-0.5 font-mono text-[1.05rem] break-words text-pa-chalk">
                    {evaluated.substituted}
                  </p>
                </>
              )}

              <div className="mt-4 border-t-2 border-double border-pa-chalk-mark/70 pt-3">
                <p className="font-mono text-[1.6rem] leading-none text-pa-chalk-mark sm:text-[1.9rem]">
                  = {withDecimal(evaluated.value)}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
