# AI Sync Runtime (Cursor + Visual Studio/Builder)

This file defines real-time collaboration rules between:

- Cursor AI (programming lead): backend/API, logic, data flows, bug fixes, safety.
- Visual Studio / Builder AI (visual lead): UI layout, styling, component visuals, responsive polish.

## Core Principle

Both AIs collaborate through Git commits + pull requests + shared status files in this repository.
No direct chat bridge is required; GitHub is the communication bus.

## Live Coordination Files

- `AI_TASK_BOARD.json` -> machine-readable active task board
- `AI_HANDOFF_LOG.md` -> human-readable handoffs and decisions
- `AI_COLLAB_PROTOCOL.md` -> high-level long-term workflow rules

## File Ownership (Conflict Avoidance)

- Visual AI preferred ownership:
  - `pages/*` (visual sections)
  - `components/*` (presentational changes)
  - `styles/*`, `tailwind.config.js`
- Cursor preferred ownership:
  - `lib/*` services/api wiring
  - `hooks/*` behavior/state helpers
  - API contracts, integration docs, tests

If both need same file, use short-lived branch + explicit handoff in `AI_HANDOFF_LOG.md`.

## Update Protocol (Required)

Before starting work:

1. Pull latest `main`
2. Read `AI_TASK_BOARD.json`
3. Claim one task by setting:
   - `status: "in_progress"`
   - `owner: "cursor"` or `owner: "visual-ai"`
   - update `updated_at`

After finishing:

1. Open PR
2. Append handoff note to `AI_HANDOFF_LOG.md`
3. Set task to `review` (or `done` if merged)

## Safety Rules

- Never rewrite history on shared branches.
- Never force-push to `main`.
- Keep changes scoped (small PRs).
- If uncertain, request review instead of broad refactor.
