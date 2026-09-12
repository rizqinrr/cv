# Task: CV Creator — Halaman Buat CV Online (Tanpa Database, Tanpa AI)

## Overview

Menambahkan halaman baru **`#/creator`** di project `cv` — pembuat CV online yang berjalan **100% di browser**:

- User mengisi form → data tersimpan otomatis di **localStorage** (tanpa backend/database)
- Preview CV real-time berformat **A4**
- User bisa **langsung mengunduh PDF** dari data yang diisi
- Pre-fill dari data statis `CV` di `src/config/cv.js` (milik user), bisa diubah bebas

**Scope berhenti di `git push`.** Tidak ada `npm run deploy`.

**Tidak ada AI.** Merah — murni form + template manual.

---

## Design Decisions (LOCKED)

| Aspek | Keputusan |
|---|---|
| Route | **`#/creator`** (halaman terpisah; `#/cv` tetap statis milik user) |
| Backend | **Tidak ada.** localStorage saja |
| AI | **Tidak ada** |
| PDF export | **html2pdf.js** (Opsi B) + fallback `window.print()` |
| Bahasa UI | **Indonesia** |
| Upload foto | Tidak perlu |
| Jumlah template | **1 layout** dulu |
| Share | Tidak ada — langsung unduh |
| Pre-fill | Ya, dari `CV` (`src/config/cv.js`) |
| Layout PDF | **Layout ATS BARU** (bukan reuse `CvPage.jsx`) |
| Nama file default | `CV-{nama}.pdf` |
| Batas scope | Sampai `push`, **bukan** deploy |

---

## Riset Context7 — html2pdf.js

Library ID: `/ekoopmans/html2pdf.js` (Source Reputation: High, 121 snippet)

### API
```js
html2pdf().set(opt).from(element).save()
```

### Opsi yang dipakai
```js
{
  margin: [10, 10, 10, 10],
  filename: `${namaFile}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  pagebreak: { mode: ['css', 'avoid-all'], avoid: '.cv-section, .cv-job, .cv-edu' },
}
```

### Dependensi bawaan
`html2pdf.js` → `dompurify`, `html2canvas`, `jspdf`

### Catatan penting dari dokumentasi
- **Hanya jalan di browser** (bukan Node) — aman untuk Vite.
- `pagebreak.mode: 'avoid-all'` — cegah elemen terpotong; bisa juga `before`/`after` dengan selector.
- **Known issue:** ada bug pada proses *cloning* konten sebelum dikirim ke html2canvas.
- **Known issue:** html2canvas bukan rendering engine sempurna; CSS kompleks bisa salah render.
- `enableLinks: true` (default) — hyperlink otomatis ditambahkan di atas `<a>`.

### Verifikasi kompatibilitas
Sudah dicek: `src/index.css` **tidak memakai `oklch` / `color-mix` / `lab` / `lch`** —
semua warna hex/rgba. Salah satu penyebab utama html2canvas gagal render **tidak berlaku** di project ini.

### Trade-off yang disadari user
| Aspek | Konsekuensi |
|---|---|
| Output **raster** | Teks di PDF **tidak bisa di-select / di-copy**, zoom tajam terbatas |
| Ukuran file | Lebih besar dari vector (mitigasi: `quality: 0.98`, `scale: 2`) |
| Bug cloning | Diantisipasi dengan fallback `window.print()` |

---

## Scope & Non-Goals

### In scope
- `src/creator/*` (7 file baru)
- `src/App.jsx` — 1 route baru
- `src/config/links.js` — 1 entri menu
- `src/main.jsx` — import CSS
- `package.json` — dependency `html2pdf.js`

### NON-goals (JANGAN disentuh)
- `src/CvPage.jsx` — halaman CV statis, tetap utuh
- `src/config/cv.js` — dipakai sebagai pre-fill, **tidak diubah**
- `src/templates/*` — 8 template profil, tidak berkaitan
- `src/PortfolioPage.jsx`, `src/config/portfolio.js`, `src/config/profile.js`, `src/config/theme.js`
- `src/index.css` — jangan tambah style creator di sini (pakai `creator.css` terpisah)
- Tidak ada `npm run deploy`

### Shared class bahaya (VERIFY sebelum edit)
- `.cv-*` classes di `index.css` (`.cv-page`, `.cv-document`, `.cv-job`, `.cv-edu`, dll) → **dipakai `CvPage.jsx`**. Layout PDF ATS baru **wajib pakai prefix berbeda** (mis. `.ct-*` / `.creator-*`).
- Route di `App.jsx:120-158` — pola `if (route === '#/x') return <Page />`. Tambah mengikuti pola, jangan refactor.

---

## Current State (baseline)

### `src/App.jsx` (331 baris)
- Routing hash manual: `const [route, setRoute] = useState(() => window.location.hash)` (baris 23)
- Listener `hashchange` (baris 26-35) — reset viewer/templates + `scrollTo(0,0)`
- Pola route: `if (route === '#/cv') { return <CvPage /> }` (baris 120-158)
- `import CvPage from './CvPage.jsx'` (baris 5)

### `src/main.jsx` (10 baris)
```jsx
import './index.css'
import App from './App.jsx'
```

### `src/config/cv.js` (98 baris) — sumber pre-fill
Bentuk data:
```js
{
  name, role, handle,
  contact: { phone, email, location, website },
  summary,
  skillGroups: [{ category, items }],
  experience: [{ role, company, period, bullets: [] }],
  academicProjects: [{ role, institution, period, title, bullets: [] }],
  education: [{ degree, school, period, note? }],
}
```

### `src/index.css` (1399 baris)
- Design tokens di `:root` (baris 1-100): `--surface`, `--primary`, `--on-surface`, `--glass-bg`, dll — hex/rgba
- Dark mode via `[data-theme="dark"]`
- Blok `@media print` khusus CV di baris 1044-1090
- `.cv-*` classes di baris 817-1090

### Git
- Branch: `main` (satu-satunya), remote `origin/main`
- Fase 0 commit `cea2c71` sudah membersihkan working tree

---

## Arsitektur

```
#/cv        → CV statis milik user (TIDAK diubah)
#/creator   → CV Creator (form + preview + unduh)

Alur data:
  Pre-fill dari config/cv.js
          │
          ▼
    useCreatorData (useReducer + localStorage)
          │  debounce 500ms
          ▼
    CreatorForm ──▶ state ──▶ CreatorPreview (A4)
                                    │
                                    ▼
                        exportPdf() ──▶ unduh .pdf
```

**Kenapa localStorage (bukan sessionStorage):** data persist setelah tab ditutup. Tidak ada data sensitif (tanpa foto, tanpa API key).

---

## Fase 1 — Fondasi Data

### `src/creator/creatorSchema.js`
- `CREATOR_STORAGE_KEY = 'cv_creator_data'`
- `createEmptyCv()` — struktur kosong sesuai bentuk `CV`
- `createInitialCv()` — deep-clone dari `CV` (`config/cv.js`) sebagai pre-fill
- `normalizeCv(raw)` — pastikan bentuk valid (array ada, string fallback) untuk data localStorage yang korup/beda versi
- `DEFAULT_FILENAME = 'CV'`

### `src/creator/useCreatorData.js`
- `useReducer` dengan aksi: `SET_FIELD`, `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_ITEM`, `MOVE_ITEM`, `RESET`, `IMPORT`
- Load awal: `localStorage` → fallback `createInitialCv()`
- Auto-save: `useEffect` + debounce 500ms
- Return: `{ cv, actions, savedAt, isDirty }`

---

## Fase 2 — Form

### `src/creator/CreatorForm.jsx`

Section accordion (bahasa Indonesia), 8 bagian:

| # | Section | Field |
|---|---|---|
| 1 | Data Diri | nama, posisi/jabatan, handle |
| 2 | Kontak | telepon, email, lokasi, website |
| 3 | Ringkasan | textarea |
| 4 | Keterampilan | repeater: kategori + items |
| 5 | Pengalaman | repeater: role, company, period, bullets[] |
| 6 | Proyek Akademik | repeater: role, institution, period, title, bullets[] |
| 7 | Pendidikan | repeater: degree, school, period, note |
| 8 | Pengaturan | nama file output |

**Fitur:**
- Tombol tambah / hapus / naik-turun per repeater
- Indikator "Tersimpan" + timestamp
- Tombol Reset dengan konfirmasi
- Field `bullets` dikelola sebagai textarea (satu baris = satu bullet) agar sederhana

---

## Fase 3 — Preview A4

### `src/creator/CreatorPreview.jsx`

- Layout **ATS baru**, bersih, satu kolom, tanpa warna dekoratif
- Prefix class **`ct-*`** (bukan `.cv-*`) agar tidak bentrok dengan `CvPage.jsx`
- Lebar tetap A4 (`210mm`), skala visual `0.6` via `transform: scale()` untuk preview di layar
- `id="cv-export-target"` sebagai target html2pdf
- Struktur: Header (nama besar, kontak inline) → Ringkasan → Keterampilan → Pengalaman → Proyek Akademik → Pendidikan
- Section kosong tidak dirender

**Aturan ATS:**
- Satu kolom, urutan linear
- Heading section kapital
- Tanpa tabel, tanpa kolom ganda, tanpa ikon dekoratif
- Font sistem/sans-serif, ukuran konsisten

---

## Fase 4 — Export PDF

### `src/creator/exportPdf.js`

```js
import html2pdf from 'html2pdf.js'

export async function exportCvToPdf(element, filename) {
  if (!element) throw new Error('Elemen CV tidak ditemukan')
  return html2pdf()
    .set({
      margin: [10, 10, 10, 10],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: {
        mode: ['css', 'avoid-all'],
        avoid: '.ct-section, .ct-job, .ct-edu',
      },
    })
    .from(element)
    .save()
}
```

- Dipanggil dari `CreatorPage.jsx` setelah preview di-**reset skala ke 1** (agar tidak ikut ter-scale saat capture), lalu dikembalikan.
- Tombol export & form memiliki class `no-print` / berada di luar target.

### `src/creator/CreatorPage.jsx`
- Toolbar: tombol "Kembali" (`#/`), status tersimpan, tombol "Unduh PDF"
- Layout: grid 2 kolom (form kiri, preview kanan) di desktop; tab/toggle di mobile
- State loading saat proses export
- Error handling: kalau export gagal → tampilkan pesan + fallback `window.print()`

---

## Fase 5 — Styling & Wiring

### `src/creator/creator.css`
- Prefix `.creator-*` dan `.ct-*`
- Pakai design token existing (`var(--surface)`, `var(--primary)`, dll) agar konsisten dengan tema
- Responsive: di bawah 1024px jadi 1 kolom / tab
- Print: `.creator-*` di-hide, `.ct-*` jadi hitam-putih

### `src/main.jsx`
```jsx
import './creator/creator.css'
```

### `src/App.jsx`
```jsx
import CreatorPage from './creator/CreatorPage.jsx'
// ...
if (route === '#/creator') {
  return <CreatorPage />
}
```

### `src/config/links.js`
Tambah entri `MENU`:
```js
{ label: 'Buat CV', icon: 'edit_document', href: '#/creator' }
```

---

## File Change Matrix

| File | Aksi | Risiko |
|---|---|---|
| `src/creator/creatorSchema.js` | Baru | Rendah |
| `src/creator/useCreatorData.js` | Baru | Rendah |
| `src/creator/CreatorForm.jsx` | Baru | Rendah |
| `src/creator/CreatorPreview.jsx` | Baru | Rendah |
| `src/creator/CreatorPage.jsx` | Baru | Rendah |
| `src/creator/exportPdf.js` | Baru | Rendah |
| `src/creator/creator.css` | Baru | Rendah — prefix `.creator-*`/`.ct-*` |
| `src/App.jsx` | Edit (+3 baris) | Sedang — entry point routing |
| `src/config/links.js` | Edit (+1 entri) | Rendah |
| `src/main.jsx` | Edit (+1 import) | Rendah |
| `package.json` | Edit (+1 dep) | Rendah |

---

## Verification Checklist

### Lint & Build
- [ ] `npm run lint` (oxlint) tanpa error
- [ ] `npm run build` sukses

### Fungsi
- [ ] `#/creator` terbuka, pre-fill dari `config/cv.js` tampil
- [ ] Edit form → preview update real-time
- [ ] Refresh halaman → data tetap ada (localStorage)
- [ ] Tutup tab → buka lagi → data tetap ada
- [ ] Tambah/hapus/urut ulang item repeater berfungsi
- [ ] Reset mengembalikan ke data awal + konfirmasi
- [ ] Tombol "Unduh PDF" menghasilkan file `CV-{nama}.pdf`
- [ ] PDF berformat A4 portrait
- [ ] Section tidak terpotong antar halaman
- [ ] Semua section terisi muncul; section kosong tidak muncul

### Regresi
- [ ] `#/cv` masih tampil sama seperti sebelumnya
- [ ] Halaman utama (`#/`) tidak berubah
- [ ] 8 template profil masih jalan
- [ ] Dark mode masih berfungsi
- [ ] Tidak ada bentrok style (`.cv-*` vs `.ct-*`)

---

## Risks & Mitigations

| Risiko | Tingkat | Mitigasi |
|---|---|---|
| html2canvas gagal render | Sedang | Warna sudah hex (aman); jika gagal → fallback `window.print()` |
| Bug cloning html2pdf.js | Sedang | Uji di Fase 5; fallback tersedia |
| PDF raster (teks tak bisa di-select) | **Pasti** | Batasan bawaan — sudah disadari & disetujui user |
| Preview ter-scale ikut ter-capture | Tinggi | Reset `transform: scale(1)` sebelum export, kembalikan setelah |
| Section terpotong antar halaman | Sedang | `pagebreak.avoid` + CSS `break-inside: avoid` |
| Versi data localStorage beda | Sedang | `normalizeCv()` saat load |
| localStorage penuh | Rendah | Tanpa foto; data teks kecil |
| Bentrok `.cv-*` classes | Sedang | Prefix terpisah `.ct-*` / `.creator-*` |

---

## Rollback Strategy

```powershell
Remove-Item -Recurse -Force src/creator
git checkout src/App.jsx src/config/links.js src/main.jsx package.json
npm install
```

Semua fitur terisolasi di `src/creator/*` + 4 edit kecil. `CvPage.jsx`, `index.css`, dan template tidak tersentuh → halaman lama dijamin utuh.

---

## Urutan Eksekusi

| # | Task |
|---|---|
| **T1** | Commit pekerjaan CV ATS yang belum tersimpan ✅ **SELESAI** (`cea2c71`) |
| **T2** | Tulis file task ini |
| **T3** | `npm i html2pdf.js` |
| **T4** | `creatorSchema.js` + `useCreatorData.js` |
| **T5** | `CreatorForm.jsx` |
| **T6** | `CreatorPreview.jsx` |
| **T7** | `exportPdf.js` |
| **T8** | `creator.css` + `CreatorPage.jsx` |
| **T9** | Wiring: `App.jsx`, `links.js`, `main.jsx` |
| **T10** | Verifikasi: lint, build, uji manual (persist + PDF) |
| **T11** | Commit + push (tanpa deploy) |

---

## Future Enhancements (OUT OF SCOPE)

- Multiple template pilihan
- Import/Export JSON
- Upload foto profil (butuh IndexedDB)
- Vector PDF (`@react-pdf/renderer`) untuk teks yang bisa di-select
- Link share berisi data (`?data=`)
- Auto-save ke cloud / backend
