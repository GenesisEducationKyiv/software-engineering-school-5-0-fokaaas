import { Inject, Injectable } from '@nestjs/common';
import type { IWeatherProvider } from '../weather.service';
import { WeatherService } from '../weather.service';
import { RedisService } from '@utils';
import { WeatherCacheProxy } from '../proxies/weather-cache.proxy';
import { IWeatherService } from '../weather.controller';
import { WeatherDiTokens } from '../constants/di-tokens.const';
import { MetricsDiTokens } from '../../metrics/constants/di-tokens.const';

export interface IMetricsService {
  incCacheHit(method: string): void;
  incCacheMiss(method: string): void;
  createResponseTimer(method: string): { [Symbol.dispose]: () => void };
}

@Injectable()
export class WeatherServiceFactory {
  constructor(
    @Inject(WeatherDiTokens.WEATHER_API_PROVIDER)
    private readonly weatherApiProvider: IWeatherProvider,

    @Inject(WeatherDiTokens.VISUAL_CROSSING_PROVIDER)
    private readonly visualCrossingProvider: IWeatherProvider,

    private readonly redisService: RedisService,

    @Inject(MetricsDiTokens.METRICS_SERVICE)
    private readonly metricsService: IMetricsService
  ) {}

  create(): IWeatherService {
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
