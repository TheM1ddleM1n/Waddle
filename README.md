<div align="center">

# 🐧 Waddle
### The Ultimate Miniblox Enhancement Suite

![Version](https://img.shields.io/badge/version-6.14-39ff14?style=for-the-badge)
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

### [6.14] — Speedometer
- Speedometer added to Display — shows ground speed in blocks/second
- Derived from position delta rather than velocity property for reliability
- Shares the coords 100ms tick rate, no extra timer needed

### [6.12] — Compass
- Sliding tape compass with cardinal/intercardinal labels and live heading readout (`NNE 22°`)
- Auto-hides outside gameplay, position persists via localStorage
- Performance v2 update

### [6.11] — Chat Mute
- Chat Mute added to Utilities — suppresses all incoming chat, fully restores on disable

### [6.10] — Skins & Polish
- Custom skin picker with equipped-state guard
- Draggable widget positions persist across reloads
- Anti-AFK only fires when pointer is locked, LRU cache for face/player images
- Im going to make this VERY OBVIOUS TO PLAYERS: you have to RUN in CONSOLE (by pressing F12) token/skin.js FIRST (on my MBskin repo) before this will work.

### [6.9] — Bug Fixes
- HP bar no longer bleeds health from previous target on switch
- Proper cleanup for CPS interval, MutationObserver, and resize listener on unload
- Space sky caps retry attempts at 20, image caches capped at 64 entries

### [6.8] — Stability
- Game reference revalidated every 2s, Three.js version guard with CDN fallback
- Error boundary in Target HUD loop, settings versioning strips unknown keys

### [6.5] — Space Sky + Target HUD
- MilkyWay cubemap skybox, native health/food/XP bars restored
- Canvas-based Target HUD for players, mobs, and blocks — entity takes priority over block

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
