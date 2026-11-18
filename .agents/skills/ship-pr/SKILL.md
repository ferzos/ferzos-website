---
name: ship-pr
description: >
  Take a ferzos-website pull request to done. Merge only low-risk work with
  green CI, as @ferzos. Medium and high wait for Ferdinand.
---

# Ship a pull request

Tick the Kody ship-pr step, do that step, and tick again until it is done or must stop.

```bash
npx @kodycodes/cli execute --local \
  --code 'import run from "kody:@kentcdodds/ship-pr/tick"; export default (p) => run(p)' \
  --params '{
    "prUrl": "https://github.com/ferzos/ferzos-website/pull/N",
    "risk": "low",
    "applySafeAutomations": true
  }'
```

Follow what it returns until `exit.done`, with the merge rules below.

- **Risk:** `low` composes existing pieces. `medium` changes a primitive's behavior and needs a Copilot review plus control-CLI proof. `high` is a one-way door (data, contracts, security, money, a public API, or a store release) and waits for Ferdinand. See `decisions/0005-high-risk-needs-a-human.md`.
- **Merge:** merge only `low` after `pnpm run verify` is green on the pull request, and only as @ferzos. `main` requires his code-owner review. If the tick says to merge a medium or high pull request, stop and leave it for Ferdinand.
- **Proof:** medium work cites `control-ferzos-website` commands from `.agents/skills/control-ferzos-website/SKILL.md`.
- **Friction:** file leftovers with `.agents/skills/friction-log/SKILL.md` before the summary. Rank each card `P0`–`P3`. Mark `needs-decision` when it needs Ferdinand.

The Kody project for `ferzos/ferzos-website` has to exist before the tick can update the board. Connecting it is Ferdinand's step.
