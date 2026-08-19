import { useEffect, useState } from 'react'
import { THEME_KEY } from './config/theme.js'
import { PROFILE } from './config/profile.js'
import { SITE, SOCIALS, COURSE, MENU } from './config/links.js'

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || 'light',
  )
  const [toast, setToast] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 130)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setToast(next === 'dark' ? 'Mode Gelap Diaktifkan' : 'Mode Terang Diaktifkan')
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast('Link profil berhasil disalin!')
    } catch {
      setToast('Gagal menyalin link')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `${PROFILE.name} - ${SITE.shareTitle}`,
      text: `${SITE.shareText} ${PROFILE.name}`,
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // dibatalkan user, abaikan
      }
    } else {
      copyToClipboard(window.location.href)
    }
  }

  return (
    <div className="container">
      <header className="top-header">
        <div className="top-actions">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Ganti Mode Warna"
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button
            className="icon-btn"
            onClick={handleShare}
            aria-label="Bagikan Profil"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      <div className={`top-capsule${scrolled ? ' show' : ''}`}>
        <div className="capsule-avatar">
          <img src={PROFILE.avatar} alt={PROFILE.name} />
        </div>
        <div className="capsule-text">
          <div className="capsule-name">{PROFILE.name}</div>
          <div className="capsule-handle">{PROFILE.handle}</div>
        </div>
      </div>

      <section className={`hero${scrolled ? ' collapsed' : ''}`}>
        <div className="cover">
          <img src={PROFILE.cover} alt="" className="cover-img" />
          <div className="cover-overlay" />
        </div>
        <div className="avatar-ring">
          <img src={PROFILE.avatar} alt={PROFILE.name} className="avatar-img" />
          <div className="verified-badge">
            <span className="material-symbols-outlined">check</span>
          </div>
        </div>
        <h2 className="profile-name">{PROFILE.name}</h2>
        <span className="profile-handle">{PROFILE.handle}</span>
        <p className="profile-bio">{PROFILE.bio}</p>
      </section>

      <a className="course-card" href={COURSE.href}>
        <div className="course-icon-box">
          <COURSE.icon />
        </div>
        <div className="course-text">
          <div className="course-title">{COURSE.title}</div>
          <div className="course-desc">{COURSE.desc}</div>
        </div>
        <div className="course-arrow">
          <span className="material-symbols-outlined">arrow_forward</span>
        </div>
      </a>

      <nav className="menu">
        {MENU.map((row) => (
          <a key={row.label} className="menu-row" href={row.href}>
            <div className="menu-icon-box">
              {typeof row.icon === 'string' ? (
                <span className="material-symbols-outlined">{row.icon}</span>
              ) : (
                <row.icon />
              )}
            </div>
            <span className="menu-label">{row.label}</span>
            <div className="menu-chevron">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </a>
        ))}
      </nav>

      <div className="social-card">
        <div className="social-row">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              <social.icon />
            </a>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p className="footer-copy">
          &copy; 2026 {PROFILE.name}. {SITE.footerRights}
        </p>
      </footer>

      <nav className="bottom-dock">
        <a className="dock-tab active" href="#">
          <span className="material-symbols-outlined">home</span>
          Home
        </a>
        <a className="dock-tab" href="profile.html">
          <span className="material-symbols-outlined">person</span>
          Data Diri
        </a>
      </nav>

      <div className={`toast${toast ? ' show' : ''}`}>
        <span className="material-symbols-outlined">check_circle</span>
        {toast}
      </div>
    </div>
  )
}

export default App