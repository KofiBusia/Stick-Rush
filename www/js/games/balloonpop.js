// BalloonPop — Pop the balloons!
// Part of Stick Rush mobile party game suite.

class BalloonPop {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.playerName    = playerName;
    this.playerCostume = playerCostume;
    this.onComplete    = onComplete;

    this.W = canvas.width;
    this.H = canvas.height;

    this.GAME_DURATION  = 20;
    this.BASE_INTERVAL  = 80;  // frames between spawns
    this.MIN_INTERVAL   = 28;

    this.score      = 0;
    this.frameCount = 0;
    this.startTime  = null;
    this.timeLeft   = this.GAME_DURATION;
    this.finished   = false;

    this.balloons  = [];
    this.particles = [];
    this.escapes   = []; // { x, y, alpha } for X markers

    this.nextSpawn = 0;
    this.pinFrame  = 0;
    this.pinTimer  = 0;

    this.BALLOON_COLORS = ['#E74C3C','#3498DB','#2ECC71','#F1C40F','#9B59B6','#E67E22'];

    this._raf       = null;
    this._boundTap  = this._onTap.bind(this);
    this._boundLoop = this._loop.bind(this);
  }

  _spawnBalloon() {
    const r     = 26 + Math.random() * 18;
    const x     = r + Math.random() * (this.W - r * 2);
    const speed = 1.2 + Math.random() * 1.6;
    const pts   = Math.ceil(speed * 14) * 5; // faster = worth more
    const color = this.BALLOON_COLORS[Math.floor(Math.random() * this.BALLOON_COLORS.length)];
    this.balloons.push({ x, y: this.H + r, r, speed, pts, color, wobble: Math.random() * Math.PI * 2 });
  }

  start() {
    this.startTime = performance.now();
    this.canvas.addEventListener('touchstart', this._boundTap, { passive: false });
    this.canvas.addEventListener('mousedown',  this._boundTap);
    this._spawnBalloon();
    this._raf = requestAnimationFrame(this._boundLoop);
  }

  _loop(ts) {
    if (this.finished) return;
    const elapsed  = (ts - this.startTime) / 1000;
    this.timeLeft  = Math.max(0, this.GAME_DURATION - elapsed);
    this.frameCount++;

    const progress = elapsed / this.GAME_DURATION;
    const interval = Math.round(this.BASE_INTERVAL - (this.BASE_INTERVAL - this.MIN_INTERVAL) * progress);

    // Spawn
    this.nextSpawn--;
    if (this.nextSpawn <= 0) {
      this._spawnBalloon();
      this.nextSpawn = interval;
    }

    // Move balloons
    this.balloons.forEach(b => {
      b.y      -= b.speed;
      b.wobble += 0.06;
      b.x      += Math.sin(b.wobble) * 0.7;
    });

    // Check escapes
    this.balloons = this.balloons.filter(b => {
      if (b.y + b.r < 0) {
        this.escapes.push({ x: b.x, y: 40, alpha: 1.4 });
        return false;
      }
      return true;
    });

    // Update particles
    this.particles.forEach(p => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += 0.18;
      p.alpha -= 0.04;
      p.r    *= 0.96;
    });
    this.particles = this.particles.filter(p => p.alpha > 0);

    // Update escape markers
    this.escapes.forEach(e => { e.alpha -= 0.025; e.y -= 0.5; });
    this.escapes = this.escapes.filter(e => e.alpha > 0);

    // Pin animation
    this.pinTimer++;
    if (this.pinTimer > 8) { this.pinTimer = 0; this.pinFrame++; }

    this._draw();
    if (this.timeLeft <= 0) { this._finish(); return; }
    this._raf = requestAnimationFrame(this._boundLoop);
  }

  _draw() {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0B0F14';
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 30; i++) {
      const sx = ((i * 137 + 17) % W);
      const sy = ((i * 79  + 31) % (H * 0.7));
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

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
    ctx.fillStyle = '#aaa';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(this.timeLeft)}s`, W - 16, 52);

    // Instruction banner
    if (this.frameCount < 80) {
      const alpha = Math.min(1, (80 - this.frameCount) / 30);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, H / 2 - 40, W, 80);
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Pop the balloons!', W / 2, H / 2 + 8);
      ctx.restore();
    }

    // Balloons
    this.balloons.forEach(b => this._drawBalloon(b));

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

    // Escape X markers
    this.escapes.forEach(e => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, e.alpha);
      ctx.fillStyle = '#E74C3C';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('X', e.x, e.y);
      ctx.restore();
    });

    // Ground line
    const groundY = H - 80;
    ctx.strokeStyle = '#2ECC71';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Stickman with pin
    if (typeof drawStickman === 'function') {
      drawStickman(ctx, W / 2, groundY, this.playerCostume, {
        scale: 1.0,
        running: false,
        jumping: false,
        frame: this.pinFrame,
      });
    }

    // Pin (drawn on top of stickman hand)
    ctx.save();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 + 18, groundY - 48);
    ctx.lineTo(W / 2 + 36, groundY - 72);
    ctx.stroke();
    ctx.fillStyle = '#F1C40F';
    ctx.beginPath();
    ctx.arc(W / 2 + 38, groundY - 75, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawBalloon(b) {
    const { ctx } = this;
    ctx.save();

    // String
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + b.r);
    ctx.lineTo(b.x, b.y + b.r + 22);
    ctx.stroke();

    // Shadow glow
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r + 4, 0, Math.PI * 2);
    ctx.fillStyle = b.color + '33';
    ctx.fill();

    // Balloon body
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Shine
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fill();

    // Point value
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(b.r * 0.55)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.pts, b.x, b.y);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  _burst(balloon) {
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x: balloon.x, y: balloon.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        r: 4 + Math.random() * 5,
        color: balloon.color,
        alpha: 1.2,
      });
    }
  }

  _onTap(e) {
    e.preventDefault();
    if (this.finished) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.W / rect.width;
    const scaleY = this.H / rect.height;
    let tapX, tapY;
    if (e.touches) {
      tapX = (e.touches[0].clientX - rect.left) * scaleX;
      tapY = (e.touches[0].clientY - rect.top)  * scaleY;
    } else {
      tapX = (e.clientX - rect.left) * scaleX;
      tapY = (e.clientY - rect.top)  * scaleY;
    }

    this._tapAt(tapX, tapY);
  }

  _tapAt(x, y) {
    if (this.finished) return;
    let hit = false;
    for (let i = this.balloons.length - 1; i >= 0; i--) {
      const b = this.balloons[i];
      const dx = x - b.x;
      const dy = y - b.y;
      if (dx * dx + dy * dy <= (b.r + 10) * (b.r + 10)) {
        this._burst(b);
        this.score += b.pts;
        this.balloons.splice(i, 1);
        if (typeof Audio !== 'undefined') Audio.playCollect();
        hit = true;
        break;
      }
    }
    if (!hit && typeof Audio !== 'undefined') Audio.playClick();
  }

  _finish() {
    if (this.finished) return;
    this.finished = true;
    cancelAnimationFrame(this._raf);
    this._cleanup();

    const winner = this.score >= 250 ? 'player' : 'cpu';
    if (typeof Audio !== 'undefined') {
      winner === 'player' ? Audio.playWin() : Audio.playLose();
    }
    this._drawResult(winner);
    setTimeout(() => {
      this.onComplete({ winner, score: this.score, playerName: this.playerName, gameName: 'BalloonPop' });
    }, 2800);
  }

  _drawResult(winner) {
    const { ctx, W, H } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(11,15,20,0.88)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = winner === 'player' ? '#F1C40F' : '#E74C3C';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(winner === 'player' ? 'YOU WIN!' : 'CPU WINS', W / 2, H / 2 - 30);
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.fillText(`Score: ${this.score}`, W / 2, H / 2 + 20);
    ctx.fillStyle = '#aaa';
    ctx.font = '16px sans-serif';
    ctx.fillText(this.playerName, W / 2, H / 2 + 54);
    ctx.restore();
  }

  _cleanup() {
    this.canvas.removeEventListener('touchstart', this._boundTap);
    this.canvas.removeEventListener('mousedown',  this._boundTap);
  }
}
