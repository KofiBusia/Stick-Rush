// ═══════════════════════════════════════════════════════
//  STICK RUSH — MINI GAME 3: REFLEX BLASTER
//  Tap the glowing targets before they vanish!
// ═══════════════════════════════════════════════════════

class ReflexBlaster {
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
    this.misses      = 0;
    this.combo       = 0;
    this.maxCombo    = 0;
    this.targets     = [];
    this.particles   = [];
    this.frame       = 0;
    this.gameOver    = false;
    this.startTime   = null;
    this.timeLeft    = this.GAME_DUR;
    this.raf         = null;
    this.spawnTimer  = 0;
    this.spawnInt    = 40;
    this.stickX      = this.W / 2;
    this.stickY      = this.H - 90;

    this.COLORS = [
      { fill:'#E74C3C', stroke:'#922B21', name:'Red'    },
      { fill:'#3498DB', stroke:'#1A5276', name:'Blue'   },
      { fill:'#F1C40F', stroke:'#D4AC0D', name:'Yellow' },
      { fill:'#2ECC71', stroke:'#1E8449', name:'Green'  },
      { fill:'#9B59B6', stroke:'#6C3483', name:'Purple' },
    ];

  }

  _bind() {
    this._onTap = (e) => {
      e.preventDefault();
      const rect  = this.canvas.getBoundingClientRect();
      const scaleX = this.W / rect.width;
      const scaleY = this.H / rect.height;
      let cx, cy;
      if (e.touches) {
        cx = (e.touches[0].clientX - rect.left) * scaleX;
        cy = (e.touches[0].clientY - rect.top)  * scaleY;
      } else {
        cx = (e.clientX - rect.left) * scaleX;
        cy = (e.clientY - rect.top)  * scaleY;
      }
      this._tapAt(cx, cy);
    };
    this.canvas.addEventListener('click', this._onTap);
    this.canvas.addEventListener('touchstart', this._onTap, { passive: false });
  }

  _tapAt(x, y) { if (!this.gameOver) this._checkHit(x, y); }

  _spawnTarget() {
    const margin = 60;
    const safeH  = this.H - 160;
    const color  = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    const r      = 22 + Math.random() * 14;
    const ttl    = Math.max(30, 70 - this.hits * 0.5); // shrinks as you improve
    this.targets.push({
      x: margin + Math.random() * (this.W - margin * 2),
      y: 80 + Math.random() * safeH,
      r, color, ttl, age: 0, hit: false, miss: false,
      pulsed: 0,
    });
  }

  _checkHit(cx, cy) {
    let hit = false;
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const t = this.targets[i];
      if (t.hit || t.miss) continue;
      const dx = cx - t.x, dy = cy - t.y;
      if (Math.sqrt(dx*dx + dy*dy) <= t.r + 8) {
        t.hit = true;
        this.hits++;
        this.combo++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        const pts = 50 + this.combo * 10;
        this.score += pts;
        Audio.playCollect();
        // Particles
        for (let p = 0; p < 8; p++) {
          const angle = (Math.PI * 2 * p) / 8;
          this.particles.push({ x: t.x, y: t.y, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4, color: t.color.fill, life: 20, pts });
        }
        hit = true;
        break;
      }
    }
    if (!hit) {
      this.combo  = 0;
      this.misses++;
      this.score  = Math.max(0, this.score - 10);
    }
  }

  start() {
    this._bind();
    this.startTime = Date.now();
    this._spawnTarget();
    this._loop();
  }

  _loop() {
    if (this.gameOver) return;
    const now     = Date.now();
    this.timeLeft = Math.max(0, this.GAME_DUR - (now - this.startTime));
    if (this.timeLeft <= 0) { this._finish(); return; }

    this.frame++;
    this.spawnTimer++;
    this.spawnInt = Math.max(20, 40 - Math.floor(this.hits / 5));

    if (this.spawnTimer >= this.spawnInt) {
      this._spawnTarget();
      this.spawnTimer = 0;
    }

    // Age targets
    this.targets.forEach(t => {
      if (!t.hit) {
        t.age++;
        if (t.age >= t.ttl && !t.miss) {
          t.miss = true;
          this.combo = 0;
        }
      }
    });
    this.targets = this.targets.filter(t => !(t.miss && t.age > t.ttl + 15) && !(t.hit && t.age > t.ttl + 10));

    // Particles
    this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vx *= 0.9; p.vy *= 0.9; p.life--; });
    this.particles = this.particles.filter(p => p.life > 0);

    // Stickman follows targets
    const nearest = this.targets.filter(t => !t.hit && !t.miss)
      .sort((a,b) => Math.abs(a.x - this.stickX) - Math.abs(b.x - this.stickX))[0];
    if (nearest) {
      this.stickX += (nearest.x - this.stickX) * 0.06;
    }

    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }

  _draw() {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);

    // Dark arena BG
    const bg = ctx.createRadialGradient(W/2, H/2, 50, W/2, H/2, H);
    bg.addColorStop(0, '#1B2631');
    bg.addColorStop(1, '#0B0F14');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Targets
    this.targets.forEach(t => {
      const pct = 1 - t.age / t.ttl;
      ctx.globalAlpha = t.hit ? 0.3 : (t.miss ? 0.15 : Math.max(0.2, pct));

      // Pulse ring
      if (!t.hit && !t.miss) {
        const pulse = 1 + Math.sin(this.frame * 0.15) * 0.12;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r * pulse + 6, 0, Math.PI*2);
        ctx.strokeStyle = t.color.fill + '88'; ctx.lineWidth = 2; ctx.stroke();
      }

      // Countdown arc
      if (!t.hit && !t.miss) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r + 3, -Math.PI/2, -Math.PI/2 + Math.PI*2*pct);
        ctx.strokeStyle = t.color.fill; ctx.lineWidth = 3; ctx.stroke();
      }

      // Main circle
      ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI*2);
      const g = ctx.createRadialGradient(t.x-5, t.y-5, 2, t.x, t.y, t.r);
      g.addColorStop(0, t.hit ? '#aaa' : t.color.fill);
      g.addColorStop(1, t.hit ? '#555' : t.color.stroke);
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = t.color.stroke; ctx.lineWidth = 2; ctx.stroke();

      // Hit check mark
      if (t.hit) {
        ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.round(t.r)}px Arial`;
        ctx.textAlign = 'center'; ctx.fillText('✓', t.x, t.y + t.r*0.4);
      }
      ctx.globalAlpha = 1;
    });

    // Particles
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life / 20;
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
      ctx.fillStyle = p.color; ctx.fill();
      if (p.life > 15) {
        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
        ctx.fillText(`+${p.pts}`, p.x, p.y - 10);
      }
      ctx.globalAlpha = 1;
    });

    // Ground
    ctx.fillStyle = '#1A252F';
    ctx.fillRect(0, H - 75, W, 75);
    ctx.fillStyle = '#F1C40F';
    ctx.fillRect(0, H - 75, W, 3);

    // Stickman at bottom
    drawStickman(ctx, this.stickX, H - 75, this.costume, {
      scale: 0.9, running: this.frame % 2 === 0, frame: this.frame
    });

    // HUD
    const pct = this.timeLeft / this.GAME_DUR;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(10, 10, W - 20, 14);
    ctx.fillStyle = pct > 0.5 ? '#2ECC71' : pct > 0.25 ? '#F39C12' : '#E74C3C';
    ctx.fillRect(10, 10, (W - 20) * pct, 14);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`⏱ ${(this.timeLeft/1000).toFixed(1)}s`, W/2, 21);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#F1C40F'; ctx.font = 'bold 20px Inter';
    ctx.fillText(`⭐ ${this.score}`, 10, 45);
    ctx.fillStyle = '#2ECC71'; ctx.font = '13px Inter';
    ctx.fillText(`✓ ${this.hits}  ✗ ${this.misses}`, 10, 64);

    if (this.combo >= 3) {
      ctx.fillStyle = '#F39C12'; ctx.font = `bold ${18 + Math.min(this.combo, 10)}px Inter`;
      ctx.textAlign = 'right';
      ctx.fillText(`🔥 COMBO x${this.combo}!`, W - 10, 45);
    }
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px Inter';
    ctx.fillText(`Targets: ${this.targets.filter(t=>!t.hit&&!t.miss).length}`, W - 10, 64);

    if (this.frame < 80) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(W/2-160, H/2-30, 320, 60);
      ctx.fillStyle = '#F1C40F'; ctx.font = 'bold 17px Inter'; ctx.textAlign = 'center';
      ctx.fillText('👆 TAP the glowing circles!', W/2, H/2+2);
      ctx.fillStyle = '#aaa'; ctx.font = '12px Inter';
      ctx.fillText('Faster taps = more combo bonus!', W/2, H/2+24);
    }
  }

  _finish() {
    if (this.gameOver) return;
    this.gameOver = true;
    cancelAnimationFrame(this.raf);
    const accuracy = this.hits + this.misses > 0
      ? Math.round((this.hits / (this.hits + this.misses)) * 100) : 0;
    if (accuracy >= 80) Audio.playWin();
    else Audio.playLose();
    Audio.cheer(this.score >= 500 ? 'perfect_score' : 'round_winner', this.playerName);
    this._drawResult(accuracy);
    setTimeout(() => {
      this._cleanup();
      this.onComplete({ winner: this.score >= 200 ? 'player' : 'cpu', score: this.score, playerName: this.playerName, gameName: 'Reflex Blaster' });
    }, 2500);
  }

  _drawResult(accuracy) {
    const ctx = this.ctx; const W = this.W, H = this.H;
    ctx.fillStyle = accuracy >= 60 ? 'rgba(39,174,96,0.9)' : 'rgba(231,76,60,0.88)';
    ctx.fillRect(0, H/2 - 70, W, 140);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 30px Inter'; ctx.textAlign = 'center';
    ctx.fillText(accuracy >= 60 ? '🎯 SHARP REFLEXES!' : '⚡ KEEP TRAINING!', W/2, H/2 - 18);
    ctx.font = 'bold 20px Inter';
    ctx.fillText(`Score: +${this.score} pts`, W/2, H/2 + 18);
    ctx.font = '14px Inter';
    ctx.fillText(`${accuracy}% accuracy | Best combo: x${this.maxCombo}`, W/2, H/2 + 44);
  }

  _cleanup() {
    this.canvas.removeEventListener('click', this._onTap);
    this.canvas.removeEventListener('touchstart', this._onTap);
    document.removeEventListener('keydown', this._onKey);
  }
}
