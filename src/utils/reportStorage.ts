import { Report, BusinessActionPlan } from '../types/report'

const REPORT_STORAGE_PREFIX = 'homeruncoach_report_'
const PLAN_STORAGE_PREFIX = 'homeruncoach_plan_'

export const saveReport = (report: Report): void => {
  const key = `${REPORT_STORAGE_PREFIX}${report.id}`
  localStorage.setItem(key, JSON.stringify(report))
}

export const getReport = (reportId: string): Report | null => {
  const key = `${REPORT_STORAGE_PREFIX}${reportId}`
  const data = localStorage.getItem(key)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export const getReportsByProject = (projectId: string): Report[] => {
  const reports: Report[] = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(REPORT_STORAGE_PREFIX)) {
      try {
        const report = JSON.parse(localStorage.getItem(key) || '{}') as Report
        if (report.projectId === projectId) {
          reports.push(report)
        }
      } catch {
        // Skip invalid entries
      }
    }
  }
  
  return reports.sort((a, b) => 
    new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  )
}

export const saveBusinessActionPlan = (plan: BusinessActionPlan): void => {
  const key = `${PLAN_STORAGE_PREFIX}${plan.id}`
  localStorage.setItem(key, JSON.stringify(plan))
}

export const getBusinessActionPlan = (planId: string): BusinessActionPlan | null => {
  const key = `${PLAN_STORAGE_PREFIX}${planId}`
  const data = localStorage.getItem(key)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export const getBusinessActionPlanByProject = (projectId: string): BusinessActionPlan | null => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(PLAN_STORAGE_PREFIX)) {
      try {
        const plan = JSON.parse(localStorage.getItem(key) || '{}') as BusinessActionPlan
        if (plan.projectId === projectId) {
          return plan
        }
      } catch {
        // Skip invalid entries
      }
    }
  }
  return null
}

