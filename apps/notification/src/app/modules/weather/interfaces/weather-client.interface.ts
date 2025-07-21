import {
  GetWeatherRequest,
  GetWeatherResponse,
} from '@shared-types/grpc/weather';

export interface WeatherClientInterface {
  get(request: GetWeatherRequest): Promise<GetWeatherResponse>;
}
