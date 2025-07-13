import { Prisma, Subscription } from '@prisma/client';

export interface SubscriptionRepositoryInterface {
  find(where: Prisma.SubscriptionWhereInput): Promise<Subscription[]>;
  create(data: Prisma.SubscriptionCreateInput): Promise<Subscription>;
  deleteByToken(token: string): Promise<void>;
}
