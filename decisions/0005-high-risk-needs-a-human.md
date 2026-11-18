# 0005: High-risk changes need Ferdinand

Status: accepted Date: 2026-11-18

## Decision

Agents do not merge a high-risk change. High risk means a one-way door: data, contracts, security, money, a public API, or a store release.

## Why

Those changes are hard to undo. This site has no accounts, payments, or stored user data today. A low-risk merge still deploys to Vercel Production, and that deploy is covered by 0001.

## Revisit if

The site gains accounts, payments, stored user data, or a public API other people depend on.
