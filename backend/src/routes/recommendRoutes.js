// ============================================================
//  src/routes/recommendRoutes.js
// ============================================================
const express    = require('express');
const { recommend } = require('../controllers/recommendController');

const router = express.Router();

// POST /api/recommend
router.post('/recommend', recommend);

module.exports = router;
