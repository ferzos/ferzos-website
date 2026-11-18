<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ferzos-website agent index

Ferzos is a Next.js app of small decision tools. Agents change it. Ferdinand owns product decisions and merges anything that is not low risk.

`pnpm run verify` is the single local gate. CI runs the same command. The pre-commit hook runs lint and the format check. The pre-push hook runs the typecheck.

This file is a map. Open the page that owns the task:

- Contributing and setup: [README.md](README.md)
- Architecture and primitives: [ai-docs/primitives.md](ai-docs/primitives.md)
- Standards: [ai-docs/component-standards.md](ai-docs/component-standards.md), [ai-docs/testing-standards.md](ai-docs/testing-standards.md), [ai-docs/typescript-standard.md](ai-docs/typescript-standard.md)
- Features: [ai-docs/features/optimal-stopping.md](ai-docs/features/optimal-stopping.md)
- Decisions (read before proposing a big change): [decisions/](decisions/)
- Proving a change: [.agents/skills/control-ferzos-website/SKILL.md](.agents/skills/control-ferzos-website/SKILL.md)
- Shipping a pull request: [.agents/skills/ship-pr/SKILL.md](.agents/skills/ship-pr/SKILL.md)
- Filing friction: [.agents/skills/friction-log/SKILL.md](.agents/skills/friction-log/SKILL.md)
- Rollback: [ai-docs/rollback.md](ai-docs/rollback.md)
- Factory board (Kody): the project `ferzos/ferzos-website` after Ferdinand connects it at [kody.codes](https://kody.codes)
