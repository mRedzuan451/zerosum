import React, { useState } from 'react';
import { healthCheck } from '../api';

const MainMenu = () => {
  const [health, setHealth] = useState(null);

  const checkBackend = async () => {
    const result = await healthCheck();
    setHealth(result.status);
  };

  return (
    <div>
      <h2>Main Menu</h2>
      <ul>
        <li>Quick Play</li>
        <li>Play with Friends</li>
        <li>How to Play</li>
        <li>Settings</li>
      </ul>
      <button onClick={checkBackend}>Check Backend Health</button>
      {health && <p>Backend status: {health}</p>}
    </div>
  );
};

export default MainMenu;
