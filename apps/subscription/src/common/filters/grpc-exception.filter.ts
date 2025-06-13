import { Catch, Logger, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { Errors } from '../constants/errors.const';

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: Error) {
    if (exception instanceof RpcException) {
      return throwError(() => exception);
    }

    Logger.error(exception.message);

    return throwError(
      () =>
        new RpcException({
          code: status.INTERNAL,
          message: Errors.INTERNAL_SERVER_ERROR,
        })
    );
  }
}
