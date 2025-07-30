import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import setupApp from './common/utils/setup-app';
import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { PathBasedSampler } from '@shared/modules/telemetry/samplers/path-based.sampler';

async function bootstrap() {
  initTelemetry({
    serviceName: 'gateway',
    serviceVersion: '1.0.0',
    sampler: new PathBasedSampler([{ pathPrefix: '/api/weather', ratio: 0.1 }]),
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  setupApp(app);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('port');

  await app.listen(port);

  Logger.log(`🚀 Gateway is running on: http://127.0.0.1:${port}/api`);
}

void bootstrap();
