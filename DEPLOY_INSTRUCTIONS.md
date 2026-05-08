# 🚀 Deploy to GitHub Pages - Quick Guide

Your repository: **https://github.com/raymonepping/marathon_boardgame**

## ⚡ Super Quick Deploy (3 Commands)

```bash
cd /Users/raymon.epping/Documents/VSC/Personal/marathon_boardgame

# 1. Install dependencies (first time only)
npm install

# 2. Initialize git and add remote (first time only)
git init
git remote add origin https://github.com/raymonepping/marathon_boardgame.git

# 3. Deploy!
git add .
git commit -m "Deploy Marathon Board Game v2.0"
git branch -M main
git push -u origin main
```

## 🎯 What Happens Next?

1. **GitHub Actions** automatically starts building
2. Wait **2-3 minutes** for deployment
3. Your game will be live at:

   **🎮 https://raymonepping.github.io/marathon_boardgame/**

## 📋 Enable GitHub Pages (One-Time Setup)

1. Go to: https://github.com/raymonepping/marathon_boardgame/settings/pages
2. Under **"Source"**, select: **GitHub Actions**
3. Done! The workflow will deploy automatically

## 🔄 Update Your Game Later

Every time you make changes:

```bash
git add .
git commit -m "Update: describe your changes"
git push
```

GitHub Actions will automatically rebuild and deploy! 🚀

## ✅ Verify Deployment

1. Check Actions: https://github.com/raymonepping/marathon_boardgame/actions
2. Wait for green checkmark ✅
3. Visit: https://raymonepping.github.io/marathon_boardgame/
4. Play the game! 🎮

## 🐛 Troubleshooting

### If you see 404 error:
- Wait 2-3 minutes after first deployment
- Check GitHub Pages is enabled (Settings → Pages)
- Verify workflow completed successfully (Actions tab)

### If game doesn't load:
- Check browser console (F12) for errors
- Verify all files were committed: `git status`
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### If workflow fails:
- Check Actions tab for error details
- Verify package.json is correct
- Try building locally first: `npm run build`

## 📞 Need Help?

Check the full deployment guide: **DEPLOYMENT.md**

---

**Your game will be live at:**
## 🎮 https://raymonepping.github.io/marathon_boardgame/

Share this link with friends and family! 🏃‍♂️🏆