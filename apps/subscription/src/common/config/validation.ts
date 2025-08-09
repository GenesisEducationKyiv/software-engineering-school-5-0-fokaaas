import Joi from 'joi';
import { validateLogLevel } from '@shared/common/utils/validate-log-level';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(4555),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_TTL: Joi.number().required(),
  OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string().uri(),
  LOG_LEVEL: Joi.string()
    .default('ERROR,WARN,INFO')
    .custom(validateLogLevel, 'Comma-separated log levels'),
});
