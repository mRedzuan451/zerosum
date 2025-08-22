const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Placeholder: Get game state
router.get('/game', (req, res) => {
  res.json({ message: 'Game state endpoint' });
});

// Placeholder: Create new game
router.post('/game', (req, res) => {
  res.json({ message: 'Create game endpoint' });
});

// Placeholder: Join game
router.post('/game/join', (req, res) => {
  res.json({ message: 'Join game endpoint' });
});

module.exports = router;
