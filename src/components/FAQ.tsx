import React from 'react'

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 text-sm text-slate-300">
          <div>
            <h3 className="font-semibold text-slate-50">
              Do I need to have a business already?
            </h3>
            <p className="mt-2">
              Nope. You can come in with nothing but an idea. Start with the
              Story module to clarify your direction and ideal audience.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-50">
              How is this different from a generic AI chatbot?
            </h3>
            <p className="mt-2">
              HomeRun Coach AI follows a specific coaching framework—
              Story, Solution, Success—and behaves like a seasoned business
              coach, not a random assistant.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-50">
              Can I use this with my clients?
            </h3>
            <p className="mt-2">
              Yes. Many coaches and consultants run their clients through
              each module and export the reports as part of their paid
              process.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-50">
              Can I just do one module?
            </h3>
            <p className="mt-2">
              Absolutely. Each module stands alone and delivers a focused
              report. When you complete all three, you can compile
              everything into a full Business Action Plan.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ

