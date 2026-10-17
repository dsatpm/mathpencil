import { initialState, reducer, type CalcAction, type TapeLine } from "../lib/calc-engine";
import { formatNumber } from "../lib/format";
import { solveEquation, type SolveOutcome } from "../lib/linear-solver";
import { evaluateScientific } from "../lib/parse-scientific";

/**
 * Small, static pictures of the three instruments, for the home page and the
 * tools page.
 *
 * Nothing in them is typed by hand. Every figure is produced by the same engine
 * the real instrument runs, at render time, so a preview cannot claim an answer
 * the instrument would not give. If an engine changes how it reads a sum, these
 * change with it.
 */

/** The keys a visitor would press on the adding machine, as engine actions. */
function keyActions(keys: string): CalcAction[] {
  const actions: CalcAction[] = [];
  for (const key of keys.replace(/\s+/g, "")) {
    if (/[0-9]/.test(key)) actions.push({ type: "digit", digit: key });
    else if (key === "+" || key === "-" || key === "×" || key === "÷") {
      actions.push({ type: "operator", operator: key });
    } else if (key === "=") actions.push({ type: "equals" });
    else throw new Error(`No adding-machine key for "${key}"`);
  }
  return actions;
}

/** The tape the adding machine prints for a run of keys. */
export function tapeFor(keys: string): TapeLine[] {
  return keyActions(keys).reduce(reducer, initialState).tape;
}

/** The total struck at the bottom of the tape, in ribbon red on the machine. */
export function tapeTotal(keys: string): string {
  const total = tapeFor(keys).filter((line) => line.mark === "T").at(-1);
  if (!total) throw new Error(`Adding-machine preview printed no total for "${keys}"`);
  return total.text;
}

/** What the scientific calculator shows for an expression, in degrees. */
export function scientificAnswer(expression: string): string {
  const result = evaluateScientific(expression, { angleMode: "deg", ans: 0 });
  if (!result.ok) throw new Error(`Scientific preview failed on "${expression}": ${result.message}`);
  return formatNumber(result.value);
}

/** The solver's working for an equation that has exactly one answer. */
export function solvedFor(equation: string): Extract<SolveOutcome, { kind: "one-answer" }> {
  const outcome = solveEquation(equation);
  if (!outcome.ok || outcome.kind !== "one-answer") {
    throw new Error(`Solver preview expected one answer for "${equation}"`);
  }
  return outcome;
}

/** A strip of adding-machine tape, printed by the real reducer. */
export function TapePreview({ keys, className = "" }: { keys: string; className?: string }) {
  const lines = tapeFor(keys);

  return (
    <figure
      className={`on-paper w-full max-w-60 bg-tape px-4 pb-4 pt-3 font-mono text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] ${className}`}
    >
      <figcaption className="sr-only">Adding-machine tape for {keys}</figcaption>
      <ol className="list-none space-y-0.5 p-0 text-[1.05rem] leading-[1.6rem]">
        {lines.map((line) => (
          <li
            key={line.id}
            className={[
              "flex items-baseline justify-between gap-4",
              line.tone === "ribbon" ? "text-ribbon" : "",
              line.tone === "rule" ? "border-b-[3px] border-double border-ink/60 pb-0.5" : "",
            ].join(" ")}
          >
            <span className="tabular-nums">{line.text}</span>
            <span aria-hidden="true" className="w-6 text-right text-[0.9rem] text-ink-soft">
              {line.mark}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** The scientific calculator's window: the expression above, the answer below. */
export function LcdPreview({ expression, className = "" }: { expression: string; className?: string }) {
  return (
    <figure
      className={`on-lcd w-full max-w-64 rounded-md bg-sci-bezel p-2.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] ${className}`}
    >
      <figcaption className="sr-only">Scientific calculator window for {expression}</figcaption>
      <div className="rounded-sm bg-sci-lcd px-3 py-2.5 font-mono text-sci-lcd-ink">
        <p className="text-[0.95rem] text-sci-lcd-dim">{expression}</p>
        <p className="mt-1 text-right text-[2rem] leading-none tabular-nums">
          {scientificAnswer(expression)}
        </p>
      </div>
    </figure>
  );
}

/** The solver's board, with as many steps as fit the space it is given. */
export function BoardPreview({
  equation,
  maxSteps = Infinity,
  className = "",
}: {
  equation: string;
  maxSteps?: number;
  className?: string;
}) {
  const solved = solvedFor(equation);
  const steps = solved.steps.slice(0, maxSteps);

  return (
    <figure
      className={`on-board w-full rounded-sm border-4 border-pa-board-edge bg-pa-board px-4 py-3.5 font-mono text-pa-chalk shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] ${className}`}
    >
      <figcaption className="sr-only">Solver working for {equation}</figcaption>
      <p className="text-[1.05rem]">{equation}</p>
      <ol className="mt-2 list-none space-y-1.5 p-0">
        {steps.map((step) => (
          <li key={`${step.instruction}-${step.equation}`}>
            <span className="block font-sans text-[0.78rem] text-pa-chalk-soft">{step.instruction}</span>
            <span className="text-[1.05rem]">{step.equation}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2.5 border-t border-pa-chalk/20 pt-2 text-[1.2rem] text-pa-chalk-mark">
        {solved.answer}
      </p>
    </figure>
  );
}
