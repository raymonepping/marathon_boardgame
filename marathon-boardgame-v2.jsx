import { useState, useEffect, useRef } from "react";

// These will be loaded at runtime
let PLAYERS = [];
let TOTAL_SQUARES = 42;
let CARDS = [];
let SPECIAL_SQUARES = {};
let currentTheme = null;

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function drawCard() {
  return CARDS[Math.floor(Math.random() * CARDS.length)];
}

const Dieface = ({ value, rolling }) => {
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
  const [configLoaded, setConfigLoaded] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [log, setLog] = useState(["🏃 Road to the Marathon is gestart! Rood begint."]);
  const [phase, setPhase] = useState("roll"); // roll | card | done
  const [winner, setWinner] = useState(null);
  const [pendingExtraRoll, setPendingExtraRoll] = useState(false);
  const logRef = useRef(null);

  // Load config files on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const [cardsRes, playersRes, gameRes, themesRes] = await Promise.all([
          fetch('/config/cards.json'),
          fetch('/config/players.json'),
          fetch('/config/game-config.json'),
          fetch('/config/themes.json')
        ]);

        const cardsData = await cardsRes.json();
        const playersData = await playersRes.json();
        const gameData = await gameRes.json();
        const themesData = await themesRes.json();

        // Set global variables
        PLAYERS = playersData.players.map(p => ({
          id: p.id,
          name: p.name,
          color: p.color,
          bg: p.bg,
          emoji: p.emoji,
          isAI: !p.isHuman,
          aiDelay: p.isHuman ? 0 : (p.aiDifficulty === 'easy' ? 1500 : p.aiDifficulty === 'medium' ? 1200 : 900)
        }));

        TOTAL_SQUARES = gameData.game.totalSquares;

        CARDS = cardsData.cards.map(c => ({
          type: c.type,
          title: c.title,
          desc: c.description,
          emoji: c.emoji,
          effect: c.effect
        }));

        SPECIAL_SQUARES = Object.fromEntries(
          Object.entries(gameData.board.specialSquares).map(([key, val]) => [
            key,
            {
              type: val.type,
              label: val.label,
              title: val.title,
              desc: val.description,
              bonus: val.bonus
            }
          ])
        );

        currentTheme = themesData.themes[themesData.defaultTheme];

        // Initialize players
        setPlayers(PLAYERS.map(p => ({ ...p, pos: 0, skipTurns: 0, halfDice: 0 })));
        setConfigLoaded(true);
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    }
    loadConfig();
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  // AI player logic
  useEffect(() => {
    const cp = players[currentPlayer];
    if (phase === "roll" && !rolling && cp?.isAI && !winner) {
      const aiTimeout = setTimeout(() => {
        handleRoll();
      }, cp.aiDelay);
      return () => clearTimeout(aiTimeout);
    }
  }, [currentPlayer, phase, rolling, winner]);

  // AI card resolution
  useEffect(() => {
    const cp = players[currentPlayer];
    if (phase === "card" && activeCard && cp?.isAI) {
      const aiTimeout = setTimeout(() => {
        resolveCard();
      }, cp.aiDelay * 0.6);
      return () => clearTimeout(aiTimeout);
    }
  }, [phase, activeCard, currentPlayer]);

  const addLog = (msg) => setLog(prev => [...prev, msg]);

  const movePlayer = (pid, steps, newPlayers) => {
    const p = newPlayers[pid];
    const newPos = Math.min(p.pos + steps, TOTAL_SQUARES);
    newPlayers[pid] = { ...p, pos: newPos };
    return newPos;
  };

  const handleRoll = () => {
    if (rolling || phase !== "roll") return;
    setRolling(true);

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceValue(rollDie());
      rollCount++;
      if (rollCount >= 8) {
        clearInterval(interval);
        const finalVal = rollDie();
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
      setWinner(p);
      addLog(`🏅 ${p.emoji} ${p.name} heeft de MARATHON FINISH bereikt! GEWONNEN!`);
      setPhase("done");
      return;
    }

    const special = SPECIAL_SQUARES[newPos];
    if (special) {
      if (special.type === "card") {
        addLog(`📋 ${p.name} landt op een kaartvakje!`);
        const card = drawCard();
        setActiveCard(card);
        setPhase("card");
      } else if (special.type === "checkpoint") {
        const bonus = newPos === 30 ? 2 : 3;
        const np2 = newPlayers.map(x => ({ ...x }));
        const finalPos = movePlayer(currentPlayer, bonus, np2);
        setPlayers(np2);
        addLog(`🏁 ${special.title} ${p.name} gaat ${bonus} vakjes vooruit naar ${finalPos}!`);
        if (finalPos >= TOTAL_SQUARES) {
          setWinner(p);
          setPhase("done");
        } else {
          nextTurn(np2);
        }
      }
    } else {
      nextTurn(newPlayers);
    }
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
        setWinner(p);
        setActiveCard(null);
        setPhase("done");
        addLog(`🏅 ${p.emoji} ${p.name} heeft de MARATHON FINISH bereikt! GEWONNEN!`);
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
    const next = (currentPlayer + 1) % 4;
    setCurrentPlayer(next);
    setPendingExtraRoll(false);
    addLog(`➡️ ${PLAYERS[next].name} is aan de beurt.`);
    setPhase("roll");
  };

  const resetGame = () => {
    setPlayers(PLAYERS.map(p => ({ ...p, pos: 0, skipTurns: 0, halfDice: 0 })));
    setCurrentPlayer(0);
    setDiceValue(null);
    setActiveCard(null);
    setLog(["🏃 Nieuw spel gestart! Rood begint."]);
    setPhase("roll");
    setWinner(null);
    setPendingExtraRoll(false);
  };

  // Show loading screen while config is loading
  if (!configLoaded) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        color: "#ffffff",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🏃</div>
          <div style={{ fontSize: "24px", fontWeight: "600" }}>Loading Marathon Game...</div>
        </div>
      </div>
    );
  }

  const cp = players[currentPlayer];
  const COLS = 10;
  const ROWS = Math.ceil(TOTAL_SQUARES / COLS);

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
      background: currentTheme.background,
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      color: currentTheme.textColor,
      padding: "16px",
    }}>
      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg) scale(1.1)} 100%{transform:rotate(360deg) scale(1)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .card-overlay { animation: slideIn 0.3s ease-out; }
        .pion { animation: bounce 1s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{
          fontSize: 13,
          letterSpacing: 4,
          color: currentTheme.textColor,
          opacity: 0.7,
          textTransform: "uppercase",
          marginBottom: 8,
          fontWeight: 600
        }}>
          Het ultieme hardloopspel
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 6vw, 48px)",
          fontWeight: 900,
          margin: 0,
          color: "#ffffff",
          letterSpacing: 1,
          textShadow: "0 2px 20px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)"
        }}>
          🏃 ROAD TO THE MARATHON 🏆
        </h1>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>

        {/* Board */}
        <div style={{ flex: "0 0 auto" }}>
          <div style={{
            background: currentTheme.boardBg,
            borderRadius: 20,
            padding: 12,
            border: `2px solid ${currentTheme.panelBorder}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            {squares.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                {row.map((sq) => {
                  const special = SPECIAL_SQUARES[sq];
                  const playersHere = players.filter(p => p.pos === sq);
                  const isFinish = sq === TOTAL_SQUARES;
                  return (
                    <div key={sq} style={{
                      width: "clamp(38px, 5.5vw, 54px)",
                      height: "clamp(38px, 5.5vw, 54px)",
                      background: isFinish
                        ? currentTheme.finishGradient
                        : special?.type === "checkpoint"
                          ? currentTheme.checkpointBg
                          : special?.type === "card"
                            ? currentTheme.cardBg
                            : sq === 0
                              ? currentTheme.boardBg
                              : currentTheme.squareBg,
                      borderRadius: 8,
                      border: isFinish
                        ? `3px solid ${currentTheme.accentColor}`
                        : special
                          ? `2px solid ${currentTheme.squareBorder}`
                          : `1px solid ${currentTheme.squareBorder}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      fontSize: "clamp(7px, 1.2vw, 10px)",
                      color: isFinish ? currentTheme.textColor : currentTheme.textColor,
                      opacity: isFinish ? 1 : 0.8,
                      fontWeight: 600,
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                      boxShadow: isFinish ? `0 0 20px ${currentTheme.accentColor}40` : "none",
                    }}>
                      <div style={{
                        position: "absolute",
                        top: 2,
                        left: 2,
                        fontSize: isFinish ? "1.2em" : special ? "1em" : "1em",
                        fontWeight: 700,
                        opacity: isFinish ? 1 : special ? 0.9 : 0.8,
                        color: "#ffffff",
                        textShadow: "0 1px 3px rgba(0,0,0,0.5)"
                      }}>
                        {isFinish ? "🏆" : special ? special.label : sq}
                      </div>
                      {/* Player tokens */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                        {playersHere.map(p => (
                          <div key={p.id} className={p.pos > 0 ? "pion" : ""} style={{
                            width: "clamp(10px, 2vw, 14px)",
                            height: "clamp(10px, 2vw, 14px)",
                            borderRadius: "50%",
                            background: p.color,
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
            <div style={{ display: "flex", gap: 12, marginTop: 6, justifyContent: "center", fontSize: 10, opacity: 0.6 }}>
              <span>📋 = kaart</span>
              <span>🏁 = checkpoint</span>
              <span>🏆 = finish</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: "1 1 240px", maxWidth: 320, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Players */}
          <div style={{
            background: currentTheme.panelBg,
            borderRadius: 16,
            padding: 14,
            border: `2px solid ${currentTheme.panelBorder}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}>
            <div style={{
              fontSize: 12,
              letterSpacing: 2,
              opacity: 0.7,
              marginBottom: 10,
              textTransform: "uppercase",
              fontWeight: 700,
              color: currentTheme.accentColor
            }}>Spelers</div>
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
                border: i === currentPlayer && phase !== "done" ? `1px solid ${p.color}66` : "1px solid transparent",
                transition: "all 0.3s",
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: p.color,
                  boxShadow: i === currentPlayer ? `0 0 10px ${p.color}` : "none",
                  flexShrink: 0,
                }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: p.color }}>{p.name}</span>
                <div style={{ flex: 1 }} />
                <div style={{
                  background: "rgba(255,255,255,0.1)",
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
            background: currentTheme.panelBg,
            borderRadius: 16,
            padding: 16,
            border: `2px solid ${currentTheme.panelBorder}`,
            textAlign: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}>
            {phase !== "done" ? (
              <>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>
                  {pendingExtraRoll ? "🎲 Extra gooi!" : "Beurt van"}{" "}
                  <span style={{ color: cp.color, fontWeight: 700 }}>{cp.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  {diceValue ? <Dieface value={diceValue} rolling={rolling} /> : (
                    <div style={{
                      width: 72, height: 72, borderRadius: 14,
                      background: "rgba(255,255,255,0.1)",
                      border: "2px dashed rgba(255,255,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28,
                    }}>🎲</div>
                  )}
                </div>
                {phase === "roll" && (
                  <button onClick={handleRoll} disabled={rolling} style={{
                    background: rolling ? currentTheme.panelBg : currentTheme.buttonGradient,
                    color: currentTheme.textColor,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 32px",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: rolling ? "not-allowed" : "pointer",
                    boxShadow: rolling ? "none" : `0 6px 24px ${currentTheme.accentColor}40`,
                    transition: "all 0.3s ease",
                    fontFamily: "inherit",
                    letterSpacing: 0.5,
                    transform: rolling ? "scale(0.95)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => !rolling && (e.target.style.background = currentTheme.buttonHover)}
                  onMouseLeave={(e) => !rolling && (e.target.style.background = currentTheme.buttonGradient)}
                  >
                    {rolling ? "Gooien..." : "🎲 Gooi!"}
                  </button>
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
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>🎉 De marathon is voltooid!</div>
                <button onClick={resetGame} style={{
                  background: currentTheme.buttonGradient,
                  color: currentTheme.textColor,
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 28px",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: `0 6px 24px ${currentTheme.accentColor}40`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => e.target.style.background = currentTheme.buttonHover}
                onMouseLeave={(e) => e.target.style.background = currentTheme.buttonGradient}
                >
                  🔄 Nieuw spel
                </button>
              </div>
            )}
          </div>

          {/* Log */}
          <div style={{
            background: currentTheme.logBg,
            borderRadius: 16,
            padding: 14,
            border: `2px solid ${currentTheme.panelBorder}`,
            flex: 1,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}>
            <div style={{
              fontSize: 12,
              letterSpacing: 2,
              opacity: 0.7,
              marginBottom: 8,
              textTransform: "uppercase",
              fontWeight: 700,
              color: currentTheme.accentColor
            }}>Logboek</div>
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
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
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
            background: activeCard.type === "bad"
              ? "linear-gradient(135deg, #2d1515, #4a1a1a)"
              : activeCard.type === "good"
                ? "linear-gradient(135deg, #152d15, #1a4a1a)"
                : "linear-gradient(135deg, #1a1a2d, #1a2d4a)",
            border: `2px solid ${activeCard.type === "bad" ? "#E53E3E" : activeCard.type === "good" ? "#38A169" : "#3182CE"}`,
            borderRadius: 20,
            padding: "32px 28px",
            maxWidth: 340,
            width: "100%",
            textAlign: "center",
            boxShadow: `0 20px 60px rgba(0,0,0,0.7)`,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {activeCard.type === "bad" ? "😱" : activeCard.type === "good" ? "🎉" : "😐"}
            </div>
            <div style={{
              fontSize: 10, letterSpacing: 3,
              color: activeCard.type === "bad" ? "#FC8181" : activeCard.type === "good" ? "#68D391" : "#90CDF4",
              textTransform: "uppercase",
              marginBottom: 6,
            }}>
              {activeCard.type === "bad" ? "Tegenvaller" : activeCard.type === "good" ? "Meevaller" : "Neutraal"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>{activeCard.title}</div>
            <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, marginBottom: 20 }}>{activeCard.desc}</div>
            <button onClick={resolveCard} style={{
              background: activeCard.type === "bad"
                ? "linear-gradient(135deg, #E53E3E, #C53030)"
                : activeCard.type === "good"
                  ? "linear-gradient(135deg, #38A169, #276749)"
                  : "linear-gradient(135deg, #3182CE, #2c5282)",
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
          </div>
        </div>
      )}

      {/* Reset button */}
      {phase !== "done" && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button onClick={resetGame} style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.4)",
            borderRadius: 8,
            padding: "5px 14px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Spel opnieuw starten
          </button>
        </div>
      )}
    </div>
  );
}
