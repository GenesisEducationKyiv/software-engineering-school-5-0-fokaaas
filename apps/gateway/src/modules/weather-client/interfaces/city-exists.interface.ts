import { CityExistsRequest, CityExistsResponse } from '@types';

export interface WeatherCityExistsInterface {
  cityExists(request: CityExistsRequest): Promise<CityExistsResponse>;
}
