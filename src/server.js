require('dotenv/config');
require('./utils/validateEnv');
const App = require('./app'),
  logger = require('./lib/logger'),
  database = require('./lib/database'),
  HealthMonitor = require('./lib/health'),
  HealthController = require('./health/health.controller');

const app = new App(
  [
    new HealthController(new HealthMonitor()),
  ]
);

app.listen();

registerProcessEvents(logger, app, database);

function registerProcessEvents(logger, app, db, health) {
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
