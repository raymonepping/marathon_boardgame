# 🎨 Customization Guide - Road to the Marathon

Complete gids voor het aanpassen van het marathon bordspel aan jouw wensen!

## 📋 Inhoudsopgave

1. [Thema's Aanpassen](#themas-aanpassen)
2. [Spelers Configureren](#spelers-configureren)
3. [Kaarten Maken](#kaarten-maken)
4. [Spel Instellingen](#spel-instellingen)
5. [AI Gedrag Aanpassen](#ai-gedrag-aanpassen)
6. [Geavanceerde Aanpassingen](#geavanceerde-aanpassingen)

---

## 🎨 Thema's Aanpassen

### Bestaand Thema Wijzigen

Bewerk `config/themes.json`:

```json
{
  "themes": {
    "dark": {
      "id": "dark",
      "name": "Donker Thema",
      "background": "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      "textColor": "#ffffff",
      "textSecondary": "#b0c4de",
      "boardBg": "rgba(255,255,255,0.05)",
      "boardBorder": "rgba(255,255,255,0.1)",
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

### Nieuw Thema Toevoegen

Voeg een nieuw thema object toe:

```json
{
  "themes": {
    "neon": {
      "id": "neon",
      "name": "Neon Nights",
      "background": "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      "textColor": "#00ff88",
      "textSecondary": "#00ccff",
      "boardBg": "rgba(0,255,136,0.05)",
      "boardBorder": "rgba(0,255,136,0.3)",
      "squareBg": "rgba(0,255,136,0.1)",
      "squareHover": "rgba(0,255,136,0.2)",
      "panelBg": "rgba(0,0,0,0.5)",
      "panelBorder": "rgba(0,255,136,0.4)",
      "buttonBg": "rgba(0,255,136,0.2)",
      "buttonHover": "rgba(0,255,136,0.3)"
    }
  }
}
```

### Thema Kleuren Uitleg

| Property | Beschrijving | Voorbeeld |
|----------|--------------|-----------|
| `background` | Achtergrond gradient | `linear-gradient(...)` |
| `textColor` | Primaire tekst kleur | `#ffffff` |
| `textSecondary` | Secundaire tekst | `#b0c4de` |
| `boardBg` | Bord achtergrond | `rgba(255,255,255,0.05)` |
| `boardBorder` | Bord rand | `rgba(255,255,255,0.1)` |
| `squareBg` | Vakje achtergrond | `rgba(255,255,255,0.08)` |
| `squareHover` | Vakje hover effect | `rgba(255,255,255,0.15)` |
| `panelBg` | Panel achtergrond | `rgba(0,0,0,0.3)` |
| `panelBorder` | Panel rand | `rgba(255,255,255,0.2)` |
| `buttonBg` | Knop achtergrond | `rgba(255,255,255,0.1)` |
| `buttonHover` | Knop hover | `rgba(255,255,255,0.2)` |

---

## 👥 Spelers Configureren

### Speler Eigenschappen Wijzigen

Bewerk `config/players.json`:

```json
{
  "id": 0,
  "name": "Rood",
  "color": "#ff4444",
  "emoji": "🔴",
  "background": "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
  "isHuman": true,
  "aiDifficulty": null
}
```

### Menselijke Speler naar AI

Verander `isHuman` naar `false` en voeg `aiDifficulty` toe:

```json
{
  "id": 0,
  "name": "Rood",
  "isHuman": false,
  "aiDifficulty": "medium"
}
```

### AI naar Menselijke Speler

```json
{
  "id": 1,
  "name": "Groen",
  "isHuman": true,
  "aiDifficulty": null
}
```

### Nieuwe Speler Toevoegen

Voeg een nieuw speler object toe (max 4 spelers):

```json
{
  "id": 4,
  "name": "Paars",
  "color": "#9b59b6",
  "emoji": "🟣",
  "background": "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
  "isHuman": false,
  "aiDifficulty": "hard"
}
```

### AI Persoonlijkheid Aanpassen

Bewerk de `aiPersonalities` sectie:

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
          "Yes! Ik heb gewonnen! 🎉",
          "Wauw, dat ging goed! 😊"
        ],
        "lose": [
          "Goed gespeeld! 👏",
          "Volgende keer beter! 😄"
        ]
      }
    }
  }
}
```

---

## 🃏 Kaarten Maken

### Kaart Structuur

Elke kaart heeft deze eigenschappen:

```json
{
  "id": "unique_id",
  "type": "good|bad|neutral",
  "title": "Kaart Titel",
  "description": "Wat gebeurt er",
  "emoji": "🎯",
  "effect": {
    "move": 0,
    "skipTurns": 0,
    "halfDice": 0,
    "extraRoll": false
  }
}
```

### Effect Types

| Effect | Type | Beschrijving | Voorbeeld |
|--------|------|--------------|-----------|
| `move` | number | Beweeg X vakjes (+ vooruit, - achteruit) | `3` of `-2` |
| `skipTurns` | number | Sla X beurten over | `1` of `2` |
| `halfDice` | number | Halve dobbelsteen voor X beurten | `2` |
| `extraRoll` | boolean | Krijg extra beurt | `true` |

### Voorbeelden

#### Meevaller Kaart (Good)
```json
{
  "id": "good_custom_1",
  "type": "good",
  "title": "Perfecte Training",
  "description": "Je training ging perfect! Ga 4 vakjes vooruit.",
  "emoji": "💪",
  "effect": {
    "move": 4,
    "skipTurns": 0,
    "halfDice": 0,
    "extraRoll": false
  }
}
```

#### Tegenvaller Kaart (Bad)
```json
{
  "id": "bad_custom_1",
  "type": "bad",
  "title": "Blaar",
  "description": "Je hebt een blaar! Ga 3 vakjes terug.",
  "emoji": "🩹",
  "effect": {
    "move": -3,
    "skipTurns": 0,
    "halfDice": 0,
    "extraRoll": false
  }
}
```

#### Neutrale Kaart
```json
{
  "id": "neutral_custom_1",
  "type": "neutral",
  "title": "Normale Dag",
  "description": "Een gewone trainingsdag. Geen effect.",
  "emoji": "😐",
  "effect": {
    "move": 0,
    "skipTurns": 0,
    "halfDice": 0,
    "extraRoll": false
  }
}
```

#### Combinatie Effecten
```json
{
  "id": "bad_custom_2",
  "type": "bad",
  "title": "Zware Blessure",
  "description": "Ernstige blessure! Ga 2 terug en sla 1 beurt over.",
  "emoji": "🤕",
  "effect": {
    "move": -2,
    "skipTurns": 1,
    "halfDice": 0,
    "extraRoll": false
  }
}
```

### Kaart Type Kleuren

Bewerk `cardTypes` in `cards.json`:

```json
{
  "cardTypes": {
    "good": {
      "color": "#4ade80",
      "gradient": "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
    },
    "bad": {
      "color": "#f87171",
      "gradient": "linear-gradient(135deg, #f87171 0%, #ef4444 100%)"
    },
    "neutral": {
      "color": "#94a3b8",
      "gradient": "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
    }
  }
}
```

---

## ⚙️ Spel Instellingen

### Basis Instellingen

Bewerk `config/game-config.json`:

```json
{
  "game": {
    "name": "Road to the Marathon",
    "version": "2.0.0",
    "totalSquares": 60,
    "maxPlayers": 4,
    "minPlayers": 1
  }
}
```

### Bord Layout Aanpassen

```json
{
  "board": {
    "columns": 10,
    "rows": 6,
    "snakePattern": true,
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

#### Nieuwe Checkpoint Toevoegen
```json
{
  "checkpoints": [
    {"square": 15, "bonus": 2},
    {"square": 30, "bonus": 3},
    {"square": 45, "bonus": 2},
    {"square": 55, "bonus": 2}
  ]
}
```

#### Kaart Vakjes Wijzigen
```json
{
  "cardSquares": [5, 15, 25, 35, 45, 55]
}
```

### Dobbelsteen Instellingen

```json
{
  "dice": {
    "sides": 6,
    "animationDuration": 480,
    "minRolls": 3,
    "maxRolls": 5
  }
}
```

Voor een D8 dobbelsteen:
```json
{
  "dice": {
    "sides": 8,
    "animationDuration": 600
  }
}
```

### Animatie Instellingen

```json
{
  "animations": {
    "playerMove": 300,
    "cardReveal": 400,
    "diceRoll": 480,
    "turnTransition": 200
  }
}
```

Snellere animaties:
```json
{
  "animations": {
    "playerMove": 150,
    "cardReveal": 200,
    "diceRoll": 300,
    "turnTransition": 100
  }
}
```

---

## 🤖 AI Gedrag Aanpassen

### AI Moeilijkheidsgraden

Bewerk `config/game-config.json`:

```json
{
  "ai": {
    "enabled": true,
    "thinkingTimeMin": 800,
    "thinkingTimeMax": 2000,
    "difficulties": {
      "easy": {
        "thinkingTime": 1500,
        "decisionDelay": 500
      },
      "medium": {
        "thinkingTime": 1200,
        "decisionDelay": 300
      },
      "hard": {
        "thinkingTime": 900,
        "decisionDelay": 100
      }
    }
  }
}
```

### Nieuwe Moeilijkheidsgraad Toevoegen

```json
{
  "difficulties": {
    "expert": {
      "thinkingTime": 600,
      "decisionDelay": 50
    }
  }
}
```

En voeg toe aan `players.json`:

```json
{
  "aiPersonalities": {
    "expert": {
      "thinkingTime": 600,
      "messages": {
        "thinking": ["Calculerend... 🧮"],
        "win": ["Voorspelbaar. 🎯"],
        "lose": ["Interessant. 🤔"]
      }
    }
  }
}
```

---

## 🔧 Geavanceerde Aanpassingen

### Bord Grootte Wijzigen

Voor een groter bord (100 vakjes):

```json
{
  "game": {
    "totalSquares": 100
  },
  "board": {
    "columns": 10,
    "rows": 10
  }
}
```

### Meer Spelers Toestaan

```json
{
  "game": {
    "maxPlayers": 6
  }
}
```

Voeg dan 2 extra spelers toe in `players.json`.

### Geluid Effecten Inschakelen

```json
{
  "sounds": {
    "enabled": true,
    "volume": 0.5,
    "effects": {
      "diceRoll": "/sounds/dice.mp3",
      "cardDraw": "/sounds/card.mp3",
      "playerMove": "/sounds/move.mp3",
      "win": "/sounds/win.mp3"
    }
  }
}
```

### Custom Win Conditie

In de JSX component, wijzig de win conditie:

```javascript
// Origineel: bereik vakje 60
if (newPosition >= totalSquares) {
  // Win!
}

// Custom: bereik vakje EN heb 3 checkpoints
if (newPosition >= totalSquares && checkpointsReached >= 3) {
  // Win!
}
```

### Multiplayer Mode

Voor echte multiplayer (geen AI):

In `players.json`, zet alle spelers op `isHuman: true`:

```json
{
  "players": [
    {"id": 0, "name": "Rood", "isHuman": true},
    {"id": 1, "name": "Groen", "isHuman": true},
    {"id": 2, "name": "Blauw", "isHuman": true},
    {"id": 3, "name": "Geel", "isHuman": true}
  ]
}
```

---

## 💡 Tips & Tricks

### Balans Tips

1. **Kaarten Ratio**: Houd ~45% good, 45% bad, 10% neutral
2. **Move Range**: Houd moves tussen -5 en +5 voor balans
3. **Skip Turns**: Max 2 beurten overslaan
4. **Checkpoints**: Plaats elke 20-30 vakjes

### Performance Tips

1. **Animaties**: Verlaag durations voor sneller spel
2. **AI Thinking**: Verlaag times voor snellere AI
3. **Logs**: Beperk log entries tot laatste 50

### Testing Tips

1. Test nieuwe kaarten met verschillende effecten
2. Test AI op alle moeilijkheidsgraden
3. Test thema's op verschillende schermen
4. Valideer JSON syntax met een validator

---

## 🐛 Troubleshooting

### JSON Syntax Errors

Gebruik een JSON validator: https://jsonlint.com/

Veelgemaakte fouten:
- Vergeten komma tussen objecten
- Extra komma na laatste item
- Verkeerde quotes (gebruik `"` niet `'`)

### Kaarten Werken Niet

Check:
1. Is `id` uniek?
2. Is `type` correct? (`good`, `bad`, of `neutral`)
3. Zijn alle `effect` properties aanwezig?

### AI Reageert Niet

Check:
1. Is `ai.enabled` op `true`?
2. Is `isHuman` op `false` voor AI spelers?
3. Is `aiDifficulty` correct ingesteld?

### Thema Laadt Niet

Check:
1. Is `id` uniek?
2. Zijn alle kleur properties aanwezig?
3. Is de gradient syntax correct?

---

## 📚 Referenties

### Kleur Generators
- [Coolors.co](https://coolors.co/) - Gradient generator
- [UIGradients](https://uigradients.com/) - Gradient library
- [ColorHunt](https://colorhunt.co/) - Color palettes

### Emoji's
- [Emojipedia](https://emojipedia.org/) - Emoji search
- [GetEmoji](https://getemoji.com/) - Copy/paste emoji's

### JSON Tools
- [JSONLint](https://jsonlint.com/) - JSON validator
- [JSON Editor Online](https://jsoneditoronline.org/) - Visual editor

---

**Veel succes met customizen! 🎨✨**

Heb je vragen? Check de README.md of experimenteer gewoon! 🚀