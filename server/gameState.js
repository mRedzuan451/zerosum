// Simple in-memory game state for demo purposes
const games = {};
let nextGameId = 1;

function createGame(hostName, mode = 'junior') {
  const id = nextGameId++;
  games[id] = {
    id,
    mode,
    host: hostName,
    players: [{ name: hostName, score: 0 }],
    state: 'waiting',
    created: Date.now(),
  };
  return games[id];
}

function joinGame(gameId, playerName) {
  const game = games[gameId];
  if (!game) return null;
  if (game.players.find(p => p.name === playerName)) return game;
  game.players.push({ name: playerName, score: 0 });
  return game;
}

function startGame(gameId) {
  const game = games[gameId];
  if (!game || game.state !== 'waiting') return null;
  game.state = 'started';
  game.started = Date.now();
  return game;
}

function getGame(gameId) {
  return games[gameId] || null;
}

module.exports = { games, createGame, joinGame, getGame, startGame };
