import { LoggerService } from '@nestjs/common';
import { AnyValue, logs, SeverityNumber } from '@opentelemetry/api-logs';
import { LogLevel } from './enums/log-level.enum';

const severityMap: Record<LogLevel, SeverityNumber> = {
  [LogLevel.ERROR]: SeverityNumber.ERROR,
  [LogLevel.WARN]: SeverityNumber.WARN,
  [LogLevel.INFO]: SeverityNumber.INFO,
  [LogLevel.DEBUG]: SeverityNumber.DEBUG,
  [LogLevel.VERBOSE]: SeverityNumber.TRACE,
};

export class TelemetryLogger implements LoggerService {
  private readonly logger = logs.getLogger('default');
  private readonly enabledLevels: LogLevel[];

  constructor(logLevelEnv: string) {
    this.enabledLevels = logLevelEnv.split(',') as LogLevel[];
  }

  private emit(level: LogLevel, body: AnyValue, context?: string) {
    if (!this.enabledLevels.includes(level)) return;

    const severityNumber = severityMap[level];

    this.logger.emit({
      body,
      severityText: level,
      severityNumber,
      attributes: { context },
    });
  }

  log(body: AnyValue, context?: string) {
    this.emit(LogLevel.INFO, body, context);
  }

  error(body: AnyValue, context?: string) {
    this.emit(LogLevel.ERROR, body, context);
  }

  warn(body: AnyValue, context?: string) {
    this.emit(LogLevel.WARN, body, context);
  }

  debug(body: AnyValue, context?: string) {
    this.emit(LogLevel.DEBUG, body, context);
  }

  verbose(body: AnyValue, context?: string) {
    this.emit(LogLevel.VERBOSE, body, context);
  }
}
