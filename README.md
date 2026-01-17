# Waddle Client 🐧

**The ultimate enhancement suite for Miniblox. Real-time performance monitoring, unlimited customization, and zero bottlenecks.**

---

## ⚡ Quick Start

1. **Install Tampermonkey** on [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) | [Safari](https://apps.apple.com/app/tampermonkey/id1482490089)
2. **Install Waddle** → [Click here](https://github.com/TheM1ddleM1n/WaddleClient/raw/main/WaddleClient.js)
3. **Open** [miniblox.io](https://miniblox.io) and press `\` (or backslash in js terms)

---

## ✨ Core Features

| Feature | What It Does |
|---------|-------------|
| **FPS Counter** | Real-time frame rate monitoring (500ms updates) |
| **CPS Counter** | Clicks per second with 1-second rolling window |
| **Real-Time Clock** | Check time without you having to exit fullscreen |
| **Ping Monitor** | Network latency with avg/peak/min stats |
| **Anti-AFK** | Auto-jump every 5 seconds (prevents kicks) |
| **Unlimited Colors** | Pick ANY color with instant theme application |
| **Draggable UI** | Move counters freely, auto-saves positions |
| **Custom Keybind** | Change menu hotkey from default `\` |
| **Session Stats** | Track performance across sessions |
| **Zero Lag** | 50-70% lighter than competitors! |

---

## 🎮 How to Use

**Open Menu:** Press `\` (change this in settings)
`\` is the main keybind Lol

**Toggle Features:**
- Menu → Click any counter button to enable/disable
- Positions save automatically when you drag them

**Customize Colors:**
1. Open menu with `\`
2. Scroll to "Theme Color"
3. Click color picker and choose your color
4. Instantly applies to all UI elements

**Change Hotkey:**
1. Menu → "Menu Keybind"
2. Press your desired key
3. Automatically updates everywhere

**Anti-AFK:**
- Menu → Click "Anti-AFK"
- Script auto-jumps every 5 seconds
- Perfect for AFK activities

---

## 🛠️ Technical Details

**Performance:** Optimized event listeners, passive event handling, smart update intervals
- FPS: 500ms updates
- CPS: 250ms updates  
- Ping: 2000ms updates
- Zero memory leaks, perfect cleanup on exit

**Storage Keys:**
- `waddle_settings` — Feature toggles, positions, keybinds
- `waddle_custom_color` — Your selected color (persists forever)
- `waddle_session_count` — Session tracking

**Default Theme:** Cyan (`#00ffff`) until you customize

---

## ❓ Troubleshooting

| Issue | Fix |
|-------|-----|
| Menu won't open? | Try changing keybind (may conflict with game) |
| Counters not updating | Refresh page, disable/re-enable feature |
| Color not saving | Enable localStorage in browser settings |
| Performance lag | Close other tabs, disable unnecessary counters |
| Script not loading? | Check Tampermonkey is enabled, refresh page |

---

## 📋 Version Info

**Current:** v4.2 
- Added a session timer to the settings!
- made some improvements with css code
- Exactly the same as NovaCore but more improvements are coming soon!


**Credits:**
- **@Scripter132132** — Original creator of NovaCore
- **@TheM1ddleM1n** — V2+ development & optimization of NEW WaddleClient (forked and created new repo of Waddle)

**License:** MIT (free to use, modify, distribute)

---

## 🤝 Support & Contribute

- **Report Bugs:** [GitHub Issues](https://github.com/TheM1ddleM1n/WaddleClient/issues)
- **Suggest Features:** [GitHub Discussions](https://github.com/TheM1ddleM1n/WaddleClient/discussions)
- **Source Code:** [GitHub Repository](https://github.com/TheM1ddleM1n/WaddleClient)

**Made with 💎 for the Miniblox community** — *Zero lag. Maximum customization. Pure enhancements.*
