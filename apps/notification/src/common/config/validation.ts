import Joi from 'joi';
import { validateLogLevel } from '@shared/common/utils/validate-log-level';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(4559),
  WEATHER_HOST: Joi.string().required(),
  WEATHER_PORT: Joi.number().required(),
  SUBSCRIPTION_HOST: Joi.string().required(),
  SUBSCRIPTION_PORT: Joi.number().required(),
  RMQ_HOST: Joi.string().required(),
  RMQ_PORT: Joi.number().default(5672),
  OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string().uri(),
  LOG_LEVEL: Joi.string()
    .default('ERROR,WARN,INFO')
    .custom(validateLogLevel, 'Comma-separated log levels'),
});
