<div align="center">

# 🐧 Waddle
### The Ultimate Miniblox Enhancement Suite

![Version](https://img.shields.io/badge/version-6.16-39ff14?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-39ff14?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Miniblox-39ff14?style=for-the-badge)

**[Install](#-install) • [Features](#-features) • [Changelog](#-changelog) • [Report Bug](https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=bug)**

</div>

---

## ⚡ Install

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Click **[→ Install Waddle](https://github.com/TheM1ddleM1n/Waddle/raw/main/Waddle.js)**
3. Open Miniblox, press `\` and start playing

---

## ✨ Features

### Always On
| Feature | Description |
|---------|-------------|
| 🎯 Crosshair | Cyan crosshair, auto-hides in menus |
| 👁️ Target HUD | Player faces, mob names, block names |
| 🌌 Space Sky | MilkyWay cubemap replaces the default sky entirely |

### Toggleable via `\` menu
| Feature | Description |
|---------|-------------|
| 📊 FPS & Ping | Color-coded performance counter |
| 📍 Coordinates | Live X Y Z, 10 updates/sec |
| 🕐 Clock | 24-hour clock, fixed bottom-right |
| ⌨️ Key Display | WASD + mouse buttons, lights up on press |
| 🐧 Anti-AFK | Auto-jumps every 5s — only fires when in-game |
| 🚫 Block Party RQ | Silently drops incoming party invites |
| 🎨 Custom Skin | Equip any skin from the UI |
| 🔇 Chat Mute | Hides all incoming chat messages — toggle to restore |

> All draggable widgets **remember their position** across sessions

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/7c6555a4-9084-4970-b6aa-9f467a504666" />


---

## 📝 Changelog

### [6.16] v5 — Cleanup & Refactors
- Ping removed entirely — `filteredPing` no longer read, coords widget shows `X Y Z` only, FPS color thresholds are now FPS-only
- `pollUsername(element)` extracted as a shared helper — duplicate polling intervals in `buildSkinPanel` collapsed into one call
- `drawHUDCard(x, y, h, drawContent)` extracted — shared canvas setup (clear, shadow, fill, stroke) deduplicated between `drawEntityHUD` and `drawBlockHUD`
- `faceImgCache` double-lookup (`has` then `get`) collapsed into a single `get` with null check

### [6.16] v4 — Target HUD Health Removed
- HP bar, HP text, and all health smoothing state removed from entity cards in Target HUD
- `H_ENTITY` reduced from `86` to `52` — entity and block cards now share the same height
- `drawEntityHUD` no longer takes `nearest` as a parameter since health reads are gone
- `displayedHp` and `lastDrawnHp` variables removed entirely

### [6.16] v3 — Bug Fixes & Refactors
- `applySkin` now uses a lock flag to prevent double-firing on rapid clicks; resets on failure, not on success (page reloads anyway)
- `WIDGET_CONFIGS` entries now each own a `build(wrap)` method — `createWidget` no longer needs type-specific branches
- `isTyping()` hoisted to module scope and shared between the keyboard handler and key display
- Speedometer clamps sub-`0.05 b/s` jitter to `0.00` to absorb server-tick micro-corrections
- Key display no longer lights up while typing in chat or any other focused input
- Skin equip badges now sync on every panel open and immediately after a successful equip, without needing to close and reopen
- Anti-AFK countdown resets to 5 on cleanup; interval callback is guarded against firing after toggle-off

### [6.16] — Skins Update
- Updated sidebar panel to Skins 👗

### [6.14] — Speedometer
- Speedometer added to Display — shows ground speed in blocks/second
- Derived from position delta rather than velocity property for reliability
- Shares the coords 100ms tick rate, no extra timer needed
- Performance v2 update!!!

### [6.11] — Chat Mute
- Chat Mute added to Utilities — suppresses all incoming chat, fully restores on disable

### [6.10] — Skins & Polish
- Custom skin picker with equipped-state guard
- Draggable widget positions persist across reloads
- Anti-AFK only fires when pointer is locked, LRU cache for face/player images

### [6.9] — Bug Fixes
- HP bar no longer bleeds health from previous target on switch
- Proper cleanup for CPS interval, MutationObserver, and resize listener on unload
- Space sky caps retry attempts at 20, image caches capped at 64 entries

### [6.8] — Stability
- Game reference revalidated every 2s, Three.js version guard with CDN fallback
- Error boundary in Target HUD loop, settings versioning strips unknown keys

---

## 👥 Credits

| Role | Contributor |
|------|-------------|
| Original Creator | [@Scripter132132](https://github.com/Scripter132132) |
| Enhancement & Maintenance | [@TheM1ddleM1n](https://github.com/TheM1ddleM1n) |
| Inspired By | Scripter's NovaCore Client |

> ⚠️ SECURITY: The custom skin feature reads your Miniblox session token from localStorage and sends it to `coolmathblox.ca` to apply skins — only use if you trust this.

---

<div align="center">

🐧 **Made by the Waddle Team with 🖥️** — MIT License

</div>
