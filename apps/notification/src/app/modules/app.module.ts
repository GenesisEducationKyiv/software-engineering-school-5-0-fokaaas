import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import configuration from '../common/config/configuration';
import { validationSchema } from '../common/config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', `.env.${process.env.NODE_ENV}`),
      load: [configuration],
      validationSchema,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
