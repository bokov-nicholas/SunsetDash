# Sunset Dash Checklist

Current status: basic single-player platforming and level JSON/GD importer are implemented; Phase 3+ is pending.

This is going to be a platformer that will support import of GD levels, but with 
easier less stressful movement and eventual multiplayer support.

## Phase 0 — Setup
- [X] Pick the project name
- [X] Create a GitHub repo
- [X] Configure codespaces to have Node.js
- [X] Create a TypeScript project
- [X] Add Phaser
- [X] Run the starter app in a browser
- [ ] Put the game online on Cloudflare Pages

## Phase 1 — Earliest Playable MVP
- [x] Show a player cube on screen
- [x] Add gravity
- [x] Add left movement
- [x] Add right movement
- [x] Add stop
- [x] Add jump
- [x] Add a floor
- [x] Make the camera follow the player
- [x] Add one spike
- [x] Make spikes cause death
- [x] Add restart after death
- [x] Add a goal object
- [x] Make touching the goal win the level

## Phase 2 — Load a Level From Data
- [x] Read the JSON level file
- [x] Spawn the player from the file
- [x] Build platforms from the file
- [x] Build spikes from the file
- [x] Build jump pads from the file
- [x] Build coins from the file
- [x] Build the goal from the file
- [x] Load level colors from the file
- [x] import into our json format the supported elements from a .gmd file like this one: <d><k>kCEK</k><i>4</i><k>k1</k><i>102534878</i><k>k18</k><i>13</i><k>k36</k><i>55</i><k>k85</k><i>11</i><k>k86</k><i>9</i><k>k87</k><i>557251</i><k>k88</k><s>19,60,21</s><k>k19</k><i>100</i><k>k71</k><i>100</i><k>k90</k><i>100</i><k>k2</k><s>How2</s><k>k4</k><s>H4sIAAAAAAAAC62VUXIjIQxEL0S2JCEGqP3KGXIADpAr7OEX0YM92AMeV_KDbJ5oGhDM95dPjotSkcISii8SQmFGEAR0avngshUmohILFw7WpEIlFf7HpUmQXJPgn0vkUwnLwYBLIlJs_JnQW1tS__9cQxcLoipBrxYTpouBCJy8lNleyFze3NWCLovE3xA5P573RGr3L4ic3503Rc5Ox31_sndkISBsCOpqi9-xtbJz_ONk4ctnsNZCp4FPbS0oE5KQJUgTZEh0bOmEwAjSgkBKoOLBPJiHNYWYQkwDmEdQBPj2mMjeLQu5Bd7tQ0x2nwzXNfy1OcXVbXRVs6rXH9w707HT1VFWuzv0vIK6gnEBNRvUcxhkBcMKpglMNid1Q95g34KG_DN6HL29TskvU7C0dUpbQwyDwX0c9ZVt7oOTnaryQVX_gEsFta7EbfGgVTNslyrgzmM-yo4J9TaJS6iNrSd0Fqt9MdfWKdJtcdicgmvjeaiBA7bZmeE7T3kaV9143646rbMH5W4n67V0n5ibOxypR35txbaa6zUVZEkzgZ3RjCwQupOQD8PZTqAK1LiXJAsPrm7dcTQ7FjKLLrGnNfZrvK1xXmKVGU533OvXKjXTyHRg5-N5lgML4XRP0R1nvlcvR5d8pkJ0chHaTWF_uC5RfdMZXtMDCDybvifozH1PmJfMnrHRsaKPGVHDYZVP99lY0kfn997ZrqWpZ6M5nx4Tuk8GbfEwSvyzR6FWHPYZG75gFIbuBx9CaYmZ11in2NtbcdOXW3FQvBdGW1QXsY93S8EDfnuM97cmD9c6WJZEeniY2u_8cIWHawY4XsGb7f85fd4B8wwAAA==</s><k>k3</k><s>YmxhaCBibGFoIGJsYWgoRm9yIFZpZGVvKQ==</s><k>k5</k><s>realimposter999</s><k>k95</k><i>2172</i><k>k6</k><i>240375337</i><k>k60</k><i>27280123</i><k>k9</k><i>10</i><k>k10</k><i>20</i><k>k11</k><i>35</i><k>k22</k><i>5</i><k>k21</k><i>3</i><k>k16</k><i>1</i><k>k17</k><i>22</i><k>k80</k><i>620</i><k>k83</k><i>547</i><k>k64</k><i>1</i><k>k41</k><i>1</i><k>k50</k><i>40</i><k>k48</k><i>66</i><k>k66</k><i>2</i></d>
- [X] Add a button to our webapp for uploading .gmd files and make it work
- [X] Add a button to our webapp for downloading json levels that have been converted from .gmd
- [X] Fix the gmd to json import bug where the x and y dimensions are swapped and all the scales are way too small

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
- [X] Decide what GD input format to import
- [X] Write a tiny importer for very simple levels
- [X] Import blocks and spikes first
- [ ] Import pads and portals next
- [X] Import colors next
- [ ] Mark unsupported items clearly
- [X] Save imported levels in Nicholas format

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
- [ ] Keep every new feature small, well documented with code comments, and easy for kids to understand
- [ ] Make the game playable again after every small chunk
- [ ] Do not wait for perfection before testing
- [ ] Avoid writing functions that are used only once-- inline that code instead
- [ ] Wherever possible, use existing libraries to reduce the amount of new code that must be written

## Process rules (mandatory)
- [ ] Always run tests before finishing any work: `npm test`
- [ ] Never merge or mark work done while tests are failing unless the bug is documented in `BUG_REPORT.md` and triaged
- [ ] Never ship code that is broken or non-compiling
- [ ] Always fix existing failing tests or broken code first before implementing new features
- [ ] Update this roadmap with each significant implementation step to keep it in sync with actual work

