/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ItemDefinition, PlayerProfile, Contract } from '../types';

export const ITEM_DEFINITIONS: Record<string, ItemDefinition> = {
  scrap_metal: {
    id: 'scrap_metal',
    name: 'Scrap Metal',
    category: 'Scrap',
    rarity: 'Common',
    baseValue: 8,
    description: 'Corroded structural plating and rivets. Essential baseline salvage.'
  },
  copper_wire: {
    id: 'copper_wire',
    name: 'Copper Spool',
    category: 'Scrap',
    rarity: 'Common',
    baseValue: 12,
    description: 'Insulated wiring stripped from industrial conduit.'
  },
  battery_cell: {
    id: 'battery_cell',
    name: 'Ion Power Cell',
    category: 'Components',
    rarity: 'Uncommon',
    baseValue: 35,
    description: 'Partially charged reserve power unit from district substations.'
  },
  circuit_board: {
    id: 'circuit_board',
    name: 'Mainframe Logic Board',
    category: 'Components',
    rarity: 'Rare',
    baseValue: 80,
    description: 'Intact micro-processor assembly from automated terminal stations.'
  },
  relic_compass: {
    id: 'relic_compass',
    name: 'Anomalous Gyro-Compass',
    category: 'Artifacts',
    rarity: 'Rare',
    baseValue: 120,
    description: 'Spins wildly near magnetic anomalies. Prized collector artifact.',
    isArtifact: true
  },
  signal_lens: {
    id: 'signal_lens',
    name: 'Prismatic Signal Lens',
    category: 'Artifacts',
    rarity: 'Epic',
    baseValue: 250,
    description: 'Optical component that refracts unknown radiation frequencies.',
    isArtifact: true
  },
  core_monolith: {
    id: 'core_monolith',
    name: 'Lockdown Core Monolith',
    category: 'Artifacts',
    rarity: 'Anomalous',
    baseValue: 600,
    description: 'Heavy crystalline object recovered from the restricted central core.',
    isArtifact: true
  },
  emergency_fuse: {
    id: 'emergency_fuse',
    name: 'Grid Circuit Fuse',
    category: 'Mission',
    rarity: 'Common',
    baseValue: 20,
    description: 'Restores auxiliary power to sealed district gates.'
  }
};

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'c1',
    title: 'Substation Salvage',
    description: 'Recover 2 Copper Spools or Scrap Metal from the Old Market District.',
    rewardCredits: 100,
    targetItemId: 'copper_wire',
    targetCount: 2,
    completed: false
  },
  {
    id: 'c2',
    title: 'Anomalous Discovery',
    description: 'Successfully extract with at least 1 Artifact from the lockdown zone.',
    rewardCredits: 250,
    completed: false
  }
];

const STORAGE_KEY = 'loot_shift_lockdown_profile_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  schemaVersion: 1,
  credits: 150,
  materials: {
    scrap: 5
  },
  upgrades: {
    satchel: 0,     // 8 slots base
    scanner: 0,     // Level 0
    flashlight: 0,  // Level 0
    boots: 0        // Level 0
  },
  collection: [],
  cosmetics: ['default_workshop'],
  statistics: {
    runsStarted: 0,
    runsExtracted: 0,
    runsFailed: 0,
    artifactsExtracted: 0,
    totalCreditsEarned: 150
  },
  settings: {
    musicVolume: 0.5,
    effectsVolume: 0.7,
    reducedShake: false,
    mouseSensitivity: 1.0
  }
};

class GameStore {
  private profile: PlayerProfile;

  constructor() {
    this.profile = this.loadProfile();
  }

  private loadProfile(): PlayerProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_PROFILE };
  }

  public saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch {
      // storage quota or private mode
    }
  }

  public getProfile(): PlayerProfile {
    return this.profile;
  }

  public getSatchelCapacity(): number {
    const lvl = this.profile.upgrades.satchel;
    return 8 + lvl * 2; // Level 0: 8, Level 1: 10, Level 2: 12, Level 3: 14
  }

  public addCredits(amount: number) {
    this.profile.credits += amount;
    if (amount > 0) {
      this.profile.statistics.totalCreditsEarned += amount;
    }
    this.saveProfile();
  }

  public deductCredits(amount: number): boolean {
    if (this.profile.credits >= amount) {
      this.profile.credits -= amount;
      this.saveProfile();
      return true;
    }
    return false;
  }

  public recordRun(success: boolean, extractedHaul: Array<{ itemId: string; quantity: number }>, artifactsFound: string[]) {
    this.profile.statistics.runsStarted += 1;
    if (success) {
      this.profile.statistics.runsExtracted += 1;
      this.profile.statistics.artifactsExtracted += artifactsFound.length;

      // Register collection
      artifactsFound.forEach(artId => {
        if (!this.profile.collection.includes(artId)) {
          this.profile.collection.push(artId);
        }
      });
    } else {
      this.profile.statistics.runsFailed += 1;
    }
    this.saveProfile();
  }

  public purchaseUpgrade(upgradeKey: keyof PlayerProfile['upgrades'], cost: number): boolean {
    const currentLvl = this.profile.upgrades[upgradeKey];
    if (currentLvl >= 3 && upgradeKey === 'satchel') return false;
    if (currentLvl >= 2 && upgradeKey !== 'satchel') return false;

    if (this.deductCredits(cost)) {
      this.profile.upgrades[upgradeKey] += 1;
      this.saveProfile();
      return true;
    }
    return false;
  }

  public updateSettings(settings: Partial<PlayerProfile['settings']>) {
    this.profile.settings = { ...this.profile.settings, ...settings };
    this.saveProfile();
  }

  public resetProfile() {
    this.profile = { ...DEFAULT_PROFILE };
    this.saveProfile();
  }
}

export const gameStore = new GameStore();
