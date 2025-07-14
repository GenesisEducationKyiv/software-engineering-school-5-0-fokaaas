import { WeatherData } from '../data/weather.data';

type Condition = {
  icon: string;
  text: string;
};

type ForecastDay = {
  date: string;
  day: {
    avgtemp_c: number;
    avghumidity: number;
    condition: Condition;
  };
};

export type WeatherApiResponse = {
  current: {
    last_updated: string;
    temp_c: number;
    humidity: number;
    condition: Condition;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
};

export interface WeatherApiMapperInterface {
  mapWeatherApiResponseToWeatherData(response: WeatherApiResponse): WeatherData;
}
