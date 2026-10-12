# Ferzos Website

A Next.js application contains Ferzos' ideas

## Getting started

This project uses pnpm. Install dependencies and start the development server:

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `pnpm dev` — start the development server.
- `pnpm build` — create a production build.
- `pnpm start` — serve the production build (run `pnpm build` first).
- `pnpm test` — run the Jest test suite.
- `pnpm lint` — check the project with ESLint.
- `pnpm lint:fix` — apply available ESLint fixes.
- `pnpm format` — format files with Prettier.
- `pnpm format:check` — check formatting without changing files.

## Features

- [Optimal stopping calculator](ai-docs/features/optimal-stopping.md)s

## Project structure

- `src/app/` — App Router routes, root layout, and global styles.
- `src/app/optional-stopping/` — calculator page and its UI components.
- `src/components/` — shared components and UI primitives.
- `src/lib/` — calculation and utility functions.
- `src/__mocks__/` — shared test mocks.
- `ai-docs/` — feature documentation, testing, and component standards.

## Tests and conventions

Tests use Jest and React Testing Library. Run them with `pnpm test`. Before adding a test mock, check the shared mocks and Jest setup first. See [testing standards](ai-docs/testing-standards.md) and [component standards](ai-docs/component-standards.md) for project conventions.

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Jest and React Testing Library
