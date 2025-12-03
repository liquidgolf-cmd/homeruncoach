import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import AICoaching from '../components/AICoaching'
import Reports from '../components/Reports'
import WhoItsFor from '../components/WhoItsFor'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AICoaching />
        <Reports />
        <WhoItsFor />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage

