import { CV } from '../config/cv.js'

export const CREATOR_STORAGE_KEY = 'cv_creator_data'

export const DEFAULT_FILENAME = 'CV'

export const emptyStringArray = () => ['']

export function createEmptyCv() {
  return {
    name: '',
    role: '',
    handle: '',
    contact: {
      phone: '',
      email: '',
      location: '',
      website: '',
    },
    summary: '',
    skillGroups: [{ category: '', items: '' }],
    experience: [
      { role: '', company: '', period: '', bullets: [''] },
    ],
    academicProjects: [],
    education: [{ degree: '', school: '', period: '', note: '' }],
  }
}

export function createInitialCv() {
  const base = createEmptyCv()
  const source = typeof CV === 'object' && CV !== null ? CV : {}

  return {
    ...base,
    name: source.name ?? base.name,
    role: source.role ?? base.role,
    handle: source.handle ?? base.handle,
    contact: { ...base.contact, ...(source.contact ?? {}) },
    summary: source.summary ?? base.summary,
    skillGroups:
      Array.isArray(source.skillGroups) && source.skillGroups.length > 0
        ? source.skillGroups.map((group) => ({
            category: group?.category ?? '',
            items: group?.items ?? '',
          }))
        : base.skillGroups,
    experience:
      Array.isArray(source.experience) && source.experience.length > 0
        ? source.experience.map((job) => ({
            role: job?.role ?? '',
            company: job?.company ?? '',
            period: job?.period ?? '',
            bullets:
              Array.isArray(job?.bullets) && job.bullets.length > 0
                ? [...job.bullets]
                : [''],
          }))
        : base.experience,
    academicProjects: Array.isArray(source.academicProjects)
      ? source.academicProjects.map((proj) => ({
          role: proj?.role ?? '',
          institution: proj?.institution ?? '',
          period: proj?.period ?? '',
          title: proj?.title ?? '',
          bullets:
            Array.isArray(proj?.bullets) && proj.bullets.length > 0
              ? [...proj.bullets]
              : [''],
        }))
      : base.academicProjects,
    education:
      Array.isArray(source.education) && source.education.length > 0
        ? source.education.map((edu) => ({
            degree: edu?.degree ?? '',
            school: edu?.school ?? '',
            period: edu?.period ?? '',
            note: edu?.note ?? '',
          }))
        : base.education,
  }
}

function asString(value) {
  return typeof value === 'string' ? value : ''
}

function normalizeBullets(value) {
  if (!Array.isArray(value)) return ['']
  const cleaned = value.map(asString)
  return cleaned.length > 0 ? cleaned : ['']
}

export function normalizeCv(raw) {
  const base = createEmptyCv()
  if (!raw || typeof raw !== 'object') return base

  return {
    name: asString(raw.name),
    role: asString(raw.role),
    handle: asString(raw.handle),
    contact: {
      phone: asString(raw.contact?.phone),
      email: asString(raw.contact?.email),
      location: asString(raw.contact?.location),
      website: asString(raw.contact?.website),
    },
    summary: asString(raw.summary),
    skillGroups: Array.isArray(raw.skillGroups)
      ? raw.skillGroups.map((group) => ({
          category: asString(group?.category),
          items: asString(group?.items),
        }))
      : base.skillGroups,
    experience: Array.isArray(raw.experience)
      ? raw.experience.map((job) => ({
          role: asString(job?.role),
          company: asString(job?.company),
          period: asString(job?.period),
          bullets: normalizeBullets(job?.bullets),
        }))
      : base.experience,
    academicProjects: Array.isArray(raw.academicProjects)
      ? raw.academicProjects.map((proj) => ({
          role: asString(proj?.role),
          institution: asString(proj?.institution),
          period: asString(proj?.period),
          title: asString(proj?.title),
          bullets: normalizeBullets(proj?.bullets),
        }))
      : base.academicProjects,
    education: Array.isArray(raw.education)
      ? raw.education.map((edu) => ({
          degree: asString(edu?.degree),
          school: asString(edu?.school),
          period: asString(edu?.period),
          note: asString(edu?.note),
        }))
      : base.education,
  }
}

export function buildFileName(name, fallback = DEFAULT_FILENAME) {
  const cleaned = (name || '').trim().replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '-')
  const base = cleaned || fallback
  return `${base}.pdf`
}
