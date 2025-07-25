/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping Cart APIs
 */

/**
 * @swagger
 * /cart/addToCart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add
 *               quantity:
 *                 type: number
 *                 description: Quantity to add
 *     responses:
 *       201:
 *         description: Product added to new cart
 *       200:
 *         description: Product added to existing cart or quantity updated
 *       404:
 *         description: Product not found or out of stock
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart/deleteFromCart/{productId}:
 *   delete:
 *     summary: Delete a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       404:
 *         description: Cart not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart data retrieved successfully
 *       404:
 *         description: Cart not found
 *       401:
 *         description: Unauthorized
 */
