/**
 * The scientific instrument's state machine.
 *
 * The adding machine on the home page is an immediate-execution mechanism: each
 * key resolves what is standing and prints it. This is the other kind of
 * instrument. Keys compose an expression, the expression is visible while it is
 * being built, and nothing is resolved until `=` — because a scientific
 * calculation is a formula, and a formula is read whole.
 *
 * The state here is deliberately small: the expression as a string of the same
 * glyphs the keys carry, a log of what has been struck, and the four registers a
 * scientific calculator actually keeps (answer, memory, angle mode, shift).
 */

import { formatNumber } from "./format";
import { evaluateScientific, type AngleMode } from "./parse-scientific";

export interface SciLine {
  id: number;
  /** The expression exactly as it was entered. */
  expression: string;
  /** The formatted answer. */
  answer: string;
}

export interface SciState {
  /** The expression under construction, in display glyphs: `sin(30)+2^3`. */
  entry: string;
  /** The struck answer, set only by `=`. Null while an expression is being built. */
  struck: string | null;
  log: SciLine[];
  /** The last struck value, which the `Ans` key refers to. */
  ans: number;
  memory: number;
  angleMode: AngleMode;
  /** True when the next key press takes its second function. */
  shift: boolean;
  error: string | null;
  /** Drives the strike animation on the answer line. */
  strikeCount: number;
  nextLineId: number;
}

export type SciAction =
  | { type: "insert"; text: string }
  | { type: "equals" }
  | { type: "backspace" }
  | { type: "clearEntry" }
  | { type: "allClear" }
  | { type: "toggleShift" }
  | { type: "toggleAngle" }
  | { type: "memoryAdd" }
  | { type: "memorySubtract" }
  | { type: "memoryRecall" }
  | { type: "memoryClear" };

/**
 * Atoms that were inserted as one key press and come off as one.
 *
 * Backspace on a physical scientific calculator rubs out a key press, not a
 * character: pressing it once after `sin(` leaves nothing behind, never `sin`.
 * Longest first, so `asin(` is matched before `sin(`.
 */
const ATOMS = [
  "asin(",
  "acos(",
  "atan(",
  "sinh(",
  "cosh(",
  "tanh(",
  "round(",
  "floor(",
  "sqrt(",
  "cbrt(",
  "sin(",
  "cos(",
  "tan(",
  "ceil(",
  "10^(",
  "exp(",
  "abs(",
  "ln(",
  "log(",
  "Ans",
  "mod",
  "⁻¹",
];

/** Glyphs that continue an expression rather than starting a new one. */
const CONTINUES_EXPRESSION = new Set([
  "+",
  "−",
  "-",
  "×",
  "÷",
  "^",
  "%",
  "!",
  "²",
  "³",
  "⁻",
  "m",
]);

/** The longest expression the display will take, matched to what it can show. */
const MAX_ENTRY_LENGTH = 120;

export const initialState: SciState = {
  entry: "",
  struck: null,
  log: [],
  ans: 0,
  memory: 0,
  angleMode: "deg",
  shift: false,
  error: null,
  strikeCount: 0,
  nextLineId: 1,
};

/** Evaluates the expression on screen, or `null` if it is not yet an expression. */
export function preview(state: SciState): number | null {
  if (state.entry.trim() === "") return null;
  const result = evaluateScientific(state.entry, {
    angleMode: state.angleMode,
    ans: state.ans,
  });
  return result.ok ? result.value : null;
}

/** The figure the memory keys operate on: what is entered, else the last answer. */
function currentValue(state: SciState): number {
  return preview(state) ?? state.ans;
}

function log(
  state: SciState,
  line: Omit<SciLine, "id">,
): Pick<SciState, "log" | "nextLineId"> {
  return {
    log: [...state.log, { ...line, id: state.nextLineId }],
    nextLineId: state.nextLineId + 1,
  };
}

export function reducer(state: SciState, action: SciAction): SciState {
  switch (action.type) {
    case "insert": {
      // A jam clears itself the moment something new is keyed, so the visitor is
      // never made to press a clear key before they can carry on.
      const fromError = state.error !== null;
      const struckAlready = state.struck !== null;

      // After a total, an operator carries the answer forward — `= then × 2`
      // reads as `Ans × 2`, the way every scientific calculator behaves — while
      // a digit or a function starts a fresh expression.
      const base = fromError
        ? ""
        : struckAlready
          ? CONTINUES_EXPRESSION.has(action.text[0])
            ? "Ans"
            : ""
          : state.entry;

      if (base.length + action.text.length > MAX_ENTRY_LENGTH) return state;

      return {
        ...state,
        entry: base + action.text,
        struck: null,
        error: null,
        shift: false,
      };
    }

    case "equals": {
      if (state.entry.trim() === "") return state;

      const result = evaluateScientific(state.entry, {
        angleMode: state.angleMode,
        ans: state.ans,
      });

      if (!result.ok) {
        return {
          ...state,
          struck: null,
          error: result.message,
          shift: false,
          strikeCount: state.strikeCount + 1,
        };
      }

      const answer = formatNumber(result.value);

      return {
        ...state,
        ...log(state, { expression: state.entry, answer }),
        struck: answer,
        ans: result.value,
        error: null,
        shift: false,
        strikeCount: state.strikeCount + 1,
      };
    }

    case "backspace": {
      if (state.error !== null) {
        return { ...state, error: null, shift: false };
      }
      // A struck answer is a finished thing; backspace reopens the expression
      // that produced it rather than editing the answer itself.
      if (state.struck !== null) {
        return { ...state, struck: null, shift: false };
      }
      if (state.entry === "") return state;

      const atom = ATOMS.find((candidate) => state.entry.endsWith(candidate));
      const removed = atom?.length ?? 1;

      return {
        ...state,
        entry: state.entry.slice(0, -removed),
        shift: false,
      };
    }

    case "clearEntry":
      return { ...state, entry: "", struck: null, error: null, shift: false };

    case "allClear":
      // Everything on screen goes, and so does the log. Memory and the angle
      // mode are settings of the instrument rather than of this calculation, so
      // they are the two things that survive.
      return {
        ...initialState,
        memory: state.memory,
        angleMode: state.angleMode,
        nextLineId: state.nextLineId,
      };

    case "toggleShift":
      return { ...state, shift: !state.shift };

    case "toggleAngle":
      // The angle mode changes what the expression on screen means, so the
      // struck answer beneath it is withdrawn rather than left to go stale.
      return {
        ...state,
        angleMode: state.angleMode === "deg" ? "rad" : "deg",
        struck: null,
        error: null,
        shift: false,
      };

    case "memoryAdd":
    case "memorySubtract": {
      const value = currentValue(state);
      return {
        ...state,
        memory: action.type === "memoryAdd" ? state.memory + value : state.memory - value,
        shift: false,
      };
    }

    case "memoryRecall":
      return reducer({ ...state, shift: false }, { type: "insert", text: formatNumber(state.memory) });

    case "memoryClear":
      return { ...state, memory: 0, shift: false };
  }
}
