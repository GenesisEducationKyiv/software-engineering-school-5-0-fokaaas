import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceError, status as GrpcStatus } from '@grpc/grpc-js';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (this.isGrpcServiceError(exception)) {
      const httpStatus = this.mapGrpcToHttp(exception.code);
      response.status(httpStatus).json({ message: exception.message });
    } else {
      throw exception;
    }
  }

  private isGrpcServiceError(error: unknown): error is ServiceError {
    return (
      typeof error === 'object' &&
      error !== null &&
      error instanceof Error &&
      typeof (error as Partial<ServiceError>).code === 'number'
    );
  }

  private readonly grpcToHttpMap: Record<number, number> = {
    [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  private mapGrpcToHttp(code: number): number {
    return this.grpcToHttpMap[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
