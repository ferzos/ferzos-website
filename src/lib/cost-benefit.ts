export type Direction = "higher" | "lower";

export interface Variable {
  id: string;
  name: string;
  direction: Direction;
}

export interface Cell {
  /** Raw text from the rating input. Valid ratings are MIN_RATING..MAX_RATING. */
  value: string;
  note: string;
}

export interface Option {
  id: string;
  name: string;
  /** Keyed by variable id. A missing key means an empty cell. */
  cells: Record<string, Cell>;
}

export interface CostBenefitData {
  variables: Variable[];
  options: Option[];
}

export interface VariableScore {
  variableId: string;
  /** This variable's share of the full score bar (0..100). */
  percent: number;
}

export interface RankedOption {
  id: string;
  name: string;
  /** Average rating across variables, 0..10 (lower-is-better ratings are flipped). */
  score: number;
  parts: VariableScore[];
}

export interface CostBenefitResult {
  ranked: RankedOption[];
  hasEmptyCells: boolean;
  hasAnyRating: boolean;
}

export const MIN_RATING = 1;
export const MAX_RATING = 10;

export const EMPTY_CELL: Cell = { value: "", note: "" };

let idCounter = 0;
export const createId = (prefix: string): string => `${prefix}-${++idCounter}`;

export const getCell = (option: Option, variableId: string): Cell =>
  option.cells[variableId] ?? EMPTY_CELL;

export const optionLabel = (option: Option, index: number): string =>
  option.name.trim() || `Option ${index + 1}`;

export const variableLabel = (variable: Variable, index: number): string =>
  variable.name.trim() || `Variable ${index + 1}`;

/** Returns the rating, or null when empty, not a number, or outside 1..10. Decimals are allowed. */
export function parseRating(raw: string): number | null {
  if (raw.trim() === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= MIN_RATING && parsed <= MAX_RATING
    ? parsed
    : null;
}

/** True when something was typed but it is not a usable rating. */
export const isInvalidRating = (raw: string): boolean =>
  raw.trim() !== "" && parseRating(raw) === null;

/**
 * Every variable counts equally. Each rating counts as-is, or mirrored
 * (MIN + MAX - rating) when lower is better. The score is the average.
 * Notes never affect the score. Empty or invalid cells count as 0.
 */
export function calculateResult(
  variables: Variable[],
  options: Option[],
): CostBenefitResult {
  const count = variables.length || 1;
  const ratingOf = (option: Option, variable: Variable) =>
    parseRating(getCell(option, variable.id).value);

  const ranked = options
    .map((option, index): RankedOption => {
      const adjusted = variables.map((variable) => {
        const rating = ratingOf(option, variable);
        if (rating === null) return 0;
        return variable.direction === "higher"
          ? rating
          : MAX_RATING + MIN_RATING - rating;
      });

      return {
        id: option.id,
        name: optionLabel(option, index),
        score: adjusted.reduce((sum, value) => sum + value, 0) / count,
        parts: variables.map((variable, i) => ({
          variableId: variable.id,
          percent: (adjusted[i] / (count * MAX_RATING)) * 100,
        })),
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    ranked,
    hasEmptyCells: options.some((option) =>
      variables.some((variable) => ratingOf(option, variable) === null),
    ),
    hasAnyRating: options.some((option) =>
      variables.some((variable) => ratingOf(option, variable) !== null),
    ),
  };
}

/** Blank starting point: 3 variables and 2 options, every cell empty. */
export function createInitialData(): CostBenefitData {
  return {
    variables: [1, 2, 3].map((n): Variable => ({
      id: `initial-variable-${n}`,
      name: "",
      direction: "higher",
    })),
    options: [1, 2].map((n): Option => ({
      id: `initial-option-${n}`,
      name: "",
      cells: {},
    })),
  };
}
