import { GetWeatherRequest, GetWeatherResponse } from '@types';

export interface WeatherClientInterface {
  get(request: GetWeatherRequest): Promise<GetWeatherResponse>;
}
