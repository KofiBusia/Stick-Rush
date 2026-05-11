// ═══════════════════════════════════════════════════════
//  STICK RUSH — MINI GAME 2: JUMP FEVER
//  Dodge obstacles! Survive as long as possible.
// ═══════════════════════════════════════════════════════

class JumpFever {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas      = canvas;
    this.ctx         = canvas.getContext('2d');
    this.playerName  = playerName;
    this.costume     = playerCostume || 'default';
    this.onComplete  = onComplete;
    this.W           = canvas.width;
    this.H           = canvas.height;

    this.groundY     = this.H - 80;
    this.GRAVITY     = 0.55;
    this.JUMP_VEL    = -13;
    this.GAME_DUR    = 20000; // 20 seconds

    this.playerX     = 100;
    this.playerY     = this.groundY;
    this.velY        = 0;
    this.onGround    = true;
    this.jumping     = false;
    this.doubleJump  = false;

    this.obstacles   = [];
    this.coins       = [];
    this.spawnTimer  = 0;
    this.spawnInterval = 90;
    this.speed       = 4;
    this.frame       = 0;
    this.score       = 0;
    this.coinsCollected = 0;
    this.gameOver    = false;
    this.startTime   = null;
    this.timeLeft    = this.GAME_DUR;
    this.raf         = null;
    this.bgX         = 0;

  }

  _bind() {
    this._onTap = (e) => { e.preventDefault(); if (!this.gameOver) this._jump(); };
    this.canvas.addEventListener('click',      this._onTap);
    this.canvas.addEventListener('touchstart', this._onTap, { passive: false });
    document.addEventListener('keydown', this._onKey = (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.gameOver) {
        e.preventDefault();
        this._jump();
      }
    });
  }

  _jump() {
    if (this.onGround) {
      this.velY       = this.JUMP_VEL;
      this.onGround   = false;
      this.jumping    = true;
      this.doubleJump = true;
      Audio.playJump();
    } else if (this.doubleJump) {
      this.velY       = this.JUMP_VEL * 0.85;
      this.doubleJump = false;
      Audio.playJump();
    }
  }

  start() {
    this._bind();
    this.startTime = Date.now();
    this._spawnObstacle();
    this._loop();
  }

  _spawnObstacle() {
    const types = ['low', 'low', 'low', 'high', 'double'];
    const type  = types[Math.floor(Math.random() * types.length)];
    if (type === 'low') {
      this.obstacles.push({ x: this.W + 20, y: this.groundY - 30, w: 20, h: 30, color:'#E74C3C', type:'low' });
    } else if (type === 'high') {
      this.obstacles.push({ x: this.W + 20, y: this.groundY - 80, w: 20, h: 30, color:'#E67E22', type:'high' });
    } else {
      this.obstacles.push({ x: this.W + 20, y: this.groundY - 30, w: 18, h: 30, color:'#E74C3C', type:'low' });
      this.obstacles.push({ x: this.W + 50, y: this.groundY - 65, w: 18, h: 30, color:'#E67E22', type:'high' });
    }
    // Random coin
    if (Math.random() > 0.4) {
      this.coins.push({ x: this.W + Math.random() * 100 + 40, y: this.groundY - 50 - Math.random() * 40, r: 10, active: true });
    }
  }

  _loop() {
    if (this.gameOver) return;
    const now     = Date.now();
    this.timeLeft = Math.max(0, this.GAME_DUR - (now - this.startTime));
    if (this.timeLeft <= 0) { this._finish(true); return; }

    this.frame++;

    // Increase speed over time
    this.speed = 4 + Math.floor((this.GAME_DUR - this.timeLeft) / 4000) * 0.5;

    // Physics
    this.velY      += this.GRAVITY;
    this.playerY   += this.velY;
    if (this.playerY >= this.groundY) {
      this.playerY  = this.groundY;
      this.velY     = 0;
      this.onGround = true;
      this.jumping  = false;
      if (!this.onGround) Audio.playLand();
    }

    // Move obstacles
    this.obstacles.forEach(o => o.x -= this.speed);
    this.obstacles = this.obstacles.filter(o => o.x > -50);

    // Move coins
    this.coins.forEach(c => c.x -= this.speed);
    this.coins = this.coins.filter(c => c.x > -30);

    // Spawn
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this._spawnObstacle();
      this.spawnTimer    = 0;
      this.spawnInterval = Math.max(50, 90 - Math.floor((this.GAME_DUR - this.timeLeft) / 3000) * 5);
    }

    // Score increment
    if (this.frame % 6 === 0) this.score += 1;

    // Collision
    const pLeft  = this.playerX - 14;
    const pRight = this.playerX + 14;
    const pTop   = this.playerY - 62;
    const pBot   = this.playerY;
    for (const o of this.obstacles) {
      if (pRight > o.x && pLeft < o.x + o.w && pBot > o.y && pTop < o.y + o.h) {
        this._finish(false);
        return;
      }
    }

    // Coin collection
    this.coins.forEach(c => {
      if (c.active) {
        const dx = this.playerX - c.x, dy = (this.playerY - 30) - c.y;
        if (Math.sqrt(dx*dx + dy*dy) < c.r + 16) {
          c.active = false;
          this.score += 30;
          this.coinsCollected++;
          Audio.playCollect();
        }
      }
    });

    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }

  _draw() {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#1A0533');
    sky.addColorStop(1, '#3B1F6A');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 20; i++) {
      const sx = ((i * 53 + this.bgX * 0.1) % W);
      const sy = 10 + (i * 17) % 60;
      const sr = 0.5 + (i % 3) * 0.5;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
    }

    // Ground
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(0, this.groundY, W, H - this.groundY);
    // Ground lines
    this.bgX = (this.bgX + this.speed) % 80;
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    for (let x = -this.bgX; x < W; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, this.groundY); ctx.lineTo(x, H); ctx.stroke();
    }
    ctx.fillStyle = '#F1C40F';
    ctx.fillRect(0, this.groundY, W, 3);

    // Coins
    this.coins.filter(c => c.active).forEach(c => {
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
      const g = ctx.createRadialGradient(c.x - 3, c.y - 3, 1, c.x, c.y, c.r);
      g.addColorStop(0, '#FFE566'); g.addColorStop(1, '#D4AC0D');
      ctx.fillStyle = g; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '8px Arial'; ctx.textAlign = 'center';
      ctx.fillText('₵', c.x, c.y + 3);
    });

    // Obstacles
    this.obstacles.forEach(o => {
      ctx.fillStyle = o.color;
      ctx.fillRect(o.x, o.y, o.w, o.h);
      // Spikes on top
      ctx.fillStyle = '#922B21';
      for (let sx = o.x; sx < o.x + o.w; sx += 8) {
        ctx.beginPath(); ctx.moveTo(sx, o.y); ctx.lineTo(sx + 4, o.y - 8); ctx.lineTo(sx + 8, o.y); ctx.fill();
      }
    });

    // Player
    drawStickman(ctx, this.playerX, this.playerY, this.costume, {
      scale: 1, running: this.onGround && this.frame % 2 === 0,
      frame: this.frame, jumping: !this.onGround
    });

    // HUD
    // Timer bar
    const pct = this.timeLeft / this.GAME_DUR;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, W - 20, 14);
    const barColor = pct > 0.5 ? '#2ECC71' : pct > 0.25 ? '#F39C12' : '#E74C3C';
    ctx.fillStyle = barColor;
    ctx.fillRect(10, 10, (W - 20) * pct, 14);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`⏱ ${(this.timeLeft / 1000).toFixed(1)}s`, W / 2, 21);

    // Score
    ctx.fillStyle = '#F1C40F';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`⭐ ${this.score}`, 10, 42);

    // Coins
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px Inter';
    ctx.fillText(`₵ ×${this.coinsCollected}`, 10, 60);

    // Speed indicator
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(`Speed: ${this.speed.toFixed(1)}x`, W - 10, 22);

    // Instruction (first 3 seconds)
    if (this.frame < 100) {
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(W/2 - 160, H/2 - 35, 320, 70);
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 17px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('👆 TAP / SPACE to JUMP', W/2, H/2);
      ctx.fillStyle = '#aaa';
      ctx.font = '12px Inter';
      ctx.fillText('Double-tap for double jump!', W/2, H/2 + 22);
    }
  }

  _finish(survived) {
    if (this.gameOver) return;
    this.gameOver = true;
    cancelAnimationFrame(this.raf);
    if (!survived) { Audio.playHit(); this.score = Math.max(0, this.score - 20); }
    else           { Audio.playWin(); }
    if (survived || this.score > 100) Audio.cheer('round_winner', this.playerName);
    this._drawResult(survived);
    setTimeout(() => {
      this._cleanup();
      this.onComplete({ winner: survived ? 'player' : 'cpu', score: this.score, playerName: this.playerName, gameName: 'Jump Fever' });
    }, 2500);
  }

  _drawResult(survived) {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    ctx.fillStyle = survived ? 'rgba(39,174,96,0.9)' : 'rgba(231,76,60,0.9)';
    ctx.fillRect(0, H/2 - 65, W, 130);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(survived ? '🏆 SURVIVED!' : '💥 CRASH!', W/2, H/2 - 15);
    ctx.font = 'bold 20px Inter';
    ctx.fillText(`Score: +${this.score} pts`, W/2, H/2 + 18);
    ctx.font = '14px Inter';
    ctx.fillText(`Coins: ${this.coinsCollected} | Speed reached: ${this.speed.toFixed(1)}x`, W/2, H/2 + 44);
  }

  _cleanup() {
    this.canvas.removeEventListener('click', this._onTap);
    this.canvas.removeEventListener('touchstart', this._onTap);
    document.removeEventListener('keydown', this._onKey);
  }
}
