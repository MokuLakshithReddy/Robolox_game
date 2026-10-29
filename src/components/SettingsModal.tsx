/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Settings, Volume2, RotateCcw } from 'lucide-react';
import { PlayerProfile } from '../types';
import { gameStore } from '../services/gameStore';
import { soundService } from '../services/soundService';

interface SettingsModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onUpdate: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ profile, onClose, onUpdate }) => {
  const [effectsVol, setEffectsVol] = React.useState(profile.settings.effectsVolume);
  const [musicVol, setMusicVol] = React.useState(profile.settings.musicVolume);

  const handleEffectsChange = (val: number) => {
    setEffectsVol(val);
    gameStore.updateSettings({ effectsVolume: val });
    soundService.setVolumes(val, musicVol);
    onUpdate();
  };

  const handleMusicChange = (val: number) => {
    setMusicVol(val);
    gameStore.updateSettings({ musicVolume: val });
    soundService.setVolumes(effectsVol, val);
    onUpdate();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all profile data, credits, and catalog unlocks?")) {
      gameStore.resetProfile();
      soundService.playFail();
      onUpdate();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-3 text-slate-200">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold tracking-wide">OPERATIVE SETTINGS</h2>
          </div>
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <Volume2 className="w-4 h-4" />
              <span>Audio Mixing</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Sound Effects Volume</span>
                <span className="font-mono">{Math.round(effectsVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={effectsVol}
                onChange={(e) => handleEffectsChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Ambient / Music Volume</span>
                <span className="font-mono">{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-sm font-semibold text-slate-300 block">Reset Profile Data</span>
              <span className="text-xs text-slate-500">Permanently clears credits, upgrades, and catalog.</span>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-sm flex items-center space-x-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
