// ==UserScript==
// @name         SkyBoxes 4 Waddle!
// @namespace    https://github.com/TheM1ddleM1n/Waddle
// @version      v1
// @description  Space sky addon for Waddle — replaces the Miniblox sky with a cubemap preset
// @author       TheM1ddleM1n
// @icon         https://raw.githubusercontent.com/TheM1ddleM1n/Waddle/refs/heads/main/Penguin.png
// @match        https://miniblox.io/
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'waddle_skybox';
  const DEFAULT_PRESET = 'milkyway';

  const PRESETS = { // TODO: Add lots more presets
    milkyway: {
      label: '🌌 Milky Way',
      path: 'https://threejs.org/examples/textures/cube/MilkyWay/',
      files: ['dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg'],
    },
    bridge: {
      label: '🌉 Bridge',
      path: 'https://threejs.org/examples/textures/cube/Bridge2/',
      files: ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'],
    },
    park: {
      label: '🌳 Park',
      path: 'https://threejs.org/examples/textures/cube/Park2/',
      files: ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'],
    },
  };

  const lsGet = k => localStorage.getItem(k);
  const lsSet = (k, v) => localStorage.setItem(k, v);
  const byId = id => document.getElementById(id);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  let appliedPreset = null;
  let gameScene = null;

  const MIN_THREE_REVISION = 128;

  function isThreeCompatible() {
    return typeof THREE !== 'undefined' &&
      typeof THREE.CubeTextureLoader === 'function' &&
      parseInt(THREE.REVISION, 10) >= MIN_THREE_REVISION;
  }

  function getGameRef() {
    try {
      const fiber = Object.values(document.querySelector('#react') ?? {})?.[0];
      return fiber?.updateQueue?.baseState?.element?.props?.game ?? null;
    } catch (_) { return null; }
  }

  function applyPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    if (!gameScene?.sky) return;
    new THREE.CubeTextureLoader()
      .setPath(preset.path)
      .load(preset.files, cubeTexture => {
        if (!gameScene?.sky) return;
        if (gameScene.sky._waddleSkyOrigUpdate) {
          gameScene.sky.update = gameScene.sky._waddleSkyOrigUpdate;
        }
        gameScene.sky._waddleSkyOrigUpdate = gameScene.sky.update.bind(gameScene.sky);
        gameScene.sky.update = function () {
          this._waddleSkyOrigUpdate();
          this.gameScene.scene.background = cubeTexture;
        };
        gameScene.scene.background = cubeTexture;
        appliedPreset = presetKey;
        lsSet(STORAGE_KEY, presetKey);
        updateUI();
        showToast(`Sky applied: ${preset.label}`);
      });
  }

  function tryInit(presetKey) {
    let attempts = 0;
    const tick = () => {
      if (++attempts > 40) { showToast('Space Sky: could not find game scene'); return; }
      const game = getGameRef();
      if (game?.gameScene?.sky) {
        gameScene = game.gameScene;
        applyPreset(presetKey);
      } else {
        setTimeout(tick, 500);
      }
    };
    tick();
  }

  function loadThreeAndInit(presetKey) {
    if (isThreeCompatible()) { tryInit(presetKey); return; }
    const script = el('script');
    script.src = 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.min.js';
    script.onload = () => isThreeCompatible()
      ? tryInit(presetKey)
      : showToast('Space Sky: Three.js version mismatch');
    script.onerror = () => showToast('Space Sky: failed to load Three.js');
    document.head.appendChild(script);
  }

  function showToast(msg) {
    if (!document.body) return;
    let tc = byId('wsk-toasts');
    if (!tc) {
      tc = el('div');
      tc.id = 'wsk-toasts';
      Object.assign(tc.style, {
        position: 'fixed', bottom: '70px', right: '18px', zIndex: '10001',
        display: 'flex', flexDirection: 'column-reverse', gap: '6px', pointerEvents: 'none',
        alignItems: 'flex-end'
      });
      document.body.appendChild(tc);
    }
    const t = el('div');
    Object.assign(t.style, {
      background: 'rgba(20,20,30,.98)', border: '1px solid rgba(0,255,255,.25)',
      borderRadius: '6px', padding: '9px 14px', fontSize: '.78rem', fontWeight: '600',
      color: '#e0e0e0', boxShadow: '0 8px 32px rgba(0,0,0,.8)',
      transition: 'opacity .25s ease, transform .25s ease',
    });
    t.textContent = `🌌 ${msg}`;
    tc.appendChild(t);
    setTimeout(() => {
      Object.assign(t.style, { opacity: '0', transform: 'translateX(10px)' });
      setTimeout(() => t.remove(), 280);
    }, 2800);
  }

  function updateUI() {
    Object.entries(PRESETS).forEach(([key]) => {
      const btn = byId(`wsk-btn-${key}`);
      if (!btn) return;
      btn.style.borderColor = key === appliedPreset ? 'rgba(0,255,255,.8)' : 'rgba(255,255,255,.07)';
      btn.style.background = key === appliedPreset ? 'rgba(0,255,255,.15)' : 'rgba(30,30,45,1)';
      btn.style.color = key === appliedPreset ? '#00FFFF' : '#666';
    });
  }

  function injectUI() {
    if (!document.body || byId('wsk-panel')) return;

    const style = el('style');
    style.textContent = `
#wsk-toggle { position:fixed; bottom:10px; right:10px; z-index:9999; background:rgba(12,12,18,.85);
  backdrop-filter:blur(4px); border:1px solid rgba(0,255,255,.25); border-radius:20px;
  padding:4px 12px; font:700 .7rem sans-serif; color:#00FFFF; cursor:pointer;
  user-select:none; }
#wsk-toggle:hover { background:rgba(0,255,255,.15); }
#wsk-panel { position:fixed; bottom:38px; right:10px; z-index:9998; background:rgba(12,12,18,.96);
  border:1px solid rgba(0,255,255,.25); border-radius:10px; padding:12px;
  display:none; flex-direction:column; gap:8px; min-width:180px;
  box-shadow:0 8px 32px rgba(0,0,0,.8); }
#wsk-panel.open { display:flex; }
.wsk-title { font-size:.65rem; font-weight:700; color:#00FFFF; text-transform:uppercase;
  letter-spacing:1.5px; margin-bottom:2px; text-align:right; }
.wsk-btn { background:rgba(30,30,45,1); border:1px solid rgba(255,255,255,.07);
  border-radius:6px; padding:8px 12px; font-size:.82rem; font-weight:600;
  color:#666; cursor:pointer; text-align:right; transition:all .1s ease; }
.wsk-btn:hover { border-color:rgba(0,255,255,.25); color:#e0e0e0; }
`;
    document.head.appendChild(style);

    const panel = el('div');
    panel.id = 'wsk-panel';

    const title = el('div', 'wsk-title', '🌌 Sky Preset');
    panel.appendChild(title);

    Object.entries(PRESETS).forEach(([key, preset]) => {
      const btn = el('button', 'wsk-btn', preset.label);
      btn.id = `wsk-btn-${key}`;
      btn.addEventListener('click', () => {
        loadThreeAndInit(key);
        panel.classList.remove('open');
      });
      panel.appendChild(btn);
    });

    const toggle = el('div');
    toggle.id = 'wsk-toggle';
    toggle.textContent = '🌌 Sky';
    toggle.addEventListener('click', () => panel.classList.toggle('open'));

    document.body.appendChild(panel);
    document.body.appendChild(toggle);
    updateUI();
  }

  function waitForBody() {
    if (document.body) {
      injectUI();
      const saved = lsGet(STORAGE_KEY) || DEFAULT_PRESET;
      loadThreeAndInit(saved);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        injectUI();
        const saved = lsGet(STORAGE_KEY) || DEFAULT_PRESET;
        loadThreeAndInit(saved);
      }, { once: true });
    }
  }
  waitForBody();
})();
