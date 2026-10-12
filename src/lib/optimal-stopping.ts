export type Mode = "distance" | "time" | "objects";
export type TimeUnit = "min" | "h" | "d";

type Input =
  | { mode: "distance"; value: number }
  | { mode: "time"; value: number; unit: TimeUnit }
  | { mode: "objects"; value: number; name: string };

type Result = { ok: true; text: string } | { ok: false; error: string };

const EXPLORE_RATIO = 1 / Math.E; // the 37% rule
const MINUTES: Record<TimeUnit, number> = { min: 1, h: 60, d: 1440 };

export function formatDuration(totalSeconds: number): string {
  let s = Math.round(totalSeconds);
  const parts: string[] = [];
  for (const [label, size] of [["d", 86400], ["h", 3600], ["min", 60], ["s", 1]] as const) {
    const v = Math.floor(s / size);
    if (v) {
      parts.push(`${v} ${label}`);
      s -= v * size;
    }
  }
  return parts.slice(0, 2).join(" ") || "0 s";
}

function formatDistance(km: number): string {
  return km < 1
    ? `${Math.round(km * 1000)} m`
    : `${(+km.toFixed(2)).toLocaleString("en-US")} km`;
}

function formatCount(n: number, name: string): string {
  const t = name.trim() || "objects";
  const label = n === 1 && /[^s]s$/i.test(t) ? t.slice(0, -1) : t;
  return `${n} ${label}`;
}

export function calculate(input: Input): Result {
  const { value } = input;
  if (!(value > 0)) return { ok: false, error: "Enter a number greater than 0." };

  switch (input.mode) {
    case "distance":
      return { ok: true, text: formatDistance(value * EXPLORE_RATIO) };
    case "time":
      return {
        ok: true,
        text: formatDuration(value * MINUTES[input.unit] * EXPLORE_RATIO * 60),
      };
    case "objects":
      if (!Number.isInteger(value)) return { ok: false, error: "Enter a whole number." };
      return { ok: true, text: formatCount(Math.round(value * EXPLORE_RATIO), input.name) };
  }
}