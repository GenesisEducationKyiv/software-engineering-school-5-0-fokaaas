import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherClientModule } from '../weather-client/weather-client.module';
import { SubscriptionClientModule } from '../subscription-client/subscription-client.module';
import { EmailClientModule } from '../email-client/email-client.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherDiTokens } from './constants/di-tokens.const';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WeatherClientModule,
    SubscriptionClientModule,
    EmailClientModule,
  ],
  controllers: [WeatherController],
  providers: [
    {
      provide: WeatherDiTokens.WEATHER_SERVICE,
      useClass: WeatherService,
    },
  ],
})
export class WeatherModule {}
