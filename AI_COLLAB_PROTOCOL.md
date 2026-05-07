# Exit From Matrix AI Collaboration Protocol

This repository uses a two-AI workflow:

- Builder AI: visual editing, layout, design system, page composition.
- Coding AI (Cursor): backend integration, API wiring, data/state logic, bug fixes, tests, and release safety.

## Single Source of Truth

- Product rules: `EXIT_FROM_MATRIX_CANONICAL_RULES_V1.md` (in master project context).
- Web implementation scope: this repository.
- Any conflict between visual ideas and core governance rules must be resolved in favor of governance rules.

## Branch Strategy

- `main`: stable production-ready baseline.
- `builder/*`: Builder visual work branches.
- `dev/*`: integration and logic branches.

Never commit directly to `main`.

## Ownership Split

- Builder AI owns:
  - `pages/*` layout structure
  - presentational components
  - theme/tokens/visual polish
- Coding AI owns:
  - API integration (`services`, hooks, request handling)
  - auth/session behavior
  - validation, error states, and business rules
  - regressions, test safety, and merge readiness

## Required PR Handoff Format

Every PR description must include:

1. Goal (what changed and why)
2. Files changed
3. UI impact (screens/components)
4. Logic impact (if any)
5. Manual test checklist
6. Risks / open questions

## No-Break Rules

- Do not rename routes without explicit note in PR.
- Do not remove required user flows:
  - auth
  - dashboard
  - forum posting
  - voting
  - system monitor access
- Preserve accessibility and readable contrast.
- Avoid destructive refactors in visual-only PRs.

## Coordination Method

1. Builder AI creates visual PR.
2. Coding AI reviews and patches integration issues.
3. Merge only after both visual and functional checks pass.

## Quick Start Checklist

- [ ] Branch created (`builder/*` or `dev/*`)
- [ ] PR description uses handoff format
- [ ] Visual changes verified on desktop + mobile
- [ ] No broken API bindings
- [ ] Ready for merge
