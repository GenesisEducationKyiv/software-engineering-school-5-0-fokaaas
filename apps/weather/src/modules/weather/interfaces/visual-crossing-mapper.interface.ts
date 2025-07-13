import { WeatherData } from '../data/weather.data';

type Conditions = {
  datetime: string;
  temp: number;
  humidity: number;
  conditions: string;
  icon: string;
};

export type VisualCrossingResponse = {
  days: Conditions[];
  currentConditions: Conditions;
};

export interface VisualCrossingMapperInterface {
  mapVisualCrossingResponseToWeatherData(
    response: VisualCrossingResponse,
    iconUrl: string
  ): WeatherData;
}
