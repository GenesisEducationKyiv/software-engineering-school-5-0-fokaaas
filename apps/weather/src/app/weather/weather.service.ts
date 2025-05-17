import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CityExistsRequest, CityExistsResponse, GetRequest, GetResponse,
  IWeatherService, WeatherApiResponse
} from '@weather-api/interfaces';

@Injectable()
export class WeatherService implements IWeatherService {

  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('weatherApi.url');
    const key = this.config.get<string>('weatherApi.key');
    this.baseUrl = `${url}/forecast.json?key=${key}`;
  }

  async cityExists(request: CityExistsRequest): Promise<CityExistsResponse> {
    return fetch(`${this.baseUrl}&days=7&q=${request.city}`)
      .then(res => res.ok)
      .then(exists => ({ exists }))
  }

  async get(request: GetRequest): Promise<GetResponse | null> {
    const weather = await fetch(`${this.baseUrl}&days=7&q=${request.city}`);
    if (!weather.ok) return null;
    const data = await weather.json() as WeatherApiResponse;
    return {
      current: {
        date: data.current.last_updated,
        temperature: data.current.temp_c.toFixed(1),
        humidity: data.current.humidity.toString(),
        icon: data.current.condition.icon.slice(2),
        description: data.current.condition.text,
      },
      forecast: data.forecast.forecastday.map(day => ({
        date: day.date,
        temperature: day.day.avgtemp_c.toFixed(1),
        humidity: day.day.avghumidity.toString(),
        icon: day.day.condition.icon.slice(2),
        description: day.day.condition.text,
      })),
    }
  }
}
