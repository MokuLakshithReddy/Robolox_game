/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 
  | 'TITLE'
  | 'HUB'
  | 'PREPARING'
  | 'EXPEDITION'
  | 'DEBRIEF'
  | 'SETTINGS';

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Anomalous';

export type ItemCategory = 'Scrap' | 'Components' | 'Artifacts' | 'Mission' | 'Utility';

export interface ItemDefinition {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  baseValue: number;
  description: string;
  isArtifact?: boolean;
}

export interface InventoryItem {
  instanceId: string;
  itemId: string;
  quantity: number;
}

export interface PlayerProfile {
  schemaVersion: number;
  credits: number;
  materials: Record<string, number>;
  upgrades: {
    satchel: number;     // Level 0-3 (Slots: 8 -> 10 -> 12 -> 14)
    scanner: number;     // Level 0-2 (Scanner range)
    flashlight: number;  // Level 0-2 (Light intensity/radius)
    boots: number;       // Level 0-2 (Movement speed)
  };
  collection: string[];  // Unlocked artifact IDs
  cosmetics: string[];
  statistics: {
    runsStarted: number;
    runsExtracted: number;
    runsFailed: number;
    artifactsExtracted: number;
    totalCreditsEarned: number;
  };
  settings: {
    musicVolume: number;
    effectsVolume: number;
    reducedShake: boolean;
    mouseSensitivity: number;
  };
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  rewardCredits: number;
  targetItemId?: string;
  targetCount?: number;
  completed: boolean;
}

export interface ExpeditionRunState {
  runId: string;
  seed: number;
  phase: 'Preparing' | 'ExpeditionActive' | 'LockdownWarning' | 'ExtractionOpen' | 'ExpeditionResolved';
  elapsedSeconds: number;
  maxDurationSeconds: number;
  lockdownWarningSeconds: number;
  haul: InventoryItem[];
  objectiveCompleted: boolean;
  activeContract: Contract | null;
  playerPos: { x: number; z: number };
  playerHealth: number;
  extracted: boolean;
}
