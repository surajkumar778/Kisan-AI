// ============================================================
//  src/routes/healthRoutes.js
// ============================================================
const express       = require('express');
const { health }    = require('../controllers/healthController');

const router = express.Router();

// GET /api/health
router.get('/health', health);

module.exports = router;
