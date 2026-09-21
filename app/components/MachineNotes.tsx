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
  { keys: "0–9", does: "Key a digit. The main row and the number pad both work." },
  { keys: ". or ,", does: "Decimal point. Either character, because keyboards disagree." },
  { keys: "+ − * x /", does: "Operators. Both * and x multiply." },
  { keys: "Enter or =", does: "Total. The answer is struck in red under a double rule." },
  { keys: "Backspace", does: "Rub out the last digit keyed." },
  { keys: "Delete or Clear", does: "Clear the entry on screen and keep the sum going." },
  { keys: "Escape", does: "All clear. Tears off the tape; the memory survives." },
  { keys: "%", does: "Percent." },
  { keys: "Tab, then Enter", does: "Move between keys and press the focused one." },
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

/** The questions the machine's own behaviour raises. Mirrored into FAQ structured data. */
export const FAQ: Array<{ question: string; answer: string }> = [
  {
    question: "Why does the keypad total 2 + 3 × 4 as 20 and the paste field as 14?",
    answer:
      "Because the two are different instruments. The keypad runs immediate-execution arithmetic, like a physical adding machine: pressing × totals what is already on the tape and carries it forward, so the working reads 2 + 3 = 5, then 5 × 4 = 20. The paste field honours operator precedence and brackets, the way arithmetic written on paper does, so 3 × 4 is resolved first and the answer is 14. A keypad that silently applied precedence would contradict the tape printed directly above it, which is the one thing a printing calculator must never do.",
  },
  {
    question: "Are my numbers sent anywhere?",
    answer:
      "No. Both the keypad and the paste field are arithmetic running in your own browser. Nothing you key or paste is transmitted to MathPencil, stored on a server, or written to your device — closing the tab is the end of it.",
  },
  {
    question: "Do I need an account, an app, or a download?",
    answer:
      "No. MathPencil is a web page. There is no sign-up, no install, no paid tier and no usage limit.",
  },
  {
    question: "Does it work offline, or on a phone?",
    answer:
      "It works on a phone, a tablet and a desktop, with a mouse, a touchscreen or a keyboard. It is not an offline app: the page has to load once, after which a calculation needs no further network access.",
  },
  {
    question: "Why does 0.1 + 0.2 print 0.3 here and 0.30000000000000004 elsewhere?",
    answer:
      "Both are the same binary arithmetic. The difference is that the tape rounds to twelve significant figures before printing, which is below the threshold where double-precision artifacts appear and well above the precision any desk calculation needs. The engine itself keeps the full value, so sending a result on to the next step loses nothing.",
  },
  {
    question: "What happens if I divide by zero or paste something that is not a sum?",
    answer:
      "The machine jams and prints the reason in red — division by zero, an unclosed bracket, two decimal points in one number — rather than quietly printing a wrong answer. All clear releases it.",
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
          Most calculators on a screen show you one number at a time. You key a figure, it
          vanishes, and the next one takes its place; when the total looks wrong there is nothing
          left to check it against. MathPencil is built the other way round. Every entry prints onto
          a paper tape, the tape stays on screen, and the total is struck at the bottom in red under
          a double rule — so the answer arrives with its working attached.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          That makes it useful for the kind of arithmetic where the sequence matters as much as the
          result: reconciling a column of receipts, splitting a bill, checking an invoice line by
          line, adding hours on a timesheet, pricing up a quote. If you have ever finished a running
          total on a phone calculator and had to start over because you could not remember whether
          you had already added the third figure, this is the instrument for that.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          It is free, it needs no account, and it is made by{" "}
          <a
            href="https://htpdevs.tech"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            HTPdevs
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
          Key the first figure, press an operator, key the next, and carry on. Each press prints a
          line. When you have reached the end, press <span className="font-mono">=</span> and the
          total is struck in red. The lines above it do not go anywhere, so you can read back down
          the column and find the figure you mis-keyed.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">
          Solving a sum you already have written down
        </h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Use the <span className="font-semibold text-ink">Paste a sum</span> field under the
          machine for arithmetic that arrived whole — out of an email, a spreadsheet cell, a message.
          Paste <span className="font-mono">(12 + 5) × 3 ÷ 2</span>, press{" "}
          <span className="font-mono">Enter</span> or <span className="font-semibold">Solve</span>,
          and it is answered in one go. It takes brackets, thousands separators like{" "}
          <span className="font-mono">1,250</span>, and whichever multiplication and minus characters
          your source happened to use — <span className="font-mono">*</span>,{" "}
          <span className="font-mono">×</span>, <span className="font-mono">x</span>, and the long
          dashes word processors substitute for a hyphen. <span className="font-semibold">Send to
          the machine</span> then drops the answer onto the tape so you can keep working on it.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">
          Using the keyboard or the number pad
        </h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The keyboard works the moment the page loads — there is nothing to click into first. The
          number pad is read by key position rather than by the character it reports, so it keeps
          working with Num&nbsp;Lock off, where a keypad otherwise sends{" "}
          <span className="font-mono">End</span> and <span className="font-mono">PageDown</span>.
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

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The same notes are on the machine itself, behind{" "}
          <span className="font-semibold text-ink">Calculator Operations</span> above the keypad.
        </p>

        <dl className="mt-4 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 border-t border-ink/15 pt-4 font-sans text-[0.95rem]">
          {ADVANCED_ROWS.map((row) => (
            <div key={row.key} className="contents">
              <dt className="font-mono text-[0.95rem] font-semibold text-ink">{row.key}</dt>
              <dd className="m-0 leading-[1.45rem] text-ink-soft">{row.does}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Long answers shrink rather than clip, and anything past twelve figures — or smaller than a
          millionth — prints in exponential form, because a wall of digits on a tape is not a
          reading.
        </p>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="how-it-works">
        <h2
          id="how-it-works"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          How does this work?
        </h2>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          There are two arithmetic engines behind the page, and they deliberately disagree.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">The keypad</h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The keypad is a state machine that behaves like the mechanism of a printing adding machine:
          it holds one running total, one pending operator and the digits you are currently keying.
          Pressing an operator resolves what is already standing and prints it, which is why{" "}
          <span className="font-mono">2 + 3 × 4</span> reaches 20 — the tape shows exactly the route
          it took. Nothing is recalculated behind your back; a printed line is a record, so it is
          never rewritten.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">The paste field</h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Pasted text goes through a tokenizer and a small recursive-descent parser written by hand,
          with the ordinary grammar of written arithmetic: multiplication and division bind tighter
          than addition and subtraction, and brackets override both. It is a parser rather than a
          call to the browser's own expression evaluator on purpose — pasted text is untrusted
          input, and the ability to run arbitrary code is far too large a capability to hand a
          calculator. Anything the grammar does not accept comes back as a sentence explaining what
          is wrong with it, not as a wrong answer.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">Where it runs</h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Both engines run in your browser. The pages themselves are rendered to plain HTML ahead of
          time and served as static files, so there is no server-side calculation and nothing to send
          a figure to. Rounding happens only at the moment of printing — twelve significant figures,
          which hides binary floating-point noise while keeping more precision than desk arithmetic
          needs — and the full value is what gets carried into the next step.
        </p>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="faq">
        <h2
          id="faq"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          Common questions
        </h2>

        <dl className="mt-4">
          {FAQ.map((entry, index) => (
            <div
              key={entry.question}
              className={index === 0 ? "" : "mt-4 border-t border-ink/15 pt-4"}
            >
              <dt className="font-sans text-[1rem] font-bold leading-[1.45rem] text-ink">
                {entry.question}
              </dt>
              <dd className="m-0 mt-1.5 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
                {entry.answer}
              </dd>
            </div>
          ))}
        </dl>
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
