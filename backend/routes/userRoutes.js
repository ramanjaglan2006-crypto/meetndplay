const express = require('express');
const { getProfile, getUserProfile, updateProfile, getDiscoverUsers } = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.patch('/profile', requireAuth, updateProfile); // Support both PUT and PATCH
router.get('/discover', requireAuth, getDiscoverUsers);
router.get('/:id/profile', requireAuth, getUserProfile);

module.exports = router;
