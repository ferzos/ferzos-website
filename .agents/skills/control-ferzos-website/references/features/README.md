# Feature map

Generated notes for the App Router. `pnpm run control -- map --check` fails when a `page` or `route` file has no note here, or a note points at a route that is gone. Each note needs a `Reach` line.

### `/`

Reach: open the site root. Next.js redirects to `/optimal-stopping`. No seed data.
Contains: When should I stop looking?

### `/optimal-stopping`

Reach: open the page. No seed data. The calculator starts with 10 minutes.
Contains: When should I stop looking?
Actions: the form in `src/app/optimal-stopping/components/StopCalculator.tsx` (distance or time, a value, a unit, and an optional name).

### `/cost-benefit-analysis`

Reach: open the page. No seed data. Options and ratings are entered on the page.
Contains: Cost-Benefit Analysis
Actions: `src/app/cost-benefit-analysis/components/CostBenefitAnalysis.tsx` adds options, variables, and 1–10 ratings.

### `/health`

Reach: `GET /health`. No seed data. The body is JSON `{ "ok": true, "sha": "<commit>" }`.
Contains: "ok":true
Actions: none. The sha is `VERCEL_GIT_COMMIT_SHA` on Vercel and `CONTROL_SHA` when the control CLI starts `next dev`.
