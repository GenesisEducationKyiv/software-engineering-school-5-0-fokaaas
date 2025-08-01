import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import setupApp from './common/utils/setup-app';
import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { PathBasedSampler } from '@shared/modules/telemetry/samplers/path-based.sampler';
import { TelemetryLogger } from '@shared/modules/telemetry/telemetry.logger';
import { version } from '../package.json';

async function bootstrap() {
  initTelemetry({
    serviceName: 'gateway',
    serviceVersion: version,
    sampler: new PathBasedSampler([{ pathPrefix: '/api/weather', ratio: 0.1 }]),
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  setupApp(app);

  const configService = app.get<ConfigService>(ConfigService);
  const logLevel = configService.getOrThrow<string>('logLevel');
  const port = configService.getOrThrow<number>('port');

  app.useLogger(new TelemetryLogger(logLevel));

  await app.listen(port);

  Logger.log({ msg: 'Application started', port });
}

void bootstrap();
