import * as Joi from 'joi';
import { validateLogLevel } from '@shared/common/utils/validate-log-level';

const whenTestForbidden = <T extends Joi.Schema>(schema: T) =>
  schema.when('NODE_ENV', {
    is: 'test',
    then: Joi.forbidden(),
    otherwise: schema.required(),
  });

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(4557),
  FRONT_BASE_URL: Joi.string().uri().required(),
  SMTP_HOST: whenTestForbidden(Joi.string()),
  SMTP_USERNAME: whenTestForbidden(Joi.string()),
  SMTP_PASSWORD: whenTestForbidden(Joi.string()),
  RMQ_HOST: Joi.string().required(),
  RMQ_PORT: Joi.number().default(5672),
  OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string().uri(),
  LOG_LEVEL: Joi.string()
    .default('ERROR,WARN,INFO')
    .custom(validateLogLevel, 'Comma-separated log levels'),
});
