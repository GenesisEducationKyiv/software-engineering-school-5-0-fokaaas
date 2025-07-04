import { Injectable } from '@nestjs/common';
import { RpcNotFoundException } from '../../../common/exceptions/rpc-not-found.exception';
import { ProviderErrorMessages } from '../constants/provider-error-messages.const';
import { IWeatherProvider } from '../weather.service';
import { RpcUnavailableException } from '../../../common/exceptions/rpc-unavailable-exception';
import type { IHttpClientService } from '../../http-client/http-client.service';
import { WeatherDto } from '../dto/weather.dto';

type Conditions = {
  datetime: string;
  temp: number;
  humidity: number;
  conditions: string;
  icon: string;
};

export type VisualCrossingResponse = {
  days: Conditions[];
  currentConditions: Conditions;
};

export interface VisualCrossingMapper {
  mapVisualCrossingResponseToWeatherDto(
    response: VisualCrossingResponse,
    iconUrl: string
  ): WeatherDto;
}

@Injectable()
export class VisualCrossingProvider implements IWeatherProvider {
  private baseParams: string;

  constructor(
    private readonly apiUrl: string,
    apiKey: string,
    private readonly apiIconUrl: string,
    private readonly httpClient: IHttpClientService,
    private readonly mapper: VisualCrossingMapper
  ) {
    this.initializeBaseParams(apiKey);
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

  async get(city: string): Promise<WeatherDto> {
    const response = await this.fetchWeatherData(city);
    if (response.ok) {
      const data = (await response.json()) as VisualCrossingResponse;

      return this.mapper.mapVisualCrossingResponseToWeatherDto(
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
