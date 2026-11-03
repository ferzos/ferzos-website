import { XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MAX_RATING,
  MIN_RATING,
  getCell,
  isInvalidRating,
  optionLabel,
  variableLabel,
  type Cell,
  type Direction,
  type Option,
  type Variable,
} from "@/lib/cost-benefit";

const VARIABLE_PLACEHOLDERS = ["e.g. Price", "e.g. Comfort", "e.g. Warranty"];

interface VariableCardProps {
  variable: Variable;
  index: number;
  options: Option[];
  canRemove: boolean;
  onUpdate: (patch: Partial<Omit<Variable, "id">>) => void;
  onRemove: () => void;
  onUpdateCell: (optionId: string, patch: Partial<Cell>) => void;
}

/** One variable: its name, direction, and a rating + optional note for every option. */
export function VariableCard({
  variable,
  index,
  options,
  canRemove,
  onUpdate,
  onRemove,
  onUpdateCell,
}: VariableCardProps) {
  const label = variableLabel(variable, index);

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-2.5 sm:p-3.5 shrink-0 basis-[min(300px,85%)] snap-start">
      <div className="mb-4 h-[76px]">
        <div className="flex items-center gap-1">
          <Input
            aria-label="Variable name"
            className="h-9 font-semibold"
            placeholder={VARIABLE_PLACEHOLDERS[index] ?? "What matters"}
            value={variable.name}
            data-focus={variable.id}
            onChange={(event) => onUpdate({ name: event.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-7 shrink-0 p-0"
            aria-label={`Remove ${label}`}
            disabled={!canRemove}
            onClick={onRemove}
          >
            <XIcon aria-hidden="true" />
          </Button>
        </div>
        <select
          aria-label={`Direction for ${label}`}
          className="mt-2 h-8 w-full rounded-md border border-input bg-background px-1.5 text-[13px] text-foreground"
          value={variable.direction}
          onChange={(event) =>
            onUpdate({ direction: event.target.value as Direction })
          }
        >
          <option value="higher">Higher is better</option>
          <option value="lower">Lower is better</option>
        </select>
      </div>

      {options.map((option, optionIndex) => {
        const cell = getCell(option, variable.id);
        const cellLabel = `${optionLabel(option, optionIndex)}, ${label}`;
        return (
          <div key={option.id} className="mb-4 h-[72px]">
            <Input
              type="number"
              min={MIN_RATING}
              max={MAX_RATING}
              step="any"
              inputMode="decimal"
              placeholder="1-10"
              className="h-9 text-right"
              aria-label={cellLabel}
              aria-invalid={isInvalidRating(cell.value) || undefined}
              value={cell.value}
              onChange={(event) =>
                onUpdateCell(option.id, { value: event.target.value })
              }
            />
            <Input
              placeholder="Note (optional)"
              className="mt-1.5 h-[30px] border-dashed text-xs text-muted-foreground"
              aria-label={`Note for ${cellLabel}`}
              value={cell.note}
              onChange={(event) =>
                onUpdateCell(option.id, { note: event.target.value })
              }
            />
          </div>
        );
      })}

      <div aria-hidden="true" className="h-9" />
    </div>
  );
}
