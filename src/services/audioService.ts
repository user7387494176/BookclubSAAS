// Audio Service for button sounds and user preferences
export interface AudioSettings {
  soundEnabled: boolean;
  volume: number;
}

export class AudioService {
  private static settings: AudioSettings = {
    soundEnabled: true,
    volume: 0.5
  };

  static {
    // Load settings from localStorage
    this.loadSettings();
  }

  private static loadSettings(): void {
    try {
      const saved = localStorage.getItem('focusreads-audio-settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading audio settings:', error);
    }
  }

  private static saveSettings(): void {
    try {
      localStorage.setItem('focusreads-audio-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving audio settings:', error);
    }
  }

  static getSettings(): AudioSettings {
    return { ...this.settings };
  }

  static setSoundEnabled(enabled: boolean): void {
    this.settings.soundEnabled = enabled;
    this.saveSettings();
  }

  static setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  static playSound(type: 'cashRegister' | 'success' | 'click' | 'notification'): void {
    if (!this.settings.soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(this.settings.volume * 0.3, audioContext.currentTime);
      
      switch (type) {
        case 'cashRegister':
          // Cash register "cha-ching" sound
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.3);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
          
        case 'success':
          // Success chime
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
          
        case 'click':
          // Simple click sound
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
          
        case 'notification':
          // Notification sound
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
      }
    } catch (error) {
      console.log('Audio context not available');
    }
  }
}