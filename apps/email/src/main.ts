import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import setupApp from './common/utils/setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = setupApp(app);

  await app.startAllMicroservices();

  Logger.log(`📧 Email microservice is running on: http://127.0.0.1:${port}`);
}

void bootstrap();
