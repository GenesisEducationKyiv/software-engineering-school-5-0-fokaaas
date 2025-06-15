import { Frequency, PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();

export async function main(): Promise<void> {
  await prisma.subscription.createMany({
    data: [
      {
        email: 'example@mail.com',
        token: 'token',
        city: 'Kyiv',
        frequency: Frequency.DAILY,
      },
      {
        email: 'example1@mail.com',
        token: 'token1',
        city: 'Lviv',
        frequency: Frequency.DAILY,
      },
    ],
  });
}

export default async function () {
  await main()
    .catch((e) => {
      Logger.error(e);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
