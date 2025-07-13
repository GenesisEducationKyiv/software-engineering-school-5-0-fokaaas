import { GetWeatherRequest, GetWeatherResponse } from '@types';

export interface GetWeatherInterface {
  get(request: GetWeatherRequest): Promise<GetWeatherResponse>;
}
