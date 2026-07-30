<div align="center">

# Waddle: The Ultimate Miniblox Enhancement Suite

![Version](https://img.shields.io/badge/version-10-39ff14?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-39ff14?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Miniblox-39ff14?style=for-the-badge)

</div>

---

## Install
1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Click **[→ Install Waddle](https://github.com/TheM1ddleM1n/Waddle/raw/main/Waddle.user.js)**
3. Open Miniblox, press `\` (or any other keybind when you change it) and start playing

---
> [!IMPORTANT]
> ### 🌇 **SUNSET FOR WADDLE**
> **I just wanted to say thank you all so much for supporting this client in Miniblox and on Github!**

## Development

Waddle is made using plain JS, and the source is literally just in one file.
While it can be edited directly from the source code,
we recommend using GitHub Codespaces or anywhere that can install NPM packages.
Simply install NPM packages using your preferred package manager (npm, bun, etc.)
to get auto-complete for game-related variables from [@wq2/miniblox-sdk](https://www.npmjs.com/@wq2/miniblox-sdk).

> [!CAUTION]
> Do NOT try to import stuff from ANY package,
> static imports (`import x from "package"`) are NOT supported in user-script managers AND dev console.
> Dynamic imports will work in both, but the package won't exist at runtime, thus causing an error when running the script.

## Features
### Always On

| Feature | Description |
|---------|-------------|
| Crosshair | Cyan crosshair, auto-hides in menu |
| Target HUD | Player faces, mob names, block names |
| All Gamemodes | You can play every minigame thanks to heythereu! |
| NO ADS | Basically what it says on the tin (only works with user-script managers) (or use https://ublockorigin.com/) |

### Toggleable via `\` menu

| Feature | Description |
|---------|-------------|
| FPS & CPS | Color-coded performance counter with left/right click rate |
| Coordinates | Live X Y Z position |
| Key Display | WASD + space, lights up on press |
| Anti-AFK | Auto-jumps and sends an AFK message to prevent being kicked |
| Chat Mute | Hides all incoming chat messages |

<!-- https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts -->

> [!TIP]
> All draggable widgets **remember their position** across sessions

---

## Credits
| Role | Contributor |
|------|-------------|
| Original Creator | [@Scripter132132](https://github.com/Scripter132132) |
| Enhancement & Maintenance | [@TheM1ddleM1n](https://github.com/TheM1ddleM1n) |
| Adding JSDoc stuff | [@6x68](https://github.com/6x68) |
| Providing the hidden gamemodes | [@heythereu](https://github.com/heythereu) |
| Inspired By | Novacore |

## Other Clients!
- Unverified V2 (The only active utility client)
- Back 2 Basics
- SmoothDude's texture packs (look on github)

---

<div align="center">

**Made by the Waddle Team**

</div>
