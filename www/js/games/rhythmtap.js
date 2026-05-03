// RhythmTap — Tap to the beat!
// Part of Stick Rush mobile party game suite.

class RhythmTap {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.playerName    = playerName;
    this.playerCostume = playerCostume;
    this.onComplete    = onComplete;

    this.W = canvas.width;
    this.H = canvas.height;

    this.GAME_DURATION  = 20;
    this.TOTAL_BEATS    = 16;
    this.BEAT_INTERVAL  = (this.GAME_DURATION * 60) / this.TOTAL_BEATS; // frames between beats (~75f at 60fps)
    this.TRACK_Y        = Math.round(this.H * 0.52);
    this.TARGET_X       = Math.round(this.W * 0.22);
    this.TARGET_R       = 28;
    this.BEAT_R         = 22;
    this.BEAT_SPEED     = (this.W * 0.72) / this.BEAT_INTERVAL; // px/frame to cross from spawn to target

    this.PERFECT_WINDOW = this.TARGET_R * 0.6;  // pixels from target center
    this.GOOD_WINDOW    = this.TARGET_R * 1.35;

    this.score      = 0;
    this.combo      = 0;
    this.frameCount = 0;
    this.startTime  = null;
    this.timeLeft   = this.GAME_DURATION;
    this.finished   = false;

    this.beats          = [];       // active beat markers
    this.beatSpawnTimer = 0;
    this.beatsSpawned   = 0;
    this.beatsJudged    = 0;

    this.popups    = [];    // { text, color, x, y, alpha, vy }
    this.particles = [];

    this.danceFrame  = 0;
    this.danceTimer  = 0;
    this.jumpActive  = false;
    this.jumpTimer   = 0;

    this.targetPulse = 0;

    this.BEAT_COLORS = ['#F1C40F','#E74C3C','#3498DB','#2ECC71','#9B59B6','#E67E22'];

    this._raf       = null;
    this._boundTap  = this._onTap.bind(this);
    this._boundLoop = this._loop.bind(this);
  }

  start() {
    this.startTime = performance.now();
    this.canvas.addEventListener('touchstart', this._boundTap, { passive: false });
    this.canvas.addEventListener('mousedown',  this._boundTap);
    this._raf = requestAnimationFrame(this._boundLoop);
  }

  _loop(ts) {
    if (this.finished) return;
    const elapsed = (ts - this.startTime) / 1000;
    this.timeLeft  = Math.max(0, this.GAME_DURATION - elapsed);
    this.frameCount++;

    // Spawn beats
    this.beatSpawnTimer++;
    if (this.beatSpawnTimer >= this.BEAT_INTERVAL && this.beatsSpawned < this.TOTAL_BEATS) {
      this.beatSpawnTimer = 0;
      const color = this.BEAT_COLORS[this.beatsSpawned % this.BEAT_COLORS.length];
      this.beats.push({
        x: this.W + this.BEAT_R,
        y: this.TRACK_Y,
        r: this.BEAT_R,
        color,
        id: this.beatsSpawned,
        hit: false,
        missed: false,
        scale: 1,
      });
      this.beatsSpawned++;
    }

    // Move beats left
    this.beats.forEach(b => {
      b.x -= this.BEAT_SPEED;
      if (b.scale < 1) b.scale += 0.05;
    });

    // Auto-miss beats that passed the target
    this.beats.forEach(b => {
      if (!b.hit && !b.missed && b.x < this.TARGET_X - this.GOOD_WINDOW * 1.5) {
        b.missed = true;
        this.combo = 0;
        this.beatsJudged++;
        this._spawnPopup('MISS', '#E74C3C', this.TARGET_X, this.TRACK_Y - 40);
        if (typeof Audio !== 'undefined') Audio.playWrong();
      }
    });

    // Remove off-screen beats
    this.beats = this.beats.filter(b => b.x > -60);

    // Particles
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.alpha -= 0.045; p.r *= 0.95;
    });
    this.particles = this.particles.filter(p => p.alpha > 0);

    // Popups
    this.popups.forEach(p => { p.alpha -= 0.03; p.y += p.vy; });
    this.popups = this.popups.filter(p => p.alpha > 0);

    // Target pulse
    this.targetPulse = (this.targetPulse + 0.08) % (Math.PI * 2);

    // Dance animation
    this.danceTimer++;
    if (this.danceTimer > (this.jumpActive ? 4 : 8)) {
      this.danceTimer = 0;
      this.danceFrame++;
    }
    if (this.jumpActive) {
      this.jumpTimer++;
      if (this.jumpTimer > 20) { this.jumpActive = false; this.jumpTimer = 0; }
    }

    this._draw();

    if (this.timeLeft <= 0 || (this.beatsJudged >= this.TOTAL_BEATS && this.beats.length === 0)) {
      this._finish();
      return;
    }
    this._raf = requestAnimationFrame(this._boundLoop);
  }

  _spawnPopup(text, color, x, y) {
    this.popups.push({ text, color, x, y, alpha: 1.6, vy: -1.5 });
  }

  _burst(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const speed = 2.5 + Math.random() * 3;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        r: 3 + Math.random() * 4,
        color,
        alpha: 1.2,
      });
    }
  }

  _draw() {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0B0F14';
    ctx.fillRect(0, 0, W, H);

    // Ambient glow around target
    const grad = ctx.createRadialGradient(this.TARGET_X, this.TRACK_Y, 0, this.TARGET_X, this.TRACK_Y, 120);
    grad.addColorStop(0, 'rgba(52,152,219,0.14)');
    grad.addColorStop(1, 'rgba(52,152,219,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, this.TRACK_Y - 120, W, 240);

    // Timer bar
    const barW = (this.timeLeft / this.GAME_DURATION) * (W - 24);
    ctx.fillStyle = '#1a1f2a';
    ctx.fillRect(12, 14, W - 24, 14);
    const barColor = this.timeLeft > 10 ? '#2ECC71' : this.timeLeft > 5 ? '#F1C40F' : '#E74C3C';
    ctx.fillStyle = barColor;
    ctx.fillRect(12, 14, barW, 14);
    ctx.strokeStyle = '#F1C40F';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 14, W - 24, 14);

    // HUD
    ctx.fillStyle = '#F1C40F';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.score}`, 16, 52);
    if (this.combo >= 2) {
      ctx.fillStyle = '#E74C3C';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`x${this.combo} COMBO`, 16, 72);
    }
    ctx.fillStyle = '#aaa';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(this.timeLeft)}s`, W - 16, 52);
    ctx.fillText(`${this.beatsJudged}/${this.TOTAL_BEATS}`, W - 16, 70);

    // Instruction banner
    if (this.frameCount < 80) {
      const alpha = Math.min(1, (80 - this.frameCount) / 30);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0,0,0,0.78)';
      ctx.fillRect(0, H * 0.3 - 44, W, 88);
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Tap to the beat!', W / 2, H * 0.3 - 4);
      ctx.fillStyle = '#aaa';
      ctx.font = '14px sans-serif';
      ctx.fillText('Tap when beat hits the ring', W / 2, H * 0.3 + 24);
      ctx.restore();
    }

    // Track rail
    const railY = this.TRACK_Y;
    ctx.strokeStyle = '#1e2d40';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, railY);
    ctx.lineTo(W, railY);
    ctx.stroke();

    // Tick marks along rail
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, railY - 6);
      ctx.lineTo(i, railY + 6);
      ctx.stroke();
    }

    // Target zone
    const pulse = 1 + Math.sin(this.targetPulse) * 0.08;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.TARGET_X, railY, this.TARGET_R * pulse + 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(52,152,219,0.08)';
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(this.TARGET_X, railY, this.TARGET_R, 0, Math.PI * 2);
    ctx.strokeStyle = '#3498DB';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(52,152,219,0.18)';
    ctx.fill();

    // Inner cross-hair
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(this.TARGET_X - this.TARGET_R, railY);
    ctx.lineTo(this.TARGET_X + this.TARGET_R, railY);
    ctx.moveTo(this.TARGET_X, railY - this.TARGET_R);
    ctx.lineTo(this.TARGET_X, railY + this.TARGET_R);
    ctx.stroke();
    ctx.setLineDash([]);

    // Beat markers
    this.beats.forEach(b => {
      if (b.hit) return;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.scale, b.scale);

      // Glow
      ctx.beginPath();
      ctx.arc(0, 0, b.r + 6, 0, Math.PI * 2);
      ctx.fillStyle = b.color + '44';
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Shine
      ctx.beginPath();
      ctx.arc(-b.r * 0.25, -b.r * 0.25, b.r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.38)';
      ctx.fill();

      // Miss X
      if (b.missed) {
        ctx.fillStyle = 'rgba(231,76,60,0.8)';
        ctx.font = `bold ${b.r}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('X', 0, 0);
        ctx.textBaseline = 'alphabetic';
      }

      ctx.restore();
    });

    // Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Popups
    this.popups.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    });

    // Ground
    const groundY = H - 82;
    ctx.strokeStyle = '#2ECC71';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Stickman dancer
    if (typeof drawStickman === 'function') {
      drawStickman(ctx, this.TARGET_X, groundY, this.playerCostume, {
        scale: 1.0,
        running: false,
        jumping: this.jumpActive,
        frame: this.danceFrame,
      });
    }

    // "TAP!" prompt
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAP!', this.TARGET_X, railY + this.TARGET_R + 20);
  }

  _onTap(e) {
    e.preventDefault();
    if (this.finished) return;

    // Find the closest beat to the target zone
    let best = null;
    let bestDist = Infinity;
    for (const b of this.beats) {
      if (b.hit || b.missed) continue;
      const dist = Math.abs(b.x - this.TARGET_X);
      if (dist < bestDist) { bestDist = dist; best = b; }
    }

    if (best && bestDist <= this.GOOD_WINDOW * 1.8) {
      best.hit = true;
      this.beatsJudged++;
      this._burst(best.x, this.TRACK_Y, best.color);
      this.jumpActive  = true;
      this.jumpTimer   = 0;

      if (bestDist <= this.PERFECT_WINDOW) {
        this.combo++;
        const pts = 100 * Math.max(1, Math.floor(this.combo / 3) + 1);
        this.score += pts;
        this._spawnPopup('PERFECT!', '#F1C40F', this.TARGET_X, this.TRACK_Y - 50);
        if (typeof Audio !== 'undefined') Audio.playCollect();
      } else if (bestDist <= this.GOOD_WINDOW) {
        this.combo++;
        const pts = 50;
        this.score += pts;
        this._spawnPopup('GOOD', '#2ECC71', this.TARGET_X, this.TRACK_Y - 50);
        if (typeof Audio !== 'undefined') Audio.playClick();
      } else {
        this.combo = 0;
        this._spawnPopup('EARLY', '#9B59B6', this.TARGET_X, this.TRACK_Y - 50);
        if (typeof Audio !== 'undefined') Audio.playWrong();
      }
    } else {
      // Tap with nothing near = miss penalty
      this.combo = 0;
      this._spawnPopup('MISS', '#E74C3C', this.TARGET_X, this.TRACK_Y - 50);
      if (typeof Audio !== 'undefined') Audio.playWrong();
    }
  }

  _finish() {
    if (this.finished) return;
    this.finished = true;
    cancelAnimationFrame(this._raf);
    this._cleanup();

    const winner = this.score >= 600 ? 'player' : 'cpu';
    if (typeof Audio !== 'undefined') {
      winner === 'player' ? Audio.playWin() : Audio.playLose();
    }
    this._drawResult(winner);
    setTimeout(() => {
      this.onComplete({ winner, score: this.score, playerName: this.playerName, gameName: 'RhythmTap' });
    }, 2800);
  }

  _drawResult(winner) {
    const { ctx, W, H } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(11,15,20,0.9)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = winner === 'player' ? '#F1C40F' : '#E74C3C';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(winner === 'player' ? 'YOU WIN!' : 'CPU WINS', W / 2, H / 2 - 34);
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.fillText(`Score: ${this.score}`, W / 2, H / 2 + 14);
    ctx.fillStyle = '#aaa';
    ctx.font = '15px sans-serif';
    ctx.fillText(`${this.beatsJudged}/${this.TOTAL_BEATS} beats`, W / 2, H / 2 + 46);
    ctx.restore();
  }

  _cleanup() {
    this.canvas.removeEventListener('touchstart', this._boundTap);
    this.canvas.removeEventListener('mousedown',  this._boundTap);
  }
}
