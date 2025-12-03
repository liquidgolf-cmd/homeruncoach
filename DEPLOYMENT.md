# Deployment Guide

## GitHub Pages Deployment

The app is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Setup Steps:

1. **Enable GitHub Pages in Repository Settings:**
   - Go to your repository: https://github.com/liquidgolf-cmd/homeruncoach
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - Save

2. **Automatic Deployment:**
   - The workflow (`.github/workflows/deploy.yml`) will automatically deploy on every push to `main`
   - You can also trigger manually from the Actions tab

3. **Access Your Deployed App:**
   - Once deployed, your app will be available at:
   - `https://liquidgolf-cmd.github.io/homeruncoach/`

### Build Status:

✅ TypeScript compilation: Passing
✅ Vite build: Successful
✅ All linting errors: Resolved

### Manual Build:

To build locally:
```bash
npm install
npm run build
```

The built files will be in the `dist/` directory.

### Local Testing:

**For development (uses root paths):**
```bash
npm run dev
```

**For testing production build locally:**
```bash
npm run build
npm run preview:github
```

This will serve the production build with the correct base path for GitHub Pages.

**Note:** If you see 404 errors for CSS/JS files:
- Make sure you're using `npm run preview:github` (not just `npm run preview`)
- Or access the deployed version at: `https://liquidgolf-cmd.github.io/homeruncoach/`

### Troubleshooting:

- If deployment fails, check the Actions tab for error logs
- Ensure GitHub Pages is enabled in repository settings
- Verify the base path in `vite.config.ts` matches your repository name

