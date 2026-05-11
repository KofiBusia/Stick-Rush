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
  whackmole:   '🔨 Whack-A-Mole',
  coinrush:    '💰 Coin Rush',
};

// ── ROUND DEFINITIONS ───────────────────────────────────
const ROUND_GAMES = {
  1: ['sprint', 'jump', 'reflex'],
  2: ['colorblitz', 'balloonpop', 'mathdash'],
  3: ['memorymatch', 'rhythmtap', 'sprint', 'jump'],
  4: ['whackmole', 'coinrush', 'reflex', 'colorblitz'],
  5: ['sprint', 'jump', 'whackmole', 'coinrush', 'mathdash'],
};

// ── MULTIPLAYER COLORS ──────────────────────────────────
const PLAYER_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#9B59B6'];
const PLAYER_COSTUMES = ['kofi', 'ama', 'kwame', 'abena'];

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

  // Apply saved orientation preference
  try {
    const orient = localStorage.getItem('stickrush_orientation') || 'auto';
    applyOrientation(orient);
  } catch(e) {}

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
let _pcRaf = null, _pcFrame = 0;

function goPlayerCount() {
  Audio.playClick();
  if (_pcRaf) { cancelAnimationFrame(_pcRaf); _pcRaf = null; }
  showScreen('screen-player-count');
  _startPCAnimations();
}

function _startPCAnimations() {
  const cards = [
    { id: 'pc-cv-1', costume: 'default',     col: '#F1C40F' },
    { id: 'pc-cv-2', costume: 'bluestar',    col: '#3498DB' },
    { id: 'pc-cv-3', costume: 'greenrunner', col: '#2ECC71' },
    { id: 'pc-cv-4', costume: 'purpleace',   col: '#9B59B6' },
  ];
  const draw = () => {
    _pcFrame++;
    cards.forEach(({ id, costume, col }) => {
      const cv = document.getElementById(id);
      if (!cv) return;
      const ctx = cv.getContext('2d');
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#1a2535'); bg.addColorStop(1, '#0B0F14');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W/2, H, 0, W/2, H, W * 0.65);
      glow.addColorStop(0, col + '55'); glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#2a3a4a'; ctx.fillRect(0, H - 14, W, 14);
      ctx.fillStyle = col; ctx.fillRect(0, H - 14, W, 2);
      const bob = Math.sin(_pcFrame * 0.08) * 2.5;
      drawStickman(ctx, W/2, H - 14 + bob, costume, { scale: 0.62, running: true, frame: _pcFrame });
    });
    _pcRaf = requestAnimationFrame(draw);
  };
  draw();
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
  // Cancel any running grid animation
  if (window._gridAnimId) { cancelAnimationFrame(window._gridAnimId); window._gridAnimId = null; }
  window._gridPreviews = [];

  const saved = Store.get();
  const playerData = {
    totalScore: saved.totalScore || 0,
    highestRound: saved.highestRound || 0,
    totalQACorrect: saved.totalQACorrect || 0,
    minigameWins: saved.minigameWins || 0,
    tournamentWins: saved.tournamentWins || 0,
  };
  const unlocked = getUnlockedCostumes(playerData);
  const grid = document.getElementById('costume-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const tierOrder = ['Common','Rare','Epic','Legendary','Mythic'];
  tierOrder.forEach(tier => {
    const inTier = Object.values(COSTUMES).filter(c => c.tier === tier);
    if (inTier.length === 0) return;
    const ti = COSTUME_TIERS[tier];

    const header = document.createElement('div');
    header.className = 'costume-tier-header';
    header.style.cssText = `border-left:3px solid ${ti.color};padding-left:8px;margin-top:10px;`;
    header.innerHTML = `<span style="color:${ti.color}">${ti.emoji} ${ti.label}</span>`;
    grid.appendChild(header);

    inTier.forEach(c => {
      const isUnlocked = unlocked.includes(c.id);
      const isSelected = c.id === (Game.player.costume || 'default');
      const div = document.createElement('div');
      div.className = `costume-item ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''}`;
      div.id = `ci-${c.id}`;
      if (isSelected) div.style.borderColor = ti.color;

      const preview = document.createElement('canvas');
      preview.width = 68; preview.height = 86;
      const pctx = preview.getContext('2d');

      // Background gradient per tier
      const bg = pctx.createLinearGradient(0,0,0,86);
      bg.addColorStop(0, '#1A252F'); bg.addColorStop(1, '#0B0F14');
      pctx.fillStyle = bg; pctx.fillRect(0,0,68,86);

      // Thin floor line
      pctx.fillStyle = '#2a3a4a'; pctx.fillRect(0, 82, 68, 2);

      if (isUnlocked) {
        drawStickman(pctx, 34, 80, c, { scale: 0.65, running: false });
        window._gridPreviews.push({ canvas: preview, costume: c, locked: false });
      } else {
        pctx.fillStyle = 'rgba(0,0,0,0.55)'; pctx.fillRect(0,0,68,86);
        pctx.font = '26px Arial'; pctx.textAlign = 'center'; pctx.fillText('🔒', 34, 48);
      }

      div.appendChild(preview);

      const label = document.createElement('div');
      label.className = 'costume-label';
      label.textContent = c.name;
      div.appendChild(label);

      if (isUnlocked) {
        const tierBadge = document.createElement('div');
        tierBadge.style.cssText = `font-size:8px;color:${ti.color};font-weight:700;margin-top:1px;`;
        tierBadge.textContent = ti.emoji;
        div.appendChild(tierBadge);
      } else {
        const req = document.createElement('div');
        req.className = 'costume-req';
        req.textContent = c.unlockReq;
        div.appendChild(req);
      }

      if (isUnlocked) div.onclick = () => selectCostume(c.id);
      grid.appendChild(div);
    });
  });

  // Animate all unlocked previews
  let _gridFrame = 0;
  (function _animateGrid() {
    _gridFrame++;
    (window._gridPreviews || []).forEach(({ canvas, costume }) => {
      const pctx = canvas.getContext('2d');
      const bg = pctx.createLinearGradient(0,0,0,86);
      bg.addColorStop(0,'#1A252F'); bg.addColorStop(1,'#0B0F14');
      pctx.fillStyle = bg; pctx.fillRect(0,0,68,86);
      pctx.fillStyle = '#2a3a4a'; pctx.fillRect(0, 82, 68, 2);
      drawStickman(pctx, 34, 80, costume, { scale: 0.65, running: true, frame: _gridFrame });
    });
    window._gridAnimId = requestAnimationFrame(_animateGrid);
  })();
}

function selectCostume(id) {
  Game.player.costume = id;
  document.querySelectorAll('.costume-item').forEach(el => {
    el.classList.remove('selected');
    el.style.borderColor = '';
  });
  const el = document.getElementById(`ci-${id}`);
  if (el) {
    el.classList.add('selected');
    const c = COSTUMES[id];
    if (c) el.style.borderColor = COSTUME_TIERS[c.tier]?.color || '#F1C40F';
  }
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
const MP_COMMON_COSTUMES = ['kofi','ama','kwame','abena','default','redathlete','bluestar','greenrunner','purpleace','ninjastrike','blazerunner','cosmickid','goldensprint','icewarrior'];

const _mpPrevRafs = {};

function _startMPPreview(playerIdx, costumeId, col) {
  if (_mpPrevRafs[playerIdx]) cancelAnimationFrame(_mpPrevRafs[playerIdx]);
  const cv = document.getElementById(`mp-prev-${playerIdx}`);
  if (!cv) return;
  const nameEl = document.getElementById(`mp-prev-name-${playerIdx}`);
  if (nameEl) nameEl.textContent = (COSTUMES[costumeId]?.name || costumeId).split(' ')[0];
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  let f = 0;
  const loop = () => {
    f++;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#1a2535'); bg.addColorStop(1, '#0B0F14');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W/2, H - 10, 0, W/2, H - 10, W * 0.6);
    glow.addColorStop(0, col + '55'); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#2a3a4a'; ctx.fillRect(0, H - 12, W, 12);
    ctx.fillStyle = col; ctx.fillRect(0, H - 12, W, 2);
    const bob = Math.sin(f * 0.07) * 2;
    drawStickman(ctx, W/2, H - 12 + bob, costumeId, { scale: 0.68, running: false, frame: f });
    _mpPrevRafs[playerIdx] = requestAnimationFrame(loop);
  };
  loop();
}

function _buildMPCostumeGrid(playerIdx, selectedCid, col) {
  const row = document.getElementById(`mp-costume-row-${playerIdx}`);
  if (!row) return;
  row.innerHTML = '';
  MP_COMMON_COSTUMES.forEach(cid => {
    const costume = COSTUMES[cid];
    if (!costume) return;
    const btn = document.createElement('button');
    const isSel = cid === selectedCid;
    btn.id = `mp-cbtn-${playerIdx}-${cid}`;
    btn.dataset.costumeId = cid;
    btn.style.cssText = `padding:5px 2px 4px;border-radius:10px;
      border:2px solid ${isSel ? col : 'rgba(255,255,255,0.1)'};
      background:${isSel ? col + '22' : '#0d1117'};
      cursor:pointer;outline:none;transition:all 0.15s;`;
    const cv = document.createElement('canvas');
    cv.width = 38; cv.height = 50;
    const pctx = cv.getContext('2d');
    const bgGrad = pctx.createLinearGradient(0,0,0,50);
    bgGrad.addColorStop(0,'#1A252F'); bgGrad.addColorStop(1,'#0d1117');
    pctx.fillStyle = bgGrad; pctx.fillRect(0,0,38,50);
    drawStickman(pctx, 19, 46, cid, { scale: 0.38 });
    const nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-size:7px;color:#aaa;margin-top:2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:700;text-align:center;';
    nameEl.textContent = costume?.name?.split(' ')[0] || cid;
    btn.appendChild(cv);
    btn.appendChild(nameEl);
    btn.onclick = () => _selectMPCostume(playerIdx, cid);
    row.appendChild(btn);
  });
}

function goMultiplayerSetup(count) {
  // Cancel PC animations
  if (_pcRaf) { cancelAnimationFrame(_pcRaf); _pcRaf = null; }
  // Cancel any running previews
  Object.keys(_mpPrevRafs).forEach(k => { cancelAnimationFrame(_mpPrevRafs[k]); delete _mpPrevRafs[k]; });
  showScreen('screen-mp-setup');
  const container = document.getElementById('mp-players-container');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const col = PLAYER_COLORS[i] || '#F1C40F';
    const defaultCostume = PLAYER_COSTUMES[i] || 'default';
    const slot = document.createElement('div');
    slot.id = `mp-slot-${i}`;
    slot.dataset.costume = defaultCostume;
    slot.style.cssText = `background:rgba(255,255,255,0.03);border:2px solid ${col}44;border-radius:20px;padding:18px;margin-bottom:16px;`;

    slot.innerHTML = `
      <div style="font-weight:900;font-size:16px;color:${col};margin-bottom:14px;display:flex;align-items:center;gap:8px;">
        <span style="width:10px;height:10px;border-radius:50%;background:${col};display:inline-block;flex-shrink:0;"></span>
        Player ${i+1}
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:14px;">
        <div style="flex-shrink:0;text-align:center;">
          <canvas id="mp-prev-${i}" width="72" height="96" style="border-radius:12px;border:2px solid ${col}55;background:#0B0F14;display:block;"></canvas>
          <div id="mp-prev-name-${i}" style="font-size:9px;font-weight:700;color:${col};margin-top:3px;height:12px;"></div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
          <div>
            <label style="font-size:11px;color:#888;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Name</label>
            <input type="text" id="mp-name-${i}" maxlength="10" placeholder="Player ${i+1}" value="Player ${i+1}"
              style="width:100%;box-sizing:border-box;background:#1a2533;border:1.5px solid ${col}44;border-radius:10px;color:#fff;padding:10px 12px;font-size:14px;font-family:inherit;outline:none;"/>
          </div>
          <div>
            <label style="font-size:11px;color:#888;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Age</label>
            <select id="mp-age-${i}" style="width:100%;background:#1a2533;border:1.5px solid ${col}44;border-radius:10px;color:#fff;padding:10px 8px;font-size:14px;font-family:inherit;outline:none;">
              ${[8,9,10,11,12,13,14,15,16].map(a => `<option value="${a}"${a===12?' selected':''}>${a}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div>
        <label style="font-size:11px;color:#888;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">Costume</label>
        <div id="mp-costume-row-${i}" style="display:grid;grid-template-columns:repeat(5,1fr);gap:5px;"></div>
      </div>
    `;
    container.appendChild(slot);
    _buildMPCostumeGrid(i, defaultCostume, col);
    _startMPPreview(i, defaultCostume, col);
  }
}

function _selectMPCostume(playerIdx, costumeId) {
  const col = PLAYER_COLORS[playerIdx] || '#F1C40F';
  const slot = document.getElementById(`mp-slot-${playerIdx}`);
  if (slot) slot.dataset.costume = costumeId;
  MP_COMMON_COSTUMES.forEach(cid => {
    const btn = document.getElementById(`mp-cbtn-${playerIdx}-${cid}`);
    if (!btn) return;
    const sel = cid === costumeId;
    btn.style.borderColor = sel ? col : 'rgba(255,255,255,0.1)';
    btn.style.background  = sel ? col + '22' : '#0d1117';
  });
  Audio.playClick();
  _startMPPreview(playerIdx, costumeId, col);
}

function saveMultiplayerAndPlay() {
  Game.players = [];
  for (let i = 0; i < Game.playerCount; i++) {
    const name    = sanitizeName(document.getElementById(`mp-name-${i}`)?.value || `Player ${i+1}`);
    const age     = parseInt(document.getElementById(`mp-age-${i}`)?.value) || 12;
    const costume = document.getElementById(`mp-slot-${i}`)?.dataset.costume || PLAYER_COSTUMES[i] || 'default';
    Game.players.push({
      name,
      age,
      costume,
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
  const Cls = getGameClass(gameType);
  return Cls ? new Cls(canvas, playerName, costume, onComplete) : new SprintDash(canvas, playerName, costume, onComplete);
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
  let animStart = 0;

  const COLORS = ['#E74C3C','#F1C40F','#2ECC71'];
  const ring = (progress, col) => {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.globalAlpha = 0.25 + progress * 0.55;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(W/2, H/2, Math.min(W,H)*0.18 * (1 + (1-progress)*0.3), 0, Math.PI*2*progress);
    ctx.stroke();
    ctx.restore();
  };

  const drawBg = () => {
    ctx.clearRect(0,0,W,H);
    const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.7);
    bg.addColorStop(0, '#0d1825'); bg.addColorStop(1, '#000');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
  };

  let rafId = null;
  const animate = (ts) => {
    if (!animStart) animStart = ts;
    const progress = Math.min((ts - animStart) / 700, 1);
    drawBg();

    const isGo = count <= 0;
    const col  = isGo ? '#2ECC71' : COLORS[3 - count] || '#F1C40F';
    const label = isGo ? 'GO!' : String(count);
    const ease  = 1 - Math.pow(1 - progress, 3);

    // Expanding ring
    ring(ease, col);

    // Pulsing background glow
    ctx.save();
    const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.min(W,H)*0.5);
    const alpha = Math.round((0.04 + ease*0.1)*255).toString(16).padStart(2,'0');
    glow.addColorStop(0, col + alpha); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);
    ctx.restore();

    // Main number with pop-in scale
    const scale = isGo
      ? 0.7 + ease*0.35
      : 1.5 - ease*0.5;
    ctx.save();
    ctx.translate(W/2, H/2);
    ctx.scale(scale, scale);
    ctx.globalAlpha = Math.min(1, ease * 2);

    const sz = isGo ? Math.min(W,H)*0.16 : Math.min(W,H)*0.20;
    ctx.font = `900 ${sz}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Drop shadow
    ctx.shadowColor = col;
    ctx.shadowBlur  = 30 * ease;
    ctx.fillStyle = col;
    ctx.fillText(label, 0, 0);
    ctx.shadowBlur = 0;

    // White outline glint
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5 / scale;
    ctx.strokeText(label, 0, 0);
    ctx.restore();

    // "Get ready" sub-text for numbers
    if (!isGo && progress > 0.3) {
      ctx.save();
      ctx.globalAlpha = (progress - 0.3) / 0.7;
      ctx.font = `700 ${Math.floor(Math.min(W,H)*0.038)}px Inter`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText('GET READY', W/2, H/2 - Math.min(W,H)*0.14);
      ctx.restore();
    }

    if (progress < 1) {
      rafId = requestAnimationFrame(animate);
    } else {
      // Next step
      if (count > 0) Audio.playCountdown();
      else           Audio.playCountdownGo();
      count--;
      if (count >= 0) {
        animStart = 0;
        setTimeout(() => { rafId = requestAnimationFrame(animate); }, 50);
      } else {
        setTimeout(onDone, 280);
      }
    }
  };

  drawBg();
  rafId = requestAnimationFrame(animate);
}

function showMiniGameResult(result, onNext) {
  showScreen('screen-mg-result');
  const won = result.winner === 'player';
  const col = won ? '#2ECC71' : '#E74C3C';

  const titleEl = document.getElementById('mgr-title');
  titleEl.textContent = won ? '🏆 You Won!' : '❌ CPU Wins';
  titleEl.style.color = col;
  titleEl.style.textShadow = `0 0 20px ${col}66`;

  document.getElementById('mgr-game').textContent    = result.gameName || '';
  document.getElementById('mgr-score').textContent   = `+${result.score} pts`;
  document.getElementById('mgr-score').style.color   = col;
  document.getElementById('mgr-player').textContent  = result.playerName || '';
  const runningTotal = Game.roundScores.reduce((a,b)=>a+b,0);
  document.getElementById('mgr-total').textContent = `Round total so far: ${runningTotal} pts`;

  const podiumCv = document.getElementById('mgr-podium');
  if (podiumCv) podiumCv.style.display = 'none';

  document.getElementById('mgr-next-btn').textContent = 'Continue →';
  document.getElementById('mgr-next-btn').style.cssText = `font-size:17px; padding:18px; border-radius:18px;`;
  document.getElementById('mgr-next-btn').onclick = () => { Audio.playClick(); onNext(); };

  if (won) { _spawnConfetti(55); _startConfettiLoop('mgr-confetti', 3.5); Audio.playWin(); }
}

// ── Q&A (single player only) ─────────────────────────────
function startQA() {
  const qCount = Math.max(1, Game.playerCount || 1);
  Game.currentQuestions = getQuestions(Game.player.tier, qCount);
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
  document.getElementById('ri-tier').textContent = `${Game.playerCount} Players · All Play Simultaneously!`;
  const games = ROUND_GAMES[roundNum] || ROUND_GAMES[1];
  document.getElementById('ri-games-list').innerHTML = games.map(g =>
    `<li>${GAME_LABELS[g] || g}</li>`
  ).join('');
  document.getElementById('ri-start-btn').onclick = () => { Audio.playClick(); launchSimultaneousGame(0); };
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

let _mprHeroRaf = null;

function _startMPRHero(costumeId, playerIdx) {
  if (_mprHeroRaf) { cancelAnimationFrame(_mprHeroRaf); _mprHeroRaf = null; }
  const cv = document.getElementById('mpr-hero');
  if (!cv) return;
  const col = PLAYER_COLORS[playerIdx] || '#F1C40F';
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  let f = 0;
  const loop = () => {
    f++;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#1a2535'); bg.addColorStop(1, '#0B0F14');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const pulse = 0.18 + Math.sin(f * 0.06) * 0.08;
    const glow = ctx.createRadialGradient(W/2, H * 0.55, 0, W/2, H * 0.55, W * 0.6);
    const glowHex = Math.round(pulse * 255).toString(16).padStart(2, '0');
    glow.addColorStop(0, col + glowHex); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#2a3a4a'; ctx.fillRect(0, H - 16, W, 16);
    ctx.fillStyle = col; ctx.fillRect(0, H - 16, W, 3);
    const bob = Math.sin(f * 0.06) * 3;
    drawStickman(ctx, W/2, H - 16 + bob, costumeId, { scale: 0.82, running: false, frame: f });
    _mprHeroRaf = requestAnimationFrame(loop);
  };
  loop();
}

function showMultiplayerResults() {
  showScreen('screen-mp-results');

  const ranked = [...Game.players].sort((a, b) => b.totalScore - a.totalScore);
  const games  = ROUND_GAMES[Game.currentRound] || ROUND_GAMES[1];

  Game.players.forEach(p => { p.grandTotal = (p.grandTotal || 0) + p.totalScore; });

  const lb = Store.get().leaderboard || [];
  ranked.forEach(p => lb.push({ name: p.name, score: p.totalScore, round: Game.currentRound, date: new Date().toLocaleDateString() }));
  lb.sort((a, b) => b.score - a.score);
  Store.update({
    leaderboard:  lb.slice(0, 20),
    highestRound: Math.max(Store.get().highestRound || 0, Game.currentRound),
  });

  // Winner hero section
  const winner    = ranked[0];
  const winnerIdx = Game.players.indexOf(winner);
  const winnerCol = PLAYER_COLORS[winnerIdx] || '#F1C40F';
  const nameEl = document.getElementById('mpr-winner-name');
  if (nameEl) { nameEl.textContent = winner?.name || ''; nameEl.style.color = winnerCol; }
  if (winner) _startMPRHero(winner.costume || 'default', winnerIdx);

  // Rankings list
  const container = document.getElementById('mp-results-list');
  if (container) {
    container.innerHTML = '';
    const medals = ['🥇','🥈','🥉','4️⃣'];
    ranked.forEach((p, i) => {
      const origIdx = Game.players.indexOf(p);
      const col = PLAYER_COLORS[origIdx] || '#aaa';
      const big = i === 0;

      const row = document.createElement('div');
      row.style.cssText = `
        display:flex;align-items:center;gap:14px;
        background:${big?`rgba(${_hexToRgb(col)},0.09)`:'rgba(255,255,255,0.03)'};
        border:1.5px solid ${big?col+'50':'rgba(255,255,255,0.06)'};
        border-radius:18px;padding:${big?'16px':'12px 14px'};margin-bottom:10px;
        box-shadow:${big?`0 4px 24px rgba(${_hexToRgb(col)},0.18)`:'none'};
        animation: slideUp 0.35s ${i*0.07}s cubic-bezier(0.16,1,0.3,1) both;
      `;

      // Mini stickman avatar
      const cv = document.createElement('canvas');
      cv.width = big ? 50 : 38; cv.height = big ? 66 : 50;
      cv.style.cssText = `border-radius:10px;flex-shrink:0;`;
      const pctx = cv.getContext('2d');
      const bg2 = pctx.createLinearGradient(0,0,0,cv.height);
      bg2.addColorStop(0,'#1A252F'); bg2.addColorStop(1,'#0B0F14');
      pctx.fillStyle = bg2; pctx.fillRect(0,0,cv.width,cv.height);
      pctx.fillStyle = col+'44'; pctx.fillRect(0,cv.height-8,cv.width,8);
      pctx.fillStyle = col; pctx.fillRect(0,cv.height-8,cv.width,2);
      drawStickman(pctx, cv.width/2, cv.height-8, p.costume||'default', { scale: big?0.5:0.37 });

      const breakdown = p.scores.map((s, j) => {
        const label = (GAME_LABELS[games[j]]||'').replace(/^[^\s]+ /,'').slice(0,7);
        return `${label}: ${s}`;
      }).join(' · ');

      row.appendChild(cv);
      const info = document.createElement('div');
      info.style.cssText = 'flex:1;min-width:0;';
      info.innerHTML = `
        <div style="font-weight:900;font-size:${big?'18px':'15px'};color:${col};
          text-shadow:0 0 12px ${col}44;margin-bottom:2px;">${p.name}</div>
        <div style="font-size:10px;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${breakdown}</div>
      `;
      const scoreDiv = document.createElement('div');
      scoreDiv.style.cssText = 'text-align:right;flex-shrink:0;';
      scoreDiv.innerHTML = `
        <div style="font-size:${big?'26px':'18px'};font-weight:900;color:${big?'#FFD700':'#888'};
          ${big?`text-shadow:0 0 16px rgba(241,196,15,0.5);`:''}
          line-height:1;">${p.totalScore}</div>
        <div style="font-size:10px;color:#555;margin-top:2px;">pts</div>
        ${p.grandTotal > p.totalScore ? `<div style="font-size:9px;color:#444;">total: ${p.grandTotal}</div>` : ''}
      `;
      row.appendChild(info);
      row.appendChild(scoreDiv);
      // Medal
      const medal = document.createElement('div');
      medal.style.cssText = `font-size:${big?'32px':'22px'};flex-shrink:0;order:-1;`;
      medal.textContent = medals[i] || `#${i+1}`;
      row.insertBefore(medal, cv);
      container.appendChild(row);
    });
  }

  // Action buttons
  const actionsEl = document.getElementById('mpr-actions');
  if (actionsEl) {
    actionsEl.innerHTML = '';
    const nextRound = Game.currentRound + 1;
    const saved = Store.get();
    if (ROUND_GAMES[nextRound]) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-gold btn-full';
      if (saved.roundUnlocked?.[nextRound]) {
        nextBtn.textContent = `▶ Play Round ${nextRound}`;
        nextBtn.onclick = () => { Audio.playClick(); startMultiplayerRound(nextRound); };
      } else {
        nextBtn.innerHTML = `🔓 Unlock Round ${nextRound} — <span style="color:#000">GHS 5</span>`;
        nextBtn.onclick   = () => { Audio.playClick(); showPaymentScreen(nextRound); };
      }
      actionsEl.appendChild(nextBtn);
    }
    [
      ['🔄 Play Again (Same Players)', () => startMultiplayerRound(1)],
      ['🏆 Leaderboard', showLeaderboard],
      ['🏠 Menu', goMenu],
    ].forEach(([label, fn]) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-dark btn-full';
      btn.textContent = label;
      btn.onclick = () => { Audio.playClick(); fn(); };
      actionsEl.appendChild(btn);
    });
  }

  if (winner) {
    Audio.playWin();
    Audio.cheer('round_winner', winner.name);
    _spawnConfetti(120);
    _startConfettiLoop('mpr-confetti', 7);
  }
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

// ── SETTINGS ────────────────────────────────────────────
function goSettings() {
  Audio.playClick();
  showScreen('screen-settings');
  renderVoiceList();
  const btn = document.getElementById('settings-audio-btn');
  if (btn) btn.textContent = Audio.enabled ? '🔊 On' : '🔇 Off';
  renderOrientationButtons();
}

function setOrientation(mode) {
  Audio.playClick();
  try {
    localStorage.setItem('stickrush_orientation', mode);
  } catch(e) {}
  applyOrientation(mode);
  renderOrientationButtons();
}

function applyOrientation(mode) {
  try {
    if (!screen.orientation || !screen.orientation.lock) return;
    if (mode === 'portrait')   screen.orientation.lock('portrait').catch(() => {});
    else if (mode === 'landscape') screen.orientation.lock('landscape').catch(() => {});
    else                       screen.orientation.unlock();
  } catch(e) {}
}

function renderOrientationButtons() {
  let saved = 'auto';
  try { saved = localStorage.getItem('stickrush_orientation') || 'auto'; } catch(e) {}
  ['portrait','landscape','auto'].forEach(m => {
    const el = document.getElementById('orient-' + m);
    if (!el) return;
    const active = saved === m;
    el.style.border    = active ? '2px solid #F1C40F' : '2px solid rgba(255,255,255,0.1)';
    el.style.background = active ? 'rgba(241,196,15,0.12)' : 'rgba(255,255,255,0.04)';
    el.style.color     = active ? '#F1C40F' : '#aaa';
  });
}

function renderVoiceList() {
  const container = document.getElementById('settings-voice-list');
  if (!container) return;
  container.innerHTML = '';

  const allVoices = (Audio.voices || []).filter(v => v.lang.startsWith('en'));
  if (!allVoices.length) {
    container.innerHTML = '<p style="color:#888;font-size:13px;padding:8px 0;">Loading voices…</p>';
    setTimeout(renderVoiceList, 700);
    return;
  }

  const used = new Set();
  function langMatch(voiceLang, target) {
    return voiceLang.toLowerCase().startsWith(target.toLowerCase());
  }
  function matchVoice(langs, hints) {
    for (const lang of langs) {
      for (const hint of hints) {
        const v = allVoices.find(v => !used.has(v.name) && langMatch(v.lang, lang) && v.name.toLowerCase().includes(hint));
        if (v) return v;
      }
    }
    for (const lang of langs) {
      const v = allVoices.find(v => !used.has(v.name) && langMatch(v.lang, lang) && v.localService);
      if (v) return v;
    }
    for (const lang of langs) {
      const v = allVoices.find(v => !used.has(v.name) && langMatch(v.lang, lang));
      if (v) return v;
    }
    const generic = new Set(['female','male']);
    for (const hint of hints) {
      if (generic.has(hint)) continue;
      const v = allVoices.find(v => !used.has(v.name) && v.name.toLowerCase().includes(hint));
      if (v) return v;
    }
    return null;
  }

  const matched = [];
  CURATED_VOICES.forEach(slot => {
    const voice = matchVoice(slot.langs, slot.hints);
    if (voice) used.add(voice.name);
    matched.push({ slot, voice });
  });

  // Fallback: if locale matching found nothing, list raw voices
  const anyMatched = matched.some(function(m) { return m.voice; });
  const rows = anyMatched
    ? matched
    : allVoices.slice(0, 10).map(function(v) { return { slot: { flag: '🔊', label: v.name }, voice: v }; });

  function makeRow(slot, voice) {
    const isSelected = !!(voice && Audio.preferredVoice && Audio.preferredVoice.name === voice.name);
    const available  = !!voice;

    const label = document.createElement('label');
    const border = isSelected ? '#F1C40F' : 'rgba(255,255,255,0.08)';
    const bg     = isSelected ? 'rgba(241,196,15,0.07)' : 'rgba(255,255,255,0.03)';
    label.style.cssText = 'display:flex;align-items:center;gap:12px;padding:11px 14px;' +
      'border-radius:12px;border:1.5px solid ' + border + ';background:' + bg + ';' +
      'cursor:' + (available ? 'pointer' : 'default') + ';margin-bottom:8px;' +
      'opacity:' + (available ? '1' : '0.32') + ';';

    const input = document.createElement('input');
    input.type     = 'radio';
    input.name     = 'voice-pick';
    input.checked  = isSelected;
    input.disabled = !available;
    input.style.cssText = 'accent-color:#F1C40F;width:16px;height:16px;flex-shrink:0;';
    if (voice) {
      const voiceName = voice.name;
      input.addEventListener('change', function() {
        Audio.setVoice(voiceName);
        renderVoiceList();
      });
    }

    const info = document.createElement('div');
    info.style.cssText = 'flex:1;min-width:0;';
    const nameDiv = document.createElement('div');
    nameDiv.style.cssText = 'font-weight:700;font-size:14px;';
    nameDiv.textContent = slot.flag + ' ' + slot.label;
    const subDiv = document.createElement('div');
    subDiv.style.cssText = 'font-size:11px;color:#666;';
    subDiv.textContent = available
      ? voice.name + (voice.localService ? ' · Local' : ' · Network')
      : 'Not on this device';
    info.appendChild(nameDiv);
    info.appendChild(subDiv);

    label.appendChild(input);
    label.appendChild(info);
    if (isSelected) {
      const check = document.createElement('span');
      check.style.cssText = 'color:#F1C40F;font-size:18px;';
      check.textContent = '✓';
      label.appendChild(check);
    }
    return label;
  }

  rows.forEach(function(r) { container.appendChild(makeRow(r.slot, r.voice)); });
}
function testVoice() {
  Audio.speak("Hello! I am your Stick Rush announcer. Let the games begin!", 0.9, 1.0);
}

function toggleAudioSetting() {
  const on = Audio.toggle();
  const btn = document.getElementById('settings-audio-btn');
  if (btn) btn.textContent = on ? '🔊 On' : '🔇 Off';
}

// ── MULTIPLAYER Q&A ──────────────────────────────────────
function startMultiplayerQA() {
  Game.currentQAPlayerIdx = 0;
  Game.players.forEach(p => { p.qaScore = p.qaScore || 0; });
  _nextMPQuestion();
}

function _nextMPQuestion() {
  if (Game.currentQAPlayerIdx >= Game.playerCount) {
    showMultiplayerResults();
    return;
  }
  const player = Game.players[Game.currentQAPlayerIdx];
  showScreen('screen-player-turn');
  const pIdx = Game.currentQAPlayerIdx;
  document.getElementById('pt-player-name').textContent = player.name;
  document.getElementById('pt-player-name').style.color = PLAYER_COLORS[pIdx] || '#F1C40F';
  document.getElementById('pt-game-name').textContent   = '📚 Brain Challenge!';
  document.getElementById('pt-game-num').textContent    = `${player.name}'s Question`;
  // Draw stickman
  const cv = document.getElementById('pt-canvas');
  if (cv) {
    const ctx = cv.getContext('2d');
    const W = cv.width = cv.offsetWidth || 120, H = cv.height = 160;
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#1A252F'); bg.addColorStop(1,'#0B0F14');
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#222'; ctx.fillRect(0,H-20,W,20);
    ctx.fillStyle = '#F1C40F'; ctx.fillRect(0,H-20,W,2);
    drawStickman(ctx, W/2, H-20, player.costume, { scale:1.15 });
  }
  document.getElementById('pt-ready-btn').onclick = () => {
    Audio.playClick();
    _showMPQuestion(player);
  };
}

function _showMPQuestion(player) {
  const q = getQuestions(player.tier, 1)[0];
  if (!q) { Game.currentQAPlayerIdx++; _nextMPQuestion(); return; }
  showScreen('screen-qa');
  document.getElementById('qa-progress').textContent = `${player.name}'s Question`;
  document.getElementById('qa-subject').textContent  = `📚 ${q.subject}`;
  document.getElementById('qa-subject').style.background = q.subject === 'Math' ? '#2980B9' : '#8E44AD';
  document.getElementById('qa-question').textContent = q.q;
  document.getElementById('qa-pts').textContent      = `+${q.points} pts for ${player.name}`;

  let timeLeft = 15, answered = false;
  const timerEl = document.getElementById('qa-timer');
  const barEl   = document.getElementById('qa-timer-bar');
  const interval = setInterval(() => {
    if (answered) { clearInterval(interval); return; }
    timeLeft -= 0.1;
    if (timerEl) timerEl.textContent = `⏱ ${Math.ceil(timeLeft)}s`;
    if (barEl)   barEl.style.width   = `${(timeLeft/15)*100}%`;
    if (timeLeft <= 0) { clearInterval(interval); if (!answered) _submitMPAnswer(-1, q, player); }
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
      clearInterval(interval);
      _submitMPAnswer(i, q, player, btn, optContainer);
    };
    optContainer.appendChild(btn);
  });
}

function _submitMPAnswer(chosenIdx, q, player, btn, optContainer) {
  const correct = chosenIdx === q.answer;
  if (correct) {
    player.qaScore    = (player.qaScore || 0) + q.points;
    player.totalScore += q.points;
    Audio.playCorrect(); Audio.cheer('qa_correct');
    Store.update({ totalQACorrect: (Store.get().totalQACorrect || 0) + 1 });
  } else {
    Audio.playWrong(); Audio.cheer('qa_wrong');
  }
  if (optContainer) {
    Array.from(optContainer.children).forEach((b, i) => {
      if (i === q.answer) b.classList.add('correct');
      else if (i === chosenIdx && !correct) b.classList.add('wrong');
      b.disabled = true;
    });
  }
  Game.currentQAPlayerIdx++;
  setTimeout(() => _nextMPQuestion(), 1800);
}

// ── SIMULTANEOUS MULTIPLAYER ENGINE ─────────────────────
// Each player gets their own W/N column with a tap zone.
// All games run in parallel; input is routed by touch X position.
class SimultaneousGame {
  constructor(mainCanvas, players, GameClass, onComplete) {
    this.mainCanvas = mainCanvas;
    this.mainCtx    = mainCanvas.getContext('2d');
    this.W          = mainCanvas.width;
    this.H          = mainCanvas.height;
    this.players    = players;
    this.n          = players.length;
    this.onComplete = onComplete;
    this.results    = new Array(this.n).fill(null);
    this.raf        = null;
    this._frame     = 0;
    this._started   = false;

    // Compute 2D grid zones (Stickman Party style)
    this.zones = this._computeZones();

    // Off-screen canvas per player, sized to its zone
    this.subCanvases = this.zones.map(z => {
      const c = document.createElement('canvas');
      c.width  = z.w;
      c.height = z.h;
      return c;
    });

    // One game instance per player
    this.games = players.map((p, i) => {
      const g = new GameClass(this.subCanvases[i], p.name, p.costume, (result) => {
        this._onPlayerFinish(i, result);
      });
      if (g._onKey) document.removeEventListener('keydown', g._onKey);
      return g;
    });

    // Player 0 gets keyboard
    document.addEventListener('keydown', this._kbdHandler = (e) => {
      if (!this._started) return;
      if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'ArrowUp') {
        const g = this.games[0];
        if (g && !g.gameOver) {
          if (typeof g._tap  === 'function') g._tap();
          else if (typeof g._jump === 'function') g._jump();
        }
      }
    });

    this._bindTouch();
  }

  _computeZones() {
    const W = this.W, H = this.H;
    if (this.n === 1) {
      return [{ x: 0, y: 0, w: W, h: H }];
    } else if (this.n === 2) {
      // Top / bottom split — each player gets full width, half height
      const half = Math.floor(H / 2);
      return [
        { x: 0, y: 0,    w: W, h: half },
        { x: 0, y: half, w: W, h: H - half },
      ];
    } else if (this.n === 3) {
      // Top row: two side-by-side; bottom row: full width
      const half  = Math.floor(H / 2);
      const wHalf = Math.floor(W / 2);
      return [
        { x: 0,     y: 0,    w: wHalf,     h: half },
        { x: wHalf, y: 0,    w: W - wHalf, h: half },
        { x: 0,     y: half, w: W,         h: H - half },
      ];
    } else {
      // 4 players: 2×2 grid
      const half  = Math.floor(H / 2);
      const wHalf = Math.floor(W / 2);
      return [
        { x: 0,     y: 0,    w: wHalf,     h: half },
        { x: wHalf, y: 0,    w: W - wHalf, h: half },
        { x: 0,     y: half, w: wHalf,     h: H - half },
        { x: wHalf, y: half, w: W - wHalf, h: H - half },
      ];
    }
  }

  _findZone(x, y) {
    for (let i = 0; i < this.zones.length; i++) {
      const z = this.zones[i];
      if (x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h) return i;
    }
    return 0;
  }

  _bindTouch() {
    const canvas = this.mainCanvas;
    // Map touch identifier → zone index so drags stay in their starting zone
    this._activeTouches = new Map();

    const coords = (t, rect) => ({
      x: (t.clientX - rect.left) * (this.W / rect.width),
      y: (t.clientY - rect.top)  * (this.H / rect.height),
    });

    this._onTouch = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      Array.from(e.changedTouches).forEach(t => {
        const { x, y } = coords(t, rect);
        const idx = this._findZone(x, y);
        this._activeTouches.set(t.identifier, idx);
        const z = this.zones[idx];
        this._routeTap(idx, x - z.x, y - z.y);
      });
    };

    this._onTouchMove = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      Array.from(e.changedTouches).forEach(t => {
        const idx = this._activeTouches.get(t.identifier);
        if (idx === undefined) return;
        const { x, y } = coords(t, rect);
        const z = this.zones[idx];
        this._routeMove(idx, x - z.x, y - z.y);
      });
    };

    this._onTouchEnd = (e) => {
      Array.from(e.changedTouches).forEach(t => this._activeTouches.delete(t.identifier));
    };

    this._onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x    = (e.clientX - rect.left) * (this.W / rect.width);
      const y    = (e.clientY - rect.top)  * (this.H / rect.height);
      const idx  = this._findZone(x, y);
      const z    = this.zones[idx];
      this._routeTap(idx, x - z.x, y - z.y);
    };

    canvas.addEventListener('touchstart',  this._onTouch,     { passive: false });
    canvas.addEventListener('touchmove',   this._onTouchMove, { passive: false });
    canvas.addEventListener('touchend',    this._onTouchEnd,  { passive: true  });
    canvas.addEventListener('touchcancel', this._onTouchEnd,  { passive: true  });
    canvas.addEventListener('click',       this._onClick);
  }

  _routeTap(i, localX, localY) {
    if (!this._started) return;
    const g = this.games[i];
    if (!g || g.gameOver) return;
    if      (typeof g._tapAt === 'function') g._tapAt(localX, localY);
    else if (typeof g._tap   === 'function') g._tap();
    else if (typeof g._jump  === 'function') g._jump();
  }

  // Called on touchmove — only routes to games that support continuous position updates
  _routeMove(i, localX, localY) {
    const g = this.games[i];
    if (!g || g.gameOver) return;
    if      (typeof g._moveAt === 'function') g._moveAt(localX, localY);
    else if (typeof g._tapAt  === 'function') g._tapAt(localX, localY);
  }

  start() {
    this._started = true;
    this.games.forEach(g => g.start());
    this._renderLoop();
  }

  _renderLoop() {
    if (this.results.every(r => r !== null)) return;
    const ctx = this.mainCtx;
    ctx.clearRect(0, 0, this.W, this.H);
    this._frame++;

    // Determine rankings by accumulated round score
    const ranked = [...this.players]
      .map((p, i) => ({ p, i, score: p.totalScore }))
      .sort((a, b) => b.score - a.score);
    const rankOf = {};
    ranked.forEach(({ i }, r) => { rankOf[i] = r; });

    const standingsH = this.n > 1 ? 32 : 0;

    this.zones.forEach((z, i) => {
      const sc   = this.subCanvases[i];
      const p    = this.players[i];
      const col  = PLAYER_COLORS[i] || '#F1C40F';
      const done = this.results[i] !== null;
      const rank = rankOf[i] ?? i;
      const isLeading = rank === 0 && this.n > 1;

      // Sub-game frame — standings strip overlays on top
      const zoneH = z.h;
      ctx.drawImage(sc, z.x, z.y, z.w, zoneH);

      // Glowing border — thicker + glow for leader
      ctx.save();
      ctx.shadowColor = col;
      ctx.shadowBlur  = isLeading ? 16 : 6;
      ctx.strokeStyle = col;
      ctx.lineWidth   = isLeading ? 4 : 2.5;
      ctx.strokeRect(z.x + 1.5, z.y + 1.5, z.w - 3, zoneH - 3);
      ctx.restore();

      // Separator line between zones
      if (this.n === 2 && i === 0) {
        const sepY = z.y + zoneH;
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(z.x, sepY - 1, z.w, 2);
      }

      // Player name banner
      const bannerH = Math.max(30, Math.floor(zoneH * 0.09));
      const bannerGrad = ctx.createLinearGradient(z.x, z.y, z.x, z.y + bannerH);
      bannerGrad.addColorStop(0, col + 'ee');
      bannerGrad.addColorStop(1, col + '22');
      ctx.fillStyle = bannerGrad;
      ctx.fillRect(z.x, z.y, z.w, bannerH);

      const fs = z.w < 130 ? 11 : 14;
      ctx.save();

      // Crown for current leader
      if (isLeading) {
        ctx.font = `${bannerH * 0.6}px Inter`;
        ctx.textAlign = 'left';
        ctx.fillText('👑', z.x + 4, z.y + bannerH * 0.75);
      }

      // Player name
      ctx.font = `800 ${fs}px Inter`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur  = 4;
      ctx.fillText(p.name, z.x + z.w / 2, z.y + bannerH * 0.72);
      ctx.shadowBlur  = 0;

      // Round score (top-right of banner)
      if (p.totalScore > 0) {
        ctx.font = `700 ${fs - 1}px Inter`;
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`${p.totalScore}⭐`, z.x + z.w - 5, z.y + bannerH * 0.72);
      }
      ctx.restore();

      // Done overlay
      if (done) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(z.x, z.y + bannerH, z.w, zoneH - bannerH);

        const doneFs = Math.max(14, Math.floor(zoneH * 0.09));
        ctx.save();
        ctx.font      = `900 ${doneFs}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2ECC71';
        ctx.shadowColor = 'rgba(46,204,113,0.9)';
        ctx.shadowBlur  = 14;
        ctx.fillText('✅ DONE', z.x + z.w / 2, z.y + zoneH / 2 + 6);
        // Score earned this game
        const res = this.results[i];
        if (res) {
          ctx.font = `700 ${Math.max(10, doneFs - 4)}px Inter`;
          ctx.fillStyle = '#FFD700';
          ctx.shadowColor = 'rgba(241,196,15,0.7)';
          ctx.fillText(`+${res.score} pts`, z.x + z.w / 2, z.y + zoneH / 2 + doneFs + 8);
        }
        ctx.restore();
      }
    });

    // Live standings strip at bottom
    if (this.n > 1 && standingsH > 0) {
      this._drawLiveStandings(ctx, ranked, standingsH);
    }

    this.raf = requestAnimationFrame(() => this._renderLoop());
  }

  _drawLiveStandings(ctx, ranked, stripH) {
    const W = this.W, H = this.H;
    const y = H - stripH;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.92)';
    ctx.fillRect(0, y, W, stripH);

    // Top separator glow line
    ctx.save();
    const lineGrad = ctx.createLinearGradient(0, y, W, y);
    lineGrad.addColorStop(0,   'transparent');
    lineGrad.addColorStop(0.3, 'rgba(241,196,15,0.6)');
    lineGrad.addColorStop(0.7, 'rgba(241,196,15,0.6)');
    lineGrad.addColorStop(1,   'transparent');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(0, y, W, 1.5);
    ctx.restore();

    const medals  = ['🥇','🥈','🥉','4️⃣'];
    const slotW   = W / ranked.length;

    ranked.forEach(({ p, i }, r) => {
      const col = PLAYER_COLORS[i] || '#F1C40F';
      const cx  = slotW * r + slotW / 2;

      // Highlight slot for leader
      if (r === 0) {
        ctx.fillStyle = 'rgba(241,196,15,0.08)';
        ctx.fillRect(slotW * r, y, slotW, stripH);
      }

      const fs = slotW < 100 ? 9 : 11;
      ctx.save();
      ctx.font      = `800 ${fs}px Inter`;
      ctx.textAlign = 'center';
      ctx.fillStyle = r === 0 ? '#FFD700' : '#aaa';
      ctx.shadowColor = r === 0 ? 'rgba(241,196,15,0.5)' : 'transparent';
      ctx.shadowBlur  = r === 0 ? 8 : 0;

      const text = `${medals[r] || `#${r+1}`} ${p.name}  ${p.totalScore}`;
      ctx.fillText(text, cx, y + stripH * 0.68);
      ctx.restore();

      // Divider between slots
      if (r < ranked.length - 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(slotW * (r + 1), y + 4, 1, stripH - 8);
      }
    });
  }

  _onPlayerFinish(i, result) {
    this.results[i] = result;
    if (this.results.every(r => r !== null)) {
      cancelAnimationFrame(this.raf);
      this._cleanup();
      this.onComplete(this.results);
    }
  }

  _cleanup() {
    this.mainCanvas.removeEventListener('touchstart',  this._onTouch);
    this.mainCanvas.removeEventListener('touchmove',   this._onTouchMove);
    this.mainCanvas.removeEventListener('touchend',    this._onTouchEnd);
    this.mainCanvas.removeEventListener('touchcancel', this._onTouchEnd);
    this.mainCanvas.removeEventListener('click',       this._onClick);
    document.removeEventListener('keydown', this._kbdHandler);
  }
}

function getGameClass(gameType) {
  const map = {
    sprint:      typeof SprintDash    !== 'undefined' ? SprintDash    : null,
    jump:        typeof JumpFever     !== 'undefined' ? JumpFever     : null,
    reflex:      typeof ReflexBlaster !== 'undefined' ? ReflexBlaster : null,
    colorblitz:  typeof ColorBlitz    !== 'undefined' ? ColorBlitz    : null,
    balloonpop:  typeof BalloonPop    !== 'undefined' ? BalloonPop    : null,
    mathdash:    typeof MathDash      !== 'undefined' ? MathDash      : null,
    memorymatch: typeof MemoryMatch   !== 'undefined' ? MemoryMatch   : null,
    rhythmtap:   typeof RhythmTap     !== 'undefined' ? RhythmTap     : null,
    whackmole:   typeof WhackMole     !== 'undefined' ? WhackMole     : null,
    coinrush:    typeof CoinRush      !== 'undefined' ? CoinRush      : null,
  };
  return map[gameType] || SprintDash;
}

function launchSimultaneousGame(gameIdx) {
  const games = ROUND_GAMES[Game.currentRound] || ROUND_GAMES[1];
  if (gameIdx >= games.length) { startMultiplayerQA(); return; }

  showScreen('screen-game');
  const canvas = document.getElementById('game-canvas');
  resizeCanvas(canvas);
  const gameType = games[gameIdx];
  document.getElementById('game-label').textContent = GAME_LABELS[gameType] || gameType;
  document.getElementById('game-num').textContent   = `Game ${gameIdx + 1} of ${games.length} — ALL PLAY!`;

  if (Game.playerCount > 1 && gameType === 'sprint') {
    const sprintGame = new SprintDashMulti(canvas, Game.players, (results) => {
      results.forEach((res, i) => {
        if (!Game.players[i]) return;
        Game.players[i].scores.push(res.score);
        Game.players[i].totalScore += res.score;
        if (res.winner === 'player') Store.update({ minigameWins: (Store.get().minigameWins || 0) + 1 });
      });
      showSimultaneousGameResult(results, () => launchSimultaneousGame(gameIdx + 1));
    });
    showCountdown(canvas, () => sprintGame.start());
    return;
  }

  const GameClass = getGameClass(gameType);
  const wrapper   = new SimultaneousGame(canvas, Game.players, GameClass, (results) => {
    results.forEach((res, i) => {
      if (!Game.players[i]) return;
      Game.players[i].scores.push(res.score);
      Game.players[i].totalScore += res.score;
      if (res.winner === 'player') Store.update({ minigameWins: (Store.get().minigameWins || 0) + 1 });
    });
    showSimultaneousGameResult(results, () => launchSimultaneousGame(gameIdx + 1));
  });

  showCountdown(canvas, () => wrapper.start());
}

// ── CONFETTI SYSTEM ──────────────────────────────────────
let _confettiParticles = [];
let _confettiRaf = null;

function _spawnConfetti(count) {
  const colors = ['#F1C40F','#E74C3C','#3498DB','#2ECC71','#9B59B6','#E67E22','#1ABC9C','#fff','#F39C12'];
  _confettiParticles = Array.from({ length: count }, () => ({
    x:     Math.random(),
    y:    -Math.random() * 0.3,
    vx:    (Math.random() - 0.5) * 0.006,
    vy:    0.005 + Math.random() * 0.007,
    color: colors[Math.floor(Math.random() * colors.length)],
    size:  5 + Math.random() * 8,
    angle: Math.random() * Math.PI * 2,
    spin:  (Math.random() - 0.5) * 0.2,
    shape: Math.random() < 0.55 ? 'rect' : 'circle',
  }));
}

function _startConfettiLoop(cvId, duration) {
  if (_confettiRaf) { cancelAnimationFrame(_confettiRaf); _confettiRaf = null; }
  const cv = document.getElementById(cvId);
  if (!cv) return;
  cv.style.display = 'block';
  const ctx = cv.getContext('2d');
  const start = Date.now();
  const step = () => {
    const elapsed = Date.now() - start;
    if (elapsed > duration * 1000) { cv.style.display = 'none'; return; }
    cv.width  = window.innerWidth;
    cv.height = window.innerHeight;
    ctx.clearRect(0, 0, cv.width, cv.height);
    const fade = elapsed > (duration - 1.2) * 1000 ? 1 - (elapsed - (duration - 1.2) * 1000) / 1200 : 1;
    ctx.globalAlpha = Math.max(0, fade);
    _confettiParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.angle += p.spin;
      if (p.y > 1.1) { p.y = -0.04; p.x = Math.random(); }
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05)  p.x = -0.05;
      ctx.save();
      ctx.translate(p.x * cv.width, p.y * cv.height);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    _confettiRaf = requestAnimationFrame(step);
  };
  step();
}

function _drawMGPodium(cv, ranked) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#111e2e'); bg.addColorStop(1, '#080C11');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const layout = [
    { rank: 1, cx: 0.50, bh: 0.48, mc: '#F1C40F' },
    { rank: 2, cx: 0.22, bh: 0.32, mc: '#9EB3C2' },
    { rank: 3, cx: 0.78, bh: 0.22, mc: '#CD7F32' },
  ];
  const blockW = W * 0.26;
  const floorY = H - 10;

  layout.forEach(({ rank, cx, bh, mc }) => {
    const player = ranked[rank - 1];
    if (!player) return;
    const pcx    = cx * W;
    const blockH = bh * H;
    const blockY = floorY - blockH;
    const playerCol = PLAYER_COLORS[player.playerIdx] || '#aaa';

    // Podium glow
    if (rank === 1) {
      const glow = ctx.createRadialGradient(pcx, blockY, 0, pcx, blockY, blockW);
      glow.addColorStop(0, mc + '40'); glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(pcx - blockW, blockY - 30, blockW * 2, blockH + 30);
    }

    // Block
    const blockGrad = ctx.createLinearGradient(pcx - blockW/2, blockY, pcx + blockW/2, blockY);
    blockGrad.addColorStop(0, mc + '18');
    blockGrad.addColorStop(0.5, mc + '30');
    blockGrad.addColorStop(1, mc + '18');
    ctx.fillStyle = blockGrad;
    ctx.fillRect(pcx - blockW / 2, blockY, blockW, blockH);

    ctx.save();
    ctx.shadowColor = mc; ctx.shadowBlur = rank === 1 ? 8 : 3;
    ctx.strokeStyle = mc; ctx.lineWidth = rank === 1 ? 2 : 1.2;
    ctx.strokeRect(pcx - blockW / 2, blockY, blockW, blockH);
    ctx.restore();

    // Rank number
    ctx.font = `900 ${rank === 1 ? 20 : 15}px Inter`;
    ctx.textAlign = 'center'; ctx.fillStyle = mc;
    ctx.shadowColor = mc; ctx.shadowBlur = 6;
    ctx.fillText(rank, pcx, floorY - 4);
    ctx.shadowBlur = 0;

    // Stickman
    const sc = rank === 1 ? 0.5 : 0.38;
    drawStickman(ctx, pcx, blockY, player.costume || 'default', { scale: sc });

    // Player name
    const nameY = blockY;
    ctx.font = `800 ${rank === 1 ? 12 : 9}px Inter`;
    ctx.fillStyle = playerCol;
    ctx.shadowColor = playerCol; ctx.shadowBlur = 4;
    ctx.fillText((player.playerName || '').slice(0, 9), pcx, nameY - (rank === 1 ? 22 : 16));
    ctx.shadowBlur = 0;

    // Score
    ctx.font = `700 ${rank === 1 ? 14 : 10}px Inter`;
    ctx.fillStyle = rank === 1 ? '#FFD700' : '#888';
    ctx.fillText(`${player.score} pts`, pcx, nameY - (rank === 1 ? 6 : 4));
  });

  // Shiny floor
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, H);
  floorGrad.addColorStop(0, '#2a3a4a'); floorGrad.addColorStop(1, '#111820');
  ctx.fillStyle = floorGrad; ctx.fillRect(0, floorY, W, H - floorY);
  ctx.fillStyle = 'rgba(241,196,15,0.3)'; ctx.fillRect(0, floorY, W, 1.5);
}

function showSimultaneousGameResult(results, onNext) {
  showScreen('screen-mg-result');
  const ranked = [...results]
    .map((r, i) => ({ ...r, playerIdx: i }))
    .sort((a, b) => b.score - a.score);

  const winner    = ranked[0];
  const winnerCol = PLAYER_COLORS[winner.playerIdx] || '#F1C40F';
  const medals    = ['🥇','🥈','🥉','4️⃣'];

  // Title with winner colour
  const titleEl = document.getElementById('mgr-title');
  titleEl.textContent = `${winner.playerName} Wins!`;
  titleEl.style.color = winnerCol;
  titleEl.style.textShadow = `0 0 20px ${winnerCol}66`;

  document.getElementById('mgr-game').textContent   = winner.gameName || '';
  document.getElementById('mgr-player').textContent = '';
  document.getElementById('mgr-total').textContent  = '';

  // Podium
  const podiumCv = document.getElementById('mgr-podium');
  if (podiumCv) {
    podiumCv.style.display = 'block';
    _drawMGPodium(podiumCv, ranked);
  }

  // Score rows
  document.getElementById('mgr-score').innerHTML = ranked.map((r, i) => {
    const col = PLAYER_COLORS[r.playerIdx] || '#aaa';
    const big = i === 0;
    return `
    <div style="display:flex;align-items:center;gap:12px;
      background:${big ? `rgba(${_hexToRgb(col)},0.1)` : 'rgba(255,255,255,0.03)'};
      border:1.5px solid ${big ? col+'44' : 'rgba(255,255,255,0.06)'};
      border-radius:14px;padding:${big?'12px 14px':'9px 12px'};margin-bottom:8px;text-align:left;
      transition: all 0.3s;">
      <span style="font-size:${big?'28px':'20px'}">${medals[i]||('#'+(i+1))}</span>
      <span style="flex:1;font-size:${big?'16px':'13px'};font-weight:900;color:${col}">${r.playerName}</span>
      <div style="text-align:right">
        <div style="font-size:${big?'22px':'16px'};font-weight:900;color:${big?'#FFD700':'#888'}">${r.score} pts</div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('mgr-next-btn').textContent = 'Next Game →';
  document.getElementById('mgr-next-btn').style.cssText = `font-size:17px; padding:18px; border-radius:18px;`;
  document.getElementById('mgr-next-btn').onclick = () => {
    if (_confettiRaf) { cancelAnimationFrame(_confettiRaf); _confettiRaf = null; }
    const mgrcv = document.getElementById('mgr-confetti');
    if (mgrcv) mgrcv.style.display = 'none';
    Audio.playClick(); onNext();
  };

  _spawnConfetti(90);
  _startConfettiLoop('mgr-confetti', 5);
  Audio.playWin();
}

function _hexToRgb(hex) {
  // Expand shorthand #abc → #aabbcc
  if (hex.length === 4) hex = '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
  const r = parseInt(hex.slice(1,3),16) || 0;
  const g = parseInt(hex.slice(3,5),16) || 0;
  const b = parseInt(hex.slice(5,7),16) || 0;
  return `${r},${g},${b}`;
}

// ── ENTRYPOINT ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', init);
