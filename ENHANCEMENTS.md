# Marathon Board Game - Chat-Based Enhancements

## Overview
This document tracks enhancements made to the game based on real marathon training experiences from the chat conversations in the `./chats` folder.

## Date: 2026-05-08

## Changes Made

### 1. Cards Configuration (`config/cards.json`)

Added **12 new cards** based on authentic marathon training experiences:

#### New Injury Cards (Bad) - 5 cards
- **bad_10**: IT-band syndroom - Skip 2 turns (common running injury mentioned frequently in chats)
- **bad_11**: Runner's knee - Move back 4 squares (specific injury discussed extensively)
- **bad_12**: Enkel vast (Ankle locked) - Move back 3 squares (compensation injury pattern)
- **bad_13**: Slechte coaching - Half dice for 2 turns (poor training programming)
- **bad_14**: Hooikoorts (Hay fever) - Skip 1 turn (spring marathon challenge)

#### New Training/Recovery Cards (Good) - 5 cards
- **good_10**: Goede coach gevonden - Move forward 4 squares (quality coaching impact)
- **good_11**: Dry needling behandeling - Move forward 3 squares (effective physio treatment)
- **good_12**: Looptechniek training - Move forward 4 squares (technique improvement)
- **good_13**: Krachttraining sessie - Move forward 3 squares (strength training benefits)
- **good_14**: Perfecte taper week - Extra roll (optimal pre-race preparation)

#### New Neutral Cards - 2 cards
- **neutral_03**: Herstelweek ingelast - No effect (recovery week strategy)
- **neutral_04**: Cross-training op de fiets - No effect (alternative training method)

### Total Card Count
- **Before**: 20 cards (9 bad, 9 good, 2 neutral)
- **After**: 32 cards (14 bad, 14 good, 4 neutral)

## Inspiration Sources from Chats

### Real Experiences Captured:
1. **IT-band and Runner's Knee**: Multiple discussions about these specific injuries and their impact on training
2. **Coaching Quality**: References to "209" coaching, discussions about training programs being too aggressive
3. **Physio Treatments**: Dry needling, manual therapy, and their effectiveness
4. **Technique Training**: Discussions about running form and gait analysis
5. **Strength Training**: Importance of building resilience through strength work
6. **Recovery Strategies**: Taper weeks, rest periods, cross-training on bike
7. **Seasonal Challenges**: Hay fever affecting spring marathon preparation
8. **Ankle Issues**: Compensation patterns and mobility problems

## Game Balance
The additions maintain game balance:
- Equal number of good and bad cards (14 each)
- Effects range from -5 to +5 squares
- Skip turns range from 1-2 turns
- Special effects (extra roll, half dice) remain limited

## Future Enhancement Ideas
Based on chat analysis, potential future additions could include:
- Weather-specific cards (extreme heat, wind, rain)
- Equipment cards (shoe selection, nutrition strategy)
- Race day cards (pacing strategy, mental game)
- Training group dynamics cards
- Milestone achievement cards

## Notes
- All new cards use Dutch language to match existing game style
- Emojis selected to visually represent each card type
- Card IDs follow existing numbering convention
- Effects align with existing game mechanics

## Visual & UX Enhancements (2026-05-08)

### Theme System Improvements

Added **3 new modern themes** with vibrant, appealing color schemes:

#### New Themes:
1. **Modern (Default)** - Purple/pink gradient theme
   - Background: Purple to pink gradient (#667eea → #764ba2 → #f093fb)
   - Bright, contemporary look with excellent contrast
   - Accent color: Pink (#f093fb)

2. **Vibrant** - Rainbow gradient theme
   - Background: Pink to cyan to green (#FA8BFF → #2BD2FF → #2BFF88)
   - High energy, playful aesthetic
   - Perfect for an exciting gaming experience

3. **Sunrise** - Warm colors theme
   - Background: Red to yellow to teal (#FF6B6B → #FFE66D → #4ECDC4)
   - Warm, inviting color palette
   - Great for morning gaming sessions

#### Enhanced Existing Themes:
- All themes now include `accentColor`, `buttonGradient`, and `buttonHover` properties
- Improved contrast and readability
- Better visual hierarchy with enhanced opacity values
- Classic themes (Dark, Light, Ocean, Forest, Sunset) remain available

### Visual Improvements:
- **Default theme changed** from "dark" to "modern" for better first impression
- **Brighter colors** throughout for more engaging experience
- **Better contrast** between UI elements
- **Modern gradients** for buttons and interactive elements
- **Consistent styling** across all themes

### Impact:
- More appealing and modern look
- Better user engagement
- Improved accessibility with better contrast
- Professional, polished appearance
- Maintains all existing functionality while enhancing visual appeal