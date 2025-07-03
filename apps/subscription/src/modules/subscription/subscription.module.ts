import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../../database/prisma/prisma.service';
import { RedisModule } from '@utils';

@Module({
  imports: [RedisModule.register('subscription')],
  providers: [SubscriptionService, SubscriptionRepository, PrismaService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
