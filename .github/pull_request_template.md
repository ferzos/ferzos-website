## Intent

<What the pull request does, one or two sentences.>

Door: <two-way | one-way>
<!-- one-way: data, contracts, security, money, public API, store release -->

Cleanup: <none | needed (#issue) | done>

## Why

## Testing

<Commands run and their result: `pnpm run verify`, then the control CLI proof
(`pnpm run control -- request GET /path --contains "text"`,
`pnpm run control -- browse --path /path --record` for UI).
What data you used. Why any test expectation changed. Say what you could not verify.>

## System recap

Risk: <low | medium | high> Touches: <primitive or area> (<composes | extends | adds>)
