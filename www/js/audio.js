// ═══════════════════════════════════════════════════════
//  STICK RUSH — AUDIO & VOICE CHEER SYSTEM
// ═══════════════════════════════════════════════════════

const VOICE_SCRIPTS = {
  round_winner: [
    name => `${name} wins the round! Unstoppable! What a performance!`,
    name => `YES! ${name} takes it! The crowd goes absolutely wild!`,
    name => `${name} is on FIRE! That's how you dominate Stick Rush!`,
  ],
  comeback: [
    name => `From behind to the front! ${name} pulls off an incredible comeback!`,
    name => `Nobody believed it, but ${name} did! What a comeback victory!`,
  ],
  perfect_score: [
    name => `PERFECT SCORE! ${name} answered every question correctly! A true scholar!`,
    name => `Genius level! ${name} nailed all the questions AND won the game! Legendary!`,
  ],
  tournament_champ: [
    name => `TOURNAMENT CHAMPION! ${name} defeats all opponents! Ghana's finest has spoken!`,
    name => `All hail ${name}! The Stick Rush Tournament Champion! Absolutely unbeatable!`,
  ],
  consolation: [
    name => `Great effort, ${name}! Every legend started somewhere. Train harder and come back stronger!`,
  ],
  streak: [
    name => `${name} is on a winning streak! Can anyone stop this champion?`,
    name => `Three in a row for ${name}! This player is absolutely DOMINANT!`,
  ],
  qa_correct: [
    () => `Correct answer! Bonus points awarded! Knowledge is power!`,
    () => `That's right! You're not just fast — you're SMART!`,
  ],
  qa_wrong: [
    () => `Ooh! Wrong answer. Study hard and come back smarter!`,
    () => `Not quite! Keep learning — the next round is your chance!`,
  ],
  round_start: [
    n => `Round ${n} begins! Players take your positions!`,
    n => `Get ready! Round ${n} is about to start!`,
  ],
  countdown: [
    () => `Three... Two... One... GO!`,
  ],
};

class AudioManager {
  constructor() {
    this.synth   = window.speechSynthesis || null;
    this.enabled = true;
    this.voices  = [];
    this.preferredVoice = null;
    this.sfxCtx  = null;

    if (this.synth) {
      this.synth.onvoiceschanged = () => { this.loadVoices(); };
      this.loadVoices();
    }
    this._initSFX();
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Default priority: well-known smooth voices first
    const auto =
      this.voices.find(v => v.name === 'Google UK English Female') ||
      this.voices.find(v => v.name === 'Google US English Female') ||
      this.voices.find(v => v.name === 'Samantha') ||
      this.voices.find(v => v.name === 'Karen') ||
      this.voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
      this.voices.find(v => v.lang === 'en-GB') ||
      this.voices.find(v => v.lang === 'en-US') ||
      this.voices.find(v => v.lang.startsWith('en')) ||
      this.voices[0] || null;
    this.preferredVoice = auto;
    // Override with user-saved preference
    try {
      const saved = localStorage.getItem('stickrush_voice');
      if (saved) {
        const found = this.voices.find(v => v.name === saved);
        if (found) this.preferredVoice = found;
      }
    } catch(e) {}
  }

  setVoice(name) {
    const found = this.voices.find(v => v.name === name);
    if (found) {
      this.preferredVoice = found;
      try { localStorage.setItem('stickrush_voice', name); } catch(e) {}
    }
  }

  speak(text, rate = 0.9, pitch = 1.0) {
    if (!this.synth || !this.enabled || !text) return;
    this.synth.cancel();
    // Brief delay after cancel prevents Android speech stutter
    setTimeout(() => {
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate   = rate;
      utt.pitch  = pitch;
      utt.volume = 1;
      if (this.preferredVoice) utt.voice = this.preferredVoice;
      this.synth.speak(utt);
    }, 60);
  }

  cheer(type, name = '', extra = '') {
    if (!this.enabled) return;
    const scripts = VOICE_SCRIPTS[type];
    if (!scripts || scripts.length === 0) return;
    const script = scripts[Math.floor(Math.random() * scripts.length)];
    const text = typeof script === 'function' ? script(name || extra) : script;
    this.speak(text, 0.92, 1.0);
  }

  _initSFX() {
    try {
      this.sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { this.sfxCtx = null; }
  }

  _playTone(freq, duration, type = 'sine', vol = 0.3) {
    if (!this.sfxCtx) return;
    try {
      const osc  = this.sfxCtx.createOscillator();
      const gain = this.sfxCtx.createGain();
      osc.connect(gain);
      gain.connect(this.sfxCtx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.sfxCtx.currentTime);
      gain.gain.setValueAtTime(vol, this.sfxCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.sfxCtx.currentTime + duration);
      osc.start();
      osc.stop(this.sfxCtx.currentTime + duration);
    } catch(e) {}
  }

  playJump()    { this._playTone(400, 0.15, 'square', 0.2); }
  playLand()    { this._playTone(200, 0.1, 'sine', 0.15); }
  playCollect() {
    this._playTone(600, 0.08, 'sine', 0.3);
    setTimeout(() => this._playTone(800, 0.08, 'sine', 0.3), 80);
    setTimeout(() => this._playTone(1000, 0.12, 'sine', 0.3), 160);
  }
  playHit() {
    this._playTone(150, 0.2, 'sawtooth', 0.3);
  }
  playWin() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => this._playTone(f, 0.2, 'sine', 0.35), i * 120));
  }
  playLose() {
    const notes = [400, 350, 300, 250];
    notes.forEach((f, i) => setTimeout(() => this._playTone(f, 0.2, 'sine', 0.25), i * 100));
  }
  playCorrect() {
    this._playTone(880, 0.1, 'sine', 0.3);
    setTimeout(() => this._playTone(1100, 0.15, 'sine', 0.3), 100);
  }
  playWrong() {
    this._playTone(200, 0.3, 'sawtooth', 0.2);
  }
  playClick() {
    this._playTone(700, 0.05, 'square', 0.15);
  }
  playCountdown() {
    this._playTone(440, 0.15, 'sine', 0.4);
  }
  playCountdownGo() {
    this._playTone(880, 0.3, 'sine', 0.5);
    setTimeout(() => this._playTone(1100, 0.3, 'sine', 0.5), 150);
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.synth) this.synth.cancel();
    return this.enabled;
  }
}

const Audio = new AudioManager();
