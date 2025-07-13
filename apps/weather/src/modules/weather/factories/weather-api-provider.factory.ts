import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import {
  WeatherApiConfig,
  WeatherApiProvider,
} from '../providers/weather-api.provider';
import { HttpClientLoggerDecorator } from '../../http-client/decorators/http-client-logger.decorator';
import { ProviderDomains } from '../constants/provider-domains.const';
import { HttpClientDiTokens } from '../../http-client/constants/di-tokens.const';
import { WeatherDiTokens } from '../constants/di-tokens.const';
import type { WeatherApiMapperInterface } from '../interfaces/weather-api-mapper.interface';
import { WeatherProviderInterface } from '../interfaces/weather-provider.interface';
import { HttpClientServiceInterface } from '../../http-client/interfaces/http-client-service.interface';

@Injectable()
export class WeatherApiProviderFactory {
  constructor(
    private readonly configService: ConfigService,

    @Inject(HttpClientDiTokens.HTTP_CLIENT_SERVICE)
    private readonly httpClientService: HttpClientServiceInterface,

    @Inject(WeatherDiTokens.WEATHER_MAPPER)
    private readonly mapper: WeatherApiMapperInterface
  ) {}

  create(): WeatherProviderInterface {
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
