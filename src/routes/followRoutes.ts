import express from 'express';

import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from '../controllers/followController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:userId/follow', protect, followUser);
router.delete('/:userId/unfollow', protect, unfollowUser);
router.get('/:userId/followers', protect, getFollowers);
router.get('/:userId/following', protect, getFollowing);

export default router;
