const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ SIMPLE AUTH ROUTES ============
app.get('/auth/status', (req, res) => {
    res.json({ isAuthenticated: false, user: null });
});

app.get('/auth/google', (req, res) => {
    res.json({ message: 'Google login endpoint', redirect: 'https://accounts.google.com/o/oauth2/v2/auth' });
});

app.get('/auth/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

app.get('/protected', (req, res) => {
    res.status(401).json({ message: 'You must be logged in to access this route' });
});
// ============ END AUTH ROUTES ============

// ============ REGULAR ROUTES ============
const contactsRoutes = require('./routes/contacts');
const usersRoutes = require('./routes/users');

app.use('/contacts', contactsRoutes);
app.use('/users', usersRoutes);
// ============ END REGULAR ROUTES ============

// ============ SWAGGER ============
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Project 2 CRUD API',
            description: 'Contacts and Users API with full CRUD operations',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'https://cse341-project2-raso.onrender.com',
                description: 'Production server (Render)',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// ============ END SWAGGER ============

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
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