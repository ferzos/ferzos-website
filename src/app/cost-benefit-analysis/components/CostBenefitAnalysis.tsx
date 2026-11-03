'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  calculateResult,
  createId,
  createInitialData,
  getCell,
  type Cell,
  type CostBenefitData,
  type Variable,
} from "@/lib/cost-benefit";
import { cn } from "@/lib/utils";

import { OptionsColumn } from "./OptionsColumn";
import { Results } from "./Results";
import { useCarousel } from "../hooks/useCarousel";
import { VariableCard } from "./VariableCard";

export function CostBenefitAnalysis() {
  const [data, setData] = useState<CostBenefitData>(createInitialData);
  const { variables, options } = data;
  const result = useMemo(() => calculateResult(variables, options), [variables, options]);
  const {
    setElement: setCarouselElement,
    canPrev,
    canNext,
    scrollByCard,
  } = useCarousel(variables.length);

  const boardRef = useRef<HTMLDivElement>(null);
  const focusIdRef = useRef<string | null>(null);
  useEffect(() => {
    const id = focusIdRef.current;
    if (!id) return;
    focusIdRef.current = null;
    boardRef.current?.querySelector<HTMLElement>(`[data-focus="${id}"]`)?.focus();
  }, [data]);

  const addVariable = () => {
    const id = createId("variable");
    focusIdRef.current = id;
    setData((previous) => ({
      ...previous,
      variables: [...previous.variables, { id, name: "", direction: "higher" }],
    }));
  };

  const updateVariable = (id: string, patch: Partial<Omit<Variable, "id">>) =>
    setData((previous) => ({
      ...previous,
      variables: previous.variables.map((variable) =>
        variable.id === id ? { ...variable, ...patch } : variable
      ),
    }));

  const removeVariable = (id: string) =>
    setData((previous) =>
      previous.variables.length <= 1
        ? previous
        : {
            variables: previous.variables.filter((variable) => variable.id !== id),
            options: previous.options.map((option) => ({
              ...option,
              cells: Object.fromEntries(
                Object.entries(option.cells).filter(([variableId]) => variableId !== id)
              ),
            })),
          }
    );

  const addOption = () => {
    const id = createId("option");
    focusIdRef.current = id;
    setData((previous) => ({
      ...previous,
      options: [...previous.options, { id, name: "", cells: {} }],
    }));
  };

  const renameOption = (id: string, name: string) =>
    setData((previous) => ({
      ...previous,
      options: previous.options.map((option) => (option.id === id ? { ...option, name } : option)),
    }));

  const removeOption = (id: string) =>
    setData((previous) =>
      previous.options.length <= 1
        ? previous
        : { ...previous, options: previous.options.filter((option) => option.id !== id) }
    );

  const updateCell = (optionId: string, variableId: string, patch: Partial<Cell>) =>
    setData((previous) => ({
      ...previous,
      options: previous.options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              cells: {
                ...option.cells,
                [variableId]: { ...getCell(option, variableId), ...patch },
              },
            }
          : option
      ),
    }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex justify-end gap-1.5">
          <Button
            type="button"
            variant="outline"
            className="size-9 p-0"
            aria-label="Previous variables"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
          >
            <CaretLeftIcon aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="size-9 p-0"
            aria-label="Next variables"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
          >
            <CaretRightIcon aria-hidden="true" />
          </Button>
        </div>

        <div
          ref={boardRef}
          className="grid grid-cols-[clamp(150px,28vw,220px)_minmax(0,1fr)] items-start gap-3"
        >
          <OptionsColumn
            options={options}
            onAdd={addOption}
            onRename={renameOption}
            onRemove={removeOption}
          />

          <div
            ref={setCarouselElement}
            role="region"
            aria-label="Variables"
            tabIndex={0}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]"
          >
            {variables.map((variable, index) => (
              <VariableCard
                key={variable.id}
                variable={variable}
                index={index}
                options={options}
                canRemove={variables.length > 1}
                onUpdate={(patch) => updateVariable(variable.id, patch)}
                onRemove={() => removeVariable(variable.id)}
                onUpdateCell={(optionId, patch) => updateCell(optionId, variable.id, patch)}
              />
            ))}
            <div
              className={cn(
                "flex shrink-0 basis-[min(180px,70%)] snap-start items-center justify-center rounded-lg border border-dashed",
                "p-2.5 sm:p-3.5"
              )}
            >
              <Button type="button" variant="outline" className="h-9" onClick={addVariable}>
                <PlusIcon aria-hidden="true" />
                Add variable
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Results variables={variables} result={result} />
    </div>
  );
}
