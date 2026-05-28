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
            description: 'Contacts and Users API with full CRUD operations',
            version: '1.0.0',
            contact: {
                name: 'Max Tinka',
                email: 'maxtinka7@gmail.com',
            },
        },
        servers: [
            {
                url: 'https://cse341-project2-raso.onrender.com',
                description: 'Production server (Render)',
            },
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Contact: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        phone: { type: 'string', example: '1234567890' },
                        address: { type: 'string', example: '123 Main St' },
                        city: { type: 'string', example: 'New York' },
                        favoriteColor: { type: 'string', example: 'blue' },
                        birthday: { type: 'string', format: 'date', example: '1990-01-01' },
                        notes: { type: 'string', example: 'Friend from college' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', example: 'john@example.com' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        age: { type: 'number', example: 30 },
                        isActive: { type: 'boolean', example: true },
                    },
                },
            },
        },
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