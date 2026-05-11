// ═══════════════════════════════════════════════════════
//  STICK RUSH — MINI GAME: WHACK-A-MOLE
//  Tap the stickman moles before they disappear!
// ═══════════════════════════════════════════════════════

class WhackMole {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas      = canvas;
    this.ctx         = canvas.getContext('2d');
    this.playerName  = playerName;
    this.costume     = playerCostume || 'default';
    this.onComplete  = onComplete;
    this.W           = canvas.width;
    this.H           = canvas.height;

    this.GAME_DUR    = 20000;
    this.score       = 0;
    this.hits        = 0;
    this.frame       = 0;
    this.gameOver    = false;
    this.startTime   = null;
    this.timeLeft    = this.GAME_DUR;
    this.raf         = null;

    // Adapt grid to canvas width
    this.cols = this.W > 180 ? 3 : 2;
    this.rows = 3;
    this._buildHoles();
  }

  _buildHoles() {
    this.holes = [];
    const padX = 20, padY = 100;
    const cellW = (this.W - padX * 2) / this.cols;
    const cellH = (this.H - padY - 80) / this.rows;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.holes.push({
          x: padX + (c + 0.5) * cellW,
          y: padY + (r + 0.5) * cellH,
          state: 'hidden',  // hidden | rising | showing | falling | whacked
          timer: 0,
          maxShow: 55,
          popText: '',
          popTimer: 0,
        });
      }
    }
  }

  _bind() {
    this._onTap = (e) => {
      e.preventDefault();
      const rect   = this.canvas.getBoundingClientRect();
      const scaleX = this.W / rect.width;
      const scaleY = this.H / rect.height;
      const touches = e.changedTouches || e.touches;
      if (touches && touches.length) {
        Array.from(touches).forEach(t => {
          this._tapAt((t.clientX - rect.left) * scaleX, (t.clientY - rect.top) * scaleY);
        });
      } else {
        this._tapAt((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
      }
    };
    this.canvas.addEventListener('touchstart', this._onTap, { passive: false });
    this.canvas.addEventListener('click',      this._onTap);
    document.addEventListener('keydown', this._onKey = () => {});
  }

  // Called by SimultaneousGame with local canvas coordinates
  _tapAt(x, y) {
    if (this.gameOver) return;
    let hit = false;
    for (const h of this.holes) {
      if (h.state !== 'showing') continue;
      const dx = x - h.x, dy = y - (h.y - 18);
      if (Math.sqrt(dx * dx + dy * dy) < 30) {
        h.state    = 'whacked';
        h.timer    = 0;
        h.popText  = '+50';
        h.popTimer = 0;
        this.score += 50;
        this.hits++;
        Audio.playCollect();
        hit = true;
        break;
      }
    }
    if (!hit) Audio.playClick();
  }

  // Fallback for SimultaneousGame tap routing (taps center)
  _tap() { this._tapAt(this.W / 2, this.H / 2); }

  start() {
    this._bind();
    this.startTime = Date.now();
    this._loop();
  }

  _loop() {
    if (this.gameOver) return;
    const now = Date.now();
    this.timeLeft = Math.max(0, this.GAME_DUR - (now - this.startTime));
    if (this.timeLeft <= 0) { this._finish(); return; }
    this.frame++;
    this._updateHoles();
    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }

  _updateHoles() {
    const elapsed     = this.GAME_DUR - this.timeLeft;
    const showChance  = 0.006 + (elapsed / this.GAME_DUR) * 0.014;
    const maxVisible  = Math.max(1, Math.floor(this.holes.length / 3));
    const nowVisible  = this.holes.filter(h => h.state === 'showing' || h.state === 'rising').length;

    this.holes.forEach(h => {
      h.timer++;
      if (h.popTimer > 0) h.popTimer++;
      switch (h.state) {
        case 'hidden':
          if (nowVisible < maxVisible && Math.random() < showChance) {
            h.state = 'rising'; h.timer = 0;
            h.maxShow = Math.max(30, 60 - Math.floor(elapsed / 4000) * 5);
          }
          break;
        case 'rising':
          if (h.timer >= 10) h.state = 'showing';
          break;
        case 'showing':
          if (h.timer >= h.maxShow) { h.state = 'falling'; h.timer = 0; }
          break;
        case 'falling':
          if (h.timer >= 10) { h.state = 'hidden'; h.timer = 0; }
          break;
        case 'whacked':
          h.popTimer++;
          if (h.timer >= 18) { h.state = 'hidden'; h.timer = 0; h.popText = ''; h.popTimer = 0; }
          break;
      }
    });
  }

  _draw() {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);

    // Green field background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#1B5E20'); bg.addColorStop(1, '#0A2E0A');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Grass texture lines
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 80 + i * 30); ctx.lineTo(W, 80 + i * 30); ctx.stroke();
    }

    // Holes + moles
    const c = COSTUMES[this.costume] || COSTUMES.default;
    this.holes.forEach(h => {
      // Ground patch (hole ring)
      ctx.beginPath();
      ctx.ellipse(h.x, h.y + 10, 26, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#4E342E'; ctx.fill();
      ctx.beginPath();
      ctx.ellipse(h.x, h.y + 10, 20, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1A0A0A'; ctx.fill();

      if (h.state === 'hidden') return;
      let prog = 0;
      if      (h.state === 'rising')  prog = Math.min(1, h.timer / 10);
      else if (h.state === 'showing') prog = 1;
      else if (h.state === 'falling') prog = Math.max(0, 1 - h.timer / 10);
      else if (h.state === 'whacked') prog = 0.25;

      if (prog < 0.05) return;

      const headR = Math.round(13 * prog);
      const headY = h.y - 4 - headR * prog * 1.4;

      // Clip to just above the hole to make mole appear to rise
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(h.x, h.y + 10, 26, 11, 0, Math.PI, 0); // top half of hole ellipse
      ctx.rect(h.x - 40, -H, 80, H + h.y + 10);
      ctx.clip();

      // Head
      const headGrad = ctx.createRadialGradient(h.x - headR * 0.3, headY - headR * 0.3, 1, h.x, headY, headR);
      headGrad.addColorStop(0, lighten(c.head, 35)); headGrad.addColorStop(1, c.head);
      ctx.beginPath(); ctx.arc(h.x, headY, headR, 0, Math.PI * 2);
      ctx.fillStyle = headGrad; ctx.fill();
      ctx.strokeStyle = c.accent; ctx.lineWidth = 1.5; ctx.stroke();

      if (prog > 0.65) {
        // Eyes
        [[-4, -3],[4, -3]].forEach(([ox, oy]) => {
          ctx.beginPath(); ctx.arc(h.x + ox, headY + oy, headR * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
          ctx.beginPath(); ctx.arc(h.x + ox + 1, headY + oy + 1, headR * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = '#111'; ctx.fill();
        });
        // Smile
        ctx.beginPath();
        ctx.arc(h.x, headY + headR * 0.25, headR * 0.35, 0.15, Math.PI - 0.15);
        ctx.strokeStyle = h.state === 'whacked' ? '#E74C3C' : '#fff';
        ctx.lineWidth = 1.2; ctx.stroke();
      }
      ctx.restore();

      // Pop score text
      if (h.popText && h.popTimer < 30) {
        ctx.globalAlpha = 1 - h.popTimer / 30;
        ctx.fillStyle   = '#F1C40F';
        ctx.font        = 'bold 14px Inter';
        ctx.textAlign   = 'center';
        ctx.fillText(h.popText, h.x, h.y - 28 - h.popTimer * 0.8);
        ctx.globalAlpha = 1;
      }
    });

    // HUD
    const pct = this.timeLeft / this.GAME_DUR;
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(8, 8, W - 16, 14);
    ctx.fillStyle = pct > 0.5 ? '#2ECC71' : pct > 0.25 ? '#F39C12' : '#E74C3C';
    ctx.fillRect(8, 8, (W - 16) * pct, 14);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`⏱ ${(this.timeLeft/1000).toFixed(1)}s`, W/2, 19);

    ctx.fillStyle = '#F1C40F'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`⭐ ${this.score}`, 8, 40);
    ctx.fillStyle = '#aaa'; ctx.font = '11px Inter'; ctx.textAlign = 'right';
    ctx.fillText(`🔨 ${this.hits}`, W - 8, 40);

    if (this.frame < 80) {
      ctx.fillStyle = 'rgba(0,0,0,0.72)';
      ctx.fillRect(W/2 - 120, H/2 - 28, 240, 56);
      ctx.fillStyle = '#F1C40F'; ctx.font = 'bold 15px Inter'; ctx.textAlign = 'center';
      ctx.fillText('👆 TAP the moles!', W/2, H/2 + 5);
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '11px Inter';
      ctx.fillText('Faster = more points!', W/2, H/2 + 22);
    }
  }

  _finish() {
    if (this.gameOver) return;
    this.gameOver = true;
    cancelAnimationFrame(this.raf);

    const cpuScore  = 120 + Math.floor(Math.random() * 180);
    const playerWon = this.score >= cpuScore;
    if (playerWon) { Audio.playWin(); Audio.cheer('round_winner', this.playerName); }
    else           { Audio.playLose(); }

    const ctx = this.ctx; const W = this.W, H = this.H;
    ctx.fillStyle = playerWon ? 'rgba(39,174,96,0.9)' : 'rgba(180,50,50,0.9)';
    ctx.fillRect(0, H/2 - 65, W, 130);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 26px Inter'; ctx.textAlign = 'center';
    ctx.fillText(playerWon ? '🔨 WHACK MASTER!' : '❌ Too Slow!', W/2, H/2 - 14);
    ctx.font = 'bold 18px Inter';
    ctx.fillText(`Score: +${this.score} pts`, W/2, H/2 + 16);
    ctx.font = '12px Inter';
    ctx.fillText(`Hits: ${this.hits}`, W/2, H/2 + 38);

    setTimeout(() => {
      this._cleanup();
      this.onComplete({ winner: playerWon ? 'player' : 'cpu', score: this.score, playerName: this.playerName, gameName: 'Whack-A-Mole' });
    }, 2600);
  }

  _cleanup() {
    this.canvas.removeEventListener('touchstart', this._onTap);
    this.canvas.removeEventListener('click',      this._onTap);
    document.removeEventListener('keydown', this._onKey);
  }
}
