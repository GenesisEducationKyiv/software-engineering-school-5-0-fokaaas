import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
  PORT: Joi.number().default(4556),
  LOG_PATH: Joi.string().default('logs'),
  WEATHER_API_KEY: Joi.string().required(),
  WEATHER_API_URL: Joi.string().uri().required(),
  VISUAL_CROSSING_KEY: Joi.string().required(),
  VISUAL_CROSSING_URL: Joi.string().uri().required(),
  VISUAL_CROSSING_ICON_URL: Joi.string().uri().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_TTL: Joi.number().required(),
  GATEWAY_URL: Joi.string().uri().required(),
});
