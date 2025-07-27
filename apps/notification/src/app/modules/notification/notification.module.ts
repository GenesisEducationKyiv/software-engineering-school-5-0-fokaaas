import { Module } from '@nestjs/common';
import { WeatherModule } from '../weather/weather.module';
import { EmailModule } from '../email/email.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { NotificationService } from './notification.service';
import { NotificationDiTokens } from './constants/di-tokens.const';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WeatherModule,
    EmailModule,
    SubscriptionModule,
  ],
  providers: [
    {
      provide: NotificationDiTokens.NOTIFICATION_SERVICE,
      useClass: NotificationService,
    },
  ],
})
export class NotificationModule {}
