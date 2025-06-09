import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Logger, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService): Promise<Redis> => {
        const client = new Redis({
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        });

        client.on('connect', () => Logger.log('✅ Connected to Redis'));
        client.on('error', (err) =>
          Logger.error('❌ Redis connection error:', err)
        );

        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
