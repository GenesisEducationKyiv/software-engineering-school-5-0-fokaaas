import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubscriptionDiTokens } from './constants/di-tokens.const';
import { ConfigService } from '@nestjs/config';
import { GrpcConfig } from '@types';
import { SubscriptionClient } from './subscription.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SubscriptionDiTokens.SUBSCRIPTION_PACKAGE,
        useFactory: (config: ConfigService) => {
          const { host, port } = config.getOrThrow<GrpcConfig>('subscription');
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
      provide: SubscriptionDiTokens.SUBSCRIPTION_CLIENT,
      useClass: SubscriptionClient,
    },
  ],
  exports: [SubscriptionDiTokens.SUBSCRIPTION_CLIENT],
})
export class SubscriptionModule {}
