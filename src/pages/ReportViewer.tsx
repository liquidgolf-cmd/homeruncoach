import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import { Report } from '../types/report'
import { generatePDFText, downloadTextFile } from '../utils/pdfGenerator'

const ReportViewer: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  // In production, fetch report from API
  // For now, we'll use localStorage
  const getReport = (): Report | null => {
    if (!reportId) return null
    const key = `homeruncoach_report_${reportId}`
    const data = localStorage.getItem(key)
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  const report = getReport()

  if (!report) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 mb-4">Report not found</p>
            <Link
              to="/dashboard"
              className="text-lime-300 hover:text-lime-200"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const getReportTitle = () => {
    const titles = {
      story: 'Story Report: Brand Story & Ideal Audience',
      solution: 'Solution Blueprint: Offer & Customer Journey',
      success: 'Success Playbook: Outcomes, Metrics & 90-Day Plan',
    }
    return titles[report.moduleType]
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
    }
  }

  const renderReportContent = () => {
    switch (report.moduleType) {
      case 'story':
        return renderStoryReport(report.content as any)
      case 'solution':
        return renderSolutionReport(report.content as any)
      case 'success':
        return renderSuccessReport(report.content as any)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/60">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  to="/dashboard"
                  className="text-sm text-slate-400 hover:text-lime-300 transition-colors mb-2 inline-block"
                >
                  ← Dashboard
                </Link>
                <h1 className="text-xl font-semibold">{getReportTitle()}</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-lime-400 hover:text-lime-300 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Report Content */}
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <div className="prose prose-invert max-w-none">
              {renderReportContent()}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

const renderStoryReport = (content: any) => (
  <div className="space-y-6">
    <section>
      <h2 className="text-2xl font-semibold mb-4">Founder Why Statement</h2>
      <p className="text-slate-300">{content.founderWhy}</p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">Brand Story</h2>
      <p className="text-slate-300">{content.brandStory}</p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">Ideal Client Profile</h2>
      <div className="space-y-3 text-slate-300">
        {content.idealClientProfile.name && (
          <p><strong>Name:</strong> {content.idealClientProfile.name}</p>
        )}
        {content.idealClientProfile.demographics && (
          <p><strong>Demographics:</strong> {content.idealClientProfile.demographics}</p>
        )}
        {content.idealClientProfile.situation && (
          <p><strong>Situation:</strong> {content.idealClientProfile.situation}</p>
        )}
        {content.idealClientProfile.pains?.length > 0 && (
          <div>
            <strong>Pains:</strong>
            <ul className="list-disc list-inside ml-4">
              {content.idealClientProfile.pains.map((pain: string, i: number) => (
                <li key={i}>{pain}</li>
              ))}
            </ul>
          </div>
        )}
        {content.idealClientProfile.desires?.length > 0 && (
          <div>
            <strong>Desires:</strong>
            <ul className="list-disc list-inside ml-4">
              {content.idealClientProfile.desires.map((desire: string, i: number) => (
                <li key={i}>{desire}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>

    {content.storyKeywords?.length > 0 && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">Story Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {content.storyKeywords.map((keyword: string, i: number) => (
            <span
              key={i}
              className="rounded-full bg-lime-400/20 px-3 py-1 text-xs text-lime-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      </section>
    )}
  </div>
)

const renderSolutionReport = (content: any) => (
  <div className="space-y-6">
    <section>
      <h2 className="text-2xl font-semibold mb-4">Core Value Proposition</h2>
      <p className="text-slate-300">{content.valueProposition}</p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">Primary Offer Overview</h2>
      <div className="space-y-2 text-slate-300">
        <p><strong>Name:</strong> {content.offerOverview.name}</p>
        <p><strong>Format:</strong> {content.offerOverview.format}</p>
        <p><strong>Who It's For:</strong> {content.offerOverview.whoItsFor}</p>
        <p><strong>Main Promise:</strong> {content.offerOverview.mainPromise}</p>
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">Delivery Framework</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
        {content.deliveryFramework.steps.map((step: any, i: number) => (
          <li key={i}>
            <strong>{step.name}:</strong> {step.description}
          </li>
        ))}
      </ol>
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">Customer Journey Map</h2>
      <div className="space-y-3 text-slate-300">
        {content.customerJourney.stages.map((stage: any, i: number) => (
          <div key={i} className="border-l-2 border-lime-400 pl-4">
            <strong>{stage.stage}:</strong> {stage.description}
          </div>
        ))}
      </div>
    </section>

    {content.suggestedNextMoves?.length > 0 && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">Suggested Next Moves</h2>
        <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
          {content.suggestedNextMoves.map((move: string, i: number) => (
            <li key={i}>{move}</li>
          ))}
        </ul>
      </section>
    )}
  </div>
)

const renderSuccessReport = (content: any) => (
  <div className="space-y-6">
    <section>
      <h2 className="text-2xl font-semibold mb-4">HomeRun Outcome Statement</h2>
      <p className="text-slate-300">{content.homeRunOutcome}</p>
    </section>

    {content.tangibleOutcomes?.length > 0 && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tangible Outcomes</h2>
        <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
          {content.tangibleOutcomes.map((outcome: string, i: number) => (
            <li key={i}>{outcome}</li>
          ))}
        </ul>
      </section>
    )}

    {content.intangibleOutcomes?.length > 0 && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">Intangible Outcomes</h2>
        <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
          {content.intangibleOutcomes.map((outcome: string, i: number) => (
            <li key={i}>{outcome}</li>
          ))}
        </ul>
      </section>
    )}

    {content.successMetrics?.length > 0 && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">Success Metrics</h2>
        <div className="space-y-3 text-slate-300">
          {content.successMetrics.map((metric: any, i: number) => (
            <div key={i}>
              <strong>{metric.metric}:</strong> {metric.description}
            </div>
          ))}
        </div>
      </section>
    )}

    {content.proofPlan && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">Proof Plan</h2>
        <div className="space-y-3 text-slate-300">
          <div>
            <strong>Testimonial Questions:</strong>
            <ul className="list-disc list-inside ml-4 mt-2">
              {content.proofPlan.testimonialQuestions.map((q: string, i: number) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
          <p><strong>Case Study Template:</strong> {content.proofPlan.caseStudyTemplate}</p>
        </div>
      </section>
    )}

    {content.actionPlan?.projects?.length > 0 && (
      <section>
        <h2 className="text-2xl font-semibold mb-4">90-Day Action Plan</h2>
        <div className="space-y-4">
          {content.actionPlan.projects.map((project: any, i: number) => (
            <div key={i} className="border border-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              <p className="text-slate-400 text-sm mb-3">{project.whyItMatters}</p>
              <div className="mb-3">
                <strong className="text-slate-300">Tasks:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 text-slate-300">
                  {project.tasks.map((task: string, j: number) => (
                    <li key={j}>{task}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-slate-400">Target Date: {project.targetDate}</p>
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
)

export default ReportViewer

