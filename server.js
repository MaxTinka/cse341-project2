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

// ============ AUTH ROUTES ============
app.get('/auth/status', (req, res) => {
    res.json({ isAuthenticated: false, user: null });
});

app.get('/auth/test', (req, res) => {
    res.json({ message: 'Auth works!' });
});

app.get('/protected', (req, res) => {
    res.status(401).json({ message: 'You must be logged in' });
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
            description: 'Contacts and Users API',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
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
            console.log(`\n? Server: http://localhost:${PORT}`);
            console.log(`? Auth: http://localhost:${PORT}/auth/status`);
            console.log(`? Contacts: http://localhost:${PORT}/contacts`);
            console.log(`? Users: http://localhost:${PORT}/users`);
            console.log(`? Swagger: http://localhost:${PORT}/api-docs\n`);
        });
    })
    .catch(err => console.error('MongoDB error:', err));