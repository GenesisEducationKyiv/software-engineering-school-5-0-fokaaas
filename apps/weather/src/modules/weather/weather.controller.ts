import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetWeatherRequest,
  GetWeatherResponse,
  IWeatherController,
} from '@types';
import { WeatherDiTokens } from './constants/di-tokens.const';
import { Inject } from '@nestjs/common';
import type { WeatherServiceInterface } from './interfaces/weather-service.interface';

@GrpcService()
export class WeatherController implements IWeatherController {
  constructor(
    @Inject(WeatherDiTokens.WEATHER_SERVICE)
    private readonly service: WeatherServiceInterface
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
