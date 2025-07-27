import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { retry } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  constructor(private readonly count: number) {}
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(retry(this.count));
  }
}
