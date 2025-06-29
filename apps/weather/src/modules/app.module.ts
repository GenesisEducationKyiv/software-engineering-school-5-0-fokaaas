import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../common/config/configuration';
import { WeatherModule } from './weather/weather.module';
import { UtilsModule } from '@utils';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', `.env.${process.env.NODE_ENV}`),
      load: [configuration],
      isGlobal: true,
    }),
    WeatherModule,
    UtilsModule,
  ],
})
export class AppModule {}
