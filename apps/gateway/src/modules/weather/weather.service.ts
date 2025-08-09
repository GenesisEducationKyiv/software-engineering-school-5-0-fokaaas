import { Inject, Injectable } from '@nestjs/common';

import { WeatherClientDiTokens } from '../weather-client/constants/di-tokens.const';
import { CurrentWeatherData } from './data/current-weather.data';
import { WeatherServiceInterface } from './interfaces/weather-service.interface';
import type { GetWeatherInterface } from '../weather-client/interfaces/get-weather.interface';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(
    @Inject(WeatherClientDiTokens.WEATHER_CLIENT_SERVICE)
    private readonly weatherClient: GetWeatherInterface
  ) {}

  async getWeather(city: string): Promise<CurrentWeatherData> {
    const { current } = await this.weatherClient.get({ city });
    return {
      temperature: current.temperature,
      humidity: current.humidity,
      description: current.description,
    };
  }
}
