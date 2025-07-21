import {
  CityExistsRequest,
  CityExistsResponse,
} from '@shared-types/grpc/weather';

export interface WeatherCityExistsInterface {
  cityExists(request: CityExistsRequest): Promise<CityExistsResponse>;
}
