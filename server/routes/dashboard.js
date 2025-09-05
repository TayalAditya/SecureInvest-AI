const express = require('express');
const router = express.Router();

// Placeholder dashboard routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Dashboard routes not implemented yet' });
});

module.exports = router;