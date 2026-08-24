const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1400&q=90&auto=format&fit=crop`

export const PROJECTS = [
  {
    label: 'Nurman Course',
    eyebrow: 'Education',
    image: unsplash('1501504905252-473c47e087f8'),
    imageAlt: 'Nurman Course',
    summary:
      'Platform kursus online dengan katalog materi, progress tracking, dan integrasi pembayaran. Fokus pada pengalaman belajar yang simpel dan cepat.',
    tech: ['React', 'Vite', 'Supabase', 'Midtrans'],
    background: '#067b8f',
    foreground: '#ecfeff',
  },
  {
    label: 'Ngomongin AI',
    eyebrow: 'Community',
    image: unsplash('1677442136019-21780ecad995'),
    imageAlt: 'Ngomongin AI',
    summary:
      'Komunitas & konten seputar AI: kurasi tools, tutorial prompt, dan diskusi rutin. Dibangun untuk memudahkan orang mulai pakai AI sehari-hari.',
    tech: ['WhatsApp API', 'Notion', 'Automation'],
    background: '#3322a8',
    foreground: '#f3f1ff',
  },
  {
    label: 'Personal Linktree',
    eyebrow: 'Web',
    image: unsplash('1611224923853-80b023f02d71'),
    imageAlt: 'Personal Linktree',
    summary:
      'Halaman profil & tautan personal dengan glassmorphism UI, dark mode, photo viewer, dan halaman CV ATS yang bisa diunduh sebagai PDF.',
    tech: ['React', 'Vite', 'CSS Variables', 'GitHub Pages'],
    background: '#2563eb',
    foreground: '#eff6ff',
  },
  {
    label: 'AI Workflow Pack',
    eyebrow: 'Developer Tooling',
    image: unsplash('1620712943543-bcc4688e7485'),
    imageAlt: 'AI Workflow Pack',
    summary:
      'Kumpulan skill, persona, dan checklist untuk AI coding agent: lifecycle DEFINE sampai SHIP, orchestration multi-agent, dan reusable references.',
    tech: ['OpenCode', 'MCP', 'Markdown', 'Prompt Engineering'],
    background: '#a94808',
    foreground: '#fff7ed',
  },
  {
    label: 'Dashboard Analytics',
    eyebrow: 'Data',
    image: unsplash('1551288049-bebda4e38f71'),
    imageAlt: 'Dashboard Analytics',
    summary:
      'Dashboard visualisasi data dengan chart interaktif, filter periode, dan export laporan. Placeholder untuk project analytics berikutnya.',
    tech: ['React', 'Chart.js', 'REST API'],
    background: '#ba075f',
    foreground: '#fff1f7',
  },
  {
    label: 'E-Commerce Catalog',
    eyebrow: 'Commerce',
    image: unsplash('1472851294608-062f824d29cc'),
    imageAlt: 'E-Commerce Catalog',
    summary:
      'Katalog produk dengan pencarian, filter kategori, dan halaman detail. Placeholder untuk project e-commerce berikutnya.',
    tech: ['React', 'Tailwind', 'Supabase'],
    background: '#15803d',
    foreground: '#f0fdf4',
  },
]
