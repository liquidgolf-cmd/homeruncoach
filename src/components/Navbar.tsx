import React, { useState } from 'react'

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-lime-400/10 px-2 py-1 text-xs font-semibold text-lime-300">
            BETA
          </span>
          <span className="text-lg font-bold tracking-tight">
            HomeRun Coach AI
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <a href="#how-it-works" className="hover:text-lime-300 transition-colors">
            How it works
          </a>
          <a href="#ai-coaching" className="hover:text-lime-300 transition-colors">
            AI Coaching
          </a>
          <a href="#pricing" className="hover:text-lime-300 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-lime-300 transition-colors">
            FAQ
          </a>
          <a
            href="#cta"
            className="rounded-full bg-lime-400 px-4 py-2 text-slate-950 font-semibold hover:bg-lime-300 transition-colors"
          >
            Get Started
          </a>
        </nav>
        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-300 hover:text-lime-300 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-4 space-y-3">
            <a
              href="#how-it-works"
              className="block text-sm hover:text-lime-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </a>
            <a
              href="#ai-coaching"
              className="block text-sm hover:text-lime-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              AI Coaching
            </a>
            <a
              href="#pricing"
              className="block text-sm hover:text-lime-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="block text-sm hover:text-lime-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#cta"
              className="block rounded-full bg-lime-400 px-4 py-2 text-sm text-center text-slate-950 font-semibold hover:bg-lime-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar

