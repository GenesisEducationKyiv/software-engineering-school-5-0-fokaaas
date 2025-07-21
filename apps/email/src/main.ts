import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RmqConfig } from '@shared-types/rmq/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.startAllMicroservices();

  Logger.log(`📧 Email microservice is running on: http://127.0.0.1:${port}`);
}

void bootstrap();
