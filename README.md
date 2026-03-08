<div align="center">

# 🐧 Waddle
### The Ultimate Miniblox Enhancement Suite

![Version](https://img.shields.io/badge/version-6.12-39ff14?style=for-the-badge)
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
| 👁️ Target HUD | Player faces, mob names, block names — with live health bars |
| 🌌 Space Sky | MilkyWay cubemap replaces the default sky entirely |

### Toggleable via `\` menu
| Feature | Description |
|---------|-------------|
| 📊 FPS & Ping | Color-coded performance counter |
| 📍 Coordinates | Live X Y Z, 10 updates/sec |
| 🕐 Clock | 24-hour clock, fixed bottom-right |
| ⌨️ Key Display | WASD + mouse buttons, lights up on press |
| 🧭 Compass | Sliding tape compass with cardinal/intercardinal labels, heading readout, and pointer-lock auto-hide |
| 🐧 Anti-AFK | Auto-jumps every 5s — only fires when in-game |
| 🐧 Fun Facts | Penguin fact toast on game join |
| 🚫 Block Party RQ | Silently drops incoming party invites |
| 🎨 Custom Skin | Equip any skin from the menu — in one click lol |
| 🔇 Chat Mute | Hides all incoming chat messages — toggle to restore |

> All draggable widgets **remember their position** across sessions. (using localstorage)

![Space Sky](https://github.com/user-attachments/assets/a11615b2-423f-41bc-9f5c-be91bd1f2adc)

---

## 📝 Changelog

### [6.12] — Compass and performance update
- Compass module added to Display — sliding tape shows a 90° arc of cardinal and intercardinal labels
- Live heading readout in the top-right corner of the widget (e.g. `NNE 22°`) (via player yaw)
- Auto-hides when pointer lock is not active (i.e. outside of gameplay)
- Drag position persists across sessions via localStorage
- performance v2 update

### [6.11] — Chat Mute
- Chat Mute module added to Utilities — silently suppresses all incoming chat messages
- Patches `game.chat.addChat` at the game object level, fully restores on disable
- Guards against enabling before the game has loaded, with toast feedback in both states
- Original `addChat` stored as `_waddleOriginalAddChat` on the chat object — survives menu reloads

### [6.10] — Skins & Polish
- Custom skin picker with equipped-state guard (no double-equip prompts)
- Draggable widget positions now persist across reloads
- Anti-AFK spacebar only fires when pointer is locked in-game
- LRU cache replaces plain-object caches for face/player images
- `applySkin` validates server response before showing success
- Target HUD fully resets entity state on error recovery

### [6.9] — Bug Fixes
- HP bar no longer interpolates from a previous entity's health on target switch
- CPS detector interval cleaned up properly on unload
- `funFacts` toggle correctly resets shown state
- MutationObserver and resize listener disconnected on page unload
- Space sky gives up after 20 attempts instead of retrying forever
- Face and player image caches capped at 64 entries

### [6.8] — Stability
- Game reference revalidated every 2s instead of every frame
- Three.js version guard in Space Sky with CDN fallback
- Error boundary in Target HUD loop with 2s restart backoff
- Settings versioning strips unknown keys from older configs

### [6.5] — Space Sky
- MilkyWay cubemap skybox via Three.js `sky.update` patch
- Removed custom health/food/XP overlay — native bars restored

### [6.4] — Target HUD
- Canvas-based Target HUD for players, mobs, and blocks
- Player face cached from DOM, persists when looking away
- Entity always takes priority over block display

---

## 👥 Credits

| Role | Contributor |
|------|-------------|
| Original Creator | [@Scripter132132](https://github.com/Scripter132132) |
| Enhancement & Maintenance | [@TheM1ddleM1n](https://github.com/TheM1ddleM1n) |
| Inspired By | Scripter's NovaCore Client |

> ⚠️ SECURITY: The custom skin feature reads your Miniblox session token from localStorage and sends it to `coolmathblox.ca` to apply skins — only use if you trust the service.

---

<div align="center">

🐧 **Made by the Waddle Team with 🖥️** — MIT License

</div>
