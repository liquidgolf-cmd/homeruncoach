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
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com/))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Anthropic API key
VITE_ANTHROPIC_API_KEY=your_api_key_here
VITE_CLAUDE_MODEL=claude-sonnet-4-20250514
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Claude API Configuration

The app uses Anthropic's Claude API (Sonnet 4 or 4.5) for AI coaching. 

**Required:**
- `VITE_ANTHROPIC_API_KEY`: Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)

**Optional:**
- `VITE_CLAUDE_MODEL`: Choose between:
  - `claude-sonnet-4-20250514` (default)
  - `claude-sonnet-4-5-20250514`

**Note:** If the API key is not configured, the app will fall back to mock responses for demonstration purposes.

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

### Phase 3: AI Coaching Module System ✅
- Chat interface with MessageBubble and ChatInterface components
- AI coaching system implementing all 8 coaching qualities:
  - Act like you've built and led something
  - Listen more than you talk
  - Challenge without shaming
  - Bring structure, not chaos
  - Focus on the user
  - Hold strong ethics and boundaries
  - Measure success with the user
  - Make user less dependent over time
- 4-phase chat flow for each module:
  - Warm-up & framing
  - Guided questions
  - AI-generated draft(s)
  - Review & confirm
- Module-specific prompts for Story, Solution, and Success
- useAICoach hook for AI interactions
- ModuleChat page with progress tracking and sidebar
- Conversation storage utilities
- Module-specific question flows
- Progress indicators and phase tracking

### Phase 4: Report Generation ✅
- Report types and interfaces for all three modules
- Report generation from completed conversations
- ReportCard component for displaying reports
- ReportViewer page with formatted report display
- PDF/text export functionality (download and copy to clipboard)
- Report storage and retrieval
- Support for Story, Solution, and Success reports

### Phase 5: Business Action Plan Compilation ✅
- ActionPlan page for viewing compiled plans
- Automatic plan compilation when all three modules complete
- Combines Story, Solution, and Success into comprehensive plan
- Export functionality for compiled plans
- Dashboard integration showing Business Action Plan when ready
- Support for viewing plans by ID or project ID

## Next Steps

- Phase 2: User Authentication & Dashboard
- Phase 3: AI Coaching Module System
- Phase 4: Report Generation
- Phase 5: Business Action Plan Compilation
- Phase 6: Payment Integration
- Phase 7: Polish & Optimization

## License

Private project - All rights reserved

