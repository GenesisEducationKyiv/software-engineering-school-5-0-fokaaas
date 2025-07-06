import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetWeatherRequest,
  GetWeatherResponse,
  IWeatherController,
} from '@types';
import { WeatherService } from './weather.service';

@GrpcService()
export class WeatherController implements IWeatherController {
  constructor(private readonly service: WeatherService) {}

  @GrpcMethod('WeatherService', 'CityExists')
  cityExists(request: CityExistsRequest): Promise<CityExistsResponse> {
    return this.service.cityExists(request);
  }

  @GrpcMethod('WeatherService', 'Get')
  get(request: GetWeatherRequest): Promise<GetWeatherResponse> {
    return this.service.get(request);
  }
}
