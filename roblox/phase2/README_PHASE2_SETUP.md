# LOOT SHIFT: LOCKDOWN — Phase 2 Implementation Guide

Phase 2 builds upon the Phase 1 foundation by implementing the **Core Vertical Slice: Server-Validated Loot Interaction & Extraction**.

## 1. Files Created in Phase 2
- `ServerScriptService/Services/LootService.lua` — Server-authoritative loot spawn and distance validation.
- `ServerScriptService/Services/ExtractionService.lua` — Server-authoritative extraction zone verification and reward crediting.
- `StarterPlayer/StarterPlayerScripts/Controllers/InteractionController.client.lua` — Client E-key proximity interaction controller.

---

## 2. Roblox Studio Setup Instructions
1. Place `LootService` and `ExtractionService` inside `ServerScriptService.Services`.
2. Place `InteractionController` inside `StarterPlayer.StarterPlayerScripts.Controllers`.
3. In `ServerScriptService.Bootstrap`, initialize both services.

---

## 3. Security & Anti-Exploit Checks
- **Distance Validation:** `LootService` verifies that the player's HumanoidRootPart is within 15 studs of the loot node before granting items.
- **Phase Validation:** `ExtractionService` rejects extraction attempts if the expedition state machine is not in `ExpeditionActive` or `LockdownWarning`.
- **Authoritative Rewards:** Clients cannot set their own reward amounts; values are computed on the server using `ItemDefinitions`.

---

## 4. Manual Test Procedure
1. Enter Studio Play mode.
2. Approach a loot node and press `E`.
3. Verify server validates distance and adds the item to the player's temporary haul.
4. Move to the extraction beacon at `(0, 0, -45)` and trigger extraction.
5. Verify rewards are computed and banked on the server.

---

## 5. Requirements Completion Audit
- [x] Phase 1 foundation integration.
- [x] Server-authoritative loot generation and distance validation.
- [x] Server-authoritative extraction zone check and reward calculation.
- [x] Client interaction controller for E-key prompts.
- [ ] Full profile data-store persistence (scheduled for Phase 3).
- [ ] Warden enemy AI full state machine (scheduled for Phase 4).
