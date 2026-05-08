import { useState, useEffect, useRef } from "react";

const PLAYERS = [
  { id: 0, name: "Barry", color: "#E53E3E", bg: "#FED7D7", emoji: "🔴" },
  { id: 1, name: "", color: "#38A169", bg: "#C6F6D5", emoji: "🟢" },
  { id: 2, name: "Blauw", color: "#3182CE", bg: "#BEE3F8", emoji: "🔵" },
  { id: 3, name: "Geel", color: "#D69E2E", bg: "#FEFCBF", emoji: "🟡" },
];

const TOTAL_SQUARES = 60;

const CARDS = [
  { type: "bad", title: "Door je enkel gegaan!", desc: "Sla een beurt over.", effect: { skipTurns: 1 } },
  { type: "bad", title: "Koorts 37.1°C", desc: "Bouw opnieuw op. Dobbelsteenpunten worden gehalveerd (2 beurten).", effect: { halfDice: 2 } },
  { type: "bad", title: "Spierpijn dag 2", desc: "Ga 3 vakjes terug.", effect: { move: -3 } },
  { type: "bad", title: "Regen en storm!", desc: "Training geannuleerd. Sla een beurt over.", effect: { skipTurns: 1 } },
  { type: "bad", title: "Verkeerd schoeisel", desc: "Blaren! Ga 2 vakjes terug.", effect: { move: -2 } },
  { type: "bad", title: "Overtraining", desc: "Rust verplicht. Sla 2 beurten over.", effect: { skipTurns: 2 } },
  { type: "bad", title: "Maagproblemen tijdens de loop", desc: "Terug naar de start van het segment. Ga 5 vakjes terug.", effect: { move: -5 } },
  { type: "bad", title: "Motivatiedip", desc: "Je mist de training. Dobbelsteenpunten worden gehalveerd (1 beurt).", effect: { halfDice: 1 } },
  { type: "bad", title: "Kniepijn (IT-band)", desc: "Fysio nodig. Sla 2 beurten over.", effect: { skipTurns: 2 } },
  { type: "good", title: "Perfect weer!", desc: "Ideale omstandigheden. Beweeg 3 extra vakjes.", effect: { move: 3 } },
  { type: "good", title: "Runner's high!", desc: "Geweldige training. Gooi de dobbelsteen nog een keer.", effect: { extraRoll: true } },
  { type: "good", title: "Nieuw persoonlijk record", desc: "Ga 4 vakjes vooruit.", effect: { move: 4 } },
  { type: "good", title: "Loopmaatje gevonden", desc: "Motivatie door het dak. Gooi de dobbelsteen nog een keer.", effect: { extraRoll: true } },
  { type: "good", title: "Goed geslapen", desc: "Optimaal herstel. Beweeg 2 extra vakjes.", effect: { move: 2 } },
  { type: "good", title: "Sportvoeding gesponsord", desc: "Energie boost! Ga 3 vakjes vooruit.", effect: { move: 3 } },
  { type: "good", title: "Intervaltraining voltooid", desc: "Snelheidswerk loont. Ga 4 vakjes vooruit.", effect: { move: 4 } },
  { type: "good", title: "Hardloopkamp weekend", desc: "Intensieve training. Ga 5 vakjes vooruit.", effect: { move: 5 } },
  { type: "good", title: "Community run", desc: "Samen ren je verder. Ga 3 vakjes vooruit.", effect: { move: 3 } },
  { type: "neutral", title: "Rust is ook training", desc: "Je slaat een training over maar herstelt goed. Niets verandert.", effect: {} },
  { type: "neutral", title: "Regen maar toch gegaan", desc: "Mentale kracht! Geen bonus maar ook geen straf.", effect: {} },
];

const SPECIAL_SQUARES = {
  10: { type: "card", label: "📋" },
  20: { type: "card", label: "📋" },
  30: { type: "checkpoint", label: "🏁", title: "Checkpoint!", desc: "+2 vakjes bonus!" },
  40: { type: "card", label: "📋" },
  50: { type: "card", label: "📋" },
  55: { type: "checkpoint", label: "🏁", title: "Laatste push!", desc: "+3 vakjes bonus!" },
};

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
  const [players, setPlayers] = useState(PLAYERS.map(p => ({ ...p, pos: 0, skipTurns: 0, halfDice: 0 })));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [log, setLog] = useState(["🏃 Road to the Marathon is gestart! Rood begint."]);
  const [phase, setPhase] = useState("roll"); // roll | card | done
  const [winner, setWinner] = useState(null);
  const [pendingExtraRoll, setPendingExtraRoll] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

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
      background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#f0ede8",
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
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, letterSpacing: 4, color: "#a0aec0", textTransform: "uppercase", marginBottom: 4 }}>
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
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>

        {/* Board */}
        <div style={{ flex: "0 0 auto" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            padding: 10,
            border: "1px solid rgba(255,255,255,0.1)",
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
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(255,255,255,0.07)",
                      borderRadius: 6,
                      border: isFinish ? "2px solid #f6d365" : special ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      fontSize: "clamp(7px, 1.2vw, 10px)",
                      color: isFinish ? "#1a1a1a" : "rgba(255,255,255,0.5)",
                      fontWeight: 600,
                      overflow: "hidden",
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
        <div style={{ flex: "1 1 240px", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Players */}
          <div style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: 10,
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.5, marginBottom: 8, textTransform: "uppercase" }}>Spelers</div>
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
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: 14,
            border: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
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
                    background: rolling ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${cp.color}, ${cp.color}cc)`,
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
            background: "rgba(0,0,0,0.3)",
            borderRadius: 12,
            padding: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            flex: 1,
          }}>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Logboek</div>
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
