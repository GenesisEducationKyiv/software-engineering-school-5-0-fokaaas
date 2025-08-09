import { Inject, Injectable } from '@nestjs/common';
import { WeatherService } from '../weather.service';
import { RedisService } from '@shared/modules/redis/redis.service';
import { WeatherCacheProxy } from '../proxies/weather-cache.proxy';
import { WeatherDiTokens } from '../constants/di-tokens.const';
import { WeatherServiceInterface } from '../interfaces/weather-service.interface';
import type { WeatherProviderInterface } from '../interfaces/weather-provider.interface';
import { MetricsDiTokens } from '../../metrics/constants/di-tokens.const';
import type { MetricsServiceInterface } from '../../metrics/interfaces/metrics-service.interface';

@Injectable()
export class WeatherServiceFactory {
  constructor(
    @Inject(WeatherDiTokens.WEATHER_API_PROVIDER)
    private readonly weatherApiProvider: WeatherProviderInterface,

    @Inject(WeatherDiTokens.VISUAL_CROSSING_PROVIDER)
    private readonly visualCrossingProvider: WeatherProviderInterface,

    @Inject(MetricsDiTokens.METRICS_SERVICE)
    private readonly metricsService: MetricsServiceInterface,

    private readonly redisService: RedisService
  ) {}

  create(): WeatherServiceInterface {
    const weatherService = new WeatherService([
      this.weatherApiProvider,
      this.visualCrossingProvider,
    ]);

    return new WeatherCacheProxy(
      weatherService,
      this.redisService,
      this.metricsService
    );
  }
}
