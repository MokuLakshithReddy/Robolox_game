/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.effectsGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        
        this.effectsGain.connect(this.ctx.destination);
        this.musicGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(effectsVol: number, musicVol: number) {
    this.initCtx();
    if (this.effectsGain) this.effectsGain.gain.value = this.isMuted ? 0 : effectsVol;
    if (this.musicGain) this.musicGain.gain.value = this.isMuted ? 0 : musicVol;
  }

  public playClick() {
    this.initCtx();
    if (!this.ctx || !this.effectsGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.effectsGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playPickup(isArtifact: boolean = false) {
    this.initCtx();
    if (!this.ctx || !this.effectsGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isArtifact ? 'triangle' : 'sine';
    
    const freq = isArtifact ? 523.25 : 440; // C5 vs A4
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.effectsGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public playAlarm() {
    this.initCtx();
    if (!this.ctx || !this.effectsGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.effectsGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  public startSiren() {
    this.initCtx();
    if (!this.ctx || !this.effectsGain || this.sirenOsc || this.isMuted) return;

    try {
      this.sirenOsc = this.ctx.createOscillator();
      this.sirenGain = this.ctx.createGain();
      this.sirenOsc.type = 'sine';
      this.sirenOsc.frequency.setValueAtTime(350, this.ctx.currentTime);
      
      this.sirenGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      // LFO for siren pitch wobble
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.25; // 4s cycle
      lfoGain.gain.value = 150;
      lfo.connect(lfoGain);
      lfoGain.connect(this.sirenOsc.frequency);
      lfo.start();

      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(this.effectsGain);
      this.sirenOsc.start();
    } catch {
      // Audio context policy fallback
    }
  }

  public stopSiren() {
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch {
        // ignore
      }
      this.sirenOsc = null;
      this.sirenGain = null;
    }
  }

  public playSuccess() {
    this.initCtx();
    if (!this.ctx || !this.effectsGain || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = this.ctx!.currentTime + idx * 0.1;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.linearRampToValueAtTime(0.01, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.effectsGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  public playFail() {
    this.initCtx();
    if (!this.ctx || !this.effectsGain || this.isMuted) return;

    const notes = [300, 260, 220];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;

      const startTime = this.ctx!.currentTime + idx * 0.15;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.linearRampToValueAtTime(0.01, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.effectsGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }
}

export const soundService = new SoundService();
