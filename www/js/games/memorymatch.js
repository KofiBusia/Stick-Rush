// MemoryMatch — Match the pairs!
// Part of Stick Rush mobile party game suite.

class MemoryMatch {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.playerName    = playerName;
    this.playerCostume = playerCostume;
    this.onComplete    = onComplete;

    this.W = canvas.width;
    this.H = canvas.height;

    this.GAME_DURATION = 45;
    this.COLS = 4;
    this.ROWS = 3;
    this.TOTAL = this.COLS * this.ROWS; // 12 cards = 6 pairs

    this.SYMBOLS  = ['⭐','🔥','💎','🏆','🎯','🌟'];
    this.SYM_COLORS = ['#F1C40F','#E74C3C','#3498DB','#F1C40F','#E74C3C','#2ECC71'];

    this.score      = 0;
    this.frameCount = 0;
    this.startTime  = null;
    this.timeLeft   = this.GAME_DURATION;
    this.finished   = false;

    this.cards  = [];
    this.flipped = [];   // indices of currently face-up (unmatched) cards
    this.locked  = false;
    this.matched = 0;

    this.cheerFrame  = 0;
    this.cheerTimer  = 0;
    this.cheerActive = false;
    this.cheerCount  = 0;

    this.feedback = null; // { text, color, alpha, y }

    this._raf       = null;
    this._boundTap  = this._onTap.bind(this);
    this._boundLoop = this._loop.bind(this);

    this._buildCards();
    this._computeLayout();
  }

  _buildCards() {
    // Create 6 pairs
    const deck = [];
    this.SYMBOLS.forEach((sym, idx) => {
      deck.push({ sym, color: this.SYM_COLORS[idx], pairId: idx });
      deck.push({ sym, color: this.SYM_COLORS[idx], pairId: idx });
    });
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    this.cards = deck.map((d, i) => ({
      ...d,
      index: i,
      faceUp: false,
      matched: false,
      flipT: 0,      // 0=back, 1=front (animated)
      flipDir: 0,    // -1 flipping back, +1 flipping front
    }));
  }

  _computeLayout() {
    const topPad  = 72;
    const botPad  = 90;
    const sidePad = 14;
    const gapX    = 10;
    const gapY    = 10;
    const availW  = this.W - sidePad * 2 - gapX * (this.COLS - 1);
    const availH  = this.H - topPad - botPad - gapY * (this.ROWS - 1);
    this.cardW    = Math.floor(availW / this.COLS);
    this.cardH    = Math.floor(availH / this.ROWS);
    this.cards.forEach((c, i) => {
      const col = i % this.COLS;
      const row = Math.floor(i / this.COLS);
      c.x = sidePad + col * (this.cardW + gapX);
      c.y = topPad  + row * (this.cardH + gapY);
    });
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

    // Animate card flips
    this.cards.forEach(c => {
      if (c.flipDir !== 0) {
        c.flipT += c.flipDir * 0.12;
        if (c.flipT >= 1) { c.flipT = 1; c.flipDir = 0; }
        if (c.flipT <= 0) { c.flipT = 0; c.flipDir = 0; c.faceUp = false; }
      }
    });

    if (this.feedback) {
      this.feedback.alpha -= 0.028;
      this.feedback.y -= 0.8;
      if (this.feedback.alpha <= 0) this.feedback = null;
    }

    if (this.cheerActive) {
      this.cheerTimer++;
      if (this.cheerTimer > 5) { this.cheerTimer = 0; this.cheerFrame++; this.cheerCount++; }
      if (this.cheerCount > 18) { this.cheerActive = false; this.cheerCount = 0; }
    }

    this._draw();

    if (this.matched >= this.TOTAL / 2) { this._finish(true); return; }
    if (this.timeLeft <= 0)             { this._finish(false); return; }
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
    const barColor = this.timeLeft > 20 ? '#2ECC71' : this.timeLeft > 10 ? '#F1C40F' : '#E74C3C';
    ctx.fillStyle = barColor;
    ctx.fillRect(12, 14, barW, 14);
    ctx.strokeStyle = '#F1C40F';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 14, W - 24, 14);

    // HUD
    ctx.fillStyle = '#F1C40F';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.score}`, 16, 52);
    ctx.fillStyle = '#2ECC71';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.matched}/${this.TOTAL / 2} pairs`, W / 2, 52);
    ctx.fillStyle = '#aaa';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(this.timeLeft)}s`, W - 16, 52);

    // Instruction banner
    if (this.frameCount < 80) {
      const alpha = Math.min(1, (80 - this.frameCount) / 30);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0,0,0,0.78)';
      ctx.fillRect(0, H / 2 - 44, W, 88);
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Match the pairs!', W / 2, H / 2 - 6);
      ctx.fillStyle = '#aaa';
      ctx.font = '14px sans-serif';
      ctx.fillText('Tap two cards to flip', W / 2, H / 2 + 22);
      ctx.restore();
    }

    // Cards
    this.cards.forEach(c => this._drawCard(c));

    // Feedback
    if (this.feedback) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.feedback.alpha);
      ctx.fillStyle = this.feedback.color;
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.feedback.text, W / 2, this.feedback.y);
      ctx.restore();
    }

    // Stickman at bottom
    if (typeof drawStickman === 'function') {
      drawStickman(ctx, W / 2, H - 10, this.playerCostume, {
        scale: 0.7,
        running: false,
        jumping: this.cheerActive,
        frame: this.cheerFrame,
      });
    }
  }

  _drawCard(c) {
    const { ctx } = this;
    const { x, y } = c;
    const cW = this.cardW;
    const cH = this.cardH;
    const r  = 10;

    // Scale on x axis to simulate flip
    const scaleX = Math.abs(Math.cos(c.flipT * Math.PI));
    const midX   = x + cW / 2;

    ctx.save();
    ctx.translate(midX, y + cH / 2);
    ctx.scale(scaleX < 0.01 ? 0.01 : scaleX, 1);
    ctx.translate(-cW / 2, -cH / 2);

    const isFront = c.flipT >= 0.5;

    if (c.matched) {
      // Matched — glowing front
      ctx.beginPath();
      ctx.roundRect(0, 0, cW, cH, r);
      ctx.fillStyle = '#132213';
      ctx.fill();
      ctx.strokeStyle = '#2ECC71';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.font = `${cH * 0.48}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.sym, cW / 2, cH / 2);
    } else if (isFront) {
      // Face up — show symbol
      ctx.beginPath();
      ctx.roundRect(0, 0, cW, cH, r);
      ctx.fillStyle = '#131924';
      ctx.fill();
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.font = `${cH * 0.46}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.sym, cW / 2, cH / 2);
    } else {
      // Face down — decorative back
      ctx.beginPath();
      ctx.roundRect(0, 0, cW, cH, r);
      ctx.fillStyle = '#1a2a3a';
      ctx.fill();
      ctx.strokeStyle = '#3498DB';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Pattern
      ctx.strokeStyle = 'rgba(52,152,219,0.25)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(i * (cW / 4), 0);
        ctx.lineTo(i * (cW / 4), cH);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(241,196,15,0.7)';
      ctx.font = `${cH * 0.38}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', cW / 2, cH / 2);
    }

    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  _onTap(e) {
    e.preventDefault();
    if (this.finished || this.locked) return;
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

    for (const c of this.cards) {
      if (c.matched || c.faceUp) continue;
      if (tapX >= c.x && tapX <= c.x + this.cardW &&
          tapY >= c.y && tapY <= c.y + this.cardH) {
        // Flip card up
        c.faceUp  = true;
        c.flipDir = 1;
        if (typeof Audio !== 'undefined') Audio.playClick();
        this.flipped.push(c.index);

        if (this.flipped.length === 2) {
          this.locked = true;
          const [a, b] = this.flipped.map(i => this.cards[i]);
          if (a.pairId === b.pairId) {
            // Match!
            setTimeout(() => {
              a.matched = true;
              b.matched = true;
              this.matched++;
              this.score += 100;
              this.flipped = [];
              this.locked  = false;
              this.cheerActive = true;
              this.cheerCount  = 0;
              this.feedback = { text: '+100 MATCH!', color: '#2ECC71', alpha: 1.6, y: this.H * 0.38 };
              if (typeof Audio !== 'undefined') Audio.playCollect();
            }, 320);
          } else {
            // No match — flip back
            setTimeout(() => {
              a.flipDir = -1;
              b.flipDir = -1;
              this.flipped = [];
              this.locked  = false;
              this.feedback = { text: 'No match', color: '#E74C3C', alpha: 1.2, y: this.H * 0.38 };
              if (typeof Audio !== 'undefined') Audio.playWrong();
            }, 900);
          }
        }
        break;
      }
    }
  }

  _finish(allMatched) {
    if (this.finished) return;
    this.finished = true;
    cancelAnimationFrame(this._raf);
    this._cleanup();

    const winner = (allMatched || this.matched >= 3) ? 'player' : 'cpu';
    if (typeof Audio !== 'undefined') {
      winner === 'player' ? Audio.playWin() : Audio.playLose();
    }
    this._drawResult(winner, allMatched);
    setTimeout(() => {
      this.onComplete({ winner, score: this.score, playerName: this.playerName, gameName: 'MemoryMatch' });
    }, 2800);
  }

  _drawResult(winner, allMatched) {
    const { ctx, W, H } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(11,15,20,0.9)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = winner === 'player' ? '#F1C40F' : '#E74C3C';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(winner === 'player' ? 'YOU WIN!' : 'TIME UP!', W / 2, H / 2 - 36);
    ctx.fillStyle = '#fff';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Score: ${this.score}`, W / 2, H / 2 + 10);
    ctx.fillStyle = '#2ECC71';
    ctx.font = '16px sans-serif';
    ctx.fillText(`${this.matched}/${this.TOTAL / 2} pairs matched`, W / 2, H / 2 + 40);
    ctx.restore();
  }

  _cleanup() {
    this.canvas.removeEventListener('touchstart', this._boundTap);
    this.canvas.removeEventListener('mousedown',  this._boundTap);
  }
}
