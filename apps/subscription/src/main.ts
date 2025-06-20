import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get<ConfigService>(ConfigService);

  const port = configService.get<number>('port');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'subscription',
        protoPath: 'libs/proto/subscription.proto',
        url: `0.0.0.0:${port}`,
      },
    }
  );

  const filter = appContext.get('GRPC_EXCEPTION_FILTER');
  app.useGlobalFilters(filter);

  await app.listen();
  Logger.log(
    `🔔 Subscription microservice is running on: http://127.0.0.1:${port}`
  );
}

bootstrap();
