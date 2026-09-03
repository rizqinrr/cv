import { useState } from 'react';
import { PROFILE } from './config/profile.js';
import { MENU, SOCIALS } from './config/links.js';

export function LuxuryProfilePage() {
  const [copied, setCopied] = useState(false);

  // Ambil kontak WhatsApp untuk direct order/inquiry
  const waContact = SOCIALS.find((c) => c.label?.toLowerCase().includes('whatsapp') || c.href?.includes('wa.me'));
  const waUrl = waContact?.href || 'https://wa.me/6281234567890';
  const orderMessage = encodeURIComponent(
    'Halo, saya tertarik memesan/membeli template profil Editorial Luxury!'
  );
  const waOrderUrl = `${waUrl}${waUrl.includes('?') ? '&' : '?'}text=${orderMessage}`;

  // Filter menu (kecuali demo sendiri agar tidak redundant)
  const displayMenu = MENU.filter((item) => item.href !== '#/luxury');

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="luxury-wrapper">
      {/* Subtle Background Pattern */}
      <div className="luxury-bg-glow" />

      {/* Top Header Bar */}
      <header className="luxury-topbar">
        <a href="#/" className="luxury-nav-back">
          <span className="luxury-arrow">←</span>
          <span className="luxury-back-text">BERANDA</span>
        </a>
        <div className="luxury-topbar-actions">
          <button
            type="button"
            className="luxury-btn-share"
            onClick={handleShare}
            title="Salin tautan"
          >
            {copied ? 'TERSALIN' : 'BAGIKAN'}
          </button>
          <a
            href={waOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-btn-buy-top"
          >
            PESAN TEMPLATE
          </a>
        </div>
      </header>

      <main className="luxury-container">
        {/* Cover / Monogram Brand Accent */}
        <div className="luxury-header-ornament">
          <div className="luxury-ornament-line" />
          <span className="luxury-monogram">N° 03 • BESPOKE COLLECTION</span>
          <div className="luxury-ornament-line" />
        </div>

        {/* Profile Card Hero */}
        <section className="luxury-hero">
          <div className="luxury-avatar-wrapper">
            <img
              src={PROFILE.avatar}
              alt={PROFILE.name}
              className="luxury-avatar"
            />
            <div className="luxury-avatar-frame" />
          </div>

          <div className="luxury-status-badge">
            <span className="luxury-status-dot" />
            <span>TERSEDIA UNTUK KOLABORASI EKSKLUSIF</span>
          </div>

          <h1 className="luxury-title">{PROFILE.name}</h1>
          <p className="luxury-subtitle">{PROFILE.role || PROFILE.handle}</p>

          <p className="luxury-bio">{PROFILE.bio}</p>

          {/* Key Facts / Attributes */}
          <div className="luxury-attributes">
            <div className="luxury-attr-item">
              <span className="luxury-attr-label">LOKASI</span>
              <span className="luxury-attr-value">{PROFILE.location || 'Indonesia'}</span>
            </div>
            <div className="luxury-attr-divider" />
            <div className="luxury-attr-item">
              <span className="luxury-attr-label">STATUS</span>
              <span className="luxury-attr-value">Terverifikasi</span>
            </div>
            <div className="luxury-attr-divider" />
            <div className="luxury-attr-item">
              <span className="luxury-attr-label">EDISI</span>
              <span className="luxury-attr-value">Editorial 2026</span>
            </div>
          </div>
        </section>

        {/* Curated Links Section */}
        <section className="luxury-links-section">
          <div className="luxury-section-title-wrap">
            <h2 className="luxury-section-title">DIREKTORI & PORTOFOLIO</h2>
            <span className="luxury-section-sub">Index Kurasi Pilihan</span>
          </div>

          <div className="luxury-links-list">
            {displayMenu.map((item, index) => {
              const itemNum = String(index + 1).padStart(2, '0');
              const isExternal = item.href?.startsWith('http');
              return (
                <a
                  key={item.label || item.href}
                  href={item.href}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="luxury-link-card"
                >
                  <div className="luxury-link-index">{itemNum}</div>
                  <div className="luxury-link-info">
                    <div className="luxury-link-title-row">
                      <span className="luxury-link-title">{item.label}</span>
                      {item.badge && (
                        <span className="luxury-badge">{item.badge}</span>
                      )}
                    </div>
                    {item.desc && (
                      <p className="luxury-link-desc">{item.desc}</p>
                    )}
                  </div>
                  <div className="luxury-link-arrow">↗</div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Social / Contact Grid */}
        <section className="luxury-contact-section">
          <div className="luxury-section-title-wrap">
            <h2 className="luxury-section-title">JARINGAN & MEDIA</h2>
            <span className="luxury-section-sub">Kanal Komunikasi Terpilih</span>
          </div>

          <div className="luxury-contacts-grid">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-contact-card"
              >
                <div className="luxury-contact-header">
                  <span className="luxury-contact-platform">{social.label}</span>
                  <span className="luxury-contact-arrow">↗</span>
                </div>
                <span className="luxury-contact-handle">
                  {social.handle || 'Kunjungi profil'}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Commercial Sales Banner */}
        <section className="luxury-commercial-card">
          <div className="luxury-commercial-seal">GOLD EDITION</div>
          <div className="luxury-commercial-content">
            <span className="luxury-commercial-tag">PRODUK DIGITAL SIAP PAKAI</span>
            <h3 className="luxury-commercial-title">
              Miliki Template Editorial Luxury Ini
            </h3>
            <p className="luxury-commercial-desc">
              Tingkatkan citra profesional Anda dengan desain editorial berkelas majalah.
              Dilengkapi konfigurasi mandiri satu file, responsif untuk semua layar, dan bebas watermark.
            </p>
            <div className="luxury-features-list">
              <span className="luxury-feature-item">✦ Tipografi Serif Berkelas</span>
              <span className="luxury-feature-item">✦ Siap Pakai & Mudah Diedit</span>
              <span className="luxury-feature-item">✦ Support Vite & React 19</span>
            </div>
            <div className="luxury-commercial-actions">
              <a
                href={waOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-btn-primary"
              >
                Beli Lisensi Template Sekarang
              </a>
              <a href="#/" className="luxury-btn-outline">
                Kembali ke Beranda
              </a>
            </div>
          </div>
        </section>

        {/* Editorial Colophon / Footer */}
        <footer className="luxury-footer">
          <div className="luxury-footer-divider" />
          <p className="luxury-footer-text">
            © {new Date().getFullYear()} {PROFILE.name} — Dirancang dengan sentuhan Editorial Typography.
          </p>
          <p className="luxury-footer-sub">
            Edisi Eksklusif untuk Portofolio & Profil Pribadi Berkelas.
          </p>
        </footer>
      </main>
    </div>
  );
}

