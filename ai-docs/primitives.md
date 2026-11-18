# Primitives

Building blocks agents reuse. Add a primitive here in the same pull request that introduces it. `adrs` lists the decision records that shape the entry, or `[]` when none do.

## App shell

- Root: `src/app/layout.tsx`
- Home redirects to optimal stopping: `src/app/page.tsx`
- Tabs between tools: `src/components/RouteTabs.tsx`
- adrs: []

## UI

Shared controls in `src/components/ui/`: `button`, `input`, `label`, `select`, `tabs`. They wrap Base UI and are styled with `class-variance-authority`. Class names merge through `cn` in `src/lib/utils.ts`.

- adrs: []

## Optimal stopping

- Calculation: `src/lib/optimal-stopping.ts`
- Page: `src/app/optimal-stopping/page.tsx`
- Calculator form: `src/app/optimal-stopping/components/StopCalculator.tsx`
- adrs: []

## Cost-benefit analysis

- Calculation: `src/lib/cost-benefit.ts`
- Page: `src/app/cost-benefit-analysis/page.tsx`
- Board: `src/app/cost-benefit-analysis/components/CostBenefitAnalysis.tsx`
- adrs: []

## Installable app

- Manifest: `src/app/manifest.ts`
- Service worker: `public/sw.js`
- Registration: `src/app/service-worker-registration.tsx`
- Install prompt: `src/components/PWAInstallPrompt.tsx` and `src/hooks/usePWAInstall.ts`
- adrs: []

## Running version

- `GET /health` returns `{ ok, sha }` from `src/app/health/route.ts`
- Local and preview proof: `tools/control-ferzos-website.mts`
- adrs: []
