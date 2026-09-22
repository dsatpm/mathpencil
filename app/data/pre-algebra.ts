/**
 * Everything the pre-algebra page says, kept as data.
 *
 * The wording comes from `pre-algebra.json`, which sets the reading level: a
 * junior high student taking pre-algebra for the first time. Sentences are
 * short, the words are everyday words, and every idea is shown with a number
 * rather than only described.
 *
 * Holding the content here means adding a topic or fixing a formula is one line
 * in a list rather than a change to a layout, and the contents list in the left
 * gutter is built from the same objects the page renders, so the two can never
 * disagree about what is on the page.
 */

/** A section of the page, and the entry it gets in the contents list. */
export interface PageSection {
  /** The `id` the section carries, and the anchor the contents list points at. */
  id: string;
  /** The words in the contents list, which are also the heading. */
  title: string;
}

export const SECTIONS: PageSection[] = [
  { id: "what-is-pre-algebra", title: "What is pre-algebra?" },
  { id: "how-it-differs", title: "Pre-algebra, algebra and algebra 2" },
  { id: "topics", title: "Pre-algebra topics" },
  { id: "formulas", title: "Formulas to know" },
  { id: "key-words", title: "Key words" },
  { id: "examples", title: "Worked examples" },
  { id: "solver", title: "Work an equation out" },
  { id: "questions", title: "Common questions" },
];

/** The one line the page is built around, shown near the top. */
export const MAIN_IDEA = {
  arithmetic: "7 + 5 = 12",
  preAlgebra: "x + 5 = 12",
  solution: "x = 7",
};

/** What the course leaves you with, printed at the end of the lesson. */
export const MAIN_TAKEAWAY =
  "Pre-algebra is mostly about learning how numbers, variables, equations and formulas work together. If you understand substitution, order of operations, fractions, negative numbers and how to solve simple equations, you have a strong start for algebra.";

/** One row of the comparison between the three courses. */
export interface CourseRow {
  aspect: string;
  preAlgebra: string;
  algebra: string;
  algebraTwo: string;
}

export const COURSE_ROWS: CourseRow[] = [
  {
    aspect: "What it teaches",
    preAlgebra: "The basic rules and skills you need before algebra.",
    algebra: "The same ideas used in harder equations.",
    algebraTwo: "Whole families of equations, and what their graphs look like.",
  },
  {
    aspect: "A question it asks",
    preAlgebra: "Solve x + 4 = 10, or solve 3x = 15.",
    algebra: "Solve 3x + 7 = 22, or solve 4(x + 2) − 3 = 17.",
    algebraTwo: "Solve x² − 5x + 6 = 0, or draw the graph of y = 2ˣ.",
  },
  {
    aspect: "How many steps",
    preAlgebra: "One or two. You undo what was done to the letter.",
    algebra: "Several, and you pick the method.",
    algebraTwo: "Several methods together, often with a graph as well.",
  },
  {
    aspect: "Where the letter can be",
    preAlgebra: "In one place, by itself.",
    algebra: "In two or three places, sometimes inside brackets.",
    algebraTwo: "Squared, under a root sign, or as a power.",
  },
  {
    aspect: "When you take it",
    preAlgebra: "Usually grades 6 to 8.",
    algebra: "Usually grades 8 to 9.",
    algebraTwo: "Usually grades 10 to 11, after geometry.",
  },
];

/** One topic taught in pre-algebra. */
export interface Topic {
  name: string;
  /** What the topic is, in one or two short sentences. */
  summary: string;
  /** The facts the topic is made of, one short line each. */
  points: string[];
  /** A worked example, shown line by line the way it is written on paper. */
  example: { label: string; lines: string[] };
}

/**
 * The topics, in the order the JSON lists them.
 *
 * Adding one is a single object; the contents list, the count in the
 * introduction and the page's structured data all follow from this array.
 */
export const TOPICS: Topic[] = [
  {
    name: "Number theory",
    summary:
      "Number theory is about the different kinds of numbers and how they behave.",
    points: [
      "Positive numbers are above zero: 1, 2, 3, 4, 5.",
      "Negative numbers are below zero: −1, −2, −3, −4, −5.",
      "Zero is neither positive nor negative.",
      "Even numbers divide by 2 with nothing left over: 2, 4, 6, 8, 10.",
      "Odd numbers do not: 1, 3, 5, 7, 9.",
      "Prime numbers have only two factors, 1 and themselves: 2, 3, 5, 7, 11, 13.",
    ],
    example: {
      label: "Comparing two numbers",
      lines: ["3 > −2", "3 is greater than negative 2."],
    },
  },
  {
    name: "Factors and multiples",
    summary:
      "Factors are numbers that multiply together to make another number. Multiples are what you get when you multiply a number by whole numbers.",
    points: [
      "3 × 4 = 12, so 3 and 4 are both factors of 12.",
      "All the factors of 12 are 1, 2, 3, 4, 6 and 12.",
      "The multiples of 4 are 4, 8, 12, 16, 20, 24 and so on.",
      "The greatest common factor is the biggest factor two numbers share.",
    ],
    example: {
      label: "Greatest common factor of 12 and 18",
      lines: [
        "Factors of 12: 1, 2, 3, 4, 6, 12",
        "Factors of 18: 1, 2, 3, 6, 9, 18",
        "The biggest one in both lists is 6.",
      ],
    },
  },
  {
    name: "Fractions, decimals and percents",
    summary:
      "Fractions, decimals and percents are three ways of showing part of a whole. The same amount can be written all three ways.",
    points: [
      "1/2 is the same as 0.5, which is the same as 50%.",
      "1/4 is the same as 0.25, which is the same as 25%.",
      "3/4 is the same as 0.75, which is the same as 75%.",
      "When the bottom numbers match, add the top numbers.",
    ],
    example: {
      label: "Adding fractions",
      lines: ["1/4 + 2/4 = 3/4", "The bottom numbers are the same, so add the top numbers."],
    },
  },
  {
    name: "Ratios and proportions",
    summary:
      "A ratio compares two amounts. A proportion says that two ratios are equal.",
    points: [
      "A class with 10 boys and 15 girls has a ratio of 10:15.",
      "That ratio simplifies to 2:3, the same way a fraction simplifies.",
      "1/2 = 2/4 is a proportion, because both sides are the same amount.",
    ],
    example: {
      label: "Word problem",
      lines: ["If 3 notebooks cost $6, how much do 6 notebooks cost?", "$12"],
    },
  },
  {
    name: "Expressions, variables and equations",
    summary:
      "A variable is a letter that stands for a number. An expression is numbers, variables and operations with no equals sign. An equation has an equals sign in it.",
    points: [
      "Variables are letters like x, y and n.",
      "Expressions look like x + 5, or 3y, or 2x + 7. There is nothing to solve.",
      "Equations look like x + 5 = 12. There is something to solve.",
      "Whatever you do to one side of an equation, do to the other side too.",
    ],
    example: {
      label: "Solving x + 5 = 12",
      lines: ["Subtract 5 from both sides.", "x = 12 − 5", "x = 7"],
    },
  },
  {
    name: "Exponents and square roots",
    summary:
      "An exponent tells you how many times to multiply a number by itself. A square root asks which number times itself makes the number you have.",
    points: [
      "5² means 5 × 5, which is 25.",
      "2³ means 2 × 2 × 2, which is 8.",
      "A square root undoes a square.",
    ],
    example: {
      label: "Finding a square root",
      lines: ["√36 = 6", "because 6 × 6 = 36."],
    },
  },
  {
    name: "Geometry and measurement",
    summary:
      "Pre-algebra brings in formulas for area, perimeter and missing sides of shapes.",
    points: [
      "Area of a rectangle: A = l × w.",
      "Perimeter of a rectangle: P = 2l + 2w.",
      "Area of a triangle: A = (1/2)bh.",
      "Area is counted in square units, like cm² or m².",
    ],
    example: {
      label: "A rectangle 8 long and 5 wide",
      lines: ["Area: 8 × 5 = 40", "Perimeter: 2(8) + 2(5) = 26"],
    },
  },
];

/** One formula, with what its letters mean and a worked example. */
export interface Formula {
  name: string;
  /** Written the way it is set on paper. */
  expression: string;
  /** What each letter stands for, one line each. */
  letters?: string[];
  meaning: string;
  /** A worked example, line by line. */
  example?: string[];
}

export interface FormulaGroup {
  heading: string;
  formulas: Formula[];
}

export const FORMULA_GROUPS: FormulaGroup[] = [
  {
    heading: "Speed and distance",
    formulas: [
      {
        name: "Speed",
        expression: "s = d ÷ t",
        letters: ["s is speed", "d is distance", "t is time"],
        meaning: "How far you went, shared out over how long it took.",
        example: ["A car goes 150 miles in 3 hours.", "150 ÷ 3 = 50", "The speed is 50 mph."],
      },
      {
        name: "Distance",
        expression: "d = s × t",
        letters: ["d is distance", "s is speed", "t is time"],
        meaning: "The same formula turned around, when you know the speed and the time.",
        example: ["A car goes 60 mph for 4 hours.", "60 × 4 = 240", "It travels 240 miles."],
      },
    ],
  },
  {
    heading: "Percent and money",
    formulas: [
      {
        name: "Percent of a number",
        expression: "part = percent × whole",
        meaning: "Turn the percent into a decimal first. 20% becomes 0.20.",
        example: ["What is 20% of 80?", "0.20 × 80 = 16"],
      },
      {
        name: "Profit",
        expression: "profit = selling price − cost price",
        meaning: "What is left over when what you paid comes off what you sold it for.",
        example: ["You buy a bike for $80 and sell it for $95.", "95 − 80 = 15", "The profit is $15."],
      },
      {
        name: "Loss",
        expression: "loss = cost price − selling price",
        meaning: "The same subtraction the other way round, when you sold it for less than you paid.",
      },
      {
        name: "Discount",
        expression: "discount = marked price − sale price",
        meaning: "The money taken off the price. As a percent it is discount ÷ marked price × 100.",
        example: ["A $50 shirt is on sale for $40.", "50 − 40 = 10", "The discount is $10, which is 20%."],
      },
      {
        name: "Sale price",
        expression: "sale price = marked price × (100 − discount %) ÷ 100",
        meaning: "What you actually pay once the percent has come off.",
        example: ["A $80 jacket is 15% off.", "80 × 85 ÷ 100 = 68", "You pay $68."],
      },
    ],
  },
  {
    heading: "Shapes",
    formulas: [
      {
        name: "Area of a rectangle",
        expression: "A = l × w",
        letters: ["l is the length", "w is the width"],
        meaning: "The space inside, counted in square units.",
      },
      {
        name: "Perimeter of a rectangle",
        expression: "P = 2l + 2w",
        letters: ["l is the length", "w is the width"],
        meaning: "The distance all the way around the outside.",
      },
      {
        name: "Area of a triangle",
        expression: "A = (1/2)bh",
        letters: ["b is the base", "h is the height"],
        meaning: "The height goes straight up from the base. It is not the slanted side.",
        example: ["A triangle with base 10 and height 6.", "(1/2)(10)(6) = 30"],
      },
      {
        name: "Pythagorean theorem",
        expression: "a² + b² = c²",
        letters: [
          "a is one shorter side",
          "b is the other shorter side",
          "c is the hypotenuse, the longest side",
        ],
        meaning: "It only works in a right triangle, the kind with a square corner.",
        example: ["Sides of 3 and 4.", "3² + 4² = c²", "9 + 16 = c²", "25 = c²", "c = √25 = 5"],
      },
    ],
  },
];

/** A word the course uses, and what it means. */
export interface VocabularyEntry {
  word: string;
  meaning: string;
}

export const KEY_VOCABULARY: VocabularyEntry[] = [
  { word: "Variable", meaning: "A letter that stands for a number." },
  {
    word: "Expression",
    meaning: "Numbers, variables and operations with no equals sign, like 2x + 5.",
  },
  {
    word: "Equation",
    meaning: "A statement that two expressions are equal, like 2x + 5 = 11.",
  },
  { word: "Coefficient", meaning: "The number multiplied by a variable, like the 3 in 3x." },
  { word: "Constant", meaning: "A number on its own, with no variable, like the 5 in 2x + 5." },
  { word: "Factor", meaning: "A number that divides into another number evenly." },
  { word: "Multiple", meaning: "What you get when you multiply a number by a whole number." },
  {
    word: "Exponent",
    meaning: "A small raised number that says how many times to multiply the base by itself.",
  },
  {
    word: "Square root",
    meaning: "The number that gives you your number when it is multiplied by itself.",
  },
  { word: "Hypotenuse", meaning: "The longest side of a right triangle." },
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
    title: "Example 1. Putting a value in",
    question: "Work out 8 × (x + 3) when x = 2.",
    steps: [
      "Put 2 where the x is: 8 × (2 + 3).",
      "Brackets first: 2 + 3 = 5.",
      "Now multiply: 8 × 5 = 40.",
    ],
    answer: "40",
  },
  {
    title: "Example 2. Substitution",
    question: "If x = 6, what is x + 4?",
    steps: ["Put 6 where the x is: 6 + 4.", "Add: 6 + 4 = 10."],
    answer: "10",
  },
  {
    title: "Example 3. Substitution with a coefficient",
    question: "If y = 4, what is 3y + 2?",
    steps: [
      "3y means 3 times y, so put 4 in: 3(4) + 2.",
      "Multiply first: 12 + 2.",
      "Then add: 14.",
    ],
    answer: "14",
  },
  {
    title: "Example 4. Evaluating an expression",
    question: "If x = 3, what is 2x + 5?",
    steps: ["Put 3 in for x: 2(3) + 5.", "Multiply first: 6 + 5.", "Then add: 11."],
    answer: "11",
  },
  {
    title: "Example 5. One-step equations",
    question: "Solve x + 8 = 15, then x − 5 = 9, then 4x = 20.",
    steps: [
      "x + 8 = 15: subtract 8 from both sides, so x = 7.",
      "x − 5 = 9: add 5 to both sides, so x = 14.",
      "4x = 20: divide both sides by 4, so x = 5.",
    ],
    answer: "x = 7, x = 14, x = 5",
  },
  {
    title: "Example 6. A two-step equation",
    question: "Solve 2x + 5 = 17.",
    steps: [
      "Subtract 5 from both sides: 2x = 12.",
      "Divide both sides by 2: x = 6.",
      "Check it: 2(6) + 5 = 17. It works.",
    ],
    answer: "x = 6",
  },
  {
    title: "Example 7. Another two-step equation",
    question: "Solve 3x − 4 = 11.",
    steps: [
      "Add 4 to both sides: 3x = 15.",
      "Divide both sides by 3: x = 5.",
      "Check it: 3(5) − 4 = 11. It works.",
    ],
    answer: "x = 5",
  },
  {
    title: "Example 8. Finding the hypotenuse",
    question: "A right triangle has sides of 6 and 8. How long is the hypotenuse?",
    steps: [
      "Use a² + b² = c²: 6² + 8² = c².",
      "36 + 64 = c².",
      "100 = c².",
      "c = √100, so c = 10.",
    ],
    answer: "10",
  },
];

/** The questions this subject actually raises. Mirrored into FAQ structured data. */
export const PRE_ALGEBRA_FAQ: Array<{ question: string; answer: string }> = [
  {
    question: "What is pre-algebra, in one sentence?",
    answer:
      "Pre-algebra is the math class that takes you from basic arithmetic into algebra. You start using letters, called variables, to stand for numbers you do not know yet.",
  },
  {
    question: "What is the difference between an expression and an equation?",
    answer:
      "An expression is numbers, variables and operations with no equals sign, like 2x + 5. There is nothing to solve. An equation has an equals sign, like 2x + 5 = 11, and it says the two sides are worth the same. That is what you solve.",
  },
  {
    question: "How is pre-algebra different from algebra?",
    answer:
      "Pre-algebra brings in variables, equations, formulas and number rules, and the equations are short ones like x + 4 = 10 or 3x = 15. Algebra uses those same skills on harder problems, like 3x + 7 = 22 or 4(x + 2) − 3 = 17, where you have more steps and you choose the order to do them in.",
  },
  {
    question: "And algebra 2?",
    answer:
      "Algebra 2 comes later, usually after geometry. It works with whole families of equations, including ones where the letter is squared or is a power, and it asks about graphs as much as about answers. A pre-algebra question has one answer. An algebra 2 question is often about a shape or a pattern.",
  },
  {
    question: "What grade is pre-algebra for?",
    answer:
      "Usually grades 6 to 8, around ages 11 to 14. The topics are also the first ones any adult going back to math needs, and nothing on this page assumes you remember them already.",
  },
  {
    question: "What is the one rule I should remember?",
    answer:
      "Whatever you do to one side of an equation, do the same thing to the other side. An equation is a balance. If you take 5 off the left, take 5 off the right, and it stays true.",
  },
  {
    question: "Do I have to memorize every formula?",
    answer:
      "No. A few are worth knowing by heart because they come up all the time: speed = distance ÷ time, area of a rectangle, percent of a number, and a² + b² = c². The rest are worth understanding, because then you can write them down when you need them.",
  },
  {
    question: "What does the solver on this page do?",
    answer:
      "It solves an equation with one letter in it and shows every step it took, and it works out an expression once you give the letter a value. Use it to check your own work. The steps are the part that gets graded, so copying only the last line does not help you.",
  },
];
