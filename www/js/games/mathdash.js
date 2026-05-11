// MathDash — Solve math to run!
// Part of Stick Rush mobile party game suite.

class MathDash {
  constructor(canvas, playerName, playerCostume, onComplete) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.playerName    = playerName;
    this.playerCostume = playerCostume;
    this.onComplete    = onComplete;

    this.W = canvas.width;
    this.H = canvas.height;

    this.GAME_DURATION = 20;
    this.TRACK_LENGTH  = 100; // meters
    this.QUESTION_ADVANCE_PLAYER = 8;
    this.WRONG_ADVANCE_CPU       = 3;
    this.MAX_QUESTIONS = 10;

    this.score         = 0;
    this.frameCount    = 0;
    this.startTime     = null;
    this.timeLeft      = this.GAME_DURATION;
    this.finished      = false;

    this.playerPos = 0; // 0-100
    this.cpuPos    = 0;
    this.cpuTarget = 0;
    this.cpuMoveTimer = 0;

    this.questionIndex = 0;
    this.currentQ      = null;
    this.buttons       = [];

    this.feedback      = null; // { text, color, alpha }
    this.runFrame      = 0;
    this.runTimer      = 0;
    this.cpuRunFrame   = 0;
    this.cpuRunTimer   = 0;

    this.questionsAnswered = 0;
    this.questions = this._generateQuestions();
    this._loadQuestion();
    this._buildButtons();

    this._raf       = null;
    this._boundTap  = this._onTap.bind(this);
    this._boundLoop = this._loop.bind(this);
  }

  _generateQuestions() {
    const ops = ['+', '-', '*'];
    const qs  = [];
    for (let i = 0; i < this.MAX_QUESTIONS; i++) {
      const op = ops[i % 3];
      let a, b, answer;
      if (op === '+') { a = 5 + Math.floor(Math.random() * 45); b = 5 + Math.floor(Math.random() * 45); answer = a + b; }
      else if (op === '-') { a = 20 + Math.floor(Math.random() * 60); b = Math.floor(Math.random() * a); answer = a - b; }
      else { a = 2 + Math.floor(Math.random() * 10); b = 2 + Math.floor(Math.random() * 10); answer = a * b; }
      qs.push({ text: `${a} ${op} ${b} = ?`, answer });
    }
    return qs;
  }

  _loadQuestion() {
    if (this.questionIndex >= this.questions.length) {
      this.currentQ = null;
      return;
    }
    this.currentQ = this.questions[this.questionIndex];
    // Build 4 answer options including the correct one
    const correct = this.currentQ.answer;
    const opts = new Set([correct]);
    while (opts.size < 4) {
      const delta = Math.floor(Math.random() * 20) - 10;
      if (delta !== 0) opts.add(correct + delta);
    }
    this.currentQ.options = this._shuffle([...opts]);
  }

  _buildButtons() {
    const pad  = 12;
    const btnW = (this.W - pad * 5) / 4;
    const btnH = 58;
    const y    = this.H - btnH - pad;
    this.buttonMeta = { pad, btnW, btnH, y };
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

    // CPU slowly marches toward target
    this.cpuMoveTimer++;
    if (this.cpuMoveTimer > 4) {
      this.cpuMoveTimer = 0;
      if (this.cpuPos < this.cpuTarget) {
        this.cpuPos = Math.min(this.cpuTarget, this.cpuPos + 0.5);
      }
    }

    // Run animations
    this.runTimer++;
    if (this.runTimer > 6) { this.runTimer = 0; this.runFrame++; }
    this.cpuRunTimer++;
    if (this.cpuRunTimer > 7) { this.cpuRunTimer = 0; this.cpuRunFrame++; }

    if (this.feedback) {
      this.feedback.alpha -= 0.03;
      if (this.feedback.alpha <= 0) this.feedback = null;
    }

    this._draw();

    // Win condition
    if (this.playerPos >= this.TRACK_LENGTH) { this._finish('player'); return; }
    if (this.cpuPos    >= this.TRACK_LENGTH) { this._finish('cpu');    return; }
    if (this.timeLeft  <= 0 || (this.currentQ === null && this.questionsAnswered >= this.MAX_QUESTIONS)) {
      this._finish(this.playerPos >= this.cpuPos ? 'player' : 'cpu');
      return;
    }
    this._raf = requestAnimationFrame(this._boundLoop);
  }

  _draw() {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0B0F14';
    ctx.fillRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.55);
    sky.addColorStop(0, '#1a0d2e');
    sky.addColorStop(1, '#0B0F14');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.55);

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

    // Score / timer HUD
    ctx.fillStyle = '#F1C40F';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.score}`, 16, 52);
    ctx.fillStyle = '#aaa';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(this.timeLeft)}s  Q${this.questionsAnswered + 1}/${this.MAX_QUESTIONS}`, W - 16, 52);

    // Instruction banner
    if (this.frameCount < 80) {
      const alpha = Math.min(1, (80 - this.frameCount) / 30);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, H / 2 - 40, W, 80);
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Solve math to run!', W / 2, H / 2 + 8);
      ctx.restore();
    }

    // Track
    const trackY  = H * 0.52;
    const trackH  = 32;
    const trackX  = 24;
    const trackW  = W - 48;

    // Track background
    ctx.fillStyle = '#1a2a1a';
    ctx.fillRect(trackX, trackY, trackW, trackH);

    // Lane markings
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(trackX, trackY + trackH / 2);
    ctx.lineTo(trackX + trackW, trackY + trackH / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Finish line
    const finX = trackX + trackW;
    ctx.strokeStyle = '#F1C40F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(finX, trackY - 8);
    ctx.lineTo(finX, trackY + trackH + 8);
    ctx.stroke();
    ctx.fillStyle = '#F1C40F';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('100m', finX, trackY + trackH + 20);

    // Player progress bar
    const pBarW = (this.playerPos / this.TRACK_LENGTH) * trackW;
    ctx.fillStyle = '#2ECC71';
    ctx.fillRect(trackX, trackY, pBarW, trackH / 2 - 1);

    // CPU progress bar
    const cBarW = (this.cpuPos / this.TRACK_LENGTH) * trackW;
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(trackX, trackY + trackH / 2 + 1, cBarW, trackH / 2 - 1);

    // Labels
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#2ECC71';
    ctx.textAlign = 'left';
    ctx.fillText(`YOU ${Math.round(this.playerPos)}m`, trackX + 4, trackY + trackH / 2 - 4);
    ctx.fillStyle = '#E74C3C';
    ctx.fillText(`CPU ${Math.round(this.cpuPos)}m`, trackX + 4, trackY + trackH - 4);

    // Stickmen on track
    const playerSX = trackX + (this.playerPos / this.TRACK_LENGTH) * trackW;
    const cpuSX    = trackX + (this.cpuPos    / this.TRACK_LENGTH) * trackW;
    if (typeof drawStickman === 'function') {
      drawStickman(ctx, Math.min(playerSX, trackX + trackW - 10), trackY, this.playerCostume, {
        scale: 0.65, running: true, jumping: false, frame: this.runFrame,
      });
      // CPU stickman (plain)
      drawStickman(ctx, Math.min(cpuSX, trackX + trackW - 10), trackY + trackH / 2, null, {
        scale: 0.65, running: true, jumping: false, frame: this.cpuRunFrame,
      });
    }

    // Question panel
    const qPanelY = trackY + trackH + 32;
    const qPanelH = 64;
    if (this.currentQ) {
      ctx.fillStyle = '#131924';
      ctx.beginPath();
      ctx.roundRect(16, qPanelY, W - 32, qPanelH, 10);
      ctx.fill();
      ctx.strokeStyle = '#3498DB';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.currentQ.text, W / 2, qPanelY + 42);
    }

    // Answer buttons
    if (this.currentQ) {
      const { pad, btnW, btnH, y } = this.buttonMeta;
      const BTN_COLORS = ['#E74C3C','#3498DB','#2ECC71','#9B59B6'];
      this.currentQ.options.forEach((opt, i) => {
        const bx = pad + i * (btnW + pad);
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bx, y, btnW, btnH, 10);
        ctx.fillStyle = BTN_COLORS[i];
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(opt, bx + btnW / 2, y + btnH / 2);
        ctx.textBaseline = 'alphabetic';
        ctx.restore();
      });
    }

    // Feedback
    if (this.feedback) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.feedback.alpha);
      ctx.fillStyle = this.feedback.color;
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.feedback.text, W / 2, qPanelY - 16);
      ctx.restore();
    }
  }

  _onTap(e) {
    e.preventDefault();
    if (this.finished || !this.currentQ) return;
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
    if (this.finished || !this.currentQ) return;
    const { pad, btnW, btnH, y: btnY } = this.buttonMeta;
    this.currentQ.options.forEach((opt, i) => {
      const bx = pad + i * (btnW + pad);
      if (x >= bx && x <= bx + btnW && y >= btnY && y <= btnY + btnH) {
        if (opt === this.currentQ.answer) {
          this.playerPos = Math.min(this.TRACK_LENGTH, this.playerPos + this.QUESTION_ADVANCE_PLAYER);
          this.score += 100;
          this.feedback = { text: 'CORRECT! +8m', color: '#2ECC71', alpha: 1.4 };
          if (typeof Audio !== 'undefined') Audio.playCorrect();
        } else {
          this.cpuTarget = Math.min(this.TRACK_LENGTH, this.cpuTarget + this.WRONG_ADVANCE_CPU);
          this.feedback = { text: `WRONG! CPU +3m`, color: '#E74C3C', alpha: 1.4 };
          if (typeof Audio !== 'undefined') Audio.playWrong();
        }
        this.questionsAnswered++;
        this.questionIndex++;
        this._loadQuestion();
      }
    });
  }

  _finish(winner) {
    if (this.finished) return;
    this.finished = true;
    cancelAnimationFrame(this._raf);
    this._cleanup();
    if (typeof Audio !== 'undefined') {
      winner === 'player' ? Audio.playWin() : Audio.playLose();
    }
    this._drawResult(winner);
    setTimeout(() => {
      this.onComplete({ winner, score: this.score, playerName: this.playerName, gameName: 'MathDash' });
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
    ctx.fillText(winner === 'player' ? 'YOU WIN!' : 'CPU WINS', W / 2, H / 2 - 30);
    ctx.fillStyle = '#fff';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Score: ${this.score}`, W / 2, H / 2 + 16);
    ctx.fillStyle = '#aaa';
    ctx.font = '15px sans-serif';
    ctx.fillText(`${this.questionsAnswered} questions answered`, W / 2, H / 2 + 46);
    ctx.restore();
  }

  _cleanup() {
    this.canvas.removeEventListener('touchstart', this._boundTap);
    this.canvas.removeEventListener('mousedown',  this._boundTap);
  }
}
