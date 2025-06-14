import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: Redis,
    private readonly config: ConfigService
  ) {}

  async setObj<T>(key: string, value: T): Promise<void> {
    const json = JSON.stringify(value);
    const ttl = this.config.get<number>('redis.ttl') ?? 0;
    await this.client.set(key, json, 'EX', ttl);
  }

  async getObj<T>(key: string): Promise<T> {
    const json = (await this.client.get(key)) ?? '';
    return JSON.parse(json);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
}
