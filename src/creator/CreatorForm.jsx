import { useState } from 'react'
import {
  emptyStringArray,
} from './creatorSchema.js'

const NEW_SKILL = { category: '', items: '' }
const NEW_EXPERIENCE = { role: '', company: '', period: '', bullets: [''] }
const NEW_PROJECT = {
  role: '',
  institution: '',
  period: '',
  title: '',
  bullets: [''],
}
const NEW_EDUCATION = { degree: '', school: '', period: '', note: '' }

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="creator-field">
      <span className="creator-field-label">{label}</span>
      <input
        className="creator-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function Section({ id, title, openSection, onToggle, children }) {
  const isOpen = openSection === id

  return (
    <section className="creator-section">
      <button
        type="button"
        className="creator-section-head"
        onClick={() => onToggle(isOpen ? null : id)}
        aria-expanded={isOpen}
      >
        <span className="creator-section-title">{title}</span>
        <span className="material-symbols-outlined creator-section-chevron">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {isOpen && <div className="creator-section-body">{children}</div>}
    </section>
  )
}

function ItemToolbar({ index, total, onMove, onRemove, canRemove }) {
  return (
    <div className="creator-item-toolbar">
      <span className="creator-item-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="creator-item-actions">
        <button
          type="button"
          className="creator-icon-btn"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          aria-label="Naikkan"
          title="Naikkan"
        >
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
        <button
          type="button"
          className="creator-icon-btn"
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          aria-label="Turunkan"
          title="Turunkan"
        >
          <span className="material-symbols-outlined">arrow_downward</span>
        </button>
        <button
          type="button"
          className="creator-icon-btn creator-icon-btn-danger"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Hapus"
          title="Hapus"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  )
}

function CreatorForm({ cv, actions, openSection, onToggleSection, onReset }) {
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    onReset()
    setConfirmReset(false)
  }

  return (
    <div className="creator-form">
      <Section
        id="identity"
        title="Data Diri"
        openSection={openSection}
        onToggle={onToggleSection}
      >
        <Field
          label="Nama Lengkap"
          value={cv.name}
          placeholder="Nama kamu"
          onChange={(value) => actions.setField(['name'], value)}
        />
        <Field
          label="Posisi / Jabatan"
          value={cv.role}
          placeholder="Contoh: Mahasiswa D3 Teknik Informatika"
          onChange={(value) => actions.setField(['role'], value)}
        />
        <Field
          label="Handle"
          value={cv.handle}
          placeholder="@username"
          onChange={(value) => actions.setField(['handle'], value)}
        />
      </Section>

      <Section
        id="contact"
        title="Kontak"
        openSection={openSection}
        onToggle={onToggleSection}
      >
        <Field
          label="Telepon"
          value={cv.contact.phone}
          placeholder="+62 ..."
          onChange={(value) => actions.setField(['contact', 'phone'], value)}
        />
        <Field
          label="Email"
          value={cv.contact.email}
          placeholder="email@contoh.com"
          onChange={(value) => actions.setField(['contact', 'email'], value)}
        />
        <Field
          label="Lokasi"
          value={cv.contact.location}
          placeholder="Kota, Provinsi"
          onChange={(value) => actions.setField(['contact', 'location'], value)}
        />
        <Field
          label="Website / LinkedIn"
          value={cv.contact.website}
          placeholder="https://..."
          onChange={(value) => actions.setField(['contact', 'website'], value)}
        />
      </Section>

      <Section
        id="summary"
        title="Ringkasan"
        openSection={openSection}
        onToggle={onToggleSection}
      >
        <label className="creator-field">
          <span className="creator-field-label">Ringkasan Profil</span>
          <textarea
            className="creator-textarea"
            rows={5}
            value={cv.summary}
            placeholder="Deskripsi singkat tentang kamu..."
            onChange={(event) => actions.setField(['summary'], event.target.value)}
          />
        </label>
      </Section>

      <Section
        id="skills"
        title="Keterampilan"
        openSection={openSection}
        onToggle={onToggleSection}
      >
        {cv.skillGroups.map((group, index) => (
          <div className="creator-item" key={`skill-${index}`}>
            <ItemToolbar
              index={index}
              total={cv.skillGroups.length}
              canRemove={cv.skillGroups.length > 1}
              onMove={(dir) => actions.moveItemBy('skillGroups', index, dir)}
              onRemove={() => actions.removeItem('skillGroups', index)}
            />
            <Field
              label="Kategori"
              value={group.category}
              placeholder="Contoh: Office & Produktivitas"
              onChange={(value) =>
                actions.setListItem('skillGroups', index, 'category', value)
              }
            />
            <label className="creator-field">
              <span className="creator-field-label">Daftar Keterampilan</span>
              <textarea
                className="creator-textarea"
                rows={2}
                value={group.items}
                placeholder="Pisahkan dengan koma"
                onChange={(event) =>
                  actions.setListItem('skillGroups', index, 'items', event.target.value)
                }
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          className="creator-add-btn"
          onClick={() => actions.addItem('skillGroups', { ...NEW_SKILL })}
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Kategori
        </button>
      </Section>

      <Section
        id="experience"
        title="Pengalaman"
        openSection={openSection}
        onToggle={onToggleSection}
      >
        {cv.experience.map((job, index) => (
          <div className="creator-item" key={`exp-${index}`}>
            <ItemToolbar
              index={index}
              total={cv.experience.length}
              canRemove={cv.experience.length > 1}
              onMove={(dir) => actions.moveItemBy('experience', index, dir)}
              onRemove={() => actions.removeItem('experience', index)}
            />
            <Field
              label="Posisi"
              value={job.role}
              placeholder="Contoh: Instruktur Coding"
              onChange={(value) => actions.setListItem('experience', index, 'role', value)}
            />
            <Field
              label="Perusahaan / Instansi"
              value={job.company}
              placeholder="Nama perusahaan"
              onChange={(value) =>
                actions.setListItem('experience', index, 'company', value)
              }
            />
            <Field
              label="Periode"
              value={job.period}
              placeholder="Agustus 2026 – Sekarang"
              onChange={(value) =>
                actions.setListItem('experience', index, 'period', value)
              }
            />
            <label className="creator-field">
              <span className="creator-field-label">
                Poin Pencapaian (satu baris satu poin)
              </span>
              <textarea
                className="creator-textarea"
                rows={4}
                value={job.bullets.join('\n')}
                placeholder="Tulis satu poin per baris"
                onChange={(event) =>
                  actions.setBullets('experience', index, event.target.value)
                }
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          className="creator-add-btn"
          onClick={() => actions.addItem('experience', { ...NEW_EXPERIENCE, bullets: emptyStringArray() })}
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Pengalaman
        </button>
      </Section>

      <Section
        id="projects"
        title="Proyek Akademik"
        openSection={openSection}
        onToggle={onToggleSection}
      >
        {cv.academicProjects.length === 0 && (
          <p className="creator-empty-hint">Belum ada proyek. Klik tombol di bawah untuk menambahkan.</p>
        )}
        {cv.academicProjects.map((proj, index) => (
          <div className="creator-item" key={`proj-${index}`}>
            <ItemToolbar
              index={index}
              total={cv.academicProjects.length}
              canRemove
              onMove={(dir) => actions.moveItemBy('academicProjects', index, dir)}
              onRemove={() => actions.removeItem('academicProjects', index)}
            />
            <Field
              label="Peran"
              value={proj.role}
              placeholder="Contoh: Project Manager"
              onChange={(value) =>
                actions.setListItem('academicProjects', index, 'role', value)
              }
            />
            <Field
              label="Institusi"
              value={proj.institution}
              placeholder="Nama kampus / lembaga"
              onChange={(value) =>
                actions.setListItem('academicProjects', index, 'institution', value)
              }
            />
            <Field
              label="Periode"
              value={proj.period}
              placeholder="Februari 2025 – Juni 2025"
              onChange={(value) =>
                actions.setListItem('academicProjects', index, 'period', value)
              }
            />
            <Field
              label="Judul Proyek"
              value={proj.title}
              placeholder="Judul proyek"
              onChange={(value) =>
                actions.setListItem('academicProjects', index, 'title', value)
              }
            />
            <label className="creator-field">
              <span className="creator-field-label">
                Poin Pencapaian (satu baris satu poin)
              </span>
              <textarea
                className="creator-textarea"
                rows={4}
                value={proj.bullets.join('\n')}
                onChange={(event) =>
                  actions.setBullets('academicProjects', index, event.target.value)
                }
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          className="creator-add-btn"
          onClick={() =>
            actions.addItem('academicProjects', { ...NEW_PROJECT, bullets: emptyStringArray() })
          }
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Proyek
        </button>
      </Section>

      <Section
        id="education"
        title="Pendidikan"
        openSection={openSection}
        onToggle={onToggleSection}
      >
        {cv.education.map((edu, index) => (
          <div className="creator-item" key={`edu-${index}`}>
            <ItemToolbar
              index={index}
              total={cv.education.length}
              canRemove={cv.education.length > 1}
              onMove={(dir) => actions.moveItemBy('education', index, dir)}
              onRemove={() => actions.removeItem('education', index)}
            />
            <Field
              label="Jenjang / Gelar"
              value={edu.degree}
              placeholder="Contoh: D3 Teknik Informatika"
              onChange={(value) =>
                actions.setListItem('education', index, 'degree', value)
              }
            />
            <Field
              label="Sekolah / Kampus"
              value={edu.school}
              placeholder="Nama institusi"
              onChange={(value) =>
                actions.setListItem('education', index, 'school', value)
              }
            />
            <Field
              label="Periode"
              value={edu.period}
              placeholder="2023 – Sekarang"
              onChange={(value) =>
                actions.setListItem('education', index, 'period', value)
              }
            />
            <Field
              label="Catatan (opsional)"
              value={edu.note}
              placeholder="Contoh: Expected lulus Oktober 2026"
              onChange={(value) =>
                actions.setListItem('education', index, 'note', value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="creator-add-btn"
          onClick={() => actions.addItem('education', { ...NEW_EDUCATION })}
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Pendidikan
        </button>
      </Section>

      <Section
        id="settings"
        title="Pengaturan"
        openSection={openSection}
        onToggle={onToggleSection}
      >
        <p className="creator-empty-hint">
          Nama file PDF otomatis mengikuti nama kamu. Contoh: <strong>CV-Nama-Kamu.pdf</strong>
        </p>
        <div className="creator-reset-row">
          <button
            type="button"
            className={`creator-reset-btn${confirmReset ? ' is-confirming' : ''}`}
            onClick={handleReset}
          >
            <span className="material-symbols-outlined">restart_alt</span>
            {confirmReset ? 'Klik lagi untuk konfirmasi' : 'Reset ke Data Awal'}
          </button>
          {confirmReset && (
            <button
              type="button"
              className="creator-cancel-btn"
              onClick={() => setConfirmReset(false)}
            >
              Batal
            </button>
          )}
        </div>
      </Section>
    </div>
  )
}

export default CreatorForm
