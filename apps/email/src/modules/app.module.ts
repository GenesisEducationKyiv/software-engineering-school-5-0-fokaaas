import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../common/config/configuration';
import { EmailModule } from './email/email.module';
import { UtilsModule } from '@utils';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', `.${process.env.NODE_ENV}.env`),
      load: [configuration],
      isGlobal: true,
    }),
    EmailModule,
    UtilsModule,
  ],
})
export class AppModule {}
