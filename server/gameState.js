// Simple in-memory game state for demo purposes

const games = {};
let nextGameId = 1;
let quickPlayQueue = [];

function generateRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}


function createGame(hostName, mode = 'junior', isQuickPlay = false) {
  const id = nextGameId++;
  const roomCode = generateRoomCode();
  games[id] = {
    id,
    mode,
    host: hostName,
    players: [{ name: hostName, score: 0 }],
    state: 'waiting',
    created: Date.now(),
    roomCode,
    isQuickPlay,
  };
  return games[id];
}

function joinQuickPlay(playerName) {
  // Try to find a waiting quick play game with less than 8 players
  let game = Object.values(games).find(g => g.isQuickPlay && g.state === 'waiting' && g.players.length < 8);
  if (!game) {
    game = createGame(playerName, 'junior', true);
  } else {
    if (!game.players.find(p => p.name === playerName)) {
      game.players.push({ name: playerName, score: 0 });
    }
  }
  return game;
}

function createPrivateGame(hostName, mode = 'junior') {
  return createGame(hostName, mode, false);
}

function joinGameByCode(roomCode, playerName) {
  const game = Object.values(games).find(g => g.roomCode === roomCode);
  if (!game) return null;
  if (!game.players.find(p => p.name === playerName)) {
    game.players.push({ name: playerName, score: 0 });
  }
  return game;
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
