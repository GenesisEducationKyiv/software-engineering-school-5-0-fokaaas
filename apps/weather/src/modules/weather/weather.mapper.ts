import { Injectable } from '@nestjs/common';
import {
  WeatherApiMapperInterface,
  WeatherApiResponse,
} from './interfaces/weather-api-mapper.interface';
import {
  VisualCrossingMapperInterface,
  VisualCrossingResponse,
} from './interfaces/visual-crossing-mapper.interface';
import { WeatherData } from './data/weather.data';

@Injectable()
export class WeatherMapper
  implements WeatherApiMapperInterface, VisualCrossingMapperInterface
{
  mapWeatherApiResponseToWeatherData(
    response: WeatherApiResponse
  ): WeatherData {
    const { forecastday: forecastDays } = response.forecast;

    return {
      current: {
        date: response.current.last_updated,
        temperature: response.current.temp_c.toFixed(1),
        humidity: response.current.humidity.toString(),
        icon: response.current.condition.icon.slice(2),
        description: response.current.condition.text,
      },
      forecast: forecastDays.map((day) => ({
        date: day.date,
        temperature: day.day.avgtemp_c.toFixed(1),
        humidity: day.day.avghumidity.toString(),
        icon: day.day.condition.icon.slice(2),
        description: day.day.condition.text,
      })),
    };
  }

  mapVisualCrossingResponseToWeatherData(
    response: VisualCrossingResponse,
    iconUrl: string
  ): WeatherData {
    const { days, currentConditions } = response;

    return {
      current: {
        date: currentConditions.datetime,
        temperature: currentConditions.temp.toFixed(1),
        humidity: currentConditions.humidity.toString(),
        icon: this.composeVisualCrossingIcon(iconUrl, currentConditions.icon),
        description: currentConditions.conditions,
      },
      forecast: days.map((day) => ({
        date: day.datetime,
        temperature: day.temp.toFixed(1),
        humidity: day.humidity.toString(),
        icon: this.composeVisualCrossingIcon(iconUrl, day.icon),
        description: day.conditions,
      })),
    };
  }

  private composeVisualCrossingIcon(url: string, icon: string): string {
    return `${url}/${icon}.png`;
  }
}
