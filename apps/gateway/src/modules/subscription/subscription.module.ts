import { Module } from '@nestjs/common';
import { WeatherClientModule } from '../weather-client/weather-client.module';
import { SubscriptionClientModule } from '../subscription-client/subscription-client.module';
import { EmailClientModule } from '../email-client/email-client.module';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDiTokens } from './constants/di-tokens.const';

@Module({
  imports: [WeatherClientModule, SubscriptionClientModule, EmailClientModule],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: SubscriptionDiTokens.SUBSCRIPTION_SERVICE,
      useClass: SubscriptionService,
    },
  ],
})
export class SubscriptionModule {}
