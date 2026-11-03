import {
  variableLabel,
  type CostBenefitResult,
  type Variable,
} from "@/lib/cost-benefit";
import { cn } from "@/lib/utils";

// Literal class strings let Tailwind detect every segment color.
const SEGMENT_COLORS = [
  "bg-blue-900 dark:bg-blue-400",
  "bg-orange-600 dark:bg-orange-400",
  "bg-cyan-700 dark:bg-cyan-300",
  "bg-violet-600 dark:bg-violet-300",
  "bg-green-700 dark:bg-green-300",
  "bg-rose-700 dark:bg-rose-300",
] as const;

const colorFor = (index: number) =>
  SEGMENT_COLORS[index % SEGMENT_COLORS.length];

interface ResultsProps {
  variables: Variable[];
  result: CostBenefitResult;
}

export function Results({ variables, result }: ResultsProps) {
  const { ranked, hasEmptyCells, hasAnyRating } = result;

  if (ranked.length < 2 || !hasAnyRating) {
    return (
      <section className="rounded-lg border bg-card text-card-foreground p-5">
        <p className="text-sm text-muted-foreground">
          {ranked.length < 2
            ? "Add at least two options to compare."
            : "Rate your options from 1 to 10 to see the ranking."}
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="cba-result-heading"
      className="rounded-lg border bg-card text-card-foreground flex flex-col gap-4 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="cba-result-heading" className="text-lg font-semibold">
          Result
        </h2>
        <ul
          aria-label="Legend"
          className="flex flex-wrap gap-x-3 gap-y-1 text-xs"
        >
          {variables.map((variable, index) => (
            <li key={variable.id} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn("size-2.5 rounded-[2px]", colorFor(index))}
              />
              {variableLabel(variable, index)}
            </li>
          ))}
        </ul>
      </div>

      <ol aria-label="Ranking" className="flex flex-col gap-4">
        {ranked.map((item, rank) => (
          <li key={item.id} className="flex items-center gap-3">
            <span className="w-5 font-semibold text-muted-foreground">
              {rank + 1}
            </span>
            <span className="w-28 truncate font-semibold">{item.name}</span>
            <div className="flex h-3 flex-1 overflow-hidden rounded-full bg-muted">
              {item.parts.map((part, index) =>
                part.percent > 0 ? (
                  <div
                    key={part.variableId}
                    className={cn("h-full", colorFor(index))}
                    style={{ width: `${part.percent}%` }}
                    title={`${variableLabel(variables[index], index)}: ${(part.percent / 10).toFixed(1)}`}
                  />
                ) : null,
              )}
            </div>
            <span className="w-14 text-right text-xl font-semibold tabular-nums">
              {item.score.toFixed(1)}
            </span>
          </li>
        ))}
      </ol>

      {hasEmptyCells && (
        <p className="text-xs text-muted-foreground">
          Empty or invalid cells (not 1-10) count as 0 for that variable.
        </p>
      )}
    </section>
  );
}
