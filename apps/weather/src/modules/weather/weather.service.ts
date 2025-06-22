import { Injectable } from '@nestjs/common';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetWeatherRequest,
  GetWeatherResponse,
  IWeatherService,
} from '@types';

export interface IWeatherProvider {
  setNext(next: IWeatherProvider): IWeatherProvider;
  cityExists(city: string): Promise<boolean>;
  get(city: string): Promise<GetWeatherResponse>;
}

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(private provider: IWeatherProvider) {}

  get({ city }: GetWeatherRequest): Promise<GetWeatherResponse> {
    return this.provider.get(city);
  }

  async cityExists({ city }: CityExistsRequest): Promise<CityExistsResponse> {
    const exists = await this.provider.cityExists(city);
    return { exists };
  }
}
