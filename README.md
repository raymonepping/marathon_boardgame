# 🏃 Road to the Marathon - Board Game

Een interactief marathon-thema bordspel gebouwd met React. Speel alleen tegen AI-tegenstanders of pas het spel volledig aan met JSON configuratiebestanden!

## ✨ Nieuwe Features (v2.0)

### 🤖 AI Spelers
- **Speel solo**: Speler 1 (Rood) is menselijk, spelers 2-4 zijn AI
- **3 Moeilijkheidsgraden**: Makkelijk, Gemiddeld, Moeilijk
- **Unieke persoonlijkheden**: Elke AI heeft eigen denktijd en berichten
- **Slimme beslissingen**: AI's maken realistische keuzes

### 🎨 Visuele Verbeteringen
- **5 Thema's**: Donker, Licht, Oceaan, Bos, Zonsondergang
- **Vloeiende animaties**: Dobbelsteen rollen, kaarten verschijnen, spelers bewegen
- **Responsive design**: Werkt perfect op desktop, tablet en mobiel
- **Moderne UI**: Gradient achtergronden, glasmorfisme effecten

### ⚙️ JSON Configuratie
- **game-config.json**: Spel instellingen (vakjes, AI, animaties)
- **players.json**: Speler kleuren, emoji's, AI moeilijkheid
- **cards.json**: Alle kaarten met effecten
- **themes.json**: Kleurenschema's en thema's

### 📊 Extra Features
- **Statistieken**: Houd scores en winsten bij
- **Logboek**: Zie alle acties in real-time
- **Geluid effecten**: Optioneel (configureerbaar)
- **Sneltoetsen**: Spatie = dobbelsteen gooien

## 🎮 Hoe te Spelen

### Basis Regels
1. **Doel**: Bereik als eerste vakje 60 (de finish)
2. **Beurten**: Gooi de dobbelsteen en beweeg vooruit
3. **Speciale vakjes**:
   - 📋 **Kaart vakjes** (10, 20, 40, 50): Trek een kaart
   - 🏁 **Checkpoints** (30, 55): Krijg bonus vakjes
   - 🏆 **Finish** (60): Win het spel!

### Kaart Types
- **🎉 Meevaller**: Ga vooruit, extra beurt, bonussen
- **😱 Tegenvaller**: Ga terug, sla beurt over, halve dobbelsteen
- **😐 Neutraal**: Geen effect

### AI Moeilijkheidsgraden
- **Makkelijk** (Groen): Rustig tempo, 1.5s denktijd
- **Gemiddeld** (Blauw): Standaard speler, 1.2s denktijd  
- **Moeilijk** (Geel): Snel en strategisch, 0.9s denktijd

## 📁 Project Structuur

```
marathon_boardgame/
├── marathon-boardgame.jsx    # Hoofd React component
├── config/                    # JSON configuratie bestanden
│   ├── game-config.json      # Spel instellingen
│   ├── players.json          # Speler configuratie
│   ├── cards.json            # Kaarten database
│   └── themes.json           # Thema's en kleuren
├── README.md                 # Deze documentatie
└── CUSTOMIZATION.md          # Aanpassings gids
```

## 🛠️ Installatie & Gebruik

### Vereisten
- Node.js 16+
- React 18+

### Quick Start
```bash
# Installeer dependencies
npm install react react-dom

# Start development server
npm run dev

# Of gebruik in je eigen React project
import MarathonGame from './marathon-boardgame.jsx'
```

### In een React App
```jsx
import MarathonGame from './marathon-boardgame'

function App() {
  return <MarathonGame />
}
```

## 🎨 Thema's Aanpassen

Bewerk `config/themes.json`:

```json
{
  "themes": {
    "custom": {
      "id": "custom",
      "name": "Mijn Thema",
      "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "textColor": "#ffffff",
      "boardBg": "rgba(255,255,255,0.1)",
      ...
    }
  }
}
```

## 🤖 AI Aanpassen

Bewerk `config/players.json`:

```json
{
  "id": 1,
  "name": "Groen",
  "isHuman": false,
  "aiDifficulty": "easy"  // "easy", "medium", of "hard"
}
```

## 🃏 Kaarten Toevoegen

Bewerk `config/cards.json`:

```json
{
  "id": "good_10",
  "type": "good",
  "title": "Nieuwe Kaart",
  "description": "Beschrijving hier",
  "emoji": "🎯",
  "effect": {
    "move": 3,           // Beweeg X vakjes (+ of -)
    "skipTurns": 1,      // Sla X beurten over
    "halfDice": 2,       // Halve dobbelsteen voor X beurten
    "extraRoll": true    // Extra beurt
  }
}
```

## 🎯 Spel Instellingen

Bewerk `config/game-config.json`:

```json
{
  "game": {
    "totalSquares": 60,    // Aantal vakjes
    "maxPlayers": 4,       // Max spelers
    "minPlayers": 1        // Min spelers
  },
  "dice": {
    "sides": 6,            // Dobbelsteen zijden
    "animationDuration": 480
  },
  "ai": {
    "enabled": true,
    "thinkingTimeMin": 800,
    "thinkingTimeMax": 2000
  }
}
```

## 🎵 Geluid Effecten

Geluid is standaard uitgeschakeld. Om in te schakelen:

```json
// In game-config.json
{
  "sounds": {
    "enabled": true,
    "volume": 0.5
  }
}
```

## 🔧 Technische Details

### State Management
- React Hooks (useState, useEffect, useRef)
- Geen externe state libraries nodig

### Animaties
- CSS keyframes voor vloeiende bewegingen
- Configureerbare timing in game-config.json

### AI Logica
- Timeout-based beslissingen
- Willekeurige denktijd binnen bereik
- Persoonlijkheid gebaseerde berichten

## 📝 Changelog

### v2.0.0 (2026-05-08)
- ✨ AI spelers toegevoegd (3 moeilijkheidsgraden)
- 🎨 5 thema's toegevoegd
- ⚙️ Volledige JSON configuratie
- 📊 Verbeterde UI/UX
- 🎭 Speler persoonlijkheden
- 📱 Responsive design verbeterd
- 🎯 Betere animaties

### v1.0.0 (Origineel)
- 🎮 Basis bordspel functionaliteit
- 🎲 Dobbelsteen mechaniek
- 🃏 Kaarten systeem
- 🏁 Checkpoints en finish

## 🤝 Bijdragen

Voel je vrij om:
- Nieuwe thema's toe te voegen
- Kaarten te creëren
- AI verbeteringen voor te stellen
- Bugs te melden

## 📄 Licentie

MIT License - Vrij te gebruiken en aan te passen!

## 🎉 Credits

Gemaakt met ❤️ voor marathon lopers en bordspel liefhebbers!

---

**Veel plezier met spelen! 🏃‍♂️🎲🏆**