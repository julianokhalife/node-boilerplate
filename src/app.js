require('dotenv/config');

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const ExpressRateLimit = require('express-rate-limit');
const responseTime = require('response-time');
const helmet = require('helmet');
const uuid = require('uuid');
const logger = require('./lib/logger');
const database = require('./lib/database');
const config = require('./configs/config');
const errorMiddleware = require('./middleware/error.middleware');

class App {
  constructor(controllers) {
    this.app = express();

    database.connectToTheDatabase();
    this.initializeMiddleWares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  listen() {
    this.app.listen(config.app.port, () => {
      logger.info(`App listening on the port ${config.app.port}`);
    });
  }

  securityMiddleWares() {
    this.app.use(helmet());
    const rateLimitOptions = {
      windowMs: config.rate_limit.windowMs, // In milliseconds
      max: config.rate_limit.max, // limit each IP to X amount of requests per windowMs,
      message: config.rate_limit.message
    };
    const limiter = new ExpressRateLimit(rateLimitOptions);
    this.app.use(limiter);
  }

  initializeMiddleWares() {
    this.securityMiddleWares();
    this.app.use(compression());
    this.app.use(App.loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(responseTime());
  }

  initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  static loggerMiddleware(request, response, next) {
    request.requestId = `#${uuid.v1().substr(0, 8)}`;

    const imprintParts = [request.requestId];
    // TODO add user-agent or client info
    const requestImprints = imprintParts.filter(x => !!x).join(', ');

    logger.info(`${requestImprints}], ${request.method} ${request.path}`);

    response.on('finish', () => {
      logger.info(`[${requestImprints}], ${response.statusCode} ${response.statusMessage}; ${response.get('Content-Length') || 0}b sent`);
    });
    next();
  }
}

module.exports = App;
