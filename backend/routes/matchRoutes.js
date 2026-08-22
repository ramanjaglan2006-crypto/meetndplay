const express = require('express');
const { createMatch, getMatches, getMyMatches, getNearbyMatches, getMatchRoom, joinMatch, leaveMatch, updatePosition, removeParticipant } = require('../controllers/matchController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, createMatch);
router.get('/', requireAuth, getMatches);
router.get('/my', requireAuth, getMyMatches);
router.get('/nearby', requireAuth, getNearbyMatches);
router.get('/:id/room', requireAuth, getMatchRoom);
router.post('/:id/join', requireAuth, joinMatch);
router.post('/:id/leave', requireAuth, leaveMatch);
router.patch('/:id/position', requireAuth, updatePosition);
router.delete('/:id/players/:userId', requireAuth, removeParticipant);

module.exports = router;
