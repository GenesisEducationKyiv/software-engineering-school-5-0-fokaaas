import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get<ConfigService>(ConfigService);

  const port = configService.get<number>('port');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'email',
        protoPath: 'libs/proto/email.proto',
        url: `0.0.0.0:${port}`,
      },
    }
  );
  await app.listen();

  const filter = appContext.get('GRPC_EXCEPTION_FILTER');
  app.useGlobalFilters(filter);

  Logger.log(`📧 Email microservice is running on: http://127.0.0.1:${port}`);
}

void bootstrap();
