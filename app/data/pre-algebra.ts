/**
 * Everything the pre-algebra course says, kept as data.
 *
 * The wording sets the reading level: a junior high student taking pre-algebra
 * for the first time. Sentences are short, the words are everyday words, and
 * every idea is shown with a number rather than only described.
 *
 * The course is twelve chapters. Each one is a page at `/pre-algebra/<slug>`,
 * and each page's lesson sections, contents list, prev/next links, sitemap
 * entry and structured data all come from the single `CHAPTERS` array below.
 * Adding a chapter is one object; nothing else needs touching.
 *
 * `pre-algebra.json` is the upstream content record this was first written
 * from. It is still shaped as a single flat lesson and no longer matches what
 * the site renders. This file is the authority. The JSON is restructured to
 * mirror it in the content pass, and until then it is not imported anywhere.
 */

/**
 * What a section of a chapter page holds.
 *
 * The chapter page is one component rendering twelve chapters, so it needs to
 * be told which block goes where rather than inferring it from the section's
 * `id`. A chapter lists its sections in page order and each one names its kind.
 */
export type SectionKind =
  | "what-is-pre-algebra"
  | "how-it-differs"
  | "topic"
  | "formulas"
  | "key-words"
  | "examples"
  | "solver"
  | "takeaway";

/** A section of a chapter page, and the entry it gets in the contents list. */
export interface PageSection {
  /** The `id` the section carries, and the anchor the contents list points at. */
  id: string;
  /** The words in the contents list, which are also the heading. */
  title: string;
  /** Which block the chapter page renders under that heading. */
  kind: SectionKind;
}

/** The subject matter of a chapter: what it is, the facts, one worked example. */
export interface Topic {
  name: string;
  /** What the topic is, in one or two short sentences. */
  summary: string;
  /** The facts the topic is made of, one short line each. */
  points: string[];
  /** A worked example, shown line by line the way it is written on paper. */
  example: { label: string; lines: string[] };
}

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

/** A word the course uses, and what it means. */
export interface VocabularyEntry {
  word: string;
  meaning: string;
}

/** A worked example: the question, the steps, and the answer at the end. */
export interface WorkedExample {
  title: string;
  question: string;
  steps: string[];
  answer: string;
}

/** A pointer from a chapter to somewhere else on the site that is relevant. */
export interface RelatedLink {
  to: string;
  label: string;
  /** Why a reader of this chapter would want it. One sentence. */
  why: string;
}

/** One chapter of the course, and everything its page renders. */
export interface Chapter {
  /** The last segment of the URL, under `/pre-algebra/`. */
  slug: string;
  /** Position in the course, counting from one. Printed on the card. */
  number: number;
  /** The page's `h1`, and the words in the chapter list. */
  title: string;
  /** One sentence, shown under the title on the hub card. */
  blurb: string;
  /** The `<title>`. Written per chapter, because a template gets rewritten. */
  metaTitle: string;
  /** The meta description. Written per chapter for the same reason. */
  metaDescription: string;
  /** The lesson sections, in page order. Feeds the contents list and the JSON-LD. */
  sections: PageSection[];
  /** The opening paragraphs of the chapter, before the first lesson section. */
  intro: string[];
  /** The subject matter. Every chapter has one except the introduction. */
  topic?: Topic;
  /** Formulas that belong to this chapter, and to no other. */
  formulas?: FormulaGroup[];
  /** Words this chapter is the place to learn. */
  vocabulary?: VocabularyEntry[];
  /** Worked examples set out step by step. */
  examples?: WorkedExample[];
  /** Whether the step-by-step solver is mounted on this page. */
  showsSolver?: boolean;
  /** Where else on the site this chapter leads. */
  related?: RelatedLink[];
}

/** The one line the course is built around, shown in the introduction. */
export const MAIN_IDEA = {
  arithmetic: "7 + 5 = 12",
  preAlgebra: "x + 5 = 12",
  solution: "x = 7",
};

/** What the course leaves you with, printed at the end of the last chapter. */
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

/**
 * The twelve chapters, in teaching order.
 *
 * The order is the one a class takes them in: the number system first, then the
 * rules for working with it, then letters standing in for numbers, then the
 * places those letters get used.
 */
export const CHAPTERS: Chapter[] = [
  {
    slug: "introduction",
    number: 1,
    title: "Introducing pre-algebra",
    blurb:
      "What the class is, what changes when a letter stands in for a number, and how pre-algebra, algebra and algebra 2 differ.",
    metaTitle: "Introducing pre-algebra: what it is and how it differs from algebra",
    metaDescription:
      "Pre-algebra is where arithmetic starts using letters for numbers you do not know yet. What the class covers, and a side by side comparison of pre-algebra, algebra and algebra 2.",
    sections: [
      { id: "what-is-pre-algebra", title: "What is pre-algebra?", kind: "what-is-pre-algebra" },
      { id: "how-it-differs", title: "Pre-algebra, algebra and algebra 2", kind: "how-it-differs" },
    ],
    intro: [
      "Pre-algebra is the math class that takes you from arithmetic into algebra. You start using letters, called variables, to stand for numbers you do not know yet.",
      "It is usually taught in grades 6 to 8. The same topics are the ones covered first when returning to math later on.",
    ],
    related: [
      {
        to: "/pre-algebra/expressions-variables-and-equations",
        label: "Expressions, variables and equations",
        why: "The chapter where the letter arrives and the balance rule gets used.",
      },
    ],
  },
  {
    slug: "integers-and-negative-numbers",
    number: 2,
    title: "Integers and negative numbers",
    blurb:
      "Whole numbers and their opposites, and what happens to addition, subtraction and multiplication below zero.",
    metaTitle: "Integers and negative numbers: rules for adding, subtracting and multiplying",
    metaDescription:
      "What an integer is, how the number line runs either side of zero, why subtracting a negative number adds, and why a negative times a negative is positive. Worked examples throughout.",
    sections: [
      { id: "integers", title: "Integers and negative numbers", kind: "topic" },
      { id: "examples", title: "Worked examples", kind: "examples" },
    ],
    intro: [
      "Arithmetic starts above zero, where every number counts something you can hold. Pre-algebra carries the same arithmetic below zero, where the numbers count what is owed, how far below sea level, or how many degrees under freezing.",
      "Nothing about the arithmetic changes. What changes is direction, and the rules below are the bookkeeping for it.",
    ],
    topic: {
      name: "Integers and negative numbers",
      summary:
        "Integers are the whole numbers and their opposites. A negative number is a number below zero, and it obeys the same arithmetic as a positive one once you know which way the number line runs.",
      points: [
        "The integers are −3, −2, −1, 0, 1, 2, 3 and so on in both directions. None of them has a fractional part.",
        "On a number line, negative numbers sit to the left of zero and positive numbers sit to the right.",
        "Adding a negative number moves left: 5 + (−3) = 2.",
        "Subtracting a negative number moves right: 5 − (−3) = 8.",
        "A negative times a positive is negative: (−3) × 4 = −12.",
        "A negative times a negative is positive: (−3) × (−4) = 12.",
        "The same two rules hold for division: −12 ÷ 4 = −3, and −12 ÷ −4 = 3.",
      ],
      example: {
        label: "Subtracting a negative",
        lines: [
          "−7 − (−2)",
          "Taking away −2 is the same as adding 2.",
          "−7 + 2 = −5",
        ],
      },
    },
    examples: [
      {
        title: "Example 1. Adding across zero",
        question: "Work out −6 + 10.",
        steps: [
          "Start at −6 on the number line.",
          "Adding 10 moves 10 places to the right.",
          "Six of those places reach zero, and four more go past it.",
        ],
        answer: "4",
      },
      {
        title: "Example 2. Two negatives in a product",
        question: "Work out (−5) × (−6).",
        steps: [
          "Multiply the numbers as if both were positive: 5 × 6 = 30.",
          "Both signs are negative, so the answer is positive.",
        ],
        answer: "30",
      },
    ],
    related: [
      {
        to: "/",
        label: "The adding machine",
        why: "It prints a running total on tape, so a string of additions and subtractions below zero can be checked line by line.",
      },
    ],
  },
  {
    slug: "order-of-operations",
    number: 3,
    title: "Order of operations",
    blurb:
      "The agreed order for working through an expression, so that two people reading it arrive at the same answer.",
    metaTitle: "Order of operations: brackets, exponents, multiply, divide, add, subtract",
    metaDescription:
      "Why 2 + 3 × 4 is 14 and not 20, what brackets change, and how to work through an expression one rank at a time. Worked examples, and two calculators that disagree on purpose.",
    sections: [
      { id: "order-of-operations", title: "The order", kind: "topic" },
      { id: "examples", title: "Worked examples", kind: "examples" },
    ],
    intro: [
      "An expression with more than one operation in it can be read more than one way. 2 + 3 × 4 is 20 if you work left to right, and 14 if you multiply first.",
      "Both readings are reasonable, so mathematics fixed one of them by agreement. That agreement is the order of operations, and it is the reason a written expression means the same thing to everyone.",
    ],
    topic: {
      name: "The order of operations",
      summary:
        "The order of operations ranks the four operations, so that an expression is worked through the same way by everyone who reads it.",
      points: [
        "Brackets first, then exponents, then multiplication and division, then addition and subtraction.",
        "Multiplication and division rank equally. Work them left to right.",
        "Addition and subtraction rank equally too. Work those left to right as well.",
        "2 + 3 × 4 is 14, because the multiplication is done first.",
        "(2 + 3) × 4 is 20, because brackets outrank multiplication.",
        "Brackets are how you say which operation you want first when the ranking would have chosen another.",
      ],
      example: {
        label: "Working out 6 + 2 × (5 − 1)²",
        lines: [
          "Brackets: 5 − 1 = 4, so 6 + 2 × 4².",
          "Exponent: 4² = 16, so 6 + 2 × 16.",
          "Multiply: 2 × 16 = 32, so 6 + 32.",
          "Add: 38.",
        ],
      },
    },
    examples: [
      {
        title: "Example 1. Division and multiplication together",
        question: "Work out 24 ÷ 6 × 2.",
        steps: [
          "Division and multiplication rank equally, so go left to right.",
          "24 ÷ 6 = 4.",
          "4 × 2 = 8.",
        ],
        answer: "8",
      },
      {
        title: "Example 2. Brackets changing the answer",
        question: "Work out 24 ÷ (6 × 2).",
        steps: ["Brackets first: 6 × 2 = 12.", "Then divide: 24 ÷ 12 = 2."],
        answer: "2",
      },
    ],
    related: [
      {
        to: "/scientific",
        label: "The scientific calculator",
        why: "It applies the order of operations, so 2 + 3 × 4 reads 14 on its display.",
      },
      {
        to: "/",
        label: "The adding machine",
        why: "It resolves each operator as the key is pressed, so the same keys read 20. A printing machine has always worked this way, and its tape shows why.",
      },
    ],
  },
  {
    slug: "number-theory",
    number: 4,
    title: "Number theory",
    blurb: "The different kinds of numbers, and how each kind behaves.",
    metaTitle: "Number theory for pre-algebra: even, odd, prime and negative numbers",
    metaDescription:
      "Positive and negative numbers, zero, even and odd numbers, and prime numbers. What each kind is, with examples and a comparison worked through.",
    sections: [{ id: "number-theory", title: "Kinds of number", kind: "topic" }],
    intro: [
      "Number theory is the part of the course that sorts numbers into kinds. A question often names the kind it wants rather than the number, and knowing what the name means is half of answering it.",
    ],
    topic: {
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
    related: [
      {
        to: "/pre-algebra/integers-and-negative-numbers",
        label: "Integers and negative numbers",
        why: "The arithmetic rules for the numbers below zero named here.",
      },
    ],
  },
  {
    slug: "factors-and-multiples",
    number: 5,
    title: "Factors and multiples",
    blurb:
      "The numbers that divide into a number, the numbers it divides into, and how to find the largest factor two numbers share.",
    metaTitle: "Factors and multiples: finding factors and the greatest common factor",
    metaDescription:
      "What a factor is, what a multiple is, how to list all the factors of a number, and how to find the greatest common factor of two numbers. Worked step by step.",
    sections: [
      { id: "factors-and-multiples", title: "Factors and multiples", kind: "topic" },
      { id: "key-words", title: "Key words", kind: "key-words" },
    ],
    intro: [
      "Every whole number can be built by multiplying smaller whole numbers together. The pieces it is built from are its factors, and the numbers it helps build are its multiples.",
      "Both ideas come back constantly: simplifying a fraction is finding a factor the top and bottom share, and adding two fractions is finding a multiple they both reach.",
    ],
    topic: {
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
    vocabulary: [
      { word: "Factor", meaning: "A number that divides into another number evenly." },
      {
        word: "Multiple",
        meaning: "What you get when you multiply a number by a whole number.",
      },
    ],
    related: [
      {
        to: "/pre-algebra/fractions-decimals-and-percents",
        label: "Fractions, decimals and percents",
        why: "Simplifying a fraction is a shared factor divided out of the top and the bottom.",
      },
    ],
  },
  {
    slug: "fractions-decimals-and-percents",
    number: 6,
    title: "Fractions, decimals and percents",
    blurb:
      "Three ways of writing part of a whole, how to move between them, and the money formulas built on percents.",
    metaTitle: "Fractions, decimals and percents: converting between all three",
    metaDescription:
      "The same amount written three ways, how to add fractions with a common denominator, and the percent formulas for discount, sale price, profit and loss, each with a worked example.",
    sections: [
      { id: "fractions", title: "Three ways of writing a part", kind: "topic" },
      { id: "formulas", title: "Percent and money formulas", kind: "formulas" },
    ],
    intro: [
      "A half, 0.5 and 50% are the same amount written three ways. Which one a question uses is usually a matter of what it is about: shop prices are percents, measurements are decimals, and recipes are fractions.",
      "Moving between the three is the skill this chapter is for, because a question asked in one of them is often easiest answered in another.",
    ],
    topic: {
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
        lines: [
          "1/4 + 2/4 = 3/4",
          "The bottom numbers are the same, so add the top numbers.",
        ],
      },
    },
    formulas: [
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
            meaning:
              "What is left over when what you paid comes off what you sold it for.",
            example: [
              "You buy a bike for $80 and sell it for $95.",
              "95 − 80 = 15",
              "The profit is $15.",
            ],
          },
          {
            name: "Loss",
            expression: "loss = cost price − selling price",
            meaning:
              "The same subtraction the other way round, when you sold it for less than you paid.",
          },
          {
            name: "Discount",
            expression: "discount = marked price − sale price",
            meaning:
              "The money taken off the price. As a percent it is discount ÷ marked price × 100.",
            example: [
              "A $50 shirt is on sale for $40.",
              "50 − 40 = 10",
              "The discount is $10, which is 20%.",
            ],
          },
          {
            name: "Sale price",
            expression: "sale price = marked price × (100 − discount %) ÷ 100",
            meaning: "What you actually pay once the percent has come off.",
            example: ["A $80 jacket is 15% off.", "80 × 85 ÷ 100 = 68", "You pay $68."],
          },
        ],
      },
    ],
    related: [
      {
        to: "/",
        label: "The adding machine",
        why: "Its percent key converts and reads as a percentage of the running total, which is how a till works out a discount.",
      },
    ],
  },
  {
    slug: "ratios-and-proportions",
    number: 7,
    title: "Ratios and proportions",
    blurb:
      "Comparing two amounts, saying two comparisons are equal, and the speed and distance formulas that follow.",
    metaTitle: "Ratios and proportions: simplifying ratios and solving for a missing amount",
    metaDescription:
      "What a ratio compares, what makes two ratios a proportion, how a ratio simplifies like a fraction, and the speed, distance and time formulas. Each one worked through with numbers.",
    sections: [
      { id: "ratios", title: "Ratios and proportions", kind: "topic" },
      { id: "formulas", title: "Speed and distance", kind: "formulas" },
    ],
    intro: [
      "A ratio compares two amounts without saying how much of either there is. Ten boys and fifteen girls is the same comparison as two boys for every three girls, and the second form is the useful one.",
      "Once two ratios are known to be equal, a missing amount in one of them can be found from the other. That is what a proportion is for.",
    ],
    topic: {
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
    formulas: [
      {
        heading: "Speed and distance",
        formulas: [
          {
            name: "Speed",
            expression: "s = d ÷ t",
            letters: ["s is speed", "d is distance", "t is time"],
            meaning: "How far you went, shared out over how long it took.",
            example: [
              "A car goes 150 miles in 3 hours.",
              "150 ÷ 3 = 50",
              "The speed is 50 mph.",
            ],
          },
          {
            name: "Distance",
            expression: "d = s × t",
            letters: ["d is distance", "s is speed", "t is time"],
            meaning:
              "The same formula turned around, when you know the speed and the time.",
            example: [
              "A car goes 60 mph for 4 hours.",
              "60 × 4 = 240",
              "It travels 240 miles.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "expressions-variables-and-equations",
    number: 8,
    title: "Expressions, variables and equations",
    blurb:
      "The letter that stands for a number, the difference between an expression and an equation, and the one rule that solves both.",
    metaTitle: "Expressions, variables and equations: substitution and the balance rule",
    metaDescription:
      "What a variable is, how an expression differs from an equation, how to substitute a value in, and the rule that whatever you do to one side you do to the other. With a solver that shows every step.",
    sections: [
      { id: "expressions", title: "Expressions and equations", kind: "topic" },
      { id: "key-words", title: "Key words", kind: "key-words" },
      { id: "examples", title: "Worked examples", kind: "examples" },
      { id: "solver", title: "Work an equation out", kind: "solver" },
    ],
    intro: [
      "This is the chapter the course is named for. In arithmetic you are given all the numbers and you work out the answer. Here one of the numbers is missing, and a letter stands in its place until it is found.",
      "Everything else stays the same, because the rules that apply to numbers apply to the letter standing in for one.",
    ],
    topic: {
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
    vocabulary: [
      { word: "Variable", meaning: "A letter that stands for a number." },
      {
        word: "Expression",
        meaning: "Numbers, variables and operations with no equals sign, like 2x + 5.",
      },
      {
        word: "Equation",
        meaning: "A statement that two expressions are equal, like 2x + 5 = 11.",
      },
      {
        word: "Coefficient",
        meaning: "The number multiplied by a variable, like the 3 in 3x.",
      },
      {
        word: "Constant",
        meaning: "A number on its own, with no variable, like the 5 in 2x + 5.",
      },
    ],
    examples: [
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
    ],
    showsSolver: true,
    related: [
      {
        to: "/pre-algebra/solver",
        label: "The step-by-step solver",
        why: "The same two boards on a page of their own, with what they accept and what they turn down set out in full.",
      },
      {
        to: "/pre-algebra/inequalities-and-one-step-equations",
        label: "Inequalities and one-step equations",
        why: "The balance rule applied to equations that are solved in a single move.",
      },
    ],
  },
  {
    slug: "inequalities-and-one-step-equations",
    number: 9,
    title: "Inequalities and one-step equations",
    blurb:
      "Undoing the one thing that was done to the letter, and what changes when the equals sign becomes a less-than sign.",
    metaTitle: "Inequalities and one-step equations: solving and when the sign flips",
    metaDescription:
      "How to solve x + 8 = 15 and 4x = 20 by undoing one operation, what the four inequality signs mean, and why multiplying an inequality by a negative number flips it. Worked examples.",
    sections: [
      { id: "inequalities", title: "Inequalities and one-step equations", kind: "topic" },
      { id: "examples", title: "Worked examples", kind: "examples" },
    ],
    intro: [
      "A one-step equation has exactly one thing done to the letter, and it is solved by undoing that one thing on both sides. Addition is undone by subtraction, multiplication by division.",
      "An inequality is solved the same way, with one exception worth learning early: multiplying or dividing by a negative number reverses which side is larger, so the sign has to turn around with it.",
    ],
    topic: {
      name: "Inequalities and one-step equations",
      summary:
        "An inequality says one side is larger or smaller than the other rather than equal to it. A one-step equation is solved by undoing the single operation applied to the letter.",
      points: [
        "< means less than and > means greater than: 3 < 7.",
        "≤ means less than or equal to, and ≥ means greater than or equal to.",
        "x + 8 = 15 is solved by subtracting 8 from both sides, so x = 7.",
        "4x = 20 is solved by dividing both sides by 4, so x = 5.",
        "The same undoing works on an inequality: x + 3 > 10 gives x > 7.",
        "Multiplying or dividing an inequality by a negative number flips the sign: −2x < 6 gives x > −3.",
      ],
      example: {
        label: "Solving x − 5 ≥ 2",
        lines: ["Add 5 to both sides.", "x ≥ 2 + 5", "x ≥ 7"],
      },
    },
    examples: [
      {
        title: "Example 1. One-step equations",
        question: "Solve x + 8 = 15, then x − 5 = 9, then 4x = 20.",
        steps: [
          "x + 8 = 15: subtract 8 from both sides, so x = 7.",
          "x − 5 = 9: add 5 to both sides, so x = 14.",
          "4x = 20: divide both sides by 4, so x = 5.",
        ],
        answer: "x = 7, x = 14, x = 5",
      },
      {
        title: "Example 2. A two-step equation",
        question: "Solve 2x + 5 = 17.",
        steps: [
          "Subtract 5 from both sides: 2x = 12.",
          "Divide both sides by 2: x = 6.",
          "Check it: 2(6) + 5 = 17. It works.",
        ],
        answer: "x = 6",
      },
      {
        title: "Example 3. Another two-step equation",
        question: "Solve 3x − 4 = 11.",
        steps: [
          "Add 4 to both sides: 3x = 15.",
          "Divide both sides by 3: x = 5.",
          "Check it: 3(5) − 4 = 11. It works.",
        ],
        answer: "x = 5",
      },
      {
        title: "Example 4. An inequality that flips",
        question: "Solve −3x ≤ 12.",
        steps: [
          "Divide both sides by −3.",
          "Dividing by a negative number reverses which side is larger, so ≤ becomes ≥.",
          "x ≥ −4.",
        ],
        answer: "x ≥ −4",
      },
    ],
    related: [
      {
        to: "/pre-algebra/solver",
        label: "The step-by-step solver",
        why: "It solves one-step and two-step equations and prints every line of the working.",
      },
    ],
  },
  {
    slug: "exponents-and-square-roots",
    number: 10,
    title: "Exponents and square roots",
    blurb:
      "A short way of writing repeated multiplication, and the operation that undoes it.",
    metaTitle: "Exponents and square roots: what a power means and how a root undoes it",
    metaDescription:
      "Why 5² means 5 × 5, what 2³ works out to, and how a square root asks which number times itself makes the number you have. With worked examples.",
    sections: [
      { id: "exponents", title: "Exponents and square roots", kind: "topic" },
      { id: "key-words", title: "Key words", kind: "key-words" },
    ],
    intro: [
      "Writing 2 × 2 × 2 × 2 × 2 out in full is slow and easy to miscount. An exponent is the short way of saying it: 2⁵.",
      "A square root asks the question backwards. Instead of what 6 × 6 comes to, it asks which number multiplied by itself makes 36.",
    ],
    topic: {
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
    vocabulary: [
      {
        word: "Exponent",
        meaning:
          "A small raised number that says how many times to multiply the base by itself.",
      },
      {
        word: "Square root",
        meaning:
          "The number that gives you your number when it is multiplied by itself.",
      },
    ],
    related: [
      {
        to: "/scientific",
        label: "The scientific calculator",
        why: "It has keys for powers and roots, so a square root of a number that is not a whole answer can be worked out.",
      },
    ],
  },
  {
    slug: "probability-and-statistics",
    number: 11,
    title: "Probability and statistics",
    blurb:
      "Measuring how likely something is, and describing a whole set of numbers with one number.",
    metaTitle: "Probability and statistics for pre-algebra: mean, median, mode and range",
    metaDescription:
      "How to work out the probability of an outcome, and what the mean, median, mode and range each say about a set of numbers. Every one shown with a worked example.",
    sections: [
      { id: "probability", title: "Probability and averages", kind: "topic" },
      { id: "formulas", title: "The formulas", kind: "formulas" },
      { id: "examples", title: "Worked examples", kind: "examples" },
    ],
    intro: [
      "Probability puts a number on how likely something is, between zero for impossible and one for certain. It is counting: the outcomes you want, over the outcomes there are.",
      "Statistics goes the other way. Given a pile of numbers, it produces one number that stands for the pile, and which one you pick changes what it tells you.",
    ],
    topic: {
      name: "Probability and statistics",
      summary:
        "Probability measures how likely something is. Statistics describes a set of numbers with a single number that stands for the group.",
      points: [
        "Probability is the number of outcomes you want divided by the number of outcomes there are.",
        "A probability is always between 0 and 1. Zero means it cannot happen, one means it always does.",
        "The mean is the total divided by how many numbers there are.",
        "The median is the middle number once they are in order.",
        "The mode is the number that appears most often.",
        "The range is the largest number minus the smallest.",
      ],
      example: {
        label: "Rolling a 4 on a six-sided die",
        lines: [
          "One face out of six is a 4.",
          "1/6, which is about 0.17, or 17%.",
        ],
      },
    },
    formulas: [
      {
        heading: "Probability and averages",
        formulas: [
          {
            name: "Probability",
            expression: "P = outcomes you want ÷ outcomes there are",
            meaning:
              "Count both, then divide. The answer is a fraction, and it can be written as a decimal or a percent instead.",
            example: [
              "A bag holds 3 red marbles and 5 blue ones.",
              "3 ÷ 8 = 0.375",
              "The chance of drawing red is 3/8, or 37.5%.",
            ],
          },
          {
            name: "Mean",
            expression: "mean = total ÷ how many",
            meaning:
              "Add every number, then share the total out equally between them.",
            example: ["The numbers 4, 8, 6, 2.", "4 + 8 + 6 + 2 = 20", "20 ÷ 4 = 5"],
          },
          {
            name: "Range",
            expression: "range = largest − smallest",
            meaning: "How far apart the two ends are, which says how spread out the set is.",
            example: ["The numbers 4, 8, 6, 2.", "8 − 2 = 6"],
          },
        ],
      },
    ],
    examples: [
      {
        title: "Example 1. Median of an odd-sized set",
        question: "Find the median of 7, 3, 9, 1, 5.",
        steps: [
          "Put them in order: 1, 3, 5, 7, 9.",
          "There are five numbers, so the middle one is the third.",
        ],
        answer: "5",
      },
      {
        title: "Example 2. Median of an even-sized set",
        question: "Find the median of 2, 4, 6, 10.",
        steps: [
          "They are already in order.",
          "There are four numbers, so there is no single middle one.",
          "Take the mean of the middle two: (4 + 6) ÷ 2 = 5.",
        ],
        answer: "5",
      },
    ],
  },
  {
    slug: "geometry-and-measurement",
    number: 12,
    title: "Geometry and measurement",
    blurb:
      "Area, perimeter and the missing side of a right triangle, and the formulas each one needs.",
    metaTitle: "Geometry and measurement: area, perimeter and the Pythagorean theorem",
    metaDescription:
      "Area and perimeter of a rectangle, area of a triangle, and how the Pythagorean theorem finds the missing side of a right triangle. Every formula with its letters explained and worked out.",
    sections: [
      { id: "geometry", title: "Shapes and measurement", kind: "topic" },
      { id: "formulas", title: "The formulas", kind: "formulas" },
      { id: "key-words", title: "Key words", kind: "key-words" },
      { id: "examples", title: "Worked examples", kind: "examples" },
      { id: "takeaway", title: "The main thing to take away", kind: "takeaway" },
    ],
    intro: [
      "Geometry is where the letters stop being placeholders and start standing for things you can measure: a length, a width, the height of a triangle.",
      "That makes it the natural end of the course. Every formula here is an equation, and every one of them is solved with the substitution and the balance rule from the earlier chapters.",
    ],
    topic: {
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
    formulas: [
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
            meaning:
              "The height goes straight up from the base. It is not the slanted side.",
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
            meaning:
              "It only works in a right triangle, the kind with a square corner.",
            example: [
              "Sides of 3 and 4.",
              "3² + 4² = c²",
              "9 + 16 = c²",
              "25 = c²",
              "c = √25 = 5",
            ],
          },
        ],
      },
    ],
    vocabulary: [
      { word: "Hypotenuse", meaning: "The longest side of a right triangle." },
    ],
    examples: [
      {
        title: "Example 1. Finding the hypotenuse",
        question: "A right triangle has sides of 6 and 8. How long is the hypotenuse?",
        steps: [
          "Use a² + b² = c²: 6² + 8² = c².",
          "36 + 64 = c².",
          "100 = c².",
          "c = √100, so c = 10.",
        ],
        answer: "10",
      },
    ],
    related: [
      {
        to: "/scientific",
        label: "The scientific calculator",
        why: "Squares, square roots and trigonometry, for the triangles whose sides do not come out whole.",
      },
    ],
  },
];

/** The chapter at a slug, or `undefined` if the slug is not one of ours. */
export function chapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.slug === slug);
}

/**
 * The chapters either side of this one, for the pager at the foot of a page.
 *
 * The first chapter has no previous and the last has no next, so both are
 * optional and the pager renders whichever it is given.
 */
export function chapterNeighbours(slug: string): {
  prev?: Chapter;
  next?: Chapter;
} {
  const index = CHAPTERS.findIndex((chapter) => chapter.slug === slug);
  if (index === -1) return {};
  // Indexing past either end gives `undefined` at runtime, but the array type
  // does not say so, so the ends are checked rather than trusted.
  return {
    prev: index > 0 ? CHAPTERS[index - 1] : undefined,
    next: index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : undefined,
  };
}
