import Joi from 'joi';

const whenTestForbidden = <T extends Joi.Schema>(schema: T) =>
  schema.when('NODE_ENV', {
    is: 'test',
    then: Joi.forbidden(),
    otherwise: schema.required(),
  });

const whenTestRequired = <T extends Joi.Schema>(schema: T) =>
  schema.when('NODE_ENV', {
    is: 'test',
    then: schema.required(),
    otherwise: schema.forbidden(),
  });

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
  PORT: Joi.number().default(4558),
  WEATHER_HOST: whenTestForbidden(Joi.string()),
  WEATHER_PORT: whenTestForbidden(Joi.number()),
  EMAIL_HOST: whenTestForbidden(Joi.string()),
  EMAIL_PORT: whenTestForbidden(Joi.number()),
  SUBSCRIPTION_HOST: Joi.string().required(),
  SUBSCRIPTION_PORT: Joi.number().required(),
  REDIS_HOST: whenTestRequired(Joi.string()),
  REDIS_PORT: whenTestRequired(Joi.number()),
});
