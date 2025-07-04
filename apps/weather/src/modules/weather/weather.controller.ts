import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetWeatherRequest,
  GetWeatherResponse,
  IWeatherController,
} from '@types';
import { WeatherDto } from './dto/weather.dto';
import { ExistsDto } from './dto/exists.dto';
import { WeatherDiTokens } from './constants/di-tokens.const';
import { Inject } from '@nestjs/common';

export interface IWeatherService {
  cityExists(city: string): Promise<ExistsDto>;
  get(city: string): Promise<WeatherDto>;
}

@GrpcService()
export class WeatherController implements IWeatherController {
  constructor(
    @Inject(WeatherDiTokens.WEATHER_SERVICE)
    private readonly service: IWeatherService
  ) {}

  @GrpcMethod('WeatherService', 'CityExists')
  cityExists(request: CityExistsRequest): Promise<CityExistsResponse> {
    return this.service.cityExists(request.city);
  }

  @GrpcMethod('WeatherService', 'Get')
  get(request: GetWeatherRequest): Promise<GetWeatherResponse> {
    return this.service.get(request.city);
  }
}
