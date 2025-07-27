import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EmailClientService } from './email-client.service';
import { EmailClientDiTokens } from './constants/di-tokens.const';
import { GrpcConfig } from '@shared-types/grpc/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EmailClientDiTokens.EMAIL_PACKAGE,
        useFactory: (config: ConfigService) => {
          const { host, port } = config.getOrThrow<GrpcConfig>('email');
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
