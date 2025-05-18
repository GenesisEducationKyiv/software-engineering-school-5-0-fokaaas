import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SubscriptionClientService } from './subscription-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SUBSCRIPTION_PACKAGE',
        useFactory: (config: ConfigService) => {
          const host = config.get<string>('subscription.host');
          const port = config.get<number>('subscription.port');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: 'subscription',
              protoPath: 'libs/proto/subscription.proto',
            },
          }
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [SubscriptionClientService],
  exports: [SubscriptionClientService],
})
export class SubscriptionClientModule {}
