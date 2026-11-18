# 0003: Priority is P0–P3 plus needs-decision

Status: accepted Date: 2026-11-18

## Decision

Rank every card agents file as `P0`, `P1`, `P2`, or `P3` on the Kody board. Mark `needs-decision` when the card needs a human call. Agents pick up the highest priority that is not marked `needs-decision`.

`P0` is broken for users or blocking agents now. `P1` costs real time on most pull requests. `P2` is worth fixing after higher work. `P3` is nice to have.

## Why

The repository had no ranking scheme. This is the default the setup interview adopted.

## Revisit if

The board starts using a different priority field.
