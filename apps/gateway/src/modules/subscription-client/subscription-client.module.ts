import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SubscriptionClientService } from './subscription-client.service';
import { SubscriptionClientDiTokens } from './constants/di-tokens.const';
import { GrpcConfig } from '@shared-types/grpc/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SubscriptionClientDiTokens.SUBSCRIPTION_PACKAGE,
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
      provide: SubscriptionClientDiTokens.SUBSCRIPTION_CLIENT_SERVICE,
      useClass: SubscriptionClientService,
    },
  ],
  exports: [SubscriptionClientDiTokens.SUBSCRIPTION_CLIENT_SERVICE],
})
export class SubscriptionClientModule {}
