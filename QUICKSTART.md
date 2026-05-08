# 🚀 Quick Start Guide - Marathon Board Game

Snel aan de slag met het marathon bordspel!

## 📋 Vereisten

- **Node.js** 16 of hoger
- **npm** of **yarn**
- Een React development omgeving (Vite, Create React App, of Next.js)

---

## 🎯 Optie 1: Standalone met Vite (Aanbevolen)

### Stap 1: Installeer Vite
```bash
cd Personal/marathon_boardgame
npm create vite@latest . -- --template react
```

### Stap 2: Installeer Dependencies
```bash
npm install
```

### Stap 3: Kopieer de Game Files
De bestanden staan al op de juiste plek:
```
marathon_boardgame/
├── marathon-boardgame-v2.jsx
├── config/
│   ├── game-config.json
│   ├── players.json
│   ├── cards.json
│   └── themes.json
```

### Stap 4: Update src/App.jsx
```jsx
import MarathonGame from '../marathon-boardgame-v2'

function App() {
  return <MarathonGame />
}

export default App
```

### Stap 5: Start Development Server
```bash
npm run dev
```

Open browser op: **http://localhost:5173**

---

## 🎯 Optie 2: Bestaand React Project

### Stap 1: Kopieer Bestanden
Kopieer naar je project:
```bash
# Vanuit je project root
cp -r /path/to/marathon_boardgame/config ./src/
cp /path/to/marathon_boardgame/marathon-boardgame-v2.jsx ./src/
```

### Stap 2: Import in je App
```jsx
// src/App.jsx
import MarathonGame from './marathon-boardgame-v2'

function App() {
  return (
    <div className="App">
      <MarathonGame />
    </div>
  )
}

export default App
```

### Stap 3: Start je Dev Server
```bash
npm start
# of
npm run dev
```

---

## 🎯 Optie 3: Next.js Project

### Stap 1: Maak Component Client-Side
```jsx
// app/marathon/page.jsx
'use client'

import MarathonGame from '@/components/marathon-boardgame-v2'

export default function MarathonPage() {
  return <MarathonGame />
}
```

### Stap 2: Kopieer Bestanden
```bash
# Kopieer naar components folder
cp marathon-boardgame-v2.jsx app/components/
cp -r config app/components/
```

### Stap 3: Start Next.js
```bash
npm run dev
```

Navigeer naar: **http://localhost:3000/marathon**

---

## 🎯 Optie 4: Simpele HTML Setup (Geen Build Tool)

### Stap 1: Maak index.html
```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Road to the Marathon</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel" data-type="module">
    // Inline de JSON configs hier
    const gameConfig = {
      // ... plak game-config.json inhoud
    };
    
    const playersConfig = {
      // ... plak players.json inhoud
    };
    
    const cardsConfig = {
      // ... plak cards.json inhoud
    };
    
    const themesConfig = {
      // ... plak themes.json inhoud
    };
    
    // Plak marathon-boardgame-v2.jsx code hier
    // Vervang imports met de inline configs
    
    // Render
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<MarathonGame />);
  </script>
</body>
</html>
```

**Let op:** Deze methode is niet aanbevolen voor productie!

---

## 🛠️ Troubleshooting

### Probleem: "Cannot find module './config/game-config.json'"

**Oplossing 1 - Vite:**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.json']
})
```

**Oplossing 2 - Webpack:**
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'json'
      }
    ]
  }
}
```

**Oplossing 3 - Inline Imports:**
Vervang in marathon-boardgame-v2.jsx:
```jsx
// Van:
import gameConfig from "./config/game-config.json";

// Naar:
const gameConfig = {
  // Plak JSON inhoud hier
};
```

### Probleem: "React is not defined"

**Oplossing:**
```bash
npm install react react-dom
```

### Probleem: Styling werkt niet

**Oplossing:**
De styling zit inline in de component, dus dit zou niet moeten gebeuren. Check of:
1. Component correct geïmporteerd is
2. Geen CSS conflicts zijn
3. Browser console voor errors

---

## 📦 Complete Setup Script

Maak een nieuw project vanaf scratch:

```bash
#!/bin/bash

# Maak project folder
mkdir marathon-game
cd marathon-game

# Initialiseer Vite project
npm create vite@latest . -- --template react

# Installeer dependencies
npm install

# Maak config folder
mkdir -p src/config

# Kopieer game files (pas paths aan naar jouw locatie)
cp ../marathon_boardgame/marathon-boardgame-v2.jsx src/
cp ../marathon_boardgame/config/*.json src/config/

# Update App.jsx
cat > src/App.jsx << 'EOF'
import MarathonGame from './marathon-boardgame-v2'

function App() {
  return <MarathonGame />
}

export default App
EOF

# Start dev server
npm run dev
```

Sla op als `setup.sh`, maak executable en run:
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🎮 Verificatie

Als alles goed is, zie je:
1. ✅ Game titel: "🏃 ROAD TO THE MARATHON 🏆"
2. ✅ Spelbord met 60 vakjes
3. ✅ 4 spelers (Rood, Groen, Blauw, Geel)
4. ✅ Dobbelsteen en "🎲 Gooi!" knop
5. ✅ Thema en Stats knoppen bovenaan
6. ✅ Logboek rechts

### Test de Game
1. Klik "🎲 Gooi!" → Dobbelsteen rolt
2. Speler beweegt automatisch
3. AI spelers gooien automatisch
4. Klik "🎨 Thema" → Thema selector verschijnt
5. Klik "📊 Stats" → Statistieken verschijnen

---

## 🚀 Production Build

### Vite
```bash
npm run build
npm run preview
```

### Next.js
```bash
npm run build
npm start
```

### Deploy naar Vercel/Netlify
```bash
# Vercel
vercel

# Netlify
netlify deploy
```

---

## 💡 Tips

### Development
- Gebruik React DevTools voor debugging
- Check browser console voor errors
- Hot reload werkt automatisch

### Performance
- Game is geoptimaliseerd voor 60fps
- Log beperkt tot 50 entries
- Animaties zijn GPU-accelerated

### Customization
- Pas JSON files aan zonder code te wijzigen
- Check CUSTOMIZATION.md voor voorbeelden
- Test wijzigingen met hot reload

---

## 📞 Hulp Nodig?

### Resources
- **README.md** - Algemene info
- **CUSTOMIZATION.md** - Aanpassingen
- **MIGRATION.md** - Van v1 naar v2
- **TESTING.md** - Test guide

### Common Issues
1. **JSON import errors** → Check build tool config
2. **React errors** → Check dependencies installed
3. **Styling issues** → Check browser console
4. **AI niet werkend** → Check players.json config

---

## ✅ Checklist

- [ ] Node.js geïnstalleerd
- [ ] Project aangemaakt (Vite/CRA/Next.js)
- [ ] Dependencies geïnstalleerd
- [ ] Game files gekopieerd
- [ ] App.jsx updated
- [ ] Dev server gestart
- [ ] Game laadt in browser
- [ ] Dobbelsteen werkt
- [ ] AI spelers werken
- [ ] Thema's werken

---

**Veel plezier met spelen! 🎮🏃‍♂️🏆**

Werkt het niet? Check de troubleshooting sectie of de andere documentatie!