import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { PROFILE } from '../../config/profile.js'
import { MENU, SOCIALS } from '../../config/links.js'
import './fluid.css'

// Subkomponen kartu dengan spotlight cursor dan tilt 3D
function FluidLinkCard({ item, index }) {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const isExternal = item.href?.startsWith('http')

  // Local motion value untuk spotlight di dalam kartu
  const localX = useMotionValue(0)
  const localY = useMotionValue(0)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    localX.set(e.clientX - rect.left)
    localY.set(e.clientY - rect.top)
  }

  return (
    <motion.a
      ref={cardRef}
      href={item.href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="fluid-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Dynamic Cursor Spotlight Border */}
      <motion.div
        className="fluid-card-spotlight"
        style={{
          opacity: hovered ? 1 : 0,
          background: useTransform(
            [localX, localY],
            ([x, y]) =>
              `radial-gradient(280px circle at ${x}px ${y}px, rgba(147, 51, 234, 0.45), rgba(6, 182, 212, 0.25), transparent 80%)`
          ),
        }}
      />

      <div className="fluid-card-inner">
        <div className="fluid-card-icon-wrap">
          <span className="fluid-card-num">{(index + 1).toString().padStart(2, '0')}</span>
        </div>
        <div className="fluid-card-content">
          <div className="fluid-card-header">
            <span className="fluid-card-title">{item.label}</span>
            {item.badge && <span className="fluid-card-badge">{item.badge}</span>}
          </div>
          {item.desc && <p className="fluid-card-desc">{item.desc}</p>}
        </div>
        <div className="fluid-card-arrow-wrap">
          <span className="fluid-card-arrow">↗</span>
        </div>
      </div>
    </motion.a>
  )
}

export default function FluidProfilePage() {
  const [copied, setCopied] = useState(false)
  const [isPointerDevice, setIsPointerDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(hover: hover) and (pointer: fine)').matches
    }
    return false
  })
  const [cursorHovered, setCursorHovered] = useState(false)

  // Cursor coordinates
  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)

  // Spring physics untuk fluid aura / blob yang mengikuti kursor
  const springConfig = { damping: 28, stiffness: 220, mass: 0.6 }
  const auraX = useSpring(mouseX, springConfig)
  const auraY = useSpring(mouseY, springConfig)

  // Secondary delayed spring untuk trail lembut lapis kedua
  const trailConfig = { damping: 38, stiffness: 140, mass: 1 }
  const trailX = useSpring(mouseX, trailConfig)
  const trailY = useSpring(mouseY, trailConfig)

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onMediaChange = (e) => setIsPointerDevice(e.matches)
    media.addEventListener('change', onMediaChange)

    const handlePointerMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => {
      media.removeEventListener('change', onMediaChange)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [mouseX, mouseY])

  // Ambil kontak WhatsApp untuk direct order
  const waContact = SOCIALS.find(
    (c) => c.label?.toLowerCase().includes('whatsapp') || c.href?.includes('wa.me')
  )
  const waUrl = waContact?.href || 'https://wa.me/6281234567890'
  const orderMessage = encodeURIComponent(
    'Halo, saya tertarik membeli/memesan template profil Fluid Motion & Interactive Aura!'
  )
  const waOrderUrl = `${waUrl}${waUrl.includes('?') ? '&' : '?'}text=${orderMessage}`

  // Filter menu demo sendiri
  const filteredMenu = MENU.filter((item) => item.href !== '#/fluid')

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="fluid-wrapper">
      {/* Background Interactive Aura Follower (Desktop Pointer) */}
      {isPointerDevice && (
        <>
          {/* Primary Sharp Glowing Dot */}
          <motion.div
            className="fluid-cursor-dot"
            style={{
              x: mouseX,
              y: mouseY,
              scale: cursorHovered ? 2.2 : 1,
            }}
          />

          {/* Secondary Fluid Aura / Mesh Orbs */}
          <motion.div
            className="fluid-cursor-aura"
            style={{
              x: auraX,
              y: auraY,
            }}
          />

          {/* Third Soft Ambient Color Bleed */}
          <motion.div
            className="fluid-cursor-trail"
            style={{
              x: trailX,
              y: trailY,
            }}
          />
        </>
      )}

      {/* Floating Ambient Mesh for Mobile / Fallback */}
      <div className="fluid-ambient-mesh">
        <div className="fluid-ambient-orb orb-1" />
        <div className="fluid-ambient-orb orb-2" />
        <div className="fluid-ambient-orb orb-3" />
      </div>

      {/* Subtle Grain Overlay for Organic Texture */}
      <div className="fluid-noise-overlay" />

      {/* Top Navbar Header */}
      <header className="fluid-topbar">
        <a
          href="#/"
          className="fluid-nav-btn fluid-btn-back"
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
        >
          <span className="fluid-arrow">←</span>
          <span>Beranda</span>
        </a>

        <div className="fluid-topbar-actions">
          <button
            type="button"
            className="fluid-nav-btn fluid-btn-share"
            onClick={handleShare}
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            {copied ? 'Tersalin ✓' : 'Bagikan'}
          </button>
          <a
            href={waOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fluid-nav-btn fluid-btn-cta"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <span>Beli Template</span>
            <span className="fluid-badge-pulse" />
          </a>
        </div>
      </header>

      <main className="fluid-container">
        {/* Profile Hero Section */}
        <motion.section
          className="fluid-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Glowing Avatar Ring */}
          <div className="fluid-avatar-outer">
            <motion.div
              className="fluid-avatar-glow"
              animate={{
                rotate: 360,
                scale: [1, 1.08, 1],
              }}
              transition={{
                rotate: { duration: 18, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
            <div className="fluid-avatar-inner">
              <img src={PROFILE.avatar} alt={PROFILE.name} className="fluid-avatar-img" />
            </div>
          </div>

          <motion.div
            className="fluid-badge-live"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="fluid-live-dot" />
            <span>Interactive Motion Edition</span>
          </motion.div>

          <h1 className="fluid-title">
            <span className="fluid-gradient-text">{PROFILE.name}</span>
          </h1>

          <p className="fluid-role">{PROFILE.role || PROFILE.handle}</p>

          <p className="fluid-bio">{PROFILE.bio}</p>

          {/* Dynamic Interactive Stats / Quick Chips */}
          <div className="fluid-chips-row">
            <div className="fluid-chip">
              <span className="fluid-chip-icon">⚡</span>
              <span>120 FPS Fluid Animations</span>
            </div>
            <div className="fluid-chip">
              <span className="fluid-chip-icon">🎨</span>
              <span>Spring Physics Mesh</span>
            </div>
            <div className="fluid-chip">
              <span className="fluid-chip-icon">💎</span>
              <span>React 19 + Framer</span>
            </div>
          </div>
        </motion.section>

        {/* Links Directory Section */}
        <section className="fluid-section">
          <div className="fluid-section-header">
            <h2 className="fluid-section-heading">Tautan & Portofolio</h2>
            <span className="fluid-section-pill">Hover atau sentuh untuk efek interaktif</span>
          </div>

          <div className="fluid-cards-list">
            {filteredMenu.map((item, index) => (
              <FluidLinkCard
                key={item.label || item.href}
                item={item}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Social Networks Cards */}
        <section className="fluid-section">
          <div className="fluid-section-header">
            <h2 className="fluid-section-heading">Koneksi Sosial</h2>
          </div>

          <div className="fluid-social-grid">
            {SOCIALS.map((soc) => (
              <motion.a
                key={soc.label}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="fluid-social-card"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="fluid-social-label">{soc.label}</span>
                <span className="fluid-social-arrow">↗</span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Commercial Box */}
        <motion.section
          className="fluid-commercial"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="fluid-commercial-glow" />
          <div className="fluid-commercial-inner">
            <div className="fluid-commercial-tag">TEMPLATES FOR SALE</div>
            <h3 className="fluid-commercial-title">
              Buat Profil Anda Hidup dengan Animasi Kursor Interaktif
            </h3>
            <p className="fluid-commercial-desc">
              Source code siap pakai dengan arsitektur React 19 + Framer Motion. Sangat mudah
              dikustomisasi melalui satu file konfigurasi, ringan, dan siap deploy ke Vercel,
              Netlify, atau GitHub Pages.
            </p>

            <div className="fluid-commercial-buttons">
              <a
                href={waOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fluid-btn-glow"
              >
                <span>Dapatkan Template Sekarang</span>
                <span>→</span>
              </a>
              <a href="#/" className="fluid-btn-secondary">
                Lihat Desain Lainnya
              </a>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="fluid-footer">
          <p>© {new Date().getFullYear()} {PROFILE.name} — Interactive Fluid Experience.</p>
        </footer>
      </main>
    </div>
  )
}
