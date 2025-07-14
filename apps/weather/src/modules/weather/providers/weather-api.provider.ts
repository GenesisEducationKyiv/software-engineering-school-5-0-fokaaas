import { Injectable } from '@nestjs/common';
import { ProviderErrorMessages } from '../constants/provider-error-messages.const';
import { RpcNotFoundException } from '../../../common/exceptions/rpc-not-found.exception';
import { RpcUnavailableException } from '../../../common/exceptions/rpc-unavailable-exception';
import { WeatherProviderInterface } from '../interfaces/weather-provider.interface';
import type {
  WeatherApiMapperInterface,
  WeatherApiResponse,
} from '../interfaces/weather-api-mapper.interface';
import { WeatherData } from '../data/weather.data';
import { HttpClientServiceInterface } from '../../http-client/interfaces/http-client-service.interface';

type WeatherApiErrorResponse = {
  error: {
    code: number;
    message: string;
  };
};

export type WeatherApiConfig = {
  url: string;
  key: string;
};

@Injectable()
export class WeatherApiProvider implements WeatherProviderInterface {
  private baseUrl: string;

  constructor(
    { url, key }: WeatherApiConfig,
    private readonly httpClient: HttpClientServiceInterface,
    private readonly mapper: WeatherApiMapperInterface
  ) {
    this.initializeBaseUrl(url, key);
  }

  private initializeBaseUrl(apiUrl: string, apiKey: string): void {
    const params = new URLSearchParams({
      key: apiKey,
      days: '7',
    });
    this.baseUrl = `${apiUrl}/forecast.json?${params.toString()}`;
  }

  async cityExists(city: string): Promise<boolean> {
    const response = await this.fetchWeatherData(city);
    if (response.ok) return true;

    const errorData = (await response.json()) as WeatherApiErrorResponse;
    if (this.isCityNotFound(errorData)) {
      return false;
    }
    throw new RpcUnavailableException();
  }

  async get(city: string): Promise<WeatherData> {
    const response = await this.fetchWeatherData(city);

    if (response.ok) {
      const data = (await response.json()) as WeatherApiResponse;
      return this.mapper.mapWeatherApiResponseToWeatherData(data);
    }

    const errorData = (await response.json()) as WeatherApiErrorResponse;

    if (this.isCityNotFound(errorData)) {
      throw new RpcNotFoundException('City');
    }

    throw new RpcUnavailableException();
  }

  private fetchWeatherData(city: string): Promise<Response> {
    const params = new URLSearchParams({ q: city });
    return this.httpClient.get(`${this.baseUrl}&${params.toString()}`);
  }

  private isCityNotFound(error: WeatherApiErrorResponse): boolean {
    return (
      error.error.message ===
      ProviderErrorMessages.WEATHER_API_NO_MATCHING_LOCATION
    );
  }
}
