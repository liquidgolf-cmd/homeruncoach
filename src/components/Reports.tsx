import React from 'react'

const Reports: React.FC = () => {
  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Every conversation turns into a real document you can build from
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
          Complete each module to get a focused report. Finish all three to compile your full Business Action Plan.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Story Report Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
              Report 1
            </p>
            <h3 className="mt-2 text-lg font-semibold">Story Report</h3>
            <p className="mt-2 text-xs italic text-slate-400">
              Brand Story & Ideal Audience
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              <li>• Founder Why Statement</li>
              <li>• Brand Story paragraph</li>
              <li>• Ideal Client Profile</li>
            </ul>
          </div>

          {/* Solution Blueprint Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
              Report 2
            </p>
            <h3 className="mt-2 text-lg font-semibold">Solution Blueprint</h3>
            <p className="mt-2 text-xs italic text-slate-400">
              Offer & Customer Journey
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              <li>• Core Value Proposition</li>
              <li>• Offer outline & delivery steps</li>
              <li>• Customer Journey Map</li>
            </ul>
          </div>

          {/* Success Playbook Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
              Report 3
            </p>
            <h3 className="mt-2 text-lg font-semibold">Success Playbook</h3>
            <p className="mt-2 text-xs italic text-slate-400">
              Outcomes, Metrics & 90-Day Plan
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              <li>• HomeRun Outcome Statement</li>
              <li>• Tangible & intangible success metrics</li>
              <li>• 90-day project list & first steps</li>
            </ul>
          </div>
        </div>

        {/* Business Action Plan Card */}
        <div className="mt-10 rounded-2xl border-2 border-lime-400/30 bg-slate-900/80 p-6">
          <h3 className="text-xl font-semibold">Business Action Plan</h3>
          <p className="mt-2 text-sm text-slate-300">
            When you&apos;ve finished one, two, or all three modules, click &quot;Compile My Plan&quot;
            and HomeRun Coach AI generates a clean, exportable Business Action Plan
            you can share with partners, team members, or investors.
          </p>
          <button className="mt-4 text-sm font-semibold text-lime-300 hover:text-lime-200 transition-colors">
            See a sample Business Action Plan →
          </button>
        </div>
      </div>
    </section>
  )
}

export default Reports

