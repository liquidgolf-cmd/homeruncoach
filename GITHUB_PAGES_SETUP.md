# GitHub Pages Setup Instructions

## Current Status
The deployment workflow is configured, but GitHub Pages needs to be enabled in your repository settings.

## Step-by-Step Setup

### 1. Enable GitHub Pages
1. Go to: https://github.com/liquidgolf-cmd/homeruncoach/settings/pages
2. Under **"Source"**, select **"GitHub Actions"** (NOT "Deploy from a branch")
3. Click **"Save"**

### 2. Trigger Deployment
The workflow will automatically run when you:
- Push to the `main` branch (already done)
- Or manually trigger it:
  1. Go to: https://github.com/liquidgolf-cmd/homeruncoach/actions
  2. Click on "Deploy to GitHub Pages" workflow
  3. Click "Run workflow" → "Run workflow"

### 3. Wait for Deployment
- Check the Actions tab: https://github.com/liquidgolf-cmd/homeruncoach/actions
- Wait for the workflow to complete (usually 1-2 minutes)
- Look for a green checkmark ✅

### 4. Access Your Site
Once deployed, your site will be available at:
**https://liquidgolf-cmd.github.io/homeruncoach/**

## Troubleshooting

### If you see "404 - There isn't a GitHub Pages site here":
- ✅ Check that GitHub Pages is enabled (Step 1 above)
- ✅ Check that the workflow has run successfully in Actions tab
- ✅ Wait a few minutes after enabling - first deployment can take time
- ✅ Clear your browser cache and try again

### If the workflow fails:
- Check the Actions tab for error messages
- Ensure the build completes successfully locally: `npm run build`
- Verify all files are committed and pushed

### If assets still don't load:
- The base path is configured as `/homeruncoach/` in `vite.config.ts`
- Make sure you're accessing the full URL with the base path
- Check browser console for specific 404 errors

## Quick Check Commands

```bash
# Verify build works locally
npm run build

# Test preview locally
npm run preview
# Then visit: http://localhost:4173/homeruncoach/

# Check git status
git status

# Verify latest commit
git log --oneline -1
```

## Current Configuration
- ✅ Build workflow: `.github/workflows/deploy.yml`
- ✅ Base path: `/homeruncoach/` (configured in `vite.config.ts`)
- ✅ Build output: `dist/` directory
- ✅ Deployment: Automatic on push to `main`

