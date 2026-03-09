// ==UserScript==
// @name         Waddle
// @namespace    https://github.com/TheM1ddleM1n/Waddle
// @version      6.12
// @description  The ultimate Miniblox enhancement suite with advanced API features!
// @author       The Dream Team! (Scripter & TheM1ddleM1n)
// @icon         https://raw.githubusercontent.com/TheM1ddleM1n/Waddle/refs/heads/main/Penguin.png
// @match        https://miniblox.io/
// @run-at       document-start
// ==/UserScript==

const SCRIPT_VERSION = '6.12';

(function () {
  'use strict';

  document.title = `🐧 Waddle v${SCRIPT_VERSION} • Miniblox`;

  const SETTINGS_KEY = 'waddle_settings';
  const DRAG_POSITIONS_KEY = 'waddle_positions';
  const THEME_COLOR = '#00FFFF';
  const SESSION_KEY = 'session_v1';
  const EQUIPPED_SKIN_KEY = 'waddle_equipped_skin';

  const SKINS = Object.freeze(['Remlin', 'Cat', 'Ethan', 'Sushi', 'Slime', 'Duck', 'Tester', 'Banana', 'Qhyun']);
  const SKIN_API = 'https://session.coolmathblox.ca/accounts/set_cosmetic';

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const div = (cls, text) => el('div', cls, text);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  async function applySkin(skinId) {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) { showToast('No Session Token', 'disabled', 'Log into Miniblox first!'); return; }
    try {
      const res = await fetch(SKIN_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'authorization': token },
        body: JSON.stringify({ type: 'skin', id: skinId.toLowerCase() })
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (data?.success === false) throw new Error(data.message || 'Server rejected request');
      localStorage.setItem(EQUIPPED_SKIN_KEY, skinId.toLowerCase());
      showToast('Skin Applied!', 'enabled', `${skinId} equipped — reloading...`);
      setTimeout(() => location.reload(), 1200);
    } catch (e) {
      showToast('Skin Failed', 'disabled', 'Could not apply skin: ' + e.message);
    }
  }
  const WIDGET_CONFIGS = {
    performance: {
      id: 'performance-counter', cls: 'counter',
      defaultText: 'FPS: -- | PING: 0ms',
      pos: { left: '50px', top: '80px' },
    },
    coords: {
      id: 'coords-counter', cls: 'counter',
      defaultText: '📍 X: 0 Y: 0 Z: 0',
      pos: { left: '50px', top: '220px' },
    },
    realTime: {
      id: 'real-time-counter', cls: 'counter',
      defaultText: '00:00:00 AM',
      fixed: { right: '30px', bottom: '30px', background: 'transparent', boxShadow: 'none', border: 'none', fontSize: '1.1rem', padding: '0' },
    },
    antiAfk: {
      id: 'anti-afk-counter', cls: 'counter',
      defaultText: '🐧 Jumping in 5s',
      pos: { left: '50px', top: '290px' },
    },
    compass: {
      id: 'compass-widget', cls: 'counter',
      pos: { left: '16px', top: '16px' },
      canvas: { width: 220, height: 42 },
    },
    keyDisplay: {
      id: 'key-display-container', cls: 'key-display-container',
      pos: { left: '50px', top: '150px' },
    },
  };

  const CATEGORIES = [
    { id: 'display', label: 'Display', icon: '📊' },
    { id: 'utilities', label: 'Utilities', icon: '🛠️' },
    { id: 'customSkin', label: 'Custom Skins', icon: '🎨' },
    { id: 'about', label: 'About Waddle', icon: 'ℹ️' }
  ];

  const FEATURE_MAP = {
    display: [
      { label: 'FPS & Ping', feature: 'performance' },
      { label: 'Coords', feature: 'coords' },
      { label: 'Clock', feature: 'realTime' },
      { label: 'Key Display', feature: 'keyDisplay' },
      { label: 'Compass', feature: 'compass' },
    ],
    utilities: [
      { label: 'Anti-AFK', feature: 'antiAfk' },
      { label: 'Fun Facts', feature: 'funFacts' },
      { label: 'Block Party RQ', feature: 'disablePartyRequests' },
      { label: 'Chat Mute', feature: 'muteChat' }
    ]
  };

  const FUN_FACTS = Object.freeze([
    'Penguins can drink seawater thanks to a special gland above their eyes.',
    'A group of penguins in the water is called a raft.',
    'On land, a group of penguins is called a waddle.',
    'Emperor penguins are the tallest penguin species on Earth.',
    'Little blue penguins are the smallest penguins in the world.',
    'Some penguin species can dive deeper than 500 meters.',
    'Gentoo penguins can swim at speeds up to about 22 mph (35 km/h).',
    'Penguins use their wings as powerful flippers to swim.',
    'Many penguins slide on their bellies across ice to save energy.',
    'Penguin feathers are densely packed and help keep water out.',
    'Penguins preen often to spread waterproofing oils across their feathers.',
    'Most penguins have countershading: dark backs and light bellies for camouflage.',
    'Emperor penguin dads incubate eggs on their feet during Antarctic winter.',
    'Some penguins build pebble nests and may gift stones to their mates.',
    'The yellow-eyed penguin is one of the rarest penguin species.',
    'Penguins can spend around half their lives in the ocean.',
    'Penguins have excellent underwater vision compared to their land vision.',
    'Molting season replaces penguins\'s feathers all at once, so they stay ashore.',
    'Not all penguins live in icy climates; several species live in temperate regions.',
    'Penguins are birds, but their bodies are specialized for swimming instead of flying.'
  ]);

  const gameRef = {
    _game: null,
    _lastValidation: 0,
    _lastTry: 0,
    get(now = performance.now()) {
      if (this._game && !(this._game.player && this._game.resourceMonitor)) {
        this._game = null;
        this._lastValidation = 0;
      }
      if (!this._game || now - this._lastValidation > 2000) {
        this._lastValidation = now;
        this._resolve(now);
      }
      return this._game;
    },
    _resolve(now) {
      if (now - this._lastTry < 500) return;
      this._lastTry = now;
      try {
        const fiber = Object.values(document.querySelector('#react') ?? {})?.[0];
        const game = fiber?.updateQueue?.baseState?.element?.props?.game;
        if (game?.resourceMonitor && game?.player) this._game = game;
      } catch (_) {}
    }
  };

  const state = {
    features: {
      performance: false, coords: false, realTime: false,
      antiAfk: false, keyDisplay: false, disablePartyRequests: false,
      funFacts: false, muteChat: false, compass: false,
    },
    counters: { performance: null, realTime: null, coords: null, antiAfk: null, keyDisplay: null, compass: null },
    menuOverlay: null,
    activeCategory: 'display',
    rafId: null,
    lastPerformanceUpdate: 0,
    lastCoordsUpdate: 0,
    lastCompassUpdate: 0,
    compassSmoothed: -1,
    intervals: {},
    startTime: Date.now(),
    antiAfkCountdown: 5,
    lastPerformanceColor: '#00FF00',
    keys: { w: false, a: false, s: false, d: false, space: false, lmb: false, rmb: false },
    crosshairContainer: null,
    hudArray: null,
    toastContainer: null,
    hasShownFunFactOnJoin: false,
    _panelCache: {},
    _resizeHandler: null,
    _crosshairObserver: null,
    _keyListeners: null,
    _saveTimer: null,
    _crosshairRafPending: false,
  };

  const KNOWN_FEATURES = new Set(Object.keys(state.features));

  function migrateSettings(raw) {
    if (!raw?.features) return {};
    return Object.fromEntries(
      Object.entries(raw.features).filter(([k, v]) => KNOWN_FEATURES.has(k) && typeof v === 'boolean')
    );
  }

  function saveDragPositions() {
    const positions = {};
    ['performance', 'coords', 'antiAfk', 'compass', 'keyDisplay'].forEach(type => {
      const e = state.counters[type];
      if (e) positions[type] = { left: e.style.left, top: e.style.top };
    });
    localStorage.setItem(DRAG_POSITIONS_KEY, JSON.stringify(positions));
  }

  function loadDragPositions() {
    try { return JSON.parse(localStorage.getItem(DRAG_POSITIONS_KEY) || 'null') || {}; }
    catch (_) { return {}; }
  }

  (function () {
    let attempts = 0;
    state.intervals.waitForGame = setInterval(() => {
      if (++attempts > 40) { clearInterval(state.intervals.waitForGame); state.intervals.waitForGame = null; return; }
      const game = gameRef.get();
      if (game?.chat && typeof game.chat.addChat === 'function') {
        clearInterval(state.intervals.waitForGame);
        state.intervals.waitForGame = null;
        game.chat.addChat({ text: `\\${THEME_COLOR}\\[Server]\\reset\\ Hello and Thank you for using Waddle v${SCRIPT_VERSION}! Have Fun!` });
      }
    }, 500);
  })();

  (function () {
    let clicks = 0, lastWarning = 0;
    document.addEventListener('mousedown', () => clicks++);
    state.intervals.cpsDetector = setInterval(() => {
      const cps = clicks; clicks = 0;
      const now = Date.now();
      if (cps < 15) return;
      const game = gameRef.get();
      if (game?.chat && typeof game.chat.addChat === 'function' && now - lastWarning > 2000) {
        lastWarning = now;
        game.chat.addChat({ text: '\\#FF0000\\[Waddle Detector]\\reset\\ Fast clicks were detected.' });
      }
    }, 1000);
  })();

  function saveSettings() {
    clearTimeout(state._saveTimer);
    state._saveTimer = setTimeout(() => {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: SCRIPT_VERSION, features: state.features }));
    }, 100);
  }

  function injectStyles() {
    if (!document.head) return false;
    const style = el('style');
    style.textContent = `
* { box-sizing:border-box; }
:root {
  --c:#00FFFF; --c-dim:rgba(0,255,255,.15); --c-border:rgba(0,255,255,.25);
  --bg:rgba(12,12,18,.96); --bg2:rgba(20,20,30,.98); --bg3:rgba(30,30,45,1);
  --text:#e0e0e0; --text-dim:#666; --radius:6px; --fw:600;
  --glow:0 0 12px rgba(0,255,255,.5); --shadow:0 8px 32px rgba(0,0,0,.8);
}
.css-xhoozx,[class*="crosshair"],img[src*="crosshair"] { display:none !important; }
.css-1pj0jj0 { display:none !important; }
#waddle-overlay { position:fixed; inset:0; background:rgba(0,0,0,.65); backdrop-filter:blur(8px); z-index:9999; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity .15s ease; }
#waddle-overlay.show { opacity:1; pointer-events:auto; }
#waddle-window { display:flex; width:782px; height:483px; background:var(--bg); border:1px solid var(--c-border); border-radius:10px; box-shadow:var(--shadow),0 0 40px rgba(0,255,255,.08); overflow:hidden; user-select:none; }
#waddle-sidebar { width:160px; min-width:160px; background:var(--bg2); border-right:1px solid var(--c-border); display:flex; flex-direction:column; padding:0; }
#waddle-logo { padding:21px 16px 16px; font-size:1.25rem; font-weight:900; color:var(--c); text-shadow:var(--glow); border-bottom:1px solid var(--c-border); letter-spacing:1px; }
#waddle-logo span { font-size:.68rem; color:var(--text-dim); display:block; font-weight:400; margin-top:2px; }
.waddle-cat { padding:13px 16px; display:flex; align-items:center; gap:9px; font-size:.94rem; font-weight:var(--fw); color:var(--text-dim); cursor:pointer; border-left:3px solid transparent; transition:all .1s ease; }
.waddle-cat:hover { color:var(--text); background:rgba(255,255,255,.04); }
.waddle-cat.active { color:var(--c); border-left-color:var(--c); background:var(--c-dim); }
.waddle-cat-icon { font-size:1.15rem; }
#waddle-sidebar-footer { margin-top:auto; padding:14px 16px; font-size:.75rem; color:var(--text-dim); border-top:1px solid var(--c-border); }
#waddle-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; }
#waddle-panel-title { padding:16px 20px 12px; font-size:.8rem; font-weight:var(--fw); color:var(--text-dim); letter-spacing:1.5px; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,.05); }
#waddle-module-grid { flex:1; display:grid; grid-template-columns:1fr 1fr; gap:9px; padding:16px; align-content:start; overflow-y:auto; }
#waddle-module-grid::-webkit-scrollbar { width:4px; }
#waddle-module-grid::-webkit-scrollbar-thumb { background:var(--c-border); border-radius:2px; }
.waddle-module { background:var(--bg3); border:1px solid rgba(255,255,255,.07); border-radius:var(--radius); padding:12px 14px; cursor:pointer; transition:all .12s ease; display:flex; align-items:center; justify-content:space-between; color:var(--text-dim); font-size:.92rem; font-weight:var(--fw); }
.waddle-module:hover { border-color:var(--c-border); color:var(--text); }
.waddle-module.active { border-color:var(--c); background:var(--c-dim); color:var(--c); box-shadow:inset 0 0 8px rgba(0,255,255,.08); }
.waddle-module-dot { width:8px; height:8px; border-radius:50%; background:var(--text-dim); flex-shrink:0; transition:background .12s ease; }
.waddle-module.active .waddle-module-dot { background:var(--c); box-shadow:0 0 6px var(--c); }
#waddle-about { flex:1; padding:18px; display:flex; flex-direction:column; gap:14px; overflow-y:auto; color:var(--text); }
.about-block { background:var(--bg3); border:1px solid rgba(255,255,255,.07); border-radius:var(--radius); padding:14px; }
.about-block h3 { color:var(--c); font-size:.75rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin:0 0 10px; }
.about-credit { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.about-credit img { width:28px; height:28px; border-radius:50%; }
.about-credit a { color:#aaa; font-size:.8rem; text-decoration:none; }
.about-credit a:hover { color:var(--c); }
.about-credit .role { font-size:.65rem; color:var(--c); font-weight:700; }
.about-timer { font-size:2rem; font-weight:900; color:var(--c); font-family:'Courier New',monospace; text-shadow:var(--glow); text-align:center; padding:4px 0; }
.about-links { display:flex; gap:8px; flex-wrap:wrap; }
.about-link-btn { background:var(--bg); border:1px solid var(--c-border); color:var(--c); border-radius:var(--radius); padding:6px 14px; font-size:.75rem; font-weight:var(--fw); cursor:pointer; transition:all .1s ease; }
.about-link-btn:hover { background:var(--c-dim); }
#waddle-hud { position:fixed; top:60px; right:16px; z-index:9998; display:flex; flex-direction:column; align-items:flex-end; gap:3px; pointer-events:none; }
.hud-item { background:var(--bg); border-left:2px solid var(--c); padding:3px 10px; font-size:.72rem; font-weight:var(--fw); color:var(--c); letter-spacing:.5px; animation:hud-in .15s ease; }
@keyframes hud-in { from { opacity:0; transform:translateX(8px); } to { opacity:1; transform:none; } }
#waddle-toasts { position:fixed; bottom:70px; right:18px; z-index:10000; display:flex; flex-direction:column-reverse; gap:6px; pointer-events:none; }
.waddle-toast { display:flex; align-items:center; gap:10px; background:var(--bg2); border:1px solid rgba(255,255,255,.1); border-radius:var(--radius); padding:9px 14px; min-width:200px; box-shadow:var(--shadow); animation:toast-in .2s ease; transition:opacity .25s ease,transform .25s ease; }
.waddle-toast.hide { opacity:0; transform:translateX(10px); }
@keyframes toast-in { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:none; } }
.toast-icon { width:22px; height:22px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:900; flex-shrink:0; }
.toast-icon.enabled { background:#22c55e; color:#000; }
.toast-icon.disabled { background:#ef4444; color:#fff; }
.toast-icon.info { background:#3b82f6; color:#fff; }
.toast-body { flex:1; }
.toast-title { font-size:.78rem; font-weight:700; color:var(--text); }
.toast-msg { font-size:.68rem; color:var(--text-dim); margin-top:1px; }
.counter,.key-display-container { position:fixed; z-index:9998; user-select:none; }
.counter { background:var(--bg); border:1px solid var(--c-border); color:var(--c); font-weight:var(--fw); font-size:.78rem; padding:5px 11px; border-radius:var(--radius); box-shadow:var(--shadow); cursor:grab; width:max-content; }
.counter.dragging { cursor:grabbing; transform:scale(1.05); }
#real-time-counter { cursor:default !important; }
@keyframes afk-pulse {
  0%   { box-shadow:var(--shadow),0 0 0 0 rgba(0,255,255,.7); }
  70%  { box-shadow:var(--shadow),0 0 0 10px rgba(0,255,255,0); }
  100% { box-shadow:var(--shadow),0 0 0 0 rgba(0,255,255,0); }
}
.counter.afk-pulse { animation:afk-pulse .45s ease; }
.key-display-container { cursor:grab; }
.key-display-grid { display:grid; gap:5px; }
.key-box { background:var(--bg2); border:2px solid rgba(255,255,255,.12); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:.72rem; color:var(--text-dim); width:44px; height:44px; }
.key-box.active { background:var(--c-dim); border-color:var(--c); color:var(--c); box-shadow:var(--glow); }
.key-box.mouse-box { width:62px; }
.key-box.space-box { grid-column:1 / -1; width:100%; height:36px; }
#waddle-crosshair-container { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:5000; pointer-events:none; }
#wb-hud-canvas { position:fixed; inset:0; pointer-events:none; z-index:4999; }
#waddle-skin-panel { flex:1; padding:16px; display:flex; flex-direction:column; gap:10px; overflow-y:auto; }
.skin-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:9px; }
.skin-btn { background:var(--bg3); border:1px solid rgba(255,255,255,.07); border-radius:var(--radius); padding:14px 10px; cursor:pointer; text-align:center; font-size:.88rem; font-weight:var(--fw); color:var(--text-dim); transition:all .12s ease; position:relative; }
.skin-btn:hover { border-color:var(--c-border); color:var(--text); }
.skin-btn.equipped { border-color:var(--c); color:var(--c); background:var(--c-dim); cursor:default; }
.skin-equipped-badge { position:absolute; top:6px; right:7px; font-size:.6rem; font-weight:900; color:var(--c); letter-spacing:.5px; text-transform:uppercase; }
#skin-confirm-view { display:none; flex-direction:column; align-items:center; justify-content:center; gap:16px; flex:1; text-align:center; }
#skin-confirm-view.show { display:flex; }
.skin-confirm-text { font-size:1rem; color:var(--text); font-weight:600; }
.skin-confirm-text span { color:var(--c); }
.skin-confirm-btns { display:flex; gap:12px; }
.skin-confirm-yes { background:#22c55e; border:none; border-radius:var(--radius); padding:9px 28px; font-size:.88rem; font-weight:700; color:#000; cursor:pointer; transition:opacity .1s; }
.skin-confirm-yes:hover { opacity:.85; }
.skin-confirm-no { background:var(--bg3); border:1px solid rgba(255,255,255,.15); border-radius:var(--radius); padding:9px 28px; font-size:.88rem; font-weight:700; color:var(--text-dim); cursor:pointer; transition:all .1s; }
.skin-confirm-no:hover { border-color:var(--c-border); color:var(--text); }
    `;
    document.head.appendChild(style);
    return true;
  }

  function showToast(title, type = 'info', message = '') {
    if (!['enabled', 'disabled', 'info'].includes(type)) type = 'info';
    if (!document.body) return;
    if (!state.toastContainer || !document.contains(state.toastContainer)) {
      state.toastContainer = document.getElementById('waddle-toasts') || (() => {
        const c = div(null);
        c.id = 'waddle-toasts';
        document.body.appendChild(c);
        return c;
      })();
    }
    const toast = div('waddle-toast');
    const icon = div(`toast-icon ${type}`, { enabled: '✓', disabled: '✗', info: '!' }[type]);
    const body = div('toast-body');
    body.innerHTML = `<div class="toast-title">${title}</div>${message ? `<div class="toast-msg">${message}</div>` : ''}`;
    toast.append(icon, body);
    state.toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 280); }, 2800);
  }

  function initHud() {
    if (document.getElementById('waddle-hud')) return;
    const hud = div(null);
    hud.id = 'waddle-hud';
    document.body.appendChild(hud);
    state.hudArray = hud;
  }
  function refreshHud() {
    if (!state.hudArray) return;
    Object.values(FEATURE_MAP).flat().forEach(({ label, feature }) => {
      const id = `hud-item-${feature}`;
      const existing = document.getElementById(id);
      if (state.features[feature]) {
        if (!existing) {
          const item = div('hud-item', label);
          item.id = id;
          state.hudArray.appendChild(item);
        }
      } else {
        existing?.remove();
      }
    });
  }

  function formatSessionTime() {
    const s = Math.floor((Date.now() - state.startTime) / 1000);
    return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
      .map(n => String(n).padStart(2, '0')).join(':');
  }

  function updateSessionTimer() {
    const e = document.getElementById('waddle-session-timer');
    if (e) e.textContent = formatSessionTime();
  }

  function makeLine(styles) {
    const d = div(null);
    Object.assign(d.style, { position: 'absolute', backgroundColor: THEME_COLOR, pointerEvents: 'none' }, styles);
    return d;
  }

  function createCrosshair() {
    const c = div(null);
    c.append(
      makeLine({ top: '0', left: '50%', width: '2px', height: '8px', transform: 'translateX(-50%)' }),
      makeLine({ bottom: '0', left: '50%', width: '2px', height: '8px', transform: 'translateX(-50%)' }),
      makeLine({ left: '0', top: '50%', width: '8px', height: '2px', transform: 'translateY(-50%)' }),
      makeLine({ right: '0', top: '50%', width: '8px', height: '2px', transform: 'translateY(-50%)' })
    );
    return c;
  }

  function checkCrosshair() {
    if (!state.crosshairContainer) return;
    const defaultCrosshair = document.querySelector('.css-xhoozx');
    const pauseMenu = document.querySelector('.chakra-modal__content-container,[role="dialog"]');
    const inGame = !!(defaultCrosshair && !pauseMenu && document.pointerLockElement);
    if (defaultCrosshair) defaultCrosshair.style.display = 'none';
    state.crosshairContainer.style.display = inGame ? 'block' : 'none';
  }

  function initializeCrosshairModule() {
    if (!document.body) return false;
    state.crosshairContainer = div(null);
    state.crosshairContainer.id = 'waddle-crosshair-container';
    state.crosshairContainer.appendChild(createCrosshair());
    document.body.appendChild(state.crosshairContainer);
    const target = document.getElementById('react') || document.body;
    state._crosshairObserver = new MutationObserver(() => {
      if (!state._crosshairRafPending) {
        state._crosshairRafPending = true;
        requestAnimationFrame(() => { state._crosshairRafPending = false; checkCrosshair(); });
      }
    });
    state._crosshairObserver.observe(target, { childList: true, subtree: true });
    return true;
  }

  function initHudCanvas() {
    if (document.getElementById('wb-hud-canvas')) return;
    const canvas = el('canvas');
    canvas.id = 'wb-hud-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    state._resizeHandler = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', state._resizeHandler, { passive: true });
  }

  class LRUCache {
    constructor(max) { this.max = max; this._map = new Map(); }
    get(key) {
      if (!this._map.has(key)) return undefined;
      const val = this._map.get(key);
      this._map.delete(key);
      this._map.set(key, val);
      return val;
    }
    set(key, val) {
      if (this._map.has(key)) this._map.delete(key);
      else if (this._map.size >= this.max) this._map.delete(this._map.keys().next().value);
      this._map.set(key, val);
    }
    has(key) { return this._map.has(key); }
  }

  function startTargetHUDLoop() {
    const canvas = document.getElementById('wb-hud-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) { showToast('Target HUD', 'info', 'Canvas 2D context unavailable'); return; }

    const MAX_RANGE = 5;
    const W = 220, R = 10, H_ENTITY = 86, H_BLOCK = 52;
    const ENTITY_SCAN_INTERVAL = 50;
    const PAUSE_CHECK_INTERVAL = 200;

    const faceImgCache = new LRUCache(64);
    const playerFaceCache = new LRUCache(64);

    let entityMapKey = null;
    let cachedNearest = null;
    let cachedMinDist = Infinity;
    let lastEntityScan = 0;
    let cachedPauseMenu = false;
    let lastPauseCheck = 0;
    let cachedBorderGradient = null;
    let cachedBorderGradientKey = '';
    let lastDrawnHp = -1;
    let lastDrawnName = '';
    let lastDrawnFaceSrc = '';
    let lastDrawnType = '';
    let needsRedraw = true;
    let displayedHp = 0;

    function findEntityMapKey(world) {
      if (entityMapKey && world[entityMapKey] instanceof Map) return entityMapKey;
      for (const [k, v] of Object.entries(world)) {
        if (v instanceof Map && v.size > 0) {
          const first = v.values().next().value;
          if (first && typeof first.getHealth === 'function' && first.pos) { entityMapKey = k; return k; }
        }
      }
      return null;
    }

    function getBorderGradient(x, y, h) {
      const key = `${x},${y},${h}`;
      if (cachedBorderGradient && cachedBorderGradientKey === key) return cachedBorderGradient;
      const g = ctx.createLinearGradient(x, y, x + W, y + h);
      g.addColorStop(0, '#7c3aed');
      g.addColorStop(1, '#2563eb');
      cachedBorderGradient = g;
      cachedBorderGradientKey = key;
      return g;
    }

    let domFaceEl = null, domNameEl = null, domQueryAge = 0;
    const DOM_QUERY_INTERVAL = 500;

    function getDOM(now) {
      if (now - domQueryAge > DOM_QUERY_INTERVAL) {
        domFaceEl = document.querySelector('.css-1pj0jj0 img');
        domNameEl = document.querySelector('.css-1pj0jj0 p');
        domQueryAge = now;
      }
    }

    function drawEntityHUD(nearest, faceSrc, faceName) {
      const x = (canvas.width - W) / 2, y = 16;
      const maxHp = nearest.getMaxHealth?.() ?? 20;
      const realHp = Math.max(0, nearest.getHealth());
      if (displayedHp === 0) displayedHp = realHp;
      displayedHp += (realHp - displayedHp) * 0.15;
      const hp = displayedHp;
      const hpPct = hp / maxHp;
      const barColor = hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#eab308' : '#ef4444';
      if (
        Math.round(hp) === Math.round(lastDrawnHp) &&
        faceName === lastDrawnName &&
        faceSrc === lastDrawnFaceSrc &&
        lastDrawnType === 'entity' &&
        !needsRedraw
      ) return;
      lastDrawnHp = Math.round(hp);
      lastDrawnName = faceName;
      lastDrawnFaceSrc = faceSrc;
      lastDrawnType = 'entity';
      needsRedraw = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 18;
      roundRect(ctx, x, y, W, H_ENTITY, R);
      ctx.fillStyle = '#0b0b14';
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = getBorderGradient(x, y, H_ENTITY);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (faceSrc) {
        if (!faceImgCache.has(faceSrc)) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = faceSrc;
          faceImgCache.set(faceSrc, img);
        }
        const img = faceImgCache.get(faceSrc);
        if (img.complete && img.naturalWidth > 0) ctx.drawImage(img, x + 10, y + 10, 34, 34);
      }
      const nameX = faceSrc ? x + 52 : x + 10;
      ctx.font = 'bold 13px Poppins,sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.fillText(faceName, nameX, y + 26);
      const barW = W - 20, barH = 8, barX = x + 10, barY = y + 40;
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 4);
      ctx.fill();
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect(barX, barY, Math.max(hpPct * barW, 0), barH, 4);
      ctx.fill();
      ctx.font = '10px Poppins,sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fillText(`${Math.round(hp)} / ${maxHp}`, barX, barY + barH + 14);
      ctx.restore();
    }

    function drawBlockHUD(blockName) {
      const x = (canvas.width - W) / 2, y = 16;
      if (blockName === lastDrawnName && lastDrawnType === 'block' && !needsRedraw) return;
      lastDrawnName = blockName;
      lastDrawnType = 'block';
      lastDrawnHp = -1;
      lastDrawnFaceSrc = '';
      needsRedraw = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 18;
      roundRect(ctx, x, y, W, H_BLOCK, R);
      ctx.fillStyle = '#0b0b14';
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = getBorderGradient(x, y, H_BLOCK);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🧱', x + 10, y + 32);
      ctx.font = 'bold 13px Poppins,sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(blockName, x + 44, y + 21);
      ctx.font = '10px Poppins,sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fillText('Block', x + 44, y + 36);
      ctx.restore();
    }

    function tick() {
      try {
        const now = performance.now();
        if (now - lastPauseCheck > PAUSE_CHECK_INTERVAL) {
          cachedPauseMenu = !!document.querySelector('.chakra-modal__content-container,[role="dialog"]');
          lastPauseCheck = now;
        }
        const inGame = !!(document.pointerLockElement && !cachedPauseMenu);
        if (!inGame) {
          if (lastDrawnType !== '') { ctx.clearRect(0, 0, canvas.width, canvas.height); lastDrawnType = ''; needsRedraw = true; }
          requestAnimationFrame(tick);
          return;
        }
        const game = gameRef.get(now);
        const player = game?.player;
        if (game?.world && player?.pos) {
          if (now - lastEntityScan > ENTITY_SCAN_INTERVAL) {
            lastEntityScan = now;
            const mapKey = findEntityMapKey(game.world);
            const dump = mapKey ? game.world[mapKey] : null;
            if (dump) {
              let nearest = null, minDist = Infinity;
              dump.forEach(entity => {
                if (!entity || entity.id === player.id || typeof entity.getHealth !== 'function' || !entity.pos) return;
                const dist = player.pos.distanceTo(entity.pos);
                if (dist < minDist) { minDist = dist; nearest = entity; }
              });
              if (nearest !== cachedNearest) { needsRedraw = true; displayedHp = 0; }
              cachedNearest = nearest;
              cachedMinDist = minDist;
            }
          }
          if (cachedNearest && cachedMinDist <= MAX_RANGE) {
            const isPlayer = cachedNearest.constructor?.name === 'ClientEntityPlayerOther';
            getDOM(now);
            const domSrc = domFaceEl?.src ?? null;
            const domName = domNameEl?.textContent ?? null;
            let faceSrc = null, faceName;
            if (isPlayer) {
              const nameKey = (domSrc ? domName : null) || cachedNearest.name || '';
              if (domSrc && nameKey) playerFaceCache.set(nameKey, domSrc);
              faceSrc = playerFaceCache.get(nameKey) ?? null;
              faceName = (domSrc ? domName : null) || cachedNearest.name || '???';
            } else {
              faceName = cachedNearest.name || cachedNearest.constructor?.name?.replace('Entity', '') || '???';
            }
            drawEntityHUD(cachedNearest, faceSrc, faceName);
          } else {
            getDOM(now);
            const blockName = domNameEl?.textContent?.trim() ?? null;
            if (blockName) {
              drawBlockHUD(blockName);
            } else if (lastDrawnType !== '') {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              lastDrawnType = '';
              needsRedraw = true;
            }
          }
        }
      } catch (err) {
        console.warn('[Waddle] Target HUD tick error:', err);
        lastDrawnType = '';
        needsRedraw = true;
        cachedNearest = null;
        displayedHp = 0;
        try { ctx.clearRect(0, 0, canvas.width, canvas.height); } catch (_) {}
        setTimeout(() => requestAnimationFrame(tick), 2000);
        return;
      }
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function removeCounter(name) {
    const e = state.counters[name];
    if (!e) return;
    e._dragCleanup?.();
    e.remove();
    state.counters[name] = null;
  }
  function buildKeyDisplayContent(container) {
    const grid = div('key-display-grid');
    grid.style.gridTemplateColumns = '44px 44px 44px';
    const keyBoxes = {};
    [
      { text: 'W', col: '2', row: '1', key: 'w' },
      { text: 'A', col: '1', row: '2', key: 'a' },
      { text: 'S', col: '2', row: '2', key: 's' },
      { text: 'D', col: '3', row: '2', key: 'd' }
    ].forEach(({ text, col, row, key }) => {
      const box = div('key-box', text);
      box.style.gridColumn = col;
      box.style.gridRow = row;
      grid.appendChild(box);
      keyBoxes[key] = box;
    });
    const mouseRow = div(null);
    mouseRow.style.cssText = 'display:grid;grid-template-columns:62px 62px;gap:5px;margin-top:5px;';
    ['LMB', 'RMB'].forEach((label, i) => {
      const box = div('key-box mouse-box', label);
      mouseRow.appendChild(box);
      keyBoxes[i === 0 ? 'lmb' : 'rmb'] = box;
    });
    const spaceBox = div('key-box space-box', 'SPACE');
    spaceBox.style.marginTop = '5px';
    keyBoxes.space = spaceBox;
    container.append(grid, mouseRow, spaceBox);
    container._keyBoxes = keyBoxes;
  }
  function createWidget(type) {
    if (!document.body) return null;
    const cfg = WIDGET_CONFIGS[type];
    if (!cfg) return null;
    const wrap = div(cfg.cls);
    wrap.id = cfg.id;

    if (cfg.fixed) {
      Object.assign(wrap.style, cfg.fixed);
    } else {
      const saved = loadDragPositions()[type];
      wrap.style.left = saved?.left || cfg.pos.left;
      wrap.style.top = saved?.top || cfg.pos.top;
      setupDragging(wrap, saveDragPositions);
    }

    if (cfg.canvas) {
      Object.assign(wrap.style, {
        padding: '0', overflow: 'hidden',
        width: cfg.canvas.width + 'px', height: cfg.canvas.height + 'px',
        background: 'transparent', border: 'none', boxShadow: 'none', display: 'none'
      });
      const canvas = el('canvas');
      canvas.width = cfg.canvas.width;
      canvas.height = cfg.canvas.height;
      wrap.appendChild(canvas);
      wrap._canvas = canvas;
      state.compassSmoothed = -1;
    } else if (type === 'keyDisplay') {
      buildKeyDisplayContent(wrap);
    } else {
      const span = el('span', 'counter-time-text', cfg.defaultText ?? '');
      wrap.appendChild(span);
      wrap._textSpan = span;
    }

    document.body.appendChild(wrap);
    state.counters[type] = wrap;
    return wrap;
  }

  function updateCounterText(type, text) {
    const span = state.counters[type]?._textSpan;
    if (span) span.textContent = text;
  }

  function setupDragging(e, onDragEnd) {
    let rafId = null;
    const onMouseUp = () => {
      if (!e._dragging) return;
      e._dragging = false;
      e.classList.remove('dragging');
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      onDragEnd?.();
    };
    const onMouseMove = (ev) => {
      if (!e._dragging || !e.parentElement) return;
      e._pendingX = ev.clientX;
      e._pendingY = ev.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          const r = e.getBoundingClientRect();
          e.style.left = `${Math.max(10, Math.min(window.innerWidth - r.width - 10, e._pendingX - e._offsetX))}px`;
          e.style.top = `${Math.max(10, Math.min(window.innerHeight - r.height - 10, e._pendingY - e._offsetY))}px`;
          rafId = null;
        });
      }
    };
    e.addEventListener('mousedown', (ev) => {
      e._dragging = true;
      e._offsetX = ev.clientX - e.getBoundingClientRect().left;
      e._offsetY = ev.clientY - e.getBoundingClientRect().top;
      e.classList.add('dragging');
    }, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    e._dragCleanup = () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }

  const COMPASS_MARKERS = [
    { deg: 0, label: 'N', major: true },
    { deg: 45, label: 'NE', major: false },
    { deg: 90, label: 'E', major: true },
    { deg: 135, label: 'SE', major: false },
    { deg: 180, label: 'S', major: true },
    { deg: 225, label: 'SW', major: false },
    { deg: 270, label: 'W', major: true },
    { deg: 315, label: 'NW', major: false },
    { deg: 360, label: 'N', major: true },
  ];

  function compassHeadingLabel(deg) {
    const d = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return d[Math.round(deg / 22.5) % 16];
  }

  function getSystemInfo() {
    const ua = navigator.userAgent;

    let os = 'Unknown OS';
    if (/CrOS/.test(ua)) {
      const match = ua.match(/CrOS\s+\S+\s+([\d.]+)/);
      os = 'ChromeOS' + (match ? ' ' + match[1] : '');
    } else if (/Windows/.test(ua)) {
      os = 'Windows 10';
      const uaData = navigator.userAgentData;
      if (uaData?.getHighEntropyValues) {
        uaData.getHighEntropyValues(['platformVersion']).then(data => {
          const major = parseInt((data.platformVersion || '0').split('.')[0], 10);
          const el = document.getElementById('waddle-sys-os');
          if (el) el.textContent = major >= 13 ? 'Windows 11' : 'Windows 10';
        }).catch(() => {});
      }
    } else if (/Mac OS X/.test(ua)) {
      const match = ua.match(/Mac OS X ([\d_]+)/);
      const version = match ? match[1].replace(/_/g, '.') : '';
      const macNames = {
        '15': 'Sequoia', '14': 'Sonoma', '13': 'Ventura',
        '12': 'Monterey', '11': 'Big Sur', '10.15': 'Catalina',
        '10.14': 'Mojave', '10.13': 'High Sierra',
      };
      const major = version.split('.').slice(0, version.startsWith('10') ? 2 : 1).join('.');
      const name = macNames[major] || '';
      os = `macOS ${version}${name ? ' (' + name + ')' : ''}`;
    } else if (/Linux/.test(ua)) {
      if (/Ubuntu/.test(ua)) os = 'Ubuntu Linux';
      else if (/Fedora/.test(ua)) os = 'Fedora Linux';
      else if (/Debian/.test(ua)) os = 'Debian Linux';
      else if (/Arch/.test(ua)) os = 'Arch Linux';
      else if (/Manjaro/.test(ua)) os = 'Manjaro Linux';
      else if (/Android ([\d.]+)/.test(ua)) os = 'Android ' + RegExp.$1;
      else os = 'Linux';
    } else if (/iPhone OS ([\d_]+)/.test(ua)) {
      os = 'iOS ' + RegExp.$1.replace(/_/g, '.');
    }

    let browser = 'Unknown';
    if (/Edg\/([\d.]+)/.test(ua)) browser = 'Edge ' + RegExp.$1.split('.')[0];
    else if (/OPR\/([\d.]+)/.test(ua)) browser = 'Opera ' + RegExp.$1.split('.')[0];
    else if (/Firefox\/([\d.]+)/.test(ua)) browser = 'Firefox ' + RegExp.$1.split('.')[0];
    else if (/Chrome\/([\d.]+)/.test(ua)) browser = 'Chrome ' + RegExp.$1.split('.')[0];
    else if (/Version\/([\d.]+).*Safari/.test(ua)) browser = 'Safari ' + RegExp.$1.split('.')[0];

    let gpu = 'Unknown';
    let gpuVendor = 'Unknown';
    let webgl2 = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        if (dbg) {
          gpu = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)
            .replace(/\s*\(0x[0-9a-fA-F]+\)/g, '')
            .replace(/\/\S+/g, '')
            .trim();
          gpuVendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL)
            .replace(/\s*\(0x[0-9a-fA-F]+\)/g, '')
            .trim();
        }
      }
      webgl2 = !!window.WebGL2RenderingContext;
    } catch (_) {}

    const conn = navigator.connection;

    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        const getBatteryIcon = (pct) => pct > 20 ? "🔋" : "🪫";
        const getColor = (pct) => pct > 50 ? "#22c55e" : pct > 20 ? "#eab308" : "#ef4444";
        const getStatus = () => {
          const pct = Math.round(bat.level * 100);
          let status = "";
          if (pct === 100 && bat.charging) status = "✅ Fully Charged!";
          else if (bat.charging) status = "⚡ Charging";
          else if (pct <= 20) status = "⚠️ Plug in Charger";
          else if (bat.dischargingTime !== Infinity) status = `⏱ ~${Math.round(bat.dischargingTime / 60)}m left`;
          return { text: `${getBatteryIcon(pct)} ${pct}% ${status}`, color: getColor(pct) };
        };
        const update = () => {
          const el = document.getElementById("waddle-sys-battery");
          if (!el) return;
          const info = getStatus();
          el.textContent = info.text;
          el.style.color = info.color;
        };
        update();
        bat.addEventListener("levelchange", update);
        bat.addEventListener("chargingchange", update);
        bat.addEventListener("dischargingtimechange", update);
      }).catch(() => {
        const el = document.getElementById("waddle-sys-battery");
        if (el) el.textContent = "Battery N/A";
      });
    }

    return {
      os, browser, gpu, gpuVendor, webgl2,
      cores: navigator.hardwareConcurrency || '?',
      ram: navigator.deviceMemory ? navigator.deviceMemory + ' GB' : '?',
      screen: `${screen.width}×${screen.height}`,
      network: conn?.effectiveType?.toUpperCase() || '?',
      downlink: conn?.downlink ? conn.downlink + ' Mbps' : '?',
      rtt: conn?.rtt != null ? conn.rtt + ' ms' : '?',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '?',
      touch: navigator.maxTouchPoints > 0 ? `Yes (${navigator.maxTouchPoints} points)` : 'No',
      battery: navigator.getBattery ? 'Loading...' : 'N/A',
    };
  }

  function drawCompassWidget(deg) {
    const wrap = state.counters.compass;
    if (!wrap?._canvas) return;
    const canvas = wrap._canvas;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const PPD = W / 90;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(12,12,18,0.96)';
    roundRect(ctx, 0, 0, W, H, 7);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0,255,255,0.28)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    roundRect(ctx, 1, 1, W - 2, H - 2, 6);
    ctx.clip();
    for (let t = 0; t < 360; t += 10) {
      if (t % 45 === 0) continue;
      let diff = t - deg;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const x = W / 2 + diff * PPD;
      if (x < -2 || x > W + 2) continue;
      ctx.strokeStyle = 'rgba(0,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, H - 12);
      ctx.lineTo(x, H - 7);
      ctx.stroke();
    }
    for (let i = 0; i < COMPASS_MARKERS.length; i++) {
      const m = COMPASS_MARKERS[i];
      let diff = m.deg - deg;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const x = W / 2 + diff * PPD;
      if (x < -24 || x > W + 24) continue;
      ctx.strokeStyle = m.major ? 'rgba(0,255,255,0.9)' : 'rgba(0,255,255,0.4)';
      ctx.lineWidth = m.major ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x, m.major ? H - 18 : H - 14);
      ctx.lineTo(x, H - 6);
      ctx.stroke();
      ctx.font = (m.major ? 'bold 11px' : '9px') + ' Poppins,sans-serif';
      ctx.fillStyle = m.major ? '#00FFFF' : 'rgba(0,255,255,0.45)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(m.label, x, H - 20);
    }
    ctx.restore();
    ctx.fillStyle = '#00FFFF';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 5, 2);
    ctx.lineTo(W / 2 + 5, 2);
    ctx.lineTo(W / 2, 9);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 10px Poppins,sans-serif';
    ctx.fillStyle = '#00FFFF';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(compassHeadingLabel(deg) + '  ' + Math.round(deg) + '\u00b0', W - 7, 3);
  }

  function needsRaf() {
    return state.features.performance || state.features.coords || state.features.compass;
  }

  function startPerformanceLoop() {
    if (state.rafId) return;
    const loop = (t) => {
      if (!needsRaf()) { state.rafId = null; return; }
      const game = gameRef.get(t);
      if (t - state.lastPerformanceUpdate >= 500 && state.counters.performance) {
        updatePerformanceCounter(game);
        state.lastPerformanceUpdate = t;
      }
      if (t - state.lastCoordsUpdate >= 100 && state.counters.coords) {
        const pos = game?.player?.pos;
        if (pos) updateCounterText('coords', `📍 X: ${pos.x.toFixed(1)} Y: ${pos.y.toFixed(1)} Z: ${pos.z.toFixed(1)}`);
        state.lastCoordsUpdate = t;
      }
      if (state.features.compass && state.counters.compass && t - state.lastCompassUpdate >= 50) {
        state.lastCompassUpdate = t;
        const inGame = !!document.pointerLockElement;
        state.counters.compass.style.display = inGame ? 'block' : 'none';
        if (inGame) {
          const yaw = getPlayerYaw(game);
          if (yaw != null) {
            const target = ((yaw * 180 / Math.PI) % 360 + 360) % 360;
            if (state.compassSmoothed < 0) state.compassSmoothed = target;
            let delta = target - state.compassSmoothed;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            state.compassSmoothed = ((state.compassSmoothed + delta * 0.2) % 360 + 360) % 360;
            drawCompassWidget(state.compassSmoothed);
          }
        }
      }
      state.rafId = requestAnimationFrame(loop);
    };
    state.rafId = requestAnimationFrame(loop);
  }

  function stopPerformanceLoop() {
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = null; }
  }

  function updatePerformanceCounter(game) {
    if (!game || !state.counters.performance) return;
    const fps = Math.round(game.resourceMonitor?.filteredFPS || 0);
    const ping = Math.round(game.resourceMonitor?.filteredPing || 0);
    let color = '#00FF00';
    if (fps < 30 || ping > 200) color = '#FF0000';
    else if (fps < 60 || ping > 100) color = '#FFFF00';
    updateCounterText('performance', `FPS: ${game.inGame ? fps : '--'} | PING: ${ping}ms`);
    if (state.lastPerformanceColor !== color) {
      state.counters.performance.style.borderColor = color;
      state.counters.performance.style.color = color;
      state.lastPerformanceColor = color;
    }
  }
  function updateRealTime() {
  if (!state.counters.realTime) return;
  const now = new Date();
  // Detect user's preferred format
  // true = 24-hour, false = 12-hour
  const is24Hour = Intl.DateTimeFormat(undefined, { hour: 'numeric' })
    .formatToParts(new Date(2020,0,1,13))
    .some(part => part.type === 'hour' && parseInt(part.value) === 13);
  const timeString = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !is24Hour
  });
  updateCounterText('realTime', timeString);
}

  function pressSpace() {
    const opts = { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true };
    [document, window].forEach(t => t.dispatchEvent(new KeyboardEvent('keydown', opts)));
    setTimeout(() => { [document, window].forEach(t => t.dispatchEvent(new KeyboardEvent('keyup', opts))); }, 50);
  }

  function updateAntiAfkCounter() {
    updateCounterText('antiAfk', `🐧 Jumping in ${state.antiAfkCountdown}s`);
  }

  function updateKeyDisplay(key, pressed) {
    state.counters.keyDisplay?._keyBoxes?.[key]?.classList.toggle('active', pressed);
  }

  function applyPartyPatch(game) {
    if (!game?.party || game.party._waddleOriginalInvoke) return false;
    game.party._waddleOriginalInvoke = game.party.invoke;
    game.party.invoke = function (method, ...args) {
      if (['inviteToParty', 'requestToJoinParty'].includes(method)) return;
      return this._waddleOriginalInvoke?.(method, ...args);
    };
    return true;
  }

  function restorePartyRequests() {
    const game = gameRef.get();
    if (game?.party?._waddleOriginalInvoke) {
      game.party.invoke = game.party._waddleOriginalInvoke;
      delete game.party._waddleOriginalInvoke;
    }
  }

  function getPlayerYaw(game) {
    if (game?.player?.yaw != null) return game.player.yaw;
    if (game?.camera?.rotation?.y != null) return game.camera.rotation.y;
    if (game?.controls?.yaw != null) return game.controls.yaw;
    return null;
  }
  const featureManager = {
    realTime: {
      start() {
        if (state.intervals.realTime) return;
        if (!state.counters.realTime) createWidget('realTime');
        updateRealTime();
        state.intervals.realTime = setInterval(updateRealTime, 1000);
      },
      cleanup() {
        clearInterval(state.intervals.realTime);
        state.intervals.realTime = null;
        removeCounter('realTime');
      }
    },
    antiAfk: {
      start() {
        if (state.intervals.antiAfk) return;
        if (!state.counters.antiAfk) createWidget('antiAfk');
        state.antiAfkCountdown = 5;
        updateAntiAfkCounter();
        state.intervals.antiAfk = setInterval(() => {
          state.antiAfkCountdown--;
          updateAntiAfkCounter();
          if (state.antiAfkCountdown <= 0) {
            if (document.pointerLockElement) pressSpace();
            state.antiAfkCountdown = 5;
            const e = state.counters.antiAfk;
            if (e) { e.classList.remove('afk-pulse'); void e.offsetWidth; e.classList.add('afk-pulse'); }
          }
        }, 1000);
      },
      cleanup() {
        clearInterval(state.intervals.antiAfk);
        state.intervals.antiAfk = null;
        removeCounter('antiAfk');
      }
    },
    keyDisplay: {
      start() {
        if (!state.counters.keyDisplay) createWidget('keyDisplay');
        if (state._keyListeners) return;
        const kd = (e) => {
          if (state.menuOverlay?.classList.contains('show')) return;
          const k = e.key === ' ' ? 'space' : e.key.toLowerCase();
          if (k in state.keys) { state.keys[k] = true; updateKeyDisplay(k, true); }
        };
        const ku = (e) => {
          const k = e.key === ' ' ? 'space' : e.key.toLowerCase();
          if (k in state.keys) { state.keys[k] = false; updateKeyDisplay(k, false); }
        };
        const md = (e) => {
          if (e.button === 0) { state.keys.lmb = true; updateKeyDisplay('lmb', true); }
          else if (e.button === 2) { state.keys.rmb = true; updateKeyDisplay('rmb', true); }
        };
        const mu = (e) => {
          if (e.button === 0) { state.keys.lmb = false; updateKeyDisplay('lmb', false); }
          else if (e.button === 2) { state.keys.rmb = false; updateKeyDisplay('rmb', false); }
        };
        window.addEventListener('keydown', kd, { passive: true });
        window.addEventListener('keyup', ku, { passive: true });
        window.addEventListener('mousedown', md, { passive: true });
        window.addEventListener('mouseup', mu, { passive: true });
        state._keyListeners = { kd, ku, md, mu };
      },
      cleanup() {
        if (state._keyListeners) {
          window.removeEventListener('keydown', state._keyListeners.kd);
          window.removeEventListener('keyup', state._keyListeners.ku);
          window.removeEventListener('mousedown', state._keyListeners.md);
          window.removeEventListener('mouseup', state._keyListeners.mu);
          state._keyListeners = null;
        }
        removeCounter('keyDisplay');
        Object.keys(state.keys).forEach(k => { state.keys[k] = false; });
      }
    },
    disablePartyRequests: {
      start() {
        applyPartyPatch(gameRef.get());
        state.intervals.partyRetry = setInterval(() => applyPartyPatch(gameRef.get()), 2000);
      },
      cleanup() {
        clearInterval(state.intervals.partyRetry);
        state.intervals.partyRetry = null;
        restorePartyRequests();
      }
    },
    funFacts: {
      start() {
        if (state.hasShownFunFactOnJoin || state.intervals.funFacts) return;
        let wasInGame = false;
        const showRandomFact = () => {
          showToast('🐧 Fun Fact', 'info', FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
          state.hasShownFunFactOnJoin = true;
          clearInterval(state.intervals.funFacts);
          state.intervals.funFacts = null;
        };
        const watchInGame = () => {
          const inGame = !!(document.pointerLockElement && !document.querySelector('.chakra-modal__content-container,[role="dialog"]'));
          if (inGame && !wasInGame && !state.hasShownFunFactOnJoin) showRandomFact();
          wasInGame = inGame;
        };
        watchInGame();
        if (!state.hasShownFunFactOnJoin) state.intervals.funFacts = setInterval(watchInGame, 500);
      },
      cleanup() {
        clearInterval(state.intervals.funFacts);
        state.intervals.funFacts = null;
        state.hasShownFunFactOnJoin = false;
      }
    },
    muteChat: {
      start() {
        const game = gameRef.get();
        if (!game?.chat) { showToast('Chat Mute', 'disabled', 'Game not loaded yet!'); state.features.muteChat = false; return; }
        if (!game.chat._waddleOriginalAddChat) game.chat._waddleOriginalAddChat = game.chat.addChat.bind(game.chat);
        game.chat.addChat = function () {};
        showToast('Chat Mute', 'enabled', 'Chat messages are now hidden');
      },
      cleanup() {
        const game = gameRef.get();
        if (game?.chat?._waddleOriginalAddChat) {
          game.chat.addChat = game.chat._waddleOriginalAddChat;
          delete game.chat._waddleOriginalAddChat;
        }
        showToast('Chat Mute', 'disabled', 'Chat messages restored');
      }
    },
  };
  const RAF_FEATURE_ONSTART = { performance: () => updatePerformanceCounter(gameRef.get()) };
  ['performance', 'coords', 'compass'].forEach(f => {
    featureManager[f] = {
      start() {
        if (!state.counters[f]) createWidget(f);
        startPerformanceLoop();
        RAF_FEATURE_ONSTART[f]?.();
      },
      cleanup() {
        removeCounter(f);
        if (!needsRaf()) stopPerformanceLoop();
      }
    };
  });

  function toggleFeature(featureName) {
    const enabled = !state.features[featureName];
    state.features[featureName] = enabled;
    if (enabled) featureManager[featureName]?.start();
    else featureManager[featureName]?.cleanup();
    saveSettings();
    refreshHud();
    return enabled;
  }

  function buildSkinPanel() {
    const grid = document.getElementById('waddle-module-grid');
    const title = document.getElementById('waddle-panel-title');
    const about = document.getElementById('waddle-about');
    let skinPanel = document.getElementById('waddle-skin-panel');
    if (grid) grid.style.display = 'none';
    if (about) about.style.display = 'none';
    if (title) title.style.display = 'none';
    if (!skinPanel) {
      skinPanel = div(null);
      skinPanel.id = 'waddle-skin-panel';
      const equippedSkin = localStorage.getItem(EQUIPPED_SKIN_KEY) || '';
      const skinGrid = div('skin-grid');
      skinGrid.id = 'skin-grid-view';
      SKINS.forEach(name => {
        const btn = div('skin-btn');
        const isEquipped = name.toLowerCase() === equippedSkin.toLowerCase();
        btn.appendChild(el('span', null, name));
        if (isEquipped) {
          btn.classList.add('equipped');
          btn.appendChild(el('span', 'skin-equipped-badge', '✓ on'));
        }
        btn.addEventListener('click', () => {
          if (btn.classList.contains('equipped')) { showToast('Already Equipped', 'info', `${name} is your current skin.`); return; }
          showSkinConfirm(name);
        });
        skinGrid.appendChild(btn);
      });
      const confirmView = div(null);
      confirmView.id = 'skin-confirm-view';
      confirmView.innerHTML = `
        <div class="skin-confirm-text">Are you sure you want to equip <span id="skin-confirm-name"></span>?</div>
        <div class="skin-confirm-btns">
          <button class="skin-confirm-yes" id="skin-confirm-yes">Yes</button>
          <button class="skin-confirm-no" id="skin-confirm-no">No</button>
        </div>
      `;
      skinPanel.append(skinGrid, confirmView);
      document.getElementById('waddle-panel').appendChild(skinPanel);
      document.getElementById('skin-confirm-yes').addEventListener('click', async () => {
        const skinName = document.getElementById('skin-confirm-name').textContent;
        hideSkinConfirm();
        await applySkin(skinName);
      });
      document.getElementById('skin-confirm-no').addEventListener('click', hideSkinConfirm);
    }
    skinPanel.style.display = 'flex';
    skinPanel.style.flexDirection = 'column';
    hideSkinConfirm();
  }

  function showSkinConfirm(skinName) {
    document.getElementById('skin-grid-view').style.display = 'none';
    document.getElementById('skin-confirm-view').classList.add('show');
    document.getElementById('skin-confirm-name').textContent = skinName;
  }

  function hideSkinConfirm() {
    document.getElementById('skin-grid-view').style.display = 'grid';
    document.getElementById('skin-confirm-view').classList.remove('show');
  }

  function buildModulePanel(categoryId) {
    const grid = document.getElementById('waddle-module-grid');
    const title = document.getElementById('waddle-panel-title');
    const about = document.getElementById('waddle-about');
    const skinPanel = document.getElementById('waddle-skin-panel');
    if (skinPanel) skinPanel.style.display = 'none';
    if (categoryId === 'about') {
      if (grid) grid.style.display = 'none';
      if (title) title.style.display = 'none';
      if (about) about.style.display = 'flex';
      return;
    }
    if (categoryId === 'customSkin') { buildSkinPanel(); return; }
    if (grid) grid.style.display = 'grid';
    if (about) about.style.display = 'none';
    if (title) { title.style.display = 'block'; title.textContent = categoryId; }
    if (!state._panelCache[categoryId]) {
      state._panelCache[categoryId] = (FEATURE_MAP[categoryId] || []).map(({ label, feature }) => {
        const btn = div('waddle-module');
        btn.dataset.feature = feature;
        const dot = div('waddle-module-dot');
        btn.append(el('span', null, label), dot);
        btn.addEventListener('click', () => {
          const en = toggleFeature(feature);
          btn.classList.toggle('active', en);
          showToast(label, en ? 'enabled' : 'disabled', en ? 'Module enabled' : 'Module disabled');
        });
        return btn;
      });
    }
    grid.innerHTML = '';
    state._panelCache[categoryId].forEach(btn => {
      btn.classList.toggle('active', !!state.features[btn.dataset.feature]);
      grid.appendChild(btn);
    });
  }

  function switchCategory(categoryId) {
    state.activeCategory = categoryId;
    document.querySelectorAll('.waddle-cat').forEach(e => e.classList.toggle('active', e.dataset.cat === categoryId));
    buildModulePanel(categoryId);
  }

  function createMenu() {
    if (!document.body) return null;
    const overlay = div(null);
    overlay.id = 'waddle-overlay';
    overlay.dataset.version = SCRIPT_VERSION;
    const win = div(null);
    win.id = 'waddle-window';
    const sidebar = div(null);
    sidebar.id = 'waddle-sidebar';
    const logo = div(null);
    logo.id = 'waddle-logo';
    logo.innerHTML = `🐧 WADDLE <span>v${SCRIPT_VERSION} • Miniblox</span>`;
    sidebar.appendChild(logo);
    CATEGORIES.forEach(({ id, label, icon }) => {
      const cat = div(`waddle-cat${id === state.activeCategory ? ' active' : ''}`);
      cat.dataset.cat = id;
      cat.innerHTML = `<span class="waddle-cat-icon">${icon}</span>${label}`;
      cat.onclick = () => switchCategory(id);
      sidebar.appendChild(cat);
    });
    const footer = div(null, 'Press \\ to toggle');
    footer.id = 'waddle-sidebar-footer';
    sidebar.appendChild(footer);
    const panel = div(null);
    panel.id = 'waddle-panel';
    const panelTitle = div(null, state.activeCategory);
    panelTitle.id = 'waddle-panel-title';
    const moduleGrid = div(null);
    moduleGrid.id = 'waddle-module-grid';
    const aboutPanel = div(null);
    aboutPanel.id = 'waddle-about';
    aboutPanel.style.display = 'none';
    const timerBlock = div('about-block');
    timerBlock.innerHTML = `<h3>⏱ Session Timer</h3><div id="waddle-session-timer" class="about-timer">00:00:00</div>`;
    const sys = getSystemInfo();
    const sysBlock = div('about-block');
    sysBlock.innerHTML = `
      <h3>🖥️ System</h3>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;">
        ${[
          ['OS', `<span id="waddle-sys-os">${sys.os}</span>`],
          ['Browser', sys.browser],
          ['GPU', sys.gpu],
          ['Vendor', sys.gpuVendor],
          ['WebGL2', sys.webgl2 ? '✓ Supported' : '✗ Not supported'],
          ['Cores', sys.cores],
          ['RAM', sys.ram],
          ['Screen', sys.screen],
          ['Network', sys.network],
          ['Downlink', sys.downlink],
          ['RTT', sys.rtt],
          ['Timezone', sys.timezone],
          ['Touch', sys.touch],
          ['Battery', `<span id="waddle-sys-battery">${sys.battery}</span>`],
        ].map(([label, val]) => `
          <tr>
            <td style="color:var(--c);font-weight:700;padding:3px 10px 3px 0;width:72px;">${label}</td>
            <td style="color:var(--text)">${val}</td>
          </tr>`).join('')}
      </table>
    `;
    const creditsBlock = div('about-block');
    creditsBlock.innerHTML = `
      <h3>Credits</h3>
      <div class="about-credit">
        <img src="https://avatars.githubusercontent.com/Scripter132132?s=56">
        <div><div class="role">Original Creator</div><a href="https://github.com/Scripter132132" target="_blank">@Scripter132132</a></div>
      </div>
      <div class="about-credit">
        <img src="https://avatars.githubusercontent.com/TheM1ddleM1n?s=56">
        <div><div class="role" style="color:#f39c12">Enhanced By</div><a href="https://github.com/TheM1ddleM1n" target="_blank">@TheM1ddleM1n</a></div>
      </div>
    `;
    const linksBlock = div('about-block');
    linksBlock.innerHTML = '<h3>🔗 GitHub</h3>';
    const linksRow = div('about-links');
    [
      ['Suggest Feature', 'https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=enhancement'],
      ['Report Bug', 'https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=bug']
    ].forEach(([text, url]) => {
      const btn = el('button', 'about-link-btn', text);
      btn.onclick = () => window.open(url, '_blank');
      linksRow.appendChild(btn);
    });
    linksBlock.appendChild(linksRow);
    aboutPanel.append(timerBlock, sysBlock, creditsBlock, linksBlock);
    panel.append(panelTitle, moduleGrid, aboutPanel);
    win.append(sidebar, panel);
    overlay.appendChild(win);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('show'); });
    state.menuOverlay = overlay;
    buildModulePanel(state.activeCategory);
    return overlay;
  }

  function toggleMenu() { state.menuOverlay?.classList.toggle('show'); }

  function setupKeyboardHandler() {
    window.addEventListener('keydown', (e) => {
      if (e.key === '\\') { e.preventDefault(); toggleMenu(); }
      else if (e.key === 'Escape' && state.menuOverlay?.classList.contains('show')) { e.preventDefault(); state.menuOverlay.classList.remove('show'); }
    });
  }

  function restoreSavedState() {
    try {
      const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
      if (raw) Object.assign(state.features, migrateSettings(raw));
    } catch (_) {}
    state._panelCache = {};
  }

  function globalCleanup() {
    Object.keys(state.features).forEach(f => { if (state.features[f]) featureManager[f]?.cleanup(); });
    Object.values(state.intervals).forEach(id => { if (id != null) clearInterval(id); });
    if (state.rafId) cancelAnimationFrame(state.rafId);
    if (state._resizeHandler) window.removeEventListener('resize', state._resizeHandler);
    state._crosshairObserver?.disconnect();
  }

  window.addEventListener('beforeunload', globalCleanup);

  function ensureDOMReady() {
    return new Promise(resolve => {
      if (document.body && document.head) { resolve(); return; }
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', resolve, { once: true }); return; }
      const t = setInterval(() => { if (document.body && document.head) { clearInterval(t); resolve(); } }, 50);
    });
  }

  const MIN_THREE_REVISION = 128;

  function isThreeCompatible() {
    return typeof THREE !== 'undefined' &&
      typeof THREE.CubeTextureLoader === 'function' &&
      parseInt(THREE.REVISION, 10) >= MIN_THREE_REVISION;
  }

  function initSpaceSky() {
    const doApply = () => {
      let attempts = 0;
      const tryPatch = () => {
        if (++attempts > 20) { showToast('Space Sky', 'info', 'Could not find game scene'); return; }
        const gs = gameRef.get()?.gameScene;
        if (!gs?.sky) { setTimeout(tryPatch, 500); return; }
        new THREE.CubeTextureLoader()
          .setPath('https://threejs.org/examples/textures/cube/MilkyWay/')
          .load(
            ['dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg'],
            (cubeTexture) => {
              gs.sky._waddleOriginalUpdate = gs.sky.update.bind(gs.sky);
              gs.sky.update = function () { this._waddleOriginalUpdate(); this.gameScene.scene.background = cubeTexture; };
              gs.scene.background = cubeTexture;
            }
          );
      };
      tryPatch();
    };
    if (isThreeCompatible()) { doApply(); return; }
    const script = el('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.min.js';
    script.onload = () => { if (isThreeCompatible()) doApply(); else showToast('Space Sky', 'info', 'Three.js version mismatch'); };
    script.onerror = () => showToast('Space Sky', 'info', 'Failed to load Three.js');
    document.head.appendChild(script);
  }

  async function safeInit() {
    try {
      await ensureDOMReady();
      injectStyles();
      restoreSavedState();
      createMenu();
      setupKeyboardHandler();
      initializeCrosshairModule();
      initHudCanvas();
      startTargetHUDLoop();
      initHud();
      initSpaceSky();
      showToast('Waddle loaded', 'info', 'Press \\ to open menu');
      setTimeout(() => {
        Object.entries(state.features).forEach(([feature, enabled]) => {
          if (!enabled) return;
          try { featureManager[feature]?.start(); } catch (_) {}
        });
        refreshHud();
      }, 100);
      updateSessionTimer();
      state.intervals.sessionTimer = setInterval(updateSessionTimer, 1000);
    } catch (err) {
      console.error('[Waddle] Init failed:', err);
      showToast('Init failed', 'info', 'Check console');
    }
  }

  safeInit();
})();
