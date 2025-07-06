import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class RpcUnavailableException extends RpcException {
  constructor() {
    super({
      code: status.UNAVAILABLE,
      message: 'Service is temporary unavailable',
    });
  }
}
