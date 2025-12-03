import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row">
        <p>© {new Date().getFullYear()} HomeRun Coach AI. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-lime-300 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-lime-300 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-lime-300 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

