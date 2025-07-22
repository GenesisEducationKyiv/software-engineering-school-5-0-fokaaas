import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqConfig } from '@shared-types/rmq/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export default function setupApp(app: INestApplication): number {
  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.getOrThrow<number>('port');
  const rmq = configService.getOrThrow<RmqConfig>('rmq');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rmq.host}:${rmq.port}`],
      queue: 'email_queue',
      queueOptions: { durable: false },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'email',
      protoPath: 'libs/proto/email.proto',
      url: `0.0.0.0:${port}`,
    },
  });

  const filter = app.get('GRPC_EXCEPTION_FILTER');
  app.useGlobalFilters(filter);

  return port;
}
