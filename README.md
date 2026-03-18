# SunsetDash
A chill, low stress, free, fun dash game

## Run locally

1. npm install
2. npm run dev
3. Open http://localhost:5173

## Run tests

- npm test

If you see an error about `ts-node`, make sure the repo has a valid Jest config:
- `jest.config.cjs` is used to avoid ts-node dependency.

## Process and quality rules

- Tests must pass before marking a feature done.
- Do not finish work with failing tests/broken compile unless logged in `BUG_REPORT.md`.
- Fix existing tests/bugs before adding new features.
- Keep `roadmap.md` synced with actual implementation status each session.
- Update `roadmap.md` on every behavior change and include completed checkbox updates in PR notes.
- `roadmap.md` is canonical; do not use another file for done/remaining status without cross-linking.

## Controls

- Left/Right arrows: move
- Up/Space: jump
- R: restart on death or win

## Level format

`firstlevel.json` is used as canonical test level (format: `nicholas-platformer-level-v1`).

Supported object types: `platform`, `spike`, `goal`, `coin`, `jump_pad`.

Metadata fields in `level`:
- `id` (string)
- `name` (string)
- `author` (string)
- `notes` (string)
- `theme` (`background`, `ground`, `accent` color hex strings)
- `music` (`track`, `offset_ms` number)

Import path for Geometry Dash .gmd files:
- `k2` maps to `name`
- `k3` maps to `notes` (base64-decoded if applicable)
- `k5` maps to `author`
- `k1` maps to `id`
- `k4` is the compressed object data (zlib/raw deflate + base64 URL-safe)

## Notes

- Keyboard-only start, minimal code, easy to extend.
- Objects: platform, spike, goal (coin/jump_pad not yet implemented in runtime colliders).
