require('dotenv/config');
require('./utils/validateEnv');
const App = require('./app');
const logger = require('./lib/logger');
const database = require('./lib/database');
const HealthMonitor = require('./lib/health');
const SwaggerController = require('./swagger/swagger.controller');
const HealthController = require('./health/health.controller');
const PostController = require('./posts/post.controller');

const app = new App([
  new SwaggerController(),
  new HealthController(new HealthMonitor()),
  new PostController()
],);

app.listen();

function registerProcessEvents(application, db) {
  process.on('uncaughtException', (error) => {
    logger.error('UncaughtException: ', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.info(reason, promise);
  });

  process.on('SIGINT', async () => {
    logger.info('Shutting down the application');
    await db.closeConnection();
    process.exit(1);
  });
}

registerProcessEvents(app, database);
