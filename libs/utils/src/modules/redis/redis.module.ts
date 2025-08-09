import { DynamicModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisServiceFactory } from './redis-service.factory';

@Module({})
export class RedisModule {
  static register(prefix: string): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        RedisServiceFactory,
        {
          provide: RedisService,
          useFactory: (factory: RedisServiceFactory) => factory.create(prefix),
          inject: [RedisServiceFactory],
        },
      ],
      exports: [RedisService],
    };
  }
}
