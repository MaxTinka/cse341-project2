const express = require('express');
const auth = require('./auth');
const router = express.Router();
const User = require('../models/User');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Authentication Required)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - firstName
 *               - lastName
 *             properties:
 *               username:
 *                 type: string
 *                 example: maxtinka
 *               email:
 *                 type: string
 *                 example: maxtinka7@gmail.com
 *               firstName:
 *                 type: string
 *                 example: Max
 *               lastName:
 *                 type: string
 *                 example: Tinka
 *               age:
 *                 type: number
 *                 example: 28
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields or duplicate username/email
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.post('/', auth.ensureAuthenticated, async (req, res) => {
  try {
    const { username, email, firstName, lastName, age, isActive } = req.body;
    
    if (!username || !email || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'All fields are required: username, email, firstName, lastName' 
      });
    }
    
    const newUser = new User({
      username,
      email,
      firstName,
      lastName,
      age: age || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    const savedUser = await newUser.save();
    res.status(201).json({ 
      message: 'User created successfully',
      id: savedUser._id,
      user: savedUser
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID (Authentication Required)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth.ensureAuthenticated, async (req, res) => {
  try {
    const { username, email, firstName, lastName, age, isActive } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, firstName, lastName, age, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID (Authentication Required)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth.ensureAuthenticated, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;