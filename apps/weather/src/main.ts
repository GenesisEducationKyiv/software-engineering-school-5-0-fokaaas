import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { existsSync, mkdirSync } from 'fs';
import configuration from './common/config/configuration';
import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';

async function bootstrap() {
  initTelemetry({
    serviceName: 'weather',
    serviceVersion: '1.0.0',
  });

  const { port } = configuration();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'weather',
        protoPath: 'libs/proto/weather.proto',
        url: `0.0.0.0:${port}`,
      },
    }
  );

  const filter = app.get('GRPC_EXCEPTION_FILTER');
  app.useGlobalFilters(filter);

  const logDir = 'logs';
  if (!existsSync(logDir)) {
    mkdirSync(logDir);
  }

  await app.listen();

  Logger.log(`🌧️ Weather microservice is running on: http://127.0.0.1:${port}`);
}

void bootstrap();
