import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionController } from './subscroption.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [RedisModule],
  providers: [SubscriptionService, SubscriptionRepository, PrismaService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
