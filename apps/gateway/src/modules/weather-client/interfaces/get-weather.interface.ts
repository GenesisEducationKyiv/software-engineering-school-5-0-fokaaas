import {
  GetWeatherRequest,
  GetWeatherResponse,
} from '@shared-types/grpc/weather';

export interface GetWeatherInterface {
  get(request: GetWeatherRequest): Promise<GetWeatherResponse>;
}
