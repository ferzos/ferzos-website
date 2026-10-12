# Optimal stopping

## Overview

The optimal-stopping page helps users estimate how long to explore before choosing among a sequence of options, using the 37% rule associated with the secretary problem.

## User-facing behavior

- The home route redirects to `/optimal-stopping`.
- The calculator supports three input modes:
  - **Distance:** remaining distance in kilometers; the result is shown in meters when under 1 km, otherwise in kilometers rounded to two decimal places.
  - **Time:** remaining time in minutes, hours, or days; the result is rounded to seconds and displayed with up to two non-zero units.
  - **Objects:** a positive whole-number count with an optional custom label (up to 20 characters). A blank label defaults to “objects”; simple words ending in “s” are singularized when the result is one.
- Results update as the inputs change. Invalid non-positive values show a validation message; fractional object counts show a whole-number validation message.
- The page explains the secretary problem and the 37% rule below the calculator.

## Calculation

The exploration ratio is $1/e$, approximately 36.8% (commonly rounded to 37%). Distance and time results multiply the remaining amount by this ratio. Time is converted to seconds for calculation and formatting. For object counts, the input must be an integer and the exploration count is rounded to the nearest integer after applying the ratio.

This is an illustrative calculator based on the secretary-problem strategy. Its assumptions do not necessarily hold for every real-world search or decision.

## Implementation

- Page and metadata: `src/app/optimal-stopping/page.tsx`
- Calculator UI: `src/app/optimal-stopping/components/StopCalculator.tsx`
- Educational content: `src/app/optimal-stopping/components/About.tsx`
- Calculation and formatting: `src/lib/optimal-stopping.ts`
- Tests: corresponding `*.test.tsx` and `src/lib/optimal-stopping.test.ts` files
