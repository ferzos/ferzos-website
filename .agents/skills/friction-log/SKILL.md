---
name: friction-log
description: >
  File durable ferzos-website papercuts on the Kody board. Use when a session
  hits leftover friction outside the ship-pr leftover pass.
---

# Friction log

File durable, recurring pain with a clear owner and a reproducible gap: a missing step, a lying type, a broken harness, docs that disagree with the code, or a brittle test. The next agent should be able to act on it without your session. One-off confusion stays in the session.

Fix obvious, low-risk friction in the current change when it is in scope, and mention the fix. File what is left over.

Search open Kody cards for this repo first and comment on a match. One papercut per card. Keep secrets and private data out.

Give each card a priority (`P0`, `P1`, `P2`, or `P3`). Add `needs-decision` when it needs Ferdinand. See `decisions/0003-priority-scheme.md`.

## Command

File on the Kody board for `ferzos/ferzos-website`:

```bash
npx @kodycodes/cli execute --local \
  --code 'import run from "kody:@kentcdodds/friction-log/file"; export default (p) => run(p)' \
  --params '{"target":{"host":"kody","repo":"ferzos/ferzos-website"},"items":[{"title":"…","whatHappened":"…","whatYouWanted":"…","howToReproduce":"…","cost":"…","preliminaryInvestigation":"…","relevantFiles":["…"]}]}'
```

Results land in `filed`, `reused`, `woke`, or `skipped`. A `skipped` item did not meet the bar; leave it unfiled. Then set the priority on each filed card.

The Kody project has to exist first. Until Ferdinand connects it, record the papercut in the session summary instead of inventing a GitHub issue.
