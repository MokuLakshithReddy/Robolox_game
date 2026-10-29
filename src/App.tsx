/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameState, PlayerProfile, ExpeditionRunState, InventoryItem } from './types';
import { gameStore, ITEM_DEFINITIONS } from './services/gameStore';
import { soundService } from './services/soundService';
import { TitleScreen } from './components/TitleScreen';
import { WorkshopHub } from './components/WorkshopHub';
import { ExpeditionCanvas } from './components/ExpeditionCanvas';
import { ExpeditionHUD } from './components/ExpeditionHUD';
import { DebriefModal } from './components/DebriefModal';
import { CatalogModal } from './components/CatalogModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [profile, setProfile] = useState<PlayerProfile>(gameStore.getProfile());
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(true);
  const [canExtract, setCanExtract] = useState(false);

  // Expedition Run State
  const [runState, setRunState] = useState<ExpeditionRunState>({
    runId: 'run_init',
    seed: 12345,
    phase: 'ExpeditionActive',
    elapsedSeconds: 0,
    maxDurationSeconds: 300, // 5 minutes
    lockdownWarningSeconds: 180, // Warning at 3 mins
    haul: [],
    objectiveCompleted: false,
    activeContract: null,
    playerPos: { x: 0, z: 35 },
    playerHealth: 100,
    extracted: false
  });

  const satchelCapacity = gameStore.getSatchelCapacity();

  // Expedition timer & phase progression loop
  useEffect(() => {
    if (gameState !== 'EXPEDITION') return;

    const timer = setInterval(() => {
      setRunState(prev => {
        if (prev.phase === 'ExpeditionResolved') return prev;

        const nextElapsed = prev.elapsedSeconds + 1;
        let nextPhase = prev.phase;

        if (nextElapsed >= prev.lockdownWarningSeconds && prev.phase === 'ExpeditionActive') {
          nextPhase = 'LockdownWarning';
          soundService.startSiren();
          soundService.playAlarm();
        }

        if (nextElapsed >= prev.maxDurationSeconds) {
          // Time expired! Failed extraction
          soundService.stopSiren();
          gameStore.recordRun(false, [], []);
          setGameState('DEBRIEF');
          return { ...prev, phase: 'ExpeditionResolved' };
        }

        return {
          ...prev,
          elapsedSeconds: nextElapsed,
          phase: nextPhase
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const handleLaunchExpedition = () => {
    soundService.playClick();
    setRunState({
      runId: `run_${Date.now()}`,
      seed: Math.floor(Math.random() * 100000),
      phase: 'ExpeditionActive',
      elapsedSeconds: 0,
      maxDurationSeconds: 300,
      lockdownWarningSeconds: 180,
      haul: [],
      objectiveCompleted: false,
      activeContract: null,
      playerPos: { x: 0, z: 35 },
      playerHealth: 100,
      extracted: false
    });
    setCanExtract(false);
    setGameState('EXPEDITION');
  };

  const handleCollectItem = (item: InventoryItem) => {
    const totalSlots = runState.haul.reduce((acc, i) => acc + i.quantity, 0);
    if (totalSlots >= satchelCapacity) return; // Satchel full

    setRunState(prev => ({
      ...prev,
      haul: [...prev.haul, item]
    }));
  };

  const handleReachExtraction = () => {
    if (!canExtract) {
      setCanExtract(true);
    }
  };

  const handleTriggerExtraction = () => {
    soundService.stopSiren();
    soundService.playSuccess();

    // Calculate total earned credits
    const securedCredits = runState.haul.reduce((acc, item) => {
      const def = ITEM_DEFINITIONS[item.itemId];
      return acc + (def ? def.baseValue * item.quantity : 0);
    }, 0);

    const artifactsFound = runState.haul
      .map(i => i.itemId)
      .filter(id => ITEM_DEFINITIONS[id]?.isArtifact);

    gameStore.addCredits(securedCredits);
    gameStore.recordRun(true, runState.haul, artifactsFound);
    setProfile({ ...gameStore.getProfile() });
    setGameState('DEBRIEF');
  };

  const handleReturnToWorkshop = () => {
    soundService.stopSiren();
    setProfile({ ...gameStore.getProfile() });
    setGameState('HUB');
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {gameState === 'TITLE' && (
        <TitleScreen
          onStart={() => setGameState('HUB')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCatalog={() => setIsCatalogOpen(true)}
        />
      )}

      {gameState === 'HUB' && (
        <WorkshopHub
          profile={profile}
          onLaunchExpedition={handleLaunchExpedition}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          onProfileUpdate={() => setProfile({ ...gameStore.getProfile() })}
        />
      )}

      {gameState === 'EXPEDITION' && (
        <div className="relative w-full h-full">
          <ExpeditionCanvas
            runState={runState}
            satchelCapacity={satchelCapacity}
            flashlightOn={flashlightOn}
            onCollectItem={handleCollectItem}
            onReachExtraction={handleReachExtraction}
            onUpdatePlayerPos={(pos) => setRunState(prev => ({ ...prev, playerPos: pos }))}
          />

          <ExpeditionHUD
            runState={runState}
            profile={profile}
            satchelCapacity={satchelCapacity}
            flashlightOn={flashlightOn}
            onToggleFlashlight={() => {
              soundService.playClick();
              setFlashlightOn(prev => !prev);
            }}
            onTriggerExtraction={handleTriggerExtraction}
            canExtract={canExtract}
          />
        </div>
      )}

      {gameState === 'DEBRIEF' && (
        <DebriefModal
          success={runState.extracted || runState.phase === 'ExpeditionResolved' && runState.haul.length > 0}
          haul={runState.haul}
          artifactsFound={runState.haul.map(i => i.itemId).filter(id => ITEM_DEFINITIONS[id]?.isArtifact)}
          creditsEarned={0}
          onReturnToWorkshop={handleReturnToWorkshop}
        />
      )}

      {isCatalogOpen && (
        <CatalogModal
          profile={profile}
          onClose={() => setIsCatalogOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          profile={profile}
          onClose={() => setIsSettingsOpen(false)}
          onUpdate={() => setProfile({ ...gameStore.getProfile() })}
        />
      )}
    </div>
  );
}
