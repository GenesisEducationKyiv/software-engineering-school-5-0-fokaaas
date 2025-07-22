import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RmqConfig } from '@shared-types/rmq/common';
import { EmailDiTokens } from './constants/di-tokens.const';
import { EmailPublisher } from './email.publisher';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EmailDiTokens.EMAIL_SERVICE,
        useFactory: (config: ConfigService) => {
          const { host, port } = config.getOrThrow<RmqConfig>('rmq');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${host}:${port}`],
              queue: 'email_queue',
              queueOptions: { durable: false },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: EmailDiTokens.EMAIL_PUBLISHER,
      useClass: EmailPublisher,
    },
  ],
  exports: [EmailDiTokens.EMAIL_PUBLISHER],
})
export class EmailModule {}
