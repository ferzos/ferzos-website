---
name: control-ferzos-website
description: >
  Prove a ferzos-website change against the running app. Use before merging
  any change to pages, the service worker, or deploy behavior.
---

# Control ferzos-website

Use the CLI for every check of the running app.

```bash
pnpm run control -- doctor
pnpm run control -- dev
pnpm run control -- login
pnpm run control -- request GET /optimal-stopping --contains "When should I stop looking?"
pnpm run control -- execute --code-file <fixture>
pnpm run control -- browse --path /optimal-stopping --record
pnpm run control -- map --check
pnpm run control -- preview --pr 12 --request 'GET /optimal-stopping --contains When should I stop looking?'
pnpm run control -- health --origin <production-url> --sha <merge-sha>
```

Add `--json` for a machine-readable result. There is no seed user: `login` reports that this app has no accounts.

## When to use a preview

Use `preview --pr` only for a production-like change: service worker and caching, install metadata, headers, or deploy config. Page copy and calculators are proved locally with `request` or `browse`.

## Proof

1. Update the test that covers the change and run it with `pnpm run typecheck`.
2. `pnpm run control -- doctor`, then `pnpm run control -- dev`.
3. `pnpm run control -- request GET <path> --contains "<text>"`.
4. For a UI change, `pnpm run control -- browse --path <path> --record`. The video is under `.autopilot/browse/`.
5. For a production-like change, `pnpm run control -- preview --pr <n> --request 'GET <path> --contains <text>'`.
6. After the merge deploys, `pnpm run control -- health --origin <production-url> --sha <merge-sha>`.

Cite those commands and their results in the pull request's Testing section.
