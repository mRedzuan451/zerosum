const express = require('express');
const router = express.Router();

const { createGame, joinGame, getGame, startGame, joinQuickPlay, createPrivateGame, joinGameByCode, playerCommit, playerPass, playerRecalculate, setPlayerReady } = require('./gameState');
// Set player ready status
router.post('/game/ready', (req, res) => {
  const { gameId, playerName, ready } = req.body;
  if (!gameId || !playerName || typeof ready === 'undefined') return res.status(400).json({ error: 'Missing required fields' });
  const game = setPlayerReady(Number(gameId), playerName, ready);
  if (!game) return res.status(404).json({ error: 'Game or player not found' });
  res.json(game);
});
// Player Commit
router.post('/game/commit', (req, res) => {
  const { gameId, playerName, cards, equation } = req.body;
  if (!gameId || !playerName || !cards || !equation) return res.status(400).json({ error: 'Missing required fields' });
  const game = playerCommit(Number(gameId), playerName, cards, equation);
  if (!game) return res.status(404).json({ error: 'Game not found or not started' });
  res.json(game);
});

// Player Pass
router.post('/game/pass', (req, res) => {
  const { gameId, playerName } = req.body;
  if (!gameId || !playerName) return res.status(400).json({ error: 'Missing required fields' });
  const game = playerPass(Number(gameId), playerName);
  if (!game) return res.status(404).json({ error: 'Game not found or not started' });
  res.json(game);
});

// Player Recalculate
router.post('/game/recalculate', (req, res) => {
  const { gameId, playerName, discardCards } = req.body;
  if (!gameId || !playerName || !discardCards) return res.status(400).json({ error: 'Missing required fields' });
  const game = playerRecalculate(Number(gameId), playerName, discardCards);
  if (!game) return res.status(404).json({ error: 'Game not found or not started' });
  res.json(game);
});
// Quick Play matchmaking
router.post('/game/quickplay', (req, res) => {
  const { playerName } = req.body;
  if (!playerName) return res.status(400).json({ error: 'playerName required' });
  const game = joinQuickPlay(playerName);
  res.json(game);
});

// Create private game (room code)
router.post('/game/private', (req, res) => {
  const { hostName, mode } = req.body;
  if (!hostName) return res.status(400).json({ error: 'hostName required' });
  const game = createPrivateGame(hostName, mode);
  res.json(game);
});

// Join game by room code
router.post('/game/joincode', (req, res) => {
  const { roomCode, playerName } = req.body;
  if (!roomCode || !playerName) return res.status(400).json({ error: 'roomCode and playerName required' });
  const game = joinGameByCode(roomCode, playerName);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});
// Start game
router.post('/game/start', (req, res) => {
  const { gameId } = req.body;
  if (!gameId) return res.status(400).json({ error: 'gameId required' });
  const game = startGame(Number(gameId));
  if (!game) return res.status(404).json({ error: 'Game not found or already started' });
  res.json(game);
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get game state by ID
router.get('/game/:id', (req, res) => {
  const game = getGame(Number(req.params.id));
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});

// Create new game
router.post('/game', (req, res) => {
  const { hostName, mode } = req.body;
  if (!hostName) return res.status(400).json({ error: 'hostName required' });
  const game = createGame(hostName, mode);
  res.json(game);
});

// Join game
router.post('/game/join', (req, res) => {
  const { gameId, playerName } = req.body;
  if (!gameId || !playerName) return res.status(400).json({ error: 'gameId and playerName required' });
  const game = joinGame(Number(gameId), playerName);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});

module.exports = router;
