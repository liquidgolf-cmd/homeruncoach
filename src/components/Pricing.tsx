import React from 'react'

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Simple pricing, built for builders
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
          One clear plan. Unlimited sessions. Keep every report and Business
          Action Plan you create.
        </p>

        <div className="mt-8 max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold">HomeRun Builder</h3>
          <p className="mt-2 text-sm text-slate-300">
            Full access to Story, Solution, and Success modules.
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">$X</span>
            <span className="text-sm text-slate-400">per month</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>• Unlimited AI coaching sessions</li>
            <li>• Downloadable reports (PDF / copy-paste)</li>
            <li>• Compiled Business Action Plan</li>
            <li>• Lifetime access to your previous projects</li>
          </ul>
          <button className="mt-6 w-full rounded-full bg-lime-400 py-2.5 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors">
            Become a founding member
          </button>
          <p className="mt-3 text-xs text-slate-400">
            No contracts. Cancel anytime. Founding member pricing will
            increase as new features roll out.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing

