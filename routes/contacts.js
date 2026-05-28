const express = require('express');
const auth = require('./auth');
const router = express.Router();
const Contact = require('../models/Contact');

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of all contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a single contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact found
 *       404:
 *         description: Contact not found
 */
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact (Authentication Required)
 *     tags: [Contacts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Max
 *               lastName:
 *                 type: string
 *                 example: Tinka
 *               email:
 *                 type: string
 *                 example: maxtinka7@gmail.com
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 example: New York
 *               favoriteColor:
 *                 type: string
 *                 example: red
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: 1996-09-16
 *               notes:
 *                 type: string
 *                 example: Friend from college
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Authentication required
 */
router.post('/', auth.ensureAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, favoriteColor, birthday, notes } = req.body;
    
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
      });
    }
    
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      favoriteColor,
      birthday,
      notes
    });
    
    const savedContact = await newContact.save();
    res.status(201).json({ 
      message: 'Contact created successfully',
      id: savedContact._id,
      contact: savedContact
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact by ID (Authentication Required)
 *     tags: [Contacts]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Contact not found
 */
router.put('/:id', auth.ensureAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, favoriteColor, birthday, notes } = req.body;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone, address, city, favoriteColor, birthday, notes },
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(200).json({ 
      message: 'Contact updated successfully',
      contact: updatedContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID (Authentication Required)
 *     tags: [Contacts]
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
 *         description: Contact deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', auth.ensureAuthenticated, async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;