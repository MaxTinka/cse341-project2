const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const auth = require('./routes/auth');

dotenv.config();

const app = express();

// Trust proxy (needed for Render HTTPS)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug: Log environment variables status
console.log('=== Environment Variables Status ===');
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('===================================');

// Auth routes (includes /auth/google, /auth/status, /auth/logout)
console.log('Mounting auth router...');
app.use(auth.router);
console.log('Auth router mounted successfully');

// Simple test route (directly in server.js)
app.get('/simple-test', (req, res) => {
    res.json({ message: 'Simple test route works!', timestamp: new Date().toISOString() });
});

// Another test route
app.get('/ping', (req, res) => {
    res.json({ message: 'pong', server: 'running' });
});

// Regular Routes
const contactsRoutes = require('./routes/contacts');
const usersRoutes = require('./routes/users');

app.use('/contacts', contactsRoutes);
app.use('/users', usersRoutes);

// Swagger
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

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running',
        endpoints: {
            simple_test: '/simple-test',
            ping: '/ping',
            auth_status: '/auth/status',
            auth_google: '/auth/google',
            auth_logout: '/auth/logout',
            contacts: '/contacts',
            users: '/users',
            swagger: '/api-docs'
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`\n? Server running on port ${PORT}`);
            console.log(`? Simple test: http://localhost:${PORT}/simple-test`);
            console.log(`? Auth status: http://localhost:${PORT}/auth/status`);
            console.log(`? Google login: http://localhost:${PORT}/auth/google`);
            console.log(`? Contacts: http://localhost:${PORT}/contacts`);
            console.log(`? Swagger: http://localhost:${PORT}/api-docs\n`);
        });
    })
    .catch(err => console.error('MongoDB error:', err));