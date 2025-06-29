import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherServiceFactory } from './weather-service.factory';
import { HttpClientModule } from '../http-client/http-client.module';

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
  imports: [HttpClientModule],
})
export class WeatherModule {}
