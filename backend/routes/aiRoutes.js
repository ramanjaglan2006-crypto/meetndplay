const express = require('express');
const { getSynergy, balanceSquad, getRecommendedInvites } = require('../controllers/aiController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/synergy/:targetUserId', requireAuth, getSynergy);
router.post('/squad-balance', requireAuth, balanceSquad);
router.get('/recommended-invites/:matchId', requireAuth, getRecommendedInvites);

module.exports = router;
