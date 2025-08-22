import React, { useState } from 'react';
import { createGame, joinGame, getGameState } from '../api';

const GameLobby = () => {
  const [hostName, setHostName] = useState('');
  const [mode, setMode] = useState('junior');
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');

  const handleCreateGame = async () => {
    setError('');
    try {
      const result = await createGame(hostName, mode);
      setGame(result);
      setGameId(result.id);
    } catch (e) {
      setError('Failed to create game');
    }
  };

  const handleJoinGame = async () => {
    setError('');
    try {
      const result = await joinGame(gameId, playerName);
      setGame(result);
    } catch (e) {
      setError('Failed to join game');
    }
  };

  const handleGetGame = async () => {
    setError('');
    try {
      const result = await getGameState(gameId);
      setGame(result);
    } catch (e) {
      setError('Game not found');
    }
  };

  return (
    <div>
      <h2>Game Lobby</h2>
      <div>
        <h3>Create Game</h3>
        <input placeholder="Host Name" value={hostName} onChange={e => setHostName(e.target.value)} />
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="junior">Junior</option>
          <option value="pro">Pro</option>
        </select>
        <button onClick={handleCreateGame}>Create</button>
      </div>
      <div>
        <h3>Join Game</h3>
        <input placeholder="Game ID" value={gameId} onChange={e => setGameId(e.target.value)} />
        <input placeholder="Player Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
        <button onClick={handleJoinGame}>Join</button>
      </div>
      <div>
        <h3>Get Game State</h3>
        <input placeholder="Game ID" value={gameId} onChange={e => setGameId(e.target.value)} />
        <button onClick={handleGetGame}>Get State</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {game && (
        <div>
          <h4>Game Info</h4>
          <pre>{JSON.stringify(game, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GameLobby;
