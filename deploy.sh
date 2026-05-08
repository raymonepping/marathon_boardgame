#!/bin/bash

# Marathon Board Game - Quick Deploy Script
# This script helps you deploy to GitHub Pages

echo "🏃 Marathon Board Game - GitHub Pages Deployment"
echo "================================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Check if remote exists
if ! git remote | grep -q origin; then
    echo "❓ GitHub repository URL needed"
    echo "Example: https://github.com/username/marathon-boardgame.git"
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin "$repo_url"
    echo "✅ Remote added"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo ""
else
    echo "❌ Build failed. Please check errors above."
    exit 1
fi

# Add all files
echo "📝 Staging files..."
git add .

# Commit
echo "💾 Creating commit..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update: Marathon Board Game v2.0"
fi
git commit -m "$commit_msg"

# Check if main branch exists
if ! git show-ref --verify --quiet refs/heads/main; then
    echo "🌿 Creating main branch..."
    git branch -M main
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to your GitHub repository"
    echo "2. Click 'Settings' → 'Pages'"
    echo "3. Under 'Source', select 'GitHub Actions'"
    echo "4. Wait 2-3 minutes for deployment"
    echo "5. Your game will be live at:"
    echo "   https://YOUR-USERNAME.github.io/marathon-boardgame/"
    echo ""
    echo "🎮 Happy gaming!"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "- Check if repository URL is correct"
    echo "- Make sure you have push access"
    echo "- Try: git remote -v (to see current remote)"
    echo ""
fi

# Made with Bob
