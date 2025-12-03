#!/bin/bash

# Quick script to push to GitHub after you create the repo manually
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
  echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME"
  exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="HomeRunCoach"

echo "Setting up remote and pushing to GitHub..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
git push -u origin main

echo "✅ Code pushed to GitHub!"
echo "View your repo at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

