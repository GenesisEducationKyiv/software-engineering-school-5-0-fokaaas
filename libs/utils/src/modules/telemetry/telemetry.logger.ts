import { LoggerService } from '@nestjs/common';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

export class TelemetryLogger implements LoggerService {
  private logger = logs.getLogger('default');

  log(message: string) {
    this.logger.emit({
      body: message,
      severityText: 'INFO',
      severityNumber: SeverityNumber.INFO,
    });
  }

  error(message: string, trace?: string) {
    this.logger.emit({
      body: `${message} ${trace || ''}`,
      severityText: 'ERROR',
      severityNumber: SeverityNumber.ERROR,
    });
  }

  warn(message: string) {
    this.logger.emit({
      body: message,
      severityText: 'WARN',
      severityNumber: SeverityNumber.WARN,
    });
  }

  debug(message: string) {
    this.logger.emit({
      body: message,
      severityText: 'DEBUG',
      severityNumber: SeverityNumber.DEBUG,
    });
  }

  verbose(message: string) {
    this.logger.emit({
      body: message,
      severityText: 'VERBOSE',
      severityNumber: SeverityNumber.TRACE,
    });
  }
}
