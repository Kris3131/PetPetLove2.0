/**
 * @swagger
 * tags:
 *   name: Block
 *   description: API for blocking and unblocking users
 */

/**
 * @swagger
 * /api/block/{userId}/block:
 *   post:
 *     summary: Block a user
 *     tags: [Block]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to block
 *     responses:
 *       200:
 *         description: User blocked successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/block/{userId}/unblock:
 *   delete:
 *     summary: Unblock a user
 *     tags: [Block]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unblock
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/block/blocked:
 *   get:
 *     summary: Get all blocked users
 *     tags: [Block]
 *     responses:
 *       200:
 *         description: List of blocked users
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/block/{userId}/isBlocked:
 *   get:
 *     summary: Check if a user is blocked
 *     tags: [Block]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to check
 *     responses:
 *       200:
 *         description: User block status
 *       401:
 *         description: Unauthorized
 */
