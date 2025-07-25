/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints related to category management
 */

/**
 * @swagger
 * /category/createCategory:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created successfully
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /category/updateCategory/{categoryId}:
 *   patch:
 *     summary: Update a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: ID of the category to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Phones
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category already exists
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get categories or a specific category
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID of the category to retrieve
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Name to search by
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         required: false
 *         description: Fields to select
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *         description: Sorting order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *       404:
 *         description: Category not found
 */
