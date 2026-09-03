import { useState } from 'react'
import { PROFILE } from './config/profile.js'
import { SOCIALS, COURSE, MENU } from './config/links.js'
import { FaShareAlt, FaCheck, FaCopy, FaShoppingCart, FaArrowLeft, FaTerminal } from 'react-icons/fa'

export default function CyberProfilePage() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  // Filter rute agar tidak melink ke halaman ini sendiri
  const filteredMenu = MENU.filter((item) => item.href !== '#/cyber')

  return (
    <div className="cyber-wrapper">
      {/* Background Neon Mesh Orbs */}
      <div className="cyber-glow-orb cyber-orb-top-left" />
      <div className="cyber-glow-orb cyber-orb-top-right" />
      <div className="cyber-glow-orb cyber-orb-bottom" />

      {/* Top Glass Header */}
      <header className="cyber-topbar">
        <a href="#/" className="cyber-glass-btn cyber-btn-sm">
          <FaArrowLeft />
          <span>Beranda</span>
        </a>
        <div className="cyber-topbar-actions">
          <button
            type="button"
            className="cyber-glass-btn cyber-btn-sm"
            onClick={handleCopyLink}
            aria-label="Salin tautan"
          >
            {copied ? <FaCheck className="cyber-text-cyan" /> : <FaShareAlt />}
            <span>{copied ? 'Tersalin!' : 'Share'}</span>
          </button>
          <a
            href="https://wa.me/?text=Halo,%20saya%20tertarik%20beli%20source%20code%20template%20Cyber%20Glassmorphism%20Profile"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-neon-btn cyber-btn-sm"
          >
            <FaShoppingCart />
            <span>Beli Template</span>
          </a>
        </div>
      </header>

      <main className="cyber-container">
        {/* Profile Card */}
        <section className="cyber-card cyber-hero-card">
          <div className="cyber-status-chip">
            <span className="cyber-pulse-dot" />
            <span className="cyber-mono-text">SYSTEM ONLINE // NODE READY</span>
          </div>

          <div className="cyber-avatar-ring">
            <img src={PROFILE.avatar} alt={PROFILE.name} className="cyber-avatar-img" />
            <div className="cyber-avatar-badge">
              <FaTerminal />
            </div>
          </div>

          <h1 className="cyber-name">{PROFILE.name}</h1>
          <div className="cyber-handle-badge">
            <span>{PROFILE.handle}</span>
          </div>
          <p className="cyber-bio">{PROFILE.bio}</p>

          <div className="cyber-social-row">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-social-icon"
                aria-label={social.label}
              >
                <social.icon />
              </a>
            ))}
          </div>
        </section>

        {/* Featured Card / Course */}
        {COURSE && (
          <section className="cyber-card cyber-featured-card">
            <div className="cyber-card-header">
              <span className="cyber-tag-neon">FEATURED PROTOCOL</span>
              <span className="cyber-mono-sub">#001</span>
            </div>
            <div className="cyber-featured-body">
              <div className="cyber-featured-icon-box">
                <COURSE.icon />
              </div>
              <div className="cyber-featured-info">
                <h2 className="cyber-featured-title">{COURSE.title}</h2>
                <p className="cyber-featured-desc">{COURSE.desc}</p>
              </div>
            </div>
            <a
              href={COURSE.href}
              className="cyber-action-btn"
            >
              <span>Akses Materi</span>
              <span className="cyber-arrow">&rarr;</span>
            </a>
          </section>
        )}

        {/* Menu Links List */}
        <section className="cyber-links-section">
          <div className="cyber-section-label">
            <span className="cyber-mono-accent">//</span> DIRECTORY ACCESS
          </div>
          <div className="cyber-links-list">
            {filteredMenu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="cyber-link-item"
              >
                <div className="cyber-link-icon">
                  {typeof item.icon === 'string' ? (
                    <span className="material-symbols-outlined">{item.icon}</span>
                  ) : (
                    <item.icon />
                  )}
                </div>
                <span className="cyber-link-text">{item.label}</span>
                <span className="cyber-link-chevron">&rarr;</span>
              </a>
            ))}
          </div>
        </section>

        {/* Commercial Promotion Banner */}
        <section className="cyber-card cyber-promo-card">
          <div className="cyber-promo-tag">COMMERCIAL TEMPLATE</div>
          <h2 className="cyber-promo-title">Butuh Tampilan Futuristik Ini?</h2>
          <p className="cyber-promo-desc">
            Dapatkan full source code <strong>Cyber Glassmorphism Profile</strong> (React 19 + Vite + Framer Motion). Tinggal edit 1 file config untuk identitasmu, langsung siap hosting gratis di GitHub Pages / Vercel.
          </p>
          <div className="cyber-promo-btns">
            <a
              href="https://wa.me/?text=Halo,%20saya%20mau%20order%20source%20code%20template%20Cyber%20Glassmorphism%20Profile"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-neon-btn cyber-btn-lg"
            >
              <FaShoppingCart />
              <span>Dapatkan Source Code</span>
            </a>
            <button
              type="button"
              className="cyber-glass-btn cyber-btn-lg"
              onClick={handleCopyLink}
            >
              <FaCopy />
              <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan Demo'}</span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="cyber-footer">
          <p className="cyber-mono-text">
            &copy; {new Date().getFullYear()} {PROFILE.name}. CYBERLINK PROTOCOL V3.0
          </p>
        </footer>
      </main>
    </div>
  )
}
