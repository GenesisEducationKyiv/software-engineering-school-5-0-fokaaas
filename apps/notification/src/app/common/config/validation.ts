import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(4559),
  WEATHER_HOST: Joi.string().required(),
  WEATHER_PORT: Joi.number().required(),
  SUBSCRIPTION_HOST: Joi.string().required(),
  SUBSCRIPTION_PORT: Joi.number().required(),
});
