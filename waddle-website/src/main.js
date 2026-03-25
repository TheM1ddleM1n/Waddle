import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="stars"></div>
  <div class="twinkling"></div>

  <nav class="navbar">
    <div class="nav-content">
      <div class="nav-logo">
        <img src="/penguin.png" alt="Waddle" class="logo-img" />
        <span class="logo-text">Waddle</span>
      </div>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#install">Install</a>
        <a href="https://github.com/TheM1ddleM1n/Waddle" target="_blank" rel="noopener">GitHub</a>
        <a href="https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=bug" target="_blank" rel="noopener">Report Bug</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-content">
      <div class="hero-badge">v6.2 • Latest Release</div>
      <h1 class="hero-title">
        The Ultimate<br/>
        <span class="gradient-text">Miniblox</span> Client
      </h1>
      <p class="hero-description">
        Enhance your Miniblox experience with custom skins, performance monitoring,<br/>
        target HUD, and dozens of game-changing features.
      </p>
      <div class="hero-buttons">
        <a href="#install" class="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Install Now
        </a>
        <a href="#features" class="btn btn-secondary">
          Explore Features
        </a>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <div class="stat-value">15+</div>
          <div class="stat-label">Features</div>
        </div>
        <div class="stat">
          <div class="stat-value">MIT</div>
          <div class="stat-label">Open Source</div>
        </div>
        <div class="stat">
          <div class="stat-value">v6.2</div>
          <div class="stat-label">Latest Version</div>
        </div>
      </div>
    </div>
    <div class="hero-image">
      <div class="feature-preview">
        <div class="preview-window">
          <div class="window-header">
            <div class="window-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="window-title">Miniblox Enhanced</div>
          </div>
          <div class="window-content">
            <div class="crosshair"></div>
            <div class="hud-element coords">X: 128 Y: 64 Z: -256</div>
            <div class="hud-element fps">FPS: 60 | Ping: 23ms</div>
            <div class="hud-element clock">14:32:18</div>
            <div class="target-display">
              <div class="target-name">Player123</div>
              <div class="target-health">
                <div class="health-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="features" class="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Powerful Features</h2>
        <p class="section-subtitle">Everything you need to dominate Miniblox</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3 class="feature-title">Precision Crosshair</h3>
          <p class="feature-desc">Cyan crosshair with auto-hide in menus for perfect aim</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">👁️</div>
          <h3 class="feature-title">Target HUD</h3>
          <p class="feature-desc">See player faces, mob names, and block info at a glance</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🌌</div>
          <h3 class="feature-title">Space Sky</h3>
          <p class="feature-desc">Beautiful MilkyWay cubemap replaces default sky</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">FPS & Ping Monitor</h3>
          <p class="feature-desc">Color-coded performance counter for optimal gameplay</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📍</div>
          <h3 class="feature-title">Live Coordinates</h3>
          <p class="feature-desc">Real-time X Y Z tracking with 10 updates per second</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⌨️</div>
          <h3 class="feature-title">Key Display</h3>
          <p class="feature-desc">WASD + mouse buttons light up on press</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">Custom Skins</h3>
          <p class="feature-desc">Equip any skin directly from the UI</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🐧</div>
          <h3 class="feature-title">Anti-AFK</h3>
          <p class="feature-desc">Auto-jumps every 5s when in-game</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🚫</div>
          <h3 class="feature-title">Block Party RQ</h3>
          <p class="feature-desc">Silently drops incoming party invites</p>
        </div>
      </div>
    </div>
  </section>

  <section id="install" class="install">
    <div class="container">
      <div class="install-card">
        <div class="install-header">
          <h2 class="install-title">Ready to Upgrade?</h2>
          <p class="install-subtitle">Get started in under 30 seconds</p>
        </div>

        <div class="install-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Install Tampermonkey</h3>
              <p>Download and install the Tampermonkey browser extension</p>
              <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener" class="step-link">
                Get Tampermonkey →
              </a>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Install Waddle</h3>
              <p>Click the install button to add Waddle to Tampermonkey</p>
              <a href="https://github.com/TheM1ddleM1n/Waddle/raw/main/Waddle.js" target="_blank" rel="noopener" class="step-link">
                Install Waddle →
              </a>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Launch Miniblox</h3>
              <p>Open Miniblox, press \\ to open the menu, and start playing!</p>
            </div>
          </div>
        </div>

        <div class="install-note">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p>The custom skin feature reads your Miniblox session token. Only use if you trust this project.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="comparison">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Why Choose Waddle?</h2>
        <p class="section-subtitle">See how we stack up against the competition</p>
      </div>

      <div class="comparison-table">
        <div class="comparison-header">
          <div class="comparison-feature">Feature</div>
          <div class="comparison-client">Waddle</div>
          <div class="comparison-client">Other Clients</div>
        </div>

        <div class="comparison-row">
          <div class="comparison-feature">Custom Skins</div>
          <div class="comparison-client">✓</div>
          <div class="comparison-client">Limited</div>
        </div>

        <div class="comparison-row">
          <div class="comparison-feature">Target HUD</div>
          <div class="comparison-client">✓</div>
          <div class="comparison-client">✗</div>
        </div>

        <div class="comparison-row">
          <div class="comparison-feature">Space Sky</div>
          <div class="comparison-client">✓</div>
          <div class="comparison-client">✗</div>
        </div>

        <div class="comparison-row">
          <div class="comparison-feature">Draggable Widgets</div>
          <div class="comparison-client">✓</div>
          <div class="comparison-client">✗</div>
        </div>

        <div class="comparison-row">
          <div class="comparison-feature">Active Development</div>
          <div class="comparison-client">✓</div>
          <div class="comparison-client">Variable</div>
        </div>

        <div class="comparison-row">
          <div class="comparison-feature">Open Source</div>
          <div class="comparison-client">✓ MIT</div>
          <div class="comparison-client">Variable</div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <img src="/penguin.png" alt="Waddle" class="footer-logo" />
          <p class="footer-tagline">Made with code by the Waddle Team</p>
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <h4>Resources</h4>
            <a href="https://github.com/TheM1ddleM1n/Waddle#readme" target="_blank" rel="noopener">Documentation</a>
            <a href="https://github.com/TheM1ddleM1n/Waddle/raw/main/Waddle.js" target="_blank" rel="noopener">Install</a>
            <a href="https://github.com/TheM1ddleM1n/Waddle/blob/main/README.md#-changelog" target="_blank" rel="noopener">Changelog</a>
          </div>

          <div class="footer-column">
            <h4>Community</h4>
            <a href="https://github.com/TheM1ddleM1n/Waddle" target="_blank" rel="noopener">GitHub</a>
            <a href="https://github.com/TheM1ddleM1n/Waddle/issues" target="_blank" rel="noopener">Issues</a>
            <a href="https://github.com/TheM1ddleM1n/Waddle/issues/new?labels=enhancement" target="_blank" rel="noopener">Feature Requests</a>
          </div>

          <div class="footer-column">
            <h4>Credits</h4>
            <a href="https://github.com/Scripter132132" target="_blank" rel="noopener">@Scripter132132</a>
            <a href="https://github.com/TheM1ddleM1n" target="_blank" rel="noopener">@TheM1ddleM1n</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>MIT License © 2026 Waddle Team</p>
      </div>
    </div>
  </footer>
`

const createStars = () => {
  const starsContainer = document.querySelector('.stars')
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = Math.random() * 100 + '%'
    star.style.top = Math.random() * 100 + '%'
    star.style.animationDelay = Math.random() * 3 + 's'
    starsContainer.appendChild(star)
  }
}

createStars()

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})

let lastScroll = 0
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar')
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }

  lastScroll = currentScroll
})
