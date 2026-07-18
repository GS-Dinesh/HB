class AudioEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playToggle(isChecked: boolean) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      if (isChecked) {
        // Double blip up
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else {
        // Blip down
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.10);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
        osc.start(now);
        osc.stop(now + 0.10);
      }
    } catch (e) {
      console.warn("Audio Context failed to play sound", e);
    }
  }

  playLevelUp() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major scale arpeggio
      
      freqs.forEach((freq, index) => {
        const time = now + index * 0.07;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.05, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
        
        osc.start(time);
        osc.stop(time + 0.22);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  playAchievement() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.03, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      playNote(392.00, now, 0.12);      // G4
      playNote(523.25, now + 0.12, 0.12); // C5
      playNote(659.25, now + 0.24, 0.12); // E5
      playNote(783.99, now + 0.36, 0.45); // G5
      playNote(1046.50, now + 0.36, 0.45); // C6 (chord)
    } catch (e) {
      console.warn(e);
    }
  }
}

export const audio = new AudioEngine();
