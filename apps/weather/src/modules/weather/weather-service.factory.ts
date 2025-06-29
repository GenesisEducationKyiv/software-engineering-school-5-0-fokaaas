import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherApiProvider } from './providers/weather-api.provider';
import { VisualCrossingProvider } from './providers/visual-crossing.provider';
import { WeatherService } from './weather.service';
import { HttpClientService } from '../http-client/http-client.service';
import { HttpClientLoggerDecorator } from '../http-client/decorators/http-client-logger.decorator';
import { ProviderDomains } from './constants/provider-domains.const';
import { RedisService } from '@utils';
import { WeatherCacheProxy } from './weather-cache.proxy';
import { IWeatherService } from '@types';
import { MetricsService } from '../metrics/metrics.service';

export type WeatherApiConfig = {
  url: string;
  key: string;
};

export type VisualCrossingConfig = WeatherApiConfig & {
  iconUrl: string;
};

@Injectable()
export class WeatherServiceFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpClientService: HttpClientService,
    private readonly redisService: RedisService,
    private readonly metricsService: MetricsService
  ) {}

  create(): IWeatherService {
    const weatherApiConfig =
      this.configService.getOrThrow<WeatherApiConfig>('weatherApi');
    const visualCrossingConfig =
      this.configService.getOrThrow<VisualCrossingConfig>('visualCrossing');
    const logPath = `${this.configService.get<string>(
      'logPath'
    )}/weather-provider.log`;

    const weatherApiProvider = new WeatherApiProvider(
      weatherApiConfig.url,
      weatherApiConfig.key,
      new HttpClientLoggerDecorator(
        this.httpClientService,
        ProviderDomains.WEATHER_API,
        logPath
      )
    );

    const visualCrossingProvider = new VisualCrossingProvider(
      visualCrossingConfig.url,
      visualCrossingConfig.key,
      visualCrossingConfig.iconUrl,
      new HttpClientLoggerDecorator(
        this.httpClientService,
        ProviderDomains.VISUAL_CROSSING,
        logPath
      )
    );

    const weatherService = new WeatherService([
      weatherApiProvider,
      visualCrossingProvider,
    ]);

    return new WeatherCacheProxy(
      weatherService,
      this.redisService,
      this.metricsService
    );
  }
}
