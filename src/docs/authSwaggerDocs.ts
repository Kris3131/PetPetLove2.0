/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: PetPetLove API
 *   version: 1.0.0
 *   description: API documentation for PetPetLove
 * tags:
 *   name: Auth
 *   description: 認證相關 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 註冊新用戶
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 註冊成功
 *       400:
 *         description: 請求錯誤
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 用戶登入
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登入成功
 *       400:
 *         description: 請求錯誤
 */
