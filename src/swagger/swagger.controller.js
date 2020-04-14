const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('../configs/config');

const swaggerDefinition = {
  info: {
    title: 'REST API for my App', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'This is the REST API for my product' // short description of the app
  },
  host: `localhost${config.app.port}` // the host or url of the app
};

const options = {
  swaggerDefinition,
  // path to the API docs
  apis: ['src/**/*.yaml']
};
const swaggerSpec = swaggerJSDoc(options);

class Controller {
  constructor() {
    this.path = '/api-docs';
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(this.path, swaggerUi.serve);
    this.router.get(this.path, swaggerUi.setup(swaggerSpec));
  }
}

module.exports = Controller;
