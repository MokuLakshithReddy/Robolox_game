/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Lock, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../types';
import { ITEM_DEFINITIONS } from '../services/gameStore';
import { soundService } from '../services/soundService';

interface CatalogModalProps {
  profile: PlayerProfile;
  onClose: () => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({ profile, onClose }) => {
  const artifactIds = Object.values(ITEM_DEFINITIONS)
    .filter(item => item.isArtifact)
    .map(item => item.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-3 text-amber-400">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white tracking-wide">ARTIFACT DISCOVERY CATALOG</h2>
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
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {artifactIds.map(id => {
            const def = ITEM_DEFINITIONS[id];
            const unlocked = profile.collection.includes(id);

            return (
              <div
                key={id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition ${
                  unlocked
                    ? 'bg-slate-950/80 border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/30 border-slate-800/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-base ${unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                      {unlocked ? def.name : 'Unknown Anomaly'}
                    </h3>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                      unlocked ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {unlocked ? def.rarity : 'Locked'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {unlocked ? def.description : 'Successfully extract with this artifact during an expedition to log its archival properties and lore.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-500">Value: {def.baseValue} CR</span>
                  {unlocked ? (
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Archived</span>
                    </span>
                  ) : (
                    <span className="text-slate-600 flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Undiscovered</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
