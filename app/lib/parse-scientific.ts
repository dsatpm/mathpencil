/**
 * The scientific instrument's engine: a tokenizer and recursive-descent parser
 * for written arithmetic with functions, powers and constants.
 *
 * It is a second parser rather than an extension of the docket's
 * {@link ../lib/parse-expression} on purpose. The docket reads a sum a person
 * copied out of an email, so its grammar is deliberately small and its errors
 * talk about brackets and decimal points. This one reads what the scientific
 * keypad builds — `sin(30)`, `2^10`, `5!`, `π × 2` — and has to know about angle
 * modes, domains and factorials. Keeping them apart means neither grows
 * behaviour the other has to explain.
 *
 * Like the docket's parser, this is written by hand and never calls `eval` or
 * `new Function`: the expression is assembled from keys, but it is still text,
 * and running arbitrary code is far too large a capability for a calculator.
 *
 * Grammar:
 *
 *   expression := term (("+" | "-") term)*
 *   term       := unary (("*" | "/" | "mod") unary | implicit-unary)*
 *   unary      := ("+" | "-") unary | power
 *   power      := postfix ("^" unary)?            — right associative
 *   postfix    := primary ("!" | "%" | "²" | "³" | "⁻¹")*
 *   primary    := number | constant | "Ans" | function "(" expression ")"
 *               | "(" expression ")"
 */

export type AngleMode = "deg" | "rad";

export interface ScientificContext {
  angleMode: AngleMode;
  /** The last struck answer, which the `Ans` key refers to. */
  ans: number;
}

export type ScientificResult =
  | { ok: true; value: number }
  | { ok: false; message: string };

type TokenType = "number" | "operator" | "postfix" | "function" | "open" | "close";

interface Token {
  type: TokenType;
  /** The canonical form: `×` arrives here as `*`, `√` as the function `sqrt`. */
  text: string;
  value?: number;
}

/** Every character that means multiply, including the ones a keypad prints. */
const MULTIPLY = new Set(["*", "×", "·"]);
/** Every character that means divide. */
const DIVIDE = new Set(["/", "÷", "∕"]);
/** Minus signs, including the typographic ones the keypad and word processors use. */
const MINUS = new Set(["-", "−", "–", "—"]);

const OPEN_BRACKETS = new Set(["(", "[", "{"]);
const CLOSE_BRACKETS = new Set([")", "]", "}"]);

/** Single-character function keys, expanded to the name the parser applies. */
const FUNCTION_GLYPHS: Record<string, string> = {
  "√": "sqrt",
  "∛": "cbrt",
};

/** Postfix operators, longest first so `⁻¹` is read before a bare `⁻`. */
const POSTFIX_GLYPHS = ["⁻¹", "!", "%", "²", "³"];

/** Names the parser answers to. Everything is matched lower-case. */
const FUNCTION_NAMES = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "ln",
  "log",
  "exp",
  "sqrt",
  "cbrt",
  "abs",
  "round",
  "floor",
  "ceil",
]);

/** How each function is written when it appears in an error message. */
const FUNCTION_LABELS: Record<string, string> = {
  sqrt: "√",
  cbrt: "∛",
  ln: "ln",
  log: "log",
  asin: "sin⁻¹",
  acos: "cos⁻¹",
};

/** Human names for operators, so error messages read as words. */
const OPERATOR_NAMES: Record<string, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
  "^": "^",
  mod: "mod",
};

/** Thrown internally by the parser and turned into a message at the boundary. */
class ScientificError extends Error {}

function isDigit(character: string): boolean {
  return character >= "0" && character <= "9";
}

function isLetter(character: string): boolean {
  return /[a-z]/i.test(character);
}

function tokenize(input: string): Token[] | { message: string } {
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
          // A thousands separator inside a number: `1,250` is one number.
          index += 1;
        } else if (next === "." && !seenPoint) {
          seenPoint = true;
          digits += next;
          index += 1;
        } else if (next === "." && seenPoint) {
          return { message: "That number has two decimal points in it." };
        } else {
          break;
        }
      }

      // Exponent notation, so a figure the display printed as `1.000000e15` can
      // be read straight back in. A bare `e` after a number is still the
      // constant — `2e` is two times e — because only digits make an exponent.
      const exponentMark = input[index];
      if (exponentMark === "e" || exponentMark === "E") {
        const signed = MINUS.has(input[index + 1] ?? "") || input[index + 1] === "+";
        const firstExponentDigit = signed ? index + 2 : index + 1;
        if (isDigit(input[firstExponentDigit] ?? "")) {
          digits += "e";
          if (signed) digits += MINUS.has(input[index + 1]) ? "-" : "+";
          index = firstExponentDigit;
          while (index < input.length && isDigit(input[index])) {
            digits += input[index];
            index += 1;
          }
        }
      }

      const value = Number(digits);
      if (!Number.isFinite(value)) {
        return { message: `“${digits}” isn’t a number I can read.` };
      }
      tokens.push({ type: "number", text: digits, value });
      continue;
    }

    const postfix = POSTFIX_GLYPHS.find((glyph) => input.startsWith(glyph, index));
    if (postfix !== undefined) {
      tokens.push({ type: "postfix", text: postfix });
      index += postfix.length;
      continue;
    }

    if (FUNCTION_GLYPHS[character] !== undefined) {
      tokens.push({ type: "function", text: FUNCTION_GLYPHS[character] });
      index += 1;
      continue;
    }

    if (character === "π") {
      tokens.push({ type: "number", text: "π", value: Math.PI });
      index += 1;
      continue;
    }

    if (isLetter(character)) {
      let name = "";
      while (index < input.length && isLetter(input[index])) {
        name += input[index];
        index += 1;
      }
      const lowered = name.toLowerCase();

      if (FUNCTION_NAMES.has(lowered)) {
        tokens.push({ type: "function", text: lowered });
        continue;
      }
      if (lowered === "mod") {
        tokens.push({ type: "operator", text: "mod" });
        continue;
      }
      if (lowered === "ans") {
        // Resolved later, against the context, so the token carries no value yet.
        tokens.push({ type: "number", text: "Ans" });
        continue;
      }
      if (lowered === "e") {
        tokens.push({ type: "number", text: "e", value: Math.E });
        continue;
      }
      if (lowered === "pi") {
        tokens.push({ type: "number", text: "π", value: Math.PI });
        continue;
      }

      return { message: `I don’t know a function called “${name}”.` };
    }

    if (character === "+") {
      tokens.push({ type: "operator", text: "+" });
      index += 1;
      continue;
    }
    if (MINUS.has(character)) {
      tokens.push({ type: "operator", text: "-" });
      index += 1;
      continue;
    }
    if (MULTIPLY.has(character)) {
      tokens.push({ type: "operator", text: "*" });
      index += 1;
      continue;
    }
    if (DIVIDE.has(character)) {
      tokens.push({ type: "operator", text: "/" });
      index += 1;
      continue;
    }
    if (character === "^") {
      tokens.push({ type: "operator", text: "^" });
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
      return { message: "Leave the “=” off — just the expression itself." };
    }

    return { message: `I don’t recognise “${character}” in an expression.` };
  }

  return tokens;
}

/* --- Trigonometry ---------------------------------------------------------
   In degrees the quarter turns are exact, so they are answered exactly rather
   than left to a radian conversion: `sin 180` is 0, not 1.2246×10⁻¹⁶, and a
   figure that small would print in exponential form and read as a fault.
------------------------------------------------------------------------- */

function sinDegrees(degrees: number): number {
  const turn = ((degrees % 360) + 360) % 360;
  if (turn === 0 || turn === 180) return 0;
  if (turn === 90) return 1;
  if (turn === 270) return -1;
  return Math.sin((degrees * Math.PI) / 180);
}

function cosDegrees(degrees: number): number {
  return sinDegrees(degrees + 90);
}

function tanDegrees(degrees: number): number {
  const turn = ((degrees % 180) + 180) % 180;
  if (turn === 0) return 0;
  if (turn === 90) {
    throw new ScientificError("The tangent of 90° has no value.");
  }
  return Math.tan((degrees * Math.PI) / 180);
}

function factorial(value: number): number {
  if (!Number.isInteger(value)) {
    throw new ScientificError("A factorial needs a whole number.");
  }
  if (value < 0) {
    throw new ScientificError("There’s no factorial of a negative number.");
  }
  let product = 1;
  for (let step = 2; step <= value; step += 1) {
    product *= step;
    if (!Number.isFinite(product)) {
      throw new ScientificError("That factorial is too large to print.");
    }
  }
  return product;
}

function applyFunction(name: string, argument: number, context: ScientificContext): number {
  const toRadians = (value: number) =>
    context.angleMode === "deg" ? (value * Math.PI) / 180 : value;
  const fromRadians = (value: number) =>
    context.angleMode === "deg" ? (value * 180) / Math.PI : value;

  switch (name) {
    case "sin":
      return context.angleMode === "deg" ? sinDegrees(argument) : Math.sin(argument);
    case "cos":
      return context.angleMode === "deg" ? cosDegrees(argument) : Math.cos(argument);
    case "tan":
      return context.angleMode === "deg" ? tanDegrees(argument) : Math.tan(argument);
    case "asin":
    case "acos":
      if (argument < -1 || argument > 1) {
        throw new ScientificError(
          `${FUNCTION_LABELS[name]} only takes a number between −1 and 1.`,
        );
      }
      return fromRadians(name === "asin" ? Math.asin(argument) : Math.acos(argument));
    case "atan":
      return fromRadians(Math.atan(argument));
    case "sinh":
      return Math.sinh(argument);
    case "cosh":
      return Math.cosh(argument);
    case "tanh":
      return Math.tanh(argument);
    case "ln":
    case "log":
      if (argument === 0) {
        throw new ScientificError(`${FUNCTION_LABELS[name]} of zero has no value.`);
      }
      if (argument < 0) {
        throw new ScientificError(`There’s no ${FUNCTION_LABELS[name]} of a negative number.`);
      }
      return name === "ln" ? Math.log(argument) : Math.log10(argument);
    case "exp":
      return Math.exp(argument);
    case "sqrt":
      if (argument < 0) {
        throw new ScientificError("There’s no square root of a negative number.");
      }
      return Math.sqrt(argument);
    case "cbrt":
      return Math.cbrt(argument);
    case "abs":
      return Math.abs(argument);
    case "round":
      return Math.round(argument);
    case "floor":
      return Math.floor(argument);
    case "ceil":
      return Math.ceil(argument);
    default:
      throw new ScientificError(`I don’t know a function called “${name}”.`);
  }
}

function parseTokens(tokens: Token[], context: ScientificContext): number {
  let position = 0;

  const peek = (): Token | undefined => tokens[position];

  /** True when the next token could begin a value, which is what makes `2π` a product. */
  function startsValue(token: Token | undefined): boolean {
    if (token === undefined) return false;
    return token.type === "number" || token.type === "function" || token.type === "open";
  }

  function parseExpression(): number {
    let left = parseTerm();

    while (peek()?.type === "operator" && (peek()!.text === "+" || peek()!.text === "-")) {
      const operator = tokens[position++];
      const right = parseTerm();
      left = operator.text === "+" ? left + right : left - right;
    }

    return left;
  }

  function parseTerm(): number {
    let left = parseUnary();

    for (;;) {
      const token = peek();

      if (
        token?.type === "operator" &&
        (token.text === "*" || token.text === "/" || token.text === "mod")
      ) {
        position += 1;
        const right = parseUnary();

        if (token.text === "*") {
          left = left * right;
        } else if (right === 0) {
          throw new ScientificError("That divides by zero, which has no answer.");
        } else {
          left = token.text === "/" ? left / right : left % right;
        }
        continue;
      }

      // Implicit multiplication: `2π`, `3(4 + 1)`, `2sin(30)`. A keypad that
      // prints `π` as a key makes this the expected reading, not a courtesy.
      if (startsValue(token)) {
        left = left * parseUnary();
        continue;
      }

      return left;
    }
  }

  function parseUnary(): number {
    const token = peek();
    if (token?.type === "operator" && (token.text === "+" || token.text === "-")) {
      position += 1;
      const operand = parseUnary();
      return token.text === "-" ? -operand : operand;
    }
    return parsePower();
  }

  function parsePower(): number {
    const base = parsePostfix();

    if (peek()?.type === "operator" && peek()!.text === "^") {
      position += 1;
      // Right associative, and the exponent may be signed: `2^-3`.
      const exponent = parseUnary();
      const raised = base ** exponent;
      if (Number.isNaN(raised)) {
        throw new ScientificError("That power has no real value.");
      }
      return raised;
    }

    return base;
  }

  function parsePostfix(): number {
    let value = parsePrimary();

    for (;;) {
      const token = peek();
      if (token?.type !== "postfix") return value;
      position += 1;

      switch (token.text) {
        case "!":
          value = factorial(value);
          break;
        case "%":
          value = value / 100;
          break;
        case "²":
          value = value * value;
          break;
        case "³":
          value = value * value * value;
          break;
        case "⁻¹":
          if (value === 0) {
            throw new ScientificError("One divided by zero has no answer.");
          }
          value = 1 / value;
          break;
      }
    }
  }

  function parsePrimary(): number {
    const token = peek();

    if (token === undefined) {
      const previous = tokens[position - 1];
      if (previous?.type === "operator") {
        throw new ScientificError(
          `There’s a number missing after the “${OPERATOR_NAMES[previous.text]}”.`,
        );
      }
      throw new ScientificError("The expression stops before it finishes.");
    }

    if (token.type === "number") {
      position += 1;
      return token.text === "Ans" ? context.ans : token.value!;
    }

    if (token.type === "function") {
      position += 1;
      const name = token.text;

      if (peek()?.type !== "open") {
        throw new ScientificError(
          `${FUNCTION_LABELS[name] ?? name} needs a bracket after it.`,
        );
      }
      position += 1;
      const argument = parseExpression();
      // An unclosed bracket at the very end is what a keypad leaves behind
      // mid-thought, so it closes itself rather than reading as a mistake.
      if (peek()?.type === "close") position += 1;
      else if (position < tokens.length) {
        throw new ScientificError("A closing bracket is missing.");
      }

      return applyFunction(name, argument, context);
    }

    if (token.type === "open") {
      position += 1;
      const value = parseExpression();
      if (peek()?.type === "close") position += 1;
      else if (position < tokens.length) {
        throw new ScientificError("A closing bracket is missing.");
      }
      return value;
    }

    if (token.type === "close") {
      throw new ScientificError("There’s a closing bracket with nothing opening it.");
    }

    throw new ScientificError(
      `There’s a “${OPERATOR_NAMES[token.text] ?? token.text}” where a number should be.`,
    );
  }

  const result = parseExpression();

  if (position < tokens.length) {
    const leftover = tokens[position];
    if (leftover.type === "close") {
      throw new ScientificError("There’s a closing bracket with nothing opening it.");
    }
    throw new ScientificError("I got lost partway through that expression.");
  }

  return result;
}

/**
 * Evaluates a scientific expression.
 *
 * Always returns a result object; it never throws, so the display has something
 * to show in every case — a figure, or a sentence saying what is wrong with it.
 */
export function evaluateScientific(
  input: string,
  context: ScientificContext,
): ScientificResult {
  if (input.trim() === "") {
    return { ok: false, message: "There’s nothing entered yet." };
  }

  const tokenized = tokenize(input);
  if (!Array.isArray(tokenized)) {
    return { ok: false, message: tokenized.message };
  }
  if (tokenized.length === 0) {
    return { ok: false, message: "There’s nothing entered yet." };
  }

  try {
    const value = parseTokens(tokenized, context);

    if (Number.isNaN(value)) {
      return { ok: false, message: "That has no real value." };
    }
    if (!Number.isFinite(value)) {
      return { ok: false, message: "That answer is too large to print." };
    }

    return { ok: true, value };
  } catch (error) {
    if (error instanceof ScientificError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "I couldn’t work that one out." };
  }
}
