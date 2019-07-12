const joi = require('joi');

const appPrefix = process.env.APP_PREFIX || '';

const envSchema = joi.object({
  [`${appPrefix}APP_PORT`]: joi.number().integer().required().greater(999),
  [`${appPrefix}DB_DATABASE`]: joi.string().required(),
  [`${appPrefix}DB_HOST`]: joi.string().required(),
  [`${appPrefix}DB_PASSWORD`]: joi.string().required().allow(''),
  [`${appPrefix}DB_PORT`]: joi.number().integer().required().greater(999),
  [`${appPrefix}DB_USER`]: joi.string().required().allow('')
}).unknown(true);

const { error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Process env validation error: ${error.message}`);
}
