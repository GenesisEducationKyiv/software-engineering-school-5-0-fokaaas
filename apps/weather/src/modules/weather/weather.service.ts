import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetRequest,
  GetResponse,
  IWeatherService,
  WeatherApiResponse,
} from '@types';
import { GrpcNotFoundException } from '../../common/exceptions/grpc-not-found.exception';

@Injectable()
export class WeatherService implements IWeatherService {
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('weatherApi.url');
    const key = this.config.get<string>('weatherApi.key');
    this.baseUrl = `${url}/forecast.json?key=${key}`;
  }

  async cityExists(request: CityExistsRequest): Promise<CityExistsResponse> {
    const response = await fetch(`${this.baseUrl}&days=7&q=${request.city}`);
    return { exists: response.ok };
  }

  async get(request: GetRequest): Promise<GetResponse> {
    const response = await fetch(`${this.baseUrl}&days=7&q=${request.city}`);
    if (!response.ok) {
      throw new GrpcNotFoundException('City');
    }
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
}
