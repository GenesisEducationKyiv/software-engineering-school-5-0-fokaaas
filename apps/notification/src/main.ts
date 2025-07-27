import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.getOrThrow<number>('port');

  await app.listen(port);
  Logger.log(
    `🔔 Notification microservice is running on: http://127.0.0.1:${port}`
  );
}

void bootstrap();
