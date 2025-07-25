/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management and operations
 */

/**
 * @swagger
 * /product/createProduct:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - subCategoryId
 *               - brandId
 *               - name
 *               - description
 *               - stock
 *               - price
 *               - image
 *             properties:
 *               subCategoryId:
 *                 type: string
 *               brandId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               stock:
 *                 type: number
 *               price:
 *                 type: number
 *               discount:
 *                 type: number
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *               size:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               gallary:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Related brand or subcategory not found
 */

/**
 * @swagger
 * /product/updateProduct/{productId}:
 *   patch:
 *     summary: Update a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               subCategoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               stock:
 *                 type: number
 *               price:
 *                 type: number
 *               discount:
 *                 type: number
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *               size:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               gallary:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input or discount exceeds price
 *       404:
 *         description: Product or related category not found
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get products with optional filters
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: subCategoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of products or single product by ID
 *       404:
 *         description: Product not found
 */
