/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: API for following and unfollowing users
 */

/**
 * @swagger
 * /api/follow/{userId}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/follow/{userId}/unfollow:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/follow/{userId}/followers:
 *   get:
 *     summary: Get followers of a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get followers for
 *     responses:
 *       200:
 *         description: List of followers
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/follow/{userId}/following:
 *   get:
 *     summary: Get users followed by a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get following for
 *     responses:
 *       200:
 *         description: List of users being followed
 *       401:
 *         description: Unauthorized
 */
