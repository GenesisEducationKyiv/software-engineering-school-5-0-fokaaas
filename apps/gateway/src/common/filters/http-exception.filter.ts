import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import type { ExceptionResponse } from '@types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let { message } = exception.getResponse() as ExceptionResponse;
    if (Array.isArray(message)) {
      message = message[0];
    }
    response.status(status).send({ message });
  }
}
