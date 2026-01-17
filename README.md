# 🐧 Waddle Client v4.2

**Premium Performance & Monitoring Tool for Miniblox**

Waddle is a lightweight, performance-optimized userscript that enhances your Miniblox gaming experience with real-time performance monitoring, customizable counters, and quality-of-life features.

---

## ✨ Features

### Performance Monitoring
- **FPS Counter** - Real-time frames per second display
- **CPS Counter** - Clicks per second measurement for competitive gaming
- **Ping Monitor** - Network latency tracking with statistics (average, peak, minimum)
- **Real Time Display** - Current time without exiting fullscreen

### Quality of Life
- **Anti-AFK** - Automatically jumps every 5 seconds to prevent kick
- **Auto Fullscreen** - Quick fullscreen toggle
- **Draggable Counters** - Move all counters anywhere on your screen
- **Custom Theme** - Change the accent color to your preference
- **Session Timer** - Track your total gaming session time
- **Settings Persistence** - All settings saved automatically

### User Interface
- **Smooth Animations** - Polished slide-in effects and transitions
- **Toast Notifications** - Real-time feedback for all actions
- **Tabbed Menu** - Organized Features, Settings, and About sections
- **Dark Theme** - Eye-friendly design optimized for gaming

---

## 🚀 Installation

### Via Userscript Manager (Recommended)
1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge)
   - [Greasemonkey](https://www.greasemonkey.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. Click the install link or add the script manually:
   - Copy the entire `WaddleClient.js` code
   - Create a new script in your userscript manager
   - Paste the code and save

3. Visit [miniblox.io](https://miniblox.io/) and the script will activate automatically

---

## 📖 How to Use

### Opening the Menu
Press the **backslash key (`\`)** to open the Waddle menu. Press `Escape` to close it.

### Enabling Features
Navigate to the **Features** tab and click any feature button to toggle it on/off:
- ✓ Green checkmark indicates the feature is active
- Toast notification confirms the action

### Customizing Settings
Click the **Settings** tab to:
- **Change Theme Color** - Click the color picker to select your accent color
- **Change Menu Keybind** - Click the keybind input and press any key (ESC to cancel)
- **View Session Time** - Live tracking of your current session duration

### Moving Counters
- Drag any counter to a new position on your screen
- Positions are saved automatically
- Hover to scale up, drag to move smoothly

---

## 🎮 Features Breakdown

### FPS Counter
Displays your current frames per second in real-time. Tracks peak FPS during your session.
- Position: Top-left area (default)
- Draggable: Yes
- Updates every 500ms

### CPS Counter
Measures clicks per second within a 1-second window. Perfect for competitive clicking games.
- Position: Left side (default)
- Draggable: Yes
- Updates every 250ms

### Real Time
Shows the current time in 12-hour format without needing to exit fullscreen.
- Position: Top-left (default)
- Draggable: No (recommended to keep for time checking)
- Accuracy: Updates every second

### Ping Monitor
Tracks your network latency to the Miniblox servers.
- Current Ping: Latest measurement
- Average Ping: Mean of last 60 measurements
- Peak Ping: Highest ping recorded
- Position: Left side (default)
- Draggable: Yes

### Anti-AFK
Automatically simulates space bar presses every 5 seconds to keep you active and prevent being kicked for inactivity.
- Safe: Uses keyboard events only
- Customizable: Off by default
- Countdown: Shows time until next jump

### Auto Fullscreen
Quick toggle between fullscreen and windowed mode.
- One-click fullscreen activation
- Compatible with all modern browsers

### Session Timer
Tracks how long you've been in the current gaming session.
- Format: HH:MM:SS
- Persistent: Continues updating while menu is open
- Automatic: Starts when the script initializes

---

## ⚙️ Customization

### Theme Color
Access **Settings** → **Theme Color** and click the color picker. Select any hex color:
- Default: Cyan (`#00ffff`)
- Changes apply instantly across all UI elements
- Saved automatically for next session

### Menu Keybind
Access **Settings** → **Menu Keybind** and click the input field. Press any key:
- Default: Backslash (`\`)
- Press ESC while editing to cancel changes
- Updated hint text shows on startup

### Counter Positions
Each draggable counter remembers its last position:
- Counters snap within screen boundaries
- Positions save after 2 seconds of inactivity
- Reset by deleting browser storage (Settings → Clear Data)

---

## 🔔 Toast Notifications

Waddle shows context-aware notifications for:
- Feature toggled on/off
- Color theme changed
- Startup hint reminder

Notifications appear in the bottom-right corner and auto-dismiss after 3 seconds.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `\` (default) | Toggle menu open/closed |
| `ESC` | Close menu (when open) |
| Any key | Set custom menu keybind (in Settings) |

---

## 💾 Data & Storage

Waddle saves the following to your browser's localStorage:
- Feature enable/disable states
- Counter positions
- Custom color preference
- Menu keybind
- Session count

All data is stored locally and never sent to external servers.

---

## 🐛 Troubleshooting

### Script not showing up?
- Verify your userscript manager is enabled
- Try refreshing the miniblox.io page
- Check that you're on the exact URL: `https://miniblox.io/`

### Counters not visible?
- Check if the feature is enabled in the Features tab
- Try moving counters by dragging them (they may be off-screen)
- Reset positions by clearing your browser's localStorage for miniblox.io

### Toast notifications not appearing?
- Ensure you're not blocking notifications in your browser
- Check z-index settings haven't been overridden by other scripts

### Performance issues?
- Disable FPS counter if you have 200+ FPS (causes minor overhead)
- Disable Anti-AFK if not needed
- Close the menu when not in use

---

## 📊 Performance

Waddle is optimized for minimal performance impact:
- Efficient event listener management
- Debounced save operations (2-second delay)
- Throttled drag operations (32ms intervals)
- Automatic resource cleanup on page unload
- No external dependencies or CDN calls

**Memory Usage**: < 2MB
**CPU Impact**: Negligible (< 0.1% when idle)

---

## 🤝 Credits

**Original Creator**: [@Scripter132132](https://github.com/Scripter132132)

**Enhanced By**: [@TheM1ddleM1n](https://github.com/TheM1ddleM1n)

---

## 📝 Changelog

### v4.2 (Current)
- ✨ Removed splash screen for instant loading
- 🔔 Added toast notifications for all actions
- 🎨 Enhanced UI visibility in menu
- ⚡ Improved performance and cleanup

### v4.1
- Premium splash screen animation
- Dynamic splash messages
- Enhanced visual effects

### v4.0
- Major UI overhaul
- GitHub integration for feedback
- Version numbering system

### v3.6 and Earlier
- Core feature implementation
- Performance monitoring
- Settings persistence

---

## 📄 License

MIT License - Free to use, modify, and distribute

**Made with 🐧 by the Waddle community**

---

## 🐦 Need Help?

- **Report a Bug**: Open an issue on the [GitHub repository](https://github.com/TheM1ddleM1n/NovaCoreX/issues)
- **Suggest Features**: Use the "Suggest Enhancement" button in the About tab
- **Join the Community**: Check out discussions in the GitHub repo

---

**Waddle v4.2** - Performance monitoring made simple. 🐧✨
