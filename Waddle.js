// ==UserScript==
// @name         Waddle
// @namespace    https://github.com/TheM1ddleM1n/Waddle
// @version      5.22
// @description  The ultimate Miniblox enhancement suite with advanced API features!
// @author       The Dream Team! (Scripter & TheM1ddleM1n)
// @icon         https://raw.githubusercontent.com/TheM1ddleM1n/Waddle/refs/heads/main/Penguin.png
// @match        https://miniblox.io/
// @run-at       document-start
// ==/UserScript==

const SCRIPT_VERSION = '5.22';

(function () {
    'use strict';

    document.title = `🐧 Waddle v${SCRIPT_VERSION} • Miniblox`;

    const SETTINGS_KEY = 'waddle_settings';
    const THEME_COLOR = "#00FFFF";
    const MAX_GAME_ATTEMPTS = 10; // 5.20: promoted to top-level const

    const DEFAULT_POSITIONS = {
        performance: { left: '50px', top: '80px' },
        keyDisplay: { left: '50px', top: '150px' },
        coords: { left: '50px', top: '220px' },
        antiAfk: { left: '50px', top: '290px' }
    };

    const COUNTER_CONFIGS = {
        performance: { id: 'performance-counter', text: 'FPS: -- | PING: 0ms', pos: DEFAULT_POSITIONS.performance, draggable: true },
        coords: { id: 'coords-counter', text: '📍 X: 0 Y: 0 Z: 0', pos: DEFAULT_POSITIONS.coords, draggable: true },
        realTime: { id: 'real-time-counter', text: '00:00:00 AM' }, // 5.20: removed dead pos/draggable fields
        antiAfk: { id: 'anti-afk-counter', text: '🐧 Jumping in 5s', pos: DEFAULT_POSITIONS.antiAfk, draggable: true }
    };

    const gameRef = {
        _game: null,
        _attempts: 0,
        _lastTryTime: 0,

        get game() {
            if (this._game) return this._game;
            if (this._attempts >= MAX_GAME_ATTEMPTS) return null;

            const now = Date.now();
            if (now - this._lastTryTime < 500) return null; // 5.20: inlined TIMING value
            this._lastTryTime = now;

            const reactRoot = document.querySelector("#react");
            if (!reactRoot) return null;

            const fiber = Object.values(reactRoot)?.[0];
            const game = fiber?.updateQueue?.baseState?.element?.props?.game;

            if (game && game.resourceMonitor && game.player) {
                this._game = game;
                this._attempts = 0;
                return game;
            }
            this._attempts++;
            return null;
        }
    };

    (function () {
        const waitForGame = setInterval(() => {
            const game = gameRef.game;
            if (game && game.chat && typeof game.chat.addChat === "function") {
                clearInterval(waitForGame);
                game.chat.addChat({
                    text: `\\${THEME_COLOR}\\[Server]\\reset\\ Hello and Thank you for using Waddle v${SCRIPT_VERSION}! Have Fun!`
                });
            }
        }, 500);
    })();

    (function () {
        // 5.22: removed redundant inner 'use strict'
        let clicks = 0;
        const CPS_MIN = 11;
        const CPS_MAX = 15;
        const CHECK_INTERVAL = 1000;
        const COOLDOWN = 2000;
        let lastWarningTime = 0;

        document.addEventListener("mousedown", () => { clicks++; });

        setInterval(() => {
            const cps = clicks;
            clicks = 0;
            const game = gameRef.game;
            const now = Date.now();

            if (cps >= CPS_MIN && cps <= CPS_MAX && game && game.chat && typeof game.chat.addChat === "function" && now - lastWarningTime > COOLDOWN) {
                lastWarningTime = now;
                game.chat.addChat({
                    text: "\\#FF0000\\[Waddle Detector]\\reset\\ Fast clicks were detected."
                });
            }
        }, CHECK_INTERVAL);
    })();

    let state = {
        features: { performance: false, coords: false, realTime: false, antiAfk: false, keyDisplay: false, disablePartyRequests: false },
        counters: { performance: null, realTime: null, coords: null, antiAfk: null, keyDisplay: null },
        menuOverlay: null,
        // 5.21: removed state.activeTab — never read
        // 5.22: removed state.keyboardHandler — fire-and-forget
        // 5.20: removed state.tabButtons/tabContent — now via querySelectorAll
        rafId: null,
        lastPerformanceUpdate: 0,
        lastCoordsUpdate: 0,
        intervals: {},
        startTime: Date.now(),
        antiAfkCountdown: 5,
        lastPerformanceColor: '#00FF00',
        keys: { w: false, a: false, s: false, d: false, space: false, lmb: false, rmb: false },
        crosshairContainer: null
    };

    function showToast(message, type = 'info', duration = 3000) { // 5.20: inlined TIMING.TOAST_DURATION
        if (!document.body) return;
        document.getElementById('waddle-toast')?.remove();
        const toast = document.createElement('div');
        toast.id = 'waddle-toast';
        toast.textContent = message;

        const colors = {
            info: { border: 'var(--waddle-primary)', bg: 'rgba(0, 255, 255, 0.15)' },
            success: { border: '#00FF00', bg: 'rgba(0, 255, 0, 0.15)' },
            error: { border: '#FF0000', bg: 'rgba(255, 0, 0, 0.15)' },
            warn: { border: '#FFFF00', bg: 'rgba(255, 255, 0, 0.15)' }
        };

        const colorSet = colors[type] || colors.info;
        toast.style.borderColor = colorSet.border;
        toast.style.background = colorSet.bg;
        toast.style.color = colorSet.border;

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function formatSessionTime() {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateSessionTimer() {
        const timerElement = document.getElementById('waddle-session-timer');
        if (timerElement) timerElement.textContent = formatSessionTime();
    }

    function saveSettings() {
        // 5.20: removed positions — never restored
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({
            version: SCRIPT_VERSION,
            features: state.features
        }));
    }

    function injectStyles() {
        if (!document.head) return false;
        const style = document.createElement('style');
        style.textContent = `
:root {
  --p: ${THEME_COLOR};
  --g: 0 0 15px rgba(0,255,255,.7);
  --dark: rgba(0,0,0,.8);
  --border: rgba(0,255,255,.2);
  --shadow: 0 0 20px var(--p);
  --fw: 700;
}
.css-xhoozx, [class*="crosshair"], img[src*="crosshair"] { display: none !important; }
#waddle-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.9); backdrop-filter: blur(15px); z-index: 9999; display: flex; flex-direction: column; align-items: center; padding-top: 40px; opacity: 0; pointer-events: none; }
#waddle-menu-overlay.show { opacity: 1; pointer-events: auto; }
#waddle-menu-header { font-size: 3rem; font-weight: var(--fw); color: var(--p); text-shadow: 0 0 8px var(--p), var(--shadow); margin-bottom: 30px; }
#waddle-tabs { display: flex; gap: 12px; margin-bottom: 20px; border-bottom: 2px solid var(--border); }
.waddle-tab-btn { background: 0; border: none; color: #999; font-weight: var(--fw); padding: 12px 20px; cursor: pointer; border-bottom: 3px solid transparent; }
.waddle-tab-btn.active { color: var(--p); border-bottom-color: var(--p); }
#waddle-menu-content { width: 600px; background: rgba(17,17,17,.9); border-radius: 16px; padding: 24px; color: #fff; display: flex; flex-direction: column; gap: 20px; max-height: 70vh; overflow-y: auto; border: 1px solid var(--border); box-shadow: 0 0 20px rgba(0,255,255,.4); }
.waddle-tab-content { display: none; }
.waddle-tab-content.active { display: flex; flex-direction: column; gap: 16px; }
.waddle-card { background: rgba(0,0,0,.5); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
.waddle-card-header { font-weight: var(--fw); color: var(--p); margin-bottom: 12px; }
.waddle-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.waddle-menu-btn { background: var(--dark); border: 2px solid var(--p); color: var(--p); font-weight: var(--fw); padding: 8px 12px; border-radius: 8px; }
.waddle-menu-btn.active { background: rgba(0,255,255,.2); }
.counter, .key-display-container { position: fixed; z-index: 9998; user-select: none; }
.counter { background: rgba(0,255,255,.9); color: #000; font-weight: var(--fw); padding: 8px 14px; border-radius: 12px; box-shadow: var(--g); cursor: grab; width: max-content; }
.counter.dragging { cursor: grabbing; transform: scale(1.08); }
.key-display-container { cursor: grab; }
.key-display-grid { display: grid; gap: 6px; }
.key-box { background: rgba(80,80,80,.8); border: 3px solid rgba(150,150,150,.6); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; width: 50px; height: 50px; }
.key-box.active { background: var(--p); color: #000; box-shadow: var(--shadow); }
.key-box.mouse-box { width: 70px; }
.key-box.space-box { grid-column: 1 / -1; width: 100%; height: 40px; }
#waddle-toast { position: fixed; bottom: 60px; right: 50px; background: rgba(0,0,0,.95); border: 2px solid var(--p); color: var(--p); padding: 16px 24px; border-radius: 12px; font-weight: var(--fw); z-index: 10000; }
#waddle-crosshair-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 5000; pointer-events: none; }
        `;
        document.head.appendChild(style);
        return true;
    }

    function makeLine(styles) {
        const div = document.createElement('div');
        Object.assign(div.style, { position: 'absolute', backgroundColor: THEME_COLOR, pointerEvents: 'none' }, styles);
        return div;
    }

    function createCrosshair() {
        const c = document.createElement('div');
        c.appendChild(makeLine({ top: '0', left: '50%', width: '2px', height: '8px', transform: 'translateX(-50%)' }));
        c.appendChild(makeLine({ bottom: '0', left: '50%', width: '2px', height: '8px', transform: 'translateX(-50%)' }));
        c.appendChild(makeLine({ left: '0', top: '50%', width: '8px', height: '2px', transform: 'translateY(-50%)' }));
        c.appendChild(makeLine({ right: '0', top: '50%', width: '8px', height: '2px', transform: 'translateY(-50%)' }));
        return c;
    }

    function checkCrosshair() {
        if (!state.crosshairContainer) return;
        const defaultCrosshair = document.querySelector('.css-xhoozx');
        const pauseMenu = document.querySelector('.chakra-modal__content-container,[role="dialog"]');

        if (defaultCrosshair && !pauseMenu) {
            defaultCrosshair.style.display = 'none';
            state.crosshairContainer.style.display = 'block';
        } else {
            state.crosshairContainer.style.display = 'none';
        }
    }

    function initializeCrosshairModule() {
        if (!document.body) return false;
        state.crosshairContainer = document.createElement('div');
        state.crosshairContainer.id = 'waddle-crosshair-container';
        state.crosshairContainer.appendChild(createCrosshair()); // 5.18: inlined updateCrosshair()
        document.body.appendChild(state.crosshairContainer);
        new MutationObserver(() => { requestAnimationFrame(checkCrosshair); }).observe(document.body, { childList: true, subtree: true });
        return true;
    }

    // 5.21: merged createCounterElement + createCounter into one function
    function createCounter(type) {
        if (!document.body) return null;
        const config = COUNTER_CONFIGS[type];
        if (!config) return null;

        const counter = document.createElement('div');
        counter.id = config.id;
        counter.className = 'counter';

        const textSpan = document.createElement('span');
        textSpan.className = 'counter-time-text';
        textSpan.textContent = config.text;
        counter.appendChild(textSpan);
        counter._textSpan = textSpan;

        if (type === 'realTime') {
            counter.style.right = '30px';
            counter.style.bottom = '30px';
            counter.style.background = 'transparent';
            counter.style.boxShadow = 'none';
            counter.style.border = 'none';
            counter.style.fontSize = '1.5rem';
            counter.style.padding = '0';
        } else {
            counter.style.left = config.pos.left;
            counter.style.top = config.pos.top;
            if (config.draggable) setupDragging(counter);
        }

        document.body.appendChild(counter);
        state.counters[type] = counter;
        return counter;
    }

    function updateCounterText(counterType, text) {
        state.counters[counterType]?._textSpan && (state.counters[counterType]._textSpan.textContent = text);
    }

    function setupDragging(element) {
        let rafId = null;
        const onMouseDown = (e) => {
            element._dragging = true;
            element._offsetX = e.clientX - element.getBoundingClientRect().left;
            element._offsetY = e.clientY - element.getBoundingClientRect().top;
            element.classList.add('dragging');
        };
        const onMouseUp = () => {
            if (element._dragging) {
                element._dragging = false;
                element.classList.remove('dragging');
                if (rafId) cancelAnimationFrame(rafId);
                // 5.21: removed saveSettings() — positions no longer persisted
            }
        };
        const onMouseMove = (e) => {
            if (element._dragging && element.parentElement) {
                element._pendingX = e.clientX;
                element._pendingY = e.clientY;
                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        const rect = element.getBoundingClientRect();
                        const newX = Math.max(10, Math.min(window.innerWidth - rect.width - 10, element._pendingX - element._offsetX));
                        const newY = Math.max(10, Math.min(window.innerHeight - rect.height - 10, element._pendingY - element._offsetY));
                        element.style.left = `${newX}px`;
                        element.style.top = `${newY}px`;
                        rafId = null;
                    });
                }
            }
        };
        element.addEventListener('mousedown', onMouseDown, { passive: true });
        window.addEventListener('mouseup', onMouseUp, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    function startPerformanceLoop() {
        if (state.rafId) return;
        const loop = (currentTime) => {
            if (!state.features.performance && !state.features.coords) {
                state.rafId = null;
                return;
            }
            if (currentTime - state.lastPerformanceUpdate >= 500 && state.counters.performance) { // 5.20: inlined
                updatePerformanceCounter();
                state.lastPerformanceUpdate = currentTime;
            }
            if (currentTime - state.lastCoordsUpdate >= 100 && state.counters.coords) { // 5.20: inlined
                const game = gameRef.game;
                if (game && game.player) {
                    const pos = game.player.pos;
                    if (pos) updateCounterText('coords', `📍 X: ${pos.x.toFixed(1)} Y: ${pos.y.toFixed(1)} Z: ${pos.z.toFixed(1)}`);
                }
                state.lastCoordsUpdate = currentTime;
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

    function updatePerformanceCounter() {
        const game = gameRef.game;
        if (!game || !state.counters.performance) return;

        const fps = Math.round(game.resourceMonitor?.filteredFPS || 0);
        const ping = Math.round(game.resourceMonitor?.filteredPing || 0);
        const inGame = game.inGame;

        let color = '#00FF00';
        if (fps < 30 || ping > 200) color = '#FF0000';
        else if (fps < 60 || ping > 100) color = '#FFFF00';

        updateCounterText('performance', `FPS: ${inGame ? fps : '--'} | PING: ${ping}ms`);

        if (state.lastPerformanceColor !== color) {
            state.counters.performance.style.borderColor = color;
            state.counters.performance.style.boxShadow = `0 0 15px ${color}, inset 0 0 10px ${color}`;
            state.lastPerformanceColor = color;
        }
    }

    function updateRealTime() {
        if (!state.counters.realTime) return;
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        updateCounterText('realTime', `${hours}:${minutes}:${seconds} ${ampm}`);
    }

    function pressSpace() {
        const down = new KeyboardEvent("keydown", { key: " ", code: "Space", keyCode: 32, which: 32, bubbles: true });
        const up = new KeyboardEvent("keyup", { key: " ", code: "Space", keyCode: 32, which: 32, bubbles: true });
        window.dispatchEvent(down);
        setTimeout(() => window.dispatchEvent(up), 50);
    }

    function updateAntiAfkCounter() {
        updateCounterText('antiAfk', `🐧 Jumping in ${state.antiAfkCountdown}s`);
    }

    function createKeyDisplay() {
        if (!document.body) return null;
        const container = document.createElement('div');
        container.id = 'key-display-container';
        container.className = 'key-display-container';
        container.style.left = DEFAULT_POSITIONS.keyDisplay.left;
        container.style.top = DEFAULT_POSITIONS.keyDisplay.top;
        const grid = document.createElement('div');
        grid.className = 'key-display-grid';
        grid.style.gridTemplateColumns = '50px 50px 50px';
        const keyBoxConfigs = [
            { text: 'W', col: '2', row: '1', key: 'w' },
            { text: 'A', col: '1', row: '2', key: 'a' },
            { text: 'S', col: '2', row: '2', key: 's' },
            { text: 'D', col: '3', row: '2', key: 'd' }
        ];
        const keyBoxes = {};
        keyBoxConfigs.forEach(({ text, col, row, key }) => {
            const box = document.createElement('div');
            box.className = 'key-box';
            box.textContent = text;
            box.style.gridColumn = col;
            box.style.gridRow = row;
            grid.appendChild(box);
            keyBoxes[key] = box;
        });
        const mouseRow = document.createElement('div');
        mouseRow.style.display = 'grid';
        mouseRow.style.gridTemplateColumns = '70px 70px';
        mouseRow.style.gap = '6px';
        mouseRow.style.marginTop = '6px';
        const lmbBox = document.createElement('div');
        lmbBox.className = 'key-box mouse-box';
        lmbBox.textContent = 'LMB';
        mouseRow.appendChild(lmbBox);
        keyBoxes.lmb = lmbBox;
        const rmbBox = document.createElement('div');
        rmbBox.className = 'key-box mouse-box';
        rmbBox.textContent = 'RMB';
        mouseRow.appendChild(rmbBox);
        keyBoxes.rmb = rmbBox;
        const spaceBox = document.createElement('div');
        spaceBox.className = 'key-box space-box';
        spaceBox.textContent = 'SPACE';
        spaceBox.style.marginTop = '6px';
        keyBoxes.space = spaceBox;
        container.appendChild(grid);
        container.appendChild(mouseRow);
        container.appendChild(spaceBox);
        document.body.appendChild(container);
        container._keyBoxes = keyBoxes;
        setupDragging(container);
        state.counters.keyDisplay = container;
        return container;
    }

    function updateKeyDisplay(key, isPressed) {
        const box = state.counters.keyDisplay?._keyBoxes?.[key];
        if (!box) return;
        box.classList.toggle('active', isPressed);
    }

    function setupKeyDisplayListeners() {
        const keyDownListener = (e) => {
            if (state.menuOverlay?.classList.contains('show')) return;
            const key = e.key === ' ' ? 'space' : e.key.toLowerCase(); // 5.18: fixed space bar
            if (key in state.keys) { state.keys[key] = true; updateKeyDisplay(key, true); }
        };
        const keyUpListener = (e) => {
            const key = e.key === ' ' ? 'space' : e.key.toLowerCase(); // 5.18: fixed space bar
            if (key in state.keys) { state.keys[key] = false; updateKeyDisplay(key, false); }
        };
        const mouseDownListener = (e) => {
            if (e.button === 0) { state.keys.lmb = true; updateKeyDisplay('lmb', true); }
            else if (e.button === 2) { state.keys.rmb = true; updateKeyDisplay('rmb', true); }
        };
        const mouseUpListener = (e) => {
            if (e.button === 0) { state.keys.lmb = false; updateKeyDisplay('lmb', false); }
            else if (e.button === 2) { state.keys.rmb = false; updateKeyDisplay('rmb', false); }
        };
        window.addEventListener('keydown', keyDownListener, { passive: true });
        window.addEventListener('keyup', keyUpListener, { passive: true });
        window.addEventListener('mousedown', mouseDownListener, { passive: true });
        window.addEventListener('mouseup', mouseUpListener, { passive: true });
    }

    function disablePartyRequestsSystem() {
        const game = gameRef.game;
        if (!game) return;
        if (game.party && !game.party._waddleOriginalInvoke) {
            game.party._waddleOriginalInvoke = game.party.invoke;
            game.party.invoke = function (method, ...args) {
                const blockedMethods = ['acceptPartyInvite', 'rejectPartyInvite', 'requestToJoinParty', 'respondToPartyRequest', 'inviteToParty'];
                if (blockedMethods.includes(method)) return;
                return this._waddleOriginalInvoke?.(method, ...args);
            };
        }
    }

    function restorePartyRequests() {
        const game = gameRef.game;
        if (game?.party?._waddleOriginalInvoke) {
            game.party.invoke = game.party._waddleOriginalInvoke;
        }
    }

    const featureManager = {
        performance: {
            start: () => {
                if (!state.counters.performance) createCounter('performance');
                startPerformanceLoop();
                updatePerformanceCounter();
            },
            stop: () => { if (!state.features.coords) stopPerformanceLoop(); }, // 5.18: fixed RAF loop bug
            cleanup: () => { if (state.counters.performance) { state.counters.performance.remove(); state.counters.performance = null; } }
        },
        coords: {
            start: () => {
                if (!state.counters.coords) createCounter('coords');
                startPerformanceLoop();
            },
            stop: () => { if (!state.features.performance) stopPerformanceLoop(); }, // 5.18: fixed RAF loop bug
            cleanup: () => { if (state.counters.coords) { state.counters.coords.remove(); state.counters.coords = null; } }
        },
        realTime: {
            start: () => {
                if (!state.counters.realTime) createCounter('realTime');
                updateRealTime();
                state.intervals.realTime = setInterval(updateRealTime, 1000);
            },
            stop: () => { clearInterval(state.intervals.realTime); state.intervals.realTime = null; },
            cleanup: () => { if (state.counters.realTime) { state.counters.realTime.remove(); state.counters.realTime = null; } }
        },
        antiAfk: {
            start: () => {
                if (!state.counters.antiAfk) createCounter('antiAfk');
                state.antiAfkCountdown = 5;
                updateAntiAfkCounter();
                state.intervals.antiAfk = setInterval(() => {
                    state.antiAfkCountdown--;
                    updateAntiAfkCounter();
                    if (state.antiAfkCountdown <= 0) { pressSpace(); state.antiAfkCountdown = 5; }
                }, 1000);
            },
            stop: () => { clearInterval(state.intervals.antiAfk); state.intervals.antiAfk = null; },
            cleanup: () => { if (state.counters.antiAfk) { state.counters.antiAfk.remove(); state.counters.antiAfk = null; } }
        },
        keyDisplay: {
            start: () => {
                if (!state.counters.keyDisplay) createKeyDisplay();
                setupKeyDisplayListeners();
            },
            // 5.21: removed empty stop: () => {}
            cleanup: () => {
                if (state.counters.keyDisplay) { state.counters.keyDisplay.remove(); state.counters.keyDisplay = null; }
                Object.keys(state.keys).forEach(key => { state.keys[key] = false; });
            }
        },
        disablePartyRequests: {
            start: () => disablePartyRequestsSystem(),
            stop: () => restorePartyRequests(),
            cleanup: () => restorePartyRequests()
        }
    };

    function toggleFeature(featureName) {
        const newState = !state.features[featureName];
        state.features[featureName] = newState;
        if (newState) {
            featureManager[featureName]?.start();
        } else {
            featureManager[featureName]?.cleanup?.();
            featureManager[featureName]?.stop?.();
        }
        saveSettings();
        return newState;
    }

    function createFeatureCard(title, features) {
        const card = document.createElement('div');
        card.className = 'waddle-card';
        card.innerHTML = `<div class="waddle-card-header">${title}</div>`;
        const grid = document.createElement('div');
        grid.className = 'waddle-card-grid';
        features.forEach(({ label, feature, icon }) => {
            const btn = document.createElement('button');
            btn.className = 'waddle-menu-btn';
            const isEnabled = state.features[feature];
            btn.textContent = `${label} ${isEnabled ? '✓' : icon}`;
            if (isEnabled) btn.classList.add('active');
            btn.onclick = () => {
                const enabled = toggleFeature(feature);
                btn.textContent = `${label} ${enabled ? '✓' : icon}`;
                btn.classList.toggle('active', enabled);
                showToast(`${label} ${enabled ? 'Enabled' : 'Disabled'} ✓`, 'success');
            };
            grid.appendChild(btn);
        });
        card.appendChild(grid);
        return card;
    }

    // 5.20: simplified tab system using querySelectorAll + dataset
    function switchTab(tabName) {
        document.querySelectorAll('.waddle-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.waddle-tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.content === tabName);
        });
    }

    function createMenu() {
        if (!document.body) return null;
        const menuOverlay = document.createElement('div');
        menuOverlay.id = 'waddle-menu-overlay';
        const menuHeader = document.createElement('div');
        menuHeader.id = 'waddle-menu-header';
        menuHeader.innerHTML = `🐧 Waddle <span style="font-size: 0.5em; color: #888; display: block; margin-top: 10px;">v${SCRIPT_VERSION}</span>`;
        menuOverlay.appendChild(menuHeader);
        const tabsContainer = document.createElement('div');
        tabsContainer.id = 'waddle-tabs';

        // 5.19: Settings tab removed — Features and About only
        const tabConfigs = [
            { name: 'features', label: '⚙️ Features' },
            { name: 'about', label: 'ℹ️ About' }
        ];
        tabConfigs.forEach(({ name, label }, i) => {
            const btn = document.createElement('button');
            btn.className = 'waddle-tab-btn';
            if (i === 0) btn.classList.add('active');
            btn.setAttribute('data-tab', name);
            btn.textContent = label;
            btn.onclick = () => switchTab(name);
            tabsContainer.appendChild(btn);
        });
        menuOverlay.appendChild(tabsContainer);
        const menuContent = document.createElement('div');
        menuContent.id = 'waddle-menu-content';

        // Features tab
        const featuresContent = document.createElement('div');
        featuresContent.className = 'waddle-tab-content active';
        featuresContent.setAttribute('data-content', 'features');
        featuresContent.appendChild(createFeatureCard('📊 Display', [
            { label: 'FPS & Ping', feature: 'performance', icon: '🐧' },
            { label: 'Coords', feature: 'coords', icon: '🐧' },
            { label: 'Clock', feature: 'realTime', icon: '🐧' },
            { label: 'Key Display', feature: 'keyDisplay', icon: '🐧' }
        ]));
        featuresContent.appendChild(createFeatureCard('🛠️ Utilities', [
            { label: 'Anti-AFK', feature: 'antiAfk', icon: '🐧' },
            { label: 'Block Party RQ', feature: 'disablePartyRequests', icon: '🐧' }
        ]));
        menuContent.appendChild(featuresContent);

        // About tab
        const aboutContent = document.createElement('div');
        aboutContent.className = 'waddle-tab-content';
        aboutContent.setAttribute('data-content', 'about');
        const timerCard = document.createElement('div');
        timerCard.className = 'waddle-card';
        timerCard.style.textAlign = 'center';
        timerCard.innerHTML = `
            <div class="waddle-card-header" style="justify-content: center;">⏱️ Session Timer</div>
            <div id="waddle-session-timer" style="font-size:2.5rem;font-weight:900;color:var(--waddle-primary);font-family:'Courier New',monospace;text-shadow:0 0 10px rgba(0,255,255,0.5);margin-top:8px;">00:00:00</div>
        `;
        aboutContent.appendChild(timerCard);
        const creditsCard = document.createElement('div');
        creditsCard.className = 'waddle-card';
        creditsCard.innerHTML = `
            <div class="waddle-card-header">Credits</div>
            <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="https://avatars.githubusercontent.com/Scripter132132" width="32" height="32" style="border-radius:50%;box-shadow:0 0 8px rgba(0,255,255,0.35);">
                    <div style="flex:1;">
                        <div style="color:#00ffff;font-size:0.75rem;font-weight:600;">Original Creator</div>
                        <a href="https://github.com/Scripter132132" target="_blank" style="color:#aaa;font-size:0.85rem;text-decoration:none;">@Scripter132132</a>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="https://avatars.githubusercontent.com/TheM1ddleM1n" width="32" height="32" style="border-radius:50%;box-shadow:0 0 8px rgba(243,156,18,0.35);">
                    <div style="flex:1;">
                        <div style="color:#f39c12;font-size:0.75rem;font-weight:600;">Enhanced By</div>
                        <a href="https://github.com/TheM1ddleM1n" target="_blank" style="color:#aaa;font-size:0.85rem;text-decoration:none;">@TheM1ddleM1n</a>
                    </div>
                </div>
            </div>
            <div style="font-size:0.7rem;color:#555;margin-top:12px;padding-top:12px;border-top:1px solid rgba(0,255,255,0.15);text-align:center;">v${SCRIPT_VERSION} • MIT License • Built with ❤️</div>
        `;
        aboutContent.appendChild(creditsCard);
        const linksCard = document.createElement('div');
        linksCard.className = 'waddle-card';
        linksCard.innerHTML = '<div class="waddle-card-header">🔗 Github</div>';
        const linksGrid = document.createElement('div');
        linksGrid.className = 'waddle-card-grid';
        const suggestBtn = document.createElement('button');
        suggestBtn.className = 'waddle-menu-btn';
        suggestBtn.textContent = 'Suggest Feature';
        suggestBtn.onclick = () => window.open(`https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=enhancement`, '_blank');
        linksGrid.appendChild(suggestBtn);
        const bugBtn = document.createElement('button');
        bugBtn.className = 'waddle-menu-btn';
        bugBtn.textContent = 'Report Bug';
        bugBtn.onclick = () => window.open(`https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=bug`, '_blank');
        linksGrid.appendChild(bugBtn);
        linksCard.appendChild(linksGrid);
        aboutContent.appendChild(linksCard);
        menuContent.appendChild(aboutContent);

        menuOverlay.appendChild(menuContent);
        document.body.appendChild(menuOverlay);
        menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) state.menuOverlay.classList.remove('show'); });
        state.menuOverlay = menuOverlay;
        return menuOverlay;
    }

    function toggleMenu() {
        state.menuOverlay?.classList.toggle('show');
    }

    // 5.22: fire-and-forget — removed state.keyboardHandler storage
    function setupKeyboardHandler() {
        window.addEventListener('keydown', (e) => {
            if (e.key === '\\') {
                e.preventDefault();
                toggleMenu();
            } else if (e.key === 'Escape' && state.menuOverlay?.classList.contains('show')) {
                e.preventDefault();
                state.menuOverlay.classList.remove('show');
            }
        });
    }

    function restoreSavedState() {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (!saved) return;
        const settings = JSON.parse(saved);
        if (typeof settings.features === 'object' && settings.features !== null) {
            Object.keys(state.features).forEach(key => {
                if (typeof settings.features[key] === 'boolean') state.features[key] = settings.features[key];
            });
        }
    }

    function globalCleanup() {
        Object.entries(state.features).forEach(([feature, enabled]) => {
            if (enabled) { featureManager[feature]?.cleanup?.(); featureManager[feature]?.stop?.(); }
        });
        // 5.22: removed keyboardHandler removeEventListener — fire-and-forget
        Object.entries(state.intervals).forEach(([_, id]) => { if (id) clearInterval(id); });
        if (state.rafId) cancelAnimationFrame(state.rafId);
    }

    window.addEventListener('beforeunload', globalCleanup);

    function ensureDOMReady() {
        return new Promise((resolve) => {
            if (document.body && document.head) {
                resolve();
            } else if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                const checkBody = setInterval(() => {
                    if (document.body && document.head) { clearInterval(checkBody); resolve(); }
                }, 50);
            }
        });
    }

    async function safeInit() {
        try {
            await ensureDOMReady();
            injectStyles();
            restoreSavedState();

            const menuCreated = createMenu();
            if (!menuCreated) throw new Error('Failed to create menu');

            setupKeyboardHandler();
            initializeCrosshairModule();
            showToast(`Press \\ to open menu!`, 'info');

            setTimeout(() => {
                // 5.22: removed per-feature try/catch — single outer handler sufficient
                Object.entries(state.features).forEach(([feature, enabled]) => {
                    if (enabled && featureManager[feature]?.start) featureManager[feature].start();
                });
            }, 100);

            updateSessionTimer();
            setInterval(updateSessionTimer, 1000); // 5.22: fire-and-forget, removed state.intervals.sessionTimer
        } catch (error) {
            showToast('Waddle failed to initialize! Check console.', 'error');
        }
    }

    safeInit();
})();
