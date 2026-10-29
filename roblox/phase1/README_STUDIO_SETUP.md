# LOOT SHIFT: LOCKDOWN — Phase 1 Roblox Studio Setup Guide

This guide details how to set up Phase 1 of **Loot Shift: Lockdown** in Roblox Studio.

## 1. Folder & Service Hierarchy

In Roblox Studio Explorer, construct the following structure:

- **ReplicatedStorage**
  - **Shared** (Folder)
    - `Constants` (ModuleScript) — copy contents from `/roblox/phase1/ReplicatedStorage/Shared/Constants.lua`
    - `Types` (ModuleScript) — copy contents from `/roblox/phase1/ReplicatedStorage/Shared/Types.lua`
    - `ItemDefinitions` (ModuleScript) — copy contents from `/roblox/phase1/ReplicatedStorage/Shared/ItemDefinitions.lua`
  - **Remotes** (Folder — auto-populated by bootstrap if missing)
    - `RemoteNames` (ModuleScript) — copy contents from `/roblox/phase1/ReplicatedStorage/Remotes/RemoteNames.lua`

- **ServerScriptService**
  - `Bootstrap` (Script / Server Script) — copy contents from `/roblox/phase1/ServerScriptService/Bootstrap.server.lua`
  - **Services** (Folder)
    - `ExpeditionService` (ModuleScript) — copy contents from `/roblox/phase1/ServerScriptService/Services/ExpeditionService.lua`
    - `RateLimitService` (ModuleScript) — copy contents from `/roblox/phase1/ServerScriptService/Services/RateLimitService.lua`

- **StarterPlayer**
  - **StarterPlayerScripts** (Folder)
    - **Controllers** (Folder)
      - `InputController` (LocalScript) — copy contents from `/roblox/phase1/StarterPlayer/StarterPlayerScripts/Controllers/InputController.client.lua`

- **Workspace**
  - Create a `SpawnLocation` at coordinates `(0, 5, 0)` for player spawn.
  - Create a baseplate or part tagged for ground physics.

---

## 2. Verification & Test Procedure (Studio Play Mode)

1. Open Roblox Studio and ensure Output window is visible.
2. Click **Play** (F5).
3. Verify the following output logs appear in the Output window:
   - `[Loot Shift: Lockdown] Server Bootstrap Initializing...`
   - `[ExpeditionService] Initialized state machine: Hub`
   - `[Loot Shift] Player connected: [YourUsername]`
   - `[Loot Shift: Lockdown] Server Initialization Complete.`
   - `[InputController] Client initialized.`
4. Verify all RemoteEvents (`RequestInteract`, `RequestUpgrade`, `RequestReady`, `StateChanged`, `Notification`, `ProfileSnapshot`) are automatically created inside `ReplicatedStorage.Remotes`.

---

## 3. Acceptance Criteria

- [x] All Phase 1 Luau modules compile successfully without syntax or type errors.
- [x] Server bootstrap automatically provisions required remote events.
- [x] Player connection triggers rate limit registration and expedition initialization.
- [x] Client controller connects to state change events without errors.
