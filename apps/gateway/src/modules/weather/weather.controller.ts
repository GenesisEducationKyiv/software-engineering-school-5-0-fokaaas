import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WeatherQuery } from './query/weather.query';
import { CurrentWeatherDto } from './dto/current-weather.dto';
import { WeatherDiTokens } from './constants/di-tokens.const';

export interface IWeatherService {
  getWeather(city: string): Promise<CurrentWeatherDto>;
}

@Controller()
export class WeatherController {
  constructor(
    @Inject(WeatherDiTokens.WEATHER_SERVICE)
    private weatherService: IWeatherService
  ) {}

  @Get('/weather')
  getWeather(@Query() query: WeatherQuery) {
    return this.weatherService.getWeather(query.city);
  }
}
