import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../common/config/configuration';
import { SubscriptionModule } from './subscription/subscription.module';
import { UtilsModule } from '@utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    SubscriptionModule,
    UtilsModule,
  ],
})
export class AppModule {}
