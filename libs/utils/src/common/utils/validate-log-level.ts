import { LogLevel } from '../../modules/telemetry/enums/log-level.enum';
import { CustomHelpers } from 'joi';
import Joi from 'joi';

const validLevels = Object.values(LogLevel);

export function validateLogLevel(
  value: string,
  helpers: CustomHelpers
): Joi.ErrorReport | string {
  const invalid = value
    .split(',')
    .filter((level) => !validLevels.includes(level as LogLevel));

  if (invalid.length > 0) {
    return helpers.error('any.invalid', {
      message: `Invalid log levels: ${invalid.join(', ')}`,
    });
  }

  return value;
}
