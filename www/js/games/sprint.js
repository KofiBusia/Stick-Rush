// ═══════════════════════════════════════════════════════
//  STICK RUSH — MINI GAME 1: SPRINT DASH
//  Tap/click as fast as possible to outrun the CPU!
// ═══════════════════════════════════════════════════════

class SprintDash {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas      = canvas;
    this.ctx         = canvas.getContext('2d');
    this.playerName  = playerName;
    this.costume     = playerCostume || 'default';
    this.onComplete  = onComplete;
    this.W           = canvas.width;
    this.H           = canvas.height;

    this.TRACK_LEN   = 100;       // 100m
    this.CPU_SPEED   = 0.22;      // CPU auto-advance per frame
    this.TAP_ADVANCE = 1.8;       // player advance per tap

    this.playerPos   = 0;
    this.cpuPos      = 0;
    this.frame       = 0;
    this.gameOver    = false;
    this.winner      = null;
    this.score       = 0;
    this.tapCount    = 0;
    this.lastTapTime = 0;
    this.timeLeft    = 15000;
    this.startTime   = null;
    this.raf         = null;
    this.instructed  = true;
    this.instructTimer = 0;

    this._bind();
  }

  _bind() {
    this._onTap = () => { if (!this.gameOver) this._tap(); };
    this.canvas.addEventListener('click',      this._onTap);
    this.canvas.addEventListener('touchstart', this._onTap, { passive: true });
    document.addEventListener('keydown',       this._onKey = (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowRight') && !this.gameOver) this._tap();
    });
  }

  _tap() {
    const now = Date.now();
    if (now - this.lastTapTime < 40) return; // debounce
    this.lastTapTime = now;
    this.playerPos = Math.min(this.TRACK_LEN, this.playerPos + this.TAP_ADVANCE);
    this.tapCount++;
    Audio.playClick();
    if (this.playerPos >= this.TRACK_LEN) this._finish('player');
  }

  start() {
    this.startTime = Date.now();
    this._loop();
  }

  _loop() {
    if (this.gameOver) return;
    const now     = Date.now();
    const elapsed = now - this.startTime;
    this.timeLeft = Math.max(0, 15000 - elapsed);

    // CPU advances
    this.cpuPos = Math.min(this.TRACK_LEN, this.cpuPos + this.CPU_SPEED);
    if (this.cpuPos >= this.TRACK_LEN) { this._finish('cpu'); return; }
    if (this.timeLeft <= 0)            { this._finish(this.playerPos > this.cpuPos ? 'player' : 'cpu'); return; }

    this.frame++;
    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }

  _draw() {
    const ctx = this.ctx;
    const W   = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0B3D91');
    sky.addColorStop(1, '#1A6DCC');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Crowd dots in background
    for (let i = 0; i < 30; i++) {
      const cx = (i * 37 + this.frame * 0.3) % W;
      ctx.beginPath();
      ctx.arc(cx, 30 + (i % 5) * 12, 5, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${i * 25},70%,70%)`;
      ctx.fill();
    }

    // Ground / Track
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, H - 80, W, 80);
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(0, H - 80, W, 8);
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(0, H - 8, W, 8);

    // Lane lines
    ctx.setLineDash([30, 20]);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, H - 45); ctx.lineTo(W, H - 45); ctx.stroke();
    ctx.setLineDash([]);

    // Finish line
    const finishX = W - 60;
    ctx.fillStyle = '#F1C40F';
    ctx.fillRect(finishX, H - 80, 6, 80);
    // Checkered
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 2; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillStyle = '#000';
          ctx.fillRect(finishX + col * 8, H - 80 + row * 16, 8, 16);
        }
      }
    }
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', finishX + 3, H - 83);

    // Distance markers
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    for (let m = 25; m < 100; m += 25) {
      const mx = 60 + ((W - 120) * m / 100);
      ctx.fillText(`${m}m`, mx, H - 82);
    }

    const trackW = W - 120;
    const trackStart = 60;

    // CPU stickman
    const cpuX = trackStart + (trackW * this.cpuPos / this.TRACK_LEN);
    const cpuY = H - 80;
    drawStickman(ctx, cpuX, cpuY, 'redathlete', { scale: 0.9, running: true, frame: this.frame });
    ctx.fillStyle = '#E74C3C';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('CPU', cpuX, cpuY - 62);

    // Player stickman
    const plrX = trackStart + (trackW * this.playerPos / this.TRACK_LEN);
    const plrY = H - 80;
    drawStickman(ctx, plrX, plrY, this.costume, { scale: 1.0, running: this.tapCount > 0, frame: this.frame });
    ctx.fillStyle = '#F1C40F';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(this.playerName, plrX, plrY - 67);

    // Progress bars at top
    this._drawProgressBar(ctx, 40, 12, W - 80, 16, this.playerPos / this.TRACK_LEN, '#F1C40F', this.playerName);
    this._drawProgressBar(ctx, 40, 34, W - 80, 16, this.cpuPos / this.TRACK_LEN,    '#E74C3C', 'CPU');

    // Timer
    const sec = (this.timeLeft / 1000).toFixed(1);
    ctx.fillStyle = this.timeLeft < 3000 ? '#E74C3C' : '#fff';
    ctx.font = `bold ${this.timeLeft < 3000 ? 22 : 16}px Inter`;
    ctx.textAlign = 'right';
    ctx.fillText(`⏱ ${sec}s`, W - 10, 18);

    // Instruction
    if (this.frame < 90) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(W/2 - 150, H/2 - 30, 300, 60);
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 18px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('👆 TAP / CLICK / SPACE', W/2, H/2 + 8);
      ctx.fillStyle = '#fff';
      ctx.font = '13px Inter';
      ctx.fillText('Tap as fast as you can!', W/2, H/2 + 28);
    }

    // Tap counter
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '13px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`Taps: ${this.tapCount}`, 10, H - 10);
  }

  _drawProgressBar(ctx, x, y, w, h, pct, color, label) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w * pct, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(label, x - 35, y + 11);
  }

  _finish(who) {
    if (this.gameOver) return;
    this.gameOver = true;
    cancelAnimationFrame(this.raf);
    this.winner = who;

    const playerWon = who === 'player';
    this.score = playerWon
      ? 200 + Math.round(this.tapCount * 1.5)
      : 50 + Math.round(this.tapCount * 0.5);

    if (playerWon) { Audio.playWin(); Audio.cheer('round_winner', this.playerName); }
    else           { Audio.playLose(); }

    this._drawResult(playerWon);

    setTimeout(() => {
      this._cleanup();
      this.onComplete({ winner: who, score: this.score, playerName: this.playerName, gameName: 'Sprint Dash' });
    }, 2800);
  }

  _drawResult(playerWon) {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    ctx.fillStyle = playerWon ? 'rgba(39,174,96,0.88)' : 'rgba(231,76,60,0.88)';
    ctx.fillRect(0, H/2 - 70, W, 140);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(playerWon ? '🏆 YOU WIN!' : '❌ CPU WINS!', W/2, H/2 - 15);
    ctx.font = 'bold 20px Inter';
    ctx.fillText(`Score: +${this.score} pts`, W/2, H/2 + 22);
    ctx.font = '14px Inter';
    ctx.fillText(`Taps: ${this.tapCount}`, W/2, H/2 + 48);
  }

  _cleanup() {
    this.canvas.removeEventListener('click', this._onTap);
    this.canvas.removeEventListener('touchstart', this._onTap);
    document.removeEventListener('keydown', this._onKey);
  }
}
