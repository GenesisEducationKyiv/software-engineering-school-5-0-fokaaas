import { WeatherData } from '../data/weather.data';

export interface WeatherProviderInterface {
  cityExists(city: string): Promise<boolean>;
  get(city: string): Promise<WeatherData>;
}
