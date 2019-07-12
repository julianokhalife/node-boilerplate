require('dotenv/config');
require('./utils/validateEnv');
const App = require('./app');
const logger = require('./lib/logger');
const database = require('./lib/database');
const HealthMonitor = require('./lib/health');
const HealthController = require('./health/health.controller');

const app = new App(
  [
    new HealthController(new HealthMonitor()),
  ],
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
