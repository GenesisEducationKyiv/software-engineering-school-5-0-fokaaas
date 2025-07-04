import { Injectable } from '@nestjs/common';
import { ProviderErrorMessages } from '../constants/provider-error-messages.const';
import { RpcNotFoundException } from '../../../common/exceptions/rpc-not-found.exception';
import { RpcUnavailableException } from '../../../common/exceptions/rpc-unavailable-exception';
import { IWeatherProvider } from '../weather.service';
import type { IHttpClientService } from '../../http-client/http-client.service';
import { WeatherDto } from '../dto/weather.dto';

type Condition = {
  icon: string;
  text: string;
};

type ForecastDay = {
  date: string;
  day: {
    avgtemp_c: number;
    avghumidity: number;
    condition: Condition;
  };
};

export type WeatherApiResponse = {
  current: {
    last_updated: string;
    temp_c: number;
    humidity: number;
    condition: Condition;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
};

type WeatherApiErrorResponse = {
  error: {
    code: number;
    message: string;
  };
};

export interface WeatherApiMapper {
  mapWeatherApiResponseToWeatherDto(response: WeatherApiResponse): WeatherDto;
}

@Injectable()
export class WeatherApiProvider implements IWeatherProvider {
  private baseUrl: string;

  constructor(
    apiUrl: string,
    apiKey: string,
    private readonly httpClient: IHttpClientService,
    private readonly mapper: WeatherApiMapper
  ) {
    this.initializeBaseUrl(apiUrl, apiKey);
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

  async get(city: string): Promise<WeatherDto> {
    const response = await this.fetchWeatherData(city);

    if (response.ok) {
      const data = (await response.json()) as WeatherApiResponse;
      return this.mapper.mapWeatherApiResponseToWeatherDto(data);
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
