/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management and checkout
 */

/**
 * @swagger
 * /order/createOrder:
 *   post:
 *     summary: Create new order from cart
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - phone
 *               - paymentMethod
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               note:
 *                 type: string
 *               couponCode:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card]
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or invalid data
 */

/**
 * @swagger
 * /order/checkOut/{orderId}:
 *   get:
 *     summary: Get checkout session for an order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Stripe checkout session created
 *       404:
 *         description: Order not found or not eligible
 */

/**
 * @swagger
 * /order/{orderId}/cancel:
 *   patch:
 *     summary: Cancel a pending or placed order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to cancel
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       404:
 *         description: Order not found or not cancelable
 */
