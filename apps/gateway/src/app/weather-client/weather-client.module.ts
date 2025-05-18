import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { WeatherClientService } from './weather-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WEATHER_PACKAGE',
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
          }
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [WeatherClientService],
  exports: [WeatherClientService],
})
export class WeatherClientModule {}
