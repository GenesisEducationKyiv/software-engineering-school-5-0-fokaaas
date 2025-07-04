import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../../database/prisma/prisma.service';
import { RedisModule } from '@utils';
import { SubscriptionDiTokens } from './constants/di-tokens';
import { SubscriptionMapper } from './subscription.mapper';

@Module({
  imports: [RedisModule.register('subscription')],
  providers: [
    {
      provide: SubscriptionDiTokens.SUBSCRIPTION_SERVICE,
      useClass: SubscriptionService,
    },
    {
      provide: SubscriptionDiTokens.SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionRepository,
    },
    {
      provide: SubscriptionDiTokens.SUBSCRIPTION_MAPPER,
      useClass: SubscriptionMapper,
    },
    PrismaService,
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
