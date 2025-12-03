import React from 'react'

const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="border-b border-slate-800 bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          A simple 3-part path to a HomeRun business
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
          Start with Story, Solution, or Success. Each module gives you a
          focused, actionable report. Complete all three to generate your
          full Business Action Plan.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Story card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
              Module 1
            </p>
            <h3 className="mt-2 text-lg font-semibold">Story</h3>
            <p className="mt-2 text-sm text-slate-300">
              Clarify why you exist and who you&apos;re really here to
              serve.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              <li>• Founder WHY statement</li>
              <li>• Brand Story in plain language</li>
              <li>• Ideal audience profile</li>
            </ul>
            <button className="mt-4 text-xs font-semibold text-lime-300 hover:text-lime-200 transition-colors">
              Start the Story module →
            </button>
          </div>

          {/* Solution card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
              Module 2
            </p>
            <h3 className="mt-2 text-lg font-semibold">Solution</h3>
            <p className="mt-2 text-sm text-slate-300">
              Design the offers and experiences that actually help your
              people win.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              <li>• Clear value proposition</li>
              <li>• Offer outline & delivery steps</li>
              <li>• Simple customer journey map</li>
            </ul>
            <button className="mt-4 text-xs font-semibold text-lime-300 hover:text-lime-200 transition-colors">
              Design my Solution →
            </button>
          </div>

          {/* Success card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
              Module 3
            </p>
            <h3 className="mt-2 text-lg font-semibold">Success</h3>
            <p className="mt-2 text-sm text-slate-300">
              Define what a home run looks like—for them and for you.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              <li>• Client outcome statement</li>
              <li>• Tangible & intangible metrics</li>
              <li>• 90-day action plan</li>
            </ul>
            <button className="mt-4 text-xs font-semibold text-lime-300 hover:text-lime-200 transition-colors">
              Plan for Success →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

