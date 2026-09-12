import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaBriefcase,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaGraduationCap,
} from 'react-icons/fa'

export const SITE = {
  shareTitle: 'Profil & Links',
  shareText: 'Kunjungi profil',
  footerRights: 'All rights reserved.',
}

export const SOCIALS = [
  {
    label: 'GitHub',
    icon: FaGithub,
    href: '#',
  },
  {
    label: 'Instagram',
    icon: FaInstagram,
    href: '#',
  },
  {
    label: 'LinkedIn',
    icon: FaLinkedin,
    href: '#',
  },
  {
    label: 'Facebook',
    icon: FaFacebook,
    href: '#',
  },
]

export const COURSE = {
  title: 'Nurman Course',
  desc: 'Belajar & tingkatkan skill',
  icon: FaGraduationCap,
  href: '#',
}

export const TEMPLATES = [
  {
    label: 'Neo-Brutalism',
    icon: 'palette',
    desc: 'Pop Art & High Contrast',
    href: '#/neo',
  },
  {
    label: 'Cyber Glass',
    icon: 'blur_on',
    desc: 'Glassmorphism & Neon Glow',
    href: '#/cyber',
  },
  {
    label: 'Editorial Luxury',
    icon: 'auto_awesome',
    desc: 'Serif Elegance & Gold Accents',
    href: '#/luxury',
  },
  {
    label: 'Fluid Motion',
    icon: 'animation',
    desc: 'Aura Spotlight & Spring Cursor',
    href: '#/fluid',
  },
  {
    label: '8-Bit Retro Arcade',
    icon: 'sports_esports',
    desc: 'Game Boy & 8-Bit Web Audio',
    href: '#/arcade',
  },
  {
    label: 'CLI Terminal Hacker',
    icon: 'terminal',
    desc: 'Phosphor CRT & Shell Emulator',
    href: '#/terminal',
  },
  {
    label: 'Swiss Editorial Grid',
    icon: 'grid_view',
    desc: 'International Style & Typographic Grid',
    href: '#/swiss',
  },
  {
    label: 'Airbnb Experience',
    icon: 'home',
    desc: 'Warm Hospitality, Clean Whitespace & Superhost UI',
    href: '#/airbnb',
  },
]

export const MENU = [
  {
    label: 'CV',
    icon: 'description',
    href: '#/cv',
  },
  {
    label: 'Buat CV',
    icon: 'edit_document',
    href: '#/creator',
  },
  {
    label: 'Portfolio',
    icon: FaBriefcase,
    href: 'https://rizqinrr.github.io/portofolio/',
    external: true,
  },
]

export const WHATSAPP_GROUP = 'https://chat.whatsapp.com/LUw1SErvcJC4WeLiVO17OM'

export const COMMUNITY = {
  label: 'Komunitas',
  icon: 'forum',
  items: [
    {
      id: 'wa-group',
      label: 'Grup Ngomongin AI',
      icon: FaWhatsapp,
      action: 'open',
      href: WHATSAPP_GROUP,
    },
    {
      id: 'wa-channel',
      label: 'Channel Ngomongin AI',
      icon: FaWhatsapp,
      action: 'open',
      href: 'https://whatsapp.com/channel/0029Vb72vF04dTnAinqyoO3e',
    },
    {
      id: 'telegram',
      label: 'Grup Telegram Ngomongin AI',
      icon: FaTelegram,
      action: 'gate',
      title: 'Grup Telegram Ngomongin AI',
      message: 'Link grup Telegram belum tersedia.',
    },
    {
      id: 'discord',
      label: 'Discord Ngomongin AI',
      icon: FaDiscord,
      action: 'gate',
      title: 'Discord Ngomongin AI',
      message: 'Link invite Discord sudah kadaluarsa.',
    },
  ],
}