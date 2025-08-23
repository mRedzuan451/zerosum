export async function startGame(gameId) {
  const res = await fetch(`${API_BASE}/game/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId })
  });
  return res.json();
}
// Simple API utility for connecting frontend to backend
const API_BASE = 'http://localhost:3001/api';

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function getGameState(gameId) {
  const res = await fetch(`${API_BASE}/game/${gameId}`);
  return res.json();
}

export async function createGame(hostName, mode = 'junior') {
  const res = await fetch(`${API_BASE}/game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hostName, mode })
  });
  return res.json();
}

export async function joinGame(gameId, playerName) {
  const res = await fetch(`${API_BASE}/game/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, playerName })
  });
  return res.json();
}
