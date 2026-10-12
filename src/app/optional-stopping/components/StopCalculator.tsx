// src/components/stop-calculator.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculate, type Mode, type TimeUnit } from "@/lib/optimal-stopping";

const TIME_UNITS: { value: TimeUnit; label: string }[] = [
  { value: "min", label: "minutes" },
  { value: "h", label: "hours" },
  { value: "d", label: "days" },
];

export function StopCalculator() {
  const [mode, setMode] = useState<Mode>("distance");
  const [value, setValue] = useState("10");
  const [unit, setUnit] = useState<TimeUnit>("min");
  const [name, setName] = useState("");

  const n = parseFloat(value);
  const result = calculate(
    mode === "distance"
      ? { mode, value: n }
      : mode === "time"
        ? { mode, value: n, unit }
        : { mode, value: n, name },
  );

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="distance">Distance</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="remaining">Remaining</Label>
        <div className="grid grid-cols-[1fr_8rem] gap-2">
          <Input
            id="remaining"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {mode === "distance" && <Input value="km" disabled aria-label="Unit" />}
          {mode === "time" && (
            <Select value={unit} onValueChange={(v) => setUnit(v as TimeUnit)}>
              <SelectTrigger aria-label="Unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_UNITS.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {mode === "objects" && (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. shops"
              maxLength={20}
              autoComplete="off"
              aria-label="What you are counting"
            />
          )}
        </div>
        {!result.ok && (
          <p role="alert" className="text-sm text-destructive">
            {result.error}
          </p>
        )}
      </div>

      {result.ok && (
        <section className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Explore for</p>
          <p className="mt-1 break-words text-4xl font-bold tracking-tight">{result.text}</p>
        </section>
      )}
    </div>
  );
}