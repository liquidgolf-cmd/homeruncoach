import React from 'react'

const WhoItsFor: React.FC = () => {
  return (
    <section className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Built for real people building real businesses
        </h2>
        
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {/* Solo founders & creators */}
          <div>
            <h3 className="text-lg font-semibold text-slate-50">
              Solo founders & creators
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Turn scattered ideas into one clear direction.
            </p>
          </div>

          {/* Small business owners */}
          <div>
            <h3 className="text-lg font-semibold text-slate-50">
              Small business owners
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Tighten your message, offers, and next 90 days.
            </p>
          </div>

          {/* Coaches & consultants */}
          <div>
            <h3 className="text-lg font-semibold text-slate-50">
              Coaches & consultants
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Use the framework with your clients and let AI handle the heavy lifting.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400 max-w-2xl mx-auto">
          If you&apos;re tired of vague advice and endless &quot;content&quot; and just want a clear path forward, this is for you.
        </p>
      </div>
    </section>
  )
}

export default WhoItsFor

