/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Wrench, BookOpen, Scroll, Play, ArrowUpCircle, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { PlayerProfile, Contract } from '../types';
import { gameStore, ITEM_DEFINITIONS, INITIAL_CONTRACTS } from '../services/gameStore';
import { soundService } from '../services/soundService';

interface WorkshopHubProps {
  profile: PlayerProfile;
  onLaunchExpedition: () => void;
  onOpenSettings: () => void;
  onOpenCatalog: () => void;
  onProfileUpdate: () => void;
}

export const WorkshopHub: React.FC<WorkshopHubProps> = ({
  profile,
  onLaunchExpedition,
  onOpenSettings,
  onOpenCatalog,
  onProfileUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'upgrades' | 'contracts'>('hub');
  const [contracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [notice, setNotice] = useState<string | null>(null);

  const satchelSlots = gameStore.getSatchelCapacity();
  const satchelCost = (profile.upgrades.satchel + 1) * 300;
  const scannerCost = (profile.upgrades.scanner + 1) * 400;
  const flashlightCost = (profile.upgrades.flashlight + 1) * 250;

  const handleBuyUpgrade = (key: keyof PlayerProfile['upgrades'], cost: number) => {
    soundService.playClick();
    const success = gameStore.purchaseUpgrade(key, cost);
    if (success) {
      soundService.playSuccess();
      setNotice(`Successfully upgraded ${key}!`);
      onProfileUpdate();
    } else {
      soundService.playFail();
      setNotice(`Insufficient credits or max level reached for ${key}.`);
    }
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header Navigation */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex justify-between items-center z-20">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white">SALVAGE WORKSHOP HUB</h1>
            <p className="text-xs text-slate-400 font-mono">Sector 7 Perimeter • Secure Connection</p>
          </div>
        </div>

        {/* Currency & Quick Hub status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase">Credits:</span>
            <span className="text-amber-400 font-mono font-bold text-lg">{profile.credits} CR</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase">Satchel:</span>
            <span className="text-slate-200 font-mono font-bold text-sm">{satchelSlots} Slots</span>
          </div>

          <button
            onClick={() => {
              soundService.playClick();
              onOpenSettings();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition"
          >
            Settings
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-slate-900/50 border-b border-slate-800/80 px-6 flex space-x-2 z-10">
        <button
          onClick={() => { soundService.playClick(); setActiveTab('hub'); }}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'hub' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Overview & Launch</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveTab('upgrades'); }}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'upgrades' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Workshop Upgrades</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveTab('contracts'); }}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'contracts' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scroll className="w-4 h-4" />
          <span>Active Contracts</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); onOpenCatalog(); }}
          className="px-6 py-3 font-semibold text-sm border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition flex items-center space-x-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Artifact Catalog ({profile.collection.length})</span>
        </button>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2 text-amber-300 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl mx-auto w-full">
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Launch Expedition Card */}
            <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Active Target District</span>
                <h2 className="text-3xl font-extrabold text-white mt-1 mb-3">The Old Market District</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Industrial sector with abandoned markets, auxiliary power substations, and transit tunnels. The Warden patrol route is active. Recommended for solo or cooperative extraction.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 font-mono block">Estimated Time</span>
                    <span className="text-white font-bold font-mono">6 - 8 Mins</span>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 font-mono block">Threat Level</span>
                    <span className="text-amber-400 font-bold font-mono">Moderate</span>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 font-mono block">Carry Capacity</span>
                    <span className="text-white font-bold font-mono">{satchelSlots} Slots</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundService.playClick();
                  onLaunchExpedition();
                }}
                className="w-full py-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-lg tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-3 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-6 h-6 fill-slate-950" />
                <span>START EXPEDITION</span>
              </button>
            </div>

            {/* Statistics & Profile Summary */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-amber-400 mb-4">
                  <Award className="w-5 h-5" />
                  <h3 className="font-bold text-white text-base">Operative Record</h3>
                </div>

                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Runs Started</span>
                    <span className="text-white font-bold">{profile.statistics.runsStarted}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Successful Extractions</span>
                    <span className="text-emerald-400 font-bold">{profile.statistics.runsExtracted}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Failed / Lost Hauls</span>
                    <span className="text-red-400 font-bold">{profile.statistics.runsFailed}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Artifacts Recovered</span>
                    <span className="text-amber-400 font-bold">{profile.statistics.artifactsExtracted}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Total Credits</span>
                    <span className="text-amber-400 font-bold">{profile.statistics.totalCreditsEarned} CR</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono text-center">
                Profile saved securely in local storage.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upgrades' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Satchel Upgrade */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">Reinforced Satchel</h3>
                  <span className="font-mono text-xs px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Level {profile.upgrades.satchel} / 3
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Increases active inventory carry capacity from 8 slots up to 14 slots for valuable salvage and artifacts.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 font-mono block">Upgrade Cost</span>
                  <span className="text-amber-400 font-mono font-bold text-lg">{profile.upgrades.satchel >= 3 ? 'MAXED' : `${satchelCost} CR`}</span>
                </div>
                <button
                  disabled={profile.upgrades.satchel >= 3}
                  onClick={() => handleBuyUpgrade('satchel', satchelCost)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 transition ${
                    profile.upgrades.satchel >= 3
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Upgrade Satchel</span>
                </button>
              </div>
            </div>

            {/* Scanner Upgrade */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">Signal Scanner</h3>
                  <span className="font-mono text-xs px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Level {profile.upgrades.scanner} / 2
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Improves short-range radar detection for uncollected loot crates and hidden artifact frequencies in the district.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 font-mono block">Upgrade Cost</span>
                  <span className="text-amber-400 font-mono font-bold text-lg">{profile.upgrades.scanner >= 2 ? 'MAXED' : `${scannerCost} CR`}</span>
                </div>
                <button
                  disabled={profile.upgrades.scanner >= 2}
                  onClick={() => handleBuyUpgrade('scanner', scannerCost)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 transition ${
                    profile.upgrades.scanner >= 2
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Upgrade Scanner</span>
                </button>
              </div>
            </div>

            {/* Flashlight Upgrade */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">High-Output Flashlight</h3>
                  <span className="font-mono text-xs px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Level {profile.upgrades.flashlight} / 2
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Upgrades exploration beam range and luminous intensity during district blackouts.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 font-mono block">Upgrade Cost</span>
                  <span className="text-amber-400 font-mono font-bold text-lg">{profile.upgrades.flashlight >= 2 ? 'MAXED' : `${flashlightCost} CR`}</span>
                </div>
                <button
                  disabled={profile.upgrades.flashlight >= 2}
                  onClick={() => handleBuyUpgrade('flashlight', flashlightCost)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 transition ${
                    profile.upgrades.flashlight >= 2
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Upgrade Flashlight</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Active District Contracts</h3>
            {contracts.map(contract => (
              <div key={contract.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="font-bold text-white text-base">{contract.title}</h4>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Reward: {contract.rewardCredits} CR
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{contract.description}</p>
                </div>
                <div className="flex items-center space-x-2 text-slate-400 font-mono text-xs">
                  <CheckCircle2 className="w-5 h-5 text-slate-600" />
                  <span>Pending Extraction</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
