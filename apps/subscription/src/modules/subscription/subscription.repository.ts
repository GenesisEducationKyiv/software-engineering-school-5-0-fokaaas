import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma, Subscription } from '@prisma/client';
import { SubscriptionRepositoryInterface } from './interfaces/subscription-repository.interface';

@Injectable()
export class SubscriptionRepository implements SubscriptionRepositoryInterface {
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
