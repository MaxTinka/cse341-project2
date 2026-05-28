const express = require('express');
const router = express.Router();

// Simple status route
router.get('/status', (req, res) => {
    res.json({ 
        isAuthenticated: false,
        user: null,
        message: 'Auth route is working!'
    });
});

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth router is mounted correctly!' });
});

// Logout route
router.get('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

// Middleware for protected routes
function ensureAuthenticated(req, res, next) {
    res.status(401).json({ message: 'You must be logged in to access this route' });
}

module.exports = { router, ensureAuthenticated };