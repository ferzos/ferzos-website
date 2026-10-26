import {
  MIN_RATING,
  MAX_RATING,
  calculateResult,
  createInitialData,
  isInvalidRating,
  optionLabel,
  parseRating,
  variableLabel,
  type Option,
  type Variable,
} from "./cost-benefit";

const variable = (id: string, direction: Variable["direction"] = "higher"): Variable => ({
  id,
  name: id,
  direction,
});

const option = (
  id: string,
  ratings: Record<string, string>,
  notes: Record<string, string> = {}
): Option => ({
  id,
  name: id,
  cells: Object.fromEntries(
    Object.entries(ratings).map(([variableId, value]) => [
      variableId,
      { value, note: notes[variableId] ?? "" },
    ])
  ),
});

describe("parseRating", () => {
  it("should accept whole and decimal ratings from 1 to 10", () => {
    expect(parseRating("1")).toBe(1);
    expect(parseRating("10")).toBe(10);
    expect(parseRating("7.5")).toBe(7.5);
    expect(parseRating(" 3 ")).toBe(3);
  });

  it("should reject empty, non-numeric and out-of-range input", () => {
    expect(parseRating("")).toBeNull();
    expect(parseRating("   ")).toBeNull();
    expect(parseRating("abc")).toBeNull();
    expect(parseRating("0.9")).toBeNull();
    expect(parseRating("10.1")).toBeNull();
    expect(parseRating("Infinity")).toBeNull();
  });
});

describe("isInvalidRating", () => {
  it("should flag unusable typed ratings but not empty input", () => {
    expect(isInvalidRating("")).toBe(false);
    expect(isInvalidRating("5")).toBe(false);
    expect(isInvalidRating("11")).toBe(true);
    expect(isInvalidRating("0")).toBe(true);
  });
});

describe("labels", () => {
  it("should use a numbered label when a name is blank", () => {
    expect(optionLabel({ id: "a", name: "  ", cells: {} }, 1)).toBe("Option 2");
    expect(optionLabel({ id: "a", name: "Shoe A", cells: {} }, 1)).toBe("Shoe A");
    expect(variableLabel({ id: "v", name: "", direction: "higher" }, 0)).toBe("Variable 1");
  });
});

describe("calculateResult", () => {
  it("should average ratings and flip lower-is-better variables", () => {
    const variables = [
      variable("comfort"),
      variable("price", "lower"),
      variable("warranty"),
    ];
    const options = [
      option("A", { comfort: "8", price: "3", warranty: "5" }),
      option("B", { comfort: "6", price: "9", warranty: "5" }),
    ];

    const { ranked } = calculateResult(variables, options);
    expect(ranked.map((item) => item.name)).toEqual(["A", "B"]);
    expect(ranked[0].score).toBeCloseTo(7, 5);
    expect(ranked[1].score).toBeCloseTo(13 / 3, 5);
  });

  it("should count empty and out-of-range cells as 0 and flag them", () => {
    const variables = [variable("comfort"), variable("price")];
    const { ranked, hasEmptyCells } = calculateResult(variables, [
      option("full", { comfort: "8", price: "8" }),
      option("empty", { comfort: "8", price: "" }),
      option("invalid", { comfort: "8", price: "11" }),
    ]);

    expect(hasEmptyCells).toBe(true);
    expect(ranked.find((item) => item.id === "full")?.score).toBe(8);
    expect(ranked.find((item) => item.id === "empty")?.score).toBe(4);
    expect(ranked.find((item) => item.id === "invalid")?.score).toBe(4);
  });

  it("should report no ratings when every cell is empty", () => {
    const initialData = createInitialData();
    const { hasAnyRating, hasEmptyCells } = calculateResult(
      initialData.variables,
      initialData.options
    );
    expect(hasAnyRating).toBe(false);
    expect(hasEmptyCells).toBe(true);
  });
});

describe("createInitialData", () => {
  it("should start blank with 3 variables and 2 options", () => {
    const data = createInitialData();
    expect(data.variables).toHaveLength(3);
    expect(data.options).toHaveLength(2);
    expect(data.variables.every((v) => v.name === "")).toBe(true);
    expect(data.options.every((o) => o.name === "")).toBe(true);
  });
});
