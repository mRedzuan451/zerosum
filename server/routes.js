const express = require('express');
const router = express.Router();

const { createGame, joinGame, getGame } = require('./gameState');

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
