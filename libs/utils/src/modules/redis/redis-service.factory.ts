import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

type RedisConfig = {
  host: string;
  port: number;
  ttl: number;
};

@Injectable()
export class RedisServiceFactory {
  constructor(private readonly configService: ConfigService) {}

  create(prefix: string): RedisService {
    const { ttl, ...clientConfig } =
      this.configService.getOrThrow<RedisConfig>('redis');

    const client = new Redis(clientConfig);
    client.on('connect', () => Logger.log('✅ Connected to Redis'));
    client.on('error', (err) =>
      Logger.error('❌ Redis connection error:', err)
    );

    return new RedisService(client, ttl, prefix);
  }
}
