/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Clock, Backpack, Flashlight, Target, ArrowUpRight } from 'lucide-react';
import { ExpeditionRunState, PlayerProfile, InventoryItem } from '../types';
import { ITEM_DEFINITIONS } from '../services/gameStore';

interface ExpeditionHUDProps {
  runState: ExpeditionRunState;
  profile: PlayerProfile;
  satchelCapacity: number;
  flashlightOn: boolean;
  onToggleFlashlight: () => void;
  onTriggerExtraction: () => void;
  canExtract: boolean;
}

export const ExpeditionHUD: React.FC<ExpeditionHUDProps> = ({
  runState,
  satchelCapacity,
  flashlightOn,
  onToggleFlashlight,
  onTriggerExtraction,
  canExtract
}) => {
  const remainingSeconds = Math.max(0, runState.maxDurationSeconds - Math.floor(runState.elapsedSeconds));
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const totalHaulSlots = runState.haul.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 font-sans select-none z-20">
      {/* Top Bar */}
      <div className="flex justify-between items-start w-full">
        {/* Phase & Timer */}
        <div className="flex items-center space-x-4 bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex items-center space-x-2 text-amber-400">
            <Clock className="w-5 h-5 animate-pulse" />
            <span className="font-mono font-bold text-lg tabular-nums">{timeFormatted}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <span className={`font-mono text-xs uppercase tracking-wider font-semibold ${
            runState.phase === 'LockdownWarning' ? 'text-red-400 animate-pulse' : 'text-slate-300'
          }`}>
            {runState.phase === 'LockdownWarning' ? '⚠️ LOCKDOWN IMMINENT' : 'District Scavenging'}
          </span>
        </div>

        {/* Carry Inventory Meter */}
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg">
          <Backpack className="w-5 h-5 text-amber-400" />
          <div className="font-mono text-xs">
            <span className="text-slate-400">Satchel: </span>
            <span className={`font-bold ${totalHaulSlots >= satchelCapacity ? 'text-red-400' : 'text-white'}`}>
              {totalHaulSlots} / {satchelCapacity}
            </span>
          </div>
        </div>
      </div>

      {/* Center Warning Banner during Lockdown */}
      {runState.phase === 'LockdownWarning' && (
        <div className="self-center bg-red-950/90 border border-red-500/50 text-red-300 px-6 py-3 rounded-2xl backdrop-blur-md shadow-2xl flex items-center space-x-3 animate-bounce">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          <span className="font-mono font-bold text-sm tracking-wider">SECTOR SEALING • HEAD TO EXTRACTION BEACON</span>
        </div>
      )}

      {/* Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="self-center pointer-events-auto bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md shadow-2xl flex items-center space-x-6">
        <button
          onClick={onToggleFlashlight}
          className={`px-4 py-3 rounded-xl border flex items-center space-x-2 font-mono text-xs transition ${
            flashlightOn
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <Flashlight className="w-4 h-4" />
          <span>Flashlight (F: {flashlightOn ? 'ON' : 'OFF'})</span>
        </button>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <Target className="w-4 h-4 text-amber-400" />
          <span>Move: <strong className="text-slate-200">WASD</strong></span>
          <span>•</span>
          <span>Collect: <strong className="text-slate-200">E / Walk over</strong></span>
        </div>

        {canExtract && (
          <>
            <div className="h-6 w-px bg-slate-800" />
            <button
              onClick={onTriggerExtraction}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs tracking-wider font-mono shadow-lg shadow-emerald-500/30 flex items-center space-x-2 transition animate-pulse"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>EXTRACT NOW</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
