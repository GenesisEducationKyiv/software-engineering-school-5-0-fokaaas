import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';
import { ConfigService } from '@nestjs/config';
import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';

async function bootstrap() {
  initTelemetry({
    serviceName: 'notification',
    serviceVersion: '1.0.0',
    sampler: new TraceIdRatioBasedSampler(0.1),
  });

  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('port');

  await app.listen(port);

  Logger.log(
    `🔔 Notification microservice is running on: http://127.0.0.1:${port}`
  );
}

void bootstrap();
