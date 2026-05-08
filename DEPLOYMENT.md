# 🚀 GitHub Pages Deployment Guide

Complete gids voor het deployen van het Marathon Board Game naar GitHub Pages.

## 📋 Vereisten

- GitHub account
- Git geïnstalleerd
- Node.js 18+ geïnstalleerd

---

## 🎯 Optie 1: Automatische Deployment (Aanbevolen)

### Stap 1: Maak GitHub Repository

1. Ga naar [GitHub](https://github.com)
2. Klik op "New repository"
3. Naam: `marathon-boardgame` (of een andere naam)
4. Kies "Public" (voor gratis GitHub Pages)
5. **Niet** initialiseren met README (we hebben al bestanden)
6. Klik "Create repository"

### Stap 2: Initialiseer Git Lokaal

```bash
cd /Users/raymon.epping/Documents/VSC/Personal/marathon_boardgame

# Initialiseer git (als nog niet gedaan)
git init

# Voeg alle bestanden toe
git add .

# Maak eerste commit
git commit -m "Initial commit: Marathon Board Game v2.0"

# Voeg remote toe (vervang USERNAME met jouw GitHub username)
git remote add origin https://github.com/USERNAME/marathon-boardgame.git

# Push naar GitHub
git branch -M main
git push -u origin main
```

### Stap 3: Activeer GitHub Pages

1. Ga naar je repository op GitHub
2. Klik op "Settings" (bovenaan)
3. Klik op "Pages" (links in menu)
4. Bij "Source" selecteer: **GitHub Actions**
5. De workflow wordt automatisch gedetecteerd!

### Stap 4: Wacht op Deployment

1. Ga naar "Actions" tab in je repository
2. Je ziet de "Deploy to GitHub Pages" workflow draaien
3. Wacht tot het groene vinkje verschijnt (±2-3 minuten)
4. Ga terug naar "Settings" → "Pages"
5. Je ziet de URL: `https://USERNAME.github.io/marathon-boardgame/`

### Stap 5: Speel het Spel! 🎮

Open de URL in je browser en speel!

---

## 🎯 Optie 2: Handmatige Deployment

### Stap 1: Build het Project Lokaal

```bash
cd /Users/raymon.epping/Documents/VSC/Personal/marathon_boardgame

# Installeer dependencies
npm install

# Build voor productie
npm run build
```

Dit maakt een `dist` folder met de gebouwde bestanden.

### Stap 2: Deploy met gh-pages

```bash
# Installeer gh-pages
npm install -D gh-pages

# Voeg deploy script toe aan package.json
npm pkg set scripts.deploy="gh-pages -d dist"

# Deploy!
npm run deploy
```

### Stap 3: Configureer GitHub Pages

1. Ga naar repository Settings → Pages
2. Bij "Source" selecteer: **Deploy from a branch**
3. Bij "Branch" selecteer: **gh-pages** en **/root**
4. Klik "Save"
5. Wacht 1-2 minuten
6. Refresh de pagina om de URL te zien

---

## 🔧 Vite Configuratie voor GitHub Pages

De `vite.config.js` moet aangepast worden voor GitHub Pages:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/marathon-boardgame/', // ← Vervang met jouw repo naam
  assetsInclude: ['**/*.json'],
  resolve: {
    alias: {
      '@': '/src',
      '@config': '/config'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

**Belangrijk:** Vervang `/marathon-boardgame/` met jouw repository naam!

---

## 🔄 Updates Deployen

### Automatisch (met GitHub Actions)

Elke keer dat je pusht naar `main`, wordt automatisch gedeployed:

```bash
# Maak wijzigingen
# ...

# Commit en push
git add .
git commit -m "Update: beschrijving van wijzigingen"
git push

# GitHub Actions doet de rest!
```

### Handmatig (met gh-pages)

```bash
# Maak wijzigingen
# ...

# Build en deploy
npm run build
npm run deploy
```

---

## 🌐 Custom Domain (Optioneel)

### Stap 1: Voeg CNAME Bestand Toe

Maak `public/CNAME` bestand:
```
marathon-game.jouwdomein.nl
```

### Stap 2: Configureer DNS

Bij je domain provider, voeg toe:
```
Type: CNAME
Name: marathon-game (of @)
Value: USERNAME.github.io
```

### Stap 3: Configureer in GitHub

1. Settings → Pages
2. Bij "Custom domain" vul in: `marathon-game.jouwdomein.nl`
3. Klik "Save"
4. Wacht op DNS verificatie (kan 24 uur duren)
5. Enable "Enforce HTTPS"

---

## 🐛 Troubleshooting

### Probleem: 404 Error na Deployment

**Oorzaak:** Base path niet correct ingesteld

**Oplossing:**
```javascript
// vite.config.js
export default defineConfig({
  base: '/marathon-boardgame/', // ← Check dit!
})
```

### Probleem: Witte Pagina

**Oorzaak:** JavaScript errors of verkeerde paths

**Oplossing:**
1. Open browser console (F12)
2. Check voor errors
3. Verifieer dat alle assets laden
4. Check `base` in vite.config.js

### Probleem: JSON Files Niet Gevonden

**Oorzaak:** JSON imports werken niet in productie

**Oplossing 1 - Inline JSON:**
```jsx
// In marathon-boardgame-v2.jsx
// Vervang imports met inline data
const gameConfig = {
  // ... plak JSON inhoud
};
```

**Oplossing 2 - Public Folder:**
```bash
# Verplaats JSON naar public folder
mkdir public/config
cp config/*.json public/config/

# Update imports
import gameConfig from '/config/game-config.json'
```

### Probleem: GitHub Actions Faalt

**Oplossing:**
1. Check Actions tab voor error details
2. Verifieer package.json correct is
3. Check of alle dependencies in package.json staan
4. Probeer lokaal: `npm ci && npm run build`

### Probleem: Deployment Duurt Lang

**Normaal:** 2-5 minuten voor eerste deployment
**Te lang:** >10 minuten

**Oplossing:**
1. Check Actions tab voor status
2. Cancel en herstart workflow
3. Check GitHub Status: https://www.githubstatus.com/

---

## 📊 Deployment Checklist

### Voor Eerste Deployment
- [ ] Git repository aangemaakt op GitHub
- [ ] Lokale git geïnitialiseerd
- [ ] Alle bestanden gecommit
- [ ] Remote toegevoegd
- [ ] Gepusht naar GitHub
- [ ] GitHub Pages geactiveerd
- [ ] `base` in vite.config.js correct
- [ ] Workflow succesvol afgerond
- [ ] URL werkt in browser
- [ ] Game is speelbaar

### Voor Updates
- [ ] Wijzigingen gemaakt
- [ ] Lokaal getest (`npm run dev`)
- [ ] Gecommit met duidelijke message
- [ ] Gepusht naar GitHub
- [ ] Workflow succesvol
- [ ] Live site gecontroleerd

---

## 🎯 Deployment Strategieën

### Development Branch

Voor veiligere deployments:

```bash
# Maak development branch
git checkout -b development

# Werk in development
# ... maak wijzigingen

# Test lokaal
npm run dev

# Commit
git add .
git commit -m "Feature: nieuwe functie"

# Push development
git push origin development

# Als alles werkt, merge naar main
git checkout main
git merge development
git push origin main

# Automatische deployment naar GitHub Pages!
```

### Preview Deployments

Voor preview van changes voor merge:

```yaml
# .github/workflows/preview.yml
name: Preview Deployment

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview build successful!'
            })
```

---

## 📈 Analytics (Optioneel)

### Google Analytics

Voeg toe aan `index.html`:

```html
<head>
  <!-- ... -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
```

### Plausible Analytics (Privacy-friendly)

```html
<head>
  <!-- ... -->
  <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
</head>
```

---

## 🔒 Security

### Environment Variables

Voor gevoelige data (API keys, etc.):

```bash
# Maak .env bestand (lokaal)
VITE_API_KEY=your_key_here

# Voeg toe aan .gitignore
echo ".env" >> .gitignore

# Gebruik in code
const apiKey = import.meta.env.VITE_API_KEY
```

In GitHub:
1. Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `VITE_API_KEY`
4. Value: `your_key_here`

Update workflow:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
```

---

## 🎉 Success!

Als alles goed is gegaan, is je game nu live op:

**https://USERNAME.github.io/marathon-boardgame/**

Deel de link met vrienden en familie! 🎮🏃‍♂️🏆

---

## 📞 Hulp Nodig?

### Resources
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

### Common Links
- **Repository Settings**: `https://github.com/USERNAME/REPO/settings`
- **Actions**: `https://github.com/USERNAME/REPO/actions`
- **Pages Settings**: `https://github.com/USERNAME/REPO/settings/pages`

---

**Happy Deploying! 🚀✨**