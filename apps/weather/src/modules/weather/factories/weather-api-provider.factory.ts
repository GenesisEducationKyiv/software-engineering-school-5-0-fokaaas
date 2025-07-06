import { ConfigService } from '@nestjs/config';
import type { IHttpClientService } from '../../http-client/http-client.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  WeatherApiConfig,
  WeatherApiProvider,
} from '../providers/weather-api.provider';
import type { WeatherApiMapper } from '../providers/weather-api.provider';
import { HttpClientLoggerDecorator } from '../../http-client/decorators/http-client-logger.decorator';
import { ProviderDomains } from '../constants/provider-domains.const';
import { IWeatherProvider } from '../weather.service';
import { HttpClientDiTokens } from '../../http-client/constants/di-tokens.const';
import { WeatherDiTokens } from '../constants/di-tokens.const';

@Injectable()
export class WeatherApiProviderFactory {
  constructor(
    private readonly configService: ConfigService,

    @Inject(HttpClientDiTokens.HTTP_CLIENT_SERVICE)
    private readonly httpClientService: IHttpClientService,

    @Inject(WeatherDiTokens.WEATHER_MAPPER)
    private readonly mapper: WeatherApiMapper
  ) {}

  create(): IWeatherProvider {
    const apiConfig =
      this.configService.getOrThrow<WeatherApiConfig>('weatherApi');
    const logPath = `${this.configService.get<string>(
      'logPath'
    )}/weather-provider.log`;

    return new WeatherApiProvider(
      apiConfig,
      new HttpClientLoggerDecorator(
        this.httpClientService,
        ProviderDomains.WEATHER_API,
        logPath
      ),
      this.mapper
    );
  }
}
