const express = require('express');
const router = express.Router();

const { createGame, joinGame, getGame, startGame, joinQuickPlay, createPrivateGame, joinGameByCode } = require('./gameState');
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
