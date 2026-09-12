import html2pdf from 'html2pdf.js'

const PDF_OPTIONS = {
  margin: [10, 10, 10, 10],
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  },
  pagebreak: {
    mode: ['css', 'avoid-all'],
    avoid: ['.ct-section', '.ct-job', '.ct-edu'],
  },
}

export async function exportCvToPdf(element, filename) {
  if (!element) {
    throw new Error('Elemen CV tidak ditemukan.')
  }

  await html2pdf()
    .set({ ...PDF_OPTIONS, filename })
    .from(element)
    .save()
}

export function printCvFallback() {
  window.print()
}
