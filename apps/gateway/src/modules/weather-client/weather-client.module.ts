import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { WeatherClientService } from './weather-client.service';
import { WeatherClientDiTokens } from './constants/di-tokens.const';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WeatherClientDiTokens.WEATHER_PACKAGE,
        useFactory: (config: ConfigService) => {
          const host = config.get<string>('weather.host');
          const port = config.get<number>('weather.port');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: 'weather',
              protoPath: 'libs/proto/weather.proto',
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: WeatherClientDiTokens.WEATHER_CLIENT_SERVICE,
      useClass: WeatherClientService,
    },
  ],
  exports: [WeatherClientDiTokens.WEATHER_CLIENT_SERVICE],
})
export class WeatherClientModule {}
