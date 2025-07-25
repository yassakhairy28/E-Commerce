/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review management
 */

/**
 * @swagger
 * /review:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *             properties:
 *               productId:
 *                 type: string
 *               text:
 *                 type: string
 *               rating:
 *                 type: number
 *                 enum: [1, 2, 3, 4, 5]
 *     responses:
 *       201:
 *         description: Review created successfully
 */

/**
 * @swagger
 * /review/{reviewId}:
 *   patch:
 *     summary: Update a review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               rating:
 *                 type: number
 *                 enum: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: Review updated successfully
 */

/**
 * @swagger
 * /review/user:
 *   get:
 *     summary: Get current user's reviews
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user's reviews
 */

/**
 * @swagger
 * /review/product:
 *   get:
 *     summary: Get reviews for a product
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *               page:
 *                 type: number
 *     responses:
 *       200:
 *         description: List of product reviews
 */

/**
 * @swagger
 * /review/{reviewId}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found
 */

/**
 * @swagger
 * /review/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
