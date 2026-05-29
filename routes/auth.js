const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth router is working!' });
});

// Status route
router.get('/status', (req, res) => {
    res.json({ isAuthenticated: false, user: null });
});

// Google route (placeholder)
router.get('/google', (req, res) => {
    res.json({ message: 'Google login endpoint', redirect: 'https://accounts.google.com/o/oauth2/v2/auth' });
});

// Logout route
router.get('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

function ensureAuthenticated(req, res, next) {
    res.status(401).json({ message: 'You must be logged in to access this route' });
}

module.exports = { router, ensureAuthenticated };