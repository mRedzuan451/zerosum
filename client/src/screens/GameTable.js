import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { commitAction, passAction, recalculateAction } from '../api';


// Remove testCards, use actual hand from backend

const cardStyle = {
  display: 'inline-block',
  width: '60px',
  height: '60px',
  margin: '10px',
  background: '#222',
  color: '#0ff',
  fontSize: '2em',
  borderRadius: '8px',
  border: '2px solid #0ff',
  textAlign: 'center',
  lineHeight: '60px',
  boxShadow: '0 0 10px #0ff',
};


const GameTable = () => {
  // Recalculate discard selection state
  const [recalcMode, setRecalcMode] = useState(false);
  const [discardCards, setDiscardCards] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState([]);
  const [equation, setEquation] = useState('');
  const [gameId, setGameId] = useState(location.state?.gameId || '');
  const [playerName, setPlayerName] = useState(location.state?.playerName || '');
  const [result, setResult] = useState('');
  const [game, setGame] = useState(null);
  const [calcResult, setCalcResult] = useState('');

  useEffect(() => {
    if (game && game.mode === 'junior' && selectedCards.length === 3) {
      const hand = game.players.find(p => p.name === playerName)?.hand || [];
      const selected = selectedCards.map(idx => hand[idx]);
      // Only calculate if 2 numbers and 1 operand are selected
      const numbers = selected.filter(c => c.type === 'number');
      const operand = selected.find(c => c.type === 'operand');
      if (numbers.length === 2 && operand) {
        let result = '';
        if (operand.value === '+') result = numbers[0].value + numbers[1].value;
        else if (operand.value === '-') result = numbers[0].value - numbers[1].value;
        else if (operand.value === 'x') result = numbers[0].value * numbers[1].value;
        setCalcResult(result);
      } else {
        setCalcResult('');
      }
    } else {
      setCalcResult('');
    }
  }, [selectedCards, game, playerName]);
  // Poll game state every 2 seconds for real-time opponent status
  useEffect(() => {
    if (!gameId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/game/${gameId}`);
        const data = await res.json();
        setGame(data);
      } catch (e) {
        // Ignore errors during polling
      }
    }, 1000); // 1 second interval
    return () => clearInterval(interval);
  }, [gameId]);

  const handleCardClick = (num) => {
    setSelectedCards((prev) => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]);
  };

  const handleCommit = async () => {
    if (!gameId || !playerName || selectedCards.length === 0 || !equation) return alert('Fill all fields');
    const res = await commitAction(gameId, playerName, selectedCards, equation);
    setResult(JSON.stringify(res, null, 2));
  };

  const handlePass = async () => {
    if (!gameId || !playerName) return alert('Fill all fields');
    const res = await passAction(gameId, playerName);
    setResult(JSON.stringify(res, null, 2));
  };

  const handleRecalculate = async () => {
    // Start recalculate mode, prompt for discard selection
    setRecalcMode(true);
    setDiscardCards([]);
  };

  const handleConfirmDiscard = async () => {
    if (!gameId || !playerName) return alert('Fill all fields');
    if (discardCards.length !== 2) return alert('You must select exactly 2 cards to discard.');
    const res = await recalculateAction(gameId, playerName, discardCards);
    setResult(JSON.stringify(res, null, 2));
    // Immediately fetch latest game state for instant hand update
    try {
      const fetchRes = await fetch(`http://localhost:3001/api/game/${gameId}`);
      const data = await fetchRes.json();
      setGame(data);
    } catch (e) {}
    setRecalcMode(false);
    setDiscardCards([]);
  };

  return (
    <div>
      <h2 style={{ color: '#0ff', textShadow: '0 0 8px #0ff' }}>Game Table</h2>
      {/* Target Value Display */}
      {game && (
        <div style={{
          background: '#111',
          color: '#0ff',
          border: '2px solid #0ff',
          borderRadius: '10px',
          padding: '16px',
          margin: '0 auto 24px auto',
          maxWidth: '320px',
          textAlign: 'center',
          boxShadow: '0 0 10px #0ff',
        }}>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: 8 }}>Target Value</div>
          <div style={{ fontSize: '2em', marginBottom: 8 }}>{game.targetValue}</div>
          {game.targetEquation && (
            <div style={{ fontSize: '1em', color: '#fff' }}>Equation: <b>{game.targetEquation}</b></div>
          )}
        </div>
      )}
      {/* Calculation Result Box */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{
          width: '120px',
          height: '60px',
          background: '#222',
          color: '#0ff',
          border: '2px solid #0ff',
          borderRadius: '8px',
          textAlign: 'center',
          lineHeight: '60px',
          fontSize: '2em',
          boxShadow: '0 0 10px #0ff',
          margin: '0 auto',
        }}>
          {game && game.mode === 'junior' && calcResult !== '' ? calcResult : ''}
        </div>
      </div>
      {/* Selected card boxes */}
      {game && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: 24 }}>
          {Array.from({ length: game.mode === 'pro' ? 6 : 3 }).map((_, i) => {
            const cardIdx = selectedCards[i];
            const card = cardIdx !== undefined && game.players.find(p => p.name === playerName)?.hand?.[cardIdx];
            return (
              <div
                key={i}
                style={{
                  width: '60px',
                  height: '60px',
                  background: card ? (card.type === 'operand' ? '#444' : '#222') : '#111',
                  color: card ? (card.type === 'operand' ? '#ff0' : '#0ff') : '#555',
                  border: card ? (card.type === 'operand' ? '2px dashed #ff0' : '2px solid #0ff') : '2px solid #333',
                  borderRadius: '8px',
                  textAlign: 'center',
                  lineHeight: '60px',
                  fontSize: '2em',
                  boxShadow: card ? '0 0 10px #0ff' : 'none',
                }}
              >
                {card ? card.value : ''}
              </div>
            );
          })}
        </div>
      )}
      <div>
        <h3 style={{ color: '#fff' }}>Your Hand</h3>
        {game && game.players && playerName && (
          game.players.find(p => p.name === playerName)?.hand?.length > 0 ? (
            <div>
              {game.players.find(p => p.name === playerName).hand.map((card, idx) => {
                // If in recalcMode, highlight discard selection
                const isDiscard = recalcMode && discardCards.includes(idx);
                const isSelected = !recalcMode && selectedCards.includes(idx);
                return (
                  <div
                    key={idx}
                    style={{
                      ...cardStyle,
                      background: isSelected ? '#0ff' : (card.type === 'operand' ? '#444' : '#222'),
                      color: isSelected ? '#222' : (card.type === 'operand' ? '#ff0' : '#0ff'),
                      border: card.type === 'operand' ? '2px dashed #ff0' : '2px solid #0ff',
                      cursor: 'pointer',
                      display: 'inline-block',
                      position: 'relative',
                      top: isDiscard ? '-16px' : '0',
                      boxShadow: isDiscard ? '0 0 20px #f00' : (isSelected ? '0 0 10px #0ff' : ''),
                    }}
                    onClick={() => {
                      if (recalcMode) {
                        setDiscardCards(prev => prev.includes(idx)
                          ? prev.filter(i => i !== idx)
                          : prev.length < 2 ? [...prev, idx] : prev);
                      } else {
                        setSelectedCards(prev => prev.includes(idx)
                          ? prev.filter(i => i !== idx)
                          : [...prev, idx]);
                      }
                    }}
                  >
                    {card.value}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: '#f00' }}>No cards in hand.</div>
          )
        )}
        {/* Recalculate confirm UI */}
        {recalcMode && (
          <div style={{ marginTop: 16 }}>
            <button
              onClick={handleConfirmDiscard}
              disabled={discardCards.length !== 2}
              style={{
                background: discardCards.length === 2 ? '#0ff' : '#888',
                color: '#222',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: discardCards.length === 2 ? 'pointer' : 'not-allowed',
                marginRight: 10,
              }}
            >
              Confirm Discard
            </button>
            <button
              onClick={() => { setRecalcMode(false); setDiscardCards([]); }}
              style={{
                background: '#f00',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <input placeholder="Equation" value={equation} onChange={e => setEquation(e.target.value)} />
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleCommit} style={{ marginRight: 10 }}>Commit</button>
        <button onClick={handlePass} style={{ marginRight: 10 }}>Pass</button>
        <button onClick={handleRecalculate} style={{ marginRight: 10 }}>Recalculate</button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to exit the game?')) {
              navigate('/');
            }
          }}
          style={{ background: '#f00', color: '#fff', marginLeft: 20, padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Exit Game
        </button>
      </div>
      {/* Opponent status */}
      {game && game.players && (
        <div style={{ marginTop: 30 }}>
          <h3 style={{ color: '#0ff' }}>Players</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {game.players.map((p, idx) => {
              const isCurrent = p.name === playerName;
              return (
                <div
                  key={idx}
                  style={{
                    background: isCurrent ? '#0ff' : '#222',
                    color: isCurrent ? '#222' : '#0ff',
                    border: '2px solid #0ff',
                    borderRadius: '10px',
                    padding: '16px',
                    minWidth: '120px',
                    boxShadow: isCurrent ? '0 0 16px #0ff' : '0 0 8px #0ff',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: 8 }}>{p.name}</div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: p.ready ? '#0f0' : '#f00',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.95em',
                      marginBottom: 6,
                    }}
                  >
                    {p.ready ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h4>Result</h4>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default GameTable;
