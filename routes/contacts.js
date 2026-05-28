const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: List of all contacts
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
 *     summary: Create a new contact
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - email
 *             - favoriteColor
 *             - birthday
 *           properties:
 *             firstName:
 *               type: string
 *               example: Max
 *             lastName:
 *               type: string
 *               example: Tinka
 *             email:
 *               type: string
 *               example: maxtinka7@gmail.com
 *             favoriteColor:
 *               type: string
 *               example: red
 *             birthday:
 *               type: string
 *               format: date
 *               example: 1996-09-16
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
      });
    }
    
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });
    
    const savedContact = await newContact.save();
    res.status(201).json({ 
      message: 'Contact created successfully',
      id: savedContact._id,
      contact: savedContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             favoriteColor:
 *               type: string
 *             birthday:
 *               type: string
 *               format: date
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, favoriteColor, birthday },
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
 *     summary: Delete a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', async (req, res) => {
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