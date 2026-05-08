# 🔄 Migration Guide: v1 → v2

Complete gids voor het upgraden van het marathon bordspel naar versie 2.0 met AI spelers en JSON configuratie.

## 📋 Wat is er Nieuw in v2?

### 🎮 Belangrijkste Features
- ✅ **AI Spelers**: 3 bot spelers met verschillende moeilijkheidsgraden
- ✅ **JSON Configuratie**: Alle game data in externe bestanden
- ✅ **5 Thema's**: Donker, Licht, Oceaan, Bos, Zonsondergang
- ✅ **Statistieken**: Track wins, games, kaarten, checkpoints
- ✅ **Verbeterde UI**: Betere animaties en visuele feedback
- ✅ **AI Persoonlijkheden**: Unieke berichten per moeilijkheidsgraad

### 🔧 Technische Verbeteringen
- Modulaire code structuur
- Configureerbare game settings
- Betere state management
- Responsive design verbeteringen
- Theme switching systeem

---

## 🚀 Snelle Start

### Stap 1: Backup Maken
```bash
# Backup je huidige versie
cp marathon-boardgame.jsx marathon-boardgame-v1-backup.jsx
```

### Stap 2: Bestanden Toevoegen
Zorg dat je deze bestanden hebt:
```
marathon_boardgame/
├── marathon-boardgame-v2.jsx    # Nieuwe versie
├── config/
│   ├── game-config.json
│   ├── players.json
│   ├── cards.json
│   └── themes.json
```

### Stap 3: Importeren
```jsx
// Oud (v1)
import MarathonGame from './marathon-boardgame'

// Nieuw (v2)
import MarathonGame from './marathon-boardgame-v2'
```

### Stap 4: JSON Bestanden Laden
Zorg dat je build tool JSON imports ondersteunt:

**Vite:**
```javascript
// vite.config.js
export default {
  // JSON wordt automatisch ondersteund
}
```

**Webpack:**
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

**Next.js:**
```javascript
// next.config.js
module.exports = {
  // JSON wordt automatisch ondersteund
}
```

---

## 🔄 Breaking Changes

### 1. Component Import
```jsx
// ❌ Oud
import MarathonGame from './marathon-boardgame'

// ✅ Nieuw
import MarathonGame from './marathon-boardgame-v2'
```

### 2. Hardcoded Data → JSON
```jsx
// ❌ Oud: Data in component
const PLAYERS = [
  { id: 0, name: "Rood", color: "#E53E3E" },
  // ...
];

// ✅ Nieuw: Data in JSON
import playersConfig from './config/players.json'
```

### 3. Props (Geen Breaking Changes)
De component heeft nog steeds geen required props, maar je kunt nu optioneel configuratie doorgeven:

```jsx
// Beide werken
<MarathonGame />
<MarathonGame initialTheme="ocean" />
```

---

## 📊 Feature Vergelijking

| Feature | v1 | v2 |
|---------|----|----|
| **Spelers** | 4 menselijke spelers | 1 mens + 3 AI |
| **Thema's** | 1 (donker) | 5 (donker, licht, oceaan, bos, zonsondergang) |
| **Configuratie** | Hardcoded | JSON bestanden |
| **AI** | ❌ | ✅ (3 moeilijkheidsgraden) |
| **Statistieken** | ❌ | ✅ (wins, games, kaarten, etc.) |
| **Kaarten** | 21 hardcoded | 20 in JSON (makkelijk uitbreidbaar) |
| **Animaties** | Basis | Verbeterd + nieuwe effecten |
| **Responsive** | Goed | Beter |
| **Thema Switcher** | ❌ | ✅ |
| **AI Persoonlijkheden** | ❌ | ✅ |
| **Log Limiet** | Onbeperkt | 50 (performance) |

---

## 🎨 Thema Migratie

### v1 Thema (Hardcoded)
```jsx
background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)"
```

### v2 Thema (Configureerbaar)
```json
// config/themes.json
{
  "themes": {
    "dark": {
      "background": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      "textColor": "#f0ede8",
      // ... meer properties
    }
  }
}
```

### Custom Thema Toevoegen
```json
{
  "themes": {
    "custom": {
      "id": "custom",
      "name": "Mijn Thema",
      "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "textColor": "#ffffff",
      "textSecondary": "#e0e0e0",
      "boardBg": "rgba(255,255,255,0.1)",
      "boardBorder": "rgba(255,255,255,0.2)",
      "squareBg": "rgba(255,255,255,0.08)",
      "squareHover": "rgba(255,255,255,0.15)",
      "panelBg": "rgba(0,0,0,0.3)",
      "panelBorder": "rgba(255,255,255,0.2)",
      "buttonBg": "rgba(255,255,255,0.1)",
      "buttonHover": "rgba(255,255,255,0.2)"
    }
  }
}
```

---

## 🤖 AI Configuratie

### Speler naar AI Converteren
```json
// config/players.json
{
  "id": 0,
  "name": "Rood",
  "isHuman": false,  // ← Verander naar false
  "aiDifficulty": "medium"  // ← Voeg toe: "easy", "medium", of "hard"
}
```

### AI Persoonlijkheid Aanpassen
```json
{
  "aiPersonalities": {
    "easy": {
      "thinkingTime": 1500,
      "messages": {
        "thinking": [
          "Hmm, wat moet ik doen? 🤔",
          "Even nadenken... 💭"
        ],
        "win": [
          "Yes! Ik heb gewonnen! 🎉"
        ],
        "lose": [
          "Goed gespeeld! 👏"
        ]
      }
    }
  }
}
```

---

## 🃏 Kaarten Migratie

### v1 Kaart Structuur
```jsx
{
  type: "bad",
  title: "Door je enkel gegaan!",
  desc: "Sla een beurt over.",
  effect: { skipTurns: 1 }
}
```

### v2 Kaart Structuur
```json
{
  "id": "bad_01",
  "type": "bad",
  "title": "Door je enkel gegaan!",
  "description": "Sla een beurt over.",
  "emoji": "🤕",
  "effect": {
    "move": 0,
    "skipTurns": 1,
    "halfDice": 0,
    "extraRoll": false
  }
}
```

### Verschillen
- ✅ `id` toegevoegd (unieke identifier)
- ✅ `emoji` toegevoegd (visuele representatie)
- ✅ `desc` → `description` (consistentie)
- ✅ Alle effect properties expliciet (duidelijkheid)

---

## ⚙️ Game Settings Migratie

### v1 (Hardcoded)
```jsx
const TOTAL_SQUARES = 60;
const SPECIAL_SQUARES = {
  10: { type: "card", label: "📋" },
  30: { type: "checkpoint", label: "🏁" },
  // ...
};
```

### v2 (JSON)
```json
{
  "game": {
    "totalSquares": 60
  },
  "board": {
    "specialSquares": {
      "cardSquares": [10, 20, 40, 50],
      "checkpoints": [
        {"square": 30, "bonus": 3},
        {"square": 55, "bonus": 2}
      ]
    }
  }
}
```

---

## 🐛 Troubleshooting

### Probleem: JSON Import Errors
```
Error: Cannot find module './config/game-config.json'
```

**Oplossing:**
1. Check of JSON bestanden in de juiste map staan
2. Verifieer import paths
3. Check build tool configuratie

### Probleem: AI Reageert Niet
**Oplossing:**
1. Check `isHuman: false` in players.json
2. Verifieer `aiDifficulty` is ingesteld
3. Check `ai.enabled: true` in game-config.json

### Probleem: Thema Laadt Niet
**Oplossing:**
1. Verifieer alle theme properties aanwezig zijn
2. Check gradient syntax
3. Gebruik JSON validator

### Probleem: Kaarten Werken Niet
**Oplossing:**
1. Check alle kaarten hebben unieke `id`
2. Verifieer `type` is "good", "bad", of "neutral"
3. Check alle effect properties zijn aanwezig

---

## 📈 Performance Verbeteringen

### v1 → v2 Optimalisaties
- ✅ Log beperkt tot 50 entries (was onbeperkt)
- ✅ Betere animatie timing
- ✅ Efficiëntere state updates
- ✅ Minder re-renders door memo's

### Memory Usage
- **v1**: ~5-10MB (groeit met log)
- **v2**: ~3-5MB (stabiel)

---

## 🎯 Best Practices

### 1. JSON Validatie
Gebruik een JSON validator voor je configs:
```bash
# Online: https://jsonlint.com/
# Of met jq:
jq . config/game-config.json
```

### 2. Backup Configs
```bash
# Maak backups van je configs
cp -r config config-backup
```

### 3. Incrementele Migratie
1. Start met v2 naast v1
2. Test alle features
3. Pas configs aan naar wens
4. Vervang v1 als alles werkt

### 4. Custom Configs
Maak een `config-custom` folder voor je eigen aanpassingen:
```
marathon_boardgame/
├── config/           # Originele configs
├── config-custom/    # Jouw aanpassingen
```

---

## 🔮 Toekomstige Features (Roadmap)

### Gepland voor v2.1
- [ ] Geluid effecten (framework al aanwezig)
- [ ] Multiplayer over netwerk
- [ ] Meer AI strategieën
- [ ] Achievements systeem
- [ ] Replay functie

### Gepland voor v3.0
- [ ] Custom board layouts
- [ ] Power-ups systeem
- [ ] Tournament mode
- [ ] Leaderboards
- [ ] Mobile app versie

---

## 📞 Support

### Vragen?
- Check de [README.md](./README.md) voor basis info
- Check de [CUSTOMIZATION.md](./CUSTOMIZATION.md) voor aanpassingen
- Open een issue op GitHub

### Bugs Melden
Include:
1. Versie nummer (v2.0.0)
2. Browser/platform
3. Stappen om te reproduceren
4. Console errors (indien aanwezig)

---

## ✅ Migratie Checklist

- [ ] Backup gemaakt van v1
- [ ] Alle JSON bestanden aanwezig
- [ ] JSON imports werken
- [ ] v2 component geïmporteerd
- [ ] Game start zonder errors
- [ ] AI spelers werken
- [ ] Thema switcher werkt
- [ ] Statistieken worden bijgehouden
- [ ] Kaarten werken correct
- [ ] Alle animaties smooth
- [ ] Responsive op mobiel getest
- [ ] Custom configs toegevoegd (optioneel)

---

**Succes met de migratie! 🚀**

Heb je problemen? Check de troubleshooting sectie of de andere documentatie bestanden.