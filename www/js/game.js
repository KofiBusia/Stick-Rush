// ═══════════════════════════════════════════════════════
//  STICK RUSH — MAIN GAME CONTROLLER  (multiplayer v2)
// ═══════════════════════════════════════════════════════

// ── STORAGE ────────────────────────────────────────────
const Store = {
  KEY: 'stickrush_v1',
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; } catch(e) { return {}; }
  },
  set(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); } catch(e) {}
  },
  update(patch) {
    this.set({ ...this.get(), ...patch });
  },
  clear() { localStorage.removeItem(this.KEY); }
};

// ── PROFANITY FILTER ────────────────────────────────────
const BAD_WORDS = ['shit','fuck','ass','damn','bitch','crap','hell'];
function sanitizeName(name) {
  name = name.trim().replace(/[^a-zA-Z0-9_ .-]/g, '').slice(0, 12);
  const lower = name.toLowerCase();
  for (const w of BAD_WORDS) if (lower.includes(w)) return 'Player';
  return name || 'Player';
}

// ── GAME LABELS ─────────────────────────────────────────
const GAME_LABELS = {
  sprint:      '🏃 Sprint Dash',
  jump:        '🦘 Jump Fever',
  reflex:      '🎯 Reflex Blaster',
  colorblitz:  '🎨 Color Blitz',
  balloonpop:  '🎈 Balloon Pop',
  mathdash:    '➗ Math Dash',
  memorymatch: '🃏 Memory Match',
  rhythmtap:   '🎵 Rhythm Tap',
};

// ── ROUND DEFINITIONS ───────────────────────────────────
const ROUND_GAMES = {
  1: ['sprint', 'jump', 'reflex'],
  2: ['colorblitz', 'balloonpop', 'mathdash'],
  3: ['memorymatch', 'rhythmtap', 'sprint', 'jump'],
};

// ── MULTIPLAYER COLORS ──────────────────────────────────
const PLAYER_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#9B59B6'];
const PLAYER_COSTUMES = ['redathlete', 'bluestar', 'greenrunner', 'purpleace'];

// ── GAME STATE ──────────────────────────────────────────
const Game = {
  // Single player
  player: { name: 'Player', age: 12, costume: 'default', tier: 'tier1' },
  // Multiplayer
  players: [],
  playerCount: 1,
  currentPlayerIdx: 0,
  currentGameIdx: 0,
  // Round
  currentRound: 1,
  roundScores: [],
  totalScore: 0,
  miniGameResults: [],
  currentMiniGame: 0,
  // Q&A (single player)
  qaResults: [],
  qaScore: 0,
  currentQAIndex: 0,
  currentQuestions: [],
  // Misc
  leaderboard: [],
  roundUnlocked: {},
  audioOn: true,
};

// ── SCREEN MANAGER ──────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); window.scrollTo(0,0); }
}

// ── INIT ────────────────────────────────────────────────
function init() {
  const saved = Store.get();
  if (saved.player) Game.player = { ...Game.player, ...saved.player };
  if (saved.totalScore) Game.totalScore = saved.totalScore;
  if (saved.leaderboard) Game.leaderboard = saved.leaderboard;
  if (saved.roundUnlocked) Game.roundUnlocked = saved.roundUnlocked;
  renderSplash();
}

// ── SPLASH ──────────────────────────────────────────────
function renderSplash() {
  showScreen('screen-splash');
  const canvas = document.getElementById('splash-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 360;
  const H = canvas.height = 220;
  let frame = 0;
  const costumes = ['redathlete','bluestar','greenrunner','purpleace','ninjastrike'];
  const positions = [W*0.15, W*0.3, W*0.5, W*0.7, W*0.85];
  function drawSplash() {
    ctx.clearRect(0,0,W,H);
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#0B3D91'); bg.addColorStop(1,'#0d0d0d');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#333'; ctx.fillRect(0, H-30, W, 30);
    ctx.fillStyle = '#F1C40F'; ctx.fillRect(0, H-30, W, 3);
    positions.forEach((x,i) => {
      drawStickman(ctx, x + Math.sin((frame + i*20)*0.04)*8, H-30, costumes[i], { scale:0.75, running:true, frame: frame+i*15 });
    });
    frame++;
    requestAnimationFrame(drawSplash);
  }
  drawSplash();
  setTimeout(() => showScreen('screen-menu'), 2800);
}

// ── MAIN MENU ────────────────────────────────────────────
function goMenu() {
  showScreen('screen-menu');
  const saved = Store.get();
  document.getElementById('menu-score').textContent = `Total Score: ⭐ ${saved.totalScore || 0}`;
}

// ── PLAYER COUNT SELECTION ───────────────────────────────
function goPlayerCount() {
  Audio.playClick();
  showScreen('screen-player-count');
}

function startSetup(count) {
  Audio.playClick();
  Game.playerCount = count;
  if (count === 1) {
    goSetup();
  } else {
    goMultiplayerSetup(count);
  }
}

// ── SINGLE PLAYER SETUP ──────────────────────────────────
function goSetup() {
  Audio.playClick();
  showScreen('screen-setup');
  renderCostumeGrid();
  const saved = Store.get();
  if (saved.player) {
    document.getElementById('player-name').value = saved.player.name || '';
    document.getElementById('player-age').value  = saved.player.age  || 12;
    selectCostume(saved.player.costume || 'default');
  }
}

function renderCostumeGrid() {
  const saved = Store.get();
  const playerData = {
    totalScore: saved.totalScore || 0,
    highestRound: saved.highestRound || 0,
    totalQACorrect: saved.totalQACorrect || 0,
    minigameWins: saved.minigameWins || 0,
    tournamentWins: saved.tournamentWins || 0,
    epicUnlocked: saved.epicUnlocked || false,
    legendaryUnlocked: saved.legendaryUnlocked || false,
    mythicEvent: saved.mythicEvent || false,
  };
  const unlocked = getUnlockedCostumes(playerData);
  const grid = document.getElementById('costume-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const tierOrder = ['Common','Rare','Epic','Legendary','Mythic'];
  tierOrder.forEach(tier => {
    const inTier = Object.values(COSTUMES).filter(c => c.tier === tier);
    if (inTier.length === 0) return;
    const header = document.createElement('div');
    header.className = 'costume-tier-header';
    const ti = COSTUME_TIERS[tier];
    header.innerHTML = `<span style="color:${ti.color}">${ti.emoji} ${ti.label}</span>`;
    grid.appendChild(header);
    inTier.forEach(c => {
      const isUnlocked = unlocked.includes(c.id);
      const div = document.createElement('div');
      div.className = `costume-item ${isUnlocked ? '' : 'locked'} ${c.id === (Game.player.costume || 'default') ? 'selected' : ''}`;
      div.id = `ci-${c.id}`;
      const preview = document.createElement('canvas');
      preview.width = 56; preview.height = 72;
      const pctx = preview.getContext('2d');
      pctx.fillStyle = '#1A252F'; pctx.fillRect(0,0,56,72);
      if (isUnlocked) {
        drawStickman(pctx, 28, 65, c, { scale: 0.55 });
      } else {
        pctx.fillStyle = 'rgba(0,0,0,0.6)'; pctx.fillRect(0,0,56,72);
        pctx.fillStyle = '#888'; pctx.font = '22px Arial'; pctx.textAlign='center'; pctx.fillText('🔒',28,42);
      }
      div.appendChild(preview);
      const label = document.createElement('div');
      label.className = 'costume-label';
      label.textContent = c.name;
      div.appendChild(label);
      if (!isUnlocked) {
        const req = document.createElement('div');
        req.className = 'costume-req';
        req.textContent = c.unlockReq;
        div.appendChild(req);
      }
      if (isUnlocked) div.onclick = () => selectCostume(c.id);
      grid.appendChild(div);
    });
  });
}

function selectCostume(id) {
  Game.player.costume = id;
  document.querySelectorAll('.costume-item').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById(`ci-${id}`);
  if (el) el.classList.add('selected');
  Audio.playClick();
  updateSetupPreview();
}

function updateSetupPreview() {
  const canvas = document.getElementById('preview-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const bg = ctx.createLinearGradient(0,0,0,canvas.height);
  bg.addColorStop(0,'#1A252F'); bg.addColorStop(1,'#0B0F14');
  ctx.fillStyle = bg; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#333'; ctx.fillRect(0, canvas.height-20, canvas.width, 20);
  ctx.fillStyle = '#F1C40F'; ctx.fillRect(0, canvas.height-20, canvas.width, 2);
  drawStickman(ctx, canvas.width/2, canvas.height-20, Game.player.costume, { scale:1.3 });
  const c = COSTUMES[Game.player.costume] || COSTUMES.default;
  ctx.fillStyle = '#F1C40F'; ctx.font = 'bold 11px Inter'; ctx.textAlign='center';
  ctx.fillText(c.name, canvas.width/2, 14);
  const ti = COSTUME_TIERS[c.tier];
  ctx.fillStyle = ti.color; ctx.font = '10px Inter';
  ctx.fillText(ti.emoji + ' ' + ti.label, canvas.width/2, 28);
}

function saveSetupAndPlay() {
  const name = sanitizeName(document.getElementById('player-name')?.value || 'Player');
  const age  = parseInt(document.getElementById('player-age')?.value) || 12;
  Game.player.name = name;
  Game.player.age  = age;
  Game.player.tier = getTierFromAge(age);
  Game.players     = [{ name, age, costume: Game.player.costume, tier: Game.player.tier, scores: [], totalScore: 0 }];
  Game.playerCount = 1;
  Store.update({ player: Game.player });
  Audio.playClick();
  startRound(1);
}

// ── MULTIPLAYER SETUP ────────────────────────────────────
function goMultiplayerSetup(count) {
  showScreen('screen-mp-setup');
  const container = document.getElementById('mp-players-container');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const slot = document.createElement('div');
    slot.style.cssText = `
      background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
      border-radius:14px;padding:16px;margin-bottom:12px;
    `;
    slot.innerHTML = `
      <div style="font-weight:800;font-size:15px;color:${PLAYER_COLORS[i]};margin-bottom:10px;">
        Player ${i+1}
      </div>
      <div style="display:flex;gap:12px;">
        <div style="flex:2;">
          <label style="font-size:11px;color:#888;display:block;margin-bottom:4px;">Name</label>
          <input type="text" id="mp-name-${i}" maxlength="10" placeholder="Player ${i+1}"
            value="Player ${i+1}"
            style="width:100%;box-sizing:border-box;background:#1a2533;border:1px solid #2a3a4a;
                   border-radius:8px;color:#fff;padding:8px 10px;font-size:14px;"/>
        </div>
        <div style="flex:1;">
          <label style="font-size:11px;color:#888;display:block;margin-bottom:4px;">Age</label>
          <select id="mp-age-${i}"
            style="width:100%;background:#1a2533;border:1px solid #2a3a4a;border-radius:8px;
                   color:#fff;padding:8px 6px;font-size:14px;">
            ${[8,9,10,11,12,13,14,15,16].map(a => `<option value="${a}"${a===12?' selected':''}>${a}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
    container.appendChild(slot);
  }
}

function saveMultiplayerAndPlay() {
  Game.players = [];
  for (let i = 0; i < Game.playerCount; i++) {
    const name = sanitizeName(document.getElementById(`mp-name-${i}`)?.value || `Player ${i+1}`);
    const age  = parseInt(document.getElementById(`mp-age-${i}`)?.value) || 12;
    Game.players.push({
      name,
      age,
      costume: PLAYER_COSTUMES[i] || 'default',
      tier: getTierFromAge(age),
      scores: [],
      totalScore: 0,
    });
  }
  Audio.playClick();
  startMultiplayerRound(1);
}

// ── SINGLE PLAYER ROUND ──────────────────────────────────
function startRound(roundNum) {
  const saved = Store.get();
  const maxFree = 1;
  if (roundNum > maxFree && !saved.roundUnlocked?.[roundNum]) {
    showPaymentScreen(roundNum);
    return;
  }
  Game.currentRound    = roundNum;
  Game.miniGameResults = [];
  Game.currentMiniGame = 0;
  Game.qaResults       = [];
  Game.qaScore         = 0;
  Game.roundScores     = [];
  showRoundIntro(roundNum);
}

function showRoundIntro(roundNum) {
  showScreen('screen-round-intro');
  const isFree = roundNum <= 1;
  document.getElementById('ri-round-num').textContent  = `ROUND ${roundNum}`;
  document.getElementById('ri-free-badge').style.display = isFree ? 'inline-flex' : 'none';
  document.getElementById('ri-tier').textContent = `Tier: ${Game.player.tier.replace('tier','Tier ')} | Ages ${Game.player.tier==='tier1'?'8-10':Game.player.tier==='tier2'?'11-13':'14-16'}`;
  const games = ROUND_GAMES[roundNum] || ROUND_GAMES[1];
  document.getElementById('ri-games-list').innerHTML = games.map(g =>
    `<li>${GAME_LABELS[g] || g}</li>`
  ).join('');
  document.getElementById('ri-start-btn').onclick = () => { Audio.playClick(); startMiniGames(); };
  Audio.cheer('round_start', '', roundNum);
}

function startMiniGames() {
  Game.currentMiniGame = 0;
  launchMiniGame(0);
}

function createMiniGame(gameType, canvas, playerName, costume, onComplete) {
  switch (gameType) {
    case 'sprint':      return new SprintDash(canvas, playerName, costume, onComplete);
    case 'jump':        return new JumpFever(canvas, playerName, costume, onComplete);
    case 'reflex':      return new ReflexBlaster(canvas, playerName, costume, onComplete);
    case 'colorblitz':  return new ColorBlitz(canvas, playerName, costume, onComplete);
    case 'balloonpop':  return new BalloonPop(canvas, playerName, costume, onComplete);
    case 'mathdash':    return new MathDash(canvas, playerName, costume, onComplete);
    case 'memorymatch': return new MemoryMatch(canvas, playerName, costume, onComplete);
    case 'rhythmtap':   return new RhythmTap(canvas, playerName, costume, onComplete);
    default:            return new SprintDash(canvas, playerName, costume, onComplete);
  }
}

function launchMiniGame(index) {
  const games = ROUND_GAMES[Game.currentRound] || ROUND_GAMES[1];
  if (index >= games.length) { startQA(); return; }
  showScreen('screen-game');
  const canvas = document.getElementById('game-canvas');
  resizeCanvas(canvas);
  const gameType = games[index];
  const onComplete = (result) => {
    Game.miniGameResults.push(result);
    Game.roundScores.push(result.score);
    if (result.winner === 'player') Store.update({ minigameWins: (Store.get().minigameWins || 0) + 1 });
    showMiniGameResult(result, () => launchMiniGame(index + 1));
  };
  const miniGame = createMiniGame(gameType, canvas, Game.player.name, Game.player.costume, onComplete);
  document.getElementById('game-label').textContent = GAME_LABELS[gameType] || gameType;
  document.getElementById('game-num').textContent   = `Game ${index+1} of ${games.length}`;
  showCountdown(canvas, () => miniGame.start());
}

function resizeCanvas(canvas) {
  const container = canvas.parentElement;
  canvas.width  = container.offsetWidth  || 360;
  canvas.height = container.offsetHeight || 420;
}

function showCountdown(canvas, onDone) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let count = 3;
  const tick = () => {
    ctx.clearRect(0,0,W,H);
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#0B3D91'); bg.addColorStop(1,'#000');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#F1C40F';
    ctx.font = `bold ${count > 0 ? 100 : 80}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText(count > 0 ? count : 'GO!', W/2, H/2+30);
    if (count > 0) Audio.playCountdown();
    else           Audio.playCountdownGo();
    count--;
    if (count >= 0) setTimeout(tick, 800);
    else            setTimeout(onDone, 400);
  };
  tick();
}

function showMiniGameResult(result, onNext) {
  showScreen('screen-mg-result');
  document.getElementById('mgr-title').textContent = result.winner === 'player' ? '🏆 You Won!' : '❌ CPU Wins';
  document.getElementById('mgr-title').style.color = result.winner === 'player' ? '#2ECC71' : '#E74C3C';
  document.getElementById('mgr-game').textContent  = result.gameName || '';
  document.getElementById('mgr-score').textContent = `+${result.score} pts`;
  document.getElementById('mgr-player').textContent = result.playerName || '';
  const total = Game.playerCount > 1
    ? `Player score: ${result.score} pts`
    : `Round total: ${Game.roundScores.reduce((a,b)=>a+b,0)} pts`;
  document.getElementById('mgr-total').textContent = total;
  document.getElementById('mgr-next-btn').textContent = 'Continue →';
  document.getElementById('mgr-next-btn').onclick = () => { Audio.playClick(); onNext(); };
}

// ── Q&A (single player only) ─────────────────────────────
function startQA() {
  Game.currentQuestions = getQuestions(Game.player.tier, 3);
  Game.currentQAIndex   = 0;
  Game.qaScore          = 0;
  Game.qaResults        = [];
  showNextQuestion();
}

function showNextQuestion() {
  showScreen('screen-qa');
  const idx = Game.currentQAIndex;
  if (idx >= Game.currentQuestions.length) { showRoundResults(); return; }
  const q = Game.currentQuestions[idx];
  document.getElementById('qa-progress').textContent  = `Question ${idx+1} of ${Game.currentQuestions.length}`;
  document.getElementById('qa-subject').textContent   = `📚 ${q.subject}`;
  document.getElementById('qa-subject').style.background = q.subject === 'Math' ? '#2980B9' : '#8E44AD';
  document.getElementById('qa-question').textContent  = q.q;
  document.getElementById('qa-pts').textContent       = `+${q.points} pts for correct answer`;

  let timeLeft = 15;
  const timerEl = document.getElementById('qa-timer');
  const barEl   = document.getElementById('qa-timer-bar');
  let answered  = false;
  const timerInterval = setInterval(() => {
    if (answered) { clearInterval(timerInterval); return; }
    timeLeft -= 0.1;
    if (timerEl) timerEl.textContent = `⏱ ${Math.ceil(timeLeft)}s`;
    if (barEl)   barEl.style.width   = `${(timeLeft/15)*100}%`;
    if (timeLeft <= 0) { clearInterval(timerInterval); if (!answered) submitAnswer(-1, q); }
  }, 100);

  const optContainer = document.getElementById('qa-options');
  optContainer.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'qa-option-btn';
    btn.innerHTML = `<span class="qa-opt-letter">${String.fromCharCode(65+i)}</span> ${opt}`;
    btn.onclick = () => {
      if (answered) return;
      answered = true;
      clearInterval(timerInterval);
      submitAnswer(i, q, btn, optContainer);
    };
    optContainer.appendChild(btn);
  });
}

function submitAnswer(chosenIndex, q, btn, optContainer) {
  const correct = chosenIndex === q.answer;
  if (correct) { Game.qaScore += q.points; Audio.playCorrect(); Audio.cheer('qa_correct'); }
  else         { Audio.playWrong(); Audio.cheer('qa_wrong'); }
  Game.qaResults.push({ q, chosen: chosenIndex, correct });
  if (correct) Store.update({ totalQACorrect: (Store.get().totalQACorrect || 0) + 1 });
  if (optContainer) {
    Array.from(optContainer.children).forEach((b, i) => {
      if (i === q.answer) b.classList.add('correct');
      else if (i === chosenIndex && !correct) b.classList.add('wrong');
      b.disabled = true;
    });
  }
  Game.currentQAIndex++;
  setTimeout(() => showNextQuestion(), 1800);
}

// ── SINGLE PLAYER RESULTS ────────────────────────────────
function showRoundResults() {
  showScreen('screen-results');
  const mgTotal    = Game.roundScores.reduce((a,b)=>a+b,0);
  const qaTotal    = Game.qaScore;
  const roundTotal = mgTotal + qaTotal;
  const qaCorrect  = Game.qaResults.filter(r=>r.correct).length;
  const mgWins     = Game.miniGameResults.filter(r=>r.winner==='player').length;
  document.getElementById('res-round').textContent    = `Round ${Game.currentRound} Complete!`;
  document.getElementById('res-mg-score').textContent = `🎮 Mini-games: +${mgTotal} pts (${mgWins}/${Game.miniGameResults.length} wins)`;
  document.getElementById('res-qa-score').textContent = `📚 Q&A Bonus: +${qaTotal} pts (${qaCorrect}/${Game.currentQuestions.length} correct)`;
  document.getElementById('res-total').textContent    = `⭐ TOTAL: ${roundTotal} pts`;

  Game.totalScore = (Store.get().totalScore || 0) + roundTotal;
  Store.update({ totalScore: Game.totalScore, highestRound: Math.max(Store.get().highestRound || 0, Game.currentRound) });
  if (mgWins >= 2) Audio.playWin();
  Audio.cheer('round_winner', Game.player.name);

  const lb = Store.get().leaderboard || [];
  lb.push({ name: Game.player.name, score: roundTotal, round: Game.currentRound, date: new Date().toLocaleDateString() });
  lb.sort((a,b)=>b.score-a.score);
  Store.update({ leaderboard: lb.slice(0, 20) });

  renderNewCostumeUnlocks();

  const nextRound = Game.currentRound + 1;
  const saved = Store.get();
  const nextBtn = document.getElementById('res-next-btn');
  if (nextBtn) {
    if (ROUND_GAMES[nextRound]) {
      if (saved.roundUnlocked?.[nextRound]) {
        nextBtn.textContent = `▶ Play Round ${nextRound}`;
        nextBtn.onclick     = () => startRound(nextRound);
      } else {
        nextBtn.innerHTML = `🔓 Unlock Round ${nextRound} — <span style="color:#F1C40F">GHS 5</span>`;
        nextBtn.onclick   = () => showPaymentScreen(nextRound);
      }
    } else {
      nextBtn.textContent = '🏠 Back to Menu';
      nextBtn.onclick     = () => goMenu();
    }
  }
}

function renderNewCostumeUnlocks() {
  const saved = Store.get();
  const playerData = { totalScore: saved.totalScore || 0, highestRound: saved.highestRound || 0, totalQACorrect: saved.totalQACorrect || 0, minigameWins: saved.minigameWins || 0, tournamentWins: 0 };
  const unlocked = getUnlockedCostumes(playerData);
  const container = document.getElementById('res-costumes');
  if (!container) return;
  container.innerHTML = '';
  const recent = unlocked.filter(id => { const c = COSTUMES[id]; return c && c.tier !== 'Common'; }).slice(0,3);
  if (recent.length > 0) {
    container.innerHTML = '<p style="color:#F1C40F;font-weight:700;margin-bottom:8px;">🎁 Costumes Unlocked!</p>';
    recent.forEach(id => {
      const c  = COSTUMES[id];
      const ti = COSTUME_TIERS[c.tier];
      const mini = document.createElement('canvas');
      mini.width = 50; mini.height = 65;
      const mctx = mini.getContext('2d');
      mctx.fillStyle = '#1A252F'; mctx.fillRect(0,0,50,65);
      drawStickman(mctx, 25, 58, c, { scale: 0.5 });
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;margin:4px;';
      const lbl = document.createElement('span');
      lbl.style.cssText = `font-size:10px;color:${ti.color};font-weight:700;margin-top:2px;`;
      lbl.textContent = c.name;
      wrap.appendChild(mini); wrap.appendChild(lbl);
      container.appendChild(wrap);
    });
  }
}

// ── MULTIPLAYER ROUND ────────────────────────────────────
function startMultiplayerRound(roundNum) {
  const saved = Store.get();
  if (roundNum > 1 && !saved.roundUnlocked?.[roundNum]) {
    showPaymentScreen(roundNum);
    return;
  }
  Game.currentRound     = roundNum;
  Game.currentGameIdx   = 0;
  Game.currentPlayerIdx = 0;
  Game.players.forEach(p => { p.scores = []; p.totalScore = 0; });
  showRoundIntroMP(roundNum);
}

function showRoundIntroMP(roundNum) {
  showScreen('screen-round-intro');
  document.getElementById('ri-round-num').textContent  = `ROUND ${roundNum}`;
  document.getElementById('ri-free-badge').style.display = roundNum <= 1 ? 'inline-flex' : 'none';
  document.getElementById('ri-tier').textContent = `${Game.playerCount} Players · Hot-Seat`;
  const games = ROUND_GAMES[roundNum] || ROUND_GAMES[1];
  document.getElementById('ri-games-list').innerHTML = games.map(g =>
    `<li>${GAME_LABELS[g] || g}</li>`
  ).join('');
  document.getElementById('ri-start-btn').onclick = () => { Audio.playClick(); launchNextPlayerTurn(); };
  Audio.cheer('round_start', '', roundNum);
}

// ── MULTIPLAYER GAME TURNS ───────────────────────────────
function launchNextPlayerTurn() {
  const games  = ROUND_GAMES[Game.currentRound] || ROUND_GAMES[1];
  const player = Game.players[Game.currentPlayerIdx];
  const gameType = games[Game.currentGameIdx];
  showPlayerTransition(player, gameType, games.length, () => {
    _launchPlayerTurn(gameType, player);
  });
}

function showPlayerTransition(player, gameType, totalGames, onReady) {
  showScreen('screen-player-turn');
  document.getElementById('pt-player-name').textContent = player.name;
  document.getElementById('pt-player-name').style.color = PLAYER_COLORS[Game.currentPlayerIdx] || '#F1C40F';
  document.getElementById('pt-game-name').textContent   = GAME_LABELS[gameType] || gameType;
  document.getElementById('pt-game-num').textContent    = `Game ${Game.currentGameIdx + 1} of ${totalGames}`;

  const canvas = document.getElementById('pt-canvas');
  if (canvas && typeof drawStickman === 'function') {
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth || 120;
    const H = canvas.height = 160;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#1A252F'); bg.addColorStop(1, '#0B0F14');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#222'; ctx.fillRect(0, H - 20, W, 20);
    ctx.fillStyle = '#F1C40F'; ctx.fillRect(0, H - 20, W, 2);
    drawStickman(ctx, W / 2, H - 20, player.costume, { scale: 1.15 });
  }

  document.getElementById('pt-ready-btn').onclick = () => {
    Audio.playClick();
    onReady();
  };
}

function _launchPlayerTurn(gameType, player) {
  showScreen('screen-game');
  const canvas = document.getElementById('game-canvas');
  resizeCanvas(canvas);
  const games = ROUND_GAMES[Game.currentRound] || ROUND_GAMES[1];
  document.getElementById('game-label').textContent = GAME_LABELS[gameType] || gameType;
  document.getElementById('game-num').textContent   = `${player.name} · Game ${Game.currentGameIdx + 1} of ${games.length}`;

  const onComplete = (result) => {
    player.scores.push(result.score);
    player.totalScore += result.score;
    if (result.winner === 'player') Store.update({ minigameWins: (Store.get().minigameWins || 0) + 1 });
    showMiniGameResult(result, advanceTurn);
  };

  const miniGame = createMiniGame(gameType, canvas, player.name, player.costume, onComplete);
  showCountdown(canvas, () => miniGame.start());
}

function advanceTurn() {
  const games = ROUND_GAMES[Game.currentRound] || ROUND_GAMES[1];
  Game.currentPlayerIdx++;

  if (Game.currentPlayerIdx < Game.playerCount) {
    launchNextPlayerTurn();
  } else {
    Game.currentGameIdx++;
    Game.currentPlayerIdx = 0;
    if (Game.currentGameIdx < games.length) {
      launchNextPlayerTurn();
    } else {
      showMultiplayerResults();
    }
  }
}

function showMultiplayerResults() {
  showScreen('screen-mp-results');

  const ranked = [...Game.players].sort((a, b) => b.totalScore - a.totalScore);
  const games  = ROUND_GAMES[Game.currentRound] || ROUND_GAMES[1];

  const lb = Store.get().leaderboard || [];
  ranked.forEach(p => lb.push({ name: p.name, score: p.totalScore, round: Game.currentRound, date: new Date().toLocaleDateString() }));
  lb.sort((a, b) => b.score - a.score);
  Store.update({ leaderboard: lb.slice(0, 20) });

  const container = document.getElementById('mp-results-list');
  if (!container) return;
  container.innerHTML = '';

  const medals = ['🥇','🥈','🥉','4️⃣'];
  ranked.forEach((p, i) => {
    const row = document.createElement('div');
    row.style.cssText = `
      display:flex;align-items:center;gap:14px;
      background:${i===0?'rgba(241,196,15,0.08)':'rgba(255,255,255,0.03)'};
      border:1px solid ${i===0?'rgba(241,196,15,0.25)':'rgba(255,255,255,0.06)'};
      border-radius:14px;padding:14px 16px;margin-bottom:10px;
    `;
    const breakdown = p.scores.map((s, j) => `${(GAME_LABELS[games[j]]||'').split(' ')[1]||'G'+(j+1)}: ${s}`).join(' · ');
    row.innerHTML = `
      <div style="font-size:26px">${medals[i]||('#'+(i+1))}</div>
      <div style="flex:1">
        <div style="font-weight:800;font-size:16px;color:${i===0?'#F1C40F':'#fff'}">${p.name}</div>
        <div style="font-size:11px;color:#666;margin-top:2px">${breakdown}</div>
      </div>
      <div style="font-size:22px;font-weight:900;color:${i===0?'#F1C40F':'#aaa'}">${p.totalScore}</div>
    `;
    container.appendChild(row);
  });

  if (ranked[0]) Audio.cheer('round_winner', ranked[0].name);
}

// ── PAYMENT ──────────────────────────────────────────────
function showPaymentScreen(roundNum) {
  showScreen('screen-payment');
  document.getElementById('pay-round').textContent  = roundNum;
  document.getElementById('pay-player').textContent = Game.playerCount > 1 ? `${Game.playerCount} Players` : Game.player.name;
  document.getElementById('pay-preview').innerHTML  = `
    <div style="margin:12px 0;padding:12px;background:rgba(255,255,255,0.05);border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
      <p style="color:#F1C40F;font-weight:700;">What you unlock:</p>
      <ul style="color:#aaa;font-size:13px;margin-top:8px;list-style:none;padding:0;line-height:1.9;">
        <li>🎮 New mini-games (harder & faster)</li>
        <li>📚 Educational questions (${roundNum >= 3 ? 'Advanced' : 'Intermediate'})</li>
        <li>👕 New Epic costume unlocks</li>
        <li>🏆 Tournament eligibility</li>
      </ul>
    </div>
    <div style="background:#27AE60;color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;">
      💚 Only GHS 5 = ~$0.40 USD. Less than a sachet of pure water!
    </div>
  `;
  document.getElementById('pay-demo-btn').onclick = () => {
    const saved = Store.get();
    const unlocked = { ...(saved.roundUnlocked || {}), [roundNum]: true };
    Store.update({ roundUnlocked: unlocked });
    showDemoUnlockSuccess(roundNum);
  };
}

function showDemoUnlockSuccess(roundNum) {
  const el = document.getElementById('pay-success');
  if (el) {
    el.style.display = 'block';
    el.innerHTML = `<p style="color:#2ECC71;font-size:18px;font-weight:800;">✅ Round ${roundNum} Unlocked!</p><p style="color:#aaa;font-size:13px;">Starting in 2 seconds...</p>`;
    Audio.playWin();
    setTimeout(() => {
      if (Game.playerCount > 1) startMultiplayerRound(roundNum);
      else                      startRound(roundNum);
    }, 2000);
  }
}

// ── LEADERBOARD ──────────────────────────────────────────
function showLeaderboard() {
  showScreen('screen-leaderboard');
  const lb = Store.get().leaderboard || [];
  const tbody = document.getElementById('lb-body');
  if (!tbody) return;
  tbody.innerHTML = lb.length === 0
    ? '<tr><td colspan="4" style="text-align:center;color:#666;padding:20px;">No scores yet — play a round!</td></tr>'
    : lb.slice(0,10).map((e,i) => `
        <tr>
          <td>${i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}</td>
          <td style="font-weight:700">${e.name}</td>
          <td style="color:#F1C40F;font-weight:700">${e.score}</td>
          <td style="color:#888;font-size:12px">R${e.round} · ${e.date}</td>
        </tr>`).join('');
}

// ── ENTRYPOINT ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', init);
