import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../common/config/configuration';
import { SubscriptionModule } from './subscription/subscription.module';
import { UtilsModule } from '@utils';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', `.env.${process.env.NODE_ENV}`),
      load: [configuration],
      isGlobal: true,
    }),
    SubscriptionModule,
    UtilsModule,
  ],
})
export class AppModule {}
