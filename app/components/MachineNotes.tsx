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
  { keys: "0–9", does: "Numbers. Keyboard and number pad both work by default." },
  { keys: ". or ,", does: "Decimal point. Either character works." },
  { keys: "+ − * x /", does: "Both * and x multiply." },
  { keys: "Enter or =", does: "Total the equation." },
  { keys: "Backspace", does: "Delete the last digit entered." },
  { keys: "Delete or Clear", does: "Clear the entry on screen and keep the sum going." },
  { keys: "Escape", does: "All clear. Clears everything on the screen." },
  { keys: "%", does: "Percent." },
  { keys: "Tab, then Enter", does: "Move between keys, then 'Enter' puts choice in calculator." },
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
          Anyone that needs a quick calculation. Free tool for everyday arithmetic.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          If you have ever finished a running
          total on a phone calculator and had to start over because you could not remember whether
          you had already added the third figure, this will solve that problem.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Made by{" "}
          <a
            href="https://htpdevs.tech"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            HTPdevs
          </a>
          . If what you have is a more complex calculation, check out one of the other calculators.
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
          Press numbers, operators, and decimal points. When you're ready, press <span className="font-mono">=</span> and the total displays in red. Keeps a running history of your calculations, so you can 
          refer back to previous steps.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">
          Solving a sum you already have written down
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
          Use the keyboard if you prefer. The number pad (if your keyboard has one) also works. Just make sure Num&nbsp;Lock is off!
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
