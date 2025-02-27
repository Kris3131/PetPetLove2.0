import express from 'express';
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
  isBlocked,
} from '../controllers/blockController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:userId/block', protect, blockUser);
router.delete('/:userId/unblock', protect, unblockUser);
router.get('/blocked', protect, getBlockedUsers);
router.get('/:userId/isBlocked', protect, isBlocked);

export default router;
