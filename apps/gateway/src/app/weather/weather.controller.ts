import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherQuery } from './query/weather.query';

@Controller()
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('/weather')
  getWeather(@Query() query: WeatherQuery) {
    return this.weatherService.getWeather(query);
  }
}
