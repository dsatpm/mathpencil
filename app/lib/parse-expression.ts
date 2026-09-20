/**
 * A tokenizer and recursive-descent parser for written arithmetic.
 *
 * This is the docket's engine: someone pastes `(12 + 5) * 3 / 2` and gets an
 * answer. It is written by hand rather than handed to `eval` or `new Function`
 * on purpose — pasted text is untrusted input, and arbitrary code execution is
 * far too large a capability to hand a calculator.
 *
 * Grammar:
 *
 *   expression := term (("+" | "-") term)*
 *   term       := unary (("*" | "/") unary)*
 *   unary      := ("+" | "-") unary | primary
 *   primary    := number | "(" expression ")"
 */

export type ParseResult =
  | { ok: true; value: number; normalized: string }
  | { ok: false; message: string };

type TokenType = "number" | "operator" | "open" | "close";

interface Token {
  type: TokenType;
  /** The canonical form: `×` and `x` both arrive here as `*`. */
  text: string;
  value?: number;
  /** Index in the original input, so errors can quote the right character. */
  at: number;
}

/** Every character that means "multiply", including the ones people actually paste. */
const MULTIPLY = new Set(["*", "×", "x", "X", "·"]);
/** Every character that means "divide". */
const DIVIDE = new Set(["/", "÷", "∕"]);
/** Minus signs, including the typographic ones that come out of word processors. */
const MINUS = new Set(["-", "−", "–", "—"]);

const OPEN_BRACKETS = new Set(["(", "[", "{"]);
const CLOSE_BRACKETS = new Set([")", "]", "}"]);

/** Human names for operators, used in error messages so they read as words. */
const OPERATOR_NAMES: Record<string, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

function isDigit(character: string): boolean {
  return character >= "0" && character <= "9";
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
      const start = index;
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

      const value = Number(digits);
      if (!Number.isFinite(value)) {
        return { message: `“${digits}” isn’t a number I can read.` };
      }
      tokens.push({ type: "number", text: digits, value, at: start });
      continue;
    }

    if (character === "+") {
      tokens.push({ type: "operator", text: "+", at: index });
      index += 1;
      continue;
    }
    if (MINUS.has(character)) {
      tokens.push({ type: "operator", text: "-", at: index });
      index += 1;
      continue;
    }
    if (MULTIPLY.has(character)) {
      tokens.push({ type: "operator", text: "*", at: index });
      index += 1;
      continue;
    }
    if (DIVIDE.has(character)) {
      tokens.push({ type: "operator", text: "/", at: index });
      index += 1;
      continue;
    }
    if (OPEN_BRACKETS.has(character)) {
      tokens.push({ type: "open", text: "(", at: index });
      index += 1;
      continue;
    }
    if (CLOSE_BRACKETS.has(character)) {
      tokens.push({ type: "close", text: ")", at: index });
      index += 1;
      continue;
    }

    if (character === "=") {
      return { message: "Leave the “=” off — just the sum itself." };
    }
    if (character === "%") {
      return { message: "Percent signs aren’t supported here. Write it as ÷ 100 instead." };
    }

    return { message: `I don’t recognise “${character}” in a sum.` };
  }

  return tokens;
}

/** Thrown internally by the parser and converted to a message at the boundary. */
class ParseError extends Error {}

function parseTokens(tokens: Token[]): number {
  let position = 0;

  const peek = (): Token | undefined => tokens[position];

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

    while (peek()?.type === "operator" && (peek()!.text === "*" || peek()!.text === "/")) {
      const operator = tokens[position++];
      const right = parseUnary();

      if (operator.text === "/") {
        if (right === 0) throw new ParseError("That divides by zero, which has no answer.");
        left = left / right;
      } else {
        left = left * right;
      }
    }

    return left;
  }

  function parseUnary(): number {
    const token = peek();
    if (token?.type === "operator" && (token.text === "+" || token.text === "-")) {
      position += 1;
      const operand = parseUnary();
      return token.text === "-" ? -operand : operand;
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    const token = peek();

    if (token === undefined) {
      const previous = tokens[position - 1];
      if (previous?.type === "operator") {
        throw new ParseError(`There’s a number missing after the “${OPERATOR_NAMES[previous.text]}”.`);
      }
      throw new ParseError("The sum stops before it finishes.");
    }

    if (token.type === "number") {
      position += 1;
      return token.value!;
    }

    if (token.type === "open") {
      position += 1;
      const value = parseExpression();
      if (peek()?.type !== "close") {
        throw new ParseError("A closing bracket is missing.");
      }
      position += 1;
      return value;
    }

    if (token.type === "close") {
      throw new ParseError("There’s a closing bracket with nothing opening it.");
    }

    throw new ParseError(`There’s a “${OPERATOR_NAMES[token.text] ?? token.text}” where a number should be.`);
  }

  const result = parseExpression();

  if (position < tokens.length) {
    const leftover = tokens[position];
    if (leftover.type === "close") {
      throw new ParseError("There’s a closing bracket with nothing opening it.");
    }
    if (leftover.type === "number") {
      throw new ParseError("Two numbers sit next to each other with no operator between them.");
    }
    throw new ParseError("I got lost partway through that sum.");
  }

  return result;
}

/** Rewrites the tokens the way the tape prints them, so the docket echoes back what it understood. */
function normalize(tokens: Token[]): string {
  let output = "";

  tokens.forEach((token, index) => {
    const previous = tokens[index - 1];

    if (token.type === "number") {
      if (previous && (previous.type === "number" || previous.type === "close")) output += " ";
      output += token.text;
      return;
    }

    if (token.type === "open") {
      if (previous && (previous.type === "number" || previous.type === "close")) output += " ";
      output += "(";
      return;
    }

    if (token.type === "close") {
      output += ")";
      return;
    }

    const isUnary =
      previous === undefined || previous.type === "operator" || previous.type === "open";
    output += isUnary ? OPERATOR_NAMES[token.text] : ` ${OPERATOR_NAMES[token.text]} `;
  });

  return output;
}

/**
 * Evaluates a written arithmetic expression.
 *
 * Always returns a result object; it never throws and never returns a bare
 * blank, so the docket has something to print in every case.
 */
export function parseExpression(input: string): ParseResult {
  if (input.trim() === "") {
    return { ok: false, message: "There’s nothing on the docket yet." };
  }

  const tokenized = tokenize(input);
  if (!Array.isArray(tokenized)) {
    return { ok: false, message: tokenized.message };
  }
  if (tokenized.length === 0) {
    return { ok: false, message: "There’s nothing on the docket yet." };
  }

  try {
    const value = parseTokens(tokenized);

    if (!Number.isFinite(value)) {
      return { ok: false, message: "That answer is too large to print." };
    }

    return { ok: true, value, normalized: normalize(tokenized) };
  } catch (error) {
    if (error instanceof ParseError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "I couldn’t work that one out." };
  }
}
