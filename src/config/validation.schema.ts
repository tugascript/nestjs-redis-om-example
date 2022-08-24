import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),
  REDIS_URL: Joi.string().required(),
  ACCESS_SECRET: Joi.string().required(),
  ACCESS_TIME: Joi.number().required(),
});
