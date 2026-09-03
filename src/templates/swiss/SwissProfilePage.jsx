import { useState } from 'react'
import { PROFILE } from '../../config/profile.js'
import { MENU, SOCIALS } from '../../config/links.js'
import './swiss.css'

export default function SwissProfilePage() {
  const [accent, setAccent] = useState('red') // 'red' | 'blue' | 'black'
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const curatedIndex = [
    {
      num: '01',
      label: 'Curriculum Vitae',
      desc: 'Chronological Experience, Background & Education',
      href: '#/cv',
      tag: 'DOC / PDF',
    },
    {
      num: '02',
      label: 'Selected Works',
      desc: 'Curated Case Studies, Engineering Systems & UI',
      href: '#/portfolio',
      tag: 'CASE STUDY',
    },
    ...MENU.map((item, idx) => ({
      num: (idx + 3).toString().padStart(2, '0'),
      label: item.label,
      desc: 'Community Channel & Communication Frequency',
      href: item.href,
      tag: 'CHANNEL',
    })),
  ]

  const capabilities = [
    { name: 'System Architecture & React 19', level: 'EXPERT' },
    { name: 'Creative Development & Motion Design', level: 'SENIOR' },
    { name: 'Cloud Infrastructure & Supabase', level: 'ADVANCED' },
    { name: 'UI/UX Design Systems & Typographic Grid', level: 'SPECIALIST' },
    { name: 'Linux Engineering & Performance Tuning', level: 'PROFICIENT' },
  ]

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`swiss-page accent-${accent}`}>
      {/* Background Micro Grid */}
      <div className="swiss-grid-lines" />

      {/* Editorial Masthead Bar */}
      <header className="swiss-masthead">
        <div className="swiss-masthead-meta">
          <span className="swiss-accent-pill" />
          <span>VOL. 07 // ISSUE AUTUMN 2026</span>
        </div>

        <div className="swiss-masthead-actions">
          {/* Palette Switcher */}
          <div className="swiss-palette-dots">
            <button
              type="button"
              className="swiss-dot-btn red"
              onClick={() => setAccent('red')}
              aria-label="Signal Red Accent"
              title="Signal Red"
            />
            <button
              type="button"
              className="swiss-dot-btn blue"
              onClick={() => setAccent('blue')}
              aria-label="Swiss Blue Accent"
              title="Swiss Blue"
            />
            <button
              type="button"
              className="swiss-dot-btn black"
              onClick={() => setAccent('black')}
              aria-label="Monochrome Black Accent"
              title="Monochrome"
            />
          </div>

          <a href="#/" className="swiss-btn-sm" title="Kembali ke profil default">
            [ESC]
          </a>
          <button
            type="button"
            className="swiss-btn-sm swiss-btn-accent"
            onClick={() => setShowModal(true)}
          >
            BUY
          </button>
        </div>
      </header>

      <main className="swiss-container">
        {/* Editorial Hero Block */}
        <section className="swiss-hero-section">
          <div className="swiss-hero-index">
            <span>INDEX NO. 00-A // BIOGRAPHY</span>
            <span>EDITION 2026</span>
          </div>

          <h1 className="swiss-hero-title">
            {PROFILE.name.split(' ')[0]} <span>{PROFILE.name.split(' ').slice(1).join(' ')}</span>
          </h1>

          <div className="swiss-identity-block">
            <div className="swiss-photo-frame">
              <img src={PROFILE.avatar} alt={PROFILE.name} />
              <div className="swiss-photo-caption">FIG 1.0 — CREATIVE ENGINEER</div>
            </div>

            <div className="swiss-identity-info">
              <div className="swiss-status-pill">
                ● AVAILABLE FOR CONTRACTS
              </div>
              <p className="swiss-bio-text">{PROFILE.bio}</p>

              <div className="swiss-meta-row">
                <div className="swiss-meta-item">
                  <span className="swiss-meta-key">TITLE</span>
                  <span className="swiss-meta-val">{PROFILE.title}</span>
                </div>
                <div className="swiss-meta-item">
                  <span className="swiss-meta-key">LOCATION</span>
                  <span className="swiss-meta-val">{PROFILE.location}</span>
                </div>
                <div className="swiss-meta-item">
                  <span className="swiss-meta-key">DISCIPLINE</span>
                  <span className="swiss-meta-val">Fullstack & Design Eng.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 01: Curated Directory */}
        <div className="swiss-section-header">
          <h2 className="swiss-section-title">Curated Directory</h2>
          <span className="swiss-section-no">SEC. 01 / INDEX</span>
        </div>

        <div className="swiss-index-grid">
          {curatedIndex.map((item) => (
            <a
              key={item.num + item.label}
              href={item.href}
              className="swiss-index-row"
              target={item.href.startsWith('http') ? '_blank' : '_self'}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <div className="swiss-index-left">
                <span className="swiss-index-num">[{item.num}]</span>
                <div className="swiss-index-info">
                  <div className="swiss-index-label">{item.label}</div>
                  <div className="swiss-index-desc">{item.desc}</div>
                </div>
              </div>
              <div className="swiss-index-right">
                <span className="swiss-tag">{item.tag}</span>
                <span className="swiss-arrow">→</span>
              </div>
            </a>
          ))}
        </div>

        {/* Section 02: Transmissions (Social Outlets) */}
        <div className="swiss-section-header">
          <h2 className="swiss-section-title">Transmissions</h2>
          <span className="swiss-section-no">SEC. 02 / NETWORK</span>
        </div>

        <div className="swiss-index-grid">
          {SOCIALS.map((soc, idx) => (
            <a
              key={soc.label}
              href={soc.href}
              className="swiss-index-row"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="swiss-index-left">
                <span className="swiss-index-num">[S{(idx + 1).toString().padStart(2, '0')}]</span>
                <div className="swiss-index-info">
                  <div className="swiss-index-label">{soc.label}</div>
                  <div className="swiss-index-desc">Public Network Broadcast</div>
                </div>
              </div>
              <div className="swiss-index-right">
                <span className="swiss-tag">ONLINE</span>
                <span className="swiss-arrow">↗</span>
              </div>
            </a>
          ))}
        </div>

        {/* Section 03: Capabilities & Core Manifesto */}
        <div className="swiss-section-header">
          <h2 className="swiss-section-title">Capabilities Matrix</h2>
          <span className="swiss-section-no">SEC. 03 / MANIFESTO</span>
        </div>

        <div className="swiss-skills-table">
          {capabilities.map((cap) => (
            <div key={cap.name} className="swiss-skill-entry">
              <span className="swiss-skill-name">{cap.name}</span>
              <span className="swiss-skill-level">[{cap.level}]</span>
            </div>
          ))}
        </div>

        {/* Colophon & Commercial Offer */}
        <section className="swiss-colophon-box">
          <div className="swiss-colophon-header">
            <span>COLOPHON // COMMERCE</span>
            <span>LICENSE V1.0</span>
          </div>
          <h3 className="swiss-colophon-title">Swiss Editorial Grid Template</h3>
          <p className="swiss-colophon-text">
            International Typographic Style untuk portofolio developer, designer, atau creative director. Siap pakai, mandiri, dan mobile-first.
          </p>
          <div className="swiss-colophon-actions">
            <button
              type="button"
              className="swiss-action-btn swiss-action-secondary"
              onClick={copyShareLink}
            >
              {copied ? 'LINK COPIED' : 'SHARE TEMPLATE'}
            </button>
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                'Halo! Saya tertarik membeli source code template profil Swiss Editorial Grid.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="swiss-action-btn swiss-action-primary"
            >
              ORDER VIA WHATSAPP
            </a>
          </div>
        </section>
      </main>

      {/* Commercial License Modal */}
      {showModal && (
        <div className="swiss-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="swiss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="swiss-modal-top">
              <span>COMMERCIAL SPECIFICATION</span>
              <button
                type="button"
                className="swiss-modal-close"
                onClick={() => setShowModal(false)}
              >
                CLOSE [X]
              </button>
            </div>
            <h3 className="swiss-modal-title">Swiss Editorial Grid</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--swiss-text-muted)', lineHeight: 1.5 }}>
              Source code React 19 + Vanilla CSS modular tanpa dependensi pihak ketiga. Sangat mudah dikustomisasi untuk landing page, link in bio, atau CV digital.
            </p>
            <div className="swiss-specs-list">
              <div>• 100% Mobile-first touch architecture</div>
              <div>• 3 Switchable Accent Palettes (Signal Red, Swiss Blue, Monochrome)</div>
              <div>• Asymmetric Editorial Grid & Typographic Index</div>
              <div>• Self-contained CSS & JSX modular architecture</div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  'Halo! Saya tertarik membeli source code template profil Swiss Editorial Grid.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="swiss-action-btn swiss-action-primary"
                style={{ flex: 1 }}
              >
                ORDER VIA WA
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
