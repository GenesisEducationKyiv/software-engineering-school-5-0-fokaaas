import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClientService } from '../../http-client/http-client.service';
import { HttpClientLoggerDecorator } from '../../http-client/decorators/http-client-logger.decorator';
import { ProviderDomains } from '../constants/provider-domains.const';
import {
  VisualCrossingConfig,
  VisualCrossingProvider,
} from '../providers/visual-crossing.provider';
import { HttpClientDiTokens } from '../../http-client/constants/di-tokens.const';
import { WeatherDiTokens } from '../constants/di-tokens.const';
import type { VisualCrossingMapperInterface } from '../interfaces/visual-crossing-mapper.interface';
import { WeatherProviderInterface } from '../interfaces/weather-provider.interface';

@Injectable()
export class VisualCrossingProviderFactory {
  constructor(
    private readonly configService: ConfigService,

    @Inject(HttpClientDiTokens.HTTP_CLIENT_SERVICE)
    private readonly httpClientService: HttpClientService,

    @Inject(WeatherDiTokens.WEATHER_MAPPER)
    private readonly mapper: VisualCrossingMapperInterface
  ) {}

  create(): WeatherProviderInterface {
    const apiConfig =
      this.configService.getOrThrow<VisualCrossingConfig>('visualCrossing');
    const logPath = `${this.configService.get<string>(
      'logPath'
    )}/weather-provider.log`;

    return new VisualCrossingProvider(
      apiConfig,
      new HttpClientLoggerDecorator(
        this.httpClientService,
        ProviderDomains.VISUAL_CROSSING,
        logPath
      ),
      this.mapper
    );
  }
}
