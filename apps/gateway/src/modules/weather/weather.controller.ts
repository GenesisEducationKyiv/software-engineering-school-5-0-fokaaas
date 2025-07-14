import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WeatherQuery } from './query/weather.query';
import { WeatherDiTokens } from './constants/di-tokens.const';
import type { WeatherServiceInterface } from './interfaces/weather-service.interface';

@Controller()
export class WeatherController {
  constructor(
    @Inject(WeatherDiTokens.WEATHER_SERVICE)
    private weatherService: WeatherServiceInterface
  ) {}

  @Get('/weather')
  getWeather(@Query() query: WeatherQuery) {
    return this.weatherService.getWeather(query.city);
  }
}
