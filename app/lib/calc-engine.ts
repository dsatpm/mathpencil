/**
 * The adding machine itself: a pure state machine driven by key presses.
 *
 * It follows immediate-execution semantics — the way a physical keypad works,
 * where `2 + 3 × 4` resolves left to right to 20. Operator precedence belongs
 * to written expressions, which is what the docket's parser is for; a keypad
 * that silently applied precedence would contradict the tape printed above it.
 *
 * Every press appends to the tape, so the visitor can always see what they
 * asked for, and a total is struck in ribbon red at the bottom.
 */

import { formatEntry, formatNumber } from "./format";

export type Operator = "+" | "-" | "×" | "÷";

/** The mark printed in the tape's right-hand gutter, exactly as an adding machine prints it. */
export type TapeMark = Operator | "T" | "%" | "√" | "M+" | "M−" | "MR" | "C" | "!";

export interface TapeLine {
  id: number;
  /** The formatted number, or the error text on an `!` line. */
  text: string;
  mark: TapeMark;
  /** `rule` draws the double underline a machine prints above a total. */
  tone: "ink" | "ribbon" | "rule";
}

export interface CalcState {
  /** Digits as keyed, e.g. `"12."`. Never formatted — see {@link displayText}. */
  keyed: string;
  /** When true the next digit starts a fresh number rather than appending. */
  awaitingFreshEntry: boolean;
  accumulator: number | null;
  pending: Operator | null;
  memory: number;
  tape: TapeLine[];
  /** Set when the machine jams; cleared only by C or AC. */
  error: string | null;
  /** Drives the strike animation on the total slab. */
  strikeCount: number;
  /** True immediately after `=`, so the total reads as a total rather than an entry. */
  justTotaled: boolean;
  nextLineId: number;
}

export type CalcAction =
  | { type: "digit"; digit: string }
  | { type: "point" }
  | { type: "operator"; operator: Operator }
  | { type: "equals" }
  | { type: "backspace" }
  | { type: "clearEntry" }
  | { type: "allClear" }
  | { type: "negate" }
  | { type: "percent" }
  | { type: "squareRoot" }
  | { type: "memoryAdd" }
  | { type: "memorySubtract" }
  | { type: "memoryRecall" }
  | { type: "memoryClear" }
  | { type: "loadValue"; value: number };

/** The longest number the machine will accept from the keypad, matching its printable width. */
const MAX_KEYED_DIGITS = 14;

export const initialState: CalcState = {
  keyed: "0",
  awaitingFreshEntry: true,
  accumulator: null,
  pending: null,
  memory: 0,
  tape: [],
  error: null,
  strikeCount: 0,
  justTotaled: false,
  nextLineId: 1,
};

/** The number currently keyed in, as a number. */
function keyedValue(state: CalcState): number {
  const parsed = Number(state.keyed);
  return Number.isFinite(parsed) ? parsed : 0;
}

function print(
  state: CalcState,
  lines: Array<Omit<TapeLine, "id">>,
): Pick<CalcState, "tape" | "nextLineId"> {
  let id = state.nextLineId;
  const printed = lines.map((line) => ({ ...line, id: id++ }));
  return { tape: [...state.tape, ...printed], nextLineId: id };
}

function apply(left: number, operator: Operator, right: number): number | { error: string } {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      if (right === 0) return { error: "That divides by zero, which has no answer." };
      return left / right;
  }
}

/** Puts the machine into its jammed state with a red error line on the tape. */
function jam(state: CalcState, message: string): CalcState {
  return {
    ...state,
    ...print(state, [{ text: message, mark: "!", tone: "ribbon" }]),
    error: message,
    keyed: "0",
    awaitingFreshEntry: true,
    accumulator: null,
    pending: null,
    justTotaled: false,
    strikeCount: state.strikeCount + 1,
  };
}

export function reducer(state: CalcState, action: CalcAction): CalcState {
  // A jammed machine accepts only the two clear keys, so the visitor is never
  // stuck computing on top of a bad value.
  if (state.error !== null && action.type !== "allClear" && action.type !== "clearEntry") {
    return state;
  }

  switch (action.type) {
    case "digit": {
      const base = state.awaitingFreshEntry ? "" : state.keyed === "0" ? "" : state.keyed;
      if (base.replace(/[-.]/g, "").length >= MAX_KEYED_DIGITS) return state;
      return {
        ...state,
        keyed: base + action.digit,
        awaitingFreshEntry: false,
        justTotaled: false,
      };
    }

    case "point": {
      if (state.awaitingFreshEntry) {
        return { ...state, keyed: "0.", awaitingFreshEntry: false, justTotaled: false };
      }
      if (state.keyed.includes(".")) return state;
      return { ...state, keyed: `${state.keyed}.`, justTotaled: false };
    }

    case "backspace": {
      if (state.awaitingFreshEntry) return state;
      const shortened = state.keyed.slice(0, -1);
      const remaining = shortened === "" || shortened === "-" ? "0" : shortened;
      return {
        ...state,
        keyed: remaining,
        awaitingFreshEntry: remaining === "0" && shortened.length <= 1,
      };
    }

    case "negate": {
      if (state.keyed === "0") return state;
      const negated = state.keyed.startsWith("-") ? state.keyed.slice(1) : `-${state.keyed}`;
      return { ...state, keyed: negated, justTotaled: false };
    }

    case "operator": {
      const value = keyedValue(state);

      // Pressing a second operator without keying a number swaps the pending
      // one rather than computing with a repeated operand.
      if (state.awaitingFreshEntry && state.pending !== null && !state.justTotaled) {
        return { ...state, pending: action.operator };
      }

      let carried = value;
      if (state.pending !== null && state.accumulator !== null && !state.justTotaled) {
        const applied = apply(state.accumulator, state.pending, value);
        if (typeof applied !== "number") return jam(state, applied.error);
        carried = applied;
      }

      return {
        ...state,
        // The sign printed beside a number is the operation that was applied
        // *to that number*, not the key just pressed — so the tape's own lines
        // always sum to the total struck beneath them. The first operand of a
        // run is added, which is why a null pending prints as "+".
        ...print(state, [
          { text: formatNumber(value), mark: state.pending ?? "+", tone: "ink" },
        ]),
        accumulator: carried,
        pending: action.operator,
        keyed: String(carried),
        awaitingFreshEntry: true,
        justTotaled: false,
      };
    }

    case "equals": {
      const value = keyedValue(state);

      if (state.pending === null || state.accumulator === null) {
        // Totalling a bare number still prints — an adding machine always
        // gives you a tape line for what you asked.
        return {
          ...state,
          ...print(state, [
            { text: formatNumber(value), mark: "T", tone: "rule" },
          ]),
          keyed: String(value),
          awaitingFreshEntry: true,
          justTotaled: true,
          strikeCount: state.strikeCount + 1,
        };
      }

      const applied = apply(state.accumulator, state.pending, value);
      if (typeof applied !== "number") return jam(state, applied.error);

      return {
        ...state,
        ...print(state, [
          { text: formatNumber(value), mark: state.pending, tone: "ink" },
          { text: formatNumber(applied), mark: "T", tone: "rule" },
        ]),
        accumulator: null,
        pending: null,
        keyed: String(applied),
        awaitingFreshEntry: true,
        justTotaled: true,
        strikeCount: state.strikeCount + 1,
      };
    }

    case "percent": {
      const value = keyedValue(state);
      // `200 + 10 %` means ten percent *of two hundred*, which is what the key
      // does on every physical adding machine.
      const relative =
        (state.pending === "+" || state.pending === "-") && state.accumulator !== null
          ? (state.accumulator * value) / 100
          : value / 100;

      return {
        ...state,
        // The tape keeps the percentage as it was keyed — `20 %` — and the
        // platen below shows what it became, `0.2`, so the conversion the key
        // performs is visible rather than silent.
        ...print(state, [{ text: `${formatNumber(value)}%`, mark: "%", tone: "ink" }]),
        keyed: String(relative),
        awaitingFreshEntry: true,
        justTotaled: false,
      };
    }

    case "squareRoot": {
      const value = keyedValue(state);
      if (value < 0) return jam(state, "No square root of a negative");
      const root = Math.sqrt(value);
      return {
        ...state,
        ...print(state, [{ text: formatNumber(root), mark: "√", tone: "ink" }]),
        keyed: String(root),
        awaitingFreshEntry: true,
        justTotaled: false,
      };
    }

    case "memoryAdd":
    case "memorySubtract": {
      const value = keyedValue(state);
      const memory =
        action.type === "memoryAdd" ? state.memory + value : state.memory - value;
      return {
        ...state,
        ...print(state, [
          {
            text: formatNumber(value),
            mark: action.type === "memoryAdd" ? "M+" : "M−",
            tone: "ink",
          },
        ]),
        memory,
        awaitingFreshEntry: true,
        justTotaled: false,
      };
    }

    case "memoryRecall": {
      if (state.memory === 0 && state.tape.length === 0) return state;
      return {
        ...state,
        ...print(state, [{ text: formatNumber(state.memory), mark: "MR", tone: "ink" }]),
        keyed: String(state.memory),
        awaitingFreshEntry: true,
        justTotaled: false,
      };
    }

    case "memoryClear":
      return { ...state, memory: 0 };

    case "loadValue":
      return {
        ...state,
        ...print(state, [{ text: formatNumber(action.value), mark: "MR", tone: "ink" }]),
        keyed: String(action.value),
        awaitingFreshEntry: true,
        justTotaled: false,
        error: null,
      };

    case "clearEntry":
      return { ...state, keyed: "0", awaitingFreshEntry: true, error: null, justTotaled: false };

    case "allClear":
      // Tearing off the tape: the roll comes away clean, but what you put in
      // memory is in the machine, not on the paper, so it survives.
      return { ...initialState, memory: state.memory, nextLineId: state.nextLineId };
  }
}

/** What the total slab shows: the keyed digits verbatim, or a formatted result. */
export function displayText(state: CalcState): string {
  if (state.error !== null) return "—";
  if (state.awaitingFreshEntry) return formatNumber(keyedValue(state));
  return formatEntry(state.keyed);
}
