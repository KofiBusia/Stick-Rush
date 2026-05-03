// ═══════════════════════════════════════════════════════
//  STICK RUSH — WORLD-CLASS COSTUME SYSTEM v2
// ═══════════════════════════════════════════════════════

const COSTUME_TIERS = {
  Common:    { emoji:'⚪', label:'Common',    color:'#aaa',     unlockScore:0     },
  Rare:      { emoji:'🔵', label:'Rare',      color:'#3498DB',  unlockScore:200   },
  Epic:      { emoji:'💜', label:'Epic',      color:'#9B59B6',  unlockScore:500   },
  Legendary: { emoji:'🟡', label:'Legendary', color:'#F1C40F',  unlockScore:1000  },
  Mythic:    { emoji:'🔴', label:'Mythic',    color:'#E74C3C',  unlockScore:2000  },
};

const COSTUMES = {
  // ── COMMON ─────────────────────────────────────────────
  default:      { id:'default',      name:'Classic Runner',    tier:'Common',    body:'#F1C40F', head:'#F1C40F', accent:'#D4AC0D', unlockReq:'Always unlocked',        glow:null,      extras:[] },
  redathlete:   { id:'redathlete',   name:'Red Athlete',       tier:'Common',    body:'#E74C3C', head:'#E74C3C', accent:'#922B21', unlockReq:'Always unlocked',        glow:null,      extras:[] },
  bluestar:     { id:'bluestar',     name:'Blue Star',         tier:'Common',    body:'#3498DB', head:'#3498DB', accent:'#1A5276', unlockReq:'Always unlocked',        glow:null,      extras:[] },
  greenrunner:  { id:'greenrunner',  name:'Green Runner',      tier:'Common',    body:'#2ECC71', head:'#2ECC71', accent:'#1E8449', unlockReq:'Always unlocked',        glow:null,      extras:[] },
  purpleace:    { id:'purpleace',    name:'Purple Ace',        tier:'Common',    body:'#9B59B6', head:'#9B59B6', accent:'#6C3483', unlockReq:'Play 3 rounds',          glow:null,      extras:[] },
  // ── RARE ───────────────────────────────────────────────
  ninjastrike:  { id:'ninjastrike',  name:'Ninja Strike',      tier:'Rare',      body:'#2C3E50', head:'#E74C3C', accent:'#E74C3C', unlockReq:'Score 300+ in a round',  glow:'#E74C3C', extras:['mask','belt'] },
  blazerunner:  { id:'blazerunner',  name:'Blaze Runner',      tier:'Rare',      body:'#E67E22', head:'#F39C12', accent:'#D35400', unlockReq:'Win 5 mini-games',       glow:'#F39C12', extras:['flames'] },
  cosmickid:    { id:'cosmickid',    name:'Cosmic Kid',        tier:'Rare',      body:'#8E44AD', head:'#9B59B6', accent:'#F8C471', unlockReq:'Answer 10 Q&A correctly', glow:'#9B59B6', extras:['stars'] },
  goldensprint: { id:'goldensprint', name:'Golden Sprint',     tier:'Rare',      body:'#F1C40F', head:'#F39C12', accent:'#fff',    unlockReq:'Complete Round 2',       glow:'#F1C40F', extras:['crown_small'] },
  icewarrior:   { id:'icewarrior',   name:'Ice Warrior',       tier:'Rare',      body:'#AED6F1', head:'#85C1E9', accent:'#2980B9', unlockReq:'Score 500+ total',       glow:'#AED6F1', extras:['armor'] },
  // ── EPIC ───────────────────────────────────────────────
  shadowphantom:{ id:'shadowphantom',name:'Shadow Phantom',    tier:'Epic',      body:'#1C2833', head:'#7F8C8D', accent:'#E74C3C', unlockReq:'Score 800+ total',       glow:'#E74C3C', extras:['mask','cape'] },
  electricstorm:{ id:'electricstorm',name:'Electric Storm',    tier:'Epic',      body:'#F4D03F', head:'#F1C40F', accent:'#1ABC9C', unlockReq:'Win 10 mini-games',      glow:'#1ABC9C', extras:['lightning','cape'] },
  galaxywarrior:{ id:'galaxywarrior',name:'Galaxy Warrior',    tier:'Epic',      body:'#154360', head:'#1A5276', accent:'#A9CCE3', unlockReq:'Complete Round 3',       glow:'#5DADE2', extras:['cape','stars'] },
  lavaKing:     { id:'lavaKing',     name:'Lava King',         tier:'Epic',      body:'#C0392B', head:'#E74C3C', accent:'#F39C12', unlockReq:'Score 1000+ total',      glow:'#E74C3C', extras:['flames','crown_small'] },
  forestsage:   { id:'forestsage',   name:'Forest Sage',       tier:'Epic',      body:'#1E8449', head:'#27AE60', accent:'#F1C40F', unlockReq:'Answer 25 Q&A correctly',glow:'#2ECC71', extras:['cape','stars'] },
  // ── LEGENDARY ──────────────────────────────────────────
  goldchampion: { id:'goldchampion', name:'Golden Champion',   tier:'Legendary', body:'#F1C40F', head:'#F39C12', accent:'#fff',    unlockReq:'Score 1500+ total',      glow:'#F1C40F', extras:['crown','cape','aura'] },
  dragonlord:   { id:'dragonlord',   name:'Dragon Overlord',   tier:'Legendary', body:'#922B21', head:'#E74C3C', accent:'#F39C12', unlockReq:'Win 20 mini-games',      glow:'#E74C3C', extras:['wings','crown','flames'] },
  crystalangel: { id:'crystalangel', name:'Crystal Angel',     tier:'Legendary', body:'#D5D8DC', head:'#F0F3F4', accent:'#5DADE2', unlockReq:'Complete 5 rounds',      glow:'#85C1E9', extras:['wings','aura','stars'] },
  // ── MYTHIC ─────────────────────────────────────────────
  quantumlegend:{ id:'quantumlegend',name:'Quantum Legend',    tier:'Mythic',    body:'#1A1A2E', head:'#E74C3C', accent:'#F1C40F', unlockReq:'Score 2000+ total',      glow:'#E74C3C', extras:['wings','crown','cape','aura','lightning'] },
  ancientgod:   { id:'ancientgod',   name:'Ancient God',       tier:'Mythic',    body:'#F1C40F', head:'#fff',    accent:'#E74C3C', unlockReq:'Win 30 mini-games',      glow:'#F1C40F', extras:['crown','cape','aura','stars','flames'] },
};

// ── WORLD-CLASS STICKMAN RENDERER ──────────────────────
function drawStickman(ctx, cx, cy, costumeIdOrObj, opts = {}) {
  const c = (typeof costumeIdOrObj === 'string')
    ? (COSTUMES[costumeIdOrObj] || COSTUMES.default)
    : (costumeIdOrObj || COSTUMES.default);

  const scale   = opts.scale   || 1;
  const frame   = opts.frame   || 0;
  const running = opts.running !== false;
  const jumping = opts.jumping || false;

  ctx.save();

  // Glow effect for rare+ costumes
  if (c.glow) {
    ctx.shadowColor = c.glow;
    ctx.shadowBlur  = 18 * scale;
  }

  // Body measurements
  const headR   = 13  * scale;
  const bodyLen = 28  * scale;
  const legLen  = 24  * scale;
  const armLen  = 20  * scale;
  const lw      = Math.max(2, 3.5 * scale);

  // Animation angles
  const t       = frame * 0.18;
  const legSwing = running ? Math.sin(t) * 0.55 : 0;
  const armSwing = running ? Math.sin(t) * 0.45 : 0;
  const bounce   = running ? Math.abs(Math.sin(t)) * 3 * scale : 0;
  const jumpAng  = jumping ? -0.3 : 0;

  const headY = cy - legLen - bodyLen - headR + bounce;
  const neckY = headY + headR;
  const hipY  = neckY + bodyLen;

  // ── HEAD ───────────────────────────────────────────────
  // Head glow ring
  if (c.glow) {
    ctx.beginPath();
    ctx.arc(cx, headY, headR + 5 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = c.glow + '44';
    ctx.lineWidth   = 3 * scale;
    ctx.stroke();
  }

  // Head gradient
  const headGrad = ctx.createRadialGradient(cx - headR * 0.3, headY - headR * 0.3, headR * 0.1, cx, headY, headR);
  headGrad.addColorStop(0, lighten(c.head, 40));
  headGrad.addColorStop(1, c.head);
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.fillStyle   = headGrad;
  ctx.fill();
  ctx.strokeStyle = c.accent;
  ctx.lineWidth   = lw * 0.6;
  ctx.stroke();

  // Eyes
  const eyeY = headY - headR * 0.1;
  const eyeX = headR * 0.32;
  [[cx - eyeX, eyeY], [cx + eyeX, eyeY]].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.arc(ex, ey, headR * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + headR * 0.05, ey + headR * 0.05, headR * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
  });

  // Smile
  ctx.beginPath();
  ctx.arc(cx, headY + headR * 0.2, headR * 0.35, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth   = lw * 0.5;
  ctx.stroke();

  // ── BODY ───────────────────────────────────────────────
  const bodyGrad = ctx.createLinearGradient(cx - 8 * scale, neckY, cx + 8 * scale, hipY);
  bodyGrad.addColorStop(0, lighten(c.body, 20));
  bodyGrad.addColorStop(1, c.body);
  ctx.beginPath();
  ctx.moveTo(cx, neckY);
  ctx.lineTo(cx, hipY);
  ctx.strokeStyle = bodyGrad;
  ctx.lineWidth   = lw * 1.4;
  ctx.lineCap     = 'round';
  ctx.stroke();

  // Joint dots
  [[cx, neckY], [cx, hipY]].forEach(([jx, jy]) => {
    ctx.beginPath();
    ctx.arc(jx, jy, lw * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = c.accent;
    ctx.fill();
  });

  // ── ARMS ───────────────────────────────────────────────
  const shoulderY = neckY + bodyLen * 0.22;
  const armAngL   = armSwing + jumpAng;
  const armAngR   = -armSwing + jumpAng;

  drawLimb(ctx, cx, shoulderY, cx - Math.cos(0.4 + armAngL) * armLen, shoulderY + Math.sin(0.4 + armAngL) * armLen, lw, c.body, c.accent);
  drawLimb(ctx, cx, shoulderY, cx + Math.cos(0.4 + armAngR) * armLen, shoulderY - Math.sin(0.4 + armAngR) * armLen, lw, c.body, c.accent);

  // ── LEGS ───────────────────────────────────────────────
  const legAngL  =  legSwing + jumpAng;
  const legAngR  = -legSwing + jumpAng;

  // Front leg (left)
  const lkx = cx - Math.sin(legAngL) * legLen * 0.55;
  const lky = hipY + Math.cos(Math.abs(legAngL)) * legLen * 0.55;
  const lfx = lkx + Math.sin(legAngL * 0.5) * legLen * 0.5;
  const lfy = Math.min(cy, lky + legLen * 0.5);
  drawLimb(ctx, cx, hipY, lkx, lky, lw, c.body, c.accent);
  drawLimb(ctx, lkx, lky, lfx, lfy, lw, c.body, c.accent);

  // Back leg (right)
  const rkx = cx + Math.sin(legAngR) * legLen * 0.55;
  const rky = hipY + Math.cos(Math.abs(legAngR)) * legLen * 0.55;
  const rfx = rkx - Math.sin(legAngR * 0.5) * legLen * 0.5;
  const rfy = Math.min(cy, rky + legLen * 0.5);
  drawLimb(ctx, cx, hipY, rkx, rky, lw, c.body, c.accent);
  drawLimb(ctx, rkx, rky, rfx, rfy, lw, c.body, c.accent);

  // ── EXTRAS ─────────────────────────────────────────────
  ctx.shadowBlur = 0;
  if (c.extras && c.extras.length > 0) drawExtras(ctx, cx, headY, neckY, hipY, cy, scale, c, frame, lw);

  ctx.restore();
}

function drawLimb(ctx, x1, y1, x2, y2, lw, bodyColor, accentColor) {
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, bodyColor);
  g.addColorStop(1, darken(bodyColor, 20));
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = g;
  ctx.lineWidth   = lw * 1.2;
  ctx.lineCap     = 'round';
  ctx.stroke();
  // Joint circle at end
  ctx.beginPath();
  ctx.arc(x2, y2, lw * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = accentColor;
  ctx.fill();
}

function drawExtras(ctx, cx, headY, neckY, hipY, groundY, scale, c, frame, lw) {
  const extras = c.extras || [];
  const t = frame * 0.08;

  // CAPE
  if (extras.includes('cape')) {
    const capeW = 22 * scale;
    const capeH = 36 * scale;
    ctx.save();
    const capeSwing = Math.sin(t) * 8 * scale;
    ctx.beginPath();
    ctx.moveTo(cx, neckY + 4 * scale);
    ctx.quadraticCurveTo(cx - capeW + capeSwing, neckY + capeH * 0.5, cx - capeW * 0.6 + capeSwing, hipY + capeH * 0.4);
    ctx.quadraticCurveTo(cx - capeW * 0.3, hipY + capeH * 0.6, cx, hipY + 4 * scale);
    const capeGrad = ctx.createLinearGradient(cx - capeW, neckY, cx, hipY + capeH);
    capeGrad.addColorStop(0, c.accent);
    capeGrad.addColorStop(1, c.accent + '88');
    ctx.fillStyle = capeGrad;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // CROWN
  if (extras.includes('crown')) {
    const cw = 18 * scale, ch = 12 * scale;
    const cy2 = headY - 13 * scale - ch * 0.5;
    ctx.save();
    ctx.fillStyle = '#F1C40F';
    ctx.strokeStyle = '#D4AC0D';
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - cw, cy2 + ch);
    ctx.lineTo(cx - cw, cy2);
    ctx.lineTo(cx - cw * 0.3, cy2 + ch * 0.5);
    ctx.lineTo(cx, cy2 - ch * 0.3);
    ctx.lineTo(cx + cw * 0.3, cy2 + ch * 0.5);
    ctx.lineTo(cx + cw, cy2);
    ctx.lineTo(cx + cw, cy2 + ch);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Gems
    [cx - cw * 0.5, cx, cx + cw * 0.5].forEach((gx, i) => {
      ctx.beginPath(); ctx.arc(gx, cy2 + ch * 0.3, 3 * scale, 0, Math.PI * 2);
      ctx.fillStyle = ['#E74C3C','#fff','#3498DB'][i]; ctx.fill();
    });
    ctx.restore();
  }

  // SMALL CROWN
  if (extras.includes('crown_small')) {
    const cw = 10 * scale, ch = 7 * scale;
    const cy2 = headY - 13 * scale - ch * 0.5;
    ctx.save();
    ctx.fillStyle = '#F1C40F';
    ctx.beginPath();
    ctx.moveTo(cx - cw, cy2 + ch); ctx.lineTo(cx - cw, cy2);
    ctx.lineTo(cx - cw * 0.3, cy2 + ch * 0.5); ctx.lineTo(cx, cy2 - ch * 0.2);
    ctx.lineTo(cx + cw * 0.3, cy2 + ch * 0.5); ctx.lineTo(cx + cw, cy2);
    ctx.lineTo(cx + cw, cy2 + ch); ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // MASK
  if (extras.includes('mask')) {
    ctx.save();
    ctx.fillStyle = c.accent + 'cc';
    ctx.beginPath();
    ctx.ellipse(cx, headY + 2 * scale, 10 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // BELT
  if (extras.includes('belt')) {
    const beltY = neckY + (hipY - neckY) * 0.65;
    ctx.save();
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - 12 * scale, beltY);
    ctx.lineTo(cx + 12 * scale, beltY);
    ctx.stroke();
    ctx.fillStyle = c.accent;
    ctx.fillRect(cx - 4 * scale, beltY - 4 * scale, 8 * scale, 8 * scale);
    ctx.restore();
  }

  // WINGS
  if (extras.includes('wings')) {
    const wingSpan = 30 * scale;
    const wingY = neckY + 8 * scale;
    const flapY = Math.sin(t * 2) * 6 * scale;
    ctx.save();
    // Left wing
    ctx.beginPath();
    ctx.moveTo(cx - 4 * scale, wingY);
    ctx.bezierCurveTo(cx - wingSpan, wingY - 16 * scale + flapY, cx - wingSpan * 0.7, wingY + 20 * scale, cx - 6 * scale, wingY + 14 * scale);
    ctx.closePath();
    const wingGradL = ctx.createLinearGradient(cx - wingSpan, wingY, cx, wingY);
    wingGradL.addColorStop(0, c.accent + 'aa');
    wingGradL.addColorStop(1, c.accent);
    ctx.fillStyle = wingGradL;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(cx + 4 * scale, wingY);
    ctx.bezierCurveTo(cx + wingSpan, wingY - 16 * scale + flapY, cx + wingSpan * 0.7, wingY + 20 * scale, cx + 6 * scale, wingY + 14 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // FLAMES
  if (extras.includes('flames')) {
    ctx.save();
    const flameColors = ['#F39C12','#E74C3C','#F1C40F'];
    for (let i = 0; i < 5; i++) {
      const fx = cx + (i - 2) * 8 * scale;
      const fh = (15 + Math.sin(t * 3 + i) * 6) * scale;
      ctx.beginPath();
      ctx.moveTo(fx, groundY);
      ctx.quadraticCurveTo(fx - 5 * scale, groundY - fh * 0.5, fx, groundY - fh);
      ctx.quadraticCurveTo(fx + 5 * scale, groundY - fh * 0.5, fx, groundY);
      ctx.fillStyle = flameColors[i % flameColors.length] + 'bb';
      ctx.fill();
    }
    ctx.restore();
  }

  // LIGHTNING
  if (extras.includes('lightning')) {
    ctx.save();
    ctx.strokeStyle = '#F1C40F';
    ctx.lineWidth = 2 * scale;
    ctx.shadowColor = '#F1C40F';
    ctx.shadowBlur = 10 * scale;
    const lx = cx + 20 * scale;
    ctx.beginPath();
    ctx.moveTo(lx, headY - 5 * scale);
    ctx.lineTo(lx - 6 * scale, headY + 10 * scale);
    ctx.lineTo(lx + 2 * scale, headY + 10 * scale);
    ctx.lineTo(lx - 6 * scale, headY + 26 * scale);
    ctx.stroke();
    ctx.restore();
  }

  // STARS / SPARKLES
  if (extras.includes('stars')) {
    ctx.save();
    const starPositions = [
      [cx - 20 * scale, headY - 10 * scale],
      [cx + 20 * scale, headY - 5 * scale],
      [cx + 16 * scale, hipY - 10 * scale],
    ];
    starPositions.forEach(([sx, sy], i) => {
      const pulse = 0.6 + Math.sin(t * 2 + i * 1.2) * 0.4;
      ctx.globalAlpha = pulse;
      drawStar(ctx, sx, sy, 4 * scale, c.glow || '#F1C40F');
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // AURA
  if (extras.includes('aura')) {
    ctx.save();
    const auraR = 35 * scale + Math.sin(t) * 5 * scale;
    const auraCY = neckY + (hipY - neckY) * 0.5;
    const auraGrad = ctx.createRadialGradient(cx, auraCY, 10 * scale, cx, auraCY, auraR);
    auraGrad.addColorStop(0, (c.glow || '#F1C40F') + '33');
    auraGrad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, auraCY, auraR, 0, Math.PI * 2);
    ctx.fillStyle = auraGrad;
    ctx.fill();
    ctx.restore();
  }
}

function drawStar(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function lighten(hex, pct) {
  try {
    const n = parseInt(hex.replace('#',''), 16);
    const r = Math.min(255, (n >> 16) + pct);
    const g = Math.min(255, ((n >> 8) & 0xff) + pct);
    const b = Math.min(255, (n & 0xff) + pct);
    return `rgb(${r},${g},${b})`;
  } catch(e) { return hex; }
}

function darken(hex, pct) {
  try {
    const n = parseInt(hex.replace('#',''), 16);
    const r = Math.max(0, (n >> 16) - pct);
    const g = Math.max(0, ((n >> 8) & 0xff) - pct);
    const b = Math.max(0, (n & 0xff) - pct);
    return `rgb(${r},${g},${b})`;
  } catch(e) { return hex; }
}

function getUnlockedCostumes(playerData) {
  const { totalScore=0, highestRound=0, totalQACorrect=0, minigameWins=0 } = playerData;
  const unlocked = [];
  Object.values(COSTUMES).forEach(c => {
    const tier = COSTUME_TIERS[c.tier];
    if (!tier) return;
    let ok = false;
    if (c.tier === 'Common') ok = true;
    else if (c.tier === 'Rare')      ok = totalScore >= 200   || minigameWins >= 5  || totalQACorrect >= 10 || highestRound >= 2;
    else if (c.tier === 'Epic')      ok = totalScore >= 500   || minigameWins >= 10 || totalQACorrect >= 25 || highestRound >= 3;
    else if (c.tier === 'Legendary') ok = totalScore >= 1000  || minigameWins >= 20 || highestRound >= 5;
    else if (c.tier === 'Mythic')    ok = totalScore >= 2000  || minigameWins >= 30;
    if (ok) unlocked.push(c.id);
  });
  return unlocked;
}
