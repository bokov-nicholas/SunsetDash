# Contributing to SunsetDash

This repo follows a strict “always green and clean” workflow.

1. Install dependencies: `npm install`
2. Run dev: `npm run dev`
3. Run tests: `npm test`
4. If tests fail, fix them before adding new features.
5. If you intentionally check in with a known issue (very rarely), add an entry to `BUG_REPORT.md`.
6. Keep `roadmap.md` updated as you complete Phase tasks.

## Naming
- `roadmap.md` (or `project-plan.md`) is canonical for progress-tracking.
- `BUG_REPORT.md` is canonical bug logging.

## Code style
- Keep code small, readable, and comment major logic.
- Avoid extra abstraction until functionality is stable.

## Issue workflow
- Use GitHub Issues to track bugs.
- Link every `BUG_REPORT.md` entry to a GitHub issue when one is created.
- Any known regressions must be logged in `BUG_REPORT.md` before merging.
