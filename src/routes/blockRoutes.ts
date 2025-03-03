import { Router } from 'express';

import {
  blockUser,
  getBlockedUsers,
  isBlocked,
  unblockUser,
} from '../controllers/blockController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/:userId/block', protect, blockUser);
router.delete('/:userId/unblock', protect, unblockUser);
router.get('/blocked', protect, getBlockedUsers);
router.get('/:userId/isBlocked', protect, isBlocked);

export default router;
