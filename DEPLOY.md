# Deploying to GitHub

Your code has been committed locally. Follow these steps to push to GitHub:

## Option 1: Using GitHub Website (Recommended)

1. Go to https://github.com/new
2. Create a new repository named `HomeRunCoach` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/HomeRunCoach.git`)

Then run these commands:

```bash
cd /Users/michaelhill/Documents/GitHub/HomeRunCoach
git remote add origin https://github.com/yourusername/HomeRunCoach.git
git push -u origin main
```

## Option 2: Using GitHub CLI (if you install it)

If you install GitHub CLI (`brew install gh`), you can run:

```bash
cd /Users/michaelhill/Documents/GitHub/HomeRunCoach
gh repo create HomeRunCoach --public --source=. --remote=origin --push
```

## After Pushing

Once pushed, you can:
- View your code on GitHub
- Set up GitHub Pages for deployment (if desired)
- Add collaborators
- Set up CI/CD workflows

## Current Status

✅ Git repository initialized
✅ All files committed
✅ Ready to push to GitHub

