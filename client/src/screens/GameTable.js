import React, { useState } from 'react';
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
      <h2>Game Table</h2>
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
        <input placeholder="Game ID" value={gameId} onChange={e => setGameId(e.target.value)} />
        <input placeholder="Player Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
        <input placeholder="Equation" value={equation} onChange={e => setEquation(e.target.value)} />
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleCommit}>Commit</button>
        <button onClick={handlePass}>Pass</button>
        <button onClick={handleRecalculate}>Recalculate</button>
      </div>
      {result && (
        <div style={{ marginTop: 20 }}>
          <h4>Result</h4>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default GameTable;
