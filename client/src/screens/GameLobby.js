

import React, { useState, useEffect } from 'react';
import { createGame, joinGame, getGameState, startGame, createPrivateGame, joinGameByCode, setReady } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';

const GameLobby = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hostName, setHostName] = useState(location.state?.playerName || '');
  const [mode, setMode] = useState('junior');
  const [gameId, setGameId] = useState(location.state?.game?.id || '');
  const [playerName, setPlayerName] = useState(location.state?.playerName || '');
  const [game, setGame] = useState(location.state?.game || null);
  const [error, setError] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (game && game.state === 'started') {
      navigate('/game', { state: { gameId, playerName } });
    }
  }, [game, gameId, playerName, navigate]);

  // Poll game state every 2 seconds for real-time updates
  useEffect(() => {
    if (!gameId) return;
    const interval = setInterval(async () => {
      try {
        const result = await getGameState(gameId);
        setGame(result);
      } catch (e) {
        // Ignore errors during polling
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [gameId]);

  const handleSetReady = async (ready) => {
    setError('');
    try {
      const result = await setReady(gameId, playerName, ready);
      setGame(result);
      setIsReady(ready);
    } catch (e) {
      setError('Failed to set ready');
    }
  };

  const handleStartGame = async () => {
    setError('');
    try {
      const result = await startGame(gameId);
      setGame(result);
    } catch (e) {
      setError('Failed to start game');
    }
  };

  const handleCreatePrivateGame = async () => {
    setError('');
    try {
      const result = await createPrivateGame(hostName, mode);
      setGame(result);
      setGameId(result.id);
      setRoomCode(result.roomCode);
    } catch (e) {
      setError('Failed to create private game');
    }
  };

  const handleJoinGameByCode = async () => {
    setError('');
    try {
      const result = await joinGameByCode(roomCode, playerName);
      setGame(result);
      setGameId(result.id);
    } catch (e) {
      setError('Failed to join game by code');
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
        <h3>Create Private Game</h3>
        <input placeholder="Host Name" value={hostName} onChange={e => setHostName(e.target.value)} />
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="junior">Junior</option>
          <option value="pro">Pro</option>
        </select>
        <button onClick={handleCreatePrivateGame}>Create Private Game</button>
        {roomCode && <p>Room Code: <b>{roomCode}</b></p>}
      </div>
      <div>
        <h3>Join Game by Room Code</h3>
        <input placeholder="Room Code" value={roomCode} onChange={e => setRoomCode(e.target.value)} />
        <input placeholder="Player Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
        <button onClick={handleJoinGameByCode}>Join by Code</button>
      </div>
      <div>
        <h3>Get Game State</h3>
        <input placeholder="Game ID" value={gameId} onChange={e => setGameId(e.target.value)} />
        <button onClick={handleGetGame}>Get State</button>
      </div>
      <div>
        <h3>Ready Status</h3>
        <button onClick={() => handleSetReady(true)} disabled={isReady}>Ready</button>
        <button onClick={() => handleSetReady(false)} disabled={!isReady}>Not Ready</button>
        {game && game.players && (
          <ul>
            {game.players.map((p, idx) => (
              <li key={idx}>{p.name} - {p.ready ? 'Ready' : 'Not Ready'}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3>Start Game</h3>
        <button onClick={handleStartGame} disabled={!(game && game.players && game.players.length > 0 && game.players.every(p => p.ready))}>Start</button>
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
}

export default GameLobby;
