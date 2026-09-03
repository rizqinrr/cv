import { useState } from 'react'
import { PROFILE } from '../../config/profile.js'
import { MENU, SOCIALS } from '../../config/links.js'
import './airbnb.css'

export default function AirbnbProfilePage() {
  const [wishlisted, setWishlisted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const listingItems = [
    {
      title: 'Curriculum Vitae',
      category: 'Dokumen & Riwayat Karir',
      badge: 'VERIFIED',
      icon: 'description',
      href: '#/cv',
    },
    {
      title: 'Koleksi Portfolio',
      category: 'Studi Kasus & Aplikasi Produksi',
      badge: 'POPULER',
      icon: 'work',
      href: '#/portfolio',
    },
    ...MENU.map((item) => ({
      title: item.label,
      category: 'Komunitas & Kanal Diskusi',
      badge: 'AKTIF',
      icon: typeof item.icon === 'string' ? item.icon : 'group',
      href: item.href,
    })),
  ]

  const highlights = [
    {
      icon: 'verified',
      title: 'Superhost Rekayasa Software',
      desc: 'Berpengalaman 6+ tahun membangun ekosistem frontend, backend, dan arsitektur AI.',
    },
    {
      icon: 'schedule',
      title: 'Komunikasi Responsif 100%',
      desc: 'Biasanya merespons dalam hitungan jam untuk kolaborasi proyek dan konsultasi.',
    },
    {
      icon: 'location_on',
      title: 'Lokasi Fleksibel',
      desc: `Berbasis di ${PROFILE.location}, siap kerja remote maupun hybrid.`,
    },
  ]

  const ratingCategories = [
    { name: 'Kualitas Kode & Arsitektur', score: '5.0', pct: '100%' },
    { name: 'Kecepatan Respons & Komunikasi', score: '4.9', pct: '98%' },
    { name: 'Ketepatan Waktu (Delivery)', score: '5.0', pct: '100%' },
    { name: 'Nilai Kolaborasi & Value', score: '4.9', pct: '98%' },
  ]

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="abnb-page">
      {/* Sticky Header with Search Capsule */}
      <header className="abnb-header">
        <div className="abnb-search-pill" onClick={() => setShowModal(true)}>
          <div className="abnb-search-icon">
            <span className="material-symbols-outlined">search</span>
          </div>
          <div className="abnb-search-text">
            <div className="abnb-search-title">Profil & Kemitraan</div>
            <div className="abnb-search-sub">Dimana saja • Kapan saja • Hubungi Host</div>
          </div>
        </div>

        <div className="abnb-header-actions">
          <a href="#/" className="abnb-btn-circle" title="Kembali ke profil default">
            <span className="material-symbols-outlined">close</span>
          </a>
        </div>
      </header>

      <main className="abnb-container">
        {/* Listing Visual Gallery */}
        <section className="abnb-hero-gallery">
          <img src={PROFILE.cover} alt={PROFILE.name} className="abnb-gallery-img" />
          <div className="abnb-gallery-badge">
            <span className="material-symbols-outlined">hotel_class</span>
            Pilihan Tamu / Superhost
          </div>
          <button
            type="button"
            className={`abnb-wishlist-btn ${wishlisted ? 'active' : ''}`}
            onClick={() => setWishlisted((prev) => !prev)}
            aria-label="Simpan ke Wishlist"
            title="Simpan ke Wishlist"
          >
            <span className="material-symbols-outlined">
              {wishlisted ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </section>

        {/* Listing Title & Meta */}
        <section className="abnb-host-card">
          <h1 className="abnb-listing-title">
            Pengalaman Rekayasa Produk Digital bersama {PROFILE.name}
          </h1>
          <div className="abnb-listing-meta">
            <span className="abnb-rating">
              <span className="star">★</span> 4.98
            </span>
            <span className="abnb-reviews-count">(42 ulasan)</span>
            <span className="abnb-dot-sep">•</span>
            <span className="abnb-superhost-label">
              <span className="abnb-superhost-badge">SUPERHOST</span>
            </span>
            <span className="abnb-dot-sep">•</span>
            <span>{PROFILE.location}</span>
          </div>
        </section>

        {/* Host Profile Snippet */}
        <section className="abnb-profile-snippet">
          <div className="abnb-snippet-left">
            <div className="abnb-avatar-wrap">
              <img src={PROFILE.avatar} alt={PROFILE.name} />
              <div className="abnb-superhost-pin">★</div>
            </div>
            <div className="abnb-snippet-text">
              <h3>Dihosting oleh {PROFILE.name}</h3>
              <p>{PROFILE.title} • Superhost selama 4 tahun</p>
            </div>
          </div>
        </section>

        {/* Highlights & Amenities */}
        <section className="abnb-amenities-section">
          {highlights.map((h) => (
            <div key={h.title} className="abnb-amenity-row">
              <span className="material-symbols-outlined abnb-amenity-icon">{h.icon}</span>
              <div>
                <div className="abnb-amenity-title">{h.title}</div>
                <div className="abnb-amenity-desc">{h.desc}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Curated Directory / Experience Listings */}
        <section style={{ marginBottom: '24px' }}>
          <h2 className="abnb-section-heading">Jelajahi Akses & Direktori</h2>
          <div className="abnb-listings-grid">
            {listingItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="abnb-card-item"
                target={item.href.startsWith('http') ? '_blank' : '_self'}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <div className="abnb-card-left">
                  <div className="abnb-card-icon-box">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="abnb-card-info">
                    <div className="abnb-card-label">{item.title}</div>
                    <div className="abnb-card-desc">{item.category}</div>
                  </div>
                </div>
                <div className="abnb-card-right">
                  <span className="abnb-card-badge">{item.badge}</span>
                  <span className="material-symbols-outlined abnb-card-arrow">chevron_right</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Social Channels Section */}
        <section style={{ marginBottom: '28px' }}>
          <h2 className="abnb-section-heading">Kanal Komunikasi Langsung</h2>
          <div className="abnb-listings-grid">
            {SOCIALS.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                className="abnb-card-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="abnb-card-left">
                  <div className="abnb-card-icon-box">
                    <span className="material-symbols-outlined">link</span>
                  </div>
                  <div className="abnb-card-info">
                    <div className="abnb-card-label">{soc.label}</div>
                    <div className="abnb-card-desc">Tautan sosial terverifikasi</div>
                  </div>
                </div>
                <div className="abnb-card-right">
                  <span className="material-symbols-outlined abnb-card-arrow">open_in_new</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Ratings & Host Reviews Box */}
        <section className="abnb-reviews-box">
          <div className="abnb-reviews-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--abnb-star-gold)' }}>
              star
            </span>
            <span>4.98 • 42 Ulasan Klien & Rekan Tim</span>
          </div>

          <div className="abnb-rating-bars">
            {ratingCategories.map((rc) => (
              <div key={rc.name} className="abnb-rate-row">
                <span style={{ width: '140px', color: 'var(--abnb-color-foggy)' }}>{rc.name}</span>
                <div className="abnb-rate-bar-track">
                  <div className="abnb-rate-bar-fill" style={{ width: rc.pct }} />
                </div>
                <span className="abnb-rate-score">{rc.score}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Reserve Bar (Mobile Sticky Dock) */}
      <aside className="abnb-reserve-bar">
        <div className="abnb-reserve-info">
          <div className="abnb-price-tag">
            Tersedia <span>/ Proyek Baru</span>
          </div>
          <div className="abnb-reserve-dates" onClick={() => setShowModal(true)}>
            Lihat Lisensi Template
          </div>
        </div>

        <div className="abnb-reserve-actions">
          <button
            type="button"
            className="abnb-btn-reserve-alt"
            onClick={copyShareLink}
            title="Salin tautan"
          >
            {copied ? 'Tersalin' : 'Bagikan'}
          </button>
          <a
            href={`https://wa.me/6281234567890?text=${encodeURIComponent(
              'Halo! Saya tertarik memesan/berkolaborasi melalui profil gaya Airbnb Experience ini.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="abnb-btn-reserve"
          >
            Pesan / Kontak
          </a>
        </div>
      </aside>

      {/* Commercial License Modal */}
      {showModal && (
        <div className="abnb-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="abnb-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="abnb-modal-top">
              <h3>Airbnb DLS Profile Template</h3>
              <button
                type="button"
                className="abnb-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--abnb-color-foggy)', lineHeight: 1.5 }}>
              Template profil personal dengan standar Design Language System (DLS) Airbnb resmi: ruang kosong lega (12px grid), warna Rausch Crimson, rounded corners ramah, dan pengalaman Superhost.
            </p>
            <div className="abnb-modal-specs">
              <div>✓ Standar DLS Airbnb (Rausch #ff385c & Product Crimson #da1249)</div>
              <div>✓ 100% Mobile-First dengan Floating Reserve Dock</div>
              <div>✓ Hero listing showcase + Amenities highlight list</div>
              <div>✓ Self-contained React 19 + Vanilla CSS modular</div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  'Halo! Saya berminat membeli lisensi kode template profil gaya Airbnb DLS.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="abnb-btn-reserve"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Pesan Source Code via WA
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
