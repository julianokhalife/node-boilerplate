const appPrefix = process.env.APP_PREFIX;

module.exports = {
  app: {
    environment: process.env[`${appPrefix}APPLICATION_ENV`] || '',
    logpath: process.env[`${appPrefix}LOG_PATH`] || '',
    name: process.env[`${appPrefix}APP_NAME`] || 'node-boilerplate',
    port: parseInt(process.env[`${appPrefix}APP_PORT`], 10) || 8000
  },
  application_logging: {
    console: process.env[`${appPrefix}LOG_ENABLE_CONSOLE`] !== 'false',
    file: process.env[`${appPrefix}LOG_PATH`],
    level: process.env[`${appPrefix}LOG_LEVEL`] || 'info'
  },
  rate_limit: {
    windowMs: parseInt(process.env[`${appPrefix}RATE_LIMIT_WINDOW_MS`], 10) || 900000,
    max: parseInt(process.env[`${appPrefix}RATE_LIMIT_MAX`], 10) || 100,
    message: 'Too many requests sent from this IP, please try again later'
  },
  mongo: {
    host: process.env[`${appPrefix}DB_HOST`],
    name: process.env[`${appPrefix}DB_DATABASE`],
    password: process.env[`${appPrefix}DB_PASSWORD`],
    port: parseInt(process.env[`${appPrefix}DB_PORT`], 10),
    user: process.env[`${appPrefix}DB_USER`]
  }
};
