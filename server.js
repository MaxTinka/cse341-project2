const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ AUTH ROUTES ============
app.get('/auth/status', (req, res) => {
    res.json({ authenticated: false, user: null });
});

app.get('/auth/google', (req, res) => {
    res.json({ message: 'Google login would go here' });
});

app.get('/auth/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

app.get('/protected', (req, res) => {
    res.status(401).json({ message: 'You must be logged in' });
});
// ============ END AUTH ROUTES ============

// ============ CONTACTS ROUTES ============
const Contact = require('./models/Contact');

app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Not found' });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/contacts', async (req, res) => {
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ message: 'All fields required' });
        }
        const newContact = new Contact(req.body);
        const saved = await newContact.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/contacts/:id', async (req, res) => {
    try {
        const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/contacts/:id', async (req, res) => {
    try {
        const deleted = await Contact.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// ============ END CONTACTS ROUTES ============

// ============ USERS ROUTES ============
const User = require('./models/User');

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { username, email, firstName, lastName } = req.body;
        if (!username || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields required' });
        }
        const newUser = new User(req.body);
        const saved = await newUser.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// ============ END USERS ROUTES ============

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running',
        routes: ['/test', '/auth/status', '/auth/google', '/contacts', '/users']
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB error:', err));