import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherServiceFactory } from './factories/weather-service.factory';
import { HttpClientModule } from '../http-client/http-client.module';
import { RedisModule } from '@utils';
import { MetricsModule } from '../metrics/metrics.module';
import { WeatherDiTokens } from './constants/di-tokens.const';
import { WeatherApiProviderFactory } from './factories/weather-api-provider.factory';
import { VisualCrossingProviderFactory } from './factories/vissual-crossing-provider.factory';
import { WeatherMapper } from './weather.mapper';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherServiceFactory,
    WeatherApiProviderFactory,
    VisualCrossingProviderFactory,
    {
      provide: WeatherDiTokens.WEATHER_SERVICE,
      useFactory: (factory: WeatherServiceFactory) => factory.create(),
      inject: [WeatherServiceFactory],
    },
    {
      provide: WeatherDiTokens.WEATHER_API_PROVIDER,
      useFactory: (factory: WeatherApiProviderFactory) => factory.create(),
      inject: [WeatherApiProviderFactory],
    },
    {
      provide: WeatherDiTokens.VISUAL_CROSSING_PROVIDER,
      useFactory: (factory: VisualCrossingProviderFactory) => factory.create(),
      inject: [VisualCrossingProviderFactory],
    },
    {
      provide: WeatherDiTokens.WEATHER_MAPPER,
      useClass: WeatherMapper,
    },
  ],
  imports: [HttpClientModule, RedisModule.register('weather'), MetricsModule],
})
export class WeatherModule {}
