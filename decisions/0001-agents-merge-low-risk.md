# 0001: Agents merge only low-risk pull requests

Status: accepted Date: 2026-11-18

## Decision

An agent may merge a pull request only when the risk is low, CI is green, and the merge runs as @ferzos. Medium and high pull requests wait for Ferdinand.

## Why

`main` requires Ferdinand's code-owner review, and a merge to `main` deploys to Vercel Production. Low risk means the change composes existing pieces and the verify command passed.

## Revisit if

Branch protection no longer requires Ferdinand's review, or he allows agents to merge medium-risk pull requests.
