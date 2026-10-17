import { PaperSheet } from "./PaperSheet";

/**
 * The notes filed under the machine: what it is for, how it is worked, what the
 * awkward keys do, and what is actually happening when a total is struck.
 *
 * All of it sits below the fold on purpose. The One-Fold Rule is about what is
 * needed to get an answer — the machine and the docket — and none of this is.
 * Someone who came to add three numbers never scrolls; someone who wants to
 * know why the keypad and the paste field disagree about `2 + 3 × 4` finds the
 * answer here rather than nowhere.
 */

/** A keyboard key and what the machine does with it. */
const KEYBOARD_ROWS: Array<{ keys: string; does: string }> = [
  { keys: "0–9", does: "Numbers. The top row and the number pad both work." },
  { keys: ". or ,", does: "Decimal point. Either character works." },
  { keys: "+ − * x /", does: "Operators. Both * and x multiply." },
  { keys: "Enter or =", does: "Total the sum and strike the answer onto the tape." },
  { keys: "Backspace", does: "Delete the last digit entered." },
  { keys: "Delete or Clear", does: "Clear the entry on screen and keep the sum going." },
  { keys: "Escape", does: "All clear. Tears off the tape and starts again." },
  { keys: "%", does: "Percent." },
  { keys: "Tab, then Enter", does: "Move focus from key to key, then press the focused key." },
];

/** The keys nobody is born knowing, and what they are for. */
const ADVANCED_ROWS: Array<{ key: string; does: string }> = [
  {
    key: "M+ / M−",
    does: "Add the number on screen to the stored number, or take it off. A small orange lamp lights above the keypad whenever something is held.",
  },
  {
    key: "MR / MC",
    does: "Put the stored number back on screen, or empty the store. Memory is the one thing All clear leaves alone.",
  },
  {
    key: "%",
    does: "Converts rather than guesses. 25 × 20 % leaves 0.2 on screen and totals 5. After + or − it reads as a percentage of the running total, so 200 + 10 % is ten percent of two hundred.",
  },
  { key: "√", does: "Square root of the number on screen, struck onto the tape like any other step." },
  { key: "±", does: "Flip the sign. Negatives print in red, the way a machine prints a credit." },
  { key: "⌫", does: "Backspace, digit by digit, while a number is still being keyed." },
  {
    key: "C / AC",
    does: "C clears the entry and leaves the sum standing. AC tears off the tape and starts again.",
  },
];

export function MachineNotes() {
  return (
    <div className="mt-8 flex w-full flex-col items-center gap-4 sm:mt-12">
      <PaperSheet ariaLabelledBy="what-it-is">
        <h2
          id="what-it-is"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          What MathPencil is for
        </h2>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          MathPencil is a free printing adding machine for everyday arithmetic: receipts, invoices,
          measurements, a column of figures that has to come out right.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          On a phone calculator a running total is one figure with no record behind it, so a lost
          place means keying the column again. Here every entry stays printed on the tape, and the
          figure already added is still on screen.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Made by{" "}
          <a
            href="https://htpdevs.tech"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            HTPdevs
          </a>
          . A formula with roots, powers or trigonometry in it belongs on the{" "}
          <a
            href="/scientific"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            scientific calculator
          </a>
          ; an equation with a letter in it belongs on the{" "}
          <a
            href="/pre-algebra"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            pre-algebra solver
          </a>
          .
        </p>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="how-to-use">
        <h2
          id="how-to-use"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          How to use it
        </h2>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">
          Working a sum step by step
        </h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Press numbers, operators and decimal points. Each operator resolves what is already
          standing and strikes it onto the tape, and <span className="font-mono">=</span> prints the
          total in red. Every step stays on the tape above, so a figure entered five lines back can
          be read rather than remembered.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">
          Solving a sum that is already written down
        </h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Under the calculator, the <span className="font-semibold text-ink">Paste a sum</span> box is where
          you can paste any non-algebraic equation. Paste <span className="font-mono">(12 + 5) × 3 ÷ 2</span>, press{" "}
          <span className="font-mono">Enter</span> or <span className="font-semibold">Solve</span>,
          and it is answered in one go. It takes parentheses '()', thousands separators like{" "}
          <span className="font-mono">1,250</span> and whichever multiplication and negative characters
          your source happened to use: <span className="font-mono">*</span>,{" "}
          <span className="font-mono">×</span>, <span className="font-mono">x</span>, and the long
          dashes word processors substitute for a hyphen.
        </p>
        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">
          Using the keyboard or the number pad
        </h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The keyboard drives the machine as fully as the mouse does, and the number pad works
          whether Num&nbsp;Lock is on or off, because key presses are read by physical key rather
          than by the character they produce.
        </p>

        <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-2.5 border-t border-ink/15 pt-4 font-sans text-[0.95rem]">
          {KEYBOARD_ROWS.map((row) => (
            <div key={row.keys} className="contents">
              <dt className="font-mono text-[0.9rem] font-semibold text-ink">{row.keys}</dt>
              <dd className="m-0 leading-[1.45rem] text-ink-soft">{row.does}</dd>
            </div>
          ))}
        </dl>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="advanced">
        <h2
          id="advanced"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          Advanced options
        </h2>

        <dl className="mt-4 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 border-t border-ink/15 pt-4 font-sans text-[0.95rem]">
          {ADVANCED_ROWS.map((row) => (
            <div key={row.key} className="contents">
              <dt className="font-mono text-[0.95rem] font-semibold text-ink">{row.key}</dt>
              <dd className="m-0 leading-[1.45rem] text-ink-soft">{row.does}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Long answers shrink rather than clip, and anything past twelve figures (or smaller than a
          millionth) prints in exponential form.
        </p>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="how-it-works">
        <h2
          id="how-it-works"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          How does this work?
        </h2>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">The keypad</h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The keypad is a state machine that behaves like an adding machine: pressing an operator resolves 
          what is already standing and prints it, which is why{" "}
          <span className="font-mono">2 + 3 × 4</span> reaches 20. The tape shows exactly the route
          it took.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">The paste field</h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Pasted text goes through a tokenizer and a small recursive-descent parser written by hand,
          with the ordinary grammar of written arithmetic: multiplication and division bind tighter
          than addition and subtraction, and brackets override both. It is a parser rather than a
          call to the browser's own expression evaluator. Anything the calculator does not accept comes back as a sentence explaining what
          is wrong with it, not as a wrong answer.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">Where it runs</h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Everything runs from the browser. The pages themselves are rendered to plain HTML ahead of
          time and served as static files, so there is no server-side calculation and nothing to send
          a figure to. Rounding happens only at the moment of printing.
        </p>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="ads-note">
        <h2
          id="ads-note"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          Advertising and your privacy
        </h2>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          MathPencil is free, and advertising is what pays for it. Ads are served by Google AdSense,
          which may set cookies or read device identifiers to choose and measure them. Your
          calculations are never part of that: they stay in your browser and are not shared with any
          advertiser. What is collected, by whom, and how to turn personalised advertising off is set
          out in the{" "}
          <a
            href="/privacy"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            privacy policy
          </a>
          .
        </p>
      </PaperSheet>
    </div>
  );
}
