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
    players: [{ name: hostName, score: 0, ready: false }],
    state: 'waiting',
    created: Date.now(),
    roomCode,
    isQuickPlay,
  };
  return games[id];
}

function joinQuickPlay(playerName) {
  let game = Object.values(games).find(g => g.isQuickPlay && g.state === 'waiting' && g.players.length < 8);
  if (!game) {
    game = createGame(playerName, 'junior', true);
  } else {
    if (!game.players.find(p => p.name === playerName)) {
      game.players.push({ name: playerName, score: 0, ready: false });
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
    game.players.push({ name: playerName, score: 0, ready: false });
  }
  return game;
}

function joinGame(gameId, playerName) {
  const game = games[gameId];
  if (!game) return null;
  if (game.players.find(p => p.name === playerName)) return game;
  game.players.push({ name: playerName, score: 0, ready: false });
  return game;
}


function startGame(gameId) {
  const game = games[gameId];
  if (!game || game.state !== 'waiting') return null;
  // Only allow start if all players are ready
  if (!game.players.every(p => p.ready)) return null;
  game.state = 'started';
  game.started = Date.now();
  game.roundActions = {};

  // Deal cards to all players
  // Numbers: 1-7 (4 sets each), Operands: +, -, x (8 of each)
  const numberCards = [];
  for (let i = 1; i <= 7; i++) {
    for (let j = 0; j < 4; j++) {
      numberCards.push({ type: 'number', value: i });
    }
  }
  const operandList = ['+', '-', 'x'];
  const operandCards = [];
  for (let op of operandList) {
    for (let j = 0; j < 8; j++) {
      operandCards.push({ type: 'operand', value: op });
    }
  }
  const deck = [...numberCards, ...operandCards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  game.players.forEach((p, idx) => {
    p.hand = deck.slice(idx * 7, idx * 7 + 7); // Deal 7 cards each (numbers + operands)
  });
  game.deck = deck.slice(game.players.length * 7); // Remaining deck

  return game;
}

function setPlayerReady(gameId, playerName, ready) {
  const game = games[gameId];
  if (!game) return null;
  const player = game.players.find(p => p.name === playerName);
  if (!player) return null;
  player.ready = !!ready;
  return game;
}

function playerCommit(gameId, playerName, cards, equation) {
  const game = games[gameId];
  if (!game || game.state !== 'started') return null;
  game.roundActions = game.roundActions || {};
  game.roundActions[playerName] = { action: 'commit', cards, equation };
  return game;
}

function playerPass(gameId, playerName) {
  const game = games[gameId];
  if (!game || game.state !== 'started') return null;
  game.roundActions = game.roundActions || {};
  game.roundActions[playerName] = { action: 'pass' };
  return game;
}

function playerRecalculate(gameId, playerName, discardCards) {
  const game = games[gameId];
  if (!game || game.state !== 'started') return null;
  game.roundActions = game.roundActions || {};
  game.roundActions[playerName] = { action: 'recalculate', discardCards };
  return game;
}

function getGame(gameId) {
  return games[gameId] || null;

}

module.exports = {
  games,
  createGame,
  joinGame,
  getGame,
  startGame,
  createPrivateGame,
  joinGameByCode,
  setPlayerReady,
  playerCommit,
  playerPass,
  playerRecalculate
};
