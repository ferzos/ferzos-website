# Component standards

## Component naming

- Follow TitleCase (PascalCase) when naming React components: capitalize each word and do not use spaces, hyphens, or underscores. For example, `StopCalculator` and `AboutSection`.
- Name component files after their primary React component using the same PascalCase convention, including component test files (for example, `StopCalculator.tsx` and `StopCalculator.test.tsx`).

## Hook organization

- Keep custom React hooks inside a `hooks/` directory, rather than alongside components. For feature-specific hooks, place the directory within that feature (for example, `src/app/cost-benefit-analysis/hooks/`).
