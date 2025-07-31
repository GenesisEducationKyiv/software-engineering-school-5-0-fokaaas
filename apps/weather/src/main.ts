import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { existsSync, mkdirSync } from 'fs';
import configuration from './common/config/configuration';
import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { TelemetryLogger } from '@shared/modules/telemetry/telemetry.logger';
import { ConfigService } from '@nestjs/config';
import { GrpcExceptionFilter } from '@shared/common/filters/grpc-exception.filter';
import { meter } from './common/meter';

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

  app.useGlobalFilters(new GrpcExceptionFilter(meter));

  const logLevel = app.get(ConfigService).getOrThrow<string>('logLevel');

  app.useLogger(new TelemetryLogger(logLevel));

  const logDir = 'logs';
  if (!existsSync(logDir)) {
    mkdirSync(logDir);
  }

  await app.listen();

  Logger.log({ msg: 'Application started', port });
}

void bootstrap();
