import { useState, useEffect, useRef } from "react";

// Import JSON configurations
import gameConfig from "./config/game-config.json";
import playersConfig from "./config/players.json";
import cardsConfig from "./config/cards.json";
import themesConfig from "./config/themes.json";

// Helper functions
function rollDie(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

function drawCard(cards) {
  return cards[Math.floor(Math.random() * cards.length)];
}

function getRandomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

// Dice component
const Dieface = ({ value, rolling, sides = 6 }) => {
  const dots = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
  };
  const positions = dots[value] || dots[1];
  
  return (
    <div style={{
      width: 72, height: 72,
      background: rolling ? "linear-gradient(135deg, #fff 0%, #e8e8e8 100%)" : "white",
      borderRadius: 14,
      border: "2px solid #333",
      boxShadow: "3px 3px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.8)",
      position: "relative",
      animation: rolling ? "spin 0.4s ease-out" : "none",
      transition: "all 0.2s",
    }}>
      <svg width="72" height="72" viewBox="0 0 100 100">
        {positions.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={8} fill="#1a1a1a" />
        ))}
      </svg>
    </div>
  );
};

export default function MarathonGame() {
  // Load configurations
  const TOTAL_SQUARES = gameConfig.game.totalSquares;
  const DICE_SIDES = gameConfig.dice.sides;
  const CARDS = cardsConfig.cards;
  const CARD_TYPES = cardsConfig.cardTypes;
  const SPECIAL_SQUARES = {};
  
  // Build special squares from config
  gameConfig.board.specialSquares.cardSquares.forEach(sq => {
    SPECIAL_SQUARES[sq] = { type: "card", label: "📋" };
  });
  gameConfig.board.specialSquares.checkpoints.forEach(cp => {
    SPECIAL_SQUARES[cp.square] = { 
      type: "checkpoint", 
      label: "🏁", 
      bonus: cp.bonus,
      title: cp.square === 30 ? "Checkpoint!" : "Laatste push!",
      desc: `+${cp.bonus} vakjes bonus!`
    };
  });

  // State management
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [players, setPlayers] = useState(
    playersConfig.players.map(p => ({ 
      ...p, 
      pos: 0, 
      skipTurns: 0, 
      halfDice: 0,
      wins: 0,
      gamesPlayed: 0
    }))
  );
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [log, setLog] = useState([`🏃 ${gameConfig.game.name} is gestart! ${playersConfig.players[0].name} begint.`]);
  const [phase, setPhase] = useState("roll"); // roll | card | done | ai-thinking
  const [winner, setWinner] = useState(null);
  const [pendingExtraRoll, setPendingExtraRoll] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    totalRolls: 0,
    cardsDrawn: 0,
    checkpointsReached: 0
  });
  
  const logRef = useRef(null);
  const aiTimeoutRef = useRef(null);

  // Get current theme
  const theme = themesConfig.themes[currentTheme];

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  // AI player logic
  useEffect(() => {
    const cp = players[currentPlayer];
    
    if (phase === "roll" && !rolling && cp && !cp.isHuman && !winner) {
      setAiThinking(true);
      const personality = playersConfig.aiPersonalities[cp.aiDifficulty];
      const thinkingTime = personality.thinkingTime + Math.random() * 500;
      
      // Add thinking message
      const thinkingMsg = getRandomMessage(personality.messages.thinking);
      addLog(`💭 ${cp.name}: "${thinkingMsg}"`);
      
      aiTimeoutRef.current = setTimeout(() => {
        setAiThinking(false);
        handleRoll();
      }, thinkingTime);
    }

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [currentPlayer, phase, rolling, winner]);

  // AI card resolution
  useEffect(() => {
    const cp = players[currentPlayer];
    
    if (phase === "card" && activeCard && cp && !cp.isHuman) {
      const personality = playersConfig.aiPersonalities[cp.aiDifficulty];
      const delay = personality.thinkingTime * 0.6;
      
      aiTimeoutRef.current = setTimeout(() => {
        resolveCard();
      }, delay);
    }

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [phase, activeCard, currentPlayer]);

  const addLog = (msg) => setLog(prev => [...prev.slice(-49), msg]); // Keep last 50 logs

  const movePlayer = (pid, steps, newPlayers) => {
    const p = newPlayers[pid];
    const newPos = Math.min(p.pos + steps, TOTAL_SQUARES);
    newPlayers[pid] = { ...p, pos: newPos };
    return newPos;
  };

  const handleRoll = () => {
    if (rolling || phase !== "roll") return;
    setRolling(true);

    // Update stats
    setGameStats(prev => ({ ...prev, totalRolls: prev.totalRolls + 1 }));

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceValue(rollDie(DICE_SIDES));
      rollCount++;
      if (rollCount >= 8) {
        clearInterval(interval);
        const finalVal = rollDie(DICE_SIDES);
        setDiceValue(finalVal);
        setRolling(false);
        processRoll(finalVal);
      }
    }, 60);
  };

  const processRoll = (val) => {
    const p = players[currentPlayer];
    let actualVal = val;

    if (p.halfDice > 0) {
      actualVal = Math.max(1, Math.floor(val / 2));
      addLog(`⚠️ ${p.name} herstelt nog — dobbelsteenpunten gehalveerd: ${val} → ${actualVal}`);
    }

    const newPlayers = players.map(x => ({ ...x }));

    if (p.skipTurns > 0) {
      newPlayers[currentPlayer].skipTurns -= 1;
      if (p.halfDice > 0) newPlayers[currentPlayer].halfDice = Math.max(0, p.halfDice - 1);
      addLog(`⏸️ ${p.name} slaat een beurt over (nog ${newPlayers[currentPlayer].skipTurns} te gaan).`);
      setPlayers(newPlayers);
      nextTurn(newPlayers);
      return;
    }

    if (p.halfDice > 0) newPlayers[currentPlayer].halfDice = Math.max(0, p.halfDice - 1);

    const newPos = movePlayer(currentPlayer, actualVal, newPlayers);
    addLog(`🎲 ${p.name} gooit ${val}${actualVal !== val ? ` (→${actualVal})` : ""} en staat nu op vakje ${newPos}.`);

    setPlayers(newPlayers);

    if (newPos >= TOTAL_SQUARES) {
      handleWin(p, newPlayers);
      return;
    }

    const special = SPECIAL_SQUARES[newPos];
    if (special) {
      if (special.type === "card") {
        addLog(`📋 ${p.name} landt op een kaartvakje!`);
        const card = drawCard(CARDS);
        setActiveCard(card);
        setPhase("card");
        setGameStats(prev => ({ ...prev, cardsDrawn: prev.cardsDrawn + 1 }));
      } else if (special.type === "checkpoint") {
        const bonus = special.bonus;
        const np2 = newPlayers.map(x => ({ ...x }));
        const finalPos = movePlayer(currentPlayer, bonus, np2);
        setPlayers(np2);
        addLog(`🏁 ${special.title} ${p.name} gaat ${bonus} vakjes vooruit naar ${finalPos}!`);
        setGameStats(prev => ({ ...prev, checkpointsReached: prev.checkpointsReached + 1 }));
        
        if (finalPos >= TOTAL_SQUARES) {
          handleWin(p, np2);
        } else {
          nextTurn(np2);
        }
      }
    } else {
      nextTurn(newPlayers);
    }
  };

  const handleWin = (player, newPlayers) => {
    setWinner(player);
    addLog(`🏅 ${player.emoji} ${player.name} heeft de MARATHON FINISH bereikt! GEWONNEN!`);
    
    // Update player stats
    const updatedPlayers = newPlayers.map(p => ({
      ...p,
      gamesPlayed: p.gamesPlayed + 1,
      wins: p.id === player.id ? p.wins + 1 : p.wins
    }));
    setPlayers(updatedPlayers);
    
    // Update game stats
    setGameStats(prev => ({ ...prev, totalGames: prev.totalGames + 1 }));
    
    // AI win/lose messages
    if (!player.isHuman) {
      const personality = playersConfig.aiPersonalities[player.aiDifficulty];
      const winMsg = getRandomMessage(personality.messages.win);
      addLog(`💬 ${player.name}: "${winMsg}"`);
    }
    
    // Losing AI messages
    updatedPlayers.forEach(p => {
      if (!p.isHuman && p.id !== player.id) {
        const personality = playersConfig.aiPersonalities[p.aiDifficulty];
        const loseMsg = getRandomMessage(personality.messages.lose);
        addLog(`💬 ${p.name}: "${loseMsg}"`);
      }
    });
    
    setPhase("done");
  };

  const resolveCard = () => {
    if (!activeCard) return;
    const p = players[currentPlayer];
    const newPlayers = players.map(x => ({ ...x }));
    const e = activeCard.effect;

    if (e.skipTurns) newPlayers[currentPlayer].skipTurns += e.skipTurns;
    if (e.halfDice) newPlayers[currentPlayer].halfDice += e.halfDice;
    if (e.move) {
      const np = movePlayer(currentPlayer, e.move, newPlayers);
      addLog(`${e.move > 0 ? "➡️" : "⬅️"} ${p.name} ${e.move > 0 ? "gaat vooruit" : "gaat terug"} ${Math.abs(e.move)} vakjes → vakje ${np}.`);
      if (np >= TOTAL_SQUARES) {
        setPlayers(newPlayers);
        handleWin(p, newPlayers);
        setActiveCard(null);
        return;
      }
    }
    if (e.extraRoll) {
      addLog(`🎲 ${p.name} mag nog een keer gooien!`);
      setPlayers(newPlayers);
      setActiveCard(null);
      setPendingExtraRoll(true);
      setPhase("roll");
      return;
    }

    setPlayers(newPlayers);
    setActiveCard(null);

    if (e.skipTurns) {
      addLog(`⏸️ ${p.name} slaat ${e.skipTurns} beurt(en) over.`);
    }
    nextTurn(newPlayers);
  };

  const nextTurn = (newPlayers) => {
    const next = (currentPlayer + 1) % players.length;
    setCurrentPlayer(next);
    setPendingExtraRoll(false);
    addLog(`➡️ ${playersConfig.players[next].name} is aan de beurt.`);
    setPhase("roll");
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, pos: 0, skipTurns: 0, halfDice: 0 })));
    setCurrentPlayer(0);
    setDiceValue(null);
    setActiveCard(null);
    setLog([`🏃 Nieuw spel gestart! ${playersConfig.players[0].name} begint.`]);
    setPhase("roll");
    setWinner(null);
    setPendingExtraRoll(false);
    setAiThinking(false);
  };

  const cp = players[currentPlayer];
  const COLS = gameConfig.board.columns;
  const ROWS = gameConfig.board.rows;

  // Build board squares: snake pattern
  const squares = [];
  for (let row = 0; row < ROWS; row++) {
    const rowSquares = [];
    for (let col = 0; col < COLS; col++) {
      const idx = row % 2 === 0
        ? row * COLS + col + 1
        : row * COLS + (COLS - 1 - col) + 1;
      rowSquares.push(idx);
    }
    squares.push(rowSquares);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.background,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: theme.textColor,
      padding: "16px",
      transition: "all 0.5s ease",
    }}>
      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg) scale(1.1)} 100%{transform:rotate(360deg) scale(1)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .card-overlay { animation: slideIn 0.3s ease-out; }
        .pion { animation: bounce 1s ease-in-out infinite; }
        .thinking { animation: pulse 1.5s ease-in-out infinite; }
        .fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ 
          fontSize: 13, 
          letterSpacing: 4, 
          color: theme.textSecondary, 
          textTransform: "uppercase", 
          marginBottom: 4 
        }}>
          Het ultieme hardloopspel
        </div>
        <h1 style={{
          fontSize: "clamp(22px, 5vw, 38px)",
          fontWeight: 900,
          margin: 0,
          background: "linear-gradient(90deg, #f6d365 0%, #fda085 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: 2,
        }}>
          🏃 ROAD TO THE MARATHON 🏆
        </h1>
        
        {/* Theme & Stats buttons */}
        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            style={{
              background: theme.buttonBg,
              border: `1px solid ${theme.panelBorder}`,
              color: theme.textColor,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.target.style.background = theme.buttonHover}
            onMouseLeave={e => e.target.style.background = theme.buttonBg}
          >
            🎨 Thema
          </button>
          <button 
            onClick={() => setShowStats(!showStats)}
            style={{
              background: theme.buttonBg,
              border: `1px solid ${theme.panelBorder}`,
              color: theme.textColor,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.target.style.background = theme.buttonHover}
            onMouseLeave={e => e.target.style.background = theme.buttonBg}
          >
            📊 Stats
          </button>
        </div>

        {/* Theme Selector */}
        {showThemeSelector && (
          <div className="fade-in" style={{
            marginTop: 12,
            background: theme.panelBg,
            border: `1px solid ${theme.panelBorder}`,
            borderRadius: 12,
            padding: 12,
            display: "inline-block",
          }}>
            <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8, textTransform: "uppercase", letterSpacing: 2 }}>
              Kies een thema
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {Object.keys(themesConfig.themes).map(themeKey => (
                <button
                  key={themeKey}
                  onClick={() => {
                    setCurrentTheme(themeKey);
                    setShowThemeSelector(false);
                  }}
                  style={{
                    background: themesConfig.themes[themeKey].background,
                    border: currentTheme === themeKey ? "2px solid #f6d365" : "2px solid transparent",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: themesConfig.themes[themeKey].textColor,
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    transform: currentTheme === themeKey ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {themesConfig.themes[themeKey].name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Panel */}
        {showStats && (
          <div className="fade-in" style={{
            marginTop: 12,
            background: theme.panelBg,
            border: `1px solid ${theme.panelBorder}`,
            borderRadius: 12,
            padding: 12,
            display: "inline-block",
            minWidth: 280,
          }}>
            <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8, textTransform: "uppercase", letterSpacing: 2 }}>
              Statistieken
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
              <div>🎮 Totaal spellen: <strong>{gameStats.totalGames}</strong></div>
              <div>🎲 Totaal worpen: <strong>{gameStats.totalRolls}</strong></div>
              <div>🃏 Kaarten getrokken: <strong>{gameStats.cardsDrawn}</strong></div>
              <div>🏁 Checkpoints: <strong>{gameStats.checkpointsReached}</strong></div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.panelBorder}` }}>
              <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 6 }}>SPELER STATISTIEKEN</div>
              {players.map(p => (
                <div key={p.id} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  fontSize: 11, 
                  marginBottom: 4,
                  padding: "4px 8px",
                  background: theme.boardBg,
                  borderRadius: 6,
                }}>
                  <span style={{ color: p.color, fontWeight: 600 }}>{p.emoji} {p.name}</span>
                  <span>{p.wins}/{p.gamesPlayed} {p.isHuman ? "👤" : "🤖"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>

        {/* Board */}
        <div style={{ flex: "0 0 auto" }}>
          <div style={{
            background: theme.boardBg,
            borderRadius: 16,
            padding: 10,
            border: `1px solid ${theme.boardBorder}`,
          }}>
            {squares.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                {row.map((sq) => {
                  const special = SPECIAL_SQUARES[sq];
                  const playersHere = players.filter(p => p.pos === sq);
                  const isFinish = sq === TOTAL_SQUARES;
                  return (
                    <div key={sq} style={{
                      width: "clamp(36px, 5.5vw, 52px)",
                      height: "clamp(36px, 5.5vw, 52px)",
                      background: isFinish
                        ? "linear-gradient(135deg, #f6d365, #fda085)"
                        : special?.type === "checkpoint"
                          ? "rgba(246, 211, 101, 0.25)"
                          : special?.type === "card"
                            ? "rgba(129, 230, 217, 0.18)"
                            : sq === 0
                              ? theme.squareBg
                              : theme.squareBg,
                      borderRadius: 6,
                      border: isFinish 
                        ? "2px solid #f6d365" 
                        : special 
                          ? `1px solid ${theme.panelBorder}` 
                          : `1px solid ${theme.boardBorder}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      fontSize: "clamp(7px, 1.2vw, 10px)",
                      color: isFinish ? "#1a1a1a" : theme.textSecondary,
                      fontWeight: 600,
                      overflow: "hidden",
                      transition: "all 0.2s",
                    }}>
                      <div style={{ position: "absolute", top: 2, left: 2, fontSize: "0.7em", opacity: 0.6 }}>
                        {isFinish ? "🏆" : special ? special.label : sq}
                      </div>
                      {/* Player tokens */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                        {playersHere.map(p => (
                          <div key={p.id} className={p.pos > 0 ? "pion" : ""} style={{
                            width: "clamp(10px, 2vw, 14px)",
                            height: "clamp(10px, 2vw, 14px)",
                            borderRadius: "50%",
                            background: p.background || p.color,
                            border: `1.5px solid white`,
                            boxShadow: `0 0 6px ${p.color}`,
                          }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ 
              display: "flex", 
              gap: 12, 
              marginTop: 6, 
              justifyContent: "center", 
              fontSize: 10, 
              opacity: 0.6,
              color: theme.textSecondary 
            }}>
              <span>📋 = kaart</span>
              <span>🏁 = checkpoint</span>
              <span>🏆 = finish</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: "1 1 240px", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Players */}
          <div style={{
            background: theme.panelBg,
            borderRadius: 12,
            padding: 10,
            border: `1px solid ${theme.panelBorder}`,
          }}>
            <div style={{ 
              fontSize: 11, 
              letterSpacing: 2, 
              opacity: 0.5, 
              marginBottom: 8, 
              textTransform: "uppercase",
              color: theme.textSecondary 
            }}>
              Spelers
            </div>
            {players.map((p, i) => (
              <div key={p.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 8,
                marginBottom: 4,
                background: i === currentPlayer && phase !== "done"
                  ? `linear-gradient(90deg, ${p.color}33, transparent)`
                  : "transparent",
                border: i === currentPlayer && phase !== "done" 
                  ? `1px solid ${p.color}66` 
                  : "1px solid transparent",
                transition: "all 0.3s",
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: p.background || p.color,
                  boxShadow: i === currentPlayer ? `0 0 10px ${p.color}` : "none",
                  flexShrink: 0,
                }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: p.color }}>
                  {p.name} {!p.isHuman && "🤖"}
                </span>
                <div style={{ flex: 1 }} />
                <div style={{
                  background: theme.buttonBg,
                  borderRadius: 20,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  {p.pos}/{TOTAL_SQUARES}
                </div>
                {p.skipTurns > 0 && <span title="Slaat beurt over" style={{ fontSize: 13 }}>⏸️</span>}
                {p.halfDice > 0 && <span title="Halve dobbelsteen" style={{ fontSize: 13 }}>½</span>}
              </div>
            ))}
          </div>

          {/* Dice & Action */}
          <div style={{
            background: theme.panelBg,
            borderRadius: 12,
            padding: 14,
            border: `1px solid ${theme.panelBorder}`,
            textAlign: "center",
          }}>
            {phase !== "done" ? (
              <>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6, color: theme.textSecondary }}>
                  {pendingExtraRoll ? "🎲 Extra gooi!" : aiThinking ? "🤖 AI denkt na..." : "Beurt van"}{" "}
                  <span style={{ color: cp.color, fontWeight: 700 }}>{cp.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  {diceValue ? <Dieface value={diceValue} rolling={rolling} sides={DICE_SIDES} /> : (
                    <div style={{
                      width: 72, height: 72, borderRadius: 14,
                      background: theme.buttonBg,
                      border: `2px dashed ${theme.panelBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28,
                    }}>🎲</div>
                  )}
                </div>
                {phase === "roll" && cp.isHuman && (
                  <button onClick={handleRoll} disabled={rolling} style={{
                    background: rolling ? theme.buttonBg : cp.background || `linear-gradient(135deg, ${cp.color}, ${cp.color}cc)`,
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 28px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: rolling ? "not-allowed" : "pointer",
                    boxShadow: rolling ? "none" : `0 4px 20px ${cp.color}66`,
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    letterSpacing: 1,
                  }}>
                    {rolling ? "Gooien..." : "🎲 Gooi!"}
                  </button>
                )}
                {aiThinking && (
                  <div className="thinking" style={{
                    fontSize: 11,
                    opacity: 0.7,
                    marginTop: 8,
                    color: theme.textSecondary
                  }}>
                    💭 {cp.name} overweegt de beste zet...
                  </div>
                )}
              </>
            ) : (
              <div>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🏅</div>
                <div style={{
                  fontSize: 18, fontWeight: 900, marginBottom: 4,
                  color: winner?.color,
                }}>
                  {winner?.name} wint!
                </div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, color: theme.textSecondary }}>
                  🎉 De marathon is voltooid!
                </div>
                <button onClick={resetGame} style={{
                  background: "linear-gradient(135deg, #f6d365, #fda085)",
                  color: "#1a1a1a",
                  border: "none", borderRadius: 10,
                  padding: "8px 20px", fontSize: 13,
                  fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit",
                }}>
                  Nieuw spel
                </button>
              </div>
            )}
          </div>

          {/* Log */}
          <div style={{
            background: theme.panelBg,
            borderRadius: 12,
            padding: 10,
            border: `1px solid ${theme.panelBorder}`,
            flex: 1,
          }}>
            <div style={{ 
              fontSize: 11, 
              letterSpacing: 2, 
              opacity: 0.5, 
              marginBottom: 6, 
              textTransform: "uppercase",
              color: theme.textSecondary 
            }}>
              Logboek
            </div>
            <div ref={logRef} style={{
              maxHeight: 180,
              overflowY: "auto",
              fontSize: 11,
              lineHeight: 1.7,
              opacity: 0.8,
            }}>
              {log.map((l, i) => (
                <div key={i} style={{
                  padding: "2px 0",
                  borderBottom: `1px solid ${theme.boardBorder}`,
                  color: i === log.length - 1 ? "#f6d365" : "inherit",
                  fontWeight: i === log.length - 1 ? 600 : 400,
                }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card overlay */}
      {activeCard && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100,
          padding: 20,
        }}>
          <div className="card-overlay" style={{
            background: CARD_TYPES[activeCard.type].gradient,
            border: `2px solid ${CARD_TYPES[activeCard.type].color}`,
            borderRadius: 20,
            padding: "32px 28px",
            maxWidth: 340,
            width: "100%",
            textAlign: "center",
            boxShadow: `0 20px 60px rgba(0,0,0,0.7)`,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {activeCard.emoji}
            </div>
            <div style={{
              fontSize: 10, letterSpacing: 3,
              color: CARD_TYPES[activeCard.type].color,
              textTransform: "uppercase",
              marginBottom: 6,
            }}>
              {activeCard.type === "bad" ? "Tegenvaller" : activeCard.type === "good" ? "Meevaller" : "Neutraal"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>{activeCard.title}</div>
            <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, marginBottom: 20 }}>
              {activeCard.description}
            </div>
            {cp.isHuman && (
              <button onClick={resolveCard} style={{
                background: CARD_TYPES[activeCard.type].gradient,
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "12px 32px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: 1,
                boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
              }}>
                Begrepen →
              </button>
            )}
            {!cp.isHuman && (
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
                AI verwerkt kaart...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset button */}
      {phase !== "done" && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button onClick={resetGame} style={{
            background: "transparent",
            border: `1px solid ${theme.panelBorder}`,
            color: theme.textSecondary,
            borderRadius: 8,
            padding: "5px 14px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}>
            Spel opnieuw starten
          </button>
        </div>
      )}
    </div>
  );
}

// Made with Bob
