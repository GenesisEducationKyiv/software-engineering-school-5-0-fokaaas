import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { ConfigService } from '@nestjs/config';
import { WeatherApiProvider } from './providers/weather-api.provider';
import { VisualCrossingProvider } from './providers/visual-crossing.provider';
import { IWeatherProvider, WeatherService } from './weather.service';
import { Tokens } from './constants/tokens.const';

export type WeatherApiConfigs = {
  url: string;
  key: string;
};

export type VisualCrossingConfigs = WeatherApiConfigs & {
  iconUrl: string;
};

@Module({
  controllers: [WeatherController],
  providers: [
    {
      provide: Tokens.WEATHER_API_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const { url, key } = configService.get<WeatherApiConfigs>(
          'weatherApi'
        ) as WeatherApiConfigs;
        return new WeatherApiProvider(url, key);
      },
      inject: [ConfigService],
    },
    {
      provide: Tokens.VISUAL_CROSSING_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const { url, key, iconUrl } = configService.get<WeatherApiConfigs>(
          'visualCrossing'
        ) as VisualCrossingConfigs;
        return new VisualCrossingProvider(url, key, iconUrl);
      },
      inject: [ConfigService],
    },
    {
      provide: WeatherService,
      useFactory: (
        weatherApiProvider: IWeatherProvider,
        visualCrossingProvider: IWeatherProvider
      ) => {
        weatherApiProvider.setNext(visualCrossingProvider);
        return new WeatherService(weatherApiProvider);
      },
      inject: [Tokens.WEATHER_API_PROVIDER, Tokens.VISUAL_CROSSING_PROVIDER],
    },
  ],
})
export class WeatherModule {}
