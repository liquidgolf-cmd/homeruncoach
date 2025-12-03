#!/bin/bash

# Script to create GitHub repository and push code
# Usage: ./create-github-repo.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
  echo "Usage: ./create-github-repo.sh YOUR_GITHUB_USERNAME"
  echo "Or set GITHUB_USERNAME environment variable"
  exit 1
fi

GITHUB_USERNAME=${1:-$GITHUB_USERNAME}
REPO_NAME="HomeRunCoach"

echo "Creating GitHub repository: $GITHUB_USERNAME/$REPO_NAME"

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
  echo "Using GitHub CLI..."
  gh repo create $REPO_NAME --public --source=. --remote=origin --push
  echo "✅ Repository created and code pushed!"
else
  echo "GitHub CLI not found. Using GitHub API..."
  
  # Check for GitHub token
  if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GITHUB_TOKEN not set. You'll need to:"
    echo "1. Create a Personal Access Token at: https://github.com/settings/tokens"
    echo "2. Set it: export GITHUB_TOKEN=your_token_here"
    echo "3. Run this script again"
    echo ""
    echo "Or create the repo manually at: https://github.com/new"
    echo "Then run: git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "And: git push -u origin main"
    exit 1
  fi
  
  # Create repo via API
  curl -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"$REPO_NAME\",\"description\":\"AI-powered business coaching platform - Turn your ideas into a clear business plan\",\"private\":false}"
  
  # Add remote and push
  git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
  git push -u origin main
  
  echo "✅ Repository created and code pushed!"
fi

