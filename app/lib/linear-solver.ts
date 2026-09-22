/**
 * A pre-algebra solver: one unknown, exact arithmetic, and every step shown.
 *
 * The two calculators elsewhere on the site answer a sum. This one has to do
 * the thing a pre-algebra student is actually marked on — the working — so it
 * is built differently in two ways.
 *
 * First, it keeps fractions exact. A third is `1/3` here rather than
 * `0.333333333333`, because a pre-algebra answer is written as a fraction and a
 * decimal tail is a wrong answer on a test.
 *
 * Second, it does not evaluate an expression to a number: it reduces it to the
 * form `ax + b`, which is the only shape a linear equation can take. Anything
 * that would leave that shape — two unknowns multiplied together, a letter in a
 * divisor — is refused with a sentence rather than answered approximately.
 */

/* --- Exact fractions ------------------------------------------------------
   Everything below works in rationals. A pre-algebra course never needs an
   irrational answer, and a rational kept as a pair of integers is exact where
   a decimal is not: 1/3 + 1/3 + 1/3 is 1 here, not 0.999999999999.
------------------------------------------------------------------------- */

export interface Fraction {
  /** Carries the sign. */
  numerator: number;
  /** Always positive. */
  denominator: number;
}

function greatestCommonDivisor(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    [left, right] = [right, left % right];
  }
  return left === 0 ? 1 : left;
}

export function fraction(numerator: number, denominator = 1): Fraction {
  if (denominator === 0) {
    throw new SolveError("That divides by zero, which has no answer.");
  }
  const sign = denominator < 0 ? -1 : 1;
  const divisor = greatestCommonDivisor(numerator, denominator);
  return {
    numerator: (sign * numerator) / divisor,
    denominator: (sign * denominator) / divisor,
  };
}

/** Turns a decimal as it was typed into an exact fraction: `2.5` is `5/2`. */
function fromDecimalText(text: string): Fraction {
  const [whole, decimals = ""] = text.split(".");
  const scale = 10 ** decimals.length;
  return fraction(Number(whole + decimals), scale);
}

const ZERO: Fraction = { numerator: 0, denominator: 1 };
const ONE: Fraction = { numerator: 1, denominator: 1 };

function add(left: Fraction, right: Fraction): Fraction {
  return fraction(
    left.numerator * right.denominator + right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

function subtract(left: Fraction, right: Fraction): Fraction {
  return add(left, negate(right));
}

function multiply(left: Fraction, right: Fraction): Fraction {
  return fraction(left.numerator * right.numerator, left.denominator * right.denominator);
}

function divide(left: Fraction, right: Fraction): Fraction {
  if (right.numerator === 0) {
    throw new SolveError("That divides by zero, which has no answer.");
  }
  return fraction(left.numerator * right.denominator, left.denominator * right.numerator);
}

function negate(value: Fraction): Fraction {
  return { numerator: -value.numerator, denominator: value.denominator };
}

function isZero(value: Fraction): boolean {
  return value.numerator === 0;
}

function equals(left: Fraction, right: Fraction): boolean {
  return isZero(subtract(left, right));
}

/** How a fraction is written down: `5`, `−3/4`, never a decimal tail. */
export function formatFraction(value: Fraction): string {
  const sign = value.numerator < 0 ? "−" : "";
  const magnitude = Math.abs(value.numerator);
  if (value.denominator === 1) return sign + String(magnitude);
  return `${sign}${magnitude}/${value.denominator}`;
}

/** The same figure as a decimal, for the line that says “which is about”. */
export function toDecimal(value: Fraction): number {
  return value.numerator / value.denominator;
}

/** True when a fraction does not land on a whole number, so it is worth also showing as a decimal. */
export function isExactWholeNumber(value: Fraction): boolean {
  return value.denominator === 1;
}

/* --- Linear expressions --------------------------------------------------- */

/** An expression reduced to `a × letter + b`. A plain number is `a = 0`. */
interface Linear {
  a: Fraction;
  b: Fraction;
}

/** Thrown internally and turned into a message at the boundary. */
class SolveError extends Error {}

type TokenType = "number" | "letter" | "operator" | "open" | "close" | "equals";

interface Token {
  type: TokenType;
  text: string;
  value?: Fraction;
}

const MULTIPLY_CHARACTERS = new Set(["*", "×", "·"]);
const DIVIDE_CHARACTERS = new Set(["/", "÷", "∕"]);
const MINUS_CHARACTERS = new Set(["-", "−", "–", "—"]);
const OPEN_BRACKETS = new Set(["(", "[", "{"]);
const CLOSE_BRACKETS = new Set([")", "]", "}"]);

function isDigit(character: string): boolean {
  return character >= "0" && character <= "9";
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < input.length) {
    const character = input[index];

    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    if (isDigit(character) || character === ".") {
      let digits = "";
      let seenPoint = false;

      while (index < input.length) {
        const next = input[index];
        if (isDigit(next)) {
          digits += next;
          index += 1;
        } else if (next === "," && isDigit(input[index + 1] ?? "")) {
          index += 1;
        } else if (next === "." && !seenPoint) {
          seenPoint = true;
          digits += next;
          index += 1;
        } else if (next === "." && seenPoint) {
          throw new SolveError("That number has two decimal points in it.");
        } else {
          break;
        }
      }

      tokens.push({ type: "number", text: digits, value: fromDecimalText(digits) });
      continue;
    }

    if (/[a-z]/i.test(character)) {
      tokens.push({ type: "letter", text: character });
      index += 1;
      continue;
    }

    if (character === "+") {
      tokens.push({ type: "operator", text: "+" });
      index += 1;
      continue;
    }
    if (MINUS_CHARACTERS.has(character)) {
      tokens.push({ type: "operator", text: "-" });
      index += 1;
      continue;
    }
    if (MULTIPLY_CHARACTERS.has(character)) {
      tokens.push({ type: "operator", text: "*" });
      index += 1;
      continue;
    }
    if (DIVIDE_CHARACTERS.has(character)) {
      tokens.push({ type: "operator", text: "/" });
      index += 1;
      continue;
    }
    if (OPEN_BRACKETS.has(character)) {
      tokens.push({ type: "open", text: "(" });
      index += 1;
      continue;
    }
    if (CLOSE_BRACKETS.has(character)) {
      tokens.push({ type: "close", text: ")" });
      index += 1;
      continue;
    }
    if (character === "=") {
      tokens.push({ type: "equals", text: "=" });
      index += 1;
      continue;
    }

    throw new SolveError(`I don’t recognise “${character}” in an equation.`);
  }

  return tokens;
}

/**
 * Reduces a run of tokens to `ax + b`.
 *
 * The grammar is the one a pre-algebra expression can have: brackets,
 * multiplication and division, addition and subtraction, a unary minus, and
 * multiplication left implied next to a letter or a bracket, because `3x` and
 * `2(x + 1)` are how the work is actually written.
 */
function parseLinear(tokens: Token[], letter: string): Linear {
  let position = 0;

  const peek = (): Token | undefined => tokens[position];

  function parseSum(): Linear {
    let left = parseProduct();

    while (peek()?.type === "operator" && (peek()!.text === "+" || peek()!.text === "-")) {
      const operator = tokens[position++].text;
      const right = parseProduct();
      left =
        operator === "+"
          ? { a: add(left.a, right.a), b: add(left.b, right.b) }
          : { a: subtract(left.a, right.a), b: subtract(left.b, right.b) };
    }

    return left;
  }

  function parseProduct(): Linear {
    let left = parseUnary();

    for (;;) {
      const token = peek();

      if (token?.type === "operator" && (token.text === "*" || token.text === "/")) {
        position += 1;
        const right = parseUnary();
        left = token.text === "*" ? timesLinear(left, right) : overLinear(left, right);
        continue;
      }

      // Implied multiplication: `3x`, `2(x + 1)`, `(x + 1)(4)`.
      if (token?.type === "number" || token?.type === "letter" || token?.type === "open") {
        left = timesLinear(left, parseUnary());
        continue;
      }

      return left;
    }
  }

  function parseUnary(): Linear {
    const token = peek();
    if (token?.type === "operator" && (token.text === "+" || token.text === "-")) {
      position += 1;
      const operand = parseUnary();
      return token.text === "-" ? { a: negate(operand.a), b: negate(operand.b) } : operand;
    }
    return parseAtom();
  }

  function parseAtom(): Linear {
    const token = peek();

    if (token === undefined) {
      throw new SolveError("One side of the equation stops before it finishes.");
    }

    if (token.type === "number") {
      position += 1;
      return { a: ZERO, b: token.value! };
    }

    if (token.type === "letter") {
      if (token.text.toLowerCase() !== letter) {
        throw new SolveError(
          `There are two different letters in this equation — “${letter}” and “${token.text}”. Pre-algebra solves one unknown at a time.`,
        );
      }
      position += 1;
      return { a: ONE, b: ZERO };
    }

    if (token.type === "open") {
      position += 1;
      const inside = parseSum();
      if (peek()?.type !== "close") {
        throw new SolveError("A closing bracket is missing.");
      }
      position += 1;
      return inside;
    }

    if (token.type === "close") {
      throw new SolveError("There’s a closing bracket with nothing opening it.");
    }

    throw new SolveError(`There’s a “${token.text}” where a number should be.`);
  }

  function timesLinear(left: Linear, right: Linear): Linear {
    if (!isZero(left.a) && !isZero(right.a)) {
      throw new SolveError(
        `This multiplies ${letter} by ${letter}, which makes it a quadratic — that is algebra 1, not pre-algebra.`,
      );
    }
    // Whichever side is a plain number multiplies through the other.
    const [scalar, linear] = isZero(left.a) ? [left.b, right] : [right.b, left];
    return { a: multiply(linear.a, scalar), b: multiply(linear.b, scalar) };
  }

  function overLinear(left: Linear, right: Linear): Linear {
    if (!isZero(right.a)) {
      throw new SolveError(
        `This divides by ${letter}, which is beyond pre-algebra — the unknown has to stay out of the divisor.`,
      );
    }
    return { a: divide(left.a, right.b), b: divide(left.b, right.b) };
  }

  const result = parseSum();

  if (position < tokens.length) {
    const leftover = tokens[position];
    if (leftover.type === "close") {
      throw new SolveError("There’s a closing bracket with nothing opening it.");
    }
    throw new SolveError("I got lost partway through that side of the equation.");
  }

  return result;
}

/**
 * Writes the term in front of the letter the way it is written on paper.
 *
 * A fractional coefficient goes under the letter rather than in front of it:
 * a third of x is `x/3`, because `1/3x` reads as one over three-x, which is a
 * different expression.
 */
function formatTerm(coefficient: Fraction, letter: string): string {
  const sign = coefficient.numerator < 0 ? "−" : "";
  const magnitude = Math.abs(coefficient.numerator);
  const front = magnitude === 1 ? "" : String(magnitude);

  return coefficient.denominator === 1
    ? `${sign}${front}${letter}`
    : `${sign}${front}${letter}/${coefficient.denominator}`;
}

/** Writes `ax + b` back out the way it is written on paper. */
function formatLinear(linear: Linear, letter: string): string {
  if (isZero(linear.a)) return formatFraction(linear.b);

  const term = formatTerm(linear.a, letter);

  if (isZero(linear.b)) return term;
  const sign = linear.b.numerator < 0 ? "−" : "+";
  const size = formatFraction({ numerator: Math.abs(linear.b.numerator), denominator: linear.b.denominator });
  return `${term} ${sign} ${size}`;
}

/* --- The solver ----------------------------------------------------------- */

export interface SolveStep {
  /** What was done, in words: “Take 5 from both sides”. */
  instruction: string;
  /** The equation as it stands after that move. */
  equation: string;
}

export type SolveOutcome =
  | {
      ok: true;
      kind: "one-answer";
      letter: string;
      /** The answer as a fraction, exact. */
      value: Fraction;
      /** `x = 5`, ready to print. */
      answer: string;
      steps: SolveStep[];
      /** Both sides with the answer put back in, when the check is worth showing. */
      check: string | null;
    }
  | { ok: true; kind: "every-number" | "no-answer"; letter: string; note: string; steps: SolveStep[] }
  | { ok: false; message: string };

/** Finds the letter being solved for, so `3n + 5 = 20` works as well as `x`. */
function findLetter(tokens: Token[]): string | null {
  const letters = tokens.filter((token) => token.type === "letter");
  return letters.length === 0 ? null : letters[0].text.toLowerCase();
}

/**
 * Solves a linear equation in one unknown, and records the moves it made.
 *
 * The steps are the product here, not the answer: each one names the operation
 * applied to both sides and then shows the equation as it stands, which is the
 * layout a pre-algebra answer is expected to be written in.
 */
export function solveEquation(input: string): SolveOutcome {
  if (input.trim() === "") {
    return { ok: false, message: "There’s nothing to solve yet." };
  }

  try {
    const tokens = tokenize(input);
    const equalsSigns = tokens.filter((token) => token.type === "equals").length;

    if (equalsSigns === 0) {
      return {
        ok: false,
        message: "An equation needs an “=” in it. Try something like 3x + 5 = 20.",
      };
    }
    if (equalsSigns > 1) {
      return { ok: false, message: "There’s more than one “=” here. One equation at a time." };
    }

    const letter = findLetter(tokens);
    if (letter === null) {
      return {
        ok: false,
        message: "There’s no letter to solve for. Try something like 3x + 5 = 20.",
      };
    }

    const splitAt = tokens.findIndex((token) => token.type === "equals");
    const leftTokens = tokens.slice(0, splitAt);
    const rightTokens = tokens.slice(splitAt + 1);

    if (leftTokens.length === 0 || rightTokens.length === 0) {
      return { ok: false, message: "One side of the “=” is empty." };
    }

    let left = parseLinear(leftTokens, letter);
    let right = parseLinear(rightTokens, letter);

    const steps: SolveStep[] = [
      {
        instruction: "Start with the equation as it is written.",
        equation: `${formatLinear(left, letter)} = ${formatLinear(right, letter)}`,
      },
    ];

    // `7 = 2x` is turned round before anything else. Subtracting the right-hand
    // side from a bare number is correct but nobody works that way, and the
    // steps are the point of this solver.
    if (isZero(left.a) && !isZero(right.a)) {
      [left, right] = [right, left];
      steps.push({
        instruction: `Turn the equation round, so the ${letter} is on the left.`,
        equation: `${formatLinear(left, letter)} = ${formatLinear(right, letter)}`,
      });
    }

    // Move every letter to the left and every number to the right, which is the
    // order the balance rule is taught in.
    let workingLeft = left;
    let workingRight = right;

    if (!isZero(workingRight.a)) {
      const moved = workingRight.a;
      const moving = formatLinear({ a: { ...moved, numerator: Math.abs(moved.numerator) }, b: ZERO }, letter);
      workingLeft = { a: subtract(workingLeft.a, moved), b: workingLeft.b };
      workingRight = { a: ZERO, b: workingRight.b };
      steps.push({
        instruction:
          moved.numerator > 0
            ? `Take ${moving} from both sides, so every ${letter} is on the left.`
            : `Add ${moving} to both sides, so every ${letter} is on the left.`,
        equation: `${formatLinear(workingLeft, letter)} = ${formatLinear(workingRight, letter)}`,
      });
    }

    if (!isZero(workingLeft.b)) {
      const moved = workingLeft.b;
      const size = formatFraction({
        numerator: Math.abs(moved.numerator),
        denominator: moved.denominator,
      });
      workingRight = { a: ZERO, b: subtract(workingRight.b, moved) };
      workingLeft = { a: workingLeft.a, b: ZERO };
      steps.push({
        instruction:
          moved.numerator > 0
            ? `Take ${size} from both sides, so the ${letter} term is on its own.`
            : `Add ${size} to both sides, so the ${letter} term is on its own.`,
        equation: `${formatLinear(workingLeft, letter)} = ${formatLinear(workingRight, letter)}`,
      });
    }

    // What is left is `a·letter = b`.
    if (isZero(workingLeft.a)) {
      if (isZero(workingRight.b)) {
        return {
          ok: true,
          kind: "every-number",
          letter,
          note: `Both sides are the same expression, so every value of ${letter} makes this true. An equation like this is called an identity.`,
          steps,
        };
      }
      return {
        ok: true,
        kind: "no-answer",
        letter,
        note: `The letters cancel out and leave ${formatFraction(ZERO)} = ${formatFraction(workingRight.b)}, which is false. No value of ${letter} can make this equation true.`,
        steps,
      };
    }

    const value = divide(workingRight.b, workingLeft.a);

    if (!equals(workingLeft.a, ONE)) {
      // A whole number in front of the letter is divided away; a fraction is
      // multiplied by its upside-down, which is how the move is taught.
      const instruction =
        workingLeft.a.denominator === 1
          ? `Divide both sides by ${formatFraction(workingLeft.a)}.`
          : `Multiply both sides by ${formatFraction(divide(ONE, workingLeft.a))}, the upside-down of ${formatFraction(workingLeft.a)}.`;

      steps.push({ instruction, equation: `${letter} = ${formatFraction(value)}` });
    }

    // The check is the habit the course is trying to build, so it is shown
    // rather than left as advice: put the answer back into the original sides.
    const checkLeft = add(multiply(left.a, value), left.b);
    const checkRight = add(multiply(right.a, value), right.b);

    return {
      ok: true,
      kind: "one-answer",
      letter,
      value,
      answer: `${letter} = ${formatFraction(value)}`,
      steps,
      check: `Check: putting ${letter} = ${formatFraction(value)} back in gives ${formatFraction(checkLeft)} on the left and ${formatFraction(checkRight)} on the right.`,
    };
  } catch (error) {
    if (error instanceof SolveError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "I couldn’t work that one out." };
  }
}

/* --- Substitution --------------------------------------------------------- */

export type EvaluateOutcome =
  | { ok: true; letter: string | null; substituted: string; value: Fraction }
  | { ok: false; message: string };

/**
 * Evaluates an expression once a value is put in place of the letter.
 *
 * This is the other half of what pre-algebra asks — `evaluate 8(x + 3) when
 * x = 2` — and it is the same parser: substituting first makes every term a
 * plain number, which is a linear expression with nothing in front of the
 * letter.
 */
export function evaluateExpression(input: string, valueText: string): EvaluateOutcome {
  if (input.trim() === "") {
    return { ok: false, message: "There’s no expression to work out yet." };
  }

  try {
    const tokens = tokenize(input);

    if (tokens.some((token) => token.type === "equals")) {
      return {
        ok: false,
        message: "This works out an expression, so leave the “=” off — 8(x + 3), not 8(x + 3) = y.",
      };
    }

    const letter = findLetter(tokens);

    if (letter !== null && valueText.trim() === "") {
      return { ok: false, message: `Give ${letter} a value and this can be worked out.` };
    }

    let substitution: Fraction = ZERO;
    if (letter !== null) {
      const valueTokens = tokenize(valueText);
      if (valueTokens.some((token) => token.type === "letter" || token.type === "equals")) {
        return { ok: false, message: `The value of ${letter} has to be a number.` };
      }
      const parsedValue = parseLinear(valueTokens, letter);
      substitution = parsedValue.b;
    }

    // With the letter replaced by a number, `a` must come out at zero — and if
    // it does not, the expression was not linear in the first place.
    const parsed = parseLinear(tokens, letter ?? "x");
    const value = add(multiply(parsed.a, substitution), parsed.b);

    const substituted =
      letter === null
        ? input.trim()
        : input.trim().replace(new RegExp(letter, "gi"), `(${formatFraction(substitution)})`);

    return { ok: true, letter, substituted, value };
  } catch (error) {
    if (error instanceof SolveError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "I couldn’t work that one out." };
  }
}
