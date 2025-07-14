import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EmailClientService } from './email-client.service';
import { EmailClientDiTokens } from './constants/di-tokens.const';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EmailClientDiTokens.EMAIL_PACKAGE,
        useFactory: (config: ConfigService) => {
          const host = config.get<string>('email.host');
          const port = config.get<number>('email.port');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: 'email',
              protoPath: 'libs/proto/email.proto',
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: EmailClientDiTokens.EMAIL_CLIENT_SERVICE,
      useClass: EmailClientService,
    },
  ],
  exports: [EmailClientDiTokens.EMAIL_CLIENT_SERVICE],
})
export class EmailClientModule {}
