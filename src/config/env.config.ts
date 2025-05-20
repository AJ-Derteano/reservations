import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// Variables de entorno
export default registerAs('config', () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_SSL: process.env.DB_SSL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    EMAIL_API_HOST: process.env.EMAIL_API_HOST,
    EMAIL_API_PORT: process.env.EMAIL_API_PORT,
    EMAIL_API_PATH: process.env.EMAIL_API_PATH,
    EMAIL_API_KEY: process.env.EMAIL_API_KEY,
  };
});

// Validacion del esquema de las variables de entorno
export const configJoiSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'qa').default('dev'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  SALT_ROUNDS: Joi.number().default(8),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SSL: Joi.boolean().required().default(false),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  EMAIL_API_HOST: Joi.string().required(),
  EMAIL_API_PORT: Joi.number().required(),
  EMAIL_API_PATH: Joi.string().required(),
  EMAIL_API_KEY: Joi.string().required(),
});
