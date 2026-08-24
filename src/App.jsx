import { useEffect, useState } from 'react'
import { THEME_KEY } from './config/theme.js'
import { PROFILE } from './config/profile.js'
import { SITE, SOCIALS, COURSE, MENU } from './config/links.js'
import CvPage from './CvPage.jsx'
import PortfolioPage from './PortfolioPage.jsx'

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || 'light',
  )
  const [toast, setToast] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [viewer, setViewer] = useState(null)
  const [route, setRoute] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash)
      setViewer(null)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

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

  useEffect(() => {
    if (!viewer) return
    const onKey = (e) => {
      if (e.key === 'Escape') setViewer(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [viewer])

  const playDarkSound = () => {
    const audio = new Audio('sounds/faaah.mp3')
    audio.volume = 0.7
    audio.play().catch(() => {})
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'dark') playDarkSound()
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

  if (route === '#/cv') {
    return <CvPage />
  }

  if (route === '#/portfolio') {
    return <PortfolioPage />
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
        <button className="cover" onClick={() => setViewer(PROFILE.cover)}>
          <img src={PROFILE.cover} alt="" className="cover-img" />
          <div className="cover-overlay" />
        </button>
        <button
          className="avatar-ring"
          onClick={() => setViewer(PROFILE.avatar)}
        >
          <img src={PROFILE.avatar} alt={PROFILE.name} className="avatar-img" />
          <div className="verified-badge">
            <span className="material-symbols-outlined">check</span>
          </div>
        </button>
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

      <div className={`toast${toast ? ' show' : ''}`}>
        <span className="material-symbols-outlined">check_circle</span>
        {toast}
      </div>

      {viewer && (
        <div className="photo-viewer" onClick={() => setViewer(null)}>
          <button
            className="viewer-close"
            onClick={() => setViewer(null)}
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <img
            src={viewer}
            alt=""
            className="viewer-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default App