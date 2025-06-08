import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(where: Prisma.SubscriptionWhereInput): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({ where });
  }

  async create(data: Prisma.SubscriptionCreateInput): Promise<Subscription> {
    return this.prisma.subscription.create({ data });
  }

  async deleteByToken(token: string): Promise<Subscription> {
    return this.prisma.subscription.delete({
      where: { token },
    });
  }
}
