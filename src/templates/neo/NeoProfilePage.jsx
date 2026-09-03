import { useState } from 'react'
import { PROFILE } from '../../config/profile.js'
import { SOCIALS, COURSE, MENU } from '../../config/links.js'
import { FaShareAlt, FaCheck, FaCopy, FaShoppingCart, FaArrowLeft } from 'react-icons/fa'
import './neo.css'

export default function NeoProfilePage() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback jika clipboard diblokir
    }
  }

  // Filter menu agar tidak menampilkan link ke halaman ini sendiri
  const filteredMenu = MENU.filter((item) => item.href !== '#/neo')

  return (
    <div className="neo-wrapper">
      {/* Top sticky banner untuk jualan template */}
      <header className="neo-topbar">
        <a href="#/" className="neo-btn neo-btn-sm neo-btn-back">
          <FaArrowLeft />
          <span>Beranda</span>
        </a>
        <div className="neo-topbar-actions">
          <button
            type="button"
            className="neo-btn neo-btn-sm neo-btn-share"
            onClick={handleCopyLink}
            aria-label="Salin tautan"
          >
            {copied ? <FaCheck /> : <FaShareAlt />}
            <span>{copied ? 'Tersalin!' : 'Share'}</span>
          </button>
          <a
            href="https://wa.me/?text=Halo,%20saya%20tertarik%20beli%20source%20code%20template%20Neo-Brutalism%20Profile"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn neo-btn-sm neo-btn-accent"
          >
            <FaShoppingCart />
            <span>Beli Template</span>
          </a>
        </div>
      </header>

      <main className="neo-container">
        {/* Profile Card */}
        <section className="neo-card neo-hero-card">
          <div className="neo-badge-status">
            <span className="neo-status-dot" />
            <span>AVAILABLE FOR HIRE</span>
          </div>

          <div className="neo-avatar-wrapper">
            <img src={PROFILE.avatar} alt={PROFILE.name} className="neo-avatar" />
            <div className="neo-avatar-tag">PRO</div>
          </div>

          <h1 className="neo-title">{PROFILE.name}</h1>
          <p className="neo-handle">{PROFILE.handle}</p>
          <p className="neo-bio">{PROFILE.bio}</p>

          <div className="neo-social-strip">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-social-btn"
                aria-label={social.label}
              >
                <social.icon />
              </a>
            ))}
          </div>
        </section>

        {/* Featured Card / Course */}
        {COURSE && (
          <section className="neo-card neo-featured-card">
            <div className="neo-tag">FEATURED PROJECT</div>
            <div className="neo-featured-content">
              <div className="neo-featured-icon">
                <COURSE.icon />
              </div>
              <div className="neo-featured-text">
                <h2 className="neo-featured-title">{COURSE.title}</h2>
                <p className="neo-featured-desc">{COURSE.desc}</p>
              </div>
            </div>
            <a
              href={COURSE.href}
              className="neo-btn neo-btn-block neo-btn-primary"
            >
              Lihat Program &rarr;
            </a>
          </section>
        )}

        {/* Links Bento / Grid */}
        <section className="neo-links-section">
          <h2 className="neo-section-heading">EXPLORE LINKS</h2>
          <div className="neo-links-grid">
            {filteredMenu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="neo-link-card"
              >
                <div className="neo-link-icon-box">
                  {typeof item.icon === 'string' ? (
                    <span className="material-symbols-outlined">{item.icon}</span>
                  ) : (
                    <item.icon />
                  )}
                </div>
                <span className="neo-link-label">{item.label}</span>
                <span className="neo-link-arrow">&nearr;</span>
              </a>
            ))}
          </div>
        </section>

        {/* Buy Source Code Promo Card */}
        <section className="neo-card neo-promo-card">
          <div className="neo-promo-badge">COMMERCIAL LICENSE</div>
          <h2 className="neo-promo-title">Suka Desain Ini?</h2>
          <p className="neo-promo-desc">
            Dapatkan source code lengkap React + Vite template <strong>Neo-Brutalism Profile</strong> ini. Siap deploy ke GitHub Pages / Vercel dengan konfigurasi mudah.
          </p>
          <div className="neo-promo-actions">
            <a
              href="https://wa.me/?text=Halo,%20saya%20mau%20order%20source%20code%20template%20Neo-Brutalism%20Profile"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-btn-lg neo-btn-buy"
            >
              <FaShoppingCart />
              <span>Dapatkan Source Code</span>
            </a>
            <button
              type="button"
              className="neo-btn neo-btn-lg neo-btn-secondary"
              onClick={handleCopyLink}
            >
              <FaCopy />
              <span>{copied ? 'Tautan Disalin!' : 'Bagikan Demo'}</span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="neo-footer">
          <p>
            &copy; {new Date().getFullYear()} {PROFILE.name}. Built with Neo-Brutalism Style.
          </p>
        </footer>
      </main>
    </div>
  )
}
