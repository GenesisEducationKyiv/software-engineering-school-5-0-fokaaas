import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../common/config/configuration';
import { WeatherModule } from './weather/weather.module';
import { FilterModule } from '@utils';
import { join } from 'node:path';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', `.env.${process.env.NODE_ENV}`),
      load: [configuration],
      isGlobal: true,
    }),
    WeatherModule,
    FilterModule,
    MetricsModule,
  ],
})
export class AppModule {}
