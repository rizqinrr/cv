# CV — Profil & Links Page

Halaman profil personal / linktree dengan estetika **glassmorphism** (warna biru-putih), dibangun dengan **React 19 + Vite 8**, dan di-deploy ke **GitHub Pages**.

## Fitur

- Hero sticky: cover full (tanpa card) + avatar ring + nama + bio; saat scroll konten menimpanya & profil jadi kapsul
- Banner Nurman Course (gradient)
- List menu navigasi (Data Diri, Portfolio, komunitas Ngomongin AI) dengan efek hover
- Card sosial di bawah (logo GitHub, Instagram, LinkedIn, Facebook)
- Bottom pill dock (Home + Data Diri)
- Dark mode toggle (tersimpan di `localStorage`, default light)
- Share profil (Web Share API + fallback copy link + toast)

## Struktur

```
cv/
├── index.html              # Font & meta
├── src/
│   ├── App.jsx             # Komponen utama
│   ├── index.css           # Design system (light/dark)
│   └── config/             # <-- Semua yang bisa di-custom
│       ├── profile.js      # Identitas
│       ├── links.js        # Teks, sosial, course, menu
│       └── theme.js        # Key localStorage
└── prompt-stitch/          # Prompt & referensi desain Stitch
```

## Customisasi

Semua konten diubah cukup dengan edit file di `src/config/`, tanpa menyentuh komponen:

| File | Isi |
|---|---|
| `src/config/profile.js` | `name`, `handle`, `bio`, `avatar`, `cover` |
| `src/config/links.js` | `SITE` (teks), `SOCIALS` (logo sosial), `COURSE` (banner), `MENU` (baris menu) |
| `src/config/theme.js` | `THEME_KEY` (key dark mode) |

Contoh mengubah nama:

```js
// src/config/profile.js
name: 'Nama Kamu',  // ganti dengan nama asli
handle: '@username',
```

Ikon brand menggunakan **react-icons** (`Fa*`). Ganti komponen ikon apa pun dari [react-icons](https://react-icons.github.io/react-icons/) dengan mengubah `icon` di `src/config/links.js`. Menu mendukung dua jenis ikon: string (Material Symbols) atau komponen (react-icons).

## Menjalankan Dev

```bash
npm install
npm run dev
```

## Deploy ke GitHub Pages

```bash
npm run deploy
```

Proses: `npm run build` lalu publish folder `dist` ke branch `gh-pages`. Situs live di:

**https://rizqinrr.github.io/cv**

> Catatan: Vite sudah dikonfigurasi `base: './'` sehingga aset relatif dan berfungsi di sub-path GitHub Pages.