import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './app/utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port') ?? 4558;

  await app.listen(port);
  Logger.log(
    `🚀 Gateway is running on: http://127.0.0.1:${port}/${globalPrefix}`
  );
}

bootstrap();
