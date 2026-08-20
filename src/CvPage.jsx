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
          <p className="cv-role">{CV.role}</p>
          <p className="cv-contact">
            {[
              CV.contact.email,
              CV.contact.phone,
              CV.contact.location,
              CV.contact.website,
            ]
              .filter(Boolean)
              .join(' • ')}
          </p>
        </header>

        <section className="cv-section">
          <h2>Summary</h2>
          <p>{CV.summary}</p>
        </section>

        <section className="cv-section">
          <h2>Experience</h2>
          {CV.experience.map((job) => (
            <div className="cv-job" key={job.company}>
              <div className="cv-job-head">
                <span className="cv-job-role">{job.role}</span>
                <span className="cv-job-period">{job.period}</span>
              </div>
              <div className="cv-job-company">{job.company}</div>
              <ul className="cv-job-bullets">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="cv-section">
          <h2>Education</h2>
          {CV.education.map((edu) => (
            <div className="cv-edu" key={edu.school}>
              <div className="cv-edu-head">
                <span className="cv-edu-degree">{edu.degree}</span>
                <span className="cv-edu-period">{edu.period}</span>
              </div>
              <div className="cv-edu-school">{edu.school}</div>
            </div>
          ))}
        </section>

        <section className="cv-section">
          <h2>Skills</h2>
          <p>{CV.skills.join(', ')}</p>
        </section>

        {CV.certifications.length > 0 && (
          <section className="cv-section">
            <h2>Certifications</h2>
            <p>{CV.certifications.join(', ')}</p>
          </section>
        )}

        {CV.languages.length > 0 && (
          <section className="cv-section">
            <h2>Languages</h2>
            <p>{CV.languages.join(', ')}</p>
          </section>
        )}
      </article>
    </div>
  )
}

export default CvPage