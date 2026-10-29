/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Play, Settings, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { soundService } from '../services/soundService';

interface TitleScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
  onOpenCatalog: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOpenSettings, onOpenCatalog }) => {
  const [muted, setMuted] = React.useState(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundService.setVolumes(next ? 0 : 0.7, next ? 0 : 0.5);
    soundService.playClick();
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 text-slate-100 overflow-hidden flex flex-col items-center justify-between p-6 md:p-12 select-none font-sans">
      {/* Background industrial grid & atmospheric gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Top bar with audio toggle */}
      <div className="w-full max-w-6xl flex justify-between items-center z-10">
        <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs tracking-widest uppercase">
          <ShieldAlert className="w-4 h-4 animate-pulse text-amber-500" />
          <span>SECURITY PROTOCOL: LOCKDOWN ACTIVE</span>
        </div>
        <button
          onClick={toggleMute}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
          title={muted ? "Unmute Audio" : "Mute Audio"}
        >
          {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
        </button>
      </div>

      {/* Center Hero Lockup */}
      <div className="flex flex-col items-center text-center z-10 max-w-3xl my-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-6">
          <span>Salvage Extraction Simulator v1.0</span>
        </div>

        {/* SVG Title Lockup */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-4 drop-shadow-[0_10px_20px_rgba(245,158,11,0.2)]">
          LOOT SHIFT <span className="text-amber-500">:</span> LOCKDOWN
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
          The district seals in minutes. Scavenge abandoned industrial modules, recover anomalous artifacts, and decide whether to extract now or risk everything for one more discovery.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              soundService.playClick();
              onStart();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-lg tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-3 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            <span>ENTER WORKSHOP</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onOpenCatalog();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center space-x-2 transition"
          >
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Artifact Catalog</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onOpenSettings();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center space-x-2 transition"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Footer control hints */}
      <div className="w-full max-w-4xl flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-mono z-10 pt-6 border-t border-slate-900">
        <span>WASD · Move Explorer</span>
        <span>•</span>
        <span>F · Toggle Flashlight</span>
        <span>•</span>
        <span>E · Interact / Collect Loot</span>
        <span>•</span>
        <span>ESC · Pause / Settings</span>
      </div>
    </div>
  );
};
