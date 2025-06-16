import Redis from 'ioredis';
import { Frequency } from '@prisma/client';
import * as process from 'node:process';
import { Logger } from '@nestjs/common';

const redis = new Redis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

export async function main() {
  await redis.set(
    'some-token',
    JSON.stringify({
      frequency: Frequency.DAILY,
      city: 'Poltava',
      email: 'example3@mail.com',
    })
  );
}

export default async function () {
  await main()
    .catch((e) => {
      Logger.error(e);
      process.exit(1);
    })
    .finally(() => redis.quit());
}
