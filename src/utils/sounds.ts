// Sound effects for the casino
export class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled = true;

  private constructor() {
    this.initializeSounds();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeSounds() {
    // Create audio contexts for different sounds
    this.sounds = {
      spin: this.createBeep(440, 0.1),
      win: this.createBeep(880, 0.3),
      lose: this.createBeep(220, 0.2),
      click: this.createBeep(600, 0.05),
      jackpot: this.createBeep(1000, 0.5),
      card: this.createBeep(300, 0.1),
      roulette: this.createBeep(500, 0.2),
      coin: this.createBeep(800, 0.15)
    };
  }

  private createBeep(frequency: number, duration: number): HTMLAudioElement {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    const audio = new Audio();
    // Create a simple beep sound using data URL
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`;
    return audio;
  }

  play(soundName: string) {
    if (!this.enabled) return;
    
    try {
      const sound = this.sounds[soundName];
      if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.3;
        sound.play().catch(() => {}); // Ignore autoplay restrictions
      }
    } catch (error) {
      // Ignore sound errors
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}