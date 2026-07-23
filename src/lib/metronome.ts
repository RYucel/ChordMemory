/**
 * Akor Belleği - Low-Latency Web Audio API Metronome & Audio Tick Engine
 */

class MetronomeEngine {
  private audioContext: AudioContext | null = null;
  private isRunning: boolean = false;
  private bpm: number = 90;
  private currentBeat: number = 0;
  private beatsPerBar: number = 4;
  private timerId: number | null = null;
  private nextBeatTime: number = 0;
  private volume: number = 0.8;
  private soundType: 'click' | 'woodblock' | 'beep' = 'click';

  private onBeatCallback?: (beatNumber: number) => void;

  constructor() {
    // AudioContext created lazily on first user gesture
  }

  private initAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(30, Math.min(240, newBpm));
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setSoundType(type: 'click' | 'woodblock' | 'beep') {
    this.soundType = type;
  }

  public setBeatsPerBar(beats: number) {
    this.beatsPerBar = beats;
  }

  public setOnBeatCallback(cb?: (beatNumber: number) => void) {
    this.onBeatCallback = cb;
  }

  public playSingleClick(isAccent: boolean = false) {
    this.initAudioContext();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;

    if (this.soundType === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isAccent ? 1200 : 800, now);
      gain.gain.setValueAtTime(this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (this.soundType === 'woodblock') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isAccent ? 900 : 600, now);
      gain.gain.setValueAtTime(this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else {
      // Default Crisp Click
      osc.type = 'square';
      osc.frequency.setValueAtTime(isAccent ? 1600 : 1000, now);
      gain.gain.setValueAtTime(this.volume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  }

  public playCueSound(type: 'success' | 'failure' | 'reveal') {
    this.initAudioContext();
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(this.volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'failure') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(196, now + 0.1); // G3
      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'reveal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  private scheduler = () => {
    while (this.nextBeatTime < this.audioContext!.currentTime + 0.1) {
      const isAccent = this.currentBeat === 0;
      this.scheduleClick(this.nextBeatTime, isAccent);

      if (this.onBeatCallback) {
        const beatNum = this.currentBeat;
        setTimeout(() => {
          this.onBeatCallback?.(beatNum);
        }, (this.nextBeatTime - this.audioContext!.currentTime) * 1000);
      }

      const secondsPerBeat = 60.0 / this.bpm;
      this.nextBeatTime += secondsPerBeat;
      this.currentBeat = (this.currentBeat + 1) % this.beatsPerBar;
    }

    if (this.isRunning) {
      this.timerId = window.setTimeout(this.scheduler, 25);
    }
  };

  private scheduleClick(time: number, isAccent: boolean) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = this.soundType === 'beep' ? 'sine' : this.soundType === 'woodblock' ? 'triangle' : 'square';
    osc.frequency.setValueAtTime(isAccent ? 1400 : 900, time);

    gain.gain.setValueAtTime(this.volume * (isAccent ? 0.8 : 0.5), time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.start(time);
    osc.stop(time + 0.04);
  }

  public start() {
    this.initAudioContext();
    if (this.isRunning) return;

    this.isRunning = true;
    this.currentBeat = 0;
    this.nextBeatTime = this.audioContext!.currentTime + 0.05;
    this.scheduler();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const globalMetronome = new MetronomeEngine();
