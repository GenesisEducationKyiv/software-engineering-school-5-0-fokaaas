import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SubscriptionClientService } from './subscription-client.service';
import { SubscriptionClientDiTokens } from './constants/di-tokens.const';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SubscriptionClientDiTokens.SUBSCRIPTION_PACKAGE,
        useFactory: (config: ConfigService) => {
          const host = config.getOrThrow<string>('subscription.host');
          const port = config.getOrThrow<number>('subscription.port');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: 'subscription',
              protoPath: 'libs/proto/subscription.proto',
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: SubscriptionClientDiTokens.SUBSCRIPTION_CLIENT_SERVICE,
      useClass: SubscriptionClientService,
    },
  ],
  exports: [SubscriptionClientDiTokens.SUBSCRIPTION_CLIENT_SERVICE],
})
export class SubscriptionClientModule {}
