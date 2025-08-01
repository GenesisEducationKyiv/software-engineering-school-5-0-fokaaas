import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import setupApp from './common/utils/setup-app';
import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { version } from '../package.json';

async function bootstrap() {
  initTelemetry({
    serviceName: 'email',
    serviceVersion: version,
  });

  const app = await NestFactory.create(AppModule);
  const port = setupApp(app);

  await app.startAllMicroservices();

  Logger.log({ msg: 'Application started', port });
}

void bootstrap();
