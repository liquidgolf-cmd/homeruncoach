# HomeRun Coach AI

A full-stack web application that helps founders and business owners create clear business plans through AI-powered coaching. The app guides users through three modules (Story, Solution, Success) and generates downloadable reports and a compiled Business Action Plan.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── AICoaching.tsx
│   ├── Reports.tsx
│   ├── WhoItsFor.tsx
│   ├── Pricing.tsx
│   ├── FAQ.tsx
│   └── Footer.tsx
├── pages/              # Page components
│   └── LandingPage.tsx
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## Features Implemented

### Phase 1: Landing Page ✅
- Landing page with all 9 sections
- Navbar with mobile menu
- Hero section with CTA
- How It Works (3 module cards)
- AI Coaching explanation
- Reports showcase
- Who It's For
- Pricing section
- FAQ section
- Footer
- Responsive design (mobile-first)
- Smooth scrolling navigation
- Dark theme with custom colors (slate-950, lime-400)

### Phase 2: Authentication & Dashboard ✅
- User authentication system (login/signup)
- AuthContext for state management
- Protected routes
- User dashboard with:
  - Active projects overview
  - Module progress tracking
  - Generated reports count
  - Quick start module selection
- Session management (localStorage-based, ready for backend integration)

## Next Steps

- Phase 2: User Authentication & Dashboard
- Phase 3: AI Coaching Module System
- Phase 4: Report Generation
- Phase 5: Business Action Plan Compilation
- Phase 6: Payment Integration
- Phase 7: Polish & Optimization

## License

Private project - All rights reserved

