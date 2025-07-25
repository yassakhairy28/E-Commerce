/**
 * @swagger
 * tags:
 *   name: Coupon
 *   description: Endpoints related to coupon management
 */

/**
 * @swagger
 * /coupon/create:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - discount
 *               - discountType
 *               - minOrderValue
 *             properties:
 *               name:
 *                 type: string
 *                 example: Summer Sale
 *               code:
 *                 type: string
 *                 example: SUMMER2025
 *               discount:
 *                 type: number
 *                 example: 15
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               productsIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               subCategoriesId:
 *                 type: array
 *                 items:
 *                   type: string
 *               brandsIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T00:00:00.000Z
 *               isActivate:
 *                 type: boolean
 *               maxUses:
 *                 type: number
 *               minOrderValue:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       409:
 *         description: Coupon already exists
 */

/**
 * @swagger
 * /coupon/{code}:
 *   get:
 *     summary: Validate and get a coupon by code
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon code to validate
 *     responses:
 *       200:
 *         description: Coupon data
 *       404:
 *         description: Coupon not found
 */

/**
 * @swagger
 * /coupon/update/{code}:
 *   patch:
 *     summary: Update an existing coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               discount:
 *                 type: number
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               productids:
 *                 type: array
 *                 items:
 *                   type: string
 *               subCategoriesId:
 *                 type: array
 *                 items:
 *                   type: string
 *               brandsIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxUses:
 *                 type: number
 *               minOrderValue:
 *                 type: number
 *     responses:
 *       200:
 *         description: Coupon updated
 *       404:
 *         description: Coupon not found
 */

/**
 * @swagger
 * /coupon/deActivate/{code}:
 *   patch:
 *     summary: Deactivate a coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon deactivated
 *       404:
 *         description: Coupon not found
 */

/**
 * @swagger
 * /coupon/reActivate/{code}:
 *   patch:
 *     summary: Reactivate a coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon reactivated
 *       404:
 *         description: Coupon not found
 */
