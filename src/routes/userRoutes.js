import express from 'express';
import UserController from '../controllers/userController.js';
import followController from '../controllers/followController.js';
import VoteController from '../controllers/voteController.js';
import reportController from '../controllers/reportController.js';
import NotificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout',  UserController.logout);
router.put('/:id', authMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);
router.get('/', authMiddleware, UserController.getAllUsers);
router.get('/profile', authMiddleware, UserController.getCurrentUserProfile);
router.get('/profile/:id', authMiddleware, UserController.getUserProfileById);
router.post('/report', authMiddleware, reportController.reportUser);
router.post('/follow', authMiddleware, followController.followUser);
router.delete('/unfollow', authMiddleware, followController.unfollowUser);
router.get('/follower', authMiddleware, followController.getFollowers);
router.get('/following', authMiddleware, followController.getFollowing);
router.post('/vote', authMiddleware, VoteController.vote);
router.get('/:id/vote', VoteController.getTailorRating);
router.get('/notifications', authMiddleware, NotificationController.getNotifications);
router.patch('/notifications/:id', authMiddleware, NotificationController.markAsRead);
router.post('/notifications', authMiddleware, NotificationController.sendNotification);
router.get('/search', authMiddleware, UserController.searchUsers);


// router.get('/:id', authMiddleware, UserController.getUser);

export default router;