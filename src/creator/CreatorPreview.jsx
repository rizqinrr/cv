const FALLBACK = '—'

function bulletList(bullets) {
  const cleaned = (bullets || []).map((b) => (b || '').trim()).filter(Boolean)
  if (cleaned.length === 0) return null
  return cleaned
}

function CreatorPreview({ cv }) {
  const contactLine = [
    cv.contact.phone,
    cv.contact.email,
    cv.contact.location,
    cv.contact.website,
  ]
    .map((item) => (item || '').trim())
    .filter(Boolean)

  const skillGroups = (cv.skillGroups || []).filter(
    (group) => (group.category || '').trim() || (group.items || '').trim(),
  )

  const experience = (cv.experience || []).filter(
    (job) =>
      (job.role || '').trim() ||
      (job.company || '').trim() ||
      (job.period || '').trim() ||
      bulletList(job.bullets),
  )

  const academicProjects = (cv.academicProjects || []).filter(
    (proj) =>
      (proj.role || '').trim() ||
      (proj.institution || '').trim() ||
      (proj.title || '').trim() ||
      (proj.period || '').trim() ||
      bulletList(proj.bullets),
  )

  const education = (cv.education || []).filter(
    (edu) =>
      (edu.degree || '').trim() ||
      (edu.school || '').trim() ||
      (edu.period || '').trim(),
  )

  return (
    <article className="ct-document" id="cv-export-target">
      <header className="ct-header">
        <h1 className="ct-name">{cv.name || 'Nama Kamu'}</h1>
        {cv.role?.trim() && <p className="ct-role">{cv.role}</p>}
        {contactLine.length > 0 && (
          <p className="ct-contact">{contactLine.join(' • ')}</p>
        )}
      </header>

      {cv.summary?.trim() && (
        <section className="ct-section ct-avoid">
          <h2 className="ct-heading">PROFIL</h2>
          <p className="ct-paragraph">{cv.summary}</p>
        </section>
      )}

      {skillGroups.length > 0 && (
        <section className="ct-section ct-avoid">
          <h2 className="ct-heading">KETERAMPILAN</h2>
          {skillGroups.map((group, index) => (
            <p className="ct-skill-row" key={`skill-${index}`}>
              {group.category?.trim() && (
                <strong className="ct-skill-category">{group.category}:</strong>
              )}{' '}
              <span>{group.items || FALLBACK}</span>
            </p>
          ))}
        </section>
      )}

      {experience.length > 0 && (
        <section className="ct-section">
          <h2 className="ct-heading">PENGALAMAN</h2>
          {experience.map((job, index) => {
            const bullets = bulletList(job.bullets)
            return (
              <div className="ct-job" key={`exp-${index}`}>
                <div className="ct-job-head">
                  <span className="ct-job-title">
                    {[job.role, job.company].filter(Boolean).join(' | ') || FALLBACK}
                  </span>
                  {job.period?.trim() && (
                    <span className="ct-job-period">{job.period}</span>
                  )}
                </div>
                {bullets && (
                  <ul className="ct-bullets">
                    {bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </section>
      )}

      {academicProjects.length > 0 && (
        <section className="ct-section">
          <h2 className="ct-heading">PROYEK AKADEMIK</h2>
          {academicProjects.map((proj, index) => {
            const bullets = bulletList(proj.bullets)
            return (
              <div className="ct-job" key={`proj-${index}`}>
                <div className="ct-job-head">
                  <span className="ct-job-title">
                    {[proj.role, proj.institution].filter(Boolean).join(' | ') || FALLBACK}
                  </span>
                  {proj.period?.trim() && (
                    <span className="ct-job-period">{proj.period}</span>
                  )}
                </div>
                {proj.title?.trim() && (
                  <p className="ct-project-title">{proj.title}</p>
                )}
                {bullets && (
                  <ul className="ct-bullets">
                    {bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </section>
      )}

      {education.length > 0 && (
        <section className="ct-section">
          <h2 className="ct-heading">PENDIDIKAN</h2>
          {education.map((edu, index) => (
            <div className="ct-edu" key={`edu-${index}`}>
              <div className="ct-job-head">
                <span className="ct-job-title">
                  {[edu.degree, edu.school].filter(Boolean).join(' | ') || FALLBACK}
                </span>
                {edu.period?.trim() && (
                  <span className="ct-job-period">{edu.period}</span>
                )}
              </div>
              {edu.note?.trim() && <p className="ct-edu-note">{edu.note}</p>}
            </div>
          ))}
        </section>
      )}
    </article>
  )
}

export default CreatorPreview
