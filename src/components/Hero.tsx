import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
            Story · Solution · Success
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Turn your ideas into a clear business plan
            <span className="block text-lime-300">
              with an AI coach that thinks like a real founder.
            </span>
          </h1>
          <p className="max-w-xl text-sm text-slate-300 md:text-base">
            HomeRun Coach AI walks you through Story, Solution, and Success
            so you walk away with real reports and a concrete Business
            Action Plan—no more scattered notes and half-finished ideas.
          </p>
          <div className="flex flex-wrap items-center gap-4" id="cta">
            <a
              href="#how-it-works"
              className="rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-lime-300 transition-colors"
            >
              Start with Story
            </a>
            <button className="rounded-full border border-slate-600 px-6 py-2.5 text-sm hover:border-lime-300 transition-colors">
              Watch how it works
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <span>✓ AI-guided coaching</span>
            <span>✓ Downloadable reports</span>
            <span>✓ Actionable in one session</span>
          </div>
        </div>

        {/* Placeholder for hero mock / chat preview */}
        <div className="flex-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>Sample AI Coaching Chat</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                Live demo soon
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl bg-slate-800/80 p-3">
                <p className="text-slate-200 font-semibold">
                  Coach · Story
                </p>
                <p className="text-slate-300 mt-1">
                  What I hear you saying is that you want this business to
                  give you more time with your family and help founders who
                  feel stuck. Did I get that right?
                </p>
              </div>
              <div className="ml-auto max-w-[80%] rounded-xl bg-lime-400 px-3 py-2 text-slate-950">
                <p>Yes. That&apos;s exactly it.</p>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-3">
                <p className="text-slate-200 font-semibold">
                  Coach · Next Step
                </p>
                <p className="text-slate-300 mt-1">
                  Great. Let&apos;s turn that into a one-paragraph Brand
                  Story you can use on your website. I&apos;ll draft it,
                  then we&apos;ll refine it together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

