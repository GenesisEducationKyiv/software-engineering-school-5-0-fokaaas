import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import type { ExceptionResponse } from '@types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      let { message } = exception.getResponse() as ExceptionResponse;
      if (Array.isArray(message)) {
        message = message[0];
      }
      response.status(status).send({ message });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Internal server error',
      });
      Logger.error(exception.stack);
    }
  }
}
