import './common/utils/setup-telemetry';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import setupApp from './common/utils/setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = setupApp(app);

  await app.startAllMicroservices();

  Logger.log({ msg: 'Application started', port });
}

void bootstrap();
