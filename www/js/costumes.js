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
  // ── HERO PLAYERS (Ghanaian names, always unlocked) ─────
  kofi:         { id:'kofi',         name:'Kofi',             tier:'Common',    body:'#E8312A', head:'#FFAA80', accent:'#FFD700', unlockReq:'Always unlocked',        glow:'#FF5533',  extras:[], hair:'spiky',       chibi:true },
  ama:          { id:'ama',          name:'Ama',              tier:'Common',    body:'#1AA8E8', head:'#AADEFF', accent:'#FF88CC', unlockReq:'Always unlocked',        glow:'#44CCFF',  extras:[], hair:'ponytail',    chibi:true },
  kwame:        { id:'kwame',        name:'Kwame',            tier:'Common',    body:'#22C45A', head:'#AAFFCC', accent:'#FFEE44', unlockReq:'Always unlocked',        glow:'#44FF88',  extras:[], hair:'afro',        chibi:true },
  abena:        { id:'abena',        name:'Abena',            tier:'Common',    body:'#A044CC', head:'#EEBEFF', accent:'#FFD700', unlockReq:'Always unlocked',        glow:'#CC66FF',  extras:[], hair:'crown_small',  chibi:true },
  // ── CLASSIC ────────────────────────────────────────────
  default:      { id:'default',      name:'Classic Runner',   tier:'Common',    body:'#F1C40F', head:'#F1C40F', accent:'#D4AC0D', unlockReq:'Always unlocked',        glow:null,       extras:[], hair:null        },
  redathlete:   { id:'redathlete',   name:'Red Athlete',      tier:'Common',    body:'#E74C3C', head:'#E74C3C', accent:'#922B21', unlockReq:'Always unlocked',        glow:null,       extras:[], hair:null        },
  bluestar:     { id:'bluestar',     name:'Blue Star',        tier:'Common',    body:'#3498DB', head:'#3498DB', accent:'#1A5276', unlockReq:'Always unlocked',        glow:null,       extras:[], hair:null        },
  greenrunner:  { id:'greenrunner',  name:'Green Runner',     tier:'Common',    body:'#2ECC71', head:'#2ECC71', accent:'#1E8449', unlockReq:'Always unlocked',        glow:null,       extras:[], hair:null        },
  purpleace:    { id:'purpleace',    name:'Purple Ace',       tier:'Common',    body:'#9B59B6', head:'#9B59B6', accent:'#6C3483', unlockReq:'Play 3 rounds',          glow:null,       extras:[], hair:null        },
  // ── RARE ───────────────────────────────────────────────
  ninjastrike:  { id:'ninjastrike',  name:'Ninja Strike',      tier:'Rare',      body:'#2C3E50', head:'#E74C3C', accent:'#E74C3C', unlockReq:'Score 300+ in a round',  glow:'#E74C3C', extras:['mask','belt'],              hair:null },
  blazerunner:  { id:'blazerunner',  name:'Blaze Runner',      tier:'Rare',      body:'#E67E22', head:'#F39C12', accent:'#D35400', unlockReq:'Win 5 mini-games',       glow:'#F39C12', extras:['flames'],                   hair:'spiky' },
  cosmickid:    { id:'cosmickid',    name:'Cosmic Kid',        tier:'Rare',      body:'#8E44AD', head:'#9B59B6', accent:'#F8C471', unlockReq:'Answer 10 Q&A correctly', glow:'#9B59B6', extras:['stars'],                   hair:'afro' },
  goldensprint: { id:'goldensprint', name:'Golden Sprint',     tier:'Rare',      body:'#F1C40F', head:'#F39C12', accent:'#fff',    unlockReq:'Complete Round 2',       glow:'#F1C40F', extras:['crown_small'],              hair:null },
  icewarrior:   { id:'icewarrior',   name:'Ice Warrior',       tier:'Rare',      body:'#AED6F1', head:'#85C1E9', accent:'#2980B9', unlockReq:'Score 500+ total',       glow:'#AED6F1', extras:[],                          hair:'ponytail' },
  // ── EPIC ───────────────────────────────────────────────
  shadowphantom:{ id:'shadowphantom',name:'Shadow Phantom',    tier:'Epic',      body:'#1C2833', head:'#7F8C8D', accent:'#E74C3C', unlockReq:'Score 800+ total',       glow:'#E74C3C', extras:['mask','cape'],              hair:null },
  electricstorm:{ id:'electricstorm',name:'Electric Storm',    tier:'Epic',      body:'#F4D03F', head:'#F1C40F', accent:'#1ABC9C', unlockReq:'Win 10 mini-games',      glow:'#1ABC9C', extras:['lightning','cape'],         hair:'spiky' },
  galaxywarrior:{ id:'galaxywarrior',name:'Galaxy Warrior',    tier:'Epic',      body:'#154360', head:'#1A5276', accent:'#A9CCE3', unlockReq:'Complete Round 3',       glow:'#5DADE2', extras:['cape','stars'],             hair:'afro' },
  lavaKing:     { id:'lavaKing',     name:'Lava King',         tier:'Epic',      body:'#C0392B', head:'#E74C3C', accent:'#F39C12', unlockReq:'Score 1000+ total',      glow:'#E74C3C', extras:['flames','crown_small'],     hair:null },
  forestsage:   { id:'forestsage',   name:'Forest Sage',       tier:'Epic',      body:'#1E8449', head:'#27AE60', accent:'#F1C40F', unlockReq:'Answer 25 Q&A correctly',glow:'#2ECC71', extras:['cape','stars'],             hair:'afro' },
  // ── LEGENDARY ──────────────────────────────────────────
  goldchampion: { id:'goldchampion', name:'Golden Champion',   tier:'Legendary', body:'#F1C40F', head:'#F39C12', accent:'#fff',    unlockReq:'Score 1500+ total',      glow:'#F1C40F', extras:['crown','cape','aura'],      hair:null },
  dragonlord:   { id:'dragonlord',   name:'Dragon Overlord',   tier:'Legendary', body:'#922B21', head:'#E74C3C', accent:'#F39C12', unlockReq:'Win 20 mini-games',      glow:'#E74C3C', extras:['wings','crown','flames'],   hair:null },
  crystalangel: { id:'crystalangel', name:'Crystal Angel',     tier:'Legendary', body:'#D5D8DC', head:'#F0F3F4', accent:'#5DADE2', unlockReq:'Complete 5 rounds',      glow:'#85C1E9', extras:['wings','aura','stars'],    hair:'ponytail' },
  // ── MYTHIC ─────────────────────────────────────────────
  quantumlegend:{ id:'quantumlegend',name:'Quantum Legend',    tier:'Mythic',    body:'#1A1A2E', head:'#E74C3C', accent:'#F1C40F', unlockReq:'Score 2000+ total',      glow:'#E74C3C', extras:['wings','crown','cape','aura','lightning'], hair:'spiky' },
  ancientgod:   { id:'ancientgod',   name:'Ancient God',       tier:'Mythic',    body:'#F1C40F', head:'#fff',    accent:'#E74C3C', unlockReq:'Win 30 mini-games',      glow:'#F1C40F', extras:['crown','cape','aura','stars','flames'],    hair:'crown_small' },
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

  // Hero characters use their own full cartoon renderer
  if (c.chibi) {
    _drawHeroFull(ctx, cx, cy, c, opts);
    ctx.restore();
    return;
  }

  // Body measurements
  const isHero  = false;
  const headR   = (isHero ? 21  : 17) * scale;
  const bodyLen = (isHero ? 25  : 30) * scale;
  const legLen  = (isHero ? 23  : 26) * scale;
  const armLen  = (isHero ? 20  : 22) * scale;
  const lw      = Math.max(2.5, 4 * scale);

  // Animation
  const t        = frame * 0.18;
  const legSwing = running ? Math.sin(t) * 0.55 : 0;
  const armSwing = running ? Math.sin(t) * 0.45 : 0;
  const bounce   = running ? Math.abs(Math.sin(t)) * 3 * scale : 0;
  const jumpAng  = jumping ? -0.3 : 0;

  const headY = cy - legLen - bodyLen - headR + bounce;
  const neckY = headY + headR;
  const hipY  = neckY + bodyLen;

  // ── GLOW (radial, soft) ────────────────────────────────
  if (c.glow) {
    const glowCY = neckY + (hipY - neckY) * 0.5;
    const gr = ctx.createRadialGradient(cx, glowCY, 4 * scale, cx, glowCY, 54 * scale);
    gr.addColorStop(0,   c.glow + '55');
    gr.addColorStop(0.5, c.glow + '22');
    gr.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.arc(cx, glowCY, 54 * scale, 0, Math.PI * 2);
    ctx.fillStyle = gr;
    ctx.fill();
  }

  // ── BEHIND EXTRAS (aura, cape, wings) ─────────────────
  if (c.extras && c.extras.length > 0)
    _drawExtras(ctx, cx, headY, neckY, hipY, cy, scale, c, frame, lw, ['aura','cape','wings']);

  // ── BODY (spine, two-pass) ─────────────────────────────
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, neckY); ctx.lineTo(cx, hipY);
  ctx.strokeStyle = darken(c.body, 45); ctx.lineWidth = lw * 2.0; ctx.stroke();
  const bodyGrad = ctx.createLinearGradient(cx - 6*scale, neckY, cx + 6*scale, hipY);
  bodyGrad.addColorStop(0, lighten(c.body, 28)); bodyGrad.addColorStop(1, c.body);
  ctx.beginPath(); ctx.moveTo(cx, neckY); ctx.lineTo(cx, hipY);
  ctx.strokeStyle = bodyGrad; ctx.lineWidth = lw * 1.35; ctx.stroke();

  // Shoulder bar
  const shoulderY = neckY + bodyLen * 0.18;
  const shoulderW = armLen * 0.4;
  ctx.beginPath(); ctx.moveTo(cx - shoulderW, shoulderY); ctx.lineTo(cx + shoulderW, shoulderY);
  ctx.strokeStyle = darken(c.body, 35); ctx.lineWidth = lw * 1.6; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - shoulderW, shoulderY); ctx.lineTo(cx + shoulderW, shoulderY);
  ctx.strokeStyle = lighten(c.body, 18); ctx.lineWidth = lw * 0.9; ctx.stroke();

  // ── ARMS ──────────────────────────────────────────────
  const armAngL = armSwing + jumpAng;
  const armAngR = -armSwing + jumpAng;
  drawLimb(ctx, cx, shoulderY, cx - Math.cos(0.4 + armAngL) * armLen, shoulderY + Math.sin(0.4 + armAngL) * armLen, lw, c.body, c.accent);
  drawLimb(ctx, cx, shoulderY, cx + Math.cos(0.4 + armAngR) * armLen, shoulderY - Math.sin(0.4 + armAngR) * armLen, lw, c.body, c.accent);

  // ── LEGS ──────────────────────────────────────────────
  const legAngL = legSwing + jumpAng;
  const legAngR = -legSwing + jumpAng;
  const lkx = cx - Math.sin(legAngL) * legLen * 0.55;
  const lky = hipY + Math.cos(Math.abs(legAngL)) * legLen * 0.55;
  const lfx = lkx + Math.sin(legAngL * 0.5) * legLen * 0.5;
  const lfy = Math.min(cy, lky + legLen * 0.5);
  drawLimb(ctx, cx, hipY, lkx, lky, lw, c.body, c.accent);
  drawLimb(ctx, lkx, lky, lfx, lfy, lw, c.body, c.accent);
  const rkx = cx + Math.sin(legAngR) * legLen * 0.55;
  const rky = hipY + Math.cos(Math.abs(legAngR)) * legLen * 0.55;
  const rfx = rkx - Math.sin(legAngR * 0.5) * legLen * 0.5;
  const rfy = Math.min(cy, rky + legLen * 0.5);
  drawLimb(ctx, cx, hipY, rkx, rky, lw, c.body, c.accent);
  drawLimb(ctx, rkx, rky, rfx, rfy, lw, c.body, c.accent);

  // Hip & neck joints — two-layer
  [[cx, neckY],[cx, hipY]].forEach(([jx, jy]) => {
    ctx.beginPath(); ctx.arc(jx, jy, lw * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = darken(c.body, 38); ctx.fill();
    ctx.beginPath(); ctx.arc(jx, jy, lw * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = c.accent; ctx.fill();
  });

  // ── HEAD ──────────────────────────────────────────────
  // Dark outline ring
  ctx.beginPath();
  ctx.arc(cx, headY, headR + 1.8 * scale, 0, Math.PI * 2);
  ctx.fillStyle = darken(c.head, 42);
  ctx.fill();

  // 3D sphere gradient (3 stops)
  const hg = ctx.createRadialGradient(
    cx - headR * 0.35, headY - headR * 0.38, headR * 0.04,
    cx, headY, headR
  );
  hg.addColorStop(0,   lighten(c.head, 65));
  hg.addColorStop(0.5, lighten(c.head, 18));
  hg.addColorStop(1,   darken(c.head, 22));
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.fillStyle = hg;
  ctx.fill();

  // Eyebrows — angle with state
  const browY     = headY - headR * 0.36;
  const browX     = headR * 0.32;
  const browAngle = running ? 0.28 : (jumping ? -0.22 : 0);
  ctx.strokeStyle = darken(c.head, 55);
  ctx.lineWidth   = lw * 0.6;
  ctx.lineCap     = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - browX - headR * 0.15, browY + browAngle * headR * 0.35);
  ctx.lineTo(cx - browX + headR * 0.15, browY - browAngle * headR * 0.35);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + browX - headR * 0.15, browY - browAngle * headR * 0.35);
  ctx.lineTo(cx + browX + headR * 0.15, browY + browAngle * headR * 0.35);
  ctx.stroke();

  // Eyes — chibi heroes get big cartoon eyes
  const eyeY = headY + headR * (isHero ? -0.02 : 0.02);
  const eyeX = headR * (isHero ? 0.34 : 0.32);
  const eyeR = headR * (isHero ? 0.29 : 0.22);
  [[cx - eyeX, eyeY],[cx + eyeX, eyeY]].forEach(([ex, ey]) => {
    ctx.beginPath(); ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = '#222'; ctx.lineWidth = (isHero ? 1.5 : 0.9) * scale; ctx.stroke();
    if (isHero) {
      // Thick top eyelash
      ctx.beginPath();
      ctx.arc(ex, ey - eyeR * 0.04, eyeR * 0.94, Math.PI + 0.28, -0.28);
      ctx.strokeStyle = '#222'; ctx.lineWidth = scale * 2.4; ctx.lineCap = 'round'; ctx.stroke();
      // Big coloured iris
      ctx.beginPath(); ctx.arc(ex + eyeR * 0.08, ey + eyeR * 0.06, eyeR * 0.70, 0, Math.PI * 2);
      ctx.fillStyle = c.accent; ctx.fill();
      // Pupil
      ctx.beginPath(); ctx.arc(ex + eyeR * 0.10, ey + eyeR * 0.08, eyeR * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = '#111'; ctx.fill();
      // Big highlight
      ctx.beginPath(); ctx.arc(ex - eyeR * 0.10, ey - eyeR * 0.20, eyeR * 0.26, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill();
      // Small sparkle dot
      ctx.beginPath(); ctx.arc(ex + eyeR * 0.24, ey + eyeR * 0.04, eyeR * 0.13, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.80)'; ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(ex + eyeR * 0.14, ey + eyeR * 0.1, eyeR * 0.62, 0, Math.PI * 2);
      ctx.fillStyle = c.accent; ctx.fill();
      ctx.beginPath(); ctx.arc(ex + eyeR * 0.16, ey + eyeR * 0.12, eyeR * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = '#111'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex - eyeR * 0.04, ey - eyeR * 0.18, eyeR * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fill();
    }
  });

  // Mouth — chibi heroes always have a big happy smile
  const mouthY = headY + headR * (isHero ? 0.46 : 0.44);
  if (jumping && !isHero) {
    ctx.beginPath();
    ctx.ellipse(cx, mouthY, headR * 0.14, headR * 0.19, 0, 0, Math.PI * 2);
    ctx.fillStyle = darken(c.head, 60); ctx.fill();
  } else if (isHero) {
    // Big curved smile
    const smileR = headR * 0.34;
    ctx.beginPath();
    ctx.arc(cx, mouthY - headR * 0.08, smileR, 0.18, Math.PI - 0.18);
    ctx.strokeStyle = darken(c.head, 60);
    ctx.lineWidth = lw * 0.68; ctx.lineCap = 'round'; ctx.stroke();
    // Cheek blush marks
    ctx.save();
    ctx.globalAlpha = 0.38;
    ctx.fillStyle = '#FF7FAB';
    const bx = headR * 0.54, by = headY + headR * 0.26;
    ctx.beginPath(); ctx.ellipse(cx - bx, by, headR * 0.21, headR * 0.13, -0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + bx, by, headR * 0.21, headR * 0.13,  0.15, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(cx, mouthY - headR * 0.1, headR * 0.28, 0.22, Math.PI - 0.22);
    ctx.strokeStyle = darken(c.head, 55);
    ctx.lineWidth   = lw * 0.52;
    ctx.stroke();
  }

  // ── CHARACTER HAIR ─────────────────────────────────────
  if (c.hair) _drawCharacterHair(ctx, cx, headY, headR, scale, lw, c);

  // ── FRONT EXTRAS (crown, mask, flames …) ──────────────
  if (c.extras && c.extras.length > 0)
    _drawExtras(ctx, cx, headY, neckY, hipY, cy, scale, c, frame, lw,
      ['crown','crown_small','mask','belt','flames','lightning','stars']);

  ctx.restore();
}

// ── FULL CARTOON HERO RENDERER ────────────────────────────
function _drawHeroFull(ctx, cx, cy, c, opts) {
  var s       = opts.scale   || 1;
  var frame   = opts.frame   || 0;
  var running = opts.running !== false;
  var jumping = opts.jumping || false;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  var t      = frame * 0.18;
  var stride = running ? Math.sin(t) : 0;
  var bob    = running ? Math.abs(Math.sin(t * 2)) * 2.5 * s : (jumping ? -10 * s : 0);

  // Flat-design athletic proportions
  var headR  = 18 * s;
  var torsoH = 23 * s;
  var torsoW = 18 * s;
  var legH   = 27 * s;
  var legW   = 11 * s;
  var armH   = 19 * s;
  var armW   =  9 * s;
  var shH    =  7 * s;
  var shW    = 15 * s;
  var sockH  =  5 * s;
  var neckH  =  4 * s;

  var shY  = cy - shH;
  var hipY = shY - legH;
  var torY = hipY - torsoH;
  var nkY  = torY - neckH;
  var hdY  = nkY - headR + bob;

  var SKINS  = { kofi:'#8B5233', ama:'#C27A45', kwame:'#5A2D0C', abena:'#8B4513' };
  var PANTS  = { kofi:'#1A237E', ama:'#880E4F', kwame:'#1B5E20', abena:'#4A148C' };
  var SOCKS  = { kofi:'#FFFFFF', ama:'#FFFFFF', kwame:'#FFEE44', abena:'#FFD700'  };
  var SHOES  = { kofi:'#263238', ama:'#1A0020', kwame:'#1B2400', abena:'#120030'  };
  var skin    = SKINS[c.id] || '#8B5233';
  var pants   = PANTS[c.id] || darken(c.body, 30);
  var sockCol = SOCKS[c.id] || '#FFFFFF';
  var shoeCol = SHOES[c.id] || '#263238';

  var legOff  = stride * 13 * s;
  var legLift = Math.abs(stride) * 6 * s;
  var armOff  = stride * 9  * s;

  var fLX = cx - legW * 0.6 - legOff;
  var bLX = cx - legW * 0.6 + legOff;
  var fAY = torY + 4 * s - armOff;
  var bAY = torY + 4 * s + armOff;

  function rr(x, y, w, h, r, fill, stroke, sw) {
    r = Math.min(r, Math.min(w, h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,   x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,   y + h, r);
    ctx.arcTo(x,     y + h, x,   y,     r);
    ctx.arcTo(x,     y,     x + w, y,   r);
    ctx.closePath();
    if (fill)   { ctx.fillStyle   = fill;   ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw || s; ctx.stroke(); }
  }

  // Speed lines
  if (running) {
    var lbX = cx - torsoW * 0.8;
    var lines = [
      { y: torY + torsoH * 0.18, w: 30 * s, h: 4   * s },
      { y: torY + torsoH * 0.40, w: 46 * s, h: 4.5 * s },
      { y: torY + torsoH * 0.62, w: 34 * s, h: 4   * s },
      { y: hipY + legH   * 0.22, w: 24 * s, h: 3   * s },
      { y: hipY + legH   * 0.55, w: 32 * s, h: 3.5 * s },
    ];
    ctx.save();
    lines.forEach(function(ln) {
      ctx.globalAlpha = 0.16;
      rr(lbX - ln.w, ln.y - ln.h / 2, ln.w, ln.h, ln.h * 0.5, '#90A4AE', null);
    });
    ctx.restore();
  }

  // Ground shadow
  ctx.save(); ctx.globalAlpha = 0.10;
  ctx.beginPath(); ctx.ellipse(cx, cy + 2 * s, 22 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#000'; ctx.fill();
  ctx.restore();

  // Back leg + shoe (dimmed for depth)
  ctx.save(); ctx.globalAlpha = 0.68;
  rr(bLX, hipY, legW, legH - legLift * 0.4, 5*s, darken(pants,22), null);
  rr(bLX + s, hipY + (legH - legLift*0.4)*0.74, legW - 2*s, sockH, 3*s, darken(sockCol,10), null);
  rr(bLX - s, shY, shW, shH, 4*s, darken(shoeCol,25), null);
  ctx.restore();

  // Torso
  rr(cx - torsoW / 2, torY, torsoW, torsoH, 7*s, c.body, null);
  ctx.save(); ctx.globalAlpha = 0.20;
  rr(cx + torsoW * 0.28, torY + torsoH * 0.14, torsoW * 0.18, torsoH * 0.72, 3*s, '#fff', null);
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(cx - torsoW * 0.16, torY + 2*s);
  ctx.lineTo(cx, torY + torsoH * 0.24);
  ctx.lineTo(cx + torsoW * 0.16, torY + 2*s);
  ctx.strokeStyle = darken(c.body, 32); ctx.lineWidth = 2.8*s; ctx.stroke();
  var nums = { kofi:'1', ama:'2', kwame:'3', abena:'4' };
  ctx.font = '900 ' + Math.round(11*s) + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = darken(c.body, 42);
  ctx.fillText(nums[c.id] || '★', cx + s, torY + torsoH * 0.56 + s);
  ctx.fillStyle = c.accent;
  ctx.fillText(nums[c.id] || '★', cx, torY + torsoH * 0.56);

  // Back arm (dimmed)
  ctx.save(); ctx.globalAlpha = 0.75;
  rr(cx - torsoW/2 - armW + 1.5*s, bAY, armW, armH, 4*s, darken(c.body,14), null);
  ctx.beginPath(); ctx.arc(cx - torsoW/2 - armW/2 + 1.5*s, bAY + armH + 4*s, 4*s, 0, Math.PI*2);
  ctx.fillStyle = darken(skin,8); ctx.fill();
  ctx.restore();

  // Front leg + shoe
  rr(fLX, hipY - legLift, legW, legH + legLift, 5*s, pants, null);
  rr(fLX + s, hipY + legH*0.74, legW - 2*s, sockH, 3*s, sockCol, null);
  rr(fLX - 2*s, shY, shW, shH, 4*s, shoeCol, null);
  ctx.save(); ctx.globalAlpha = 0.28;
  rr(fLX, shY + s, shW * 0.36, shH * 0.40, 2*s, '#fff', null);
  ctx.restore();

  // Neck
  rr(cx - 4*s, nkY, 8*s, neckH + 3*s, 3*s, skin, null);

  // Head
  ctx.beginPath(); ctx.arc(cx, hdY, headR, 0, Math.PI*2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.15;
  ctx.beginPath(); ctx.arc(cx - headR*0.25, hdY - headR*0.20, headR*0.52, 0, Math.PI*2);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.restore();

  // Front arm
  rr(cx + torsoW/2 - 1.5*s, fAY, armW, armH, 4*s, darken(c.body,14), null);
  ctx.beginPath(); ctx.arc(cx + torsoW/2 + armW/2 - 1.5*s, fAY + armH + 4*s, 4*s, 0, Math.PI*2);
  ctx.fillStyle = skin; ctx.fill();

  // Eyes
  var eyeY = hdY - headR * 0.08;
  var eyeX = headR * 0.30;
  var eyeR = headR * 0.155;
  [-1, 1].forEach(function(side) {
    var ex = cx + side * eyeX;
    ctx.beginPath(); ctx.arc(ex, eyeY, eyeR, 0, Math.PI*2);
    ctx.fillStyle = '#1A1A2E'; ctx.fill();
    ctx.beginPath(); ctx.arc(ex - eyeR*0.38, eyeY - eyeR*0.38, eyeR*0.38, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fill();
  });

  // Mouth
  var mY = hdY + headR * 0.35;
  ctx.beginPath();
  ctx.arc(cx, mY - headR*0.06, running ? headR*0.20 : headR*0.22, 0.12, Math.PI - 0.12);
  ctx.strokeStyle = darken(skin, 42); ctx.lineWidth = 2*s; ctx.stroke();

  // Hair
  _drawCharacterHair(ctx, cx, hdY, headR, s, Math.max(2, 3*s), c);

  ctx.restore();
}

function _drawCharacterHair(ctx, cx, headY, headR, scale, lw, c) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  var s = scale;

  switch (c.hair) {

    // ── KOFI: Short dark hair with a swoosh ──────────────────
    case 'spiky': {
      var hc = '#1A0A00';
      ctx.beginPath();
      ctx.arc(cx, headY - headR*0.08, headR*0.96, Math.PI*1.04, 0.10, false);
      ctx.fillStyle = hc; ctx.fill();
      // Swoosh tuft
      ctx.beginPath();
      ctx.moveTo(cx - headR*0.18, headY - headR*0.85);
      ctx.bezierCurveTo(
        cx - headR*0.60, headY - headR*1.20,
        cx - headR*0.40, headY - headR*1.48,
        cx + headR*0.05, headY - headR*1.18);
      ctx.bezierCurveTo(
        cx + headR*0.28, headY - headR*0.96,
        cx + headR*0.12, headY - headR*0.72,
        cx, headY - headR*0.72);
      ctx.fillStyle = hc; ctx.fill();
      // Shine streak
      ctx.save(); ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.arc(cx - headR*0.22, headY - headR*0.55, headR*0.28, Math.PI*1.1, Math.PI*1.72, false);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5*s; ctx.stroke();
      ctx.restore();
      break;
    }

    // ── AMA: High ponytail bun with accent bow ────────────────
    case 'ponytail': {
      var hc  = '#1A1A2E';
      ctx.beginPath();
      ctx.arc(cx, headY - headR*0.10, headR*0.98, Math.PI*1.02, 0.06, false);
      ctx.fillStyle = hc; ctx.fill();
      // Bun
      ctx.beginPath(); ctx.arc(cx + headR*0.50, headY - headR*0.95, headR*0.36, 0, Math.PI*2);
      ctx.fillStyle = hc; ctx.fill();
      // Bun shine
      ctx.save(); ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.arc(cx + headR*0.38, headY - headR*1.06, headR*0.16, 0, Math.PI*2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.restore();
      // Hair tie
      ctx.beginPath(); ctx.arc(cx + headR*0.28, headY - headR*0.70, headR*0.12, 0, Math.PI*2);
      ctx.fillStyle = c.accent; ctx.fill();
      // Bow wings
      var bwX = cx + headR*0.50, bwY = headY - headR*1.18;
      [-1, 1].forEach(function(side) {
        ctx.beginPath();
        ctx.moveTo(bwX, bwY);
        ctx.bezierCurveTo(bwX + side*headR*0.42, bwY - headR*0.30,
                          bwX + side*headR*0.38, bwY + headR*0.22, bwX, bwY);
        ctx.fillStyle = c.accent; ctx.fill();
        ctx.save(); ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.moveTo(bwX, bwY);
        ctx.bezierCurveTo(bwX + side*headR*0.34, bwY - headR*0.20,
                          bwX + side*headR*0.26, bwY - headR*0.02, bwX, bwY);
        ctx.fillStyle = '#fff'; ctx.fill();
        ctx.restore();
      });
      ctx.beginPath(); ctx.arc(bwX, bwY, headR*0.09, 0, Math.PI*2);
      ctx.fillStyle = lighten(c.accent, 28); ctx.fill();
      break;
    }

    // ── KWAME: Clean round afro ────────────────────────────────
    case 'afro': {
      var hc  = '#1A0A00';
      var afR = headR * 1.38;
      var aCY = headY - headR * 0.20;
      ctx.save(); ctx.globalAlpha = 0.18;
      ctx.beginPath(); ctx.arc(cx + 2*s, aCY + 2*s, afR*0.88, 0, Math.PI*2);
      ctx.fillStyle = '#000'; ctx.fill();
      ctx.restore();
      ctx.beginPath(); ctx.arc(cx, aCY, afR*0.88, 0, Math.PI*2);
      ctx.fillStyle = hc; ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.20;
      ctx.beginPath(); ctx.arc(cx - afR*0.28, aCY - afR*0.28, afR*0.42, 0, Math.PI*2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.restore();
      // Gold pick accessory
      var pkX = cx + afR*0.60, pkY = aCY - afR*0.38;
      ctx.lineWidth = 2.5*s; ctx.strokeStyle = '#FFD700';
      for (var i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(pkX + i*3*s, pkY - afR*0.38);
        ctx.lineTo(pkX + i*3*s, pkY + afR*0.22);
        ctx.stroke();
      }
      break;
    }

    // ── ABENA: Royal updo + golden crown ──────────────────────
    case 'crown_small': {
      var hc = '#2E0060';
      ctx.beginPath();
      ctx.arc(cx, headY - headR*0.08, headR, Math.PI*1.02, 0.06, false);
      ctx.fillStyle = hc; ctx.fill();
      // Updo bun
      ctx.beginPath(); ctx.arc(cx, headY - headR*1.08, headR*0.46, 0, Math.PI*2);
      ctx.fillStyle = hc; ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.28;
      ctx.beginPath(); ctx.arc(cx - headR*0.14, headY - headR*1.18, headR*0.20, 0, Math.PI*2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.restore();
      // Crown
      var crW = headR*0.84, crH = headR*0.52;
      var crTop = headY - headR*1.48, crBot = crTop + crH;
      var crG = ctx.createLinearGradient(cx - crW, crTop, cx + crW, crBot);
      crG.addColorStop(0, '#FFEE88'); crG.addColorStop(0.5, '#FFD700'); crG.addColorStop(1, '#C8960C');
      ctx.beginPath();
      ctx.moveTo(cx - crW,       crBot);
      ctx.lineTo(cx - crW,       crBot - crH*0.46);
      ctx.lineTo(cx - crW*0.58,  crTop + crH*0.12);
      ctx.lineTo(cx - crW*0.22,  crBot - crH*0.30);
      ctx.lineTo(cx,             crTop);
      ctx.lineTo(cx + crW*0.22,  crBot - crH*0.30);
      ctx.lineTo(cx + crW*0.58,  crTop + crH*0.12);
      ctx.lineTo(cx + crW,       crBot - crH*0.46);
      ctx.lineTo(cx + crW,       crBot);
      ctx.closePath();
      ctx.fillStyle = crG; ctx.fill();
      ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 1.4*s; ctx.stroke();
      // Gems
      [{ x:cx,            y:crTop+crH*0.18, gc:'#FF44AA', r:3.8 },
       { x:cx - crW*0.30, y:crBot-crH*0.24, gc:'#44DDFF', r:3.2 },
       { x:cx + crW*0.30, y:crBot-crH*0.24, gc:'#88FFCC', r:3.2 }].forEach(function(gm) {
        var gg = ctx.createRadialGradient(gm.x-gm.r*s*0.3, gm.y-gm.r*s*0.3, 0, gm.x, gm.y, gm.r*s);
        gg.addColorStop(0, lighten(gm.gc,50)); gg.addColorStop(1, gm.gc);
        ctx.beginPath(); ctx.arc(gm.x, gm.y, gm.r*s, 0, Math.PI*2);
        ctx.fillStyle = gg; ctx.fill();
        ctx.beginPath(); ctx.arc(gm.x-gm.r*s*0.30, gm.y-gm.r*s*0.30, gm.r*s*0.35, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fill();
      });
      break;
    }
  }
  ctx.restore();
}

function drawLimb(ctx, x1, y1, x2, y2, lw, bodyColor, accentColor) {
  ctx.lineCap = 'round';
  // Outline pass
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = darken(bodyColor, 42);
  ctx.lineWidth   = lw * 1.8;
  ctx.stroke();
  // Color pass with gradient
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, lighten(bodyColor, 18));
  g.addColorStop(1, bodyColor);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = g;
  ctx.lineWidth   = lw * 1.1;
  ctx.stroke();
  // Joint — two-layer
  ctx.beginPath(); ctx.arc(x2, y2, lw * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = darken(bodyColor, 38); ctx.fill();
  ctx.beginPath(); ctx.arc(x2, y2, lw * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = accentColor; ctx.fill();
}

function drawExtras(ctx, cx, headY, neckY, hipY, groundY, scale, c, frame, lw) {
  _drawExtras(ctx, cx, headY, neckY, hipY, groundY, scale, c, frame, lw, null);
}

function _drawExtras(ctx, cx, headY, neckY, hipY, groundY, scale, c, frame, lw, only) {
  const extras = c.extras || [];
  const t = frame * 0.08;
  const should = name => extras.includes(name) && (!only || only.includes(name));

  // CAPE
  if (should('cape')) {
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
  if (should('crown')) {
    const cw = 20 * scale, ch = 13 * scale;
    const cy2 = headY - 17 * scale - ch * 0.5;
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
  if (should('crown_small')) {
    const cw = 12 * scale, ch = 8 * scale;
    const cy2 = headY - 17 * scale - ch * 0.5;
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
  if (should('mask')) {
    ctx.save();
    ctx.fillStyle = c.accent + 'cc';
    ctx.beginPath();
    ctx.ellipse(cx, headY + 2 * scale, 10 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // BELT
  if (should('belt')) {
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
  if (should('wings')) {
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
  if (should('flames')) {
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
  if (should('lightning')) {
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
  if (should('stars')) {
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
  if (should('aura')) {
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
