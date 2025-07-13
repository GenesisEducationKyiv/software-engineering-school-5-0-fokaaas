import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { join } from 'path';
import { EmailDiTokens } from './constants/di-tokens.const';

@Module({
  controllers: [EmailController],
  providers: [
    {
      provide: EmailDiTokens.EMAIL_SERVICE,
      useClass: EmailService,
    },
  ],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('smtp.host'),
          secure: false,
          auth: {
            user: configService.get<string>('smtp.username'),
            pass: configService.get<string>('smtp.password'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@weathersub.com>',
        },
        template: {
          dir: join(__dirname, '..', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class EmailModule {}
