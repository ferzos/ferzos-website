import { PlusIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { optionLabel, type Option } from "@/lib/cost-benefit";
import { cn } from "@/lib/utils";

const OPTION_PLACEHOLDERS = ["e.g. Shoe A", "e.g. Shoe B", "e.g. Shoe C"];

interface OptionsColumnProps {
  options: Option[];
  onAdd: () => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

/** The fixed left column. Each row lines up with rating rows in every variable card. */
export function OptionsColumn({
  options,
  onAdd,
  onRename,
  onRemove,
}: OptionsColumnProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-2.5 sm:p-3.5">
      <div
        className={cn(
          "mb-4 h-[76px] flex items-end text-xs text-muted-foreground",
        )}
      >
        Options
      </div>
      {options.map((option, index) => (
        <div key={option.id} className="mb-4 h-[72px]">
          <div className="flex items-center gap-1">
            <Input
              aria-label="Option name"
              className="h-9 font-semibold"
              placeholder={OPTION_PLACEHOLDERS[index] ?? "Option name"}
              value={option.name}
              data-focus={option.id}
              onChange={(event) => onRename(option.id, event.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-7 shrink-0 p-0"
              aria-label={`Remove ${optionLabel(option, index)}`}
              disabled={options.length <= 1}
              onClick={() => onRemove(option.id)}
            >
              <XIcon aria-hidden="true" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="h-9 w-full"
        onClick={onAdd}
      >
        <PlusIcon aria-hidden="true" />
        Add option
      </Button>
    </div>
  );
}
