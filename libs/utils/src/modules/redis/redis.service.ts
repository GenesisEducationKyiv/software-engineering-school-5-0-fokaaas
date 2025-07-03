import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    private readonly client: Redis,
    private readonly ttl: number,
    private readonly prefix: string
  ) {}

  private composeKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async setObj<T>(key: string, value: T): Promise<void> {
    const json = JSON.stringify(value);
    await this.client.set(this.composeKey(key), json, 'EX', this.ttl);
  }

  async getObj<T>(key: string): Promise<T | null> {
    const json = await this.client.get(this.composeKey(key));
    if (json === null) return null;
    return JSON.parse(json);
  }

  async setBool(key: string, value: boolean): Promise<void> {
    await this.client.set(
      this.composeKey(key),
      value.toString(),
      'EX',
      this.ttl
    );
  }

  async getBool(key: string): Promise<boolean | null> {
    const value = await this.client.get(this.composeKey(key));
    if (value === null) return null;
    return value.toLowerCase() === 'true';
  }

  async delete(key: string): Promise<void> {
    await this.client.del(this.composeKey(key));
  }

  async flush(): Promise<void> {
    await this.client.flushdb();
  }
}
