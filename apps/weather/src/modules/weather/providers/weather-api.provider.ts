import { WeatherProvider } from './weather.provider';
import { Injectable } from '@nestjs/common';
import type { GetWeatherResponse } from '@types';
import { ProviderErrorMessages } from '../constants/provider-error-messages.const';
import { RpcNotFoundException } from '../../../common/exceptions/rpc-not-found.exception';
import { LogApiResponse } from '../decorators/log-api-response.decorator';
import { ProviderDomains } from '../constants/provider-domains.const';

type Condition = {
  icon: string;
  text: string;
};

type WeatherApiResponse = {
  current: {
    last_updated: string;
    temp_c: number;
    humidity: number;
    condition: Condition;
  };
  forecast: {
    forecastday: {
      date: string;
      day: {
        avgtemp_c: number;
        avghumidity: number;
        condition: Condition;
      };
    }[];
  };
};

type WeatherApiErrorResponse = {
  error: {
    code: number;
    message: string;
  };
};

@Injectable()
export class WeatherApiProvider extends WeatherProvider {
  constructor(apiUrl: string, apiKey: string) {
    super();
    this.baseUrl = `${apiUrl}/forecast.json?key=${apiKey}&days=7`;
  }

  override async cityExists(city: string): Promise<boolean> {
    let response: Response;
    try {
      response = await this.fetchWeatherData(city);
    } catch {
      return super.cityExists(city);
    }
    if (response.ok) return true;
    const errorData = (await response.json()) as WeatherApiErrorResponse;
    if (this.isCityNotFound(errorData)) {
      return false;
    }
    return super.cityExists(city);
  }

  override async get(city: string): Promise<GetWeatherResponse> {
    let response: Response;
    try {
      response = await this.fetchWeatherData(city);
    } catch {
      return super.get(city);
    }
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

    return super.get(city);
  }

  @LogApiResponse(ProviderDomains.WEATHER_API)
  private fetchWeatherData(city: string): Promise<Response> {
    return fetch(`${this.baseUrl}&q=${city}`);
  }

  private isCityNotFound(error: WeatherApiErrorResponse): boolean {
    return (
      error.error.message ===
      ProviderErrorMessages.WEATHER_API_NO_MATCHING_LOCATION
    );
  }
}
