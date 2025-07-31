import { Catch, Logger, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { Errors } from '../constants/errors.const';
import type { Counter, Meter } from '@opentelemetry/api';

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name);
  private readonly errorCounter: Counter;

  constructor(meter: Meter) {
    this.errorCounter = meter.createCounter('internal_error_total', {
      description: 'Total number of internal errors',
    });
  }

  catch(exception: Error) {
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    this.logger.error({ msg: 'Internal Grpc Error', error: exception });

    this.errorCounter.add(1, { method: 'catch' });

    return throwError(() =>
      new RpcException({
        code: status.INTERNAL,
        message: Errors.INTERNAL_SERVER_ERROR,
      }).getError()
    );
  }
}
