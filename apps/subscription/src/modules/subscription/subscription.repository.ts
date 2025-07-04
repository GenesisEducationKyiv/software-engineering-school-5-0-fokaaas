import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma, Subscription } from '@prisma/client';
import { ISubscriptionRepository } from './subscription.service';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  find(where: Prisma.SubscriptionWhereInput): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({ where });
  }

  create(data: Prisma.SubscriptionCreateInput): Promise<Subscription> {
    return this.prisma.subscription.create({ data });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.subscription.delete({
      where: { token },
    });
  }
}
