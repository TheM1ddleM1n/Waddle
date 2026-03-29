// ==UserScript==
// @name         Waddle
// @namespace    https://github.com/TheM1ddleM1n/Waddle
// @version      6.3
// @description  The ULTIMATE miniblox.io enhancement suite!
// @author       Scripter, TheM1ddleM1n
// @icon         https://raw.githubusercontent.com/TheM1ddleM1n/Waddle/refs/heads/main/Penguin.png
// @match        https://miniblox.io/
// @run-at       document-start
// ==/UserScript==

const SCRIPT_VERSION = '6.3';

(function () {
  'use strict';

document.title = `🐧 Waddle v${SCRIPT_VERSION}`;

  const SETTINGS_KEY = 'waddle_settings';
  const DRAG_POSITIONS_KEY = 'waddle_positions';
  const THEME_COLOR = '#00FFFF';
  const SESSION_KEY = 'session_v1';
  const EQUIPPED_SKIN_KEY = 'waddle_equipped_skin';
  const WADDLE_USERNAME_KEY = 'waddle_username';
  const WADDLE_LEVEL_KEY = 'waddle_level';
  const WADDLE_RANK_KEY = 'waddle_rank';

  const STANDARD_SKINS = Object.freeze([
    'Alice','Bob','Techno','BigGelo','Corrupted','Diana','Dr. Strange','Endoskeleton', 'Ganyu','George','Holly',
    'Hutao','Jake','James','Klee','Kyoko','Adele','Chris', 'Deadpool','Galactus','Heather',
    'Ironman','Joe','Levi','Lexi','Natalie','Remus', 'Sara','Transformer','Vindicate', 'Adventure Guy',
    'Aether','Apex','Ariel','Aurora', 'Celeste','Cody','Ember', 'Finn','Glory',
    'Hunter','Katie','Nova','Panda','Raven', 'Seraphina','Vain','Zane'
  ]);
  const CUSTOM_SKINS = Object.freeze(['Remlin','Cat','Ethan','Sushi','Duck','Tester','Banana','Qhyun']);
  const SKIN_API = 'https://session.coolmathblox.ca/accounts/set_cosmetic';

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const div = (cls, text) => el('div', cls, text);
  const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
};

  function getPlayerUsername() {
    try {
      const game = gameRef.get();
      const playerId = game?.player?.id;
      const sorted = game?.playerList?.sortedPlayerData;
      if (sorted?.length && playerId != null) {
        for (let i = 0; i < sorted.length; i++) {
          if (sorted[i]?.id === playerId) {
            const { name, level, rank } = sorted[i];
            if (name) localStorage.setItem(WADDLE_USERNAME_KEY, name);
            if (level != null) localStorage.setItem(WADDLE_LEVEL_KEY, level);
            if (rank != null) localStorage.setItem(WADDLE_RANK_KEY, rank);
            return name;
          }
        }
      }
    } catch (_) {}
    return localStorage.getItem(WADDLE_USERNAME_KEY) || null;
  }

  function setSkinBannerName(banner, name) {
    if (!banner) return;
    if (!name) {
      banner.innerHTML = `<span style="color:var(--text-dim)">Username is not detected yet — enter a game first</span>`;
      return;
    }
    const level = localStorage.getItem(WADDLE_LEVEL_KEY);
    const rank = localStorage.getItem(WADDLE_RANK_KEY);
    const rankBadge = rank
      ? `<span style="background:var(--c-dim);border:1px solid var(--c-border);color:var(--c);font-size:.6rem;font-weight:700;padding:1px 6px;border-radius:4px;margin-right:6px;text-transform:uppercase;letter-spacing:.5px;">${rank}</span>`
      : '';
    const levelBadge = level
      ? `<span style="color:var(--text-dim);font-size:.68rem;margin-right:6px">Lv.${level}</span>`
      : '';
    banner.innerHTML = `${rankBadge}${levelBadge}<span style="color:var(--c)">${name}</span>`;
  }

  function pollUsername(element) {
    const poll = setInterval(() => {
      const found = getPlayerUsername();
      if (found) { setSkinBannerName(element, found); clearInterval(poll); }
      if (!document.contains(element)) clearInterval(poll);
    }, 1000);
  }

  async function applySkin(skinId) {
    if (state._skinApplying) return;
    state._skinApplying = true;
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) {
      showToast('No Session Token found', 'disabled', 'Log into Miniblox first');
      state._skinApplying = false;
      return;
    }
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
      refreshSkinBadges();
      showToast('Skin Applied!', 'enabled', `${skinId} equipped`);
      state._skinApplying = false;
      setTimeout(() => location.reload(), 1200);
    } catch (e) {
      showToast('Skin Failed', 'disabled', 'Could not apply skin: ' + e.message);
      state._skinApplying = false;
    }
  }

  const spanWidget = text => wrap => {
    const span = el('span', 'counter-time-text', text);
    wrap.appendChild(span);
    wrap._textSpan = span;
  };

  const WIDGET_CONFIGS = {
    performance: {
      id: 'performance-counter', cls: 'counter',
      pos: { left: '50px', top: '80px' },
      build(wrap) {
        buildFpsCpsContent(wrap);
        wrap.style.borderColor = state.lastPerformanceColor;
        const fpsEl = wrap.querySelector('#fps-val');
        if (fpsEl) fpsEl.style.color = state.lastPerformanceColor;
      },
    },
    coords: {
      id: 'coords-counter', cls: 'counter',
      pos: { left: '50px', top: '220px' },
      build(wrap) {
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.gap = '3px';
        const posSpan = el('span', 'counter-time-text', '📍 X: 0 Y: 0 Z: 0');
        const spdSpan = el('span', 'counter-time-text', '⚡ 0.00 b/s');
        wrap.appendChild(posSpan);
        wrap.appendChild(spdSpan);
        wrap._posSpan = posSpan;
        wrap._spdSpan = spdSpan;
      },
    },
    realTime: {
      id: 'real-time-counter', cls: 'counter',
      fixed: { right: '30px', bottom: '30px', background: 'transparent', boxShadow: 'none', border: 'none', fontSize: '1.1rem', padding: '0' },
      build: spanWidget('00:00:00 AM'),
    },
    antiAfk: {
      id: 'anti-afk-counter', cls: 'counter',
      pos: { left: '50px', top: '290px' },
      build: spanWidget('🐧 Anti-AFK Active'),
    },
    keyDisplay: {
      id: 'key-display-container', cls: 'key-display-container',
      pos: { left: '50px', top: '150px' },
      build(wrap) { buildKeyDisplayContent(wrap); },
    },
  };

  const CATEGORIES = [
    { id: 'display', label: 'Display', icon: '📊' },
    { id: 'utilities', label: 'Utilities', icon: '🛠️' },
    { id: 'customSkin', label: 'SkinChanger', icon: '👗' },
    { id: 'about', label: 'About Waddle', icon: 'ℹ️' }
  ];

  const FEATURE_MAP = {
    display: [
      { label: 'FPS & CPS', feature: 'performance' },
      { label: 'Positions', feature: 'coords' },
      { label: 'Clock', feature: 'realTime' },
      { label: 'KeyStrokes', feature: 'keyDisplay' },
    ],
    utilities: [
      { label: 'Anti-AFK', feature: 'antiAfk' },
      { label: 'Chat-Mute', feature: 'muteChat' }
    ]
  };

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

  const afkSettings = {
    get autoEnable() { return localStorage.getItem('waddle_afk_auto') === 'true'; },
    set autoEnable(v) { localStorage.setItem('waddle_afk_auto', v ? 'true' : 'false'); },
    get sendChat() { return localStorage.getItem('waddle_afk_chat') !== 'false'; },
    set sendChat(v) { localStorage.setItem('waddle_afk_chat', v ? 'true' : 'false'); },
    get idleDelay() {
      const v = parseInt(localStorage.getItem('waddle_afk_delay') || '10', 10);
      return isNaN(v) || v < 5 ? 10 : v > 120 ? 120 : v;
    },
    set idleDelay(v) {
      v = parseInt(v, 10);
      if (isNaN(v) || v < 5) v = 5;
      if (v > 120) v = 120;
      localStorage.setItem('waddle_afk_delay', v);
    },
  };

  const afkDetector = {
    _timer: null,
    _triggered: false,
    _wasOff: false,
    _graceUntil: 0,
    _events: ['mousemove', 'keydown', 'mousedown', 'wheel'],

    _onActivity(e) {
      if (!afkSettings.autoEnable) return;
      if (!e.isTrusted) return;
      if (Date.now() < afkDetector._graceUntil) return;
      afkDetector._onReturn();
      afkDetector._resetTimer();
    },

    _resetTimer() {
      clearTimeout(afkDetector._timer);
      afkDetector._timer = setTimeout(afkDetector._onTriggered, afkSettings.idleDelay * 1000);
    },

    _onTriggered() {
      if (afkDetector._triggered) return;
      afkDetector._triggered = true;
      afkDetector._graceUntil = Date.now() + 2000;
      showToast('Auto Anti-AFK', 'enabled', 'You went idle, Anti-AFK enabled');
      if (afkSettings.sendChat && document.pointerLockElement);
      sendAfkChatMessage('I am currently AFK. I will be back shortly!');
      afkDetector._wasOff = !state.features.antiAfk;
      if (afkDetector._wasOff) setAfkActive(true);
    },

    _onReturn() {
      if (!afkDetector._triggered) return;
      afkDetector._triggered = false;
      if (afkDetector._wasOff) {
        setAfkActive(false);
        showToast('Auto Anti-AFK', 'disabled', 'Welcome back, Anti-AFK disabled');
      }
      afkDetector._wasOff = false;
    },

    start() {
      this._events.forEach(evt => window.addEventListener(evt, this._onActivity, { passive: true }));
      this._resetTimer();
    },

    stop() {
      this._events.forEach(evt => window.removeEventListener(evt, this._onActivity));
      clearTimeout(this._timer);
      this._timer = null;
      if (this._triggered) {
        this._triggered = false;
        if (this._wasOff) setAfkActive(false);
        this._wasOff = false;
      }
    },
  };

  function updateAfkModuleButton(active) {
    const cached = state._panelCache['..utilities..'];
    if (!cached) return;
    const btn = cached.find(b => b.dataset.feature === 'antiAfk');
    if (btn) btn.classList.toggle('active', active);
  }

  function setAfkActive(on) {
    if (state.features.antiAfk !== on) toggleFeature('antiAfk');
    updateAfkModuleButton(on);
  }

  const state = {
    features: {
      performance: false, coords: false, realTime: false,
      antiAfk: false, keyDisplay: false, muteChat: false,
    },
    counters: { performance: null, realTime: null, coords: null, antiAfk: null, keyDisplay: null },
    menuOverlay: null,
    activeCategory: 'display',
    rafId: null,
    lastPerformanceUpdate: 0,
    lastCoordsUpdate: 0,
    intervals: {},
    lastPerformanceColor: '#00FF00',
    keys: { w: false, a: false, s: false, d: false, space: false },
    cpsLmbTimes: [],
    cpsRmbTimes: [],
    crosshairContainer: null,
    toastContainer: null,
    _panelCache: {},
    _resizeHandler: null,
    _crosshairObserver: null,
    _keyListeners: null,
    _cpsListeners: null,
    _saveTimer: null,
    _crosshairRafPending: false,
    _lastSpeedPos: null,
    _lastSpeedTime: 0,
    _mutedChat: null,
    _skinApplying: false,
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
    ['performance', 'coords', 'antiAfk', 'keyDisplay'].forEach(type => {
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
        game.chat.addChat({ text: `\\${THEME_COLOR}\\[Server]\\reset\\ Welcome! You are running Waddle v${SCRIPT_VERSION}. \\blue\\Enjoy! \\royalblue\\If you have any questions contact TheM1ddleM1n on Github!` });
      }
    }, 500);
  })();

  function saveSettings() {
    clearTimeout(state._saveTimer);
    state._saveTimer = setTimeout(() => {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ features: state.features }));
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
.about-links { display:flex; gap:8px; flex-wrap:wrap; }
.about-link-btn { background:var(--bg); border:1px solid var(--c-border); color:var(--c); border-radius:var(--radius); padding:6px 14px; font-size:.75rem; font-weight:var(--fw); cursor:pointer; transition:all .1s ease; }
.about-link-btn:hover { background:var(--c-dim); }
#waddle-badge { position:fixed; top:50px; left:12px; z-index:9998; background:rgba(12,12,18,.85); border:1px solid var(--c-border); border-radius:20px; padding:4px 10px; font-size:.7rem; font-weight:700; color:var(--c); letter-spacing:.5px; pointer-events:none; user-select:none; backdrop-filter:blur(4px); }
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
  0% { box-shadow:var(--shadow),0 0 0 0 rgba(0,255,255,.7); }
  70% { box-shadow:var(--shadow),0 0 0 10px rgba(0,255,255,0); }
  100% { box-shadow:var(--shadow),0 0 0 0 rgba(0,255,255,0); }
}
.counter.afk-pulse { animation:afk-pulse .45s ease; }
.key-display-container { cursor:grab; }
.key-display-grid { display:grid; gap:5px; }
.key-box { background:var(--bg2); border:2px solid rgba(255,255,255,.12); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:.72rem; color:var(--text-dim); width:44px; height:44px; }
.key-box.active { background:var(--c-dim); border-color:var(--c); color:var(--c); box-shadow:var(--glow); }
.key-box.space-box { width:100%; height:36px; margin-top:5px; }
#waddle-crosshair-container { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:5000; pointer-events:none; }
#wb-hud-canvas { position:fixed; inset:0; pointer-events:none; z-index:4999; }
#waddle-skin-panel { flex:1; padding:16px; display:flex; flex-direction:column; gap:10px; overflow-y:auto; }
#waddle-skin-panel::-webkit-scrollbar { width:4px; }
#waddle-skin-panel::-webkit-scrollbar-thumb { background:var(--c-border); border-radius:2px; }
.skin-section-header { font-size:.65rem; font-weight:700; color:var(--c); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:7px; padding-bottom:5px; border-bottom:1px solid var(--c-border); }
.skin-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:9px; margin-bottom:14px; }
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
#waddle-afk-settings { grid-column:1 / -1; background:var(--bg3); border:1px solid rgba(255,255,255,.07); border-radius:var(--radius); padding:12px 14px; display:flex; flex-direction:column; gap:10px; }
.afk-settings-title { font-size:.65rem; font-weight:700; color:var(--c); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:2px; }
.afk-setting-row { display:flex; align-items:center; justify-content:space-between; font-size:.82rem; color:var(--text-dim); }
.afk-setting-row span { color:var(--text); }
.waddle-toggle { position:relative; width:36px; height:20px; flex-shrink:0; }
.waddle-toggle input { display:none; }
.waddle-toggle-track { position:absolute; inset:0; background:rgba(255,255,255,.12); border-radius:999px; cursor:pointer; transition:background .15s; }
.waddle-toggle-track::after { content:''; position:absolute; top:3px; left:3px; width:14px; height:14px; background:#fff; border-radius:50%; transition:transform .15s; }
.waddle-toggle input:checked + .waddle-toggle-track { background:var(--c); }
.waddle-toggle input:checked + .waddle-toggle-track::after { transform:translateX(16px); }
.afk-delay-input { background:var(--bg2); color:var(--c); border:1px solid var(--c-border); border-radius:var(--radius); padding:3px 7px; font-size:.82rem; width:52px; text-align:center; outline:none; }
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
    const icon = div(`toast-icon ${type}`);
    icon.textContent = { enabled:'✅', disabled:'❌', info:'❗' }[type];
    const body = div('toast-body');
    body.innerHTML = `<div class="toast-title">${title}</div>${message ? `<div class="toast-msg">${message}</div>` : ''}`;
    toast.append(icon, body);
    state.toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 280); }, 2800);
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
    const W = 220, R = 10, H_ENTITY = 52, H_BLOCK = 52;
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
    let lastDrawnName = '';
    let lastDrawnFaceSrc = '';
    let lastDrawnType = '';
    let needsRedraw = true;

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

    function drawHUDCard(x, y, h, drawContent) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 18;
      roundRect(ctx, x, y, W, h, R);
      ctx.fillStyle = '#0b0b14';
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = getBorderGradient(x, y, h);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      drawContent();
      ctx.restore();
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

    function drawEntityHUD(faceSrc, faceName) {
      const x = (canvas.width - W) / 2, y = 16;
      if (
        faceName === lastDrawnName &&
        faceSrc === lastDrawnFaceSrc &&
        lastDrawnType === 'entity' &&
        !needsRedraw
      ) return;
      lastDrawnName = faceName;
      lastDrawnFaceSrc = faceSrc;
      lastDrawnType = 'entity';
      needsRedraw = false;
      drawHUDCard(x, y, H_ENTITY, () => {
        if (faceSrc) {
          let img = faceImgCache.get(faceSrc);
          if (!img) {
            img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = faceSrc;
            faceImgCache.set(faceSrc, img);
          }
          if (img.complete && img.naturalWidth > 0) ctx.drawImage(img, x + 10, y + 10, 34, 34);
        }
        const nameX = faceSrc ? x + 52 : x + 10;
        ctx.font = 'bold 13px Poppins,sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'left';
        ctx.fillText(faceName, nameX, y + 26);
      });
    }

    function drawBlockHUD(blockName) {
      const x = (canvas.width - W) / 2, y = 16;
      if (blockName === lastDrawnName && lastDrawnType === 'block' && !needsRedraw) return;
      lastDrawnName = blockName;
      lastDrawnType = 'block';
      lastDrawnFaceSrc = '';
      needsRedraw = false;
      drawHUDCard(x, y, H_BLOCK, () => {
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🧱', x + 10, y + 32);
        ctx.font = 'bold 13px Poppins,sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(blockName, x + 44, y + 21);
        ctx.font = '10px Poppins,sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fillText('Block', x + 44, y + 36);
      });
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
              if (nearest !== cachedNearest) needsRedraw = true;
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
            drawEntityHUD(faceSrc, faceName);
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
    const spaceBox = div('key-box space-box', 'SPACE');
    keyBoxes.space = spaceBox;
    container.append(grid, spaceBox);
    container._keyBoxes = keyBoxes;
  }

  function buildFpsCpsContent(container) {
    container.style.padding = '8px 10px';
    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <div id="fps-val" style="font-size:.85rem;font-weight:900;color:var(--c);line-height:1.2;white-space:nowrap">FPS: --</div>
        <div style="width:1px;height:32px;background:var(--c-border);flex-shrink:0"></div>
        <svg viewBox="0 0 40 60" width="26" height="39" style="display:block;flex-shrink:0;overflow:visible">
          <path d="M20,2 C9,2 2,8 2,20 L2,44 C2,54 9,58 20,58 C31,58 38,54 38,44 L38,20 C38,8 31,2 20,2 Z"
                fill="#0b0b14" stroke="rgba(0,255,255,0.3)" stroke-width="1.5"/>
          <path id="cps-svg-lmb" d="M20,2 C9,2 2,8 2,20 L2,28 L20,28 Z"
                fill="rgba(0,255,255,0.05)" style="transition:fill .07s ease"/>
          <path id="cps-svg-rmb" d="M20,2 C31,2 38,8 38,20 L38,28 L20,28 Z"
                fill="rgba(0,255,255,0.05)" style="transition:fill .07s ease"/>
          <line x1="20" y1="2" x2="20" y2="28" stroke="rgba(0,255,255,0.28)" stroke-width="1"/>
          <line x1="2" y1="28" x2="38" y2="28" stroke="rgba(0,255,255,0.18)" stroke-width="1"/>
          <rect x="16" y="11" width="8" height="18" rx="4"
                fill="rgba(0,255,255,0.2)" stroke="rgba(0,255,255,0.45)" stroke-width="1"/>
        </svg>
        <div style="display:flex;flex-direction:column;gap:3px">
          <div style="display:flex;align-items:baseline;gap:2px">
            <span id="cps-lmb-val" style="font-size:.88rem;font-weight:900;color:var(--c);line-height:1">0</span>
            <span style="font-size:.55rem;color:var(--text-dim);letter-spacing:.5px">L</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:2px">
            <span id="cps-rmb-val" style="font-size:.88rem;font-weight:900;color:var(--c);line-height:1">0</span>
            <span style="font-size:.55rem;color:var(--text-dim);letter-spacing:.5px">R</span>
          </div>
        </div>
      </div>
    `;
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
    cfg.build(wrap);
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
      const macNames = { '15':'Sequoia','14':'Sonoma','13':'Ventura','12':'Monterey','11':'Big Sur','10.15':'Catalina','10.14':'Mojave','10.13':'High Sierra' };
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
    let gpu = 'Unknown', gpuVendor = 'Unknown', webgl2 = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        if (dbg) {
          gpu = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).replace(/\s*\(0x[0-9a-fA-F]+\)/g, '').replace(/\/\S+/g, '').trim();
          gpuVendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL).replace(/\s*\(0x[0-9a-fA-F]+\)/g, '').trim();
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
          if (pct === 100 && bat.charging) status = "Fully Charged!";
          else if (bat.charging) status = "Charging...";
          else if (pct <= 20) status = "Plug in your charger.";
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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '?',
      battery: navigator.getBattery ? 'Loading...' : 'N/A',
    };
  }

  function needsRaf() {
    return state.features.performance || state.features.coords;
  }

  function startPerformanceLoop() {
    if (state.rafId) return;
    const loop = (t) => {
      if (!needsRaf()) {
        state.rafId = null;
        return;
      }
      const game = gameRef.get(t);
      if (t - state.lastPerformanceUpdate >= 500 && state.counters.performance) {
        updatePerformanceCounter(game);
        state.lastPerformanceUpdate = t;
      }
      if (t - state.lastCoordsUpdate >= 100) {
        const pos = game?.player?.pos;
        const w = state.counters.coords;
        if (pos) {
          let speed = 0;
          if (state._lastSpeedPos) {
            const dx = pos.x - state._lastSpeedPos.x;
            const dz = pos.z - state._lastSpeedPos.z;
            const dt = (t - state._lastSpeedTime) / 1000;
            const raw = dt > 0 ? Math.sqrt(dx * dx + dz * dz) / dt : 0;
            speed = raw < 0.05 ? 0 : raw;
          }
          state._lastSpeedPos = { x: pos.x, z: pos.z };
          state._lastSpeedTime = t;
          if (w) {
            if (w._posSpan) w._posSpan.textContent = `📍 X: ${pos.x.toFixed(1)} Y: ${pos.y.toFixed(1)} Z: ${pos.z.toFixed(1)}`;
            if (w._spdSpan) w._spdSpan.textContent = `⚡ ${speed.toFixed(2)} b/s`;
          }
        }
        state.lastCoordsUpdate = t;
      }
      state.rafId = requestAnimationFrame(loop);
    };
    state.rafId = requestAnimationFrame(loop);
  }

  function stopPerformanceLoop() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }

  function maybeStopRaf() {
    if (!needsRaf()) stopPerformanceLoop();
  }

  function updatePerformanceCounter(game) {
    if (!game || !state.counters.performance) return;
    const fps = Math.round(game.resourceMonitor?.filteredFPS || 0);
    let color = '#00FF00';
    if (fps < 30) color = '#FF0000';
    else if (fps < 60) color = '#FFFF00';
    const fpsEl = document.getElementById('fps-val');
    if (fpsEl) fpsEl.textContent = `FPS: ${game.inGame ? fps : '--'}`;
    if (state.lastPerformanceColor !== color) {
      state.counters.performance.style.borderColor = color;
      if (fpsEl) fpsEl.style.color = color;
      state.lastPerformanceColor = color;
    }
  }

  function updateRealTime() {
    if (!state.counters.realTime) return;
    const now = new Date();
    const is24Hour = Intl.DateTimeFormat(undefined, { hour: 'numeric' })
      .formatToParts(new Date(2020, 0, 1, 13))
      .some(part => part.type === 'hour' && parseInt(part.value) === 13);
    updateCounterText('realTime', now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !is24Hour }));
  }

  function isTyping() {
    const active = document.activeElement;
    if (!active) return false;
    return active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;
  }
    function sendChatMessage(text) {
    try {
      const game = gameRef.get();
      if (!game?.chat) return false;
      if (typeof game.chat.setInputValue !== 'function') return false;
      if (typeof game.chat.submit !== 'function') return false;
      game.chat.setInputValue(text);
      game.chat.submit();
      return true;
    } catch (_) { return false; }
  }

  function sendAfkChatMessage(text) {
      if (sendChatMessage(text)) return;
    const game = gameRef.get();
    if (game?.chat) {
      for (const method of ['sendMessage', 'sendChat', 'send', 'submitMessage', 'submitChat']) {
        try {
          if (typeof game.chat[method] === 'function') {
            game.chat[method](text);
            return;
          }
        } catch (_) {}
      }
    }

    const tryViaInput = () => {
      const chatInput = [...document.querySelectorAll('input')].find(i =>
        i.placeholder?.toLowerCase().includes('chat') ||
        i.placeholder?.toLowerCase().includes('say') ||
        i.closest?.('[class*="chat"]')
      );
      if (!chatInput) return false;
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      if (nativeSetter) nativeSetter.call(chatInput, text);
      else chatInput.value = text;
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      chatInput.focus();
      setTimeout(() => {
        chatInput.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
          bubbles: true, cancelable: true
        }));
        setTimeout(() => {
          chatInput.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', code: 'Escape', keyCode: 27, which: 27,
            bubbles: true, cancelable: true
          }));
          chatInput.blur();
        }, 50);
      }, 80);
      return true;
    };

    if (!tryViaInput()) {
      document.body.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
        bubbles: true, cancelable: true
      }));
      setTimeout(() => {
        if (!tryViaInput()) {
          try {
            if (game?.chat) {
              const fn = game.chat._orig_addChat ?? game.chat.addChat;
              fn?.call(game.chat, { text });
            }
          } catch (_) {}
        }
      }, 200);
    }
  }

  function patchMethod(obj, key, replacement) {
    if (!obj || obj[`_orig_${key}`]) return false;
    obj[`_orig_${key}`] = obj[key].bind(obj);
    obj[key] = replacement;
    return true;
  }

  function unpatchMethod(obj, key) {
    if (!obj?.[`_orig_${key}`]) return;
    obj[key] = obj[`_orig_${key}`];
    delete obj[`_orig_${key}`];
  }

  const featureManager = {
    performance: {
      start() {
        if (!state.counters.performance) createWidget('performance');
        startPerformanceLoop();
        updatePerformanceCounter(gameRef.get());
        if (!state._cpsListeners) {
          const updateSvgFill = (buttons) => {
            const lEl = document.getElementById('cps-svg-lmb');
            const rEl = document.getElementById('cps-svg-rmb');
            if (lEl) lEl.style.fill = (buttons & 1) ? 'rgba(0,255,255,0.32)' : 'rgba(0,255,255,0.05)';
            if (rEl) rEl.style.fill = (buttons & 2) ? 'rgba(0,255,255,0.32)' : 'rgba(0,255,255,0.05)';
          };
          const md = (e) => {
            const now = performance.now();
            if (e.button === 0) state.cpsLmbTimes.push(now);
            else if (e.button === 2) state.cpsRmbTimes.push(now);
            updateSvgFill(e.buttons);
          };
          const mu = (e) => updateSvgFill(e.buttons);
          window.addEventListener('mousedown', md, { passive: true });
          window.addEventListener('mouseup', mu, { passive: true });
          state._cpsListeners = { md, mu };
          state.intervals.cps = setInterval(() => {
            const now = performance.now();
            const trim = arr => { while (arr.length && now - arr[0] > 1000) arr.shift(); };
            trim(state.cpsLmbTimes);
            trim(state.cpsRmbTimes);
            const lEl = document.getElementById('cps-lmb-val');
            const rEl = document.getElementById('cps-rmb-val');
            if (lEl) lEl.textContent = state.cpsLmbTimes.length;
            if (rEl) rEl.textContent = state.cpsRmbTimes.length;
          }, 100);
        }
      },
      cleanup() {
        removeCounter('performance');
        maybeStopRaf();
        clearInterval(state.intervals.cps);
        state.intervals.cps = null;
        if (state._cpsListeners) {
          window.removeEventListener('mousedown', state._cpsListeners.md);
          window.removeEventListener('mouseup', state._cpsListeners.mu);
          state._cpsListeners = null;
        }
        state.cpsLmbTimes = [];
        state.cpsRmbTimes = [];
      }
    },
    coords: {
      start() {
        if (!state.counters.coords) createWidget('coords');
        state._lastSpeedPos = null;
        state._lastSpeedTime = 0;
        const w = state.counters.coords;
        if (w?._posSpan) w._posSpan.textContent = '📍 X: 0 Y: 0 Z: 0';
        if (w?._spdSpan) w._spdSpan.textContent = '⚡ 0.00 b/s';
        startPerformanceLoop();
      },
      cleanup() {
        state._lastSpeedPos = null;
        state._lastSpeedTime = 0;
        removeCounter('coords');
        maybeStopRaf();
      }
    },
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

        const keys = [
          [' ', 'Space', 32],
          ['w', 'KeyW', 87],
          ['a', 'KeyA', 65],
          ['s', 'KeyS', 83],
          ['d', 'KeyD', 68],
          [' ', 'Space', 32],
        ];
        let idx = 0;

        state.intervals.antiAfk = setInterval(() => {
          if (!state.features.antiAfk) return;
          const [key, code, keyCode] = keys[idx];
          idx = (idx + 1) % keys.length;
          if (document.pointerLockElement) {
            const target = document.activeElement || document.body;
            target.dispatchEvent(new KeyboardEvent('keydown', {
              key, code, keyCode, which: keyCode, bubbles: true, cancelable: true
            }));
            setTimeout(() => target.dispatchEvent(new KeyboardEvent('keyup', {
              key, code, keyCode, which: keyCode, bubbles: true, cancelable: true
            })), 50);
          }
        }, 500);
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
          if (isTyping()) return;
          const k = e.key === ' ' ? 'space' : e.key.toLowerCase();
          if (k in state.keys) { state.keys[k] = true; updateKeyDisplay(k, true); }
        };
        const ku = (e) => {
          const k = e.key === ' ' ? 'space' : e.key.toLowerCase();
          if (k in state.keys) { state.keys[k] = false; updateKeyDisplay(k, false); }
        };
        window.addEventListener('keydown', kd, { passive: true });
        window.addEventListener('keyup', ku, { passive: true });
        state._keyListeners = { kd, ku };
      },
      cleanup() {
        if (state._keyListeners) {
          window.removeEventListener('keydown', state._keyListeners.kd);
          window.removeEventListener('keyup', state._keyListeners.ku);
          state._keyListeners = null;
        }
        removeCounter('keyDisplay');
        Object.keys(state.keys).forEach(k => { state.keys[k] = false; });
      }
    },
    muteChat: {
      start() {
        const tryMute = () => {
          const chat = gameRef.get()?.chat;
          if (chat !== state._mutedChat) unpatchMethod(state._mutedChat, 'addChat');
          if (patchMethod(chat, 'addChat', () => {})) state._mutedChat = chat;
          return !!state._mutedChat;
        };
        if (!tryMute()) showToast('Chat-Mute', 'info', 'Waiting for game chat to load...');
        else showToast('Chat-Mute', 'enabled', 'Chat messages will be hidden ingame');
        state.intervals.chatMuteRetry = setInterval(tryMute, 2000);
      },
      cleanup() {
        clearInterval(state.intervals.chatMuteRetry);
        state.intervals.chatMuteRetry = null;
        unpatchMethod(state._mutedChat, 'addChat');
        state._mutedChat = null;
        showToast('Chat-Mute', 'disabled', 'You can now receive other messages');
      }
    },
  };

  function updateKeyDisplay(key, pressed) {
    state.counters.keyDisplay?._keyBoxes?.[key]?.classList.toggle('active', pressed);
  }

  function toggleFeature(featureName) {
    const requestedEnabled = !state.features[featureName];
    state.features[featureName] = requestedEnabled;
    if (requestedEnabled) {
      const startResult = featureManager[featureName]?.start?.();
      if (startResult === false || !state.features[featureName]) state.features[featureName] = false;
    } else {
      featureManager[featureName]?.cleanup?.();
      state.features[featureName] = false;
    }
    saveSettings();
    return state.features[featureName];
  }

  function refreshSkinBadges() {
    const equippedSkin = localStorage.getItem(EQUIPPED_SKIN_KEY) || '';
    document.querySelectorAll('#skin-grid-view .skin-btn').forEach(btn => {
      const name = btn.querySelector('span')?.textContent || '';
      const isEquipped = name.toLowerCase() === equippedSkin.toLowerCase();
      btn.classList.toggle('equipped', isEquipped);
      const badge = btn.querySelector('.skin-equipped-badge');
      if (isEquipped && !badge) {
        btn.appendChild(el('span', 'skin-equipped-badge', '✓ on'));
      } else if (!isEquipped && badge) {
        badge.remove();
      }
    });
  }

  function setSkinConfirmVisible(visible, skinName) {
    document.getElementById('skin-grid-view').style.display = visible ? 'none' : 'flex';
    document.getElementById('skin-confirm-view').classList.toggle('show', visible);
    if (visible) {
      const current = localStorage.getItem(EQUIPPED_SKIN_KEY) || 'None';
      const fromEl = document.getElementById('skin-confirm-from');
      if (fromEl) fromEl.textContent = current.charAt(0).toUpperCase() + current.slice(1);
      document.getElementById('skin-confirm-name').textContent = skinName;
    }
  }

  function getPanelEls() {
    return {
      grid:  document.getElementById('waddle-module-grid'),
      title: document.getElementById('waddle-panel-title'),
      about: document.getElementById('waddle-about'),
      skin:  document.getElementById('waddle-skin-panel'),
    };
  }

  function buildSkinPanel() {
    const { grid, title, about, skin } = getPanelEls();
    let skinPanel = skin;

    if (grid) grid.style.display = 'none';
    if (about) about.style.display = 'none';
    if (title) title.style.display = 'none';

    const isFirstTime = !localStorage.getItem(EQUIPPED_SKIN_KEY);
    const hasToken = !!localStorage.getItem(SESSION_KEY);

    if (isFirstTime && hasToken) {
      const username = getPlayerUsername();
      showToast('Token Found!', 'enabled',
        username ? `Auto-detected as ${username} — token automatically applied!` : 'Token found and automatically applied!');
    } else if (isFirstTime && !hasToken) {
      showToast('No Token', 'disabled', 'Log into Miniblox first then re-open the skin panel');
    }

    if (!skinPanel) {
      skinPanel = div(null);
      skinPanel.id = 'waddle-skin-panel';
      const username = getPlayerUsername();
      const userBanner = div(null);
      Object.assign(userBanner.style, {
        fontSize: '.75rem', fontWeight: '700', color: 'var(--text-dim)',
        marginBottom: '6px', padding: '6px 10px', background: 'var(--bg3)',
        border: '1px solid rgba(255,255,255,.07)', borderRadius: 'var(--radius)',
        display: 'flex', alignItems: 'center', gap: '6px', flexShrink: '0'
      });
      userBanner.id = 'skin-user-banner';
      setSkinBannerName(userBanner, username);
      if (!username) pollUsername(userBanner);
      skinPanel.appendChild(userBanner);

      function buildSkinSection(label, skinList) {
        const section = div(null);
        const header = div('skin-section-header', label);
        section.appendChild(header);
        const skinGrid = div('skin-grid');
        const equippedSkin = localStorage.getItem(EQUIPPED_SKIN_KEY) || '';
        skinList.forEach(name => {
          const btn = div('skin-btn');
          const isEquipped = name.toLowerCase() === equippedSkin.toLowerCase();
          btn.appendChild(el('span', null, name));
          if (isEquipped) {
            btn.classList.add('equipped');
            btn.appendChild(el('span', 'skin-equipped-badge', '✓ on'));
          }
          btn.addEventListener('click', () => {
            if (btn.classList.contains('equipped')) {
              showToast('This Skin has already equipped', 'info', `${name} is your current skin.`);
              return;
            }
            setSkinConfirmVisible(true, name);
          });
          skinGrid.appendChild(btn);
        });
        section.appendChild(skinGrid);
        return section;
      }

      const scrollArea = div(null);
      scrollArea.id = 'skin-grid-view';
      Object.assign(scrollArea.style, { display: 'flex', flexDirection: 'column' });
      scrollArea.appendChild(buildSkinSection('Standard Skins', STANDARD_SKINS));
      scrollArea.appendChild(buildSkinSection('Custom Skins', CUSTOM_SKINS));
      skinPanel.appendChild(scrollArea);

      const confirmView = div(null);
      confirmView.id = 'skin-confirm-view';
      confirmView.innerHTML = `
        <div class="skin-confirm-text">Switch from <span id="skin-confirm-from" style="color:var(--c)"></span> → <span id="skin-confirm-name" style="color:var(--c)"></span>?</div>
        <div class="skin-confirm-btns">
          <button class="skin-confirm-yes" id="skin-confirm-yes">Yes</button>
          <button class="skin-confirm-no" id="skin-confirm-no">No</button>
        </div>
      `;
      skinPanel.appendChild(confirmView);
      document.getElementById('waddle-panel').appendChild(skinPanel);

      document.getElementById('skin-confirm-yes').addEventListener('click', async () => {
        const skinName = document.getElementById('skin-confirm-name').textContent;
        setSkinConfirmVisible(false);
        await applySkin(skinName);
      });
      document.getElementById('skin-confirm-no').addEventListener('click', () => setSkinConfirmVisible(false));
    } else {
      const banner = document.getElementById('skin-user-banner');
      const refreshed = getPlayerUsername();
      setSkinBannerName(banner, refreshed);
      if (!refreshed) pollUsername(banner);
    }

    refreshSkinBadges();
    skinPanel.style.display = 'flex';
    skinPanel.style.flexDirection = 'column';
    setSkinConfirmVisible(false);
  }

  function makeToggleRow(label, checked, onChange) {
    const row = div('afk-setting-row');
    row.appendChild(el('span', null, label));
    const lbl = el('label', 'waddle-toggle');
    const inp = el('input');
    inp.type = 'checkbox';
    inp.checked = checked;
    lbl.append(inp, div('waddle-toggle-track'));
    row.appendChild(lbl);
    inp.addEventListener('change', () => onChange(inp.checked));
    return row;
  }

  function buildAfkSettingsBlock() {
    const block = div(null);
    block.id = 'waddle-afk-settings';

    block.appendChild(div('afk-settings-title', 'Auto AFK Settings'));

    block.appendChild(makeToggleRow('Auto Enable', afkSettings.autoEnable, v => {
      afkSettings.autoEnable = v;
      if (v) afkDetector.start(); else afkDetector.stop();
    }));

    block.appendChild(makeToggleRow('Send AFK Message', afkSettings.sendChat, v => {
      afkSettings.sendChat = v;
    }));

    const delayRow = div('afk-setting-row');
    delayRow.appendChild(el('span', null, 'Idle Delay (5–120s)'));
    const delayInput = el('input', 'afk-delay-input');
    delayInput.type = 'number';
    delayInput.min = 5;
    delayInput.max = 120;
    delayInput.value = afkSettings.idleDelay;
    delayInput.addEventListener('change', () => {
      afkSettings.idleDelay = delayInput.value;
      delayInput.value = afkSettings.idleDelay;
      if (afkSettings.autoEnable) afkDetector._resetTimer();
    });
    delayInput.addEventListener('click', e => e.stopPropagation());
    delayInput.addEventListener('keydown', e => e.stopPropagation());
    delayRow.appendChild(delayInput);
    block.appendChild(delayRow);

    return block;
  }

  function buildModulePanel(categoryId) {
    const { grid, title, about, skin: skinPanel } = getPanelEls();
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
    if (categoryId === 'utilities') {
      grid.appendChild(buildAfkSettingsBlock());
    }
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
    logo.innerHTML = `🐧 Waddle`;
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
    const sys = getSystemInfo();
    const sysRow = (label, val) =>
      `<tr><td style="color:var(--c);font-weight:700;padding:3px 10px 3px 0;width:72px">${label}</td><td style="color:var(--text)">${val}</td></tr>`;
    const sysBlock = div('about-block');
    sysBlock.innerHTML = `<h3>🖥️ System</h3><table style="width:100%;border-collapse:collapse;font-size:.78rem;">${[
      ['OS', `<span id="waddle-sys-os">${sys.os}</span>`],
      ['Browser', sys.browser],
      ['GPU', sys.gpu],
      ['Vendor', sys.gpuVendor],
      ['WebGL2', sys.webgl2 ? '✓ Supported' : '✗ Not supported'],
      ['Cores', sys.cores],
      ['RAM', sys.ram],
      ['Screen', sys.screen],
      ['Timezone', sys.timezone],
      ['Battery', `<span id="waddle-sys-battery">${sys.battery}</span>`],
    ].map(([l, v]) => sysRow(l, v)).join('')}</table>`;
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
      ['Suggest Feature', 'https://github.com/TheM1ddleM1n/Waddle/issues/new?template=feature_request.yml'],
      ['Report Bug', 'https://github.com/TheM1ddleM1n/Waddle/issues/new?template=bug_report.yml']
    ].forEach(([text, url]) => {
      const btn = el('button', 'about-link-btn', text);
      btn.onclick = () => window.open(url, '_blank');
      linksRow.appendChild(btn);
    });
    linksBlock.appendChild(linksRow);
    aboutPanel.append(sysBlock, creditsBlock, linksBlock);
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
      if (isTyping() || e.repeat) return;
      if (e.key === '\\') { e.preventDefault(); toggleMenu(); return; }
      if (e.key === 'Escape' && state.menuOverlay?.classList.contains('show')) {
        e.preventDefault();
        state.menuOverlay.classList.remove('show');
      }
    });
  }

  function restoreSavedState() {
    try {
      const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
      if (raw) Object.assign(state.features, migrateSettings(raw));
    } catch (_) {}
  }

  function globalCleanup() {
    Object.keys(state.features).forEach(f => { if (state.features[f]) featureManager[f]?.cleanup(); });
    Object.values(state.intervals).forEach(id => { if (id != null) clearInterval(id); });
    if (state.rafId) cancelAnimationFrame(state.rafId);
    if (state._resizeHandler) window.removeEventListener('resize', state._resizeHandler);
    state._crosshairObserver?.disconnect();
    afkDetector.stop();
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
      const badge = div(null);
      badge.id = 'waddle-badge';
      badge.textContent = `🐧 Waddle v${SCRIPT_VERSION}`;
      document.body.appendChild(badge);
      restoreSavedState();
      createMenu();
      setupKeyboardHandler();
      initializeCrosshairModule();
      initHudCanvas();
      startTargetHUDLoop();
      initSpaceSky();
      if (afkSettings.autoEnable) afkDetector.start();
      showToast('Welcome To Waddle!', 'info', 'Press \\ to open menu');
      setTimeout(() => {
        Object.entries(state.features).forEach(([feature, enabled]) => {
          if (!enabled) return;
          try { featureManager[feature]?.start(); } catch (_) {}
        });
      }, 100);
    } catch (err) {
      console.error('[Waddle] Init failed:', err);
      showToast('Init failed', 'info', 'Check console');
    }
  }
  safeInit();
})();
