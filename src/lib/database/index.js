const mongoose = require('mongoose');
const logger = require('../logger');
const config = require('../../configs/config');

class MongoDB {
  static connectToTheDatabase() {
    try {
      const database = MongoDB.dataConnection(config.mongo.user, config.mongo.password, config.mongo.host,
        config.mongo.port, config.mongo.name);
      mongoose.connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      const { connection } = mongoose;
      connection.on('connected', () => {
        logger.info('Database Connection was Successful');
      });
      connection.on('error', (err) => {
        logger.error(`Database Connection Failed ${err}`);
        throw new Error(err);
      });
      connection.on('disconnected', () => logger.info('Database Connection Disconnected'));

      // initialize Models
      /* eslint-disable global-require */
      require('../../posts/post.model');
      /* eslint-enable global-require */

      return connection;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  static dataConnection(user, pass, host, port, name) {
    if (user && pass) {
      return `mongodb://${`${user}:${pass}@`}${host}:${port}/${name}?authSource=admin`;
    }
    return `mongodb://${host}:${port}/${name}`;
  }

  static async closeConnection() {
    if (mongoose.connection) {
      await mongoose.disconnect();
    }
  }
}

module.exports = MongoDB;
