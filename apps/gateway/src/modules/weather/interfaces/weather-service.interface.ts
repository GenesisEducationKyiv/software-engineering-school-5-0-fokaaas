import { CurrentWeatherData } from '../data/current-weather.data';

export interface WeatherServiceInterface {
  getWeather(city: string): Promise<CurrentWeatherData>;
}
