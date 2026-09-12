import { useEffect, useRef, useState } from 'react'
import CreatorForm from './CreatorForm.jsx'
import CreatorPreview from './CreatorPreview.jsx'
import { useCreatorData } from './useCreatorData.js'
import { buildFileName } from './creatorSchema.js'

function formatSavedAt(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function CreatorPage() {
  const { cv, actions, savedAt, saveError } = useCreatorData()
  const [openSection, setOpenSection] = useState('identity')
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')
  const scalerRef = useRef(null)
  const scrollRef = useRef(null)
  const [previewScale, setPreviewScale] = useState(1)

  useEffect(() => {
    const computeScale = () => {
      const container = scrollRef.current
      if (!container) return
      const available = container.clientWidth - 40
      const needed = 794
      const scale = Math.min(1, Math.max(0.35, available / needed))
      setPreviewScale(scale)
    }

    computeScale()
    window.addEventListener('resize', computeScale)
    return () => window.removeEventListener('resize', computeScale)
  }, [])

  const handleDownload = async () => {
    const target = document.getElementById('cv-export-target')
    setError('')
    setExporting(true)

    const scaler = scalerRef.current
    const previousTransform = scaler?.style.transform ?? ''

    try {
      const { exportCvToPdf } = await import('./exportPdf.js')
      if (scaler) scaler.style.transform = 'none'
      await exportCvToPdf(target, buildFileName(cv.name))
    } catch {
      setError(
        'Gagal membuat PDF otomatis. Membuka dialog cetak browser sebagai alternatif...',
      )
      const { printCvFallback } = await import('./exportPdf.js').catch(() => ({
        printCvFallback: () => window.print(),
      }))
      window.setTimeout(() => printCvFallback(), 600)
    } finally {
      if (scaler) scaler.style.transform = previousTransform
      setExporting(false)
    }
  }

  return (
    <div className="creator-page">
      <div className="creator-toolbar">
        <div className="creator-toolbar-left">
          <a className="creator-back" href="#/">
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali
          </a>
          <span className={`creator-save-status${saveError ? ' is-error' : ''}`}>
            {saveError
              ? saveError
              : savedAt
                ? `Tersimpan ${formatSavedAt(savedAt)}`
                : 'Perubahan tersimpan otomatis'}
          </span>
        </div>

        <div className="creator-toolbar-right">
          <button
            type="button"
            className="creator-download"
            onClick={handleDownload}
            disabled={exporting}
          >
            <span className="material-symbols-outlined">download</span>
            {exporting ? 'Menyiapkan PDF...' : 'Unduh PDF'}
          </button>
        </div>
      </div>

      {error && <div className="creator-error">{error}</div>}

      <div className="creator-layout">
        <CreatorForm
          cv={cv}
          actions={actions}
          openSection={openSection}
          onToggleSection={setOpenSection}
          onReset={actions.reset}
        />

        <div className="creator-preview-pane">
          <span className="creator-preview-label">Pratinjau CV (A4)</span>
          <div className="creator-preview-scroll" ref={scrollRef}>
            <div
              className="creator-preview-scaler"
              ref={scalerRef}
              style={{ transform: `scale(${previewScale})` }}
            >
              <CreatorPreview cv={cv} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatorPage
