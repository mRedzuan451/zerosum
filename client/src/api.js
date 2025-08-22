// Simple API utility for connecting frontend to backend
const API_BASE = 'http://localhost:3001/api';

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function getGameState() {
  const res = await fetch(`${API_BASE}/game`);
  return res.json();
}

export async function createGame() {
  const res = await fetch(`${API_BASE}/game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  return res.json();
}

export async function joinGame() {
  const res = await fetch(`${API_BASE}/game/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  return res.json();
}
