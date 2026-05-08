# 🧪 Testing Guide - Marathon Board Game v2

Complete test plan voor het verifiëren van alle features in versie 2.0.

## 📋 Test Checklist

### ✅ Basis Functionaliteit

#### Game Start
- [ ] Game laadt zonder errors
- [ ] Speler 1 (Rood) is menselijk
- [ ] Spelers 2-4 zijn AI
- [ ] Alle spelers starten op vakje 0
- [ ] Log toont start bericht
- [ ] Dobbelsteen is zichtbaar maar leeg

#### Dobbelsteen
- [ ] Klikken op "Gooi!" rolt de dobbelsteen
- [ ] Dobbelsteen animatie speelt af (8 rolls)
- [ ] Eindwaarde is tussen 1-6
- [ ] Speler beweegt correct aantal vakjes
- [ ] Log toont correcte informatie

#### Bord
- [ ] 60 vakjes zichtbaar in snake pattern
- [ ] Vakje 0 = start
- [ ] Vakje 60 = finish (goud)
- [ ] Kaart vakjes (10, 20, 40, 50) hebben 📋
- [ ] Checkpoints (30, 55) hebben 🏁
- [ ] Speler tokens zijn zichtbaar
- [ ] Tokens animeren (bounce) wanneer ze bewegen

---

## 🤖 AI Testing

### AI Basis Gedrag
- [ ] AI spelers wachten hun beurt
- [ ] AI toont "denkt na..." bericht
- [ ] AI rolt automatisch na denktijd
- [ ] AI verwerkt kaarten automatisch
- [ ] AI berichten verschijnen in log

### AI Moeilijkheidsgraden

#### Easy (Groen)
- [ ] Denktijd: ~1.5 seconden
- [ ] Berichten: vriendelijk en aarzelend
- [ ] Thinking: "Hmm, wat moet ik doen? 🤔"
- [ ] Win: "Yes! Ik heb gewonnen! 🎉"
- [ ] Lose: "Goed gespeeld! 👏"

#### Medium (Blauw)
- [ ] Denktijd: ~1.2 seconden
- [ ] Berichten: neutraal en standaard
- [ ] Thinking: "Laat me even kijken... 🎯"
- [ ] Win: "Goed gedaan! 🏆"
- [ ] Lose: "Volgende keer beter! 💪"

#### Hard (Geel)
- [ ] Denktijd: ~0.9 seconden
- [ ] Berichten: zelfverzekerd en snel
- [ ] Thinking: "Simpel. 😎"
- [ ] Win: "Natuurlijk. 👑"
- [ ] Lose: "Interessant... 🤔"

### AI Edge Cases
- [ ] AI handelt skip turns correct
- [ ] AI handelt half dice correct
- [ ] AI handelt extra roll correct
- [ ] AI stopt bij finish
- [ ] AI wint correct

---

## 🃏 Kaarten Testing

### Kaart Vakjes
- [ ] Landen op vakje 10 → kaart
- [ ] Landen op vakje 20 → kaart
- [ ] Landen op vakje 40 → kaart
- [ ] Landen op vakje 50 → kaart
- [ ] Kaart overlay verschijnt
- [ ] Kaart toont juiste info

### Kaart Types

#### Good Cards (Meevallers)
- [ ] Groene gradient achtergrond
- [ ] 🎉 emoji
- [ ] "Meevaller" label
- [ ] Positieve effecten werken:
  - [ ] Move forward (+2 tot +5)
  - [ ] Extra roll
  - [ ] Combinaties

#### Bad Cards (Tegenvallers)
- [ ] Rode gradient achtergrond
- [ ] 😱 emoji
- [ ] "Tegenvaller" label
- [ ] Negatieve effecten werken:
  - [ ] Move backward (-2 tot -5)
  - [ ] Skip turns (1-2)
  - [ ] Half dice (1-2 beurten)
  - [ ] Combinaties

#### Neutral Cards
- [ ] Grijze gradient achtergrond
- [ ] 😐 emoji
- [ ] "Neutraal" label
- [ ] Geen effect

### Kaart Effecten

#### Move Effect
- [ ] Positief: speler gaat vooruit
- [ ] Negatief: speler gaat terug
- [ ] Kan niet onder 0
- [ ] Kan finish bereiken
- [ ] Log toont correcte info

#### Skip Turns
- [ ] Speler slaat X beurten over
- [ ] Counter wordt getoond (⏸️)
- [ ] Counter telt af per beurt
- [ ] Werkt met half dice

#### Half Dice
- [ ] Dobbelsteen wordt gehalveerd
- [ ] Minimum waarde is 1
- [ ] Counter wordt getoond (½)
- [ ] Counter telt af per beurt
- [ ] Log toont origineel + gehalveerd

#### Extra Roll
- [ ] Speler krijgt extra beurt
- [ ] "Extra gooi!" bericht
- [ ] Geen turn switch
- [ ] Werkt voor AI

---

## 🏁 Checkpoints Testing

### Checkpoint 30
- [ ] Landen op 30 → checkpoint
- [ ] +3 vakjes bonus (naar 33)
- [ ] Log toont "Checkpoint!"
- [ ] Geen kaart overlay
- [ ] Direct naar volgende beurt

### Checkpoint 55
- [ ] Landen op 55 → checkpoint
- [ ] +2 vakjes bonus (naar 57)
- [ ] Log toont "Laatste push!"
- [ ] Kan finish bereiken (55+2+X)

---

## 🎨 Thema Testing

### Thema Switcher
- [ ] Knop "🎨 Thema" zichtbaar
- [ ] Klikken toont thema selector
- [ ] 5 thema's beschikbaar
- [ ] Huidige thema is gemarkeerd

### Thema's

#### Dark (Default)
- [ ] Donkerblauwe gradient
- [ ] Witte tekst
- [ ] Goede contrast

#### Light
- [ ] Lichte gradient
- [ ] Donkere tekst
- [ ] Goede leesbaarheid

#### Ocean
- [ ] Blauwe oceaan kleuren
- [ ] Aqua accenten
- [ ] Maritiem gevoel

#### Forest
- [ ] Groene bos kleuren
- [ ] Natuurlijke tonen
- [ ] Rustig gevoel

#### Sunset
- [ ] Oranje/roze gradient
- [ ] Warme kleuren
- [ ] Avond sfeer

### Thema Persistentie
- [ ] Thema blijft tijdens spel
- [ ] Thema blijft na reset
- [ ] Alle UI elementen passen aan
- [ ] Animaties blijven smooth

---

## 📊 Statistieken Testing

### Stats Panel
- [ ] Knop "📊 Stats" zichtbaar
- [ ] Klikken toont stats panel
- [ ] Panel toont game stats
- [ ] Panel toont player stats

### Game Statistieken
- [ ] Totaal spellen telt op
- [ ] Totaal worpen telt op
- [ ] Kaarten getrokken telt op
- [ ] Checkpoints telt op
- [ ] Reset behoudt stats

### Speler Statistieken
- [ ] Elke speler heeft wins/games
- [ ] Wins tellen correct
- [ ] Games played tellen correct
- [ ] Ratio wordt getoond
- [ ] Human/AI indicator (👤/🤖)

---

## 🏆 Win Condities

### Normale Win
- [ ] Bereik vakje 60 = win
- [ ] Win overlay verschijnt
- [ ] Winnaar naam + kleur
- [ ] "🏅" emoji
- [ ] "Nieuw spel" knop

### Win via Kaart
- [ ] Move effect kan finish bereiken
- [ ] Win wordt correct afgehandeld
- [ ] Stats worden bijgewerkt

### Win via Checkpoint
- [ ] Checkpoint bonus kan finish bereiken
- [ ] Win wordt correct afgehandeld
- [ ] Stats worden bijgewerkt

### AI Win
- [ ] AI kan winnen
- [ ] AI win bericht in log
- [ ] AI lose berichten voor anderen
- [ ] Stats worden bijgewerkt

---

## 🔄 Game Flow Testing

### Complete Game
1. [ ] Start nieuw spel
2. [ ] Speler 1 (mens) gooit
3. [ ] AI spelers gooien automatisch
4. [ ] Kaarten worden getrokken
5. [ ] Checkpoints worden bereikt
6. [ ] Effecten worden toegepast
7. [ ] Iemand wint
8. [ ] Stats worden bijgewerkt
9. [ ] Reset werkt

### Edge Cases
- [ ] Meerdere spelers op zelfde vakje
- [ ] Speler op 59 gooit 6 → win
- [ ] Skip turns + half dice samen
- [ ] Extra roll op laatste beurt
- [ ] Kaart move naar finish
- [ ] Checkpoint naar finish

---

## 📱 Responsive Testing

### Desktop (1920x1080)
- [ ] Bord is goed zichtbaar
- [ ] Alle panels passen
- [ ] Geen overflow
- [ ] Animaties smooth

### Laptop (1366x768)
- [ ] Layout past aan
- [ ] Tekst leesbaar
- [ ] Knoppen klikbaar

### Tablet (768x1024)
- [ ] Bord schaalt correct
- [ ] Panels stapelen
- [ ] Touch werkt

### Mobile (375x667)
- [ ] Alles zichtbaar
- [ ] Scroll werkt
- [ ] Knoppen groot genoeg
- [ ] Tekst leesbaar

---

## 🐛 Bug Testing

### Known Issues to Check
- [ ] Log overflow (max 50 entries)
- [ ] AI timeout cleanup
- [ ] Theme switch tijdens animatie
- [ ] Rapid clicking dobbelsteen
- [ ] Card overlay tijdens AI beurt

### Performance
- [ ] Geen memory leaks
- [ ] Smooth animaties (60fps)
- [ ] Snelle AI response
- [ ] Geen lag bij theme switch

---

## 🔧 Configuration Testing

### JSON Configs

#### game-config.json
- [ ] totalSquares wijzigen werkt
- [ ] cardSquares wijzigen werkt
- [ ] checkpoints wijzigen werkt
- [ ] AI settings wijzigen werkt
- [ ] Dice sides wijzigen werkt

#### players.json
- [ ] Speler kleuren wijzigen werkt
- [ ] isHuman toggle werkt
- [ ] aiDifficulty wijzigen werkt
- [ ] Nieuwe speler toevoegen werkt
- [ ] AI berichten wijzigen werkt

#### cards.json
- [ ] Nieuwe kaart toevoegen werkt
- [ ] Kaart effecten wijzigen werkt
- [ ] Card types wijzigen werkt
- [ ] Emoji's wijzigen werkt

#### themes.json
- [ ] Nieuw thema toevoegen werkt
- [ ] Kleuren wijzigen werkt
- [ ] Gradients wijzigen werkt

---

## ✅ Acceptance Criteria

### Must Have (Critical)
- [x] Game is speelbaar
- [x] AI werkt correct
- [x] Alle kaarten werken
- [x] Win conditie werkt
- [x] Geen crashes

### Should Have (Important)
- [x] Thema's werken
- [x] Stats werken
- [x] Animaties smooth
- [x] Responsive design
- [x] AI persoonlijkheden

### Nice to Have (Optional)
- [ ] Geluid effecten
- [ ] Keyboard shortcuts
- [ ] Undo functie
- [ ] Save/load game
- [ ] Multiplayer

---

## 📝 Test Report Template

```markdown
## Test Session Report

**Date:** [YYYY-MM-DD]
**Tester:** [Naam]
**Version:** v2.0.0
**Browser:** [Chrome/Firefox/Safari]
**Platform:** [Windows/Mac/Linux]

### Tests Passed: X/Y

### Issues Found:
1. [Issue beschrijving]
   - Severity: [Critical/High/Medium/Low]
   - Steps to reproduce: [...]
   - Expected: [...]
   - Actual: [...]

### Notes:
[Algemene opmerkingen]
```

---

## 🚀 Quick Test Script

Voor snelle verificatie:

```javascript
// Open browser console en run:

// Test 1: Check configs loaded
console.log('Game Config:', gameConfig);
console.log('Players:', playersConfig);
console.log('Cards:', cardsConfig);
console.log('Themes:', themesConfig);

// Test 2: Check AI
console.log('AI Players:', 
  playersConfig.players.filter(p => !p.isHuman)
);

// Test 3: Check themes
console.log('Available Themes:', 
  Object.keys(themesConfig.themes)
);

// Test 4: Simulate game
// (Speel een volledig spel en check console voor errors)
```

---

## 📞 Reporting Issues

### Bug Report Format
```markdown
**Title:** [Korte beschrijving]

**Description:**
[Gedetailleerde beschrijving van het probleem]

**Steps to Reproduce:**
1. [Stap 1]
2. [Stap 2]
3. [Stap 3]

**Expected Behavior:**
[Wat zou er moeten gebeuren]

**Actual Behavior:**
[Wat er daadwerkelijk gebeurt]

**Environment:**
- Version: v2.0.0
- Browser: [Chrome 120]
- OS: [Windows 11]
- Screen: [1920x1080]

**Screenshots:**
[Indien van toepassing]

**Console Errors:**
```
[Plak console errors hier]
```
```

---

**Happy Testing! 🧪✨**

Vond je een bug? Gebruik het bug report format hierboven!