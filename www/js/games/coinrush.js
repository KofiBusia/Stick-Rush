// ═══════════════════════════════════════════════════════
//  STICK RUSH — MINI GAME: COIN RUSH
//  Move your stickman to catch falling coins!
// ═══════════════════════════════════════════════════════

class CoinRush {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas      = canvas;
    this.ctx         = canvas.getContext('2d');
    this.playerName  = playerName;
    this.costume     = playerCostume || 'default';
    this.onComplete  = onComplete;
    this.W           = canvas.width;
    this.H           = canvas.height;

    this.GAME_DUR    = 20000;
    this.groundY     = this.H - 60;
    this.playerX     = this.W / 2;
    this.targetX     = this.W / 2;
    this.score       = 0;
    this.coinsGot    = 0;
    this.coins       = [];
    this.popTexts    = [];
    this.frame       = 0;
    this.gameOver    = false;
    this.startTime   = null;
    this.timeLeft    = this.GAME_DUR;
    this.raf         = null;
    this.bgStars     = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * this.W, y: Math.random() * (this.H * 0.55),
      r: 0.5 + Math.random() * 1.5,
    }));

  }

  _bind() {
    this._onTap = (e) => {
      e.preventDefault();
      const rect   = this.canvas.getBoundingClientRect();
      const scaleX = this.W / rect.width;
      const touches = e.changedTouches || e.touches;
      let x;
      if (touches && touches.length) x = (touches[0].clientX - rect.left) * scaleX;
      else                            x = (e.clientX - rect.left) * scaleX;
      this.targetX = Math.max(14, Math.min(this.W - 14, x));
    };
    this._onMove = (e) => {
      e.preventDefault();
      const rect   = this.canvas.getBoundingClientRect();
      const scaleX = this.W / rect.width;
      if (e.touches && e.touches.length)
        this.targetX = Math.max(14, Math.min(this.W - 14, (e.touches[0].clientX - rect.left) * scaleX));
    };
    this.canvas.addEventListener('touchstart', this._onTap, { passive: false });
    this.canvas.addEventListener('touchmove',  this._onMove, { passive: false });
    this.canvas.addEventListener('click',      this._onTap);
    document.addEventListener('keydown', this._onKey = (e) => {
      const step = 40;
      if (e.code === 'ArrowLeft')  this.targetX = Math.max(14, this.targetX - step);
      if (e.code === 'ArrowRight') this.targetX = Math.min(this.W - 14, this.targetX + step);
    });
  }

  // Simultaneous mode coordinate routing
  _tapAt(x, y)  { this.targetX = Math.max(14, Math.min(this.W - 14, x)); }
  _moveAt(x, y) { this.targetX = Math.max(14, Math.min(this.W - 14, x)); }
  _tap()        { /* no-op — movement is handled via _tapAt */ }

  start() {
    this._bind();
    this.startTime = Date.now();
    this._spawnCoin();
    this._loop();
  }

  _spawnCoin() {
    const big = Math.random() < 0.18;
    this.coins.push({
      x:     14 + Math.random() * (this.W - 28),
      y:     -12,
      r:     big ? 17 : 11,
      value: big ? 100 : 30,
      big,
      hue:   big ? 45 : 48,
    });
  }

  _loop() {
    if (this.gameOver) return;
    const now = Date.now();
    this.timeLeft = Math.max(0, this.GAME_DUR - (now - this.startTime));
    if (this.timeLeft <= 0) { this._finish(); return; }
    this.frame++;

    const elapsed = this.GAME_DUR - this.timeLeft;
    const speed   = 2.2 + (elapsed / this.GAME_DUR) * 3.5;

    // Smooth player movement
    this.playerX += (this.targetX - this.playerX) * 0.14;

    // Move coins
    this.coins.forEach(c => { c.y += speed; });

    // Spawn
    const spawnEvery = Math.max(28, 50 - Math.floor(elapsed / 3000) * 4);
    if (this.frame % spawnEvery === 0) this._spawnCoin();

    // Collect
    const pTop = this.groundY - 60, pBot = this.groundY;
    this.coins.forEach(c => {
      if (c.collected) return;
      const dx = this.playerX - c.x, dy = (this.groundY - 30) - c.y;
      if (Math.sqrt(dx*dx + dy*dy) < c.r + 18) {
        c.collected = true;
        this.score  += c.value;
        this.coinsGot++;
        Audio.playCollect();
        this.popTexts.push({ x: c.x, y: c.y, text: `+${c.value}`, t: 0 });
      }
    });
    this.coins    = this.coins.filter(c => !c.collected && c.y < this.H + 20);
    this.popTexts = this.popTexts.filter(p => p.t < 35);
    this.popTexts.forEach(p => { p.t++; p.y -= 1.2; });

    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }

  _draw() {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);

    // Night sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0D0D2B'); sky.addColorStop(1, '#1A1A40');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    // Stars
    this.bgStars.forEach(s => {
      const pulse = 0.55 + Math.sin(this.frame * 0.04 + s.x) * 0.45;
      ctx.globalAlpha = pulse;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Ground
    ctx.fillStyle = '#1C2833'; ctx.fillRect(0, this.groundY, W, H - this.groundY);
    ctx.fillStyle = '#F1C40F'; ctx.fillRect(0, this.groundY, W, 2);

    // Coins
    this.coins.forEach(c => {
      const g = ctx.createRadialGradient(c.x - c.r * 0.35, c.y - c.r * 0.35, 1, c.x, c.y, c.r);
      g.addColorStop(0, '#FFE566'); g.addColorStop(0.7, '#F1C40F'); g.addColorStop(1, '#B8860B');
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = '#D4AC0D'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#7B5F00'; ctx.font = `bold ${c.big ? 11 : 8}px Inter`;
      ctx.textAlign = 'center';
      ctx.fillText('₵', c.x, c.y + (c.big ? 4 : 3));
      if (c.big) {
        ctx.fillStyle = '#fff'; ctx.font = '8px Inter';
        ctx.fillText(`+${c.value}`, c.x, c.y - c.r - 3);
      }
    });

    // Player stickman
    drawStickman(ctx, this.playerX, this.groundY, this.costume, {
      scale: 1, running: true, frame: this.frame,
    });

    // Pop texts
    this.popTexts.forEach(p => {
      ctx.globalAlpha = 1 - p.t / 35;
      ctx.fillStyle   = '#F1C40F';
      ctx.font        = 'bold 13px Inter';
      ctx.textAlign   = 'center';
      ctx.fillText(p.text, p.x, p.y);
    });
    ctx.globalAlpha = 1;

    // Target indicator (small arrow above player)
    if (Math.abs(this.targetX - this.playerX) > 10) {
      const arrowX = this.targetX;
      ctx.fillStyle = 'rgba(241,196,15,0.5)';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(this.targetX > this.playerX ? '▶' : '◀', arrowX, this.groundY - 70);
    }

    // HUD
    const pct = this.timeLeft / this.GAME_DUR;
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(8, 8, W - 16, 14);
    ctx.fillStyle = pct > 0.5 ? '#2ECC71' : pct > 0.25 ? '#F39C12' : '#E74C3C';
    ctx.fillRect(8, 8, (W - 16) * pct, 14);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`⏱ ${(this.timeLeft / 1000).toFixed(1)}s`, W / 2, 19);

    ctx.fillStyle = '#F1C40F'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`⭐ ${this.score}`, 8, 40);
    ctx.fillStyle = '#FFD700'; ctx.font = '11px Inter';
    ctx.fillText(`₵×${this.coinsGot}`, 8, 55);

    if (this.frame < 90) {
      ctx.fillStyle = 'rgba(0,0,0,0.72)';
      ctx.fillRect(W/2 - 120, H/2 - 28, 240, 56);
      ctx.fillStyle = '#F1C40F'; ctx.font = 'bold 14px Inter'; ctx.textAlign = 'center';
      ctx.fillText('👆 TAP / DRAG to move!', W/2, H/2 + 4);
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '11px Inter';
      ctx.fillText('Catch the falling coins!', W/2, H/2 + 20);
    }
  }

  _finish() {
    if (this.gameOver) return;
    this.gameOver = true;
    cancelAnimationFrame(this.raf);

    const cpuScore  = 180 + Math.floor(Math.random() * 220);
    const playerWon = this.score >= cpuScore;
    if (playerWon) { Audio.playWin(); Audio.cheer('round_winner', this.playerName); }
    else           { Audio.playLose(); }

    const ctx = this.ctx; const W = this.W, H = this.H;
    ctx.fillStyle = playerWon ? 'rgba(39,174,96,0.9)' : 'rgba(180,50,50,0.9)';
    ctx.fillRect(0, H/2 - 65, W, 130);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 24px Inter'; ctx.textAlign = 'center';
    ctx.fillText(playerWon ? '💰 COIN MASTER!' : '❌ Not Enough!', W/2, H/2 - 14);
    ctx.font = 'bold 18px Inter';
    ctx.fillText(`Score: +${this.score} pts`, W/2, H/2 + 16);
    ctx.font = '12px Inter';
    ctx.fillText(`Coins caught: ${this.coinsGot}`, W/2, H/2 + 38);

    setTimeout(() => {
      this._cleanup();
      this.onComplete({ winner: playerWon ? 'player' : 'cpu', score: this.score, playerName: this.playerName, gameName: 'Coin Rush' });
    }, 2600);
  }

  _cleanup() {
    this.canvas.removeEventListener('touchstart', this._onTap);
    this.canvas.removeEventListener('touchmove',  this._onMove);
    this.canvas.removeEventListener('click',      this._onTap);
    document.removeEventListener('keydown', this._onKey);
  }
}
