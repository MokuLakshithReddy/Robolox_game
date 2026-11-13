# Loot Shift: Lockdown — Extraction Survival Prototype

A browser-based 3D extraction-survival game prototype. Players enter an abandoned district, scavenge loot, manage a limited satchel, complete a contract, and extract before the district lockdown timer expires. The repository also contains experimental Roblox Luau service scaffolding in separate phase folders.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/3D-Three.js-black?logo=threedotjs)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vite.dev/)
[![Stars](https://img.shields.io/github/stars/MokuLakshithReddy/Robolox_game?style=flat-square)](https://github.com/MokuLakshithReddy/Robolox_game/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/MokuLakshithReddy/Robolox_game?style=flat-square)](https://github.com/MokuLakshithReddy/Robolox_game/commits/main)

## Expedition loop

~~~mermaid
flowchart TD
    A["Title screen"] --> B["Workshop hub"]
    B --> C["Launch 5-minute expedition"]
    C --> D["Explore the district and collect loot"]
    D --> E["Manage satchel and contract objective"]
    E --> F["Lockdown warning at 3 minutes"]
    F --> G{"Extract before 5-minute timer ends?"}
    G -->|Yes| H["Bank the haul and review run"]
    G -->|No| I["Failed extraction / debrief"]
    H --> B
    I --> B
~~~

## Current project layout

- src/: React interface, expedition state, Three.js canvas, HUD, workshop, catalog, and debrief components.
- roblox/phase1/: Roblox Studio setup and initial server/client service structure.
- roblox/phase2/: additional extraction, loot, and interaction service work.
- roblox/audit_fixes/: audit notes and hardened server-side service implementations.

The primary playable loop in this repository is currently the browser prototype. The Roblox folders are separate implementation work and should not be interpreted as proof that the browser build is a published multiplayer Roblox experience.

## Run locally

Requirements: Node.js and Bun/npm-compatible package installation.

~~~bash
npm install
npm run dev
~~~

Create a production build with npm run build. TypeScript validation is available through npm run lint.

## Security and evidence

The Roblox audit report documents rate limiting for remote actions, duplicate-extraction prevention, DataStore failure handling, and server-side distance checks. See [the audit report](roblox/audit_fixes/AUDIT_REPORT.md). These are code-audit notes for the Luau scaffolding, not a third-party security certification.

No automated gameplay benchmark, calibrated difficulty evaluation, or verified multiplayer performance report is currently published.

**Why it matters:** the project explores a tension between risk and reward: every extra minute spent scavenging may improve the haul while reducing the time available to reach extraction.
