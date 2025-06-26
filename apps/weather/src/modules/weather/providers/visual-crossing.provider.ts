import { Injectable } from '@nestjs/common';
import { WeatherProvider } from './weather.provider';
import type { GetWeatherResponse } from '@types';
import { RpcNotFoundException } from '../../../common/exceptions/rpc-not-found.exception';
import { ProviderErrorMessages } from '../constants/provider-error-messages.const';
import { LogApiResponse } from '../decorators/log-api-response.decorator';
import { ProviderDomains } from '../constants/provider-domains.const';

type Conditions = {
  datetime: string;
  temp: number;
  humidity: number;
  conditions: string;
  icon: string;
};

type VisualCrossingResponse = {
  days: Conditions[];
  currentConditions: Conditions;
};

@Injectable()
export class VisualCrossingProvider extends WeatherProvider {
  private baseParams: string;

  constructor(
    private readonly apiUrl: string,
    apiKey: string,
    private readonly apiIconUrl: string
  ) {
    super();
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

  override async cityExists(city: string): Promise<boolean> {
    let response: Response;
    try {
      response = await this.fetchWeatherData(city);
    } catch {
      return super.cityExists(city);
    }
    if (response.ok) return true;
    const message = (await response.text()) as string;
    if (this.isCityNotFound(message)) {
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
      const { days, currentConditions } =
        (await response.json()) as VisualCrossingResponse;
      return {
        current: {
          date: currentConditions.datetime,
          temperature: currentConditions.temp.toFixed(1),
          humidity: currentConditions.humidity.toString(),
          icon: this.getIconUrl(currentConditions.icon),
          description: currentConditions.conditions,
        },
        forecast: days.map((day) => ({
          date: day.datetime,
          temperature: day.temp.toFixed(1),
          humidity: day.humidity.toString(),
          icon: this.getIconUrl(day.icon),
          description: day.conditions,
        })),
      };
    }

    const message = (await response.text()) as string;

    if (this.isCityNotFound(message)) {
      throw new RpcNotFoundException('City');
    }

    return super.get(city);
  }

  @LogApiResponse(ProviderDomains.VISUAL_CROSSING)
  private fetchWeatherData(city: string): Promise<Response> {
    const url = `${this.apiUrl}/${city}/next6days?${this.baseParams}`;
    return fetch(url);
  }

  private isCityNotFound(message: string): boolean {
    return message === ProviderErrorMessages.VISUAL_CROSSING_INVALID_LOCATION;
  }

  private getIconUrl(icon: string): string {
    return `${this.apiIconUrl}/${icon}.png`;
  }
}
