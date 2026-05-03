// ═══════════════════════════════════════════════════════
//  STICK RUSH — COSTUME SYSTEM
// ═══════════════════════════════════════════════════════

const COSTUMES = {

  // ── COMMON (FREE) ───────────────────────────────────
  default: {
    id:'default', name:'Classic Runner', tier:'Common', gender:'neutral',
    price:0, unlockReq:'Default — always available',
    head:'#F5CBA7', body:'#FFFFFF', outline:'#2C3E50',
    accent:'#FFFFFF', cape:false, crown:false, belt:false, mask:false,
    description:'The original stick rush athlete.'
  },
  redathlete: {
    id:'redathlete', name:'Red Athlete', tier:'Common', gender:'boy',
    price:0, unlockReq:'Complete Round 1',
    head:'#F5CBA7', body:'#E74C3C', outline:'#C0392B',
    accent:'#E74C3C', cape:false, crown:false, belt:true, mask:false,
    description:'A fierce competitor in red sports gear.'
  },
  bluestar: {
    id:'bluestar', name:'Blue Star', tier:'Common', gender:'girl',
    price:0, unlockReq:'Complete Round 1',
    head:'#F5CBA7', body:'#3498DB', outline:'#2980B9',
    accent:'#3498DB', cape:false, crown:false, belt:false, mask:false,
    description:'Fast as the wind in blue.'
  },
  greensprinter: {
    id:'greensprinter', name:'Green Sprinter', tier:'Common', gender:'neutral',
    price:0, unlockReq:'Score 100 points',
    head:'#F5CBA7', body:'#27AE60', outline:'#1E8449',
    accent:'#27AE60', cape:false, crown:false, belt:false, mask:false,
    description:'Built for speed on any track.'
  },

  // ── RARE (Round 1 Unlocks) ──────────────────────────
  firewarrior: {
    id:'firewarrior', name:'Fire Warrior', tier:'Rare', gender:'boy',
    price:0, unlockReq:'Score 300+ points in Round 1',
    head:'#F5CBA7', body:'#E67E22', outline:'#CA6F1E',
    accent:'#F39C12', cape:false, crown:false, belt:true, mask:true,
    description:'Blazing combat suit inspired by Ghanaian warriors.'
  },
  shadowkick: {
    id:'shadowkick', name:'Shadow Kick', tier:'Rare', gender:'neutral',
    price:0, unlockReq:'Answer 3 Q&A correctly in Round 1',
    head:'#7F8C8D', body:'#2C3E50', outline:'#1A252F',
    accent:'#8E44AD', cape:false, crown:false, belt:true, mask:true,
    description:'A mysterious martial artist from the shadows.'
  },
  goldenchampion: {
    id:'goldenchampion', name:'Golden Champion', tier:'Rare', gender:'girl',
    price:0, unlockReq:'Perfect Q&A score in Round 1',
    head:'#F5CBA7', body:'#F1C40F', outline:'#D4AC0D',
    accent:'#F39C12', cape:false, crown:true, belt:false, mask:false,
    description:'Ghana Gold. Unstoppable on the field.'
  },
  ninjastrike: {
    id:'ninjastrike', name:'Ninja Strike', tier:'Rare', gender:'neutral',
    price:0, unlockReq:'Win 2 mini-games in Round 1',
    head:'#2C3E50', body:'#1A252F', outline:'#117A65',
    accent:'#1ABC9C', cape:false, crown:false, belt:true, mask:true,
    description:'Silent. Swift. Strikes like lightning.'
  },

  // ── EPIC (Round 2-3 or GHS 2) ────────────────────────
  phoenixrider: {
    id:'phoenixrider', name:'Phoenix Rider', tier:'Epic', gender:'boy',
    price:200, unlockReq:'Complete Round 2 OR GHS 2',
    head:'#F5CBA7', body:'#E74C3C', outline:'#922B21',
    accent:'#F39C12', cape:true, crown:false, belt:true, mask:false,
    description:'Rises from defeat. Legendary resilience.'
  },
  thunderqueen: {
    id:'thunderqueen', name:'Thunder Queen', tier:'Epic', gender:'girl',
    price:200, unlockReq:'Complete Round 2 OR GHS 2',
    head:'#F5CBA7', body:'#8E44AD', outline:'#6C3483',
    accent:'#F1C40F', cape:true, crown:true, belt:false, mask:false,
    description:'Commands storms. Rules the leaderboard.'
  },
  ironmonk: {
    id:'ironmonk', name:'Iron Monk', tier:'Epic', gender:'neutral',
    price:200, unlockReq:'Complete Round 3 OR GHS 2',
    head:'#7F8C8D', body:'#717D7E', outline:'#424949',
    accent:'#E74C3C', cape:false, crown:false, belt:true, mask:true,
    description:'Trained in ancient martial discipline.'
  },
  starblaze: {
    id:'starblaze', name:'Star Blaze', tier:'Epic', gender:'girl',
    price:200, unlockReq:'Top 3 in any tournament',
    head:'#F5CBA7', body:'#1ABC9C', outline:'#148F77',
    accent:'#F1C40F', cape:true, crown:false, belt:false, mask:false,
    description:'A blazing comet of pure skill.'
  },

  // ── LEGENDARY (Tournament / GHS 5) ──────────────────
  akataheroine: {
    id:'akataheroine', name:'Akata Heroine', tier:'Legendary', gender:'girl',
    price:500, unlockReq:'Win a tournament OR GHS 5',
    head:'#F5CBA7', body:'#C0392B', outline:'#922B21',
    accent:'#F1C40F', cape:true, crown:true, belt:true, mask:false,
    description:'A warrior queen draped in Ghana\'s national colours.'
  },
  osagehero: {
    id:'osagehero', name:'Osage Titan', tier:'Legendary', gender:'boy',
    price:500, unlockReq:'Win a tournament OR GHS 5',
    head:'#F5CBA7', body:'#E74C3C', outline:'#641E16',
    accent:'#2ECC71', cape:true, crown:false, belt:true, mask:true,
    description:'Inspired by Ghana\'s Black Stars — unstoppable.'
  },
  cosmicstrike: {
    id:'cosmicstrike', name:'Cosmic Strike', tier:'Legendary', gender:'neutral',
    price:500, unlockReq:'Score 2000+ lifetime points OR GHS 5',
    head:'#1A252F', body:'#154360', outline:'#0B2545',
    accent:'#F1C40F', cape:true, crown:false, belt:true, mask:true,
    description:'From the cosmos — beyond ordinary power.'
  },

  // ── MYTHIC (Seasonal / Achievement) ─────────────────
  kente_king: {
    id:'kente_king', name:'Kente King', tier:'Mythic', gender:'boy',
    price:0, unlockReq:'Independence Day seasonal event',
    head:'#F5CBA7', body:'#E74C3C', outline:'#7D6608',
    accent:'#F1C40F', cape:true, crown:true, belt:true, mask:false,
    description:'Wearing Ghana\'s iconic Kente pattern. National pride.'
  },
  kente_queen: {
    id:'kente_queen', name:'Kente Queen', tier:'Mythic', gender:'girl',
    price:0, unlockReq:'Independence Day seasonal event',
    head:'#F5CBA7', body:'#F1C40F', outline:'#7D6608',
    accent:'#E74C3C', cape:true, crown:true, belt:false, mask:false,
    description:'The Kente Queen. Ghana\'s finest. Unstoppable beauty and strength.'
  },
  masterscholar: {
    id:'masterscholar', name:'Master Scholar', tier:'Mythic', gender:'neutral',
    price:0, unlockReq:'Answer 50 Q&A questions correctly (all-time)',
    head:'#F5CBA7', body:'#2C3E50', outline:'#1A252F',
    accent:'#F1C40F', cape:true, crown:true, belt:false, mask:false,
    description:'Proof that brains win the ultimate battle.'
  },
};

const COSTUME_TIERS = {
  Common: { color:'#95A5A6', label:'Common', emoji:'⚪' },
  Rare:   { color:'#3498DB', label:'Rare',   emoji:'🔵' },
  Epic:   { color:'#8E44AD', label:'Epic',   emoji:'💜' },
  Legendary:{ color:'#F39C12', label:'Legendary', emoji:'🟡' },
  Mythic: { color:'#E74C3C', label:'Mythic', emoji:'🔴' },
};

function getUnlockedCostumes(playerData) {
  const unlocked = ['default'];
  const score   = playerData.totalScore || 0;
  const round   = playerData.highestRound || 0;
  const qaRight = playerData.totalQACorrect || 0;
  const wins    = playerData.minigameWins || 0;
  const tournamentWins = playerData.tournamentWins || 0;

  if (round >= 1)          { unlocked.push('redathlete','bluestar'); }
  if (score >= 100)         unlocked.push('greensprinter');
  if (score >= 300)         unlocked.push('firewarrior');
  if (qaRight >= 3)         unlocked.push('shadowkick');
  if (qaRight >= 3 && round >= 1) unlocked.push('goldenchampion');
  if (wins >= 2)            unlocked.push('ninjastrike');
  if (round >= 2 || playerData.epicUnlocked)  { unlocked.push('phoenixrider','thunderqueen'); }
  if (round >= 3 || playerData.epicUnlocked)  { unlocked.push('ironmonk'); }
  if (tournamentWins >= 1)  { unlocked.push('starblaze'); }
  if (tournamentWins >= 1 || playerData.legendaryUnlocked) { unlocked.push('akataheroine','osagehero'); }
  if (score >= 2000 || playerData.legendaryUnlocked) unlocked.push('cosmicstrike');
  if (playerData.mythicEvent) { unlocked.push('kente_king','kente_queen'); }
  if (qaRight >= 50)        unlocked.push('masterscholar');

  return [...new Set(unlocked)];
}

// Draw a stickman on canvas with given costume
function drawStickman(ctx, cx, cy, costume, opts = {}) {
  const scale   = opts.scale  || 1;
  const running = opts.running || false;
  const frame   = opts.frame  || 0;
  const flipped = opts.flipped || false;
  const jumping = opts.jumping || false;
  const dead    = opts.dead   || false;

  const c = typeof costume === 'string' ? (COSTUMES[costume] || COSTUMES.default) : costume;

  ctx.save();
  if (flipped) { ctx.scale(-1,1); cx = -cx; }

  const lw = 3 * scale;
  const swing = running ? Math.sin(frame * 0.25) * 18 * scale : 0;
  const legSwing = running ? Math.cos(frame * 0.25) * 14 * scale : 0;
  const bodyTilt = running ? Math.sin(frame * 0.1) * 3 * scale : 0;

  const headR  = 13 * scale;
  const bodyY1 = cy - 36 * scale;
  const bodyY2 = cy - 4 * scale;
  const shoulderY = cy - 28 * scale;
  const hipY    = bodyY2;

  // ── CAPE ──────────────────────────────────────────
  if (c.cape) {
    ctx.beginPath();
    ctx.moveTo(cx - 2*scale, bodyY1 + 4*scale);
    ctx.lineTo(cx - 18*scale, hipY + 8*scale);
    ctx.lineTo(cx + 4*scale, hipY);
    ctx.closePath();
    ctx.fillStyle = c.accent;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── BODY ──────────────────────────────────────────
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';

  // Torso
  ctx.beginPath();
  ctx.moveTo(cx + bodyTilt, bodyY1);
  ctx.lineTo(cx, bodyY2);
  ctx.strokeStyle = c.body === '#FFFFFF' ? c.outline : c.body;
  ctx.lineWidth = lw * 1.8;
  ctx.stroke();
  ctx.lineWidth = lw;

  // ── BELT ──────────────────────────────────────────
  if (c.belt) {
    ctx.beginPath();
    ctx.rect(cx - 8*scale, hipY - 5*scale, 16*scale, 5*scale);
    ctx.fillStyle = c.accent;
    ctx.fill();
  }

  // ── ARMS ──────────────────────────────────────────
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = lw;
  // Left arm
  ctx.beginPath();
  ctx.moveTo(cx + bodyTilt, shoulderY);
  ctx.lineTo(cx - 16*scale + swing, shoulderY + 16*scale);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(cx + bodyTilt, shoulderY);
  ctx.lineTo(cx + 16*scale - swing, shoulderY + 16*scale);
  ctx.stroke();

  // ── LEGS ──────────────────────────────────────────
  const legOffset = jumping ? -10*scale : 0;
  // Left leg
  ctx.beginPath();
  ctx.moveTo(cx, hipY);
  ctx.lineTo(cx - 12*scale + legSwing, hipY + 22*scale + legOffset);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(cx, hipY);
  ctx.lineTo(cx + 12*scale - legSwing, hipY + 22*scale + legOffset);
  ctx.stroke();

  // ── HEAD ──────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(cx + bodyTilt, cy - 50*scale, headR, 0, Math.PI * 2);
  ctx.fillStyle = dead ? '#7F8C8D' : c.head;
  ctx.fill();
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = lw * 0.8;
  ctx.stroke();

  // ── MASK ──────────────────────────────────────────
  if (c.mask) {
    ctx.beginPath();
    ctx.rect(cx + bodyTilt - 10*scale, cy - 55*scale, 20*scale, 9*scale);
    ctx.fillStyle = c.accent;
    ctx.fill();
  }

  // ── CROWN ─────────────────────────────────────────
  if (c.crown) {
    ctx.beginPath();
    ctx.moveTo(cx + bodyTilt - 10*scale, cy - 63*scale);
    ctx.lineTo(cx + bodyTilt - 6*scale,  cy - 70*scale);
    ctx.lineTo(cx + bodyTilt,            cy - 67*scale);
    ctx.lineTo(cx + bodyTilt + 6*scale,  cy - 70*scale);
    ctx.lineTo(cx + bodyTilt + 10*scale, cy - 63*scale);
    ctx.closePath();
    ctx.fillStyle = '#F1C40F';
    ctx.fill();
  }

  // ── FACE (eyes + smile) ───────────────────────────
  if (!dead) {
    ctx.fillStyle = c.outline;
    ctx.beginPath(); ctx.arc(cx + bodyTilt - 4*scale, cy - 52*scale, 2*scale, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + bodyTilt + 4*scale, cy - 52*scale, 2*scale, 0, Math.PI*2); ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + bodyTilt, cy - 47*scale, 4*scale, 0, Math.PI);
    ctx.strokeStyle = c.outline;
    ctx.lineWidth = 1.5*scale;
    ctx.stroke();
  } else {
    // X eyes
    ctx.strokeStyle = '#E74C3C'; ctx.lineWidth = 2*scale;
    ctx.beginPath(); ctx.moveTo(cx-5*scale, cy-55*scale); ctx.lineTo(cx-2*scale, cy-52*scale); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-2*scale, cy-55*scale); ctx.lineTo(cx-5*scale, cy-52*scale); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+2*scale, cy-55*scale); ctx.lineTo(cx+5*scale, cy-52*scale); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+5*scale, cy-55*scale); ctx.lineTo(cx+2*scale, cy-52*scale); ctx.stroke();
  }

  ctx.restore();
}
