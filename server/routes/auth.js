const express = require('express');
const router = express.Router();

// Placeholder auth routes
router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Auth routes not implemented yet' });
});

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'Auth routes not implemented yet' });
});

module.exports = router;