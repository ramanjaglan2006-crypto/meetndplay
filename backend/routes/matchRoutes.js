const express = require('express');
const { createMatch, getMatches, getNearbyMatches, joinMatch, leaveMatch } = require('../controllers/matchController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, createMatch);
router.get('/', requireAuth, getMatches);
router.get('/nearby', requireAuth, getNearbyMatches);
router.post('/:id/join', requireAuth, joinMatch);
router.post('/:id/leave', requireAuth, leaveMatch);

module.exports = router;
