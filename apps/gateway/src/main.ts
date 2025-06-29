import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import setupApp from './common/utils/setup-app';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  setupApp(app);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port') ?? 4558;

  await app.listen(port);
  Logger.log(`🚀 Gateway is running on: http://127.0.0.1:${port}/api`);
}

bootstrap();
