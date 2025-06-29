import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherApiProvider } from './providers/weather-api.provider';
import { VisualCrossingProvider } from './providers/visual-crossing.provider';
import { WeatherService } from './weather.service';

export type WeatherApiConfig = {
  url: string;
  key: string;
};

export type VisualCrossingConfig = WeatherApiConfig & {
  iconUrl: string;
};

@Injectable()
export class WeatherServiceFactory {
  constructor(private readonly configService: ConfigService) {}

  create(): WeatherService {
    const weatherApiConfig =
      this.configService.getOrThrow<WeatherApiConfig>('weatherApi');
    const visualCrossingConfig =
      this.configService.getOrThrow<VisualCrossingConfig>('visualCrossing');

    const weatherApiProvider = new WeatherApiProvider(
      weatherApiConfig.url,
      weatherApiConfig.key
    );

    const visualCrossingProvider = new VisualCrossingProvider(
      visualCrossingConfig.url,
      visualCrossingConfig.key,
      visualCrossingConfig.iconUrl
    );

    return new WeatherService([weatherApiProvider, visualCrossingProvider]);
  }
}
