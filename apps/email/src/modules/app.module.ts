import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../common/config/configuration';
import { EmailModule } from './email/email.module';
import { UtilsModule } from '@utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    EmailModule,
    UtilsModule,
  ],
})
export class AppModule {}
