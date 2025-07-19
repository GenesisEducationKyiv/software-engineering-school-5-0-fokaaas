import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WeatherDiTokens } from './constants/di-tokens.const';
import { ConfigService } from '@nestjs/config';
import { GrpcConfig } from '@types';
import { WeatherClient } from './weather.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WeatherDiTokens.WEATHER_PACKAGE,
        useFactory: (config: ConfigService) => {
          const { host, port } = config.getOrThrow<GrpcConfig>('weather');
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
      provide: WeatherDiTokens.WEATHER_CLIENT,
      useClass: WeatherClient,
    },
  ],
  exports: [WeatherDiTokens.WEATHER_CLIENT],
})
export class WeatherClientModule {}
