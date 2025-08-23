import React, { useState, useEffect } from 'react';
import { commitAction, passAction, recalculateAction } from '../api';


const testCards = [1, 2, 3, 4, 5, 6, 7];

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
  const [selectedCards, setSelectedCards] = useState([]);
  const [equation, setEquation] = useState('');
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [result, setResult] = useState('');
  const [game, setGame] = useState(null);
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
    }, 2000);
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
    if (!gameId || !playerName || selectedCards.length === 0) return alert('Fill all fields');
    const res = await recalculateAction(gameId, playerName, selectedCards);
    setResult(JSON.stringify(res, null, 2));
  };

  return (
    <div>
      <h2 style={{ color: '#0ff', textShadow: '0 0 8px #0ff' }}>Game Table</h2>
      <div>
        {testCards.map((num, idx) => (
          <div
            key={idx}
            style={{
              ...cardStyle,
              background: selectedCards.includes(num) ? '#0ff' : '#222',
              color: selectedCards.includes(num) ? '#222' : '#0ff',
              cursor: 'pointer',
            }}
            onClick={() => handleCardClick(num)}
          >
            {num}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <input placeholder="Game ID" value={gameId} onChange={e => setGameId(e.target.value)} style={{ marginRight: 10 }} />
        <input placeholder="Player Name" value={playerName} onChange={e => setPlayerName(e.target.value)} style={{ marginRight: 10 }} />
        <input placeholder="Equation" value={equation} onChange={e => setEquation(e.target.value)} />
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleCommit} style={{ marginRight: 10 }}>Commit</button>
        <button onClick={handlePass} style={{ marginRight: 10 }}>Pass</button>
        <button onClick={handleRecalculate}>Recalculate</button>
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
