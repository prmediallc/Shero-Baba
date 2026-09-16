/* Shero Baba: Lion Run — offline, no sign-up, no ads, no tracking. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[(Math.random() * a.length) | 0];
const fmt = n => Math.floor(n).toLocaleString('en-US');
const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const Cap = window.Capacitor && window.Capacitor.Plugins ? window.Capacitor.Plugins : {};

/* ================= DATA ================= */
const LEVELS = [
  { id: 'karachi', icon: '🌅', goal: 600, coins: 50, theme: 'sea',
    en: 'Karachi Sea View', ur: 'کراچی سی ویو', sky: ['#FDBA74', '#FDE68A'], ground: '#E9C98B', road: '#6B5B4B' },
  { id: 'multan', icon: '🕌', goal: 800, coins: 70, theme: 'shrine',
    en: 'Multan Old City', ur: 'ملتان پرانا شہر', sky: ['#7DD3FC', '#FEF3C7'], ground: '#D6A76A', road: '#5B4636' },
  { id: 'trimmu', icon: '🌊', goal: 1000, coins: 90, theme: 'water',
    en: 'Trimmu Barrage', ur: 'تریموں بیراج', sky: ['#38BDF8', '#E0F2FE'], ground: '#9CA3AF', road: '#57534E' },
  { id: 'jhang', icon: '🌾', goal: 1200, coins: 110, theme: 'fields',
    en: 'Jhang Saddar', ur: 'جھنگ صدر', sky: ['#60A5FA', '#FEF9C3'], ground: '#84CC16', road: '#6B4F35' },
  { id: 'faisalabad', icon: '🕰️', goal: 1400, coins: 130, theme: 'clock',
    en: 'Faisalabad Clock Tower', ur: 'فیصل آباد گھنٹہ گھر', sky: ['#F97316', '#FDE68A'], ground: '#C08457', road: '#4B3A2E' },
  { id: 'lahore', icon: '🏮', goal: 1600, coins: 150, theme: 'city',
    en: 'Lahore Bazaar Nights', ur: 'لاہور بازار کی رات', sky: ['#312E81', '#DB2777'], ground: '#7C2D12', road: '#3F3F46', night: true },
  { id: 'peshawar', icon: '🫖', goal: 1800, coins: 170, theme: 'hills',
    en: 'Peshawar Qissa Khwani', ur: 'پشاور قصہ خوانی', sky: ['#0EA5E9', '#FDE68A'], ground: '#A16207', road: '#57534E' },
  { id: 'islamabad', icon: '🏔️', goal: 2100, coins: 200, theme: 'capital', boss: true,
    en: 'Islamabad Margalla Finale', ur: 'اسلام آباد مارگلہ فائنل', sky: ['#0284C7', '#BAE6FD'], ground: '#4D7C0F', road: '#44403C' }
];
const ENDLESS = { id: 'endless', icon: '♾️', en: 'Endless Highway', ur: 'نہ ختم ہونے والی سڑک', theme: 'city',
  sky: ['#F97316', '#FDE68A'], ground: '#B45309', road: '#44403C' };

const UPGRADES = [
  { id: 'magnet', icon: '🧲', en: 'Coin magnet', ur: 'سکہ مقناطیس', base: 8, per: 2 },
  { id: 'shield', icon: '🛡️', en: 'Shield', ur: 'ڈھال', base: 8, per: 2 },
  { id: 'x2', icon: '✨', en: 'Double coins', ur: 'دوگنے سکے', base: 10, per: 2 },
  { id: 'roar', icon: '🦁', en: 'Roar power', ur: 'دھاڑ کی طاقت', base: 4, per: 0.8 }
];
const UP_COST = [150, 350, 700, 1200, 2000];

const OUTFITS = [
  { id: 'classic', en: 'Classic Shero', ur: 'اصلی شیرو', cost: 0, fur: '#F59E0B', vest: '#B45309', trim: '#FDE68A', pat: 'dots' },
  { id: 'cricket', en: 'Cricket Kit', ur: 'کرکٹ کٹ', cost: 500, fur: '#F59E0B', vest: '#15803D', trim: '#FFFFFF', pat: 'stripe' },
  { id: 'kameez', en: 'White Kameez', ur: 'سفید قمیض', cost: 700, fur: '#F59E0B', vest: '#F8FAFC', trim: '#16A34A', pat: 'none' },
  { id: 'truck', en: 'Truck-Art Vest', ur: 'ٹرک آرٹ واسکٹ', cost: 900, fur: '#F59E0B', vest: '#DC2626', trim: '#FACC15', pat: 'truck' },
  { id: 'royal', en: 'Royal Sherwani', ur: 'شاہی شیروانی', cost: 1500, fur: '#F59E0B', vest: '#7F1D1D', trim: '#FBBF24', pat: 'stripe' },
  { id: 'golden', en: 'Golden Sher', ur: 'سنہری شیر', cost: 3000, fur: '#FCD34D', vest: '#1E3A8A', trim: '#FDE68A', pat: 'truck' }
];

const MISSIONS = [
  { id: 'm_first', icon: '🏁', en: 'First steps', ur: 'پہلا قدم', den: 'Finish 1 run', dur: 'ایک دوڑ مکمل کریں', stat: 'runs', target: 1, reward: 50 },
  { id: 'm_1k', icon: '🏃', en: 'Road runner', ur: 'سڑک کا دوڑاک', den: 'Run 1,000 m in one run', dur: 'ایک دوڑ میں 1,000 میٹر', stat: 'bestDist', target: 1000, reward: 100 },
  { id: 'm_3k', icon: '⚡', en: 'Unstoppable', ur: 'نہ رکنے والا', den: 'Run 3,000 m in one run', dur: 'ایک دوڑ میں 3,000 میٹر', stat: 'bestDist', target: 3000, reward: 300 },
  { id: 'm_c500', icon: '🪙', en: 'Coin hunter', ur: 'سکوں کا شکاری', den: 'Collect 500 coins in total', dur: 'کل 500 سکے جمع کریں', stat: 'totalCoins', target: 500, reward: 100 },
  { id: 'm_c5k', icon: '💰', en: 'Bazaar tycoon', ur: 'بازار کا سیٹھ', den: 'Collect 5,000 coins in total', dur: 'کل 5,000 سکے جمع کریں', stat: 'totalCoins', target: 5000, reward: 500 },
  { id: 'm_jump', icon: '🦘', en: 'High jumper', ur: 'اونچی چھلانگ', den: 'Jump 100 times', dur: '100 بار چھلانگ لگائیں', stat: 'jumps', target: 100, reward: 150 },
  { id: 'm_slide', icon: '🛷', en: 'Low rider', ur: 'نیچے سے نکلو', den: 'Slide 100 times', dur: '100 بار سلائیڈ کریں', stat: 'slides', target: 100, reward: 150 },
  { id: 'm_roar', icon: '🦁', en: 'King of the road', ur: 'سڑک کا بادشاہ', den: 'Use Roar 10 times', dur: '10 بار دھاڑیں', stat: 'roars', target: 10, reward: 200 },
  { id: 'm_trimmu', icon: '🌊', en: 'Trimmu explorer', ur: 'تریموں کا سیاح', den: 'Complete Trimmu Barrage', dur: 'تریموں بیراج مکمل کریں', stat: 'lv_trimmu', target: 1, reward: 150 },
  { id: 'm_upg', icon: '🔧', en: 'Tinkerer', ur: 'کاریگر', den: 'Buy any upgrade', dur: 'کوئی اپ گریڈ خریدیں', stat: 'upgradesBought', target: 1, reward: 80 },
  { id: 'm_fit', icon: '👕', en: 'Dressed to run', ur: 'نیا جوڑا', den: 'Buy an outfit', dur: 'ایک لباس خریدیں', stat: 'outfitsBought', target: 1, reward: 120 },
  { id: 'm_stars', icon: '⭐', en: 'Star of Pakistan', ur: 'پاکستان کا ستارہ', den: 'Earn all 24 stars', dur: 'تمام 24 ستارے حاصل کریں', stat: 'stars', target: 24, reward: 1500 }
];
const DAILY_POOL = [
  { id: 'd_coins', icon: '🪙', den: 'Collect 150 coins in one run', dur: 'ایک دوڑ میں 150 سکے', key: 'coins', mode: 'max', target: 150, reward: 80 },
  { id: 'd_dist', icon: '🏃', den: 'Run 1,000 m in one run', dur: 'ایک دوڑ میں 1,000 میٹر', key: 'dist', mode: 'max', target: 1000, reward: 80 },
  { id: 'd_jump', icon: '🦘', den: 'Jump 40 times today', dur: 'آج 40 چھلانگیں', key: 'jumps', mode: 'sum', target: 40, reward: 60 },
  { id: 'd_slide', icon: '🛷', den: 'Slide 30 times today', dur: 'آج 30 سلائیڈ', key: 'slides', mode: 'sum', target: 30, reward: 60 },
  { id: 'd_power', icon: '🧲', den: 'Pick up 4 power-ups today', dur: 'آج 4 پاور اپ اٹھائیں', key: 'powers', mode: 'sum', target: 4, reward: 70 },
  { id: 'd_runs', icon: '🏁', den: 'Finish 3 runs today', dur: 'آج 3 دوڑیں مکمل کریں', key: 'runs', mode: 'sum', target: 3, reward: 60 },
  { id: 'd_roar', icon: '🦁', den: 'Roar 2 times today', dur: 'آج 2 بار دھاڑیں', key: 'roars', mode: 'sum', target: 2, reward: 90 }
];

const STR = {
  en: {
    offline: 'Plays offline', tagline: 'Lion Run', rank: 'Rank', best: 'Best', stars: 'Stars', endless: 'Endless run', story: 'Story map',
    mapTitle: 'Pakistan Map', startRun: 'Start run', workshop: "Shero's Workshop", upgrades: 'Upgrades', outfits: 'Outfits',
    missions: 'Missions', records: 'Records', roar: 'ROAR', home: 'Home', map: 'Map', shop: 'Workshop', missionsTab: 'Missions', recordsTab: 'Records',
    music: 'Music', sfx: 'Sound effects', vibe: 'Vibration', pad: 'On-screen buttons', lang: 'Language',
    score: 'Score', distance: 'Distance', coinsGot: 'Coins collected', xp: 'Rank XP', crashed: 'Ouch!', reviveQ: 'Keep running from here?',
    continue: 'Continue', endRun: 'End run', settings: 'Settings', paused: 'Paused', resume: 'Resume', restart: 'Restart', quit: 'Quit to home',
    close: 'Close', tutorial: 'Replay tutorial', lvComplete: 'Level complete!', runOver: 'Run over', tryAgain: 'So close!',
    nextLevel: 'Next level', replay: 'Replay', runAgain: 'Run again', toMap: 'Map', toHome: 'Home', newBest: 'New best!',
    goal: 'Run {m} m', starRules: '★ Finish   ★ Collect {c} coins   ★ No bumps', locked: 'Finish the previous stop to unlock',
    level: 'Stop {n}', buy: 'Buy', equip: 'Equip', equipped: 'Equipped', max: 'Max', lvl: 'Level {n} of 5', lasts: 'Lasts {s}s',
    claim: 'Claim', claimed: 'Claimed', daily: "Today's missions", allMissions: 'Achievements', resets: 'New missions every day',
    you: 'Your name', save: 'Save', bestScore: 'Best score', bestDist: 'Longest run', totalCoins: 'Coins earned', runs: 'Runs played',
    topRuns: 'Your top 10 runs', noRuns: 'No runs yet. Your best runs will appear here.', privacy: 'Everything is saved on this phone only. No account, no internet.',
    hintLane: 'Swipe left or right to switch lanes', hintJump: 'Swipe up to jump over barriers and carts', hintSlide: 'Swipe down to slide under banners',
    hintRoar: 'Fill the ring with coins, then tap ROAR!', hintGo: "You're ready. Run, Shero!",
    tips: ['Swipe up to jump over fruit carts.', 'Swipe down to slide under wedding banners.', 'Rickshaws and trucks block a whole lane. Switch lanes!', 'Roar smashes everything in your way.', 'Upgrade the magnet in the Workshop to pull coins from every lane.', 'Three stars: finish, hit the coin target, and never bump into anything.'],
    notEnough: 'Not enough coins', bought: 'Bought!', shieldUp: 'Shield!', magnetOn: 'Magnet!', x2On: 'Double coins!', roarOn: 'ROAR!', saved: 'Saved', go: 'GO!',
    endlessName: 'Endless Highway', unlockedMsg: 'New stop unlocked on the map!', powerMagnet: 'Magnet', powerShield: 'Shield', powerX2: '2x coins', powerRoar: 'Roar'
  },
  ur: {
    offline: 'بغیر انٹرنیٹ کھیلیں', tagline: 'شیر کی دوڑ', rank: 'درجہ', best: 'بہترین', stars: 'ستارے', endless: 'لامحدود دوڑ', story: 'کہانی کا نقشہ',
    mapTitle: 'پاکستان کا نقشہ', startRun: 'دوڑ شروع کریں', workshop: 'شیرو کی ورکشاپ', upgrades: 'اپ گریڈ', outfits: 'لباس',
    missions: 'مشن', records: 'ریکارڈ', roar: 'دھاڑ', home: 'گھر', map: 'نقشہ', shop: 'ورکشاپ', missionsTab: 'مشن', recordsTab: 'ریکارڈ',
    music: 'موسیقی', sfx: 'آوازیں', vibe: 'تھرتھراہٹ', pad: 'اسکرین بٹن', lang: 'زبان',
    score: 'اسکور', distance: 'فاصلہ', coinsGot: 'جمع سکے', xp: 'درجہ پوائنٹ', crashed: 'اوہو!', reviveQ: 'یہیں سے دوڑ جاری رکھیں؟',
    continue: 'جاری رکھیں', endRun: 'دوڑ ختم', settings: 'ترتیبات', paused: 'رکا ہوا', resume: 'جاری رکھیں', restart: 'دوبارہ', quit: 'گھر جائیں',
    close: 'بند کریں', tutorial: 'سبق دوبارہ', lvComplete: 'مرحلہ مکمل!', runOver: 'دوڑ ختم', tryAgain: 'بس تھوڑا سا رہ گیا!',
    nextLevel: 'اگلا مرحلہ', replay: 'دوبارہ کھیلیں', runAgain: 'پھر دوڑیں', toMap: 'نقشہ', toHome: 'گھر', newBest: 'نیا ریکارڈ!',
    goal: '{m} میٹر دوڑیں', starRules: '★ مکمل کریں   ★ {c} سکے   ★ کوئی ٹکر نہیں', locked: 'پچھلا پڑاؤ مکمل کریں',
    level: 'پڑاؤ {n}', buy: 'خریدیں', equip: 'پہنیں', equipped: 'پہنا ہوا', max: 'مکمل', lvl: 'درجہ {n} از 5', lasts: '{s} سیکنڈ',
    claim: 'انعام لیں', claimed: 'لے لیا', daily: 'آج کے مشن', allMissions: 'کارنامے', resets: 'ہر روز نئے مشن',
    you: 'آپ کا نام', save: 'محفوظ', bestScore: 'بہترین اسکور', bestDist: 'لمبی دوڑ', totalCoins: 'کمائے سکے', runs: 'کل دوڑیں',
    topRuns: 'آپ کی 10 بہترین دوڑیں', noRuns: 'ابھی کوئی دوڑ نہیں۔', privacy: 'سب کچھ صرف اسی فون میں محفوظ ہے۔ نہ اکاؤنٹ، نہ انٹرنیٹ۔',
    hintLane: 'لین بدلنے کے لیے دائیں یا بائیں سوائپ کریں', hintJump: 'چھلانگ کے لیے اوپر سوائپ کریں', hintSlide: 'جھنڈیوں کے نیچے سے نکلنے کے لیے نیچے سوائپ کریں',
    hintRoar: 'سکوں سے دائرہ بھریں، پھر دھاڑ دبائیں!', hintGo: 'تیار ہو؟ دوڑو شیرو!',
    tips: ['پھلوں کی ریڑھی پر سے چھلانگ لگائیں۔', 'شادی کی جھنڈیوں کے نیچے سے سلائیڈ کریں۔', 'رکشہ اور ٹرک پوری لین روکتے ہیں۔ لین بدلیں!', 'دھاڑ ہر رکاوٹ توڑ دیتی ہے۔', 'ورکشاپ میں مقناطیس اپ گریڈ کریں۔'],
    notEnough: 'سکے کم ہیں', bought: 'خرید لیا!', shieldUp: 'ڈھال!', magnetOn: 'مقناطیس!', x2On: 'دوگنے سکے!', roarOn: 'دھاڑ!', saved: 'محفوظ', go: 'چلو!',
    endlessName: 'لامحدود سڑک', unlockedMsg: 'نقشے پر نیا پڑاؤ کھل گیا!', powerMagnet: 'مقناطیس', powerShield: 'ڈھال', powerX2: 'دوگنے', powerRoar: 'دھاڑ'
  }
};

/* ================= SAVE ================= */
const KEY = 'sherobaba_save_v1';
const DEF = {
  coins: 0, xp: 0, name: 'Shero', lang: 'en', tut: false,
  opt: { music: true, sfx: true, vibe: true, pad: false },
  up: { magnet: 0, shield: 0, x2: 0, roar: 0 },
  outfits: ['classic'], outfit: 'classic',
  stars: {}, claimed: [],
  stats: { runs: 0, bestDist: 0, bestScore: 0, totalCoins: 0, jumps: 0, slides: 0, roars: 0, upgradesBought: 0, outfitsBought: 0 },
  top: [], daily: null, sel: 0
};
let S;
function load() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; }
  S = Object.assign(JSON.parse(JSON.stringify(DEF)), d || {});
  S.opt = Object.assign({}, DEF.opt, S.opt); S.up = Object.assign({}, DEF.up, S.up); S.stats = Object.assign({}, DEF.stats, S.stats);
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ } }
const T = k => (STR[S.lang] && STR[S.lang][k] !== undefined ? STR[S.lang][k] : STR.en[k]);
const Tf = (k, o) => T(k).replace(/\{(\w)\}/g, (_, x) => o[x]);
const nm = o => (S.lang === 'ur' ? o.ur : o.en);
const rankOf = xp => Math.floor(Math.sqrt(xp / 40)) + 1;
const totalStars = () => Object.values(S.stars).reduce((a, b) => a + b, 0);
const upDur = id => { const u = UPGRADES.find(x => x.id === id); return u.base + u.per * S.up[id]; };
const outfit = () => OUTFITS.find(o => o.id === S.outfit) || OUTFITS[0];

/* ================= AUDIO ================= */
const Audio_ = (() => {
  let ctx = null, master = null, musicGain = null, fileGain = null;
  const tracks = {}; let current = null, synthOn = false, synthTimer = null, nextNote = 0, step = 0, synthKind = 'menu';
  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.32; musicGain.connect(master);
    fileGain = ctx.createGain(); fileGain.gain.value = 0.55; fileGain.connect(master);
  }
  function tone(f, d, type = 'square', v = 0.15, slide = 0, when = 0, dest) {
    if (!ctx) return;
    const t = ctx.currentTime + when, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + d);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + d + 0.02);
  }
  function noise(d, v = 0.2, when = 0, hp = 800, dest) {
    if (!ctx) return;
    const t = ctx.currentTime + when, b = ctx.createBuffer(1, ctx.sampleRate * d, ctx.sampleRate), a = b.getChannelData(0);
    for (let i = 0; i < a.length; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / a.length);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'highpass'; f.frequency.value = hp; g.gain.value = v; s.buffer = b; s.connect(f); f.connect(g); g.connect(dest || master); s.start(t);
  }
  const sfx = {
    coin: () => { tone(1320, 0.07, 'square', 0.08); tone(1760, 0.1, 'square', 0.07, 0, 0.05); },
    jump: () => tone(300, 0.18, 'triangle', 0.2, 500),
    slide: () => noise(0.25, 0.15, 0, 1500),
    lane: () => tone(500, 0.05, 'sine', 0.08, 120),
    crash: () => { noise(0.45, 0.45, 0, 200); tone(140, 0.4, 'sawtooth', 0.25, -90); },
    power: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.12, 'square', 0.09, 0, i * 0.06)),
    roar: () => { tone(110, 0.8, 'sawtooth', 0.35, -50); noise(0.8, 0.3, 0, 300); },
    smash: () => noise(0.2, 0.3, 0, 500),
    click: () => tone(700, 0.05, 'triangle', 0.1),
    buy: () => [784, 988, 1318].forEach((f, i) => tone(f, 0.15, 'triangle', 0.14, 0, i * 0.07)),
    win: () => [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, 0.2, 'square', 0.1, 0, i * 0.11)),
    lose: () => [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, 'triangle', 0.14, 0, i * 0.15)),
    count: () => tone(880, 0.12, 'square', 0.1), go: () => tone(1320, 0.3, 'square', 0.12)
  };
  function play(n) { if (!S.opt.sfx) return; init(); if (!ctx) return; if (oneShot(n)) return; sfx[n] && sfx[n](); }
  // Optional Suno tracks: audio/menu.mp3, audio/run.mp3, audio/win.mp3, audio/lose.mp3
  function track(name, loop) {
    if (tracks[name] !== undefined) return tracks[name];
    const a = new Audio(); a.src = `audio/${name}.mp3`; a.loop = loop; a.preload = 'auto'; a.volume = loop ? 0.45 : 0.7;
    tracks[name] = a; a.addEventListener('error', () => { tracks[name] = null; if (current === name) startSynth(name); });
    return a;
  }
  function oneShot(n) {
    if (n !== 'win' && n !== 'lose') return false;
    const a = track(n, false); if (!a || a.error || a.readyState < 2) return false;
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}); return true; } catch (e) { return false; }
  }
  // Gapless music through Web Audio: each song plays its intro once, then repeats [loopStart, loopEnd].
  // [loopStart, loopEnd, fileDuration] match the processed Suno files in www/audio/.
  const LOOPS = { menu: [69.625, 121.632, 122.67], run: [27.98, 53.2327, 54.28] };
  const bufLoads = {}, savedPos = {};
  let src = null, srcName = null, srcStart = 0, token = 0;
  function b64buf(b) { const bin = atob(b), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
  function loadBuf(name) {
    if (!bufLoads[name]) bufLoads[name] = (async () => {
      try {
        const emb = window.SB_AUDIO && window.SB_AUDIO[name];
        let ab;
        if (emb) ab = b64buf(emb);
        else { const r = await fetch(`audio/${name}.mp3`); if (!r.ok) throw new Error('missing'); ab = await r.arrayBuffer(); }
        return await new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej));
      } catch (e) { return null; }
    })();
    return bufLoads[name];
  }
  function posOf(name) {
    if (!src || srcName !== name) return savedPos[name] || 0;
    let p = ctx.currentTime - srcStart;
    if (src.loopEnd > 0 && p > src.loopEnd) p = src.loopStart + ((p - src.loopStart) % (src.loopEnd - src.loopStart));
    else if (!(src.loopEnd > 0)) p %= src.buffer.duration;
    return p;
  }
  function stopSrc(keep) {
    if (!src) return;
    if (keep) savedPos[srcName] = posOf(srcName);
    try { src.stop(); } catch (e) { /* already stopped */ }
    src.disconnect(); src = null; srcName = null;
  }
  function htmlMusic(name) {
    const a = track(name, true);
    if (!a || a.error) { startSynth(name); return; }
    const p = a.play(); if (p && p.catch) p.catch(() => { /* waits for first tap */ });
  }
  function music(name, resume) {
    current = name; token++;
    Object.values(tracks).forEach(a => a && a.loop && a.pause());
    stopSynth(); stopSrc(false);
    if (!S.opt.music || !name) return;
    init(); if (!ctx) return;
    const my = token;
    loadBuf(name).then(buf => {
      if (my !== token) return;
      if (!buf) { htmlMusic(name); return; }
      const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
      const lp = LOOPS[name];
      if (lp && Math.abs(buf.duration - lp[2]) < 0.6) { s.loopStart = lp[0]; s.loopEnd = lp[1]; }
      s.connect(fileGain);
      const off = resume ? Math.min(savedPos[name] || 0, buf.duration - 0.2) : 0;
      s.start(0, off);
      src = s; srcName = name; srcStart = ctx.currentTime - off;
    });
  }
  // Built-in dhol + tumbi loop, used until Suno tracks are added
  const MEL = { menu: [0, 2, 4, 7, 4, 2, 0, -1, 0, 4, 7, 9, 7, 4, 2, -1], run: [0, 0, 7, 0, 9, 7, 4, 2, 0, 0, 7, 0, 12, 9, 7, 4] };
  const SCALE = [0, 2, 4, 5, 7, 9, 11, 12];
  function startSynth(kind) {
    if (!ctx || !S.opt.music) return;
    synthKind = kind; synthOn = true; nextNote = ctx.currentTime + 0.05; step = 0;
    clearInterval(synthTimer); synthTimer = setInterval(sched, 30);
  }
  function stopSynth() { synthOn = false; clearInterval(synthTimer); }
  function sched() {
    if (!synthOn || !ctx) return;
    const bpm = synthKind === 'run' ? 132 : 100, spb = 60 / bpm / 2;
    while (nextNote < ctx.currentTime + 0.12) {
      const w = nextNote - ctx.currentTime, s = step % 16;
      if (s % 4 === 0) { tone(90, 0.22, 'sine', 0.55, -40, w, musicGain); }
      if (s % 4 === 2 || s === 7 || s === 15) { noise(0.06, 0.28, w, 2500, musicGain); tone(320, 0.06, 'triangle', 0.18, -120, w, musicGain); }
      const m = MEL[synthKind] || MEL.menu, n = m[s];
      if (n >= 0 && (synthKind === 'run' || s % 2 === 0)) {
        const f = 392 * Math.pow(2, n / 12);
        tone(f, 0.16, 'square', 0.05, 0, w, musicGain); tone(f * 2, 0.08, 'triangle', 0.03, 0, w, musicGain);
      }
      nextNote += spb; step++;
    }
  }
  function pauseAll(hard) { Object.values(tracks).forEach(a => a && a.loop && a.pause()); stopSynth(); stopSrc(true); if (hard && ctx && ctx.state === 'running') ctx.suspend(); }
  function preload() { init(); if (ctx) ['menu', 'run'].forEach(loadBuf); ['win', 'lose'].forEach(n => track(n, false)); }
  function resumeAll() { if (ctx && ctx.state === 'suspended') ctx.resume(); music(current, true); }
  function unlock() {
    init();
    const a = current && tracks[current];
    if (current && S.opt.music && !src && !synthOn && !(a && !a.paused)) music(current, true);
  }
  return { play, music, init, pauseAll, resumeAll, unlock, preload, get current() { return current; },
    get dbg() { return { track: srcName, pos: src ? +posOf(srcName).toFixed(2) : null, loop: src ? [src.loopStart, src.loopEnd] : null, dur: src ? +src.buffer.duration.toFixed(2) : null, ctx: ctx && ctx.state, synth: synthOn }; } };
})();

function buzz(ms) {
  if (!S.opt.vibe) return;
  try {
    if (Cap.Haptics) Cap.Haptics.impact({ style: ms > 60 ? 'HEAVY' : 'LIGHT' });
    else if (navigator.vibrate) navigator.vibrate(ms);
  } catch (e) { /* no haptics */ }
}

/* ================= ART ================= */
function maneSpikes(cx, cy, r1, r2, n) {
  let p = '';
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? r2 : r1; p += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`; }
  return p + 'Z';
}
function vestPattern(o) {
  if (o.pat === 'truck') return `<g stroke="#3A2111" stroke-width="2">${[40, 70, 100, 130, 160].map((x, i) => `<path d="M${x - 10} 206 l10 -14 l10 14z" fill="${['#FACC15', '#10B981', '#2563EB', '#F472B6', '#FACC15'][i]}"/>`).join('')}</g>`;
  if (o.pat === 'stripe') return `<path d="M100 172v48" stroke="${o.trim}" stroke-width="8"/>`;
  if (o.pat === 'dots') return `<g fill="${o.trim}">${[60, 85, 115, 140].map(x => `<circle cx="${x}" cy="202" r="4"/>`).join('')}</g>`;
  return '';
}
function lionSVG(o = outfit(), extra = '') {
  const U = '#3A2111';
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" ${extra}>
  <path d="M22 220c4-38 34-56 78-56s74 18 78 56z" fill="${o.vest}" stroke="${U}" stroke-width="5"/>
  ${vestPattern(o)}
  <path d="M70 168l30 26 30-26" fill="none" stroke="${o.trim}" stroke-width="7" stroke-linecap="round"/>
  <path d="${maneSpikes(100, 96, 94, 74, 11)}" fill="#9A3412" stroke="${U}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="100" cy="96" r="72" fill="#C2410C"/>
  <path d="${maneSpikes(100, 98, 70, 60, 14)}" fill="#EA580C"/>
  <circle cx="58" cy="46" r="17" fill="${o.fur}" stroke="${U}" stroke-width="5"/><circle cx="58" cy="46" r="8" fill="#FDBA74"/>
  <circle cx="142" cy="46" r="17" fill="${o.fur}" stroke="${U}" stroke-width="5"/><circle cx="142" cy="46" r="8" fill="#FDBA74"/>
  <ellipse cx="100" cy="104" rx="52" ry="50" fill="${o.fur}" stroke="${U}" stroke-width="5"/>
  <path d="M60 70q40-22 80 0" fill="none" stroke="#15803D" stroke-width="10" stroke-linecap="round"/>
  <path d="M60 70q40-22 80 0" fill="none" stroke="#FACC15" stroke-width="3" stroke-dasharray="4 8" stroke-linecap="round"/>
  <ellipse cx="100" cy="128" rx="30" ry="22" fill="#FEF3C7" stroke="${U}" stroke-width="3"/>
  <circle cx="68" cy="120" r="8" fill="#FB923C" opacity=".6"/><circle cx="132" cy="120" r="8" fill="#FB923C" opacity=".6"/>
  <path d="M66 86l24 6M134 86l-24 6" stroke="${U}" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="80" cy="102" rx="7" ry="9" fill="${U}"/><ellipse cx="120" cy="102" rx="7" ry="9" fill="${U}"/>
  <circle cx="82" cy="99" r="2.6" fill="#fff"/><circle cx="122" cy="99" r="2.6" fill="#fff"/>
  <path d="M91 114h18q2 0 0 3l-7 7q-2 2-4 0l-7-7q-2-3 0-3z" fill="#7C2D12" stroke="${U}" stroke-width="2"/>
  <path d="M100 124v6M86 132q7 10 14 2q7 8 14-2" fill="none" stroke="${U}" stroke-width="4" stroke-linecap="round"/>
  <path d="M93 138q7 8 14 0" fill="#DC2626" stroke="${U}" stroke-width="2.5"/>
</svg>`;
}

/* Canvas drawing helpers */
const cv = $('#game'), cx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
function resize() {
  const r = $('#app').getBoundingClientRect();
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = r.width; H = r.height; cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
function poly(pts, fill, stroke, lw) {
  cx.beginPath(); pts.forEach((p, i) => (i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1]))); cx.closePath();
  if (fill) { cx.fillStyle = fill; cx.fill(); }
  if (stroke) { cx.strokeStyle = stroke; cx.lineWidth = lw || 2; cx.lineJoin = 'round'; cx.stroke(); }
}
function ell(x, y, rx, ry, fill, stroke, lw) {
  cx.beginPath(); cx.ellipse(x, y, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
  if (fill) { cx.fillStyle = fill; cx.fill(); } if (stroke) { cx.strokeStyle = stroke; cx.lineWidth = lw; cx.stroke(); }
}
const UMB = '#3A2111';

/* ================= ENGINE ================= */
const D = 9, ZMAX = 110;
let HY, BY, LW, UH, camX = 0;
function layout() { HY = H * 0.34; BY = H * 0.84; LW = W * 0.29; UH = W * 0.2; }
function P(xl, z, h) { const s = D / (D + z); return [W / 2 + (xl - camX) * LW * s, HY + (BY - HY) * s - h * UH * s, s]; }

const G = { on: false, paused: false };
let theme = LEVELS[0];

function newRun(mode, li) {
  theme = mode === 'level' ? LEVELS[li] : ENDLESS;
  Object.assign(G, {
    on: true, paused: false, over: false, finishing: 0, mode, li, t: 0, dist: 0, score: 0, coins: 0, x: 0, lane: 0,
    h: 0, vy: 0, slide: 0, objs: [], scen: [], parts: [], nextRow: 34, nextScen: 0, magnet: 0, shield: 0, x2: 0,
    roar: 0, meter: 0, revived: false, bumps: 0, jumps: 0, slides: 0, powers: 0, roars: 0, shake: 0, flash: 0,
    tut: !S.tut, tutStep: 0, countdown: 3, bonus: 0
  });
  for (let z = 0; z < ZMAX; z += 5) spawnScenery(z);
  if (G.tut) seedTutorial();
}
function speed() {
  if (G.tut && G.t < 22) return 17;
  const base = G.mode === 'level' ? 20 + G.li * 1.4 : 20;
  let v = Math.min(46, base + G.dist * 0.0032);
  if (G.roar > 0) v *= 1.35;
  if (G.finishing) v *= 0.6;
  return v;
}
const diff = () => clamp((G.dist * 0.5 + (G.mode === 'level' ? G.li * 450 : 0)) / 3500, 0, 1);
const meters = () => G.dist * 0.5;

const OB = {
  barrier: { d: 0.6, h: 0.85, w: 0.8, pass: 'jump' },
  cart: { d: 1.8, h: 1.05, w: 0.78, pass: 'jump' },
  banner: { d: 0.4, h: 2.5, w: 1, pass: 'slide' },
  rick: { d: 3, h: 1.6, w: 0.78, pass: 'none' },
  truck: { d: 8, h: 2.6, w: 0.92, pass: 'none' }
};
function addOb(type, lane, z) { G.objs.push({ k: 'ob', type, lane, z, ...OB[type], col: pick(['#DC2626', '#2563EB', '#16A34A', '#F59E0B', '#DB2777', '#7C3AED']) }); }
function addCoin(lane, z, h) { G.objs.push({ k: 'coin', lane, z, h, d: 0.3 }); }
function spawnRow(z) {
  const df = diff(), lanes = [-1, 0, 1], free = pick(lanes);
  const blockers = df > 0.35 ? ['barrier', 'cart', 'banner', 'rick', 'truck', 'truck'] : ['barrier', 'cart', 'banner', 'rick', 'truck'];
  const fillP = lerp(0.45, 0.85, df);
  let freeOb = null;
  lanes.forEach(l => {
    if (l === free) {
      if (Math.random() < lerp(0.15, 0.6, df)) { freeOb = pick(['barrier', 'cart', 'banner']); addOb(freeOb, l, z); }
    } else if (Math.random() < fillP) addOb(pick(blockers), l, z);
  });
  // coins show the safe path
  const n = 5;
  for (let i = 0; i < n; i++) {
    const cz = z - 2.2 * (n - i) + 0.2;
    addCoin(free, cz, 0.35);
  }
  if (freeOb === 'barrier' || freeOb === 'cart') {
    [-1.6, 0, 1.6, 3.2].forEach((o, i) => addCoin(free, z + o, 0.35 + [1.3, 1.9, 1.9, 1.3][i]));
  } else if (!freeOb) addCoin(free, z + 0.5, 0.35);
  if (Math.random() < 0.09) {
    const kinds = ['magnet', 'shield', 'x2'];
    G.objs.push({ k: 'pw', type: pick(kinds), lane: pick(lanes), z: z + gap() * 0.5, h: 0.6, d: 0.4 });
  }
}
function gap() { return speed() * lerp(1.05, 0.72, diff()); }
function seedTutorial() {
  G.objs = []; G.nextRow = 1e9;
  const rows = [[40, 'rick', [0]], [110, 'barrier', [-1, 0, 1]], [175, 'banner', [-1, 0, 1]]];
  rows.forEach(([z, t, ls]) => ls.forEach(l => addOb(t, l, z)));
  for (let i = 0; i < 8; i++) addCoin(-1, 26 + i * 2, 0.35);
  for (let i = 0; i < 25; i++) addCoin([-1, 0, 1][i % 3], 200 + i * 3.2, 0.35);
}
function spawnScenery(z) {
  const th = theme.theme;
  [-1, 1].forEach(side => {
    let type;
    if (th === 'water') type = Math.random() < 0.7 ? 'rail' : 'lamp';
    else if (th === 'fields') type = pick(['tree', 'tree', 'hay', 'post']);
    else if (th === 'sea') type = side < 0 ? pick(['rail', 'palm']) : pick(['bld', 'palm', 'lamp']);
    else if (th === 'hills') type = pick(['bld', 'pine', 'bld']);
    else if (th === 'capital') type = pick(['pine', 'pine', 'lamp', 'bld']);
    else type = pick(['bld', 'bld', 'bld', 'lamp', 'tree']);
    const o = { k: 'sc', type, side, z, x: side * (type === 'rail' ? 1.72 : rnd(2.3, 2.9)), d: type === 'bld' ? rnd(3.5, 4.8) : 0.3,
      h: type === 'bld' ? rnd(2.4, 5.2) : type === 'pine' ? rnd(2.8, 4) : type === 'tree' ? rnd(2.2, 3.2) : 2,
      col: pick(['#F59E0B', '#DB2777', '#0EA5E9', '#16A34A', '#EAB308', '#F97316', '#A855F7', '#FB7185']),
      wall: pick(theme.night ? ['#78350F', '#7C2D12', '#57534E'] : ['#FDE68A', '#FED7AA', '#E7C9A0', '#FCA5A5', '#BFDBFE', '#D9F99D']),
      dome: Math.random() < 0.25, seed: Math.random() };
    G.scen.push(o);
  });
}

/* ---------- input ---------- */
function act(a) {
  if (!G.on || G.paused || G.over || G.countdown > 0) return;
  if (a === 'left' || a === 'right') {
    const nl = clamp(G.lane + (a === 'left' ? -1 : 1), -1, 1);
    if (nl !== G.lane) { G.lane = nl; Audio_.play('lane'); if (G.tutStep === 0) G.tutStep = 1; }
  } else if (a === 'up') {
    if (G.h <= 0.001) { G.vy = 11.5; G.slide = 0; G.jumps++; Audio_.play('jump'); }
  } else if (a === 'down') {
    if (G.h > 0.05) G.vy = -18;
    if (G.slide <= 0) { G.slides++; Audio_.play('slide'); }
    G.slide = 0.75;
  } else if (a === 'roar') {
    if (G.meter >= 100 && G.roar <= 0) {
      G.meter = 0; G.roar = upDur('roar'); G.roars++; G.shake = 0.5; Audio_.play('roar'); buzz(120); toast(T('roarOn'));
    }
  }
}
let touch = null, lastTap = 0;
cv.addEventListener('pointerdown', e => { touch = { x: e.clientX, y: e.clientY, t: performance.now(), done: false }; });
cv.addEventListener('pointermove', e => {
  if (!touch || touch.done) return;
  const dx = e.clientX - touch.x, dy = e.clientY - touch.y, th = 28;
  if (Math.abs(dx) > th || Math.abs(dy) > th) {
    touch.done = true;
    if (Math.abs(dx) > Math.abs(dy)) act(dx < 0 ? 'left' : 'right'); else act(dy < 0 ? 'up' : 'down');
  }
});
cv.addEventListener('pointerup', () => {
  if (touch && !touch.done && performance.now() - touch.t < 250) {
    const now = performance.now(); if (now - lastTap < 320) act('roar'); lastTap = now;
  }
  touch = null;
});
document.addEventListener('keydown', e => {
  const m = { ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', ArrowUp: 'up', w: 'up', ' ': 'roar', ArrowDown: 'down', s: 'down' };
  if (e.key === 'Escape' || e.key === 'p') { if (G.on && !G.over) (G.paused ? resume() : pause()); return; }
  if (m[e.key]) { e.preventDefault(); act(m[e.key]); }
});
$$('#pad button').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); act(b.dataset.key); }));

/* ---------- update ---------- */
function update(dt) {
  if (G.countdown > 0) {
    const before = Math.ceil(G.countdown); G.countdown -= dt; const after = Math.ceil(G.countdown);
    if (after !== before) { if (after > 0) { $('#count').textContent = after; Audio_.play('count'); } else { $('#count').textContent = T('go'); Audio_.play('go'); setTimeout(() => $('#count').classList.remove('on'), 450); } }
    return;
  }
  G.t += dt;
  const v = speed(), dz = v * dt;
  G.dist += dz;
  const mult = G.x2 > 0 ? 2 : 1;
  G.score += dz * 0.5 * (G.roar > 0 ? 2 : 1);
  // move world
  G.objs.forEach(o => (o.z -= dz));
  G.scen.forEach(o => (o.z -= dz));
  G.nextRow -= dz; G.nextScen -= dz;
  if (G.nextRow <= ZMAX - 40 && !G.finishing) { spawnRow(ZMAX - 5); G.nextRow += gap(); }
  while (G.nextScen <= 0) { spawnScenery(ZMAX + G.nextScen); G.nextScen += 5; }
  if (G.tut && G.nextRow > 1e8 && G.t > 21) { G.nextRow = 60; }
  G.objs = G.objs.filter(o => o.z + (o.d || 0) > -6 && !o.dead);
  G.scen = G.scen.filter(o => o.z + o.d > -6);
  // player
  G.x = lerp(G.x, G.lane, 1 - Math.pow(0.0005, dt));
  if (G.h > 0 || G.vy > 0) { G.vy -= 34 * dt; G.h = Math.max(0, G.h + G.vy * dt); if (G.h === 0) G.vy = 0; }
  G.slide = Math.max(0, G.slide - dt);
  ['magnet', 'shield', 'x2', 'roar'].forEach(k => (G[k] = Math.max(0, G[k] - dt)));
  G.shake = Math.max(0, G.shake - dt); G.flash = Math.max(0, G.flash - dt);
  camX = lerp(camX, G.x * 0.35, 1 - Math.pow(0.02, dt));
  const pl = Math.round(G.x);
  // collisions
  for (const o of G.objs) {
    if (o.k === 'coin' || o.k === 'pw') {
      if (o.fly) {
        o.fly += dt * 5; o.z = lerp(o.z, 0, Math.min(1, o.fly)); o.lane = lerp(o.lane, G.x, Math.min(1, o.fly)); o.h = lerp(o.h, G.h + 0.6, Math.min(1, o.fly));
        if (o.fly >= 1) collect(o, mult);
        continue;
      }
      if (o.k === 'coin' && G.magnet > 0 && o.z < 16 && o.z > -0.5) { o.fly = 0.01; continue; }
      if (o.z < 0.7 && o.z > -0.7 && Math.round(o.lane) === pl && Math.abs(o.h - (G.h + 0.5)) < 1.1) collect(o, mult);
      continue;
    }
    if (o.k !== 'ob' || o.hit) continue;
    if (o.z < 0.55 && o.z + o.d > -0.55 && o.lane === pl) {
      let clear = false;
      if (o.pass === 'jump') clear = G.h > o.h - 0.05;
      if (o.pass === 'slide') clear = G.slide > 0 && G.h < 0.5;
      if (clear) continue;
      if (G.roar > 0 || G.finishing) { smash(o); continue; }
      if (G.shield > 0) { G.shield = 0; smash(o); G.bumps++; G.flash = 0.3; buzz(60); continue; }
      if (G.tut) { o.hit = true; G.flash = 0.4; G.shake = 0.3; Audio_.play('crash'); buzz(80); continue; }
      o.hit = true; crash(); break;
    }
  }
  // tutorial hints
  if (G.tut) {
    const hs = [[0, 'hintLane'], [4.2, 'hintJump'], [8.2, 'hintSlide'], [11.2, 'hintRoar'], [18, 'hintGo'], [21.5, null]];
    if (G.t > 11.2 && !G.tutMag) { G.tutMag = true; G.magnet = 7; }
    let cur = null; hs.forEach(([t, k]) => { if (G.t >= t) cur = k; });
    hint(cur);
    if (G.t > 22) { G.tut = false; S.tut = true; save(); }
  }
  // level finish
  if (G.mode === 'level' && !G.finishing && meters() >= LEVELS[G.li].goal) {
    G.finishing = 1.4; toast(T('lvComplete')); Audio_.play('win');
  }
  if (G.finishing) { G.finishing -= dt; if (G.finishing <= 0) { G.finishing = 0; endRun(true); } }
  // particles
  G.parts.forEach(p => { p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 900 * dt; });
  G.parts = G.parts.filter(p => p.t > 0);
  hudTick();
}
function collect(o, mult) {
  o.dead = true;
  if (o.k === 'coin') {
    G.coins += mult; G.score += 10 * mult; G.meter = Math.min(100, G.meter + 4); Audio_.play('coin');
    burst(o, '#FCD34D', 4);
  } else {
    G.powers++; Audio_.play('power'); buzz(30);
    if (o.type === 'magnet') { G.magnet = upDur('magnet'); toast(T('magnetOn')); }
    if (o.type === 'shield') { G.shield = upDur('shield'); toast(T('shieldUp')); }
    if (o.type === 'x2') { G.x2 = upDur('x2'); toast(T('x2On')); }
  }
}
function smash(o) {
  o.dead = true; G.score += 50; G.shake = 0.25; Audio_.play('smash'); buzz(40);
  burst(o, o.col, 16); burst(o, '#FDE68A', 8);
}
function burst(o, col, n) {
  const [x, y, s] = P(o.lane, Math.max(o.z, 0.1), (o.h || 1) * 0.5);
  for (let i = 0; i < n; i++) G.parts.push({ x, y, vx: rnd(-260, 260) * s, vy: rnd(-520, -120) * s, t: rnd(0.4, 0.8), col, r: rnd(3, 7) * s });
}
function crash() {
  Audio_.play('crash'); buzz(200); G.shake = 0.5; G.flash = 0.5; G.bumps++;
  G.over = true;
  const cost = 150;
  if (!G.revived && S.coins + G.coins >= cost) {
    $('#reviveCost').textContent = cost;
    openModal('m-revive');
    let n = 5; $('#reviveCount').textContent = n;
    clearInterval(G.revTimer);
    G.revTimer = setInterval(() => { n--; $('#reviveCount').textContent = n; if (n <= 0) { clearInterval(G.revTimer); closeModal('m-revive'); endRun(false); } }, 1000);
  } else setTimeout(() => endRun(false), 700);
}
function revive() {
  clearInterval(G.revTimer); closeModal('m-revive');
  const cost = 150;
  if (G.coins >= cost) G.coins -= cost; else { S.coins -= cost - G.coins; G.coins = 0; }
  G.revived = true; G.over = false; G.shield = 3;
  G.objs = G.objs.filter(o => o.z > 30 || o.k !== 'ob');
  G.countdown = 2.99; $('#count').textContent = 3; $('#count').classList.add('on');
  save(); Audio_.play('power');
}

/* ---------- render ---------- */
function render() {
  cx.save();
  if (G.shake > 0) cx.translate(rnd(-6, 6) * G.shake * 2, rnd(-6, 6) * G.shake * 2);
  // sky
  const g = cx.createLinearGradient(0, 0, 0, HY);
  g.addColorStop(0, theme.sky[0]); g.addColorStop(1, theme.sky[1]);
  cx.fillStyle = g; cx.fillRect(-20, -20, W + 40, HY + 22);
  if (theme.night) { cx.fillStyle = '#FEF3C7'; for (let i = 0; i < 30; i++) { cx.fillRect((i * 97) % W, (i * 53) % (HY * 0.7), 2, 2); } ell(W * 0.8, HY * 0.25, 22, 22, '#FEF9C3'); }
  else ell(W * 0.78, HY * 0.3, 30, 30, 'rgba(255,255,255,.85)');
  horizon();
  // ground
  cx.fillStyle = theme.ground; cx.fillRect(-20, HY, W + 40, H - HY + 20);
  const th = theme.theme;
  if (th === 'water' || th === 'sea') {
    const far = P(0, ZMAX, 0)[1];
    cx.fillStyle = '#0EA5E9';
    if (th === 'water') { poly([[P(-1.75, ZMAX, 0)[0], far], [P(-1.75, -3, 0)[0], H], [-40, H], [-40, far]], '#0284C7'); poly([[P(1.75, ZMAX, 0)[0], far], [P(1.75, -3, 0)[0], H], [W + 40, H], [W + 40, far]], '#0284C7'); }
    else poly([[P(-1.75, ZMAX, 0)[0], far], [P(-1.75, -3, 0)[0], H], [-40, H], [-40, far]], '#0EA5E9');
    // wave lines
    cx.strokeStyle = 'rgba(255,255,255,.5)'; cx.lineWidth = 2;
    for (let i = 0; i < 12; i++) { const z = ((i * 9 - G.dist * 0.6) % 108 + 108) % 108; const [x, y, s] = P(-3, z, 0); cx.beginPath(); cx.moveTo(x - 30 * s, y); cx.lineTo(x + 30 * s, y); cx.stroke(); if (th === 'water') { const q = P(3, z, 0); cx.beginPath(); cx.moveTo(q[0] - 30 * s, q[1]); cx.lineTo(q[0] + 30 * s, q[1]); cx.stroke(); } }
  }
  // road
  const a = P(-1.6, ZMAX, 0), b = P(1.6, ZMAX, 0), c = P(1.6, -3, 0), d = P(-1.6, -3, 0);
  poly([[a[0], a[1]], [b[0], b[1]], [c[0], c[1]], [d[0], d[1]]], theme.road);
  // curbs in truck-art colours
  const cols = ['#DC2626', '#FACC15', '#10B981', '#2563EB'];
  const off = G.dist % 4;
  for (let z = -3 - off; z < ZMAX; z += 4) {
    const k = Math.floor((z + off + G.dist) / 4 + 1000) % 4;
    [[-1.6, -1.8], [1.6, 1.8]].forEach(([x1, x2]) => {
      const p1 = P(x1, z, 0), p2 = P(x2, z, 0), p3 = P(x2, z + 4, 0), p4 = P(x1, z + 4, 0);
      poly([[p1[0], p1[1]], [p2[0], p2[1]], [p3[0], p3[1]], [p4[0], p4[1]]], cols[k]);
    });
  }
  // lane dashes
  cx.fillStyle = 'rgba(255,248,220,.75)';
  for (let z = -3 - (G.dist % 6); z < ZMAX; z += 6) {
    [-0.5, 0.5].forEach(x => { const p1 = P(x - 0.03, z, 0), p2 = P(x + 0.03, z, 0), p3 = P(x + 0.03, z + 2.5, 0), p4 = P(x - 0.03, z + 2.5, 0); poly([[p1[0], p1[1]], [p2[0], p2[1]], [p3[0], p3[1]], [p4[0], p4[1]]], 'rgba(255,248,220,.75)'); });
  }
  // haze
  const hz = cx.createLinearGradient(0, HY, 0, HY + (BY - HY) * 0.18);
  hz.addColorStop(0, theme.sky[1]); hz.addColorStop(1, 'rgba(255,255,255,0)');
  cx.fillStyle = hz; cx.fillRect(-20, HY, W + 40, (BY - HY) * 0.18);
  // objects far → near
  const list = G.objs.concat(G.scen).filter(o => o.z < ZMAX && o.z > -2.8);
  list.push({ k: 'player', z: 0.2 });
  const sk = o => ((o.k === 'ob' || o.k === 'sc') && o.z < 0.2 && o.z + o.d > 0.2 ? 0.3 : o.z);
  list.sort((p, q) => sk(q) - sk(p));
  for (const o of list) {
    if (o.k === 'player') drawPlayer();
    else if (o.k === 'ob') drawOb(o);
    else if (o.k === 'coin') drawCoin(o);
    else if (o.k === 'pw') drawPw(o);
    else drawScen(o);
  }
  G.parts.forEach(p => { cx.globalAlpha = Math.min(1, p.t * 2); ell(p.x, p.y, p.r, p.r, p.col); });
  cx.globalAlpha = 1;
  if (G.roar > 0) { cx.fillStyle = `rgba(245,158,11,${0.12 + Math.sin(G.t * 20) * 0.05})`; cx.fillRect(0, 0, W, H); speedLines(); }
  if (G.flash > 0) { cx.fillStyle = `rgba(220,38,38,${G.flash * 0.6})`; cx.fillRect(0, 0, W, H); }
  cx.restore();
}
function speedLines() {
  cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = 2;
  for (let i = 0; i < 14; i++) { const ang = i / 14 * Math.PI * 2 + G.t; const r1 = W * 0.35 + ((G.t * 900 + i * 60) % (W * 0.5)); cx.beginPath(); cx.moveTo(W / 2 + Math.cos(ang) * r1, HY + Math.sin(ang) * r1); cx.lineTo(W / 2 + Math.cos(ang) * (r1 + 40), HY + Math.sin(ang) * (r1 + 40)); cx.stroke(); }
}
function horizon() {
  const y = HY + 1, th = theme.theme, par = -camX * 18;
  const far = theme.night ? '#1E1B4B' : 'rgba(120,53,15,.35)';
  cx.save(); cx.translate(par, 0);
  cx.fillStyle = far;
  if (th === 'capital' || th === 'hills') {
    cx.fillStyle = th === 'capital' ? '#15803D' : '#92400E';
    cx.beginPath(); cx.moveTo(-60, y); for (let x = -60; x <= W + 60; x += 30) cx.lineTo(x, y - 40 - Math.abs(Math.sin(x * 0.02)) * 60 - Math.sin(x * 0.07) * 12); cx.lineTo(W + 60, y); cx.fill();
    if (th === 'capital') { // stylised tent-roof mosque with four minarets
      const m = W * 0.5; cx.fillStyle = '#F8FAFC';
      poly([[m - 40, y], [m, y - 46], [m + 40, y]], '#F8FAFC', '#94A3B8', 1.5);
      [-58, -48, 48, 58].forEach(o => { cx.fillRect(m + o - 2, y - 70, 4, 70); poly([[m + o - 3, y - 70], [m + o, y - 82], [m + o + 3, y - 70]], '#F8FAFC'); });
    }
  } else if (th === 'sea') {
    cx.fillStyle = '#38BDF8'; cx.fillRect(-60, y - 6, W * 0.55 + 60, 6);
    cx.fillStyle = far; [[W * 0.6, 50, 22], [W * 0.68, 80, 18], [W * 0.76, 36, 30], [W * 0.88, 64, 20]].forEach(([x, h, w]) => cx.fillRect(x, y - h, w, h));
  } else if (th === 'fields') {
    cx.fillStyle = '#65A30D'; cx.beginPath(); cx.moveTo(-60, y); for (let x = -60; x <= W + 60; x += 20) cx.lineTo(x, y - 10 - Math.sin(x * 0.03) * 6); cx.lineTo(W + 60, y); cx.fill();
    cx.fillStyle = '#3F6212'; for (let x = 10; x < W; x += 70) ell(x, y - 18, 16, 14, '#3F6212');
  } else if (th === 'water') {
    cx.fillStyle = '#475569'; cx.fillRect(W * 0.15, y - 22, W * 0.7, 10);
    for (let x = W * 0.15; x < W * 0.85; x += 18) cx.fillRect(x, y - 30, 7, 30);
  } else {
    // domes, minarets and a tower
    const sk = [[0.05, 34, 30, 0], [0.16, 60, 10, 1], [0.24, 44, 50, 2], [0.4, 30, 26, 0], [0.5, 80, 14, th === 'clock' ? 3 : 1], [0.6, 50, 44, 2], [0.75, 38, 30, 0], [0.86, 66, 10, 1], [0.94, 40, 36, 0]];
    sk.forEach(([fx, h, w, k]) => {
      const x = fx * W;
      cx.fillRect(x - w / 2, y - h, w, h);
      if (k === 1) { poly([[x - w / 2 - 2, y - h], [x, y - h - 16], [x + w / 2 + 2, y - h]], far); }
      if (k === 2) { cx.beginPath(); cx.arc(x, y - h, w * 0.36, Math.PI, 0); cx.fill(); cx.fillRect(x - 1, y - h - w * 0.36 - 8, 2, 8); }
      if (k === 3) { cx.fillRect(x - w / 2 - 3, y - h - 14, w + 6, 14); ell(x, y - h - 7, 5, 5, '#FEF3C7'); poly([[x - w / 2 - 3, y - h - 14], [x, y - h - 30], [x + w / 2 + 3, y - h - 14]], far); }
    });
  }
  cx.restore();
}
function box(xl, z, d, h, w, front, top, side, stroke = UMB) {
  const zf = Math.max(z, -2.7), zb = z + d;
  const fl = P(xl - w / 2, zf, 0), fr = P(xl + w / 2, zf, 0), ftl = P(xl - w / 2, zf, h), ftr = P(xl + w / 2, zf, h);
  const bl = P(xl - w / 2, zb, 0), br = P(xl + w / 2, zb, 0), btl = P(xl - w / 2, zb, h), btr = P(xl + w / 2, zb, h);
  const lw = Math.max(1, 2.2 * fl[2]);
  poly([ftl, ftr, btr, btl].map(p => [p[0], p[1]]), top, stroke, lw);
  if (fl[0] > W / 2) poly([fl, ftl, btl, bl].map(p => [p[0], p[1]]), side, stroke, lw);
  if (fr[0] < W / 2) poly([fr, ftr, btr, br].map(p => [p[0], p[1]]), side, stroke, lw);
  poly([fl, fr, ftr, ftl].map(p => [p[0], p[1]]), front, stroke, lw);
  return { x: fl[0], y: ftl[1], w: fr[0] - fl[0], h: fl[1] - ftl[1], s: fl[2], side: fl[0] > W / 2 ? [fl, ftl, btl, bl] : [fr, ftr, btr, br] };
}
function shadow(xl, z, w) { const p = P(xl, Math.max(z, -2.7), 0); ell(p[0], p[1], w * LW * p[2] * 0.5, 10 * p[2], 'rgba(0,0,0,.25)'); }
function drawOb(o) {
  const t = o.type;
  if (t === 'banner') {
    const pl = P(o.lane - 0.48, o.z, 0), pr = P(o.lane + 0.48, o.z, 0), s = pl[2];
    const top = P(o.lane, o.z, 2.5)[1], cb = P(o.lane, o.z, 1.15)[1], ct = P(o.lane, o.z, 2.15)[1];
    cx.fillStyle = '#92400E'; cx.fillRect(pl[0] - 4 * s, top, 8 * s, pl[1] - top); cx.fillRect(pr[0] - 4 * s, top, 8 * s, pr[1] - top);
    poly([[pl[0], ct], [pr[0], ct], [pr[0], cb], [pl[0], cb]], '#FFFBEB', UMB, 2 * s);
    cx.fillStyle = o.col; cx.fillRect(pl[0], ct, pr[0] - pl[0], (cb - ct) * 0.3);
    const n = 6, bw = (pr[0] - pl[0]) / n;
    for (let i = 0; i < n; i++) poly([[pl[0] + i * bw, cb], [pl[0] + (i + 1) * bw, cb], [pl[0] + (i + 0.5) * bw, cb + bw * 0.8]], ['#DC2626', '#FACC15', '#10B981', '#2563EB'][i % 4], UMB, 1.2 * s);
    cx.fillStyle = UMB; cx.font = `900 ${Math.max(6, 22 * s)}px "Lilita One",sans-serif`; cx.textAlign = 'center';
    cx.fillText('★ ★ ★', (pl[0] + pr[0]) / 2, (ct + cb) / 2 + 12 * s);
    return;
  }
  shadow(o.lane, o.z, o.w);
  if (t === 'barrier') {
    const f = box(o.lane, o.z, o.d, o.h, o.w, '#FFFFFF', '#F1F5F9', '#CBD5E1');
    cx.save(); cx.beginPath(); cx.rect(f.x, f.y + f.h * 0.2, f.w, f.h * 0.45); cx.clip();
    cx.fillStyle = '#DC2626'; for (let i = -2; i < 10; i++) poly([[f.x + i * f.w / 6, f.y + f.h * 0.65], [f.x + (i + 0.5) * f.w / 6, f.y + f.h * 0.65], [f.x + (i + 1) * f.w / 6, f.y + f.h * 0.2], [f.x + (i + 0.5) * f.w / 6, f.y + f.h * 0.2]], '#DC2626');
    cx.restore();
    cx.fillStyle = '#FACC15'; cx.fillRect(f.x + f.w * 0.05, f.y - 6 * f.s, 8 * f.s, 6 * f.s); cx.fillRect(f.x + f.w * 0.95 - 8 * f.s, f.y - 6 * f.s, 8 * f.s, 6 * f.s);
  } else if (t === 'cart') {
    const f = box(o.lane, o.z + 0.2, o.d - 0.2, 0.7, o.w, '#B45309', '#D97706', '#92400E');
    for (let i = 0; i < 5; i++) ell(f.x + f.w * (0.15 + i * 0.175), f.y - 4 * f.s, 9 * f.s, 8 * f.s, i % 2 ? '#F97316' : '#FACC15', UMB, 1.5 * f.s);
    for (let i = 0; i < 3; i++) ell(f.x + f.w * (0.25 + i * 0.25), f.y - 12 * f.s, 8 * f.s, 7 * f.s, '#65A30D', UMB, 1.5 * f.s);
    ell(f.x + f.w * 0.15, f.y + f.h, 11 * f.s, 11 * f.s, '#44403C', UMB, 2 * f.s); ell(f.x + f.w * 0.85, f.y + f.h, 11 * f.s, 11 * f.s, '#44403C', UMB, 2 * f.s);
    cx.strokeStyle = '#FDE68A'; cx.lineWidth = 2 * f.s; cx.strokeRect(f.x + f.w * 0.1, f.y + f.h * 0.25, f.w * 0.8, f.h * 0.35);
  } else if (t === 'rick') {
    const f = box(o.lane, o.z, o.d, o.h, o.w, '#16A34A', '#111827', '#15803D');
    cx.fillStyle = '#FACC15'; cx.fillRect(f.x, f.y + f.h * 0.42, f.w, f.h * 0.14);
    cx.fillStyle = '#1F2937'; cx.fillRect(f.x + f.w * 0.2, f.y + f.h * 0.08, f.w * 0.6, f.h * 0.28);
    cx.fillStyle = '#F8FAFC'; cx.fillRect(f.x + f.w * 0.32, f.y + f.h * 0.66, f.w * 0.36, f.h * 0.14);
    ell(f.x + f.w * 0.12, f.y + f.h * 0.72, 6 * f.s, 6 * f.s, '#EF4444'); ell(f.x + f.w * 0.88, f.y + f.h * 0.72, 6 * f.s, 6 * f.s, '#EF4444');
    for (let i = 0; i < 6; i++) ell(f.x + f.w * (0.1 + i * 0.16), f.y + f.h * 0.49, 3 * f.s, 3 * f.s, ['#DC2626', '#2563EB', '#F8FAFC'][i % 3]);
    ell(f.x + f.w * 0.5, f.y + f.h, 12 * f.s, 8 * f.s, '#111827');
  } else if (t === 'truck') {
    const f = box(o.lane, o.z, o.d, o.h, o.w, o.col, '#FDE68A', '#B45309');
    const s = f.s;
    // crown on top (the famous truck-art "taj")
    const cw = f.w, cxm = f.x + cw / 2, cy0 = f.y;
    poly([[f.x, cy0], [f.x + cw * 0.1, cy0 - 26 * s], [cxm - cw * 0.12, cy0 - 30 * s], [cxm, cy0 - 48 * s], [cxm + cw * 0.12, cy0 - 30 * s], [f.x + cw * 0.9, cy0 - 26 * s], [f.x + cw, cy0]], '#FACC15', UMB, 2 * s);
    ell(cxm, cy0 - 26 * s, 9 * s, 9 * s, '#DC2626', UMB, 1.5 * s);
    // painted panels
    const pc = ['#FACC15', '#10B981', '#2563EB', '#F472B6'];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const px = f.x + f.w * (0.06 + c * 0.225), py = f.y + f.h * (0.08 + r * 0.2);
      cx.fillStyle = pc[(r + c) % 4]; cx.fillRect(px, py, f.w * 0.19, f.h * 0.16);
      ell(px + f.w * 0.095, py + f.h * 0.08, 4 * s, 4 * s, '#FFFFFF');
    }
    // eyes + chains
    ell(f.x + f.w * 0.3, f.y + f.h * 0.78, 12 * s, 8 * s, '#FFFFFF', UMB, 2 * s); ell(f.x + f.w * 0.3, f.y + f.h * 0.78, 5 * s, 5 * s, UMB);
    ell(f.x + f.w * 0.7, f.y + f.h * 0.78, 12 * s, 8 * s, '#FFFFFF', UMB, 2 * s); ell(f.x + f.w * 0.7, f.y + f.h * 0.78, 5 * s, 5 * s, UMB);
    cx.fillStyle = '#E5E7EB'; for (let i = 0; i < 9; i++) cx.fillRect(f.x + f.w * (0.05 + i * 0.11), f.y + f.h * 0.94, 4 * s, 8 * s);
    ell(f.x + f.w * 0.06, f.y + f.h * 0.66, 5 * s, 5 * s, '#EF4444'); ell(f.x + f.w * 0.94, f.y + f.h * 0.66, 5 * s, 5 * s, '#EF4444');
  }
}
function drawCoin(o) {
  const [x, y, s] = P(o.lane, o.z, o.h);
  const r = 13 * s * (W / 400), sp = Math.abs(Math.cos(G.t * 5 + o.z * 0.4));
  ell(x, y, r * (0.25 + sp * 0.75), r, '#FBBF24', UMB, Math.max(1, 2 * s));
  if (sp > 0.4) ell(x, y, r * 0.55 * sp, r * 0.6, null, '#D97706', Math.max(1, 2 * s));
  ell(x - r * 0.3 * sp, y - r * 0.35, r * 0.18 * sp, r * 0.2, 'rgba(255,255,255,.8)');
}
function drawPw(o) {
  const [x, y, s] = P(o.lane, o.z, o.h + Math.sin(G.t * 4) * 0.1);
  const r = 22 * s * (W / 400);
  ell(x, y, r * 1.35, r * 1.35, 'rgba(255,255,255,.35)');
  const col = { magnet: '#DC2626', shield: '#059669', x2: '#F59E0B' }[o.type];
  ell(x, y, r, r, col, UMB, 3 * s);
  cx.fillStyle = '#fff'; cx.strokeStyle = '#fff'; cx.lineWidth = 4 * s;
  if (o.type === 'magnet') { cx.beginPath(); cx.arc(x, y, r * 0.45, Math.PI, 0, true); cx.stroke(); cx.fillRect(x - r * 0.62, y - r * 0.42, r * 0.34, r * 0.3); cx.fillRect(x + r * 0.28, y - r * 0.42, r * 0.34, r * 0.3); }
  if (o.type === 'shield') poly([[x - r * 0.45, y - r * 0.45], [x + r * 0.45, y - r * 0.45], [x + r * 0.4, y + r * 0.1], [x, y + r * 0.55], [x - r * 0.4, y + r * 0.1]], '#fff');
  if (o.type === 'x2') { cx.font = `900 ${r}px "Lilita One",sans-serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('2x', x, y + 1); cx.textBaseline = 'alphabetic'; }
}
function lerpPt(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
function drawScen(o) {
  const t = o.type;
  if (t === 'bld') {
    const f = box(o.x, o.z, o.d, o.h, 1.1, o.wall, o.col, o.wall);
    // arched windows on the road-facing side
    const [b0, t0, t1, b1] = o.side ? f.side : f.side;
    const rows = Math.max(1, Math.floor(o.h / 1.2)), cols = 3;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const u0 = (c + 0.25) / cols, u1 = (c + 0.75) / cols, v0 = (r + 0.3) / rows, v1 = (r + 0.8) / rows;
      const q = (u, v) => lerpPt(lerpPt(b0, b1, u), lerpPt(t0, t1, u), v);
      const lit = theme.night ? (o.seed * 10 + r + c) % 3 < 2 : false;
      poly([q(u0, v0), q(u1, v0), q(u1, v1), q(u0, v1)], lit ? '#FDE68A' : 'rgba(58,33,17,.55)');
    }
    // shop awning
    const a0 = lerpPt(b0, t0, 0.18), a1 = lerpPt(b1, t1, 0.18), a2 = lerpPt(b1, t1, 0.3), a3 = lerpPt(b0, t0, 0.3);
    poly([a0, a1, a2, a3], o.col, UMB, 1);
    if (o.dome) { const r = f.w * 0.3; cx.fillStyle = o.col; cx.beginPath(); cx.arc(f.x + f.w / 2, f.y, r, Math.PI, 0); cx.fill(); cx.strokeStyle = UMB; cx.lineWidth = Math.max(1, 2 * f.s); cx.stroke(); }
    return;
  }
  const [x, y, s] = P(o.x, o.z, 0), k = s * W / 400;
  if (t === 'tree' || t === 'hay') {
    if (t === 'hay') { ell(x, y - 18 * k, 26 * k, 22 * k, '#EAB308', UMB, 2 * s); return; }
    cx.fillStyle = '#78350F'; cx.fillRect(x - 5 * k, y - o.h * 30 * k, 10 * k, o.h * 30 * k);
    ell(x, y - o.h * 34 * k, 34 * k, 30 * k, '#15803D', UMB, 2 * s); ell(x - 12 * k, y - o.h * 38 * k, 14 * k, 12 * k, '#22C55E');
  } else if (t === 'pine') {
    cx.fillStyle = '#78350F'; cx.fillRect(x - 4 * k, y - 20 * k, 8 * k, 20 * k);
    for (let i = 0; i < 3; i++) poly([[x - (30 - i * 7) * k, y - (18 + i * 26) * k], [x, y - (18 + i * 26 + 48) * k], [x + (30 - i * 7) * k, y - (18 + i * 26) * k]], '#166534', UMB, 1.5 * s);
  } else if (t === 'palm') {
    cx.strokeStyle = '#92400E'; cx.lineWidth = 7 * k; cx.beginPath(); cx.moveTo(x, y); cx.quadraticCurveTo(x + o.side * 10 * k, y - 60 * k, x - o.side * 4 * k, y - 110 * k); cx.stroke();
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; cx.strokeStyle = '#16A34A'; cx.lineWidth = 6 * k; cx.beginPath(); cx.moveTo(x - o.side * 4 * k, y - 110 * k); cx.quadraticCurveTo(x + Math.cos(a) * 30 * k, y - 130 * k, x + Math.cos(a) * 46 * k, y - 100 * k + Math.abs(Math.sin(a)) * 10 * k); cx.stroke(); }
  } else if (t === 'lamp') {
    cx.fillStyle = '#44403C'; cx.fillRect(x - 3 * k, y - 110 * k, 6 * k, 110 * k); cx.fillRect(Math.min(x, x - o.side * 26 * k), y - 110 * k, 26 * k, 5 * k);
    ell(x - o.side * 24 * k, y - 102 * k, 7 * k, 5 * k, theme.night ? '#FEF08A' : '#FDE68A');
    if (theme.night) ell(x - o.side * 24 * k, y - 100 * k, 22 * k, 16 * k, 'rgba(254,240,138,.25)');
  } else if (t === 'rail' || t === 'post') {
    cx.fillStyle = t === 'rail' ? '#E5E7EB' : '#A16207'; cx.fillRect(x - 3 * k, y - 32 * k, 6 * k, 32 * k);
    const n = P(o.x, o.z + 5, 0);
    cx.strokeStyle = t === 'rail' ? '#E5E7EB' : '#A16207'; cx.lineWidth = Math.max(1, 3 * k); cx.beginPath(); cx.moveTo(x, y - 28 * k); cx.lineTo(n[0], n[1] - 28 * n[2] * W / 400); cx.stroke();
  }
}
function drawPlayer() {
  const [x, yg, s] = P(G.x, 0.2, 0);
  const y = P(G.x, 0.2, G.h)[1];
  const size = UH * 1.65 * s;
  // ground shadow
  ell(x, yg, size * 0.32 * (1 - Math.min(G.h, 2) * 0.15), size * 0.07, 'rgba(0,0,0,.3)');
  drawLionBack(x, y, size, G.t, { slide: G.slide > 0 && G.h < 0.3, air: G.h > 0.05, o: outfit() });
  if (G.shield > 0) {
    const a = G.shield < 1.5 ? (Math.sin(G.t * 30) > 0 ? 0.35 : 0.1) : 0.3;
    ell(x, y - size * 0.55, size * 0.6, size * 0.66, `rgba(52,211,153,${a})`, 'rgba(16,185,129,.9)', 3);
  }
  if (G.magnet > 0) { cx.strokeStyle = 'rgba(220,38,38,.5)'; cx.lineWidth = 2; cx.beginPath(); cx.arc(x, y - size * 0.5, size * (0.7 + (G.t * 2 % 1) * 0.4), 0, Math.PI * 2); cx.stroke(); }
}
function drawLionBack(x, y, size, t, st) {
  const o = st.o, lw = Math.max(1.5, size * 0.022), ph = t * 16;
  cx.save(); cx.translate(x, y);
  if (st.slide) cx.scale(1.1, 0.55);
  const sw = Math.sin(ph), cw = Math.cos(ph);
  // legs
  const legY = st.air ? -size * 0.12 : -size * 0.1;
  [[-1, sw], [1, -sw]].forEach(([side, p]) => {
    const ly = st.air ? 0 : p * size * 0.06;
    ell(side * size * 0.13, legY + ly, size * 0.08, size * 0.12, o.fur, UMB, lw);
    ell(side * size * 0.13, legY + ly + size * 0.09, size * 0.085, size * 0.045, '#FDBA74', UMB, lw);
  });
  // tail
  cx.strokeStyle = UMB; cx.lineWidth = lw * 4.2; cx.lineCap = 'round';
  const tx = Math.sin(ph * 0.5) * size * 0.2;
  cx.beginPath(); cx.moveTo(0, -size * 0.22); cx.quadraticCurveTo(tx * 0.5, -size * 0.05, tx, -size * 0.28); cx.stroke();
  cx.strokeStyle = o.fur; cx.lineWidth = lw * 2.4; cx.stroke();
  ell(tx, -size * 0.3, size * 0.05, size * 0.06, '#9A3412', UMB, lw);
  // body + vest
  ell(0, -size * 0.36, size * 0.25, size * 0.22, o.fur, UMB, lw);
  cx.beginPath(); cx.ellipse(0, -size * 0.38, size * 0.24, size * 0.2, 0, Math.PI * 1.05, Math.PI * 1.95); cx.lineTo(size * 0.2, -size * 0.3); cx.lineTo(-size * 0.2, -size * 0.3); cx.closePath();
  cx.fillStyle = o.vest; cx.fill(); cx.strokeStyle = UMB; cx.lineWidth = lw; cx.stroke();
  cx.fillStyle = o.trim; cx.fillRect(-size * 0.2, -size * 0.33, size * 0.4, size * 0.03);
  if (o.pat === 'truck') ['#FACC15', '#10B981', '#2563EB'].forEach((c, i) => poly([[(-0.12 + i * 0.1) * size, -size * 0.36], [(-0.08 + i * 0.1) * size, -size * 0.44], [(-0.04 + i * 0.1) * size, -size * 0.36]], c));
  if (o.pat === 'stripe') { cx.fillStyle = o.trim; cx.fillRect(-size * 0.02, -size * 0.55, size * 0.04, size * 0.22); }
  // arms
  [[-1, -cw], [1, cw]].forEach(([side, p]) => ell(side * size * 0.26, -size * 0.42 + p * size * 0.05, size * 0.07, size * 0.12, o.fur, UMB, lw));
  // mane (back of head)
  const hy = -size * 0.7 + Math.abs(sw) * size * 0.015;
  cx.beginPath();
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r = (i % 2 ? 0.2 : 0.25) * size; cx.lineTo(Math.cos(a) * r, hy + Math.sin(a) * r); }
  cx.closePath(); cx.fillStyle = '#9A3412'; cx.fill(); cx.strokeStyle = UMB; cx.lineWidth = lw; cx.stroke();
  ell(0, hy, size * 0.18, size * 0.18, '#C2410C');
  for (let i = 0; i < 5; i++) { cx.strokeStyle = '#EA580C'; cx.lineWidth = lw * 1.4; cx.beginPath(); cx.moveTo((-0.1 + i * 0.05) * size, hy - size * 0.12); cx.quadraticCurveTo((-0.08 + i * 0.05) * size, hy, (-0.1 + i * 0.05) * size, hy + size * 0.12); cx.stroke(); }
  ell(-size * 0.15, hy - size * 0.17, size * 0.055, size * 0.055, o.fur, UMB, lw);
  ell(size * 0.15, hy - size * 0.17, size * 0.055, size * 0.055, o.fur, UMB, lw);
  // headband knot
  cx.strokeStyle = '#15803D'; cx.lineWidth = lw * 2.5; cx.beginPath(); cx.moveTo(-size * 0.17, hy - size * 0.06); cx.quadraticCurveTo(0, hy - size * 0.02, size * 0.17, hy - size * 0.06); cx.stroke();
  cx.lineWidth = lw * 1.6; cx.beginPath(); cx.moveTo(size * 0.02, hy - size * 0.04); cx.lineTo(size * 0.1 + sw * size * 0.03, hy + size * 0.08); cx.stroke();
  if (G.roar > 0 && G.on) { for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.35; poly([[Math.cos(a) * size * 0.3, hy + Math.sin(a) * size * 0.3], [Math.cos(a) * size * (0.45 + Math.random() * 0.1), hy + Math.sin(a) * size * (0.45 + Math.random() * 0.1)], [Math.cos(a + 0.12) * size * 0.3, hy + Math.sin(a + 0.12) * size * 0.3]], 'rgba(250,204,21,.85)'); } }
  cx.restore();
}

/* idle background animation behind menus */
function menuScene(dt) {
  if (!G.menu) return;
  G.menu.t += dt; G.t = G.menu.t;
  G.dist += dt * 8;
  G.scen.forEach(o => (o.z -= dt * 8)); G.scen = G.scen.filter(o => o.z + o.d > -6);
  G.nextScen -= dt * 8; while (G.nextScen <= 0) { spawnScenery(ZMAX + G.nextScen); G.nextScen += 5; }
}

/* ================= HUD ================= */
let lastHud = 0;
function hudTick() {
  const now = performance.now(); if (now - lastHud < 80) return; lastHud = now;
  $('#hScore').textContent = fmt(G.score);
  $('#hCoins').textContent = fmt(G.coins);
  $('#hX2').style.display = G.x2 > 0 ? '' : 'none';
  if (G.mode === 'level') {
    const goal = LEVELS[G.li].goal;
    $('#hDist').textContent = `${fmt(meters())} / ${fmt(goal)} m`;
    $('#hBar').style.width = `${clamp(meters() / goal * 100, 0, 100)}%`; $('#hBarWrap').style.display = '';
  } else { $('#hDist').textContent = `${fmt(meters())} m`; $('#hBarWrap').style.display = 'none'; }
  const rb = $('#roarBtn'); rb.style.setProperty('--p', G.roar > 0 ? G.roar / upDur('roar') * 100 : G.meter);
  rb.classList.toggle('full', G.meter >= 100 && G.roar <= 0);
  const pw = [['magnet', '🧲', 'powerMagnet', upDur('magnet')], ['shield', '🛡️', 'powerShield', upDur('shield')], ['x2', '✨', 'powerX2', upDur('x2')], ['roar', '🦁', 'powerRoar', upDur('roar')]]
    .filter(p => G[p[0]] > 0)
    .map(p => `<div class="pw"><span class="ic">${p[1]}</span>${T(p[2])}<div class="bar"><i style="width:${G[p[0]] / p[3] * 100}%"></i></div></div>`).join('');
  $('#powers').innerHTML = pw;
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1100); }
let hintKey = null;
function hint(k) { if (k === hintKey) return; hintKey = k; const h = $('#hint'); if (!k) { h.classList.remove('on'); return; } h.textContent = T(k); h.classList.add('on'); }

/* ================= FLOW ================= */
let screen = 'load';
function show(name) {
  screen = name;
  $$('.screen').forEach(s => s.classList.toggle('on', s.id === `s-${name}`));
  $('#nav').classList.toggle('on', ['home', 'map', 'shop', 'missions', 'records'].includes(name));
  $$('#nav button').forEach(b => b.classList.toggle('cur', b.dataset.to === name));
  $('#hud').classList.toggle('on', name === 'run');
  if (name !== 'run') { hint(null); $('#count').classList.remove('on'); }
  if (name === 'home') renderHome();
  if (name === 'map') renderMap();
  if (name === 'shop') renderShop();
  if (name === 'missions') renderMissions();
  if (name === 'records') renderRecords();
  if (name !== 'run' && Audio_.current !== 'menu') Audio_.music('menu');
  refreshCoins();
}
function refreshCoins() {
  $$('.coinsVal').forEach(e => (e.textContent = fmt(S.coins)));
  $('#rankNum').textContent = rankOf(S.xp);
  $('#missionDot').classList.toggle('on', claimable() > 0);
}
function startRun(mode, li = 0) {
  closeAll();
  newRun(mode, li); G.menu = null;
  show('run');
  $('#pad').classList.toggle('on', S.opt.pad);
  $('#count').textContent = 3; $('#count').classList.add('on'); Audio_.play('count');
  Audio_.music('run');
  hintKey = null; hint(null);
}
function pause() {
  if (!G.on || G.over || G.paused) return;
  G.paused = true; Audio_.pauseAll(); openSettings(true);
}
function resume() {
  closeModal('m-settings'); if (!G.on) return;
  G.paused = false; Audio_.resumeAll();
  if (!G.over) { G.countdown = Math.max(G.countdown, 2.99); $('#count').textContent = 3; $('#count').classList.add('on'); }
}
function endRun(success) {
  if (!G.on) return;
  clearInterval(G.revTimer);
  G.on = false; G.over = true; hint(null);
  const m = Math.floor(meters()), score = Math.floor(G.score), coins = G.coins;
  const lv = G.mode === 'level' ? LEVELS[G.li] : null;
  let stars = 0, prevStars = 0, unlocked = false;
  if (lv && success) {
    stars = 1 + (coins >= lv.coins ? 1 : 0) + (G.bumps === 0 && !G.revived ? 1 : 0);
    prevStars = S.stars[lv.id] || 0;
    if (!prevStars && G.li < LEVELS.length - 1) unlocked = true;
    S.stars[lv.id] = Math.max(prevStars, stars);
    S.sel = Math.min(G.li + 1, LEVELS.length - 1);
  }
  const st = S.stats, newBest = score > st.bestScore;
  st.runs++; st.totalCoins += coins; st.jumps += G.jumps; st.slides += G.slides; st.roars += G.roars;
  st.bestDist = Math.max(st.bestDist, m); st.bestScore = Math.max(st.bestScore, score);
  const xp = Math.floor(score / 25) + stars * 20;
  S.coins += coins; S.xp += xp;
  S.top.push({ s: score, m, c: coins, d: today(), l: lv ? lv.id : 'endless' });
  S.top.sort((a, b) => b.s - a.s); S.top = S.top.slice(0, 10);
  dailyUpdate({ coins, dist: m, jumps: G.jumps, slides: G.slides, powers: G.powers, runs: 1, roars: G.roars });
  if (!S.tut) S.tut = true;
  save();
  // results UI
  const title = $('#resTitle');
  title.className = 'ribbon ' + (lv ? (success ? 'green' : 'red') : '');
  title.textContent = lv ? (success ? T('lvComplete') : T('tryAgain')) : T('runOver');
  $('#resStars').innerHTML = lv ? starHTML(success ? stars : 0) : '';
  $('#resBest').innerHTML = newBest ? `<span class="newbest">${T('newBest')}</span>` : '';
  $('#resScore').textContent = fmt(score);
  $('#resDist').textContent = `${fmt(m)} m`;
  $('#resCoins').textContent = `+${fmt(coins)}`;
  $('#resXp').textContent = `+${fmt(xp)}`;
  $('#resMsg').textContent = unlocked ? T('unlockedMsg') : (lv ? nm(lv) : T('endlessName'));
  const btns = [];
  if (lv && success && G.li < LEVELS.length - 1) btns.push(`<button class="btn go" data-act="level" data-li="${G.li + 1}"><svg><use href="#i-play"/></svg>${T('nextLevel')}</button>`);
  if (lv) btns.push(`<button class="btn ${success ? 'gold' : 'go'}" data-act="level" data-li="${G.li}"><svg><use href="#i-redo"/></svg>${T('replay')}</button>`);
  else btns.push(`<button class="btn go" data-act="endless"><svg><use href="#i-redo"/></svg>${T('runAgain')}</button>`);
  btns.push(`<div class="row"><button class="btn wood small" style="flex:1" data-act="nav" data-to="${lv ? 'map' : 'home'}">${lv ? T('toMap') : T('toHome')}</button><button class="btn wood small" style="flex:1" data-act="nav" data-to="shop">${T('shop')}</button></div>`);
  $('#resBtns').innerHTML = btns.join('');
  setTimeout(() => { if (!success) Audio_.play('lose'); openModal('m-results'); }, success ? 100 : 300);
  Audio_.music(null);
}
function starHTML(n, max = 3) { let h = ''; for (let i = 0; i < max; i++) h += i < n ? '★' : '<span class="off">★</span>'; return h; }

/* ---------- modals ---------- */
function openModal(id) { $('#' + id).classList.add('on'); }
function closeModal(id) { $('#' + id).classList.remove('on'); }
function closeAll() { $$('.modal').forEach(m => m.classList.remove('on')); }
function openSettings(inRun) {
  $('#setTitle').textContent = inRun ? T('paused') : T('settings');
  $('#pauseInfo').style.display = inRun ? '' : 'none';
  if (inRun) { $('#pauseLoc').textContent = G.mode === 'level' ? nm(LEVELS[G.li]) : T('endlessName'); $('#pauseScore').textContent = fmt(G.score); }
  $('#setBtns').innerHTML = inRun
    ? `<button class="btn go" data-act="resume"><svg><use href="#i-play"/></svg>${T('resume')}</button>
       <div class="row"><button class="btn gold small" style="flex:1" data-act="restart"><svg><use href="#i-redo"/></svg>${T('restart')}</button>
       <button class="btn wood small" style="flex:1" data-act="quit">${T('quit')}</button></div>`
    : `<button class="btn gold small" style="width:100%" data-act="tutorial">${T('tutorial')}</button>
       <button class="btn go" data-act="closeSettings">${T('close')}</button>
       <p class="tiny" style="text-align:center;margin:0">${T('privacy')}<br>v${VERSION}</p>`;
  syncToggles();
  openModal('m-settings');
}
function syncToggles() {
  $$('.toggle').forEach(t => t.classList.toggle('on', !!S.opt[t.dataset.key]));
  $$('.seglang button').forEach(b => b.classList.toggle('cur', b.dataset.lang === S.lang));
}
function applyLang() {
  document.body.classList.toggle('ur', S.lang === 'ur');
  document.documentElement.lang = S.lang; document.documentElement.dir = S.lang === 'ur' ? 'rtl' : 'ltr';
  $$('[data-t]').forEach(e => (e.textContent = T(e.dataset.t)));
}

/* ---------- home ---------- */
function renderHome() {
  $('#homePortrait').innerHTML = lionSVG();
  $('#homeBest').textContent = fmt(S.stats.bestScore);
  $('#homeStars').textContent = `${totalStars()} / ${LEVELS.length * 3}`;
}

/* ---------- map ---------- */
const MAP_PTS = [[50, 92], [28, 80], [66, 69], [34, 57], [70, 45], [30, 33], [62, 21], [44, 8]];
function unlockedIdx(i) { return i === 0 || (S.stars[LEVELS[i - 1].id] || 0) > 0; }
function renderMap() {
  const vw = 400, vh = 1100, svg = $('#mapsvg');
  svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
  const pts = MAP_PTS.map(([x, y]) => [x / 100 * vw, y / 100 * vh]);
  let path = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; path += ` C${x0} ${(y0 + y1) / 2} ${x1} ${(y0 + y1) / 2} ${x1} ${y1}`; }
  const sel = clamp(S.sel, 0, LEVELS.length - 1);
  let h = `<defs><pattern id="gr" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#A3E635"/><path d="M8 30l3-8 3 8M26 12l3-8 3 8" stroke="#65A30D" stroke-width="2" fill="none"/></pattern></defs>
  <rect width="${vw}" height="${vh}" fill="url(#gr)"/>
  <path d="M-10 ${vh * 0.62} C120 ${vh * 0.55} 200 ${vh * 0.75} 420 ${vh * 0.66}" stroke="#38BDF8" stroke-width="34" fill="none" stroke-linecap="round"/>
  <path d="M-10 ${vh * 0.62} C120 ${vh * 0.55} 200 ${vh * 0.75} 420 ${vh * 0.66}" stroke="#7DD3FC" stroke-width="10" fill="none" stroke-dasharray="20 30"/>
  <path d="M-10 ${vh * 0.99} L420 ${vh * 0.96} L420 ${vh + 10} L-10 ${vh + 10}z" fill="#38BDF8"/>
  <path d="M-20 ${vh * 0.1} l60 -70 l50 50 l60 -80 l70 90 l60 -60 l60 70 l80 -40 v120 h-420z" fill="#4D7C0F" stroke="#3A2111" stroke-width="4"/>
  <path d="${path}" stroke="#3A2111" stroke-width="30" fill="none" stroke-linecap="round"/>
  <path d="${path}" stroke="#F59E0B" stroke-width="20" fill="none" stroke-linecap="round"/>
  <path d="${path}" stroke="#FEF3C7" stroke-width="3" fill="none" stroke-dasharray="12 12"/>`;
  [[70, 180], [340, 300], [60, 520], [350, 800], [90, 950], [320, 1010]].forEach(([x, y]) => (h += `<g transform="translate(${x} ${y})"><rect x="-4" y="0" width="8" height="18" fill="#78350F"/><circle cy="-6" r="20" fill="#15803D" stroke="#3A2111" stroke-width="3"/></g>`));
  LEVELS.forEach((lv, i) => {
    const [x, y] = pts[i], st = S.stars[lv.id] || 0, un = unlockedIdx(i), cur = i === sel;
    const fill = !un ? '#9CA3AF' : st ? '#10B981' : '#F59E0B', r = lv.boss ? 40 : 34;
    h += `<g class="node" data-act="selLevel" data-li="${i}" transform="translate(${x} ${y})" role="button" aria-label="${nm(lv)}">
      ${cur ? `<circle r="${r + 12}" fill="none" stroke="#FFFBEB" stroke-width="6" stroke-dasharray="10 8"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite"/></circle>` : ''}
      <circle r="${r}" cy="5" fill="#3A2111"/><circle r="${r}" fill="${fill}" stroke="#3A2111" stroke-width="5"/>
      <circle r="${r - 8}" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="4"/>
      <text y="${un ? 12 : 10}" text-anchor="middle" font-family="Lilita One" font-weight="900" font-size="${un ? 32 : 26}" fill="#fff" stroke="#3A2111" stroke-width="1.5">${un ? i + 1 : '🔒'}</text>
      ${un && st ? `<text y="${-r - 6}" text-anchor="middle" font-size="22" fill="#FACC15" stroke="#3A2111" stroke-width="1.2">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</text>` : ''}
      <g transform="translate(0 ${r + 20})"><rect x="-78" y="-13" width="156" height="26" rx="13" fill="#3A2111"/><text y="5" text-anchor="middle" font-family="Lilita One" font-weight="800" font-size="13" fill="#FDE68A">${escapeHTML(nm(lv))}</text></g>
      ${cur ? `<g transform="translate(${x > 200 ? -r - 36 : r + 36} -6)"><circle r="26" fill="#FFFBEB" stroke="#3A2111" stroke-width="3"/><g transform="translate(-22 -24) scale(.22)">${lionSVG().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g></g>` : ''}
    </g>`;
  });
  svg.innerHTML = h;
  // sheet
  const lv = LEVELS[sel], un = unlockedIdx(sel);
  $('#lvIcon').textContent = lv.icon;
  $('#lvName').textContent = `${Tf('level', { n: sel + 1 })}: ${nm(lv)}`;
  $('#lvGoal').textContent = un ? Tf('goal', { m: fmt(lv.goal) }) : T('locked');
  $('#lvStars').innerHTML = starHTML(S.stars[lv.id] || 0);
  $('#lvStarRules').textContent = Tf('starRules', { c: lv.coins });
  $('[data-act="startLevel"]').disabled = !un;
  const wrap = $('#mapwrap');
  requestAnimationFrame(() => { const y = pts[sel][1] / vh * svg.getBoundingClientRect().height; wrap.scrollTop = y - wrap.clientHeight * 0.4; });
}
function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ---------- workshop ---------- */
let shopTab = 'up';
const coinTag = n => `<span class="coinlabel"><svg class="ico"><use href="#i-coin"/></svg>${fmt(n)}</span>`;
function renderShop() {
  $('#stageCv').outerHTML = `<div id="stageCv" style="width:180px;height:198px;position:relative;z-index:1">${lionSVG()}</div>`;
  $$('.tabs button').forEach(b => b.classList.toggle('cur', b.dataset.tab === shopTab));
  let h = '';
  if (shopTab === 'up') {
    UPGRADES.forEach(u => {
      const lv = S.up[u.id], cost = UP_COST[lv], maxed = lv >= 5;
      h += `<div class="upg"><div class="badge">${u.icon}</div><div style="flex:1;min-width:0"><h4>${nm(u)}</h4>
        <div class="tiny" style="color:#D6B98C">${Tf('lvl', { n: lv })}   •   ${Tf('lasts', { s: upDur(u.id).toFixed(u.id === 'roar' ? 1 : 0) })}</div>
        <div class="seg">${[0, 1, 2, 3, 4].map(i => `<i class="${i < lv ? 'on' : ''}"></i>`).join('')}</div></div>
        <button class="btn go small" data-act="buyUp" data-id="${u.id}" ${maxed ? 'disabled' : ''}>${maxed ? T('max') : coinTag(cost)}</button></div>`;
    });
  } else {
    h += '<div class="grid2">';
    OUTFITS.forEach(o => {
      const own = S.outfits.includes(o.id), eq = S.outfit === o.id;
      h += `<div class="outfit ${eq ? 'eq' : ''}"><div style="width:92px;height:100px;margin:0 auto">${lionSVG(o)}</div><h4>${nm(o)}</h4>
        ${eq ? `<button class="btn small go" style="width:100%" disabled>${T('equipped')}</button>`
        : own ? `<button class="btn small gold" style="width:100%" data-act="equip" data-id="${o.id}">${T('equip')}</button>`
        : `<button class="btn small wood" style="width:100%" data-act="buyFit" data-id="${o.id}">${coinTag(o.cost)}</button>`}</div>`;
    });
    h += '</div>';
  }
  $('#shopList').innerHTML = h;
}
function spend(n) {
  if (S.coins < n) { toast(T('notEnough')); Audio_.play('lose'); return false; }
  S.coins -= n; Audio_.play('buy'); buzz(30); return true;
}

/* ---------- missions ---------- */
function statVal(stat) {
  if (stat === 'stars') return totalStars();
  if (stat.startsWith('lv_')) return (S.stars[stat.slice(3)] || 0) > 0 ? 1 : 0;
  return S.stats[stat] || 0;
}
function dailySet() {
  const d = today();
  if (!S.daily || S.daily.date !== d) {
    let seed = [...d].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const pool = DAILY_POOL.slice(), ids = [];
    while (ids.length < 3) { seed = (seed * 1103515245 + 12345) >>> 0; ids.push(pool.splice(seed % pool.length, 1)[0].id); }
    S.daily = { date: d, ids, prog: {}, claimed: [] }; save();
  }
  return S.daily;
}
function dailyUpdate(run) {
  const ds = dailySet();
  ds.ids.forEach(id => {
    const m = DAILY_POOL.find(x => x.id === id), v = run[m.key] || 0;
    ds.prog[id] = m.mode === 'max' ? Math.max(ds.prog[id] || 0, v) : (ds.prog[id] || 0) + v;
  });
}
function claimable() {
  const ds = dailySet();
  let n = MISSIONS.filter(m => !S.claimed.includes(m.id) && statVal(m.stat) >= m.target).length;
  n += ds.ids.filter(id => !ds.claimed.includes(id) && (ds.prog[id] || 0) >= DAILY_POOL.find(x => x.id === id).target).length;
  return n;
}
function missionCard(m, val, claimed, act) {
  const done = val >= m.target, pct = clamp(val / m.target * 100, 0, 100);
  const title = m.en ? nm(m) : (S.lang === 'ur' ? m.dur : m.den);
  const desc = m.en ? (S.lang === 'ur' ? m.dur : m.den) : '';
  return `<div class="card ${claimed ? 'done' : done ? 'ready' : ''}"><div class="row">
    <div class="badge" style="${claimed ? 'background:linear-gradient(#A7F3D0,#34D399)' : ''}">${claimed ? '✅' : m.icon}</div>
    <div style="flex:1;min-width:0"><h4>${escapeHTML(title)}</h4>${desc ? `<p>${escapeHTML(desc)}</p>` : ''}
      <div class="row" style="gap:8px;margin-top:6px"><div class="bar ${done ? 'green' : ''}" style="flex:1"><i style="width:${pct}%"></i></div><span class="tiny num">${fmt(Math.min(val, m.target))}/${fmt(m.target)}</span></div></div>
    <div style="text-align:center">${claimed ? `<span class="tiny" style="color:#059669">${T('claimed')}</span>`
      : done ? `<button class="btn go small" data-act="${act}" data-id="${m.id}">${T('claim')}</button>`
      : `<span class="tiny">${coinTag(m.reward)}</span>`}</div>
  </div></div>`;
}
function renderMissions() {
  const ds = dailySet();
  let h = `<div class="sect">📅 ${T('daily')}</div><p class="tiny" style="margin:-6px 2px 10px">${T('resets')}</p>`;
  ds.ids.forEach(id => { const m = DAILY_POOL.find(x => x.id === id); h += missionCard(m, ds.prog[id] || 0, ds.claimed.includes(id), 'claimDaily'); });
  h += `<div class="sect">🏆 ${T('allMissions')}</div>`;
  const sorted = MISSIONS.slice().sort((a, b) => {
    const r = m => (S.claimed.includes(m.id) ? 2 : statVal(m.stat) >= m.target ? 0 : 1);
    return r(a) - r(b);
  });
  sorted.forEach(m => (h += missionCard(m, statVal(m.stat), S.claimed.includes(m.id), 'claim')));
  $('#missionList').innerHTML = h;
}

/* ---------- records ---------- */
function renderRecords() {
  const st = S.stats;
  let h = `<div class="panel" style="margin-top:6px">
    <div class="name"><input id="nameIn" maxlength="16" value="${escapeHTML(S.name)}" aria-label="${T('you')}"><button class="btn gold small" data-act="saveName">${T('save')}</button></div>
    <div class="statgrid">
      <div class="stat"><b class="num">${fmt(st.bestScore)}</b><span>${T('bestScore')}</span></div>
      <div class="stat"><b class="num">${fmt(st.bestDist)} m</b><span>${T('bestDist')}</span></div>
      <div class="stat"><b class="num">${fmt(st.totalCoins)}</b><span>${T('totalCoins')}</span></div>
      <div class="stat"><b class="num">${fmt(st.runs)}</b><span>${T('runs')}</span></div>
    </div></div>
    <div class="sect">🏅 ${T('topRuns')}</div><div class="panel">`;
  if (!S.top.length) h += `<p class="tiny" style="text-align:center">${T('noRuns')}</p>`;
  else {
    h += '<table class="rt">';
    S.top.forEach((r, i) => {
      const lv = LEVELS.find(l => l.id === r.l);
      h += `<tr><td>${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</td><td>${escapeHTML(S.name)}<div class="tiny">${escapeHTML(lv ? nm(lv) : T('endlessName'))} • ${fmt(r.m)} m</div></td><td class="r num">${fmt(r.s)}</td></tr>`;
    });
    h += '</table>';
  }
  h += `</div><p class="tiny" style="text-align:center;margin-top:14px">🔒 ${T('privacy')}</p>`;
  $('#recordList').innerHTML = h;
}

/* ================= EVENTS ================= */
const VERSION = '1.0.0';
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a !== 'roar') Audio_.play('click');
  switch (a) {
    case 'nav': closeAll(); G.on = false; show(b.dataset.to); if (!G.menu) startMenuScene(); break;
    case 'endless': startRun('endless'); break;
    case 'level': startRun('level', +b.dataset.li); break;
    case 'selLevel': S.sel = +b.dataset.li; save(); renderMap(); break;
    case 'startLevel': if (unlockedIdx(S.sel)) startRun('level', S.sel); break;
    case 'settings': openSettings(false); break;
    case 'closeSettings': closeModal('m-settings'); break;
    case 'pause': pause(); break;
    case 'resume': resume(); break;
    case 'restart': { const m = G.mode, li = G.li; G.on = false; startRun(m, li); break; }
    case 'quit': closeAll(); G.on = false; show('home'); startMenuScene(); break;
    case 'toggle': {
      const k = b.dataset.key; S.opt[k] = !S.opt[k]; save(); syncToggles();
      if (k === 'music') { if (S.opt.music) Audio_.music(G.on ? 'run' : 'menu'); else Audio_.music(null); if (G.paused) Audio_.pauseAll(); }
      if (k === 'pad') $('#pad').classList.toggle('on', S.opt.pad);
      break;
    }
    case 'lang': S.lang = b.dataset.lang; save(); applyLang(); syncToggles(); openSettings(G.on && G.paused); if (screen !== 'run') show(screen); break;
    case 'tutorial': S.tut = false; save(); startRun('endless'); break;
    case 'roar': act('roar'); break;
    case 'revive': revive(); break;
    case 'noRevive': clearInterval(G.revTimer); closeModal('m-revive'); endRun(false); break;
    case 'shopTab': shopTab = b.dataset.tab; renderShop(); break;
    case 'buyUp': { const id = b.dataset.id, lv = S.up[id]; if (lv < 5 && spend(UP_COST[lv])) { S.up[id]++; S.stats.upgradesBought++; save(); toast(T('bought')); renderShop(); refreshCoins(); } break; }
    case 'buyFit': { const o = OUTFITS.find(x => x.id === b.dataset.id); if (o && spend(o.cost)) { S.outfits.push(o.id); S.outfit = o.id; S.stats.outfitsBought++; save(); toast(T('bought')); renderShop(); refreshCoins(); } break; }
    case 'equip': S.outfit = b.dataset.id; save(); renderShop(); break;
    case 'claim': { const m = MISSIONS.find(x => x.id === b.dataset.id); if (m && !S.claimed.includes(m.id) && statVal(m.stat) >= m.target) { S.claimed.push(m.id); S.coins += m.reward; Audio_.play('buy'); save(); renderMissions(); refreshCoins(); toast(`+${m.reward}`); } break; }
    case 'claimDaily': { const ds = dailySet(), m = DAILY_POOL.find(x => x.id === b.dataset.id); if (m && !ds.claimed.includes(m.id) && (ds.prog[m.id] || 0) >= m.target) { ds.claimed.push(m.id); S.coins += m.reward; Audio_.play('buy'); save(); renderMissions(); refreshCoins(); toast(`+${m.reward}`); } break; }
    case 'saveName': { const v = $('#nameIn').value.trim().slice(0, 16); if (v) { S.name = v; save(); toast(T('saved')); renderRecords(); } break; }
  }
});
document.addEventListener('pointerdown', () => Audio_.unlock(), { once: true });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (G.on && !G.over) pause(); Audio_.pauseAll(true); }
  else if (!G.on || G.over) Audio_.resumeAll();
});
window.addEventListener('resize', () => { resize(); layout(); });

// Android hardware back button
if (Cap.App && Cap.App.addListener) {
  Cap.App.addListener('backButton', () => {
    const open = $$('.modal.on');
    if (G.on && !G.over && !G.paused) { pause(); return; }
    if (open.length) { if (open[0].id === 'm-settings' && G.paused) resume(); else if (open[0].id !== 'm-revive') { closeAll(); if (open[0].id === 'm-results') { show('home'); startMenuScene(); } } return; }
    if (screen !== 'home' && screen !== 'load') { show('home'); return; }
    Cap.App.exitApp();
  });
  Cap.App.addListener('pause', () => { if (G.on && !G.over) pause(); Audio_.pauseAll(true); });
}

/* ================= LOOP & BOOT ================= */
function startMenuScene() {
  theme = pick(LEVELS);
  G.on = false; G.menu = { t: 0 }; G.objs = []; G.scen = []; G.parts = []; G.dist = 0; G.x = 0; G.h = 0; G.nextScen = 0; G.roar = 0;
  for (let z = 0; z < ZMAX; z += 5) spawnScenery(z);
}
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (G.on && !G.paused && !G.over) update(dt);
  else if (G.on && G.over && G.parts.length) { G.parts.forEach(p => { p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 900 * dt; }); G.parts = G.parts.filter(p => p.t > 0); }
  else if (!G.on) menuScene(dt);
  if (screen === 'run') render();
  requestAnimationFrame(frame);
}

async function boot() {
  load(); applyLang(); resize(); layout(); Audio_.preload();
  try { if (Cap.StatusBar) { await Cap.StatusBar.hide(); } } catch (e) { /* ignore */ }
  $('#loadPortrait').innerHTML = lionSVG();
  const tips = T('tips'); $('#loadTip').textContent = '💡 ' + pick(tips);
  startMenuScene();
  requestAnimationFrame(frame);
  const bar = $('#loadBar'); let p = 0;
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const tick = setInterval(() => { p = Math.min(p + 7, 92); bar.style.width = p + '%'; }, 60);
  await Promise.race([fontsReady, new Promise(r => setTimeout(r, 2500))]);
  await new Promise(r => setTimeout(r, 900));
  clearInterval(tick); bar.style.width = '100%';
  try { if (Cap.SplashScreen) Cap.SplashScreen.hide(); } catch (e) { /* ignore */ }
  setTimeout(() => { show('home'); if (!S.tut) startRun('endless'); }, 250);
}
window.SB = { get audio() { return Audio_.dbg; }, get state() { return G; }, get save() { return S; }, startRun, show, openSettings, endRun, act, T };
boot();
})();
