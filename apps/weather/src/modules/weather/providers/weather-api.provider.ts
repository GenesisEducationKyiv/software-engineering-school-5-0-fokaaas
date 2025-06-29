import { Injectable } from '@nestjs/common';
import type { GetWeatherResponse } from '@types';
import { ProviderErrorMessages } from '../constants/provider-error-messages.const';
import { RpcNotFoundException } from '../../../common/exceptions/rpc-not-found.exception';
import { LogApiResponse } from '../decorators/log-api-response.decorator';
import { ProviderDomains } from '../constants/provider-domains.const';
import { RpcUnavailableException } from '../../../common/exceptions/rpc-unavailable-exception';
import { IWeatherProvider } from '../weather.service';

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

type WeatherApiResponse = {
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

@Injectable()
export class WeatherApiProvider implements IWeatherProvider {
  private baseUrl: string;

  constructor(apiUrl: string, apiKey: string) {
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

  async get(city: string): Promise<GetWeatherResponse> {
    const response = await this.fetchWeatherData(city);

    if (response.ok) {
      const data = (await response.json()) as WeatherApiResponse;
      const { forecastday: forecastDays } = data.forecast;
      return {
        current: {
          date: data.current.last_updated,
          temperature: data.current.temp_c.toFixed(1),
          humidity: data.current.humidity.toString(),
          icon: data.current.condition.icon.slice(2),
          description: data.current.condition.text,
        },
        forecast: forecastDays.map((day) => ({
          date: day.date,
          temperature: day.day.avgtemp_c.toFixed(1),
          humidity: day.day.avghumidity.toString(),
          icon: day.day.condition.icon.slice(2),
          description: day.day.condition.text,
        })),
      };
    }

    const errorData = (await response.json()) as WeatherApiErrorResponse;

    if (this.isCityNotFound(errorData)) {
      throw new RpcNotFoundException('City');
    }

    throw new RpcUnavailableException();
  }

  @LogApiResponse(ProviderDomains.WEATHER_API)
  private fetchWeatherData(city: string): Promise<Response> {
    const params = new URLSearchParams({ q: city });
    return fetch(`${this.baseUrl}&${params.toString()}`);
  }

  private isCityNotFound(error: WeatherApiErrorResponse): boolean {
    return (
      error.error.message ===
      ProviderErrorMessages.WEATHER_API_NO_MATCHING_LOCATION
    );
  }
}
