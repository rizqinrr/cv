import { CV } from './config/cv.js'

function CvPage() {
  return (
    <div className="cv-page">
      <div className="cv-toolbar no-print">
        <a className="cv-back" href="#/">
          <span className="material-symbols-outlined">arrow_back</span>
          Kembali
        </a>
        <button className="cv-print" onClick={() => window.print()}>
          <span className="material-symbols-outlined">download</span>
          Download PDF
        </button>
      </div>

      <article className="cv-document">
        <header className="cv-header">
          <h1 className="serif">{CV.name}</h1>
          <p className="cv-contact">
            {[
              CV.contact.phone,
              CV.contact.email,
              CV.contact.location,
              CV.contact.website,
            ]
              .filter(Boolean)
              .join(' • ')}
          </p>
        </header>

        <section className="cv-section">
          <h2>PROFIL</h2>
          <p>{CV.summary}</p>
        </section>

        {CV.skillGroups && CV.skillGroups.length > 0 && (
          <section className="cv-section">
            <h2>KETERAMPILAN</h2>
            <div className="cv-skills-list">
              {CV.skillGroups.map((group) => (
                <p key={group.category} className="cv-skill-item">
                  <strong>{group.category}:</strong> {group.items}
                </p>
              ))}
            </div>
          </section>
        )}

        <section className="cv-section">
          <h2>PENGALAMAN</h2>
          {CV.experience.map((job) => (
            <div className="cv-job" key={job.role + job.company}>
              <div className="cv-job-head">
                <span className="cv-job-role">
                  {job.role} <span className="cv-job-divider">|</span> {job.company}
                </span>
                <span className="cv-job-period">{job.period}</span>
              </div>
              <ul className="cv-job-bullets">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {CV.academicProjects && CV.academicProjects.length > 0 && (
          <section className="cv-section">
            <h2>PROYEK AKADEMIK</h2>
            {CV.academicProjects.map((proj) => (
              <div className="cv-job" key={proj.title}>
                <div className="cv-job-head">
                  <span className="cv-job-role">
                    {proj.role} <span className="cv-job-divider">|</span> {proj.institution}
                  </span>
                  <span className="cv-job-period">{proj.period}</span>
                </div>
                <div className="cv-project-title">{proj.title}</div>
                <ul className="cv-job-bullets">
                  {proj.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <section className="cv-section">
          <h2>PENDIDIKAN</h2>
          {CV.education.map((edu) => (
            <div className="cv-edu" key={edu.school}>
              <div className="cv-edu-head">
                <span className="cv-edu-degree">
                  {edu.degree} <span className="cv-job-divider">|</span> {edu.school}
                </span>
                <span className="cv-edu-period">{edu.period}</span>
              </div>
              {edu.note && <div className="cv-edu-note">{edu.note}</div>}
            </div>
          ))}
        </section>
      </article>
    </div>
  )
}

export default CvPage
