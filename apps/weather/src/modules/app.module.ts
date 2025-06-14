import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../common/config/configuration';
import { WeatherModule } from './weather/weather.module';
import { UtilsModule } from '@utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    WeatherModule,
    UtilsModule,
  ],
})
export class AppModule {}
