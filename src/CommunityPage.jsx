import { useEffect, useState } from 'react'
import { COMMUNITY, WHATSAPP_GROUP } from './config/links.js'

function CommunityPage() {
  const [gate, setGate] = useState(null)

  useEffect(() => {
    if (!gate) return
    const onKey = (e) => {
      if (e.key === 'Escape') setGate(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [gate])

  const activeGate = gate
    ? COMMUNITY.items.find((item) => item.id === gate)
    : null

  return (
    <div className="container">
      <header className="top-header">
        <a className="icon-btn" href="#/" aria-label="Kembali">
          <span className="material-symbols-outlined">arrow_back</span>
        </a>
      </header>

      <section className="community-hero">
        <div className="community-hero-icon">
          <span className="material-symbols-outlined">forum</span>
        </div>
        <h1 className="community-hero-title">{COMMUNITY.title}</h1>
        <p className="community-hero-subtitle">{COMMUNITY.subtitle}</p>
      </section>

      <nav className="menu">
        {COMMUNITY.items.map((item) => {
          const Icon = item.icon
          const content = (
            <>
              <div className="menu-icon-box">
                <Icon />
              </div>
              <span className="menu-label">{item.label}</span>
              <div className="menu-chevron">
                <span className="material-symbols-outlined">
                  {item.action === 'open' ? 'open_in_new' : 'chevron_right'}
                </span>
              </div>
            </>
          )

          if (item.action === 'open') {
            return (
              <a
                key={item.id}
                className="menu-row"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              className="menu-row menu-row-button"
              onClick={() => setGate(item.id)}
            >
              {content}
            </button>
          )
        })}
      </nav>

      <footer className="footer">
        <p className="footer-copy">
          &copy; 2026 Muhammad Rizqi Nurrahman. All rights reserved.
        </p>
      </footer>

      {activeGate && (
        <div className="gate-backdrop" onClick={() => setGate(null)}>
          <div
            className="gate-card"
            role="dialog"
            aria-modal="true"
            aria-label={activeGate.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gate-close"
              onClick={() => setGate(null)}
              aria-label="Tutup"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="gate-icon">
              <activeGate.icon />
            </div>

            <h3 className="gate-title">{activeGate.title}</h3>
            <p className="gate-text">{activeGate.message}</p>
            <p className="gate-hint">Join Grup WhatsApp dulu ya.</p>

            <div className="gate-actions">
              <a
                className="gate-btn gate-btn-primary"
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setGate(null)}
              >
                <activeGate.icon />
                Join Grup WhatsApp
              </a>
              <button
                type="button"
                className="gate-btn gate-btn-ghost"
                onClick={() => setGate(null)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityPage
