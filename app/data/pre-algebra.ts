/**
 * Everything the pre-algebra page says, kept as data.
 *
 * The page is a lesson rather than an instrument, so its content is the thing
 * most likely to change — a topic added, a formula reworded, an example
 * replaced. Holding it here means those edits are one line in a list rather
 * than a change to a layout, and the contents list down the left gutter is
 * generated from the same objects the page renders, so the two can never
 * disagree about what is on the page.
 */

/** A section of the page, and the entry it gets in the contents list. */
export interface PageSection {
  /** The `id` the heading carries, and the anchor the contents list points at. */
  id: string;
  /** The words in the contents list, which are also the heading. */
  title: string;
}

export const SECTIONS: PageSection[] = [
  { id: "what-is-pre-algebra", title: "What is pre-algebra?" },
  { id: "how-it-differs", title: "Pre-algebra, algebra and algebra 2" },
  { id: "topics", title: "Pre-algebra topics" },
  { id: "formulas", title: "Formulas worth knowing" },
  { id: "examples", title: "Worked examples" },
  { id: "solver", title: "Work an equation out" },
  { id: "questions", title: "Common questions" },
];

/** One row of the comparison between the three courses. */
export interface CourseRow {
  aspect: string;
  preAlgebra: string;
  algebra: string;
  algebraTwo: string;
}

export const COURSE_ROWS: CourseRow[] = [
  {
    aspect: "What you work with",
    preAlgebra: "Numbers, with a letter standing in for one unknown.",
    algebra: "Expressions and equations as objects in their own right.",
    algebraTwo: "Whole families of functions, and how they behave.",
  },
  {
    aspect: "A typical question",
    preAlgebra: "Solve 3x + 5 = 20.",
    algebra: "Factorise x² − 5x + 6, then solve it.",
    algebraTwo: "Solve log₂(x + 3) = 5, or sketch y = 2ˣ⁻¹.",
  },
  {
    aspect: "How many steps",
    preAlgebra: "One or two: undo what was done to x.",
    algebra: "Several, and you choose the method.",
    algebraTwo: "Several methods combined, often with a graph attached.",
  },
  {
    aspect: "What it is teaching",
    preAlgebra: "That arithmetic has rules, and the rules hold when a number is missing.",
    algebra: "That a relationship can be written down, rearranged and solved.",
    algebraTwo: "That functions have shapes, and the shape predicts the answer.",
  },
  {
    aspect: "Where it usually sits",
    preAlgebra: "The bridge between arithmetic and algebra — often grades 6–8.",
    algebra: "The first full algebra course, often grades 8–9.",
    algebraTwo: "After geometry, often grades 10–11.",
  },
];

/** One topic taught in pre-algebra. */
export interface Topic {
  name: string;
  /** What the topic is, in a sentence a student would recognise. */
  summary: string;
  /** A question of the kind this topic asks. */
  looksLike: string;
}

/**
 * The topics, in roughly the order a course meets them.
 *
 * Adding one is a single object; the contents list, the count in the
 * introduction and the page's structured data all follow from this array.
 */
export const TOPICS: Topic[] = [
  {
    name: "Number theory",
    summary:
      "What whole numbers are made of: primes and composites, divisibility rules, prime factorisation, square and cube numbers.",
    looksLike: "Write 84 as a product of primes.",
  },
  {
    name: "Factors and multiples",
    summary:
      "Every number that divides a number, and every number it divides into — leading to the highest common factor and the lowest common multiple.",
    looksLike: "Find the HCF of 24 and 36, and their LCM.",
  },
  {
    name: "Integers and negative numbers",
    summary:
      "Numbers either side of zero, and the rules for adding, subtracting, multiplying and dividing them without losing the sign.",
    looksLike: "Work out −7 − (−12).",
  },
  {
    name: "Fractions and decimals",
    summary:
      "Equivalent fractions, simplifying, the four operations on fractions, and the conversions between fractions, decimals and percentages.",
    looksLike: "Add ⅝ and ⅓, then write the answer as a decimal.",
  },
  {
    name: "Ratio and proportion",
    summary:
      "Comparing quantities, sharing an amount in a given ratio, and solving a proportion where one of the four numbers is missing.",
    looksLike: "Share £60 between two people in the ratio 3 : 2.",
  },
  {
    name: "Percentages",
    summary:
      "Percentage of an amount, percentage increase and decrease, and working backwards from a changed figure to the original.",
    looksLike: "A coat is £48 after a 20% discount. What was it before?",
  },
  {
    name: "Exponents and square roots",
    summary:
      "Powers as repeated multiplication, the index laws, square and cube roots, and standard form for very large or very small numbers.",
    looksLike: "Simplify 2³ × 2⁴, then find √144.",
  },
  {
    name: "Order of operations",
    summary:
      "The agreed order — brackets, indices, division and multiplication, then addition and subtraction — that makes one expression mean one thing.",
    looksLike: "Work out 8 + 3 × (10 − 6)².",
  },
  {
    name: "Variables and expressions",
    summary:
      "Letters standing for numbers, writing a situation as an expression, substituting a value, and collecting like terms.",
    looksLike: "Evaluate 8(x + 3) when x = 2.",
  },
  {
    name: "Linear equations",
    summary:
      "One unknown, and the balance rule: whatever is done to one side is done to the other until the letter stands alone.",
    looksLike: "Solve 5x − 4 = 3x + 10.",
  },
  {
    name: "Inequalities",
    summary:
      "The same balance rule with < and >, plus the one place it changes — multiplying or dividing by a negative turns the sign around.",
    looksLike: "Solve −2x + 1 < 9 and show it on a number line.",
  },
  {
    name: "The coordinate plane",
    summary:
      "Plotting points as ordered pairs, the four quadrants, and reading a straight line as a rule connecting x and y.",
    looksLike: "Plot (−3, 2) and (1, −4), then find the distance across.",
  },
  {
    name: "Perimeter, area and volume",
    summary:
      "The measurements of rectangles, triangles, circles and cuboids, and the units each one is counted in.",
    looksLike: "Find the area of a triangle with base 10 cm and height 6 cm.",
  },
  {
    name: "Measurement and units",
    summary:
      "Converting between units of length, mass, capacity and time, and keeping units consistent inside a calculation.",
    looksLike: "Convert 2.5 hours into minutes, then into seconds.",
  },
  {
    name: "Statistics and averages",
    summary:
      "Mean, median, mode and range, reading a table or chart, and knowing which average a question is actually asking for.",
    looksLike: "Find the mean and the median of 4, 7, 7, 9, 13.",
  },
  {
    name: "Probability",
    summary:
      "How likely something is, written as a fraction between 0 and 1, and the outcomes that make up a simple experiment.",
    looksLike: "A bag holds 3 red and 5 blue counters. What is P(red)?",
  },
  {
    name: "Word problems",
    summary:
      "Turning a sentence into arithmetic or an equation — the skill every other topic on this list is eventually used for.",
    looksLike: "A train covers 210 km in 3 hours. What is its average speed?",
  },
];

/** One formula, with what each letter in it means. */
export interface Formula {
  name: string;
  /** Written the way it is set on paper. */
  expression: string;
  meaning: string;
}

export interface FormulaGroup {
  heading: string;
  formulas: Formula[];
}

export const FORMULA_GROUPS: FormulaGroup[] = [
  {
    heading: "Money",
    formulas: [
      {
        name: "Profit",
        expression: "Profit = selling price − cost price",
        meaning: "What is left when what you paid comes off what you sold it for.",
      },
      {
        name: "Loss",
        expression: "Loss = cost price − selling price",
        meaning: "The same subtraction the other way round, when the sale was the smaller figure.",
      },
      {
        name: "Profit percentage",
        expression: "Profit % = (profit ÷ cost price) × 100",
        meaning: "Profit measured against what it cost, never against what it sold for.",
      },
      {
        name: "Discount",
        expression: "Discount = marked price − sale price",
        meaning: "The amount taken off. As a percentage it is discount ÷ marked price × 100.",
      },
      {
        name: "Sale price",
        expression: "Sale price = marked price × (100 − discount %) ÷ 100",
        meaning: "What you actually pay once the percentage has come off.",
      },
      {
        name: "Simple interest",
        expression: "I = (P × R × T) ÷ 100",
        meaning: "P is the amount borrowed or saved, R the rate per year, T the number of years.",
      },
    ],
  },
  {
    heading: "Proportion and percentage",
    formulas: [
      {
        name: "Percentage of an amount",
        expression: "Part = (percentage ÷ 100) × whole",
        meaning: "A percentage is a fraction out of a hundred, and “of” means multiply.",
      },
      {
        name: "Percentage change",
        expression: "Change % = (new − old) ÷ old × 100",
        meaning: "A negative answer is a decrease. The old figure is always the one on the bottom.",
      },
      {
        name: "Proportion",
        expression: "a ÷ b = c ÷ d, so a × d = b × c",
        meaning: "Cross multiplication: the trick that turns a proportion into an equation.",
      },
      {
        name: "Unit rate",
        expression: "Rate = total ÷ number of units",
        meaning: "Price per kilogram, words per minute, miles per gallon — all the same division.",
      },
    ],
  },
  {
    heading: "Motion and measurement",
    formulas: [
      {
        name: "Speed",
        expression: "Speed = distance ÷ time",
        meaning:
          "Rearranged: distance = speed × time, and time = distance ÷ speed. The units must match — km and hours give km/h.",
      },
      {
        name: "Average",
        expression: "Mean = sum of the values ÷ how many values",
        meaning: "Add them all up, divide by the count.",
      },
      {
        name: "Perimeter of a rectangle",
        expression: "P = 2(l + w)",
        meaning: "The distance once around the outside.",
      },
      {
        name: "Area of a rectangle",
        expression: "A = l × w",
        meaning: "Counted in square units — cm², m².",
      },
      {
        name: "Area of a triangle",
        expression: "A = ½ × base × height",
        meaning: "The height is the perpendicular height, not the sloping side.",
      },
      {
        name: "Circle",
        expression: "C = 2πr   and   A = πr²",
        meaning: "Circumference is the way around; area is the space inside.",
      },
      {
        name: "Volume of a cuboid",
        expression: "V = l × w × h",
        meaning: "Counted in cubic units — cm³, m³.",
      },
    ],
  },
  {
    heading: "Numbers and powers",
    formulas: [
      {
        name: "Pythagoras' theorem",
        expression: "a² + b² = c²",
        meaning:
          "In a right-angled triangle, c is the hypotenuse — the side opposite the right angle, always the longest.",
      },
      {
        name: "Index laws",
        expression: "aᵐ × aⁿ = aᵐ⁺ⁿ,  aᵐ ÷ aⁿ = aᵐ⁻ⁿ,  (aᵐ)ⁿ = aᵐⁿ",
        meaning: "Add the powers to multiply, subtract to divide, multiply to raise a power to a power.",
      },
      {
        name: "Square root",
        expression: "√a × √a = a",
        meaning: "The square root undoes the square. √144 is 12, because 12 × 12 is 144.",
      },
      {
        name: "Order of operations",
        expression: "Brackets → Indices → ÷ and × → + and −",
        meaning:
          "Division and multiplication rank equally and are worked left to right, and so do addition and subtraction.",
      },
    ],
  },
];

/** A worked example: the question, the steps, and the answer at the end. */
export interface WorkedExample {
  title: string;
  question: string;
  steps: string[];
  answer: string;
}

export const EXAMPLES: WorkedExample[] = [
  {
    title: "Example 1 — substituting a value",
    question: "Evaluate the expression 8 × (x + 3), where x = 2.",
    steps: [
      "Put the value in place of the letter: 8 × (2 + 3).",
      "Brackets first: 2 + 3 = 5.",
      "Then multiply: 8 × 5 = 40.",
    ],
    answer: "40",
  },
  {
    title: "Example 2 — a linear equation",
    question: "Solve 3x + 5 = 20.",
    steps: [
      "Take 5 from both sides, so the term with x is alone: 3x = 15.",
      "Divide both sides by 3: x = 5.",
      "Check by putting it back: 3 × 5 + 5 = 20. ✓",
    ],
    answer: "x = 5",
  },
  {
    title: "Example 3 — order of operations",
    question: "Work out 8 + 3 × (10 − 6)².",
    steps: [
      "Brackets first: 10 − 6 = 4, so the expression is 8 + 3 × 4².",
      "Indices next: 4² = 16, so it is 8 + 3 × 16.",
      "Multiplication before addition: 3 × 16 = 48.",
      "Finally the addition: 8 + 48 = 56.",
    ],
    answer: "56",
  },
  {
    title: "Example 4 — percentage and discount",
    question: "A jacket is marked at $80 and is reduced by 15%. What does it cost?",
    steps: [
      "Find the discount: 15 ÷ 100 × 80 = $12.",
      "Take it off the marked price: 80 − 12 = $68.",
      "Or in one step: 80 × (100 − 15) ÷ 100 = 80 × 0.85 = $68.",
    ],
    answer: "$68",
  },
  {
    title: "Example 5 — speed",
    question: "A train covers 210 km in 3 hours. What is its average speed?",
    steps: [
      "Speed = distance ÷ time.",
      "Both units are already the ones the answer wants: kilometres and hours.",
      "210 ÷ 3 = 70.",
    ],
    answer: "70 km/h",
  },
  {
    title: "Example 6 — Pythagoras' theorem",
    question: "A right-angled triangle has shorter sides of 6 cm and 8 cm. How long is the hypotenuse?",
    steps: [
      "a² + b² = c², so 6² + 8² = c².",
      "36 + 64 = 100, so c² = 100.",
      "Take the square root of both sides: c = √100 = 10.",
    ],
    answer: "10 cm",
  },
  {
    title: "Example 7 — ratio",
    question: "Share $60 between two people in the ratio 3 : 2.",
    steps: [
      "Add the parts of the ratio: 3 + 2 = 5 parts in total.",
      "Find one part: 60 ÷ 5 = $12.",
      "Multiply out: 3 × 12 = $36 and 2 × 12 = $24.",
      "Check they add back to the whole: 36 + 24 = $60. ✓",
    ],
    answer: "$36 and $24",
  },
  {
    title: "Example 8 — factors and multiples",
    question: "Find the highest common factor and the lowest common multiple of 24 and 36.",
    steps: [
      "Write each as a product of primes: 24 = 2³ × 3, and 36 = 2² × 3².",
      "For the HCF take the lowest power of each shared prime: 2² × 3 = 12.",
      "For the LCM take the highest power of every prime: 2³ × 3² = 72.",
    ],
    answer: "HCF 12, LCM 72",
  },
];

/** The questions this subject actually raises. Mirrored into FAQ structured data. */
export const PRE_ALGEBRA_FAQ: Array<{ question: string; answer: string }> = [
  {
    question: "What is pre-algebra, in one sentence?",
    answer:
      "Pre-algebra is the course that takes arithmetic — whole numbers, fractions, decimals, percentages — and shows that its rules still hold when one of the numbers is missing and a letter is standing in its place. It is the bridge between working out 3 × 5 + 5 and solving 3x + 5 = 20.",
  },
  {
    question: "How is pre-algebra different from algebra 1?",
    answer:
      "Pre-algebra handles one unknown at a time and asks you to undo what was done to it, one step at a time. Algebra 1 treats the expression itself as the object: you factorise it, rearrange it, graph it, and solve equations where the unknown appears squared or on both sides in more complicated ways. Pre-algebra teaches the rules; algebra 1 makes you choose which rule to use.",
  },
  {
    question: "And algebra 2?",
    answer:
      "Algebra 2 moves from single equations to families of functions — quadratics, exponentials, logarithms, rational and radical functions — and to what their graphs look like. A pre-algebra question has one answer. An algebra 2 question is often about behaviour: where a function is increasing, what happens as x grows, which values are impossible.",
  },
  {
    question: "What age or grade is pre-algebra for?",
    answer:
      "It is usually taught somewhere between grades 6 and 8, roughly ages 11 to 14, but the topics are the ones any adult returning to maths needs first. Nothing on this page assumes you did it the first time round.",
  },
  {
    question: "Do I need to memorise every formula?",
    answer:
      "No. A handful are worth knowing by heart because they turn up constantly — speed = distance ÷ time, area of a rectangle, percentage of an amount, Pythagoras' theorem. The rest are worth understanding: if you know that profit is what is left after the cost comes off, you can write the formula down whenever you need it.",
  },
  {
    question: "What does the solver on this page actually do?",
    answer:
      "It solves a linear equation in one unknown and shows every step it took, and it evaluates an expression once you give it a value for the letter. It is meant to be checked against, not copied from: the steps are the point, because on a test nobody marks the answer alone.",
  },
];
