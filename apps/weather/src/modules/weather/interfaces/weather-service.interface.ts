import { ExistsData } from '../data/exists.data';
import { WeatherData } from '../data/weather.data';

export interface WeatherServiceInterface {
  cityExists(city: string): Promise<ExistsData>;
  get(city: string): Promise<WeatherData>;
}
