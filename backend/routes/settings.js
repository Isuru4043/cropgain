const express = require('express');
const router = express.Router();

// Handler function for GET /api/settings/theme
router.get('/theme', (req, res) => {
  // Example: send a fixed theme (replace with your logic)
  res.json({ theme: 'light' });
});

// Handler function for PUT /api/settings/theme
router.put('/theme', (req, res) => {
  // Example: just echo back the theme (replace with your logic)
  const { theme } = req.body;
  res.json({ theme });
});

module.exports = router;
