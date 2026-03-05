<div align="center">

# 🐧 Waddle

### The Ultimate Miniblox Enhancement Suite!

![Version](https://img.shields.io/badge/version-6.10-39ff14?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-39ff14?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Miniblox-39ff14?style=for-the-badge)

[Install](#-quick-start) • [Features](#-features) • [Support](https://github.com/TheM1ddleM1n/Waddle/issues)

</div>

---

## 🚀 Quick Start

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Click [🔗 Install Waddle](https://github.com/TheM1ddleM1n/Waddle/raw/main/Waddle.js)
3. Launch Miniblox → Press `\` → Enable features → Play!

---

## ✨ Features

### Always-On (no toggle needed)

**🎯 Crosshair** — cyan crosshair, auto-hides in menus and pause screens

**🎯 Target HUD** — canvas-based HUD at top-center of screen
- **Players** — persistent face + name + health bar. Face cached so it stays visible when looking away
- **Mobs** — clean name (`Zombie`, `Creeper` etc.) + health bar + distance
- **Blocks** — block name + 🧱 icon when no entity is nearby. Entity always takes priority over block
- Health bar color reacts to HP: 🟢 → 🟡 → 🔴
- Smooth HP interpolation resets correctly on target switch

**🌌 Space Sky** — MilkyWay cubemap skybox, replaces the default day/night sky entirely

![Space Sky](https://github.com/user-attachments/assets/a11615b2-423f-41bc-9f5c-be91bd1f2adc)

### Toggleable (via `\` menu)

| Feature | Description |
|---------|-------------|
| 📊 FPS & Ping | Unified counter, color-coded by performance |
| 📍 Coordinates | Live X Y Z, 10 updates/sec |
| 🕐 Clock | 24-hour clock with AM/PM (e.g. `20:00:00 PM`), fixed bottom-right |
| ⌨️ Key Display | WASD + LMB/RMB/Space, cyan on press |
| 🐧 Anti-AFK | Auto spacebar every 5s with countdown |
| 🐧 Fun Facts | Penguin fun fact toast on game join, resets on toggle |
| 🚫 Block Party RQ | Silently blocks party invites |

---

## ⚡ Performance

~0.5% total CPU. Key optimizations:
- Game reference cached and revalidated every 2s — never resolved per frame
- Target HUD entity scan throttled to 20fps, dirty flag skips redraws when nothing changed
- Single RAF loop, direct DOM updates, debounced settings saves
- MutationObserver scoped to `#react` only, module panels cached
- Space sky patches `sky.update` directly — zero RAF overhead
- Face and player image caches pruned to 64 entries to prevent unbounded growth

---

## 🛡️ Stability

- Target HUD RAF loop is error-bounded — any mid-frame throw resets state and restarts after 2s backoff instead of silently dying
- Smooth HP bar resets to zero on target switch so interpolation always starts from the correct entity
- Space Sky detects whether Miniblox's bundled Three.js is new enough (r128+) before using it; falls back to a pinned CDN build if not, with a toast on failure. Gives up after 20 attempts with a toast instead of retrying forever
- Settings migration strips unrecognised keys from older versions so stale config never breaks new feature state
- Panel cache is invalidated on settings restore so module buttons always reflect the correct saved state
- MutationObserver and resize listener are properly disconnected and removed on page unload
- CPS detector interval stored in state so it is cleaned up on unload

---

## 📝 Changelog

### [6.9/6.10] - Bug Fixes & Polish
- 🐛 `_displayedHp` resets to `0` on target switch — smooth HP bar no longer interpolates from a previous entity's health
- 🐛 CPS detector interval now stored in `state.intervals` so it is properly cleaned up on unload
- 🐛 `funFacts` cleanup now clears `hasShownFunFactOnJoin` so the module works correctly when toggled off and on again
- 🛡️ `MutationObserver` from crosshair module disconnected on page unload
- 🛡️ Canvas resize listener stored on state and removed on page unload
- 🛡️ `tryPatch` in `initSpaceSky` now gives up after 20 attempts with a toast instead of retrying forever
- ⚡ One-off `getGameCached` calls pass `0` to force revalidation without an unnecessary `performance.now()` call
- ⚡ `pressSpace` now dispatches on both `document` and `window` for better compatibility
- ⚡ Face and player image caches pruned to a max of 64 entries to prevent memory growth
- 🕐 Clock now shows 24-hour time with AM/PM suffix (e.g. `20:00:00 PM`)

### [6.8] - Stability & Polish
- ⚡ `getGameCached()` — game reference revalidated every 2s instead of every RAF frame
- 🐛 `_panelCache` busted on `restoreSavedState` so module buttons correctly reflect loaded settings
- 🛡️ Three.js version guard in `initSpaceSky` — uses bundled copy only if `REVISION >= 128`, otherwise loads pinned CDN build with `onerror` toast fallback
- 🛡️ Error boundary in `startTargetHUDLoop` — `tick()` wrapped in try/catch; resets draw state and restarts via `setTimeout` to prevent duplicate RAF chains
- 🗂️ Settings versioning — `migrateSettings()` silently drops keys not in the current feature set; `KNOWN_FEATURES` derived automatically from initial state
- ✨ Fun Facts module — penguin fact toast fires once on first game join per session

### [6.5] - Space Sky
- 🗑️ Removed custom health/food/XP overlay — native bars restored
- 🐛 Fixed duplicate interval stacking on realTime and antiAfk rapid toggles
- ✨ Always-on MilkyWay cubemap skybox via Three.js `sky.update` patch

### [6.4] - Target HUD
- ✨ Canvas-based Target HUD — players, mobs, and blocks
- ✨ Player face cached from DOM, persists when looking away
- ✨ Native target HUD hidden and replaced entirely
- ✨ Entity always takes priority over block
- ⚡ Throttled scans, dirty flag, cached gradient

### [6.2] - Architecture Pass
- 🐛 Multiple cleanup, leak and stale reference fixes
- ⚡ MutationObserver scoped, module panels cached, settings debounced

### [6.1] - Reliability Pass
- 🐛 Fixed gameRef, keyDisplay listeners, party request and interval leak bugs

### [6.0] - Advanced API Features
- ✨ CPS detector, chat greeting, toast system, HUD array, session timer, sidebar navigation

---

## 👥 Credits

| **Role**                  | **Contributor**                                      |
| :------------------------ | :--------------------------------------------------- |
| Original Creator          | [@Scripter132132](https://github.com/Scripter132132) |
| Enhancement & Maintenance | [@TheM1ddleM1n](https://github.com/TheM1ddleM1n)     |
| Inspired By               | Scripter's NovaCore Client                           |

---

## 🔗 Links

<div align="center">

[📦 GitHub](https://github.com/TheM1ddleM1n/Waddle) •
[🐛 Report Bug](https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=bug) •
[✨ Suggest Feature](https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=enhancement) •
[🎮 Play Miniblox](https://miniblox.io/)

</div>

---

<div align="center">

### 🐧 Made by the Waddle Team with ❤️

Licensed under the **MIT License**

</div>
