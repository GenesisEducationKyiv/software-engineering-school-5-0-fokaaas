import { Module } from '@nestjs/common';
import { RedisModule } from '../../database/redis/redis.module';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../../database/prisma/prisma.service';

@Module({
  imports: [RedisModule],
  providers: [SubscriptionService, SubscriptionRepository, PrismaService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
