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

  }

  _bind() {
    this._onTap = (e) => { if (e && e.cancelable) e.preventDefault(); if (!this.gameOver) this._tap(); };
    this.canvas.addEventListener('click',      this._onTap);
    this.canvas.addEventListener('touchstart', this._onTap, { passive: false });
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
    this._bind();
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

// ═══════════════════════════════════════════════════════
//  SPRINT DASH — MULTIPLAYER (Stickman Party style)
//  All players race on the SAME track. Tap your zone!
// ═══════════════════════════════════════════════════════
class SprintDashMulti {
  constructor(canvas, players, onComplete) {
    this.canvas     = canvas;
    this.ctx        = canvas.getContext('2d');
    this.players    = players;
    this.n          = players.length;
    this.onComplete = onComplete;
    this.W          = canvas.width;
    this.H          = canvas.height;

    this.TAP_ADV    = 1.65;
    this.DEBOUNCE   = 38;
    this.TRACK_LEN  = 100;

    // Layout
    this.tapH   = Math.min(130, Math.floor(this.H * 0.30));
    this.raceH  = this.H - this.tapH;

    // Per-player state
    this.pos      = Array(this.n).fill(0);
    this.taps     = Array(this.n).fill(0);
    this.done     = Array(this.n).fill(false);
    this.lastTap  = Array(this.n).fill(0);
    this.ripples  = Array.from({ length: this.n }, () => []);

    this.frame     = 0;
    this.gameOver  = false;
    this.startTime = null;
    this.timeLeft  = 15000;
    this.raf       = null;
  }

  _tap(idx) {
    if (idx < 0 || idx >= this.n || this.done[idx] || this.gameOver) return;
    const now = Date.now();
    if (now - this.lastTap[idx] < this.DEBOUNCE) return;
    this.lastTap[idx] = now;
    this.pos[idx] = Math.min(this.TRACK_LEN, this.pos[idx] + this.TAP_ADV);
    this.taps[idx]++;
    Audio.playClick();
    const zW = this.W / this.n;
    this.ripples[idx].push({ r: 10, max: zW * 0.38, alpha: 0.75 });
    if (this.pos[idx] >= this.TRACK_LEN && !this.done[idx]) {
      this.done[idx] = true;
      Audio.playWin();
    }
  }

  _bindInput() {
    this._onTouch = (e) => {
      if (e.cancelable) e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      for (const t of e.changedTouches) {
        const x = (t.clientX - rect.left) * (this.W / rect.width);
        const y = (t.clientY - rect.top)  * (this.H / rect.height);
        if (y >= this.raceH) {
          this._tap(Math.min(this.n - 1, Math.floor(x / (this.W / this.n))));
        }
      }
    };
    this._onClick = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.W / rect.width);
      const y = (e.clientY - rect.top)  * (this.H / rect.height);
      if (y >= this.raceH) {
        this._tap(Math.min(this.n - 1, Math.floor(x / (this.W / this.n))));
      }
    };
    // Keyboard: P1=Space, P2=A, P3=S, P4=D
    this._onKey = (e) => {
      const m = { Space:0, ArrowRight:0, KeyA:1, KeyS:2, KeyD:3 };
      const i = m[e.code];
      if (i !== undefined) this._tap(i);
    };
    this.canvas.addEventListener('touchstart', this._onTouch, { passive: false });
    this.canvas.addEventListener('click',      this._onClick);
    document.addEventListener('keydown',       this._onKey);
  }

  start() {
    this.startTime = Date.now();
    this._bindInput();
    this._loop();
  }

  _loop() {
    if (this.gameOver) return;
    this.timeLeft = Math.max(0, 15000 - (Date.now() - this.startTime));
    if (this.timeLeft <= 0 || this.done.every(Boolean)) { this._finish(); return; }
    this.frame++;
    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }

  _draw() {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    const raceH = this.raceH, tapH = this.tapH;
    ctx.clearRect(0, 0, W, H);

    // ── SKY BACKGROUND ──
    const sky = ctx.createLinearGradient(0, 0, 0, raceH);
    sky.addColorStop(0,   '#03090F');
    sky.addColorStop(0.55,'#071930');
    sky.addColorStop(1,   '#0D2E5E');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, raceH);

    // Stars
    for (let i = 0; i < 30; i++) {
      const sx = (i * 97 + 23) % W;
      const sy = (i * 43 + 9)  % (raceH * 0.45);
      const p  = 0.35 + 0.65 * Math.abs(Math.sin(this.frame * 0.04 + i));
      ctx.globalAlpha = p * 0.65;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(sx, sy, 1.3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Crowd
    for (let i = 0; i < 30; i++) {
      const cx2 = (i * 43 + this.frame * 0.14) % W;
      const cy2 = raceH * 0.34 + (i % 5) * 9;
      const wave = Math.sin(this.frame * 0.07 + i * 0.9) * 5;
      ctx.fillStyle = `hsl(${i*26},72%,62%)`;
      ctx.beginPath(); ctx.arc(cx2, cy2, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `hsl(${i*26},72%,62%)`; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx2 - 4, cy2 + 3); ctx.lineTo(cx2 - 7, cy2 - 2 + wave);
      ctx.moveTo(cx2 + 4, cy2 + 3); ctx.lineTo(cx2 + 7, cy2 - 2 - wave);
      ctx.stroke();
    }

    // ── LANES ──
    const laneH      = Math.floor((raceH * 0.55) / this.n);
    const trackTop   = raceH * 0.44;
    const marginL    = 40, marginR = 48;
    const trackW     = W - marginL - marginR;

    // Finish line
    const finishX = W - marginR + 2;
    const totalLaneH = laneH * this.n;
    for (let r = 0; r <= Math.ceil(totalLaneH / 10); r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#fff' : '#222';
        ctx.fillRect(finishX + c * 7, trackTop + r * 10, 7, Math.min(10, totalLaneH - r * 10));
      }
    }
    ctx.save();
    ctx.font = 'bold 9px Inter'; ctx.textAlign = 'center';
    ctx.fillStyle = '#F1C40F'; ctx.shadowColor = '#F1C40F'; ctx.shadowBlur = 8;
    ctx.fillText('FINISH', finishX + 7, trackTop - 5);
    ctx.restore();

    // START line
    ctx.fillStyle = '#2ECC71'; ctx.fillRect(marginL - 3, trackTop, 3, totalLaneH);
    ctx.save(); ctx.font = 'bold 8px Inter'; ctx.textAlign = 'center';
    ctx.fillStyle = '#2ECC71'; ctx.shadowColor = '#2ECC71'; ctx.shadowBlur = 6;
    ctx.fillText('GO!', marginL - 1, trackTop - 4);
    ctx.restore();

    // Distance markers
    ctx.save(); ctx.font = '8px Inter'; ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let m = 25; m < 100; m += 25) {
      const mx = marginL + trackW * (m / 100);
      ctx.fillText(`${m}m`, mx, trackTop - 3);
    }
    ctx.restore();

    // Per-lane draw
    this.players.forEach((p, i) => {
      const col   = PLAYER_COLORS[i] || '#F1C40F';
      const laneY = trackTop + i * laneH;
      const isDone = this.done[i];

      // Lane BG
      const lGrad = ctx.createLinearGradient(0, laneY, 0, laneY + laneH);
      lGrad.addColorStop(0, i % 2 === 0 ? '#1B2D40' : '#152538');
      lGrad.addColorStop(1, i % 2 === 0 ? '#122030' : '#0E1A28');
      ctx.fillStyle = lGrad; ctx.fillRect(0, laneY, W, laneH);

      // Progress fill (subtle)
      if (this.pos[i] > 0) {
        ctx.fillStyle = col + '18';
        ctx.fillRect(marginL, laneY, trackW * (this.pos[i] / this.TRACK_LEN), laneH);
      }

      // Left color strip
      ctx.fillStyle = col; ctx.fillRect(0, laneY, 5, laneH);
      ctx.fillStyle = darken(col, 30); ctx.fillRect(0, laneY, 2, laneH);

      // Lane divider
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(0, laneY + laneH - 1, W, 1);

      // Dashed center line
      ctx.save();
      ctx.setLineDash([16, 14]); ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(marginL, laneY + laneH / 2); ctx.lineTo(W - marginR, laneY + laneH / 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Player name label (left)
      ctx.save(); ctx.font = `bold ${Math.min(11, laneH * 0.2)}px Inter`;
      ctx.textAlign = 'left'; ctx.fillStyle = col;
      ctx.shadowColor = col; ctx.shadowBlur = 5;
      ctx.fillText(p.name, 9, laneY + laneH * 0.55);
      ctx.restore();

      // Progress label (right)
      ctx.save(); ctx.font = `bold ${Math.min(10, laneH * 0.18)}px Inter`;
      ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(`${Math.round(this.pos[i])}m`, W - marginR - 5, laneY + laneH * 0.55);
      ctx.restore();

      // Stickman
      const sc     = Math.min(0.72, (laneH * 0.88) / 90);
      const stickX = marginL + trackW * (this.pos[i] / this.TRACK_LEN);
      const stickY = laneY + laneH - 2;
      const running = this.taps[i] > 0 && !isDone;

      // Shadow
      ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.ellipse(stickX, stickY + 1, 11 * sc, 3.5 * sc, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      drawStickman(ctx, stickX, stickY, p.costume || 'default', { scale: sc, running, frame: this.frame + i * 20 });

      // Trophy on finish
      if (isDone) {
        ctx.save(); ctx.font = `${Math.min(18, laneH * 0.32)}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('🏆', stickX, stickY - 82 * sc);
        ctx.restore();
      }
    });

    // ── TIMER HUD ──
    const sec = (this.timeLeft / 1000).toFixed(1);
    ctx.save();
    ctx.font = `bold ${this.timeLeft < 3000 ? 22 : 16}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillStyle = this.timeLeft < 3000 ? '#E74C3C' : '#fff';
    ctx.shadowColor = this.timeLeft < 3000 ? '#E74C3C' : 'transparent';
    ctx.shadowBlur  = this.timeLeft < 3000 ? 14 : 0;
    ctx.fillText(`⏱ ${sec}s`, W / 2, 18);
    ctx.shadowBlur = 0;
    ctx.restore();

    // Label
    ctx.save(); ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('🏁 SPRINT DASH', 8, 18);
    ctx.restore();

    // ── TAP ZONES ──
    const zW = W / this.n;
    const zY = raceH;

    ctx.fillStyle = '#040A12'; ctx.fillRect(0, zY, W, tapH);
    // Separator glow line
    const sepG = ctx.createLinearGradient(0, zY, W, zY);
    sepG.addColorStop(0, 'transparent');
    sepG.addColorStop(0.25, 'rgba(255,255,255,0.18)');
    sepG.addColorStop(0.75, 'rgba(255,255,255,0.18)');
    sepG.addColorStop(1, 'transparent');
    ctx.fillStyle = sepG; ctx.fillRect(0, zY, W, 2);

    this.players.forEach((p, i) => {
      const col   = PLAYER_COLORS[i] || '#F1C40F';
      const zx    = zW * i;
      const isDone = this.done[i];
      const cx2   = zx + zW / 2;

      // Zone fill
      const zGrad = ctx.createLinearGradient(zx, zY, zx, zY + tapH);
      zGrad.addColorStop(0, col + (isDone ? '35' : '1A'));
      zGrad.addColorStop(1, col + '08');
      ctx.fillStyle = zGrad; ctx.fillRect(zx, zY, zW - 1, tapH);

      // Top bar (neon strip)
      ctx.save();
      ctx.shadowColor = col; ctx.shadowBlur = isDone ? 0 : 12;
      ctx.fillStyle = col; ctx.fillRect(zx, zY, zW - 1, 3);
      ctx.restore();

      // Divider
      if (i > 0) { ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(zx, zY, 1, tapH); }

      const fz = Math.min(16, zW * 0.15);

      // Name
      ctx.save(); ctx.font = `900 ${fz}px Inter`;
      ctx.textAlign = 'center'; ctx.fillStyle = col;
      ctx.shadowColor = col; ctx.shadowBlur = isDone ? 0 : 7;
      ctx.fillText(p.name, cx2, zY + tapH * 0.3);
      ctx.restore();

      // Instruction
      ctx.save(); ctx.font = `800 ${Math.min(13, zW * 0.12)}px Inter`;
      ctx.textAlign = 'center';
      ctx.fillStyle = isDone ? '#2ECC71' : 'rgba(255,255,255,0.6)';
      ctx.fillText(isDone ? '✅ DONE!' : '👆 TAP!', cx2, zY + tapH * 0.57);
      ctx.restore();

      // Tap count
      ctx.save(); ctx.font = `600 ${Math.min(11, zW * 0.1)}px Inter`;
      ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fillText(`${this.taps[i]} taps`, cx2, zY + tapH * 0.80);
      ctx.restore();

      // Ripples
      this.ripples[i] = this.ripples[i].filter(rp => rp.alpha > 0.04);
      this.ripples[i].forEach(rp => {
        rp.r = Math.min(rp.r + 3, rp.max);
        rp.alpha *= 0.85;
        ctx.save(); ctx.strokeStyle = col; ctx.globalAlpha = rp.alpha;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx2, zY + tapH * 0.5, rp.r, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      });
    });
  }

  _finish() {
    if (this.gameOver) return;
    this.gameOver = true;
    cancelAnimationFrame(this.raf);

    const ranked = [...Array(this.n).keys()].sort((a, b) => this.pos[b] - this.pos[a]);
    const baseScores = [320, 230, 160, 95];
    const results = this.players.map((p, i) => ({
      winner:     'player',
      score:      (baseScores[ranked.indexOf(i)] || 90) + Math.floor(this.taps[i] * 1.8),
      playerName: p.name,
      gameName:   'Sprint Dash',
    }));

    this._drawFinishOverlay(results, ranked);
    setTimeout(() => { this._cleanup(); this.onComplete(results); }, 2800);
  }

  _drawFinishOverlay(results, ranked) {
    const ctx = this.ctx;
    const W = this.W, raceH = this.raceH;
    ctx.fillStyle = 'rgba(0,0,0,0.74)'; ctx.fillRect(0, 0, W, raceH);
    const winner = this.players[ranked[0]];
    const wCol   = PLAYER_COLORS[ranked[0]] || '#F1C40F';
    ctx.save();
    ctx.font = `900 ${Math.min(W * 0.073, 26)}px Inter`;
    ctx.textAlign = 'center'; ctx.fillStyle = wCol;
    ctx.shadowColor = wCol; ctx.shadowBlur = 20;
    ctx.fillText(`🏆 ${winner.name} WINS!`, W / 2, raceH * 0.30);
    ctx.shadowBlur = 0;
    const medals = ['🥇','🥈','🥉','4️⃣'];
    ranked.forEach((pi, r) => {
      const col = PLAYER_COLORS[pi] || '#888';
      ctx.font = `700 ${Math.min(W * 0.042, 15)}px Inter`;
      ctx.fillStyle = r === 0 ? col : '#777';
      ctx.fillText(`${medals[r]} ${this.players[pi].name}   +${results[pi].score} pts`, W / 2, raceH * 0.46 + r * 22);
    });
    ctx.restore();
  }

  _cleanup() {
    this.canvas.removeEventListener('touchstart', this._onTouch);
    this.canvas.removeEventListener('click',      this._onClick);
    document.removeEventListener('keydown',       this._onKey);
  }
}
