import React, { useState } from 'react';
import { healthCheck, quickPlay } from '../api';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const [health, setHealth] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const checkBackend = async () => {
    const result = await healthCheck();
    setHealth(result.status);
  };

  const handleQuickPlay = async () => {
    if (!playerName) return alert('Enter your name');
    const game = await quickPlay(playerName);
    navigate('/lobby', { state: { game, playerName } });
  };

  const handlePlayWithFriends = () => {
    if (!playerName) return alert('Enter your name');
    navigate('/lobby', { state: { playerName } });
  };

  return (
    <div>
      <h2>Main Menu</h2>
      <input placeholder="Your Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
      <ul>
        <li><button onClick={handleQuickPlay}>Quick Play</button></li>
        <li><button onClick={handlePlayWithFriends}>Play with Friends</button></li>
        <li>How to Play</li>
        <li>Settings</li>
      </ul>
      <button onClick={checkBackend}>Check Backend Health</button>
      {health && <p>Backend status: {health}</p>}
    </div>
  );
};

export default MainMenu;
