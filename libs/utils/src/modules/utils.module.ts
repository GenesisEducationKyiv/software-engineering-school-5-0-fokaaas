import { Module } from '@nestjs/common';
import { GrpcExceptionFilter } from '../common/filters/grpc-exception.filter';

@Module({
  providers: [
    {
      provide: 'GRPC_EXCEPTION_FILTER',
      useClass: GrpcExceptionFilter,
    },
  ],
  exports: ['GRPC_EXCEPTION_FILTER'],
})
export class UtilsModule {}
