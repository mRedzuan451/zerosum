export async function setReady(gameId, playerName, ready) {
  const res = await fetch(`${API_BASE}/game/ready`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, playerName, ready })
  });
  return res.json();
}
export async function commitAction(gameId, playerName, cards, equation) {
  const res = await fetch(`${API_BASE}/game/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, playerName, cards, equation })
  });
  return res.json();
}

export async function passAction(gameId, playerName) {
  const res = await fetch(`${API_BASE}/game/pass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, playerName })
  });
  return res.json();
}

export async function recalculateAction(gameId, playerName, discardCards) {
  const res = await fetch(`${API_BASE}/game/recalculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, playerName, discardCards })
  });
  return res.json();
}
export async function quickPlay(playerName) {
  const res = await fetch(`${API_BASE}/game/quickplay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName })
  });
  return res.json();
}

export async function createPrivateGame(hostName, mode = 'junior') {
  const res = await fetch(`${API_BASE}/game/private`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hostName, mode })
  });
  return res.json();
}

export async function joinGameByCode(roomCode, playerName) {
  const res = await fetch(`${API_BASE}/game/joincode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomCode, playerName })
  });
  return res.json();
}
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
