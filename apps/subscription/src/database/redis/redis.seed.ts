import Redis from 'ioredis';
import { Frequency } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { CreateRequest } from '@types';

const redis = new Redis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

export async function main() {
  const subscriptions: Record<string, CreateRequest> = {
    'some-token': {
      frequency: Frequency.DAILY,
      city: 'Poltava',
      email: 'example3@mail.com',
    },
    'de86e58a-3dee-45dc-8c98-3df0a8eb45b2': {
      frequency: Frequency.HOURLY,
      city: 'Lviv',
      email: 'example4@mail.com',
    },
  };

  for (const [token, data] of Object.entries(subscriptions)) {
    await redis.set(token, JSON.stringify(data));
  }
}

export default async function () {
  await main()
    .catch((e) => {
      Logger.error(e);
      process.exit(1);
    })
    .finally(() => redis.quit());
}
