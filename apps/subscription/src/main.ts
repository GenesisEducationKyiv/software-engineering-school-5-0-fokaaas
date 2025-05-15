import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'weather',
      protoPath: 'libs/proto/src/weather.proto',
      url: 'localhost:3000',
    },
  });
  const port = process.env.PORT || 3000;
  await app.listen();
  Logger.log(
    `🚀 Weather microservice is running on: http://localhost:${port}`,
  );
}

bootstrap();
