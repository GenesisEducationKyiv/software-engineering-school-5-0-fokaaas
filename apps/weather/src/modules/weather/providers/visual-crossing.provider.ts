import { Injectable } from '@nestjs/common';
import { RpcNotFoundException } from '../../../common/exceptions/rpc-not-found.exception';
import { ProviderErrorMessages } from '../constants/provider-error-messages.const';
import { RpcUnavailableException } from '../../../common/exceptions/rpc-unavailable-exception';
import { WeatherApiConfig } from './weather-api.provider';
import { WeatherProviderInterface } from '../interfaces/weather-provider.interface';
import type {
  VisualCrossingMapperInterface,
  VisualCrossingResponse,
} from '../interfaces/visual-crossing-mapper.interface';
import { WeatherData } from '../data/weather.data';
import { HttpClientServiceInterface } from '../../http-client/interfaces/http-client-service.interface';

export type VisualCrossingConfig = WeatherApiConfig & {
  iconUrl: string;
};

@Injectable()
export class VisualCrossingProvider implements WeatherProviderInterface {
  private baseParams: string;
  private readonly apiIconUrl: string;
  private readonly apiUrl: string;

  constructor(
    config: VisualCrossingConfig,
    private readonly httpClient: HttpClientServiceInterface,
    private readonly mapper: VisualCrossingMapperInterface
  ) {
    this.apiUrl = config.url;
    this.apiIconUrl = config.iconUrl;
    this.initializeBaseParams(config.key);
  }

  private initializeBaseParams(apiKey: string): void {
    this.baseParams = new URLSearchParams({
      unitGroup: 'metric',
      elements: 'datetime,temp,humidity,conditions,icon',
      include: 'days,current',
      key: apiKey,
      contentType: 'json',
    }).toString();
  }

  async cityExists(city: string): Promise<boolean> {
    const response = await this.fetchWeatherData(city);
    if (response.ok) return true;

    const message = (await response.text()) as string;
    if (this.isCityNotFound(message)) {
      return false;
    }
    throw new RpcUnavailableException();
  }

  async get(city: string): Promise<WeatherData> {
    const response = await this.fetchWeatherData(city);
    if (response.ok) {
      const data = (await response.json()) as VisualCrossingResponse;

      return this.mapper.mapVisualCrossingResponseToWeatherData(
        data,
        this.apiIconUrl
      );
    }

    const message = (await response.text()) as string;

    if (this.isCityNotFound(message)) {
      throw new RpcNotFoundException('City');
    }

    throw new RpcUnavailableException();
  }

  private fetchWeatherData(city: string): Promise<Response> {
    const url = `${this.apiUrl}/${city}/next6days?${this.baseParams}`;
    return this.httpClient.get(url);
  }

  private isCityNotFound(message: string): boolean {
    return message === ProviderErrorMessages.VISUAL_CROSSING_INVALID_LOCATION;
  }
}
