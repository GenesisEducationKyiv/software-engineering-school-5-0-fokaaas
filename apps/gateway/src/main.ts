import './common/utils/setup-telemetry';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import setupApp from './common/utils/setup-app';
import { TelemetryLogger } from '@shared/modules/telemetry/telemetry.logger';

async function bootstrap() {
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
