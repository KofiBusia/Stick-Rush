// ColorBlitz — Tap the matching color!
// Part of Stick Rush mobile party game suite.

class ColorBlitz {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.playerName = playerName;
    this.playerCostume = playerCostume;
    this.onComplete = onComplete;

    this.W = canvas.width;
    this.H = canvas.height;

    this.COLORS = [
      { name: 'Red',    hex: '#E74C3C' },
      { name: 'Blue',   hex: '#3498DB' },
      { name: 'Green',  hex: '#2ECC71' },
      { name: 'Yellow', hex: '#F1C40F' },
    ];

    this.GAME_DURATION = 20; // seconds
    this.CIRCLE_INTERVAL = 90; // frames before new circle (decreases over time)
    this.MIN_INTERVAL = 45;

    this.score = 0;
    this.combo = 0;
    this.currentColor = null;
    this.circleTimer = 0;
    this.frameCount = 0;
    this.startTime = null;
    this.timeLeft = this.GAME_DURATION;
    this.finished = false;

    this.dancFrame = 0;
    this.dancTimer = 0;

    this.feedback = null;   // { text, color, alpha, y }
    this.comboPopup = null; // { text, alpha }

    this._raf = null;
    this._boundTap = this._onTap.bind(this);
    this._boundLoop = this._loop.bind(this);

    // Button layout — 4 buttons at bottom
    this._buildButtons();
    this._pickColor();
  }

  _buildButtons() {
    const pad = 12;
    const btnW = (this.W - pad * 5) / 4;
    const btnH = 60;
    const y = this.H - btnH - pad;
    this.buttons = this.COLORS.map((c, i) => ({
      x: pad + i * (btnW + pad),
      y,
      w: btnW,
      h: btnH,
      color: c,
    }));
  }

  _pickColor() {
    const idx = Math.floor(Math.random() * this.COLORS.length);
    this.currentColor = this.COLORS[idx];
    this.circleTimer = 0;
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
    this.timeLeft = Math.max(0, this.GAME_DURATION - elapsed);
    this.frameCount++;

    // Decrease interval as time passes
    const progress = elapsed / this.GAME_DURATION;
    const interval = Math.round(
      this.CIRCLE_INTERVAL - (this.CIRCLE_INTERVAL - this.MIN_INTERVAL) * progress
    );

    this.circleTimer++;
    if (this.circleTimer >= interval) this._pickColor();

    this.dancTimer++;
    if (this.dancTimer > 10) { this.dancTimer = 0; this.dancFrame++; }

    if (this.feedback) {
      this.feedback.alpha -= 0.035;
      this.feedback.y    -= 1.2;
      if (this.feedback.alpha <= 0) this.feedback = null;
    }
    if (this.comboPopup) {
      this.comboPopup.alpha -= 0.03;
      if (this.comboPopup.alpha <= 0) this.comboPopup = null;
    }

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

    // Score
    ctx.fillStyle = '#F1C40F';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.score}`, 16, 52);

    ctx.fillStyle = '#aaa';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(this.timeLeft)}s`, W - 16, 52);

    // Countdown instruction banner
    if (this.frameCount < 80) {
      const alpha = Math.min(1, (80 - this.frameCount) / 30);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, H / 2 - 40, W, 80);
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Tap the matching color!', W / 2, H / 2 + 8);
      ctx.restore();
    }

    // Big color circle in center
    const cx = W / 2;
    const cy = H / 2 - 20;
    const r  = Math.min(W, H) * 0.18;

    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = this.currentColor.hex;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Question mark pulse
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `bold ${r * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', cx, cy);
    ctx.textBaseline = 'alphabetic';

    // Color name label under circle
    ctx.fillStyle = '#ccc';
    ctx.font = '14px sans-serif';
    ctx.fillText(this.currentColor.name, cx, cy + r + 22);

    // Combo display
    if (this.combo >= 2) {
      ctx.fillStyle = '#F1C40F';
      ctx.font = `bold 18px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`x${this.combo} COMBO`, W / 2, cy - r - 16);
    }

    // Color buttons
    this.buttons.forEach(btn => {
      const isMatch = btn.color.name === this.currentColor.name;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
      ctx.fillStyle = btn.color.hex;
      ctx.fill();
      if (isMatch) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.color.name, btn.x + btn.w / 2, btn.y + btn.h / 2);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
    });

    // Stickman dancing
    if (typeof drawStickman === 'function') {
      const sx = W / 2;
      const sy = this.buttons[0].y - 10;
      drawStickman(ctx, sx, sy, this.playerCostume, {
        scale: 0.9,
        running: false,
        jumping: false,
        frame: this.dancFrame,
      });
    }

    // Feedback popup
    if (this.feedback) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.feedback.alpha);
      ctx.fillStyle = this.feedback.color;
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.feedback.text, W / 2, this.feedback.y);
      ctx.restore();
    }

    // Combo popup
    if (this.comboPopup) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.comboPopup.alpha);
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.comboPopup.text, W / 2, H / 2 - 90);
      ctx.restore();
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
    for (const btn of this.buttons) {
      if (x >= btn.x && x <= btn.x + btn.w &&
          y >= btn.y && y <= btn.y + btn.h) {
        if (btn.color.name === this.currentColor.name) {
          this.combo++;
          const pts = 60 * Math.max(1, Math.floor(this.combo / 2));
          this.score += pts;
          this.feedback = { text: `+${pts}`, color: '#2ECC71', alpha: 1.4, y: this.H / 2 + 60 };
          if (this.combo >= 3) {
            this.comboPopup = { text: `${this.combo}x COMBO! FIRE!`, alpha: 1.4 };
          }
          if (typeof Audio !== 'undefined') Audio.playCorrect();
          this._pickColor();
        } else {
          this.combo = 0;
          this.score = Math.max(0, this.score - 10);
          this.feedback = { text: '-10', color: '#E74C3C', alpha: 1.4, y: this.H / 2 + 60 };
          if (typeof Audio !== 'undefined') Audio.playWrong();
        }
        break;
      }
    }
  }

  _finish() {
    if (this.finished) return;
    this.finished = true;
    cancelAnimationFrame(this._raf);
    this._cleanup();

    const winner = this.score >= 300 ? 'player' : 'cpu';
    if (typeof Audio !== 'undefined') {
      winner === 'player' ? Audio.playWin() : Audio.playLose();
    }

    this._drawResult(winner);
    setTimeout(() => {
      this.onComplete({
        winner,
        score: this.score,
        playerName: this.playerName,
        gameName: 'ColorBlitz',
      });
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
