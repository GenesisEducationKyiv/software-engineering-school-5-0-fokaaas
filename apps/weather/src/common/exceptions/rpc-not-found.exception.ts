import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class RpcNotFoundException extends RpcException {
  constructor(entity: string) {
    super({ code: status.NOT_FOUND, message: `${entity} not found` });
  }
}
