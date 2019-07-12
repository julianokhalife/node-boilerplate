require('dotenv/config');

const express = require('express'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  ExpressRateLimit = require('express-rate-limit'),
  responseTime = require('response-time'),
  helmet = require('helmet'),
  uuid = require('uuid'),
  logger = require('./lib/logger'),
  database = require('./lib/database'),
  config = require('./configs/config'),
  errorMiddleware = require('./middleware/error.middleware');


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
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`The script uses approximately ${used} MB`);
      logger.info(`[${requestImprints}], ${response.statusCode} ${response.statusMessage}; ${response.get('Content-Length') || 0}b sent`)
    });
    next();
  }
}

module.exports = App;
