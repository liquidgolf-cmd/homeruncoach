import React from 'react'
import { Report } from '../types/report'
import { generatePDFText, downloadTextFile } from '../utils/pdfGenerator'

interface ReportCardProps {
  report: Report
  onView?: () => void
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onView }) => {
  const getReportTitle = () => {
    const titles = {
      story: 'Story Report',
      solution: 'Solution Blueprint',
      success: 'Success Playbook',
    }
    return titles[report.moduleType]
  }

  const getReportSubtitle = () => {
    const subtitles = {
      story: 'Brand Story & Ideal Audience',
      solution: 'Offer & Customer Journey',
      success: 'Outcomes, Metrics & 90-Day Plan',
    }
    return subtitles[report.moduleType]
  }

  const handleDownload = () => {
    const text = generatePDFText(report)
    const filename = `${getReportTitle().toLowerCase().replace(/\s+/g, '-')}-${new Date(report.generatedAt).toISOString().split('T')[0]}.txt`
    downloadTextFile(text, filename)
  }

  const handleCopy = async () => {
    const text = generatePDFText(report)
    try {
      await navigator.clipboard.writeText(text)
      alert('Report copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard. Please use download instead.')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">{getReportTitle()}</h3>
        <p className="text-xs text-slate-400 italic">{getReportSubtitle()}</p>
        <p className="text-xs text-slate-500 mt-2">
          Generated: {new Date(report.generatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        {onView && (
          <button
            onClick={onView}
            className="flex-1 rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors"
          >
            View
          </button>
        )}
        <button
          onClick={handleDownload}
          className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-lime-400 hover:text-lime-300 transition-colors"
        >
          Download
        </button>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-lime-400 hover:text-lime-300 transition-colors"
          title="Copy to clipboard"
        >
          Copy
        </button>
      </div>
    </div>
  )
}

export default ReportCard

