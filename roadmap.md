# Nicholas Game Checklist

## Phase 0 — Setup
- [ ] Pick the project name
- [ ] Create a GitHub repo
- [ ] Create a local project folder
- [ ] Install Node.js
- [ ] Create a TypeScript project
- [ ] Add Phaser
- [ ] Run the starter app in a browser
- [ ] Put the game online on Cloudflare Pages

## Phase 1 — Earliest Playable MVP
- [ ] Show a player cube on screen
- [ ] Add gravity
- [ ] Add left movement
- [ ] Add right movement
- [ ] Add stop
- [ ] Add jump
- [ ] Add a floor
- [ ] Make the camera follow the player
- [ ] Add one spike
- [ ] Make spikes cause death
- [ ] Add restart after death
- [ ] Add a goal object
- [ ] Make touching the goal win the level

## Phase 2 — Load a Level From Data
- [ ] Read the JSON level file
- [ ] Spawn the player from the file
- [ ] Build platforms from the file
- [ ] Build spikes from the file
- [ ] Build jump pads from the file
- [ ] Build coins from the file
- [ ] Build the goal from the file
- [ ] Load level colors from the file

## Phase 3 — Make It Feel More Like Classic GD
- [ ] Make the player cube look more GD-like
- [ ] Add simple rotation while jumping
- [ ] Add cleaner death effects
- [ ] Add cleaner win effects
- [ ] Add a simple progress bar
- [ ] Add a simple level title screen

## Phase 4 — Theme System
- [ ] Separate game logic from art
- [ ] Put colors in a theme file
- [ ] Put object art in a theme file
- [ ] Make it easy to swap themes
- [ ] Create Theme 1: Classic
- [ ] Create Theme 2: Silly test theme

## Phase 5 — Better Level Format
- [ ] Add decorations
- [ ] Add portals
- [ ] Add triggers
- [ ] Add color channels
- [ ] Add layers/groups
- [ ] Add object rotation and scale
- [ ] Add custom metadata
- [ ] Version the format clearly

## Phase 6 — Geometry Dash Import
- [ ] Decide what GD input format to import
- [ ] Write a tiny importer for very simple levels
- [ ] Import blocks and spikes first
- [ ] Import pads and portals next
- [ ] Import colors next
- [ ] Mark unsupported items clearly
- [ ] Save imported levels in Nicholas format

## Phase 7 — Polish the Single-Player Game
- [ ] Add checkpoints if wanted
- [ ] Add pause
- [ ] Add simple settings
- [ ] Add keyboard support cleanup
- [ ] Add touch controls for phones/tablets
- [ ] Add sound effects
- [ ] Add music support

## Phase 8 — Online Lobby
- [ ] Create a lobby page
- [ ] Let a player create a room
- [ ] Let a player join a room
- [ ] Show who is in the room
- [ ] Let players pick a level
- [ ] Put the lobby on Cloudflare Workers / Durable Objects

## Phase 9 — First Multiplayer
- [ ] Start with ghost players
- [ ] Show other players moving through the level
- [ ] Sync player position
- [ ] Sync deaths and wins
- [ ] Add a rematch button
- [ ] Test lag and weird edge cases

## Phase 10 — Long-Term Expansion
- [ ] Add more player modes
- [ ] Add more object types
- [ ] Add level sharing
- [ ] Add public lobbies
- [ ] Add co-op ideas
- [ ] Add race mode
- [ ] Add level editor later if still wanted

## Suggested Tiny Build Order
- [ ] 1. Player cube on screen
- [ ] 2. Move left and right
- [ ] 3. Jump
- [ ] 4. Floor
- [ ] 5. Spike death
- [ ] 6. Restart
- [ ] 7. Goal
- [ ] 8. Load this from JSON
- [ ] 9. Put it online
- [ ] 10. Make it prettier

## Rule for the whole project
- [ ] Keep every new feature small
- [ ] Make the game playable again after every small chunk
- [ ] Do not wait for perfection before testing
