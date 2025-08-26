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
    game.players.push({ name: playerName, score: 0, ready: false, hand: [] });
  }
  return game;
}

function joinGame(gameId, playerName) {
  const game = games[gameId];
  if (!game) return null;
  if (game.players.find(p => p.name === playerName)) return game;
  game.players.push({ name: playerName, score: 0, ready: false, hand: [] });
  return game;
}


function startGame(gameId) {
  console.log('startGame called for gameId:', gameId);
  const game = games[gameId];
  if (!game || game.state !== 'waiting') return null;
  // Only allow start if all players are ready
  if (!game.players.every(p => p.ready)) return null;
  game.state = 'started';
  game.started = Date.now();
  game.roundActions = {};

  // Deal cards to all players
  // Use 1 deck for up to 4 players, 2 decks for more than 4 players
  const deckCount = game.players.length > 4 ? 2 : 1;
  const numberCards = [];
  for (let d = 0; d < deckCount; d++) {
    for (let i = 1; i <= 7; i++) {
      for (let j = 0; j < 4; j++) {
        numberCards.push({ type: 'number', value: i });
      }
    }
  }
  const operandList = ['+', '-', 'x'];
  const operandCards = [];
  for (let d = 0; d < deckCount; d++) {
    for (let op of operandList) {
      for (let j = 0; j < 8; j++) {
        operandCards.push({ type: 'operand', value: op });
      }
    }
  }
  const deck = [...numberCards, ...operandCards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  game.players.forEach((p, idx) => {
    p.hand = deck.slice(idx * 7, idx * 7 + 7); // Deal 7 card objects each (numbers + operands)
  });
  game.deck = deck.slice(game.players.length * 7); // Remaining deck

  // Set target value and target cards for all players to see
  if (game.mode === 'junior') {
    // Draw 2 number cards and 1 operand card from deck
    let numbers = [];
    let operand = null;
    let tries = 0;
    let targetCards = [];
    while (numbers.length < 2 && tries < 100) {
      const card = game.deck.shift();
      if (card && card.type === 'number') {
        numbers.push(card.value);
        targetCards.push({ type: 'number', value: card.value });
      }
      else if (card && card.type === 'operand' && !operand) {
        operand = card.value;
        targetCards.push({ type: 'operand', value: card.value });
      }
      tries++;
    }
    // If not enough, fallback to random
    if (numbers.length < 2 || !operand) {
      numbers = [Math.floor(Math.random() * 7) + 1, Math.floor(Math.random() * 7) + 1];
      operand = ['+', '-', 'x'][Math.floor(Math.random() * 3)];
      targetCards = [
        { type: 'number', value: numbers[0] },
        { type: 'operand', value: operand },
        { type: 'number', value: numbers[1] }
      ];
    }
    let result = 0;
    if (operand === '+') result = numbers[0] + numbers[1];
    else if (operand === '-') result = Math.abs(numbers[0] - numbers[1]);
    else if (operand === 'x') result = numbers[0] * numbers[1];
    game.targetValue = result;
    game.targetEquation = `${numbers[0]} ${operand} ${numbers[1]}`;
    game.targetCards = targetCards;
  } else {
    // Pro mode: combine 2 number cards as string
    let nums = [];
    let tries = 0;
    let targetCards = [];
    while (nums.length < 2 && tries < 100) {
      const card = game.deck.shift();
      if (card && card.type === 'number') {
        nums.push(card.value);
        targetCards.push({ type: 'number', value: card.value });
      }
      tries++;
    }
    if (nums.length < 2) {
      nums = [Math.floor(Math.random() * 7) + 1, Math.floor(Math.random() * 7) + 1];
      targetCards = [
        { type: 'number', value: nums[0] },
        { type: 'number', value: nums[1] }
      ];
    }
    game.targetValue = Number(`${nums[0]}${nums[1]}`);
    game.targetEquation = `${nums[0]}${nums[1]}`;
    game.targetCards = targetCards;
  }

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
  const player = game.players.find(p => p.name === playerName);
  if (!player || !Array.isArray(player.hand)) return null;
  // Remove discarded cards from hand
  if (discardCards.length !== 2) return null; // Must discard exactly 2 cards
  const newHand = player.hand.filter((_, idx) => !discardCards.includes(idx));
  // Draw 1 new card from deck
  const drawn = game.deck.splice(0, 1);
  player.hand = [...newHand, ...drawn];
  game.roundActions = game.roundActions || {};
  game.roundActions[playerName] = { action: 'recalculate', discardCards, drawn };
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
