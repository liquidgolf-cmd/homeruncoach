import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import { BusinessActionPlan } from '../types/report'
import { getBusinessActionPlanByProject, getBusinessActionPlan } from '../utils/reportStorage'
import { generateActionPlanPDFText, downloadTextFile } from '../utils/pdfGenerator'

const ActionPlan: React.FC = () => {
  const { planId, projectId } = useParams<{ planId?: string; projectId?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [plan, setPlan] = useState<BusinessActionPlan | null>(null)

  useEffect(() => {
    if (planId) {
      const foundPlan = getBusinessActionPlan(planId)
      setPlan(foundPlan)
    } else if (projectId) {
      const foundPlan = getBusinessActionPlanByProject(projectId)
      setPlan(foundPlan)
    }
  }, [planId, projectId])

  if (!plan) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 mb-4">Business Action Plan not found</p>
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

  const handleDownload = () => {
    const text = generateActionPlanPDFText(plan)
    const filename = `business-action-plan-${new Date(plan.generatedAt).toISOString().split('T')[0]}.txt`
    downloadTextFile(text, filename)
  }

  const handleCopy = async () => {
    const text = generateActionPlanPDFText(plan)
    try {
      await navigator.clipboard.writeText(text)
      alert('Business Action Plan copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
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
                <h1 className="text-xl font-semibold">Business Action Plan</h1>
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

        {/* Plan Content */}
        <main className="mx-auto max-w-4xl px-4 py-8">
          {/* Cover */}
          <div className="rounded-2xl border-2 border-lime-400/30 bg-gradient-to-br from-slate-900/60 to-slate-800/40 p-8 mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">{plan.cover.businessName}</h1>
            <p className="text-xl text-lime-300 mb-4">{plan.cover.tagline}</p>
            <p className="text-slate-300">{plan.cover.overview}</p>
            <p className="text-sm text-slate-400 mt-4">
              Generated: {new Date(plan.generatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1: Story */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h2 className="text-2xl font-semibold mb-6">Section 1: Story</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Founder Why Statement</h3>
                  <p className="text-slate-300">{plan.story.founderWhy}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Brand Story</h3>
                  <p className="text-slate-300">{plan.story.brandStory}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Ideal Client Profile</h3>
                  <div className="space-y-2 text-slate-300">
                    {plan.story.idealClientProfile.name && (
                      <p><strong>Name:</strong> {plan.story.idealClientProfile.name}</p>
                    )}
                    {plan.story.idealClientProfile.demographics && (
                      <p><strong>Demographics:</strong> {plan.story.idealClientProfile.demographics}</p>
                    )}
                    {plan.story.idealClientProfile.situation && (
                      <p><strong>Situation:</strong> {plan.story.idealClientProfile.situation}</p>
                    )}
                    {plan.story.idealClientProfile.pains?.length > 0 && (
                      <div>
                        <strong>Pains:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {plan.story.idealClientProfile.pains.map((pain, i) => (
                            <li key={i}>{pain}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {plan.story.idealClientProfile.desires?.length > 0 && (
                      <div>
                        <strong>Desires:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {plan.story.idealClientProfile.desires.map((desire, i) => (
                            <li key={i}>{desire}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Solution */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h2 className="text-2xl font-semibold mb-6">Section 2: Solution</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Core Value Proposition</h3>
                  <p className="text-slate-300">{plan.solution.valueProposition}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Offer Overview</h3>
                  <div className="space-y-2 text-slate-300">
                    <p><strong>Name:</strong> {plan.solution.offerOverview.name}</p>
                    <p><strong>Format:</strong> {plan.solution.offerOverview.format}</p>
                    <p><strong>Who It's For:</strong> {plan.solution.offerOverview.whoItsFor}</p>
                    <p><strong>Main Promise:</strong> {plan.solution.offerOverview.mainPromise}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Delivery Framework</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                    {plan.solution.deliveryFramework.steps.map((step, i) => (
                      <li key={i}>
                        <strong>{step.name}:</strong> {step.description}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Journey Map</h3>
                  <div className="space-y-3 text-slate-300">
                    {plan.solution.customerJourney.stages.map((stage, i) => (
                      <div key={i} className="border-l-2 border-lime-400 pl-4">
                        <strong>{stage.stage}:</strong> {stage.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Success */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h2 className="text-2xl font-semibold mb-6">Section 3: Success</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">HomeRun Outcome Statement</h3>
                  <p className="text-slate-300">{plan.success.homeRunOutcome}</p>
                </div>

                {plan.success.tangibleOutcomes?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tangible Outcomes</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                      {plan.success.tangibleOutcomes.map((outcome, i) => (
                        <li key={i}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.success.intangibleOutcomes?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Intangible Outcomes</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                      {plan.success.intangibleOutcomes.map((outcome, i) => (
                        <li key={i}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.success.successMetrics?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Success Metrics</h3>
                    <div className="space-y-2 text-slate-300">
                      {plan.success.successMetrics.map((metric, i) => (
                        <div key={i}>
                          <strong>{metric.metric}:</strong> {metric.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Section 4: Action Plan */}
            <section className="rounded-2xl border-2 border-lime-400/30 bg-slate-900/60 p-8">
              <h2 className="text-2xl font-semibold mb-6">Section 4: Action Plan</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">90-Day Strategic Projects</h3>
                  <div className="space-y-4">
                    {plan.actionPlan.projects.map((project, i) => (
                      <div key={i} className="border border-slate-700 rounded-lg p-4">
                        <h4 className="font-semibold text-lime-300 mb-2">
                          Project {i + 1}: {project.name}
                        </h4>
                        <p className="text-sm text-slate-400 mb-3">{project.whyItMatters}</p>
                        <div className="mb-3">
                          <strong className="text-slate-300 text-sm">Tasks:</strong>
                          <ul className="list-disc list-inside ml-4 mt-1 text-slate-300 text-sm">
                            {project.tasks.map((task, j) => (
                              <li key={j}>{task}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-sm text-slate-400">Target Date: {project.targetDate}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {plan.actionPlan.immediateNextSteps?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Immediate Next Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                      {plan.actionPlan.immediateNextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default ActionPlan

