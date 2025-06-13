import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new GrpcExceptionFilter(),
    new GlobalExceptionFilter()
  );

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
