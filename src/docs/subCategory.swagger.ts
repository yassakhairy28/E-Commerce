/**
 * @swagger
 * tags:
 *   name: SubCategory
 *   description: SubCategory management
 */

/**
 * @swagger
 * /subCategory/create:
 *   post:
 *     summary: Create a new sub-category
 *     tags: [SubCategory]
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
 *               - categoryId
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Sub-category created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subCategory/update/{subCategoryId}:
 *   patch:
 *     summary: Update a sub-category
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: subCategoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Sub-category updated successfully
 *       400:
 *         description: No data to update or invalid input
 *       404:
 *         description: Sub-category not found
 */

/**
 * @swagger
 * /subCategory:
 *   get:
 *     summary: Get sub-categories or a specific sub-category by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: query
 *         name: subCategoryId
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *     responses:
 *       200:
 *         description: Sub-categories fetched successfully
 *       404:
 *         description: Sub-category not found
 */
