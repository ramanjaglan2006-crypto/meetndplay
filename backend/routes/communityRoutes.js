const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const communityPostController = require('../controllers/communityPostController');
const communityMessageController = require('../controllers/communityMessageController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

// Public/Optional auth routes
router.get('/', optionalAuth, communityController.getCommunities);
router.get('/:slug', optionalAuth, communityController.getCommunityBySlug);

// Protected routes
router.use(requireAuth);

router.post('/', communityController.createCommunity);
router.post('/:id/join', communityController.joinCommunity);
router.delete('/:id/leave', communityController.leaveCommunity);
router.get('/:id/members', communityController.getCommunityMembers);

// Posts
router.get('/:communityId/posts', communityPostController.getPosts);
// Chat / Messaging routes
router.get('/:id/messages', communityMessageController.getCommunityMessages);
router.post('/:id/messages', communityMessageController.sendCommunityMessage);
router.delete('/:id/messages/:messageId', communityMessageController.deleteCommunityMessage);

router.post('/:id/posts', communityPostController.createPost);
router.post('/posts/:postId/like', communityPostController.likePost);
router.get('/posts/:postId/comments', communityPostController.getComments);
router.post('/posts/:postId/comments', communityPostController.addComment);

module.exports = router;
