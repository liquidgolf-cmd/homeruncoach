import React from 'react'

const AICoaching: React.FC = () => {
  return (
    <section
      id="ai-coaching"
      className="border-b border-slate-800 bg-slate-900"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          AI coaching that behaves like a seasoned business mentor
        </h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-sm text-slate-300">
            <p>
              HomeRun Coach AI is built on the qualities of a real coach:
              it listens more than it talks, asks sharp questions, and
              gently challenges you to get specific.
            </p>
            <ul className="space-y-2">
              <li>• Reflects your words back before advising you</li>
              <li>• Calls out vagueness without shaming you</li>
              <li>• Ends each session with clear next steps</li>
              <li>• Adapts to your stage, industry, and style</li>
            </ul>
            <p>
              Underneath every conversation is a proven coaching process:
              Story, Solution, Success. No more &quot;vibes only&quot; advice.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-300">
            <h3 className="text-base font-semibold text-slate-50">
              What a typical session feels like
            </h3>
            <ol className="mt-4 space-y-3 list-decimal list-inside">
              <li>You pick a module: Story, Solution, or Success.</li>
              <li>The coach asks 1 focused question at a time.</li>
              <li>
                It paraphrases what you said: &quot;What I hear you saying is...&quot;
              </li>
              <li>
                It challenges you to add metrics, dates, and ownership.
              </li>
              <li>
                It generates a polished report and action steps you can
                download or revisit.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AICoaching

