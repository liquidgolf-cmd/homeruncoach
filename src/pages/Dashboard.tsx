import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Report, BusinessActionPlan } from '../types/report'
import { getReportsByProject, getBusinessActionPlanByProject } from '../utils/reportStorage'
import { compileBusinessActionPlan } from '../utils/reportGenerator'
import { saveBusinessActionPlan } from '../utils/reportStorage'
import ReportCard from '../components/ReportCard'
import { getAllConversations } from '../utils/conversationStorage'
import { Conversation } from '../types/module'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [actionPlan, setActionPlan] = useState<BusinessActionPlan | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])

  // Mock data - will be replaced with real data from backend
  const projects = [
    {
      id: 'project_1',
      name: 'My First Business',
      createdAt: '2024-01-15',
      modules: {
        story: { completed: true, completedAt: '2024-01-16' },
        solution: { completed: false, completedAt: null },
        success: { completed: false, completedAt: null },
      },
    },
  ]

  useEffect(() => {
    // Load reports for all projects
    const allReports: Report[] = []
    projects.forEach(project => {
      const projectReports = getReportsByProject(project.id)
      allReports.push(...projectReports)
      
      // Check if all three modules are complete and compile action plan
      const storyReport = projectReports.find(r => r.moduleType === 'story')
      const solutionReport = projectReports.find(r => r.moduleType === 'solution')
      const successReport = projectReports.find(r => r.moduleType === 'success')
      
      if (storyReport && solutionReport && successReport) {
        // Check if plan already exists
        let plan = getBusinessActionPlanByProject(project.id)
        if (!plan) {
          // Compile new plan
          plan = compileBusinessActionPlan(storyReport, solutionReport, successReport, project.id)
          saveBusinessActionPlan(plan)
        }
        setActionPlan(plan)
      }
    })
    setReports(allReports)
    
    // Load conversations
    const allConversations = getAllConversations()
    setConversations(allConversations)
  }, [])

  const completedModules = projects.reduce((acc, project) => {
    return acc + Object.values(project.modules).filter((m) => m.completed).length
  }, 0)

  const totalModules = projects.length * 3

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-lime-400/10 px-2 py-1 text-xs font-semibold text-lime-300">
                BETA
              </span>
              <span className="text-lg font-bold tracking-tight">HomeRun Coach AI</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">{user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-slate-400 hover:text-lime-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-slate-400">Continue building your business plan</p>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-sm text-slate-400 mb-1">Active Projects</div>
            <div className="text-3xl font-bold">{projects.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-sm text-slate-400 mb-1">Completed Modules</div>
            <div className="text-3xl font-bold">
              {completedModules} / {totalModules}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-sm text-slate-400 mb-1">Generated Reports</div>
            <div className="text-3xl font-bold">{completedModules}</div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Projects</h2>
            <button className="rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors">
              + New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <p className="text-slate-400 mb-4">You don't have any projects yet.</p>
              <button className="rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors">
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => {
                const moduleProgress = Object.values(project.modules).filter((m) => m.completed)
                  .length
                const isComplete = moduleProgress === 3

                return (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                        <p className="text-xs text-slate-400">
                          Created {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {isComplete && (
                        <span className="rounded-full bg-lime-400/20 px-2 py-1 text-xs font-semibold text-lime-300">
                          Complete
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>
                          {moduleProgress} / 3 modules
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-lime-400 transition-all"
                          style={{ width: `${(moduleProgress / 3) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {['story', 'solution', 'success'].map((moduleType) => {
                        const module = project.modules[moduleType as keyof typeof project.modules]
                        return (
                          <div
                            key={moduleType}
                            className={`rounded-lg p-2 text-center text-xs ${
                              module.completed
                                ? 'bg-lime-400/20 text-lime-300'
                                : 'bg-slate-800/50 text-slate-400'
                            }`}
                          >
                            {moduleType.charAt(0).toUpperCase() + moduleType.slice(1)}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-2">
                      {isComplete ? (
                        <Link
                          to="/action-plan"
                          className="flex-1 rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors text-center"
                        >
                          View Action Plan
                        </Link>
                      ) : (
                        <Link
                          to={`/module/${!project.modules.story.completed ? 'story' : !project.modules.solution.completed ? 'solution' : 'success'}`}
                          className="flex-1 rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors text-center"
                        >
                          Continue
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Business Action Plan Section */}
        {actionPlan && (
          <div className="mb-8 rounded-2xl border-2 border-lime-400/30 bg-gradient-to-br from-slate-900/60 to-slate-800/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Business Action Plan</h2>
                <p className="text-sm text-slate-400">
                  Complete plan compiled from all three modules
                </p>
              </div>
              <Link
                to={`/action-plan/${actionPlan.id}`}
                className="rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors"
              >
                View Full Plan
              </Link>
            </div>
            <p className="text-slate-300 text-sm">
              {actionPlan.cover.overview}
            </p>
          </div>
        )}

        {/* Conversations Section */}
        {conversations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Your Conversations</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  to={`/conversation/${conversation.id}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-lime-400/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-lime-300 mb-1">
                        {conversation.moduleType.charAt(0).toUpperCase() + conversation.moduleType.slice(1)} Module
                      </h3>
                      <p className="text-xs text-slate-400">
                        {conversation.messages.length} messages
                      </p>
                    </div>
                    {conversation.completed && (
                      <span className="rounded-full bg-lime-400/20 px-2 py-1 text-xs font-semibold text-lime-300">
                        Complete
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reports Section */}
        {reports.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Reports</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={() => window.location.href = `/report/${report.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Start Section */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-800/40 p-8">
          <h2 className="text-xl font-semibold mb-4">Start a New Module</h2>
          <p className="text-slate-400 mb-6">
            Choose a module to begin or continue your business planning journey.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: 'Story', description: 'Clarify your WHY and WHO', color: 'lime' },
              { name: 'Solution', description: 'Design your WHAT and HOW', color: 'lime' },
              { name: 'Success', description: 'Define your outcomes', color: 'lime' },
            ].map((module) => (
              <Link
                key={module.name}
                to={`/module/${module.name.toLowerCase()}`}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-lime-400/50 transition-colors"
              >
                <div className="text-sm font-semibold text-lime-300 mb-1">{module.name}</div>
                <div className="text-xs text-slate-400">{module.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

