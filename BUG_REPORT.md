# Bug Report Log

Use this file for the mandatory policy of logging known failing tests or compile regressions when a PR is created with known problems.

Each entry should include:
- Date
- Issue title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Status (open / in-progress / fixed)
- Fix plan or workaround

Example:
- 2026-03-17: Player jump is too high after jump-pad collision
  - Step: touch jump_pad object
  - Expected: jump v of 450
  - Actual: jump v of 720
  - Status: open
  - Plan: clamp pad strength in `MainScene.handleJumpPad()` to [1.0..1.5]
