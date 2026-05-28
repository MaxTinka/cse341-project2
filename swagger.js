const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Project 2 CRUD API',
        description: 'Contacts and Users API with full CRUD operations',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
    './routes/contacts.js',
    './routes/users.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);