import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class GrpcAlreadyExistsException extends RpcException {
  constructor(entity: string) {
    super({ code: status.ALREADY_EXISTS, message: `${entity} already exists` });
  }
}
