# Vercel Deployment Guide

## Quick Deploy

The app is configured for Vercel deployment with root base paths.

### Automatic Deployment

1. **Connect Repository to Vercel:**
   - Go to https://vercel.com
   - Import your repository: `liquidgolf-cmd/homeruncoach`
   - Vercel will auto-detect the Vite configuration

2. **Build Settings (Auto-configured):**
   - Framework Preset: Vite
   - Build Command: `VITE_BASE_PATH=/ npm run build` (set in vercel.json)
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy:**
   - Click "Deploy"
   - Your app will be live at: `https://homeruncoach.vercel.app`

## Configuration

The `vercel.json` file is already configured with:
- ✅ Root base path (`VITE_BASE_PATH=/`)
- ✅ SPA routing (all routes → index.html)
- ✅ Correct build command

## Environment Variables (Optional)

If you need to override the base path, you can set in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add: `VITE_BASE_PATH` = `/`

## Troubleshooting

### If assets don't load (404 errors):
- ✅ Verify `vercel.json` is in the repository
- ✅ Check that build command includes `VITE_BASE_PATH=/`
- ✅ Clear Vercel cache and redeploy
- ✅ Check browser console for specific asset paths

### If routing doesn't work:
- ✅ Verify the `rewrites` rule in `vercel.json` is correct
- ✅ Ensure React Router is using BrowserRouter (already configured)

## Current Status

✅ Vercel configuration: `vercel.json` created
✅ Base path: Root (`/`) for Vercel
✅ SPA routing: Configured
✅ Build command: Set with correct environment variable

Your app should deploy successfully to Vercel!

