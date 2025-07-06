import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherServiceFactory } from './weather-service.factory';
import { HttpClientModule } from '../http-client/http-client.module';
import { RedisModule } from '@utils';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherServiceFactory,
    {
      provide: WeatherService,
      useFactory: (factory: WeatherServiceFactory) => factory.create(),
      inject: [WeatherServiceFactory],
    },
  ],
  imports: [HttpClientModule, RedisModule.register('weather'), MetricsModule],
})
export class WeatherModule {}
