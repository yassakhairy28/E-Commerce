/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related endpoints
 */

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *       403:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/{userId}:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: number
 *               mobileNumber:
 *                 type: string
 *               adress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/{userId}/profilePic:
 *   patch:
 *     summary: Upload profile picture
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: formData
 *         name: profilePic
 *         type: file
 *         required: true
 *         description: Profile image file
 *     responses:
 *       200:
 *         description: Picture uploaded
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/{userId}/profilePic:
 *   delete:
 *     summary: Delete profile picture
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile picture deleted
 *       400:
 *         description: No profile picture to delete
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/updatePassword:
 *   patch:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - password
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
