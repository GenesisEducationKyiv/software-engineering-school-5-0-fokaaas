import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';
import { ConfigService } from '@nestjs/config';
import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';
import { TelemetryLogger } from '@shared/modules/telemetry/telemetry.logger';

async function bootstrap() {
  initTelemetry({
    serviceName: 'notification',
    serviceVersion: '1.0.0',
    sampler: new TraceIdRatioBasedSampler(0.1),
  });

  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('port');
  const logLevel = configService.getOrThrow<string>('logLevel');

  app.useLogger(new TelemetryLogger(logLevel));

  await app.listen(port);

  Logger.log({ msg: 'Application started', port });
}

void bootstrap();
