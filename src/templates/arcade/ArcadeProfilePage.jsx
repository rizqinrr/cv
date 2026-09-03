import { useState } from 'react'
import { PROFILE } from '../../config/profile.js'
import { MENU, SOCIALS } from '../../config/links.js'
import './arcade.css'

// Simple 8-Bit Web Audio Synthesizer (pure browser API, no external audio files)
class RetroAudioEngine {
  constructor() {
    this.ctx = null
    this.muted = false
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass) {
        this.ctx = new AudioContextClass()
      }
    }
  }

  playBlip(freq = 440, duration = 0.06, type = 'square') {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration)

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {
      // Audio failed or blocked
    }
  }

  playCoin() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(987.77, now) // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08) // E6

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.35)
    } catch {
      // Audio error
    }
  }
}

const audioEngine = new RetroAudioEngine()

export default function ArcadeProfilePage() {
  const [copied, setCopied] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [coins, setCoins] = useState(99)

  const filteredMenu = MENU.filter((item) => item.href !== '#/arcade')

  // Kontak WhatsApp untuk direct order template
  const waContact = SOCIALS.find(
    (c) => c.label?.toLowerCase().includes('whatsapp') || c.href?.includes('wa.me')
  )
  const waUrl = waContact?.href || 'https://wa.me/6281234567890'
  const orderMessage = encodeURIComponent(
    'Halo! Saya ingin membeli template profil 8-Bit Retro Arcade Console!'
  )
  const waOrderUrl = `${waUrl}${waUrl.includes('?') ? '&' : '?'}text=${orderMessage}`

  const toggleSound = () => {
    audioEngine.muted = soundEnabled
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) {
      audioEngine.playBlip(580, 0.08)
    }
  }

  const handleShare = () => {
    audioEngine.playCoin()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const handleInsertCoin = () => {
    audioEngine.playCoin()
    setCoins((c) => c + 1)
  }

  return (
    <div className="arcade-wrapper">
      <div className="arcade-crt-flicker" />

      <header className="arcade-topbar">
        <a
          href="#/"
          className="arcade-top-btn"
          onMouseEnter={() => audioEngine.playBlip(320)}
          onClick={() => audioEngine.playBlip(250)}
        >
          <span>◄ QUIT GAME</span>
        </a>
        <div className="arcade-topbar-right">
          <button
            type="button"
            className="arcade-top-btn"
            onClick={toggleSound}
            title="Toggle Sound"
          >
            {soundEnabled ? 'SFX: ON ♪' : 'SFX: OFF ✕'}
          </button>
          <button
            type="button"
            className="arcade-top-btn arcade-btn-share"
            onClick={handleShare}
            onMouseEnter={() => audioEngine.playBlip(400)}
          >
            {copied ? 'LINK COPIED!' : 'SHARE ⎘'}
          </button>
        </div>
      </header>

      <main className="arcade-container">
        {/* Retro Game Boy / Arcade Handheld Shell */}
        <div className="arcade-console">
          {/* Console Header Vent / Brand */}
          <div className="arcade-console-header">
            <div className="arcade-grooves">
              <span />
              <span />
              <span />
            </div>
            <div className="arcade-brand-title">
              <span className="arcade-brand-main">GAME PROFILE</span>
              <span className="arcade-brand-sub">COLOR MATRIX SYSTEM</span>
            </div>
          </div>

          {/* CRT Screen Display */}
          <div className="arcade-screen-bezel">
            <div className="arcade-bezel-top">
              <div className="arcade-battery-indicator">
                <span className="arcade-battery-led" />
                <span className="arcade-battery-text">BATTERY</span>
              </div>
              <span className="arcade-screen-label">DOT MATRIX WITH STEREO SOUND</span>
            </div>

            <div className="arcade-screen-glass">
              <div className="arcade-scanlines" />

              {/* Game HUD Header */}
              <div className="arcade-hud">
                <div className="arcade-hud-left">
                  <span>1P</span>
                  <span className="arcade-hud-val">LVL 99</span>
                </div>
                <div className="arcade-hud-mid">
                  <span className="arcade-blink-text">READY!</span>
                </div>
                <div className="arcade-hud-right">
                  <span>COIN</span>
                  <span className="arcade-hud-val">{coins}</span>
                </div>
              </div>

              {/* Hero Player Profile */}
              <section className="arcade-player-card">
                <div className="arcade-avatar-frame">
                  <img
                    src={PROFILE.avatar}
                    alt={PROFILE.name}
                    className="arcade-avatar-img"
                  />
                  <div className="arcade-avatar-badge">P1</div>
                </div>

                <div className="arcade-player-meta">
                  <h1 className="arcade-player-name">{PROFILE.name.toUpperCase()}</h1>
                  <p className="arcade-player-class">CLASS: {PROFILE.role || PROFILE.handle}</p>

                  <div className="arcade-stats-grid">
                    <div className="arcade-stat-row">
                      <span className="arcade-stat-label">HP</span>
                      <div className="arcade-stat-bar-outer">
                        <div className="arcade-stat-bar-fill hp" />
                      </div>
                      <span className="arcade-stat-num">999/999</span>
                    </div>
                    <div className="arcade-stat-row">
                      <span className="arcade-stat-label">MP</span>
                      <div className="arcade-stat-bar-outer">
                        <div className="arcade-stat-bar-fill mp" />
                      </div>
                      <span className="arcade-stat-num">750/750</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="arcade-divider-pixel">
                ════════════════════════════════════════
              </div>

              <p className="arcade-bio-text">
                &quot;{PROFILE.bio}&quot;
              </p>

              {/* Quest / Stage Select (Link Menu) */}
              <section className="arcade-quest-section">
                <div className="arcade-section-title">
                  <span>▼ SELECT STAGE (LINKS) ▼</span>
                </div>

                <div className="arcade-menu-list">
                  {filteredMenu.map((item, idx) => {
                    const isSelected = selectedIdx === idx
                    const isExternal = item.href?.startsWith('http')
                    return (
                      <a
                        key={item.label || item.href}
                        href={item.href}
                        target={isExternal ? '_blank' : '_self'}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className={`arcade-menu-item ${isSelected ? 'active' : ''}`}
                        onMouseEnter={() => {
                          setSelectedIdx(idx)
                          audioEngine.playBlip(480 + idx * 25, 0.05)
                        }}
                        onClick={() => audioEngine.playCoin()}
                      >
                        <span className="arcade-pointer">{isSelected ? '▶' : ' '}</span>
                        <span className="arcade-item-index">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span className="arcade-item-title">{item.label}</span>
                        {item.badge && (
                          <span className="arcade-item-badge">[{item.badge}]</span>
                        )}
                        <span className="arcade-item-go">GO►</span>
                      </a>
                    )
                  })}
                </div>
              </section>

              {/* Social Party Members */}
              <section className="arcade-social-section">
                <div className="arcade-section-title">
                  <span>▼ PARTY NETWORK ▼</span>
                </div>
                <div className="arcade-social-tags">
                  {SOCIALS.map((soc) => (
                    <a
                      key={soc.label}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="arcade-social-chip"
                      onMouseEnter={() => audioEngine.playBlip(620, 0.04)}
                      onClick={() => audioEngine.playCoin()}
                    >
                      <span className="arcade-chip-icon">◈</span>
                      <span>{soc.label}</span>
                    </a>
                  ))}
                </div>
              </section>

              {/* In-Game Secret Shop / Loot Box */}
              <section className="arcade-loot-box">
                <div className="arcade-loot-header">
                  <span className="arcade-loot-tag">★ SECRET SHOP ★</span>
                </div>
                <h3 className="arcade-loot-title">UNLOCK THIS ARCADE TEMPLATE!</h3>
                <p className="arcade-loot-desc">
                  Ingin profil portfolio retro 8-bit yang unik seperti ini? Source code bersih,
                  sound effects Web Audio bawaan, siap deploy & siap jual!
                </p>
                <div className="arcade-loot-actions">
                  <a
                    href={waOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arcade-btn-buy"
                    onClick={() => audioEngine.playCoin()}
                  >
                    <span>[ INSERT COIN TO BUY ]</span>
                  </a>
                </div>
              </section>

              <div className="arcade-screen-footer">
                <span>© {new Date().getFullYear()} {PROFILE.name} • PRESS START TO PLAY</span>
              </div>
            </div>
          </div>

          {/* Physical Console Controls (D-Pad & Action Buttons) */}
          <div className="arcade-console-controls">
            <div className="arcade-dpad-section">
              <div className="arcade-dpad">
                <button
                  type="button"
                  className="arcade-dpad-btn up"
                  onClick={() => {
                    audioEngine.playBlip(520)
                    setSelectedIdx((prev) => Math.max(0, prev - 1))
                  }}
                  aria-label="Up"
                >
                  ▲
                </button>
                <div className="arcade-dpad-row">
                  <button
                    type="button"
                    className="arcade-dpad-btn left"
                    onClick={() => audioEngine.playBlip(440)}
                    aria-label="Left"
                  >
                    ◀
                  </button>
                  <div className="arcade-dpad-center" />
                  <button
                    type="button"
                    className="arcade-dpad-btn right"
                    onClick={() => audioEngine.playBlip(460)}
                    aria-label="Right"
                  >
                    ▶
                  </button>
                </div>
                <button
                  type="button"
                  className="arcade-dpad-btn down"
                  onClick={() => {
                    audioEngine.playBlip(380)
                    setSelectedIdx((prev) => Math.min(filteredMenu.length - 1, prev + 1))
                  }}
                  aria-label="Down"
                >
                  ▼
                </button>
              </div>
            </div>

            <div className="arcade-action-buttons">
              <div className="arcade-btn-cluster">
                <div className="arcade-btn-slot">
                  <button
                    type="button"
                    className="arcade-round-btn btn-b"
                    onClick={() => audioEngine.playBlip(300, 0.1, 'sawtooth')}
                  >
                    B
                  </button>
                  <span className="arcade-btn-label">B</span>
                </div>
                <div className="arcade-btn-slot">
                  <button
                    type="button"
                    className="arcade-round-btn btn-a"
                    onClick={handleInsertCoin}
                  >
                    A
                  </button>
                  <span className="arcade-btn-label">A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Select & Start Pill Buttons */}
          <div className="arcade-select-start-wrap">
            <div className="arcade-pill-slot">
              <button
                type="button"
                className="arcade-pill-btn"
                onClick={() => {
                  audioEngine.playBlip(350)
                  handleShare()
                }}
              >
                SELECT
              </button>
              <span className="arcade-pill-label">SELECT (SHARE)</span>
            </div>
            <div className="arcade-pill-slot">
              <a
                href={waOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="arcade-pill-btn"
                onClick={() => audioEngine.playCoin()}
              >
                START
              </a>
              <span className="arcade-pill-label">START (BUY)</span>
            </div>
          </div>

          {/* Speaker Grille in Bottom Right */}
          <div className="arcade-speaker-grille">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </main>
    </div>
  )
}
