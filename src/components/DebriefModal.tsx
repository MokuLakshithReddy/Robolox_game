/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, ArrowRight, Coins } from 'lucide-react';
import { InventoryItem } from '../types';
import { ITEM_DEFINITIONS } from '../services/gameStore';
import { soundService } from '../services/soundService';

interface DebriefModalProps {
  success: boolean;
  haul: InventoryItem[];
  artifactsFound: string[];
  creditsEarned: number;
  onReturnToWorkshop: () => void;
}

export const DebriefModal: React.FC<DebriefModalProps> = ({
  success,
  haul,
  artifactsFound,
  creditsEarned,
  onReturnToWorkshop
}) => {
  React.useEffect(() => {
    if (success) {
      soundService.playSuccess();
    } else {
      soundService.playFail();
    }
  }, [success]);

  const totalValue = haul.reduce((acc, item) => {
    const def = ITEM_DEFINITIONS[item.itemId];
    return acc + (def ? def.baseValue * item.quantity : 0);
  }, 0) + creditsEarned;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
      <div className={`bg-slate-900 border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col ${
        success ? 'border-emerald-500/40 shadow-emerald-500/10' : 'border-red-500/40 shadow-red-500/10'
      }`}>
        {/* Header */}
        <div className={`px-8 py-6 border-b flex items-center space-x-4 ${
          success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {success ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest block opacity-80">
              {success ? 'Extraction Successful' : 'Extraction Failed • Lockdown Triggered'}
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              {success ? 'DISTRICT EVACUATION SECURED' : 'UNBANKED HAUL LOST'}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase">Total Credits Secured</span>
              <span className="text-3xl font-extrabold text-amber-400 font-mono mt-1 block">+{totalValue} CR</span>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
              <Coins className="w-8 h-8" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Secured Salvage Haul ({haul.length} Items)</h3>
            {haul.length === 0 ? (
              <p className="text-sm text-slate-500 italic bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                No items were secured during this expedition.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {haul.map((item, idx) => {
                  const def = ITEM_DEFINITIONS[item.itemId];
                  if (!def) return null;
                  return (
                    <div key={idx} className="flex justify-between items-center bg-slate-950/60 px-4 py-3 rounded-xl border border-slate-800 text-sm">
                      <span className="text-slate-200 font-medium">{def.name} x{item.quantity}</span>
                      <span className="font-mono text-amber-400">+{def.baseValue * item.quantity} CR</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {artifactsFound.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-300 text-sm">New Artifact Discovery Logged!</h4>
                <p className="text-xs text-slate-300">Added to permanent artifact catalog archives.</p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              soundService.playClick();
              onReturnToWorkshop();
            }}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition"
          >
            <span>RETURN TO WORKSHOP HUB</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
